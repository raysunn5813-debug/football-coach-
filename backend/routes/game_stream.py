"""
backend/routes/game_stream.py
60Hz WebSocket match stream and event-driven simulation loop.
"""
import asyncio
import math
import random
import struct
import time
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
try:
    from sqlmodel import Session, select
    from backend.database import get_session
    from backend.models.database_models import PlayerModel, TeamModel
except ImportError:
    Session = None
    select = None
    get_session = lambda: None
    PlayerModel = None
    TeamModel = None
from backend.routes.playbook import PLAY_DATABASE
from backend.engine.utils import get_prop, set_prop, get_pos, set_pos
from backend.engine.physics import update_player_along_route, resolve_collisions, step_physics
from backend.engine.quarterback import process_qb_logic
from backend.engine.fsm import update_player_fsm, align_players_pre_snap, update_defender_targets
from backend.engine.telemetry_recorder import GameTelemetryRecorder

router = APIRouter()

STATE_MAP = {
    "PRE_SNAP": 0, "RUNNING_ROUTE": 1, "ENGAGED": 2, "ZONE_DROP": 3,
    "DROPBACK": 4, "SCRAMBLE_OUT": 5, "THROWING": 6, "BALL_PURSUIT": 7,
    "TACKLED": 8, "FREE": 9, "BALL_CARRIER": 10, "TACKLE_SUCCESS": 11,
    "BALL_RELEASED": 12
}

DEF_ROLE_TOKENS = ["DE", "DT", "LB", "CB", "FS", "SS", "MLB", "WLB", "SLB", "NT"]

import json
import os

def _load_team_idea_attributes(team_code: str):
    """Loads granular player attributes from idea/{team_code}.json if available."""
    idea_dir = os.path.join("C:\\football coach", "idea")
    target_path = os.path.join(idea_dir, f"{team_code.lower()}.json")
    if not os.path.exists(target_path):
        target_path = os.path.join(idea_dir, "saints.json")
    if os.path.exists(target_path):
        try:
            with open(target_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return None


def pack_telemetry_frame(tick, play_state, players, ball, match_state):
    """
    Tightly-Packed Binary Stream Encoder with 16-Byte HUD Header + 12-Byte Ball + 20-Byte Players.
    """
    buffer = bytearray()

    gc = float(match_state.game_clock) if match_state and hasattr(match_state, "game_clock") else 900.0
    pc = float(match_state.play_clock) if match_state and hasattr(match_state, "play_clock") else 25.0
    los = round(float(match_state.los), 1) if match_state and hasattr(match_state, "los") else 25.0
    down = int(match_state.down) if match_state and hasattr(match_state, "down") else 1
    dist = int(round(match_state.distance)) if match_state and hasattr(match_state, "distance") else 10

    # 1. 16-Byte Header: <fffBBH
    buffer.extend(struct.pack("<fffBBH", gc, pc, los, down, dist, 0))

    # 2. 12-Byte Ball: <fff
    bx = float(ball.get("x", 25.0)) if isinstance(ball, dict) else 25.0
    by = float(ball.get("y", 0.8)) if isinstance(ball, dict) else 0.8
    bz = float(ball.get("z", 26.65)) if isinstance(ball, dict) else 26.65
    buffer.extend(struct.pack("<fff", bx, by, bz))

    # 3. 20-Byte per player: <HffffBB
    if players:
        for idx, p in enumerate(players[:22]):
            p_id = idx + 1
            x, y, z = get_pos(p)
            yaw = float(get_prop(p, "rotY", get_prop(p, "yaw", 0.0)))
            state_str = str(get_prop(p, "state", "PRE_SNAP"))
            state_code = STATE_MAP.get(state_str, 0)

            buffer.extend(struct.pack("<HffffBB", p_id, float(x), float(y), float(z), float(yaw), state_code, 0))

    return bytes(buffer)


class MatchState:
    def __init__(self):
        self.down, self.distance, self.los = 1, 10, 25.0
        self.play_clock, self.game_clock = 25.0, 900.0
        self.play_active, self.play_timer = False, 0.0
        self.tick_counter = 0
        self.snap_los = self.los  # los at the moment of the last snap, for yards-gained math
        self.offense_score, self.defense_score = 0, 0
        self.user_possession = "OFFENSE"
        self.blitz_this_play = False
        self.pa_freeze_until = 0.0

    def reset_pre_snap(self):
        self.play_active, self.play_timer, self.play_clock = False, 0.0, 25.0
        self.blitz_this_play = False
        self.pa_freeze_until = 0.0

    def apply_delay_of_game(self):
        self.los -= 5.0
        self.distance += 5.0
        self.reset_pre_snap()

    def reset_drive(self, new_los=25.0):
        self.down, self.distance, self.los = 1, 10, max(1.0, min(new_los, 99.0))
        self.reset_pre_snap()


CATCH_RADIUS = 1.3   # yd -- ball must be within this of a player (at catchable height) to be caught/picked off
TACKLE_RADIUS = 1.0  # yd -- opposing player must be this close to the ball carrier to end the play
CATCH_HEIGHT = 2.2   # yd -- ball must have descended below this before a catch/INT can be attempted


def _resolve_catch_or_interception(ball, live_players):
    """
    Matchup-delta catch & interception resolution.
    Compares receiver catching/overall ratings vs defender coverage/overall ratings
    to determine contested catch, interception, or pass deflection.
    """
    if ball["state"] != "IN_FLIGHT" or ball["y"] > CATCH_HEIGHT:
        return None

    near_offense = []
    near_defense = []

    for p in live_players:
        if p.get("state") in ("TACKLED", "TACKLE_SUCCESS"):
            continue
        dist = math.hypot(p["x"] - ball["x"], p["z"] - ball["z"])
        if dist <= CATCH_RADIUS:
            if p.get("is_defense"):
                near_defense.append((dist, p))
            else:
                near_offense.append((dist, p))

    if not near_offense and not near_defense:
        return None

    near_offense.sort(key=lambda t: t[0])
    near_defense.sort(key=lambda t: t[0])

    receiver = near_offense[0][1] if near_offense else None
    defender = near_defense[0][1] if near_defense else None

    # 1. Uncontested receiver catch
    if receiver and not defender:
        rec_catch_rating = receiver.get("catch_attr", receiver.get("overall_attr", 80))
        catch_chance = min(0.98, max(0.65, 0.75 + (rec_catch_rating - 75) * 0.008))
        if random.random() <= catch_chance:
            receiver["state"] = "BALL_CARRIER"
            receiver["vx"], receiver["vz"] = 0.0, 0.0
            ball["state"] = "HELD"
            ball["in_flight"] = False
            ball["was_caught"] = True
            ball["caught_by_defense"] = False
            return receiver
        else:
            ball["state"] = "INCOMPLETE"
            ball["in_flight"] = False
            return None

    # 2. Uncontested defender interception opportunity
    if defender and not receiver:
        def_rating = defender.get("awareness_attr", defender.get("overall_attr", 75))
        int_chance = min(0.85, max(0.35, 0.45 + (def_rating - 75) * 0.01))
        if random.random() <= int_chance:
            defender["state"] = "BALL_CARRIER"
            defender["vx"], defender["vz"] = 0.0, 0.0
            ball["state"] = "HELD"
            ball["in_flight"] = False
            ball["was_caught"] = True
            ball["caught_by_defense"] = True
            return defender
        else:
            ball["state"] = "INCOMPLETE"
            ball["in_flight"] = False
            return None

    # 3. Contested catch (Receiver vs Defender matchup delta)
    rec_power = receiver.get("overall_attr", 80) + (receiver.get("awareness_attr", 80) * 0.5)
    def_power = defender.get("overall_attr", 80) + (defender.get("awareness_attr", 80) * 0.5)
    matchup_delta = rec_power - def_power

    rec_win_prob = min(0.85, max(0.20, 0.50 + (matchup_delta * 0.01)))
    def_int_prob = min(0.35, (1.0 - rec_win_prob) * 0.50)

    roll = random.random()
    if roll <= rec_win_prob:
        receiver["state"] = "BALL_CARRIER"
        receiver["vx"], receiver["vz"] = 0.0, 0.0
        ball["state"] = "HELD"
        ball["in_flight"] = False
        ball["was_caught"] = True
        ball["caught_by_defense"] = False
        return receiver
    elif roll <= (rec_win_prob + def_int_prob):
        defender["state"] = "BALL_CARRIER"
        defender["vx"], defender["vz"] = 0.0, 0.0
        ball["state"] = "HELD"
        ball["in_flight"] = False
        ball["was_caught"] = True
        ball["caught_by_defense"] = True
        return defender
    else:
        ball["state"] = "INCOMPLETE"
        ball["in_flight"] = False
        return None


def _resolve_tackle(live_players, play_timer: float = 1.0):
    """Once an unblocked defensive player in BALL_PURSUIT closes within TACKLE_RADIUS of the carrier, end the play.
    Enforces minimum 1.5s play development time and ignores engaged/blocked defenders."""
    if play_timer < 1.5:
        return None

    carrier = next((p for p in live_players if p.get("state") == "BALL_CARRIER"), None)
    if not carrier:
        return None

    for p in live_players:
        if p is carrier or p.get("is_defense") == carrier.get("is_defense"):
            continue

        # Defenders fighting OL in ENGAGED state cannot tackle the carrier
        if p.get("state") in ("ENGAGED", "PRE_SNAP", "IDLE", "ZONE_DROP"):
            continue

        dist = math.hypot(p["x"] - carrier["x"], p["z"] - carrier["z"])
        if dist <= 0.8:  # Authentic physical tackle radius
            carrier["state"] = "TACKLE_SUCCESS"
            carrier["vx"], carrier["vz"] = 0.0, 0.0
            return carrier
    return None


def _track_ball_to_carrier(ball, live_players, qb):
    """While HELD, keep the ball glued to the current carrier's hands."""
    if ball["state"] != "HELD":
        ball["carrier_id"] = None
        return
    carrier_id = ball.get("carrier_id")
    carrier = None
    if carrier_id:
        carrier = next((p for p in live_players if p.get("id") == carrier_id), None)
    if not carrier:
        carrier = next((p for p in live_players if p.get("state") == "BALL_CARRIER"), qb)
    if carrier:
        ball["x"], ball["z"] = carrier["x"], carrier["z"]
        ball["y"] = 1.0
        ball["carrier_id"] = carrier["id"]


def _realign_player(p, match_state):
    """Reset one player to a legal pre-snap stance: FSM state, momentum,
    and physical alignment. align_players_pre_snap (fsm.py) is responsible
    for positioning; state/velocity are cleared here explicitly so a stale
    TACKLE_SUCCESS / BALL_CARRIER state (or leftover momentum) can't survive
    into the next play regardless of what that helper does internally."""
    p["state"] = "PRE_SNAP"
    p["vx"], p["vy"], p["vz"] = 0.0, 0.0, 0.0
    lateral_offset = p.get("start_z", 26.65) - 26.65
    align_players_pre_snap(p, match_state.los, lateral_offset)


@router.websocket("/ws/match/{team_code}")
async def match_stream(websocket: WebSocket, team_code: str, session=Depends(get_session) if get_session else None):
    await websocket.accept()

    players = []
    if session and select and TeamModel and PlayerModel:
        try:
            statement = select(TeamModel).where(TeamModel.team_code == team_code.upper())
            team = session.exec(statement).first()
            if team:
                players = session.exec(select(PlayerModel).where(PlayerModel.team_id == team.id)).all()
        except Exception as e:
            print(f"DB load info: {e}")

    match_state = MatchState()
    live_players = []
    ball = {"x": match_state.los, "y": 0.8, "z": 26.65, "vx": 0.0, "vy": 0.0, "vz": 0.0, "state": "HELD", "in_flight": False}

    for i, p in enumerate(players):
        is_def = any(tok in p.position for tok in DEF_ROLE_TOKENS)
        start_z = 26.65 + (i - (len(players) / 2)) * 2.5
        start_x = match_state.los + (5.0 if is_def else 0.0)
        live_players.append({
            "id": p.player_id_str, "role": p.position, "is_defense": is_def,
            "speed_attr": p.speed, "awareness_attr": p.awareness, "overall_attr": p.overall,
            "state": "PRE_SNAP", "block_timer": 0, "x": start_x, "z": start_z, "y": 0.0,
            "start_x": start_x, "start_z": start_z, "rotY": 0.0,
            "vx": 0.0, "vy": 0.0, "vz": 0.0, "stamina": 100.0,
            "route_waypoints": [], "target_id": None
        })

    if not live_players:
        # Role names must match shared/playbook.json's alignment keys
        # (OL via LT/LG/C/RG/RT, then QB/HB/FB/X/Y/Z) so PRE_SNAP alignment
        # lookups resolve directly instead of falling through unmatched.
        OFF_ROLES = ["LT", "LG", "C", "RG", "RT", "QB", "HB", "FB", "X", "Y", "Z"]
        DEF_ROLES = ["DT1", "DT2", "DE1", "DE2", "MLB", "WLB", "SLB", "CB1", "CB2", "FS", "SS"]
        for idx, role in enumerate(OFF_ROLES):
            live_players.append({
                "id": f"OFF_{role}", "role": role, "is_defense": False,
                "speed_attr": 80, "awareness_attr": 80, "overall_attr": 80,
                "state": "PRE_SNAP", "block_timer": 0, "x": match_state.los, "z": 26.65 + (idx - 5)*2.5, "y": 0.0,
                "start_x": match_state.los, "start_z": 26.65 + (idx - 5)*2.5, "rotY": 0.0,
                "vx": 0.0, "vy": 0.0, "vz": 0.0, "stamina": 100.0, "route_waypoints": []
            })
        for idx, role in enumerate(DEF_ROLES):
            live_players.append({
                "id": f"DEF_{role}", "role": role, "is_defense": True,
                "speed_attr": 80, "awareness_attr": 80, "overall_attr": 80,
                "state": "PRE_SNAP", "block_timer": 0, "x": match_state.los + 5.0, "z": 26.65 + (idx - 5)*2.5, "y": 0.0,
                "start_x": match_state.los + 5.0, "start_z": 26.65 + (idx - 5)*2.5, "rotY": 0.0,
                "vx": 0.0, "vy": 0.0, "vz": 0.0, "stamina": 100.0, "route_waypoints": []
            })

    # Attach granular idea JSON attributes (short, medium, long, pa, run)
    idea_spec = _load_team_idea_attributes(team_code)
    if idea_spec:
        qb_spec = idea_spec.get("QB", {})
        rb_spec = idea_spec.get("RB", {})
        recs_spec = idea_spec.get("Receivers", [])

        for p in live_players:
            role = p.get("role", "")
            if "QB" in role:
                p["short"] = qb_spec.get("short", 75)
                p["medium"] = qb_spec.get("medium", 70)
                p["long"] = qb_spec.get("long", 70)
                p["pa"] = qb_spec.get("pa", 75)
                p["run"] = qb_spec.get("run", 50)
                if "name" in qb_spec:
                    p["name"] = qb_spec["name"]
            elif "RB" in role or "HB" in role or "FB" in role:
                if "ovr" in rb_spec:
                    p["overall_attr"] = rb_spec["ovr"]
            else:
                rec_match = next((r for r in recs_spec if r.get("position") in (role, "WR1" if role in ("X", "WR1") else ("WR2" if role in ("Z", "WR2") else ("SLOT" if role in ("Y", "WR3", "SLOT") else role)))), None)
                if rec_match:
                    p["overall_attr"] = rec_match.get("ovr", p.get("overall_attr", 80))
                    if "name" in rec_match:
                        p["name"] = rec_match["name"]

    qb_entry = next((p for p in live_players if "QB" in p["role"]), None)
    if qb_entry:
        for p in live_players:
            if p["is_defense"]:
                p["target_id"] = qb_entry["id"]

    for p in live_players:
        lateral_offset = p.get("start_z", 26.65) - 26.65
        align_players_pre_snap(p, match_state.los, lateral_offset)

    manifest = {
        "type": "ROSTER_MANIFEST",
        "players": [{ "id": idx + 1, "role": p["role"], "team": "def" if p["is_defense"] else "off", "str_id": p["id"] } for idx, p in enumerate(live_players[:22])]
    }
    await websocket.send_json(manifest)

    cmd_queue = asyncio.Queue()

    async def socket_listener():
        try:
            while True:
                msg = await websocket.receive_json()
                await cmd_queue.put(msg)
        except WebSocketDisconnect:
            pass
        except Exception as exc:
            # Don't let a malformed client message or transport hiccup
            # vanish silently -- surface it, but still let the main loop's
            # own send/receive calls be the ones that decide to shut down.
            print(f"socket_listener error: {exc!r}")

    listener_task = asyncio.create_task(socket_listener())
    last_time = time.time()

    try:
        while True:
            current_time = time.time()
            delta_time = max(current_time - last_time, 0.001)
            last_time = current_time
            match_state.tick_counter += 1

            while not cmd_queue.empty():
                data = await cmd_queue.get()
                print(f"🎮 [DEBUG] Received command: {data}")  # Debug logging
                cmd = data.get("command") or data.get("action")

                if cmd == "PRE_SNAP":
                    play_id = data.get("play_id")
                    print(f"🏈 [DEBUG] PRE_SNAP triggered for play_id: {play_id}")
                    print(f"📚 [DEBUG] PLAY_DATABASE has {len(PLAY_DATABASE)} plays loaded")
                    match_state.play_active = False
                    match_state.play_timer = 0.0
                    play_data = next((p for p in PLAY_DATABASE if str(p["id"]) == str(play_id) or p.get("num_id") == play_id or p.get("play_name") == play_id or str(p.get("key")) == str(play_id)), None)
                    match_state.current_play = play_data
                    if play_data:
                        print(f"✅ [DEBUG] Play found: {play_data.get('play_name', 'Unknown')}")
                        for p in live_players:
                            if not p["is_defense"]:
                                role = p["role"]
                                coords = None
                                if role in play_data["alignments"]:
                                    coords = play_data["alignments"][role]
                                elif "OL" in play_data["alignments"] and role in ["LT", "LG", "C", "RG", "RT", "BSG", "BST", "OG1", "OG2", "OT1", "OT2"]:
                                    ol_alignments = play_data["alignments"]["OL"]
                                    ol_map = {"LT": 0, "LG": 1, "C": 2, "RG": 3, "RT": 4, "OT1": 0, "OG1": 1, "OG2": 3, "OT2": 4, "BST": 0, "BSG": 1}
                                    idx = ol_map.get(role, 2)
                                    if idx < len(ol_alignments):
                                        coords = ol_alignments[idx]

                                if coords and isinstance(coords, (list, tuple)) and len(coords) >= 2:
                                    p["z"], p["start_z"] = 26.65 + coords[0], 26.65 + coords[0]
                                    p["x"], p["start_x"] = match_state.los + coords[1], match_state.los + coords[1]

                                role_aliases = [role]
                                if role in ["WR1", "X"]:
                                    role_aliases.extend(["WR1", "X", "WR"])
                                elif role in ["WR2", "Z"]:
                                    role_aliases.extend(["WR2", "Z", "WR"])
                                elif role in ["SLOT", "Y", "WR3"]:
                                    role_aliases.extend(["SLOT", "Y", "WR3", "WR"])
                                elif role in ["TE", "H", "F"]:
                                    role_aliases.extend(["TE", "H", "F"])
                                elif role in ["HB", "RB", "FB"]:
                                    role_aliases.extend(["HB", "RB", "FB"])

                                route_data = next((r for r in play_data["routes"] if r["player"] in role_aliases), None)
                                p["route_waypoints"] = [{"x": match_state.los + wp[1], "z": 26.65 + wp[0]} for wp in route_data["waypoints"]] if route_data else []
                    else:
                        print(f"❌ [DEBUG] Play NOT FOUND for play_id: {play_id}")
                        print(f"🔍 [DEBUG] Available play IDs: {[p.get('id') for p in PLAY_DATABASE[:5]]}")  # Show first 5

                    for p in live_players:
                        _realign_player(p, match_state)

                    await websocket.send_json({"type": "PRE_SNAP_READY"})

                elif cmd in ["HIKE", "SNAP"] and match_state.play_clock > 0:
                    match_state.play_active = True
                    match_state.play_timer = 0.0
                    match_state.snap_los = match_state.los
                    ball["was_caught"], ball["caught_by_defense"] = False, False

                    play_name_str = str(data.get("play_name", "")).upper()
                    play_data = getattr(match_state, "current_play", None)
                    if not play_data:
                        play_data = next((p for p in PLAY_DATABASE if str(p.get("id")) == play_name_str or str(p.get("key")) == play_name_str or str(p.get("num_id")) == play_name_str or p.get("play_name") == play_name_str or p.get("name") == play_name_str), None)

                    # Play action & Blitz detection (using QB pa rating)
                    if "PA" in play_name_str or "ACTION" in play_name_str:
                        qb_p = next((p for p in live_players if "QB" in p["role"]), None)
                        qb_pa = float(qb_p.get("pa", 75)) if qb_p else 75.0
                        match_state.pa_freeze_until = 0.5 + (qb_pa / 100.0) * 1.0
                    else:
                        match_state.pa_freeze_until = 0.0

                    if "BLITZ" in play_name_str or random.random() < 0.25:
                        match_state.blitz_this_play = True
                    else:
                        match_state.blitz_this_play = False

                    # Run play handoff logic — authoritative schema check first
                    is_run_play = False
                    if play_data:
                        is_run_play = (play_data.get("play_type") == "RUN" or play_data.get("category") == "RUN" or play_data.get("card_category") == "RUN")
                    if not is_run_play:
                        is_run_play = any(tok in play_name_str for tok in ["RUN", "DIVE", "SWEEP", "PITCH", "COUNTER", "ZONE", "POWER", "ISO", "TRUCK", "BLUNT", "DRAW", "OPTION", "WEDGE", "LEAD", "TRAP"])

                    match_state.is_run_play = is_run_play

                    # Instantiate Telemetry Recorder for this live play
                    p_id = str(data.get("play_name", "PLAY_01"))
                    p_name = "Play " + p_id
                    if play_data:
                        p_name = play_data.get("name") or play_data.get("play_name") or play_data.get("card_title") or f"Play_{p_id}"

                    match_state.recorder = GameTelemetryRecorder(play_id=p_id, play_name=p_name, play_type="RUN" if is_run_play else "PASS")
                    match_state.recorder.log_event(match_state.tick_counter, "SNAP", {"play_name": p_name, "is_run": is_run_play})

                    # On SNAP: Ball snaps from Center to QB
                    qb = next((p for p in live_players if "QB" in p["role"]), None)
                    if qb:
                        ball["state"] = "HELD"
                        ball["carrier_id"] = qb["id"]
                        ball["x"], ball["z"] = qb["x"], qb["z"]
                        qb["state"] = "HANDOFF_PRESENT" if is_run_play else "DROPBACK"

                    match_state.handoff_pending = is_run_play

                    for p in live_players:
                        update_player_fsm(p, 0.0, hike_triggered=True, blitz_detected=match_state.blitz_this_play, is_run_play=is_run_play)

            if not match_state.play_active:
                match_state.play_clock -= delta_time
                if match_state.play_clock <= 0:
                    match_state.apply_delay_of_game()
                    for p in live_players:
                        new_x = match_state.los + (5.0 if p["is_defense"] else 0.0)
                        p["x"], p["start_x"] = new_x, new_x
            else:
                match_state.play_timer += delta_time
                match_state.game_clock -= delta_time

                qb = next((p for p in live_players if "QB" in p["role"]), None)
                hb = next((p for p in live_players if p.get("role") in ["HB", "RB", "FB"]), None)

                # Execute Handoff Mesh Point at 0.7s on RUN plays
                if getattr(match_state, "handoff_pending", False) and match_state.play_timer >= 0.7:
                    if hb:
                        hb["state"] = "BALL_CARRIER"
                        ball["carrier_id"] = hb["id"]
                        ball["x"], ball["z"] = hb["x"], hb["z"]
                        if qb:
                            qb["state"] = "BALL_RELEASED"
                        match_state.handoff_pending = False
                        if getattr(match_state, "recorder", None):
                            match_state.recorder.log_event(match_state.tick_counter, "HANDOFF", {"carrier": hb["id"]})

                receivers = [p for p in live_players if p["role"] in ["WR", "TE", "WR1", "WR2", "WR3", "Z", "X", "Y", "H", "F"]]
                defenders = [p for p in live_players if p["is_defense"]]

                # 0. Ball Tracking (HELD ball follows the current carrier's hands)
                _track_ball_to_carrier(ball, live_players, qb)

                # Record 60Hz telemetry tick & check for live wire-up disconnections
                recorder = getattr(match_state, "recorder", None)
                if recorder:
                    prev_anom = len(recorder.anomalies)
                    recorder.record_tick(match_state.tick_counter, live_players, ball)
                    if len(recorder.anomalies) > prev_anom:
                        latest_warning = recorder.anomalies[-1]
                        await websocket.send_json({
                            "type": "TELEMETRY_DIAGNOSTICS",
                            "warning": latest_warning
                        })

                # 1. Executive QB Logic & Ballistics with Accuracy Zone Scatter
                if qb and ball["state"] == "HELD":
                    target_rec = process_qb_logic(qb, receivers, defenders, match_state.play_timer, match_state.los)
                    if target_rec and qb.get("state") == "THROWING":
                        tx = target_rec.get("x", 0.0)
                        tz = target_rec.get("z", 0.0)

                        dx = tx - qb.get("x", 0.0)
                        dz = tz - qb.get("z", 0.0)
                        dist = math.hypot(dx, dz)

                        # Granular Passing Accuracy Scatter (short <12y, medium 12-22y, long >22y)
                        short_acc = qb.get("short", qb.get("short_attr", 75))
                        med_acc = qb.get("medium", qb.get("medium_attr", 70))
                        long_acc = qb.get("long", qb.get("long_attr", 70))

                        if dist < 12.0:
                            zone_acc = short_acc
                            max_scatter = max(0.0, (85.0 - zone_acc) * 0.03)
                        elif dist <= 22.0:
                            zone_acc = med_acc
                            max_scatter = max(0.1, (85.0 - zone_acc) * 0.05)
                        else:
                            zone_acc = long_acc
                            max_scatter = max(0.4, (85.0 - zone_acc) * 0.08)

                        if qb.get("state") == "SCRAMBLE_OUT":
                            max_scatter += 0.8

                        target_x_final = tx + random.uniform(-max_scatter, max_scatter)
                        target_z_final = tz + random.uniform(-max_scatter, max_scatter)

                        final_dx = target_x_final - qb.get("x", 0.0)
                        final_dz = target_z_final - qb.get("z", 0.0)
                        final_dist = math.hypot(final_dx, final_dz)

                        flight_time = max(0.2, final_dist / 22.0)

                        ball["vx"] = final_dx / flight_time
                        ball["vz"] = final_dz / flight_time
                        ball["vy"] = (target_rec.get("y", 0.0) - ball["y"] + (0.5 * 10.724 * (flight_time**2))) / flight_time

                        ball["state"] = "IN_FLIGHT"
                        ball["in_flight"] = True
                        ball["carrier_id"] = None
                        qb["state"] = "BALL_RELEASED"
                        qb["attempts"] = qb.get("attempts", 0) + 1

                # 2. Ball Trajectory Update + Catch/Interception Resolution
                if ball["state"] == "IN_FLIGHT":
                    ball["x"] += ball["vx"] * delta_time
                    ball["z"] += ball["vz"] * delta_time
                    ball["vy"] -= 10.724 * delta_time
                    ball["y"] += ball["vy"] * delta_time

                    caught_by = _resolve_catch_or_interception(ball, live_players)
                    if caught_by is not None:
                        if caught_by.get("is_defense"):
                            caught_by["interceptions"] = caught_by.get("interceptions", 0) + 1
                            if qb:
                                qb["int"] = qb.get("int", 0) + 1
                        else:
                            caught_by["receptions"] = caught_by.get("receptions", 0) + 1
                            if qb:
                                qb["completions"] = qb.get("completions", 0) + 1

                # 3. FSM & Movement Updates
                update_defender_targets(live_players, ball, match_state)
                for p in live_players:
                    update_player_fsm(p, match_state.play_timer, hike_triggered=match_state.play_active)
                    if p["state"] in ["FREE", "RUNNING_ROUTE", "ZONE_DROP", "BALL_PURSUIT", "ENGAGED", "BALL_CARRIER", "DROPBACK", "POCKET", "SCRAMBLE_OUT", "HANDOFF_PRESENT"]:
                        update_player_along_route(p)

                # 4. Momentum Physics & Collision Resolution
                step_physics(live_players, ball=ball, dt=delta_time)
                resolve_collisions(live_players)
                _resolve_tackle(live_players, match_state.play_timer)

                # 5. Play Termination & Drive-State Resolution (down/distance/score)
                carrier = next((p for p in live_players if p.get("state") in ("BALL_CARRIER", "TACKLE_SUCCESS")), None)
                tackled = any(p.get("state") == "TACKLE_SUCCESS" for p in live_players)
                incomplete = ball["state"] == "IN_FLIGHT" and ball["y"] <= 0.0 and not ball.get("was_caught")
                timeout = match_state.play_timer >= 12.0
                oob = carrier is not None and (carrier["z"] < 3.0 or carrier["z"] > 50.3)

                if tackled or incomplete or oob or timeout:
                    event = None
                    yards_gained = round((carrier["x"] - match_state.snap_los), 1) if carrier else 0.0

                    if carrier and not carrier.get("is_defense") and carrier["x"] >= 110.0:
                        match_state.offense_score += 7
                        event = "TOUCHDOWN"
                        match_state.user_possession = "DEFENSE" if match_state.user_possession == "OFFENSE" else "OFFENSE"
                        match_state.reset_drive(25.0)
                    elif carrier and not carrier.get("is_defense") and carrier["x"] <= 10.0 and match_state.play_timer >= 0.3:
                        match_state.defense_score += 2
                        event = "SAFETY"
                        match_state.user_possession = "DEFENSE" if match_state.user_possession == "OFFENSE" else "OFFENSE"
                        match_state.reset_drive(25.0)
                    elif carrier and carrier.get("is_defense"):
                        event = "INTERCEPTION"
                        flip_los = round(max(1.0, min(100.0 - carrier["x"], 99.0)), 1)
                        match_state.user_possession = "DEFENSE" if match_state.user_possession == "OFFENSE" else "OFFENSE"
                        match_state.reset_drive(flip_los)
                    elif incomplete:
                        event = "INCOMPLETE"
                        yards_gained = 0.0
                        match_state.down += 1
                        if match_state.down > 4:
                            event = "TURNOVER_ON_DOWNS"
                            flip_los = round(max(1.0, min(100.0 - match_state.los, 99.0)), 1)
                            match_state.user_possession = "DEFENSE" if match_state.user_possession == "OFFENSE" else "OFFENSE"
                            match_state.reset_drive(flip_los)
                    else:
                        if carrier:
                            if "QB" in carrier.get("role", ""):
                                carrier["carries"] = carrier.get("carries", 0) + 1
                                carrier["rushYards"] = carrier.get("rushYards", 0) + yards_gained
                            else:
                                carrier["recYards"] = carrier.get("recYards", 0) + yards_gained
                                if qb:
                                    qb["passYards"] = qb.get("passYards", 0) + yards_gained

                        match_state.los = round(max(1.0, min(carrier["x"] if carrier else match_state.los, 99.0)), 1)
                        match_state.distance = round(max(0.0, match_state.distance - yards_gained), 1)
                        if match_state.distance <= 0:
                            event = "FIRST_DOWN"
                            match_state.down, match_state.distance = 1, 10.0
                        else:
                            match_state.down += 1
                            event = "TACKLED"
                            if match_state.down > 4:
                                event = "TURNOVER_ON_DOWNS"
                                flip_los = round(max(1.0, min(100.0 - match_state.los, 99.0)), 1)
                                match_state.user_possession = "DEFENSE" if match_state.user_possession == "OFFENSE" else "OFFENSE"
                                match_state.reset_drive(flip_los)

                    recorder = getattr(match_state, "recorder", None)
                    if recorder:
                        recorder.log_event(match_state.tick_counter, "PLAY_END", {"event": event, "los": match_state.los, "yards_gained": yards_gained})
                        saved_path = recorder.export_replay()
                        await websocket.send_json({
                            "type": "PLAY_COMPLETE",
                            "replay_file": os.path.basename(saved_path)
                        })
                        match_state.recorder = None

                    match_state.reset_pre_snap()
                    ball["state"] = "HELD"
                    ball["in_flight"] = False
                    ball["y"] = 0.8
                    for p in live_players:
                        _realign_player(p, match_state)

                    await websocket.send_json({
                        "type": "DRIVE_UPDATE",
                        "event": event,
                        "down": match_state.down,
                        "distance": match_state.distance,
                        "los": match_state.los,
                        "yards_gained": yards_gained,
                        "play_name": play_name_str if 'play_name_str' in locals() else "PLAY",
                        "offense_score": match_state.offense_score,
                        "defense_score": match_state.defense_score,
                    })

            # Send Telemetry Stream
            payload_state = 1 if match_state.play_active else 0
            binary_bytes = pack_telemetry_frame(match_state.tick_counter, payload_state, live_players, ball, match_state)
            try:
                await websocket.send_bytes(binary_bytes)
            except (WebSocketDisconnect, RuntimeError):
                print(f"📡 Client disconnected mid-play for {team_code}")
                break

            await asyncio.sleep(1 / 60)

    except WebSocketDisconnect:
        print(f"📡 Client disconnected mid-play for {team_code}")
    except Exception as e:
        print(f"⚠️ Engine Error: {e}")
    finally:
        listener_task.cancel()
        recorder = getattr(match_state, "recorder", None)
        if recorder:
            saved_path = recorder.export_replay()
            print(f"💾 Replay safely exported: {saved_path}")
        try:
            await listener_task
        except asyncio.CancelledError:
            pass