"""
scratch/test_defense_simulation.py
Diagnostic simulation script for Defensive AI, Zone Drops, Pass Rush, and Ball Pursuit.
"""
import sys
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from backend.routes.playbook import PLAY_DATABASE
from backend.engine.fsm import align_players_pre_snap, update_player_fsm, update_defender_targets
from backend.engine.physics import update_player_along_route, resolve_tackle_attempt, check_tackle_radius

def run_defense_simulation(play_id="1", is_blitz=False, sim_seconds=3.0, dt=1.0/60.0):
    play = next((p for p in PLAY_DATABASE if str(p.get("id")) == str(play_id) or str(p.get("key")) == str(play_id)), PLAY_DATABASE[0])
    
    class MatchState:
        los = 25.0
        blitz_this_play = is_blitz
        pa_freeze_until = 0.0
        play_timer = 0.0

    match_state = MatchState()

    def_roles = ["DE1", "DT1", "DT2", "DE2", "WLB", "MLB", "SLB", "CB1", "CB2", "FS", "SS"]
    players = []

    for role in def_roles:
        p = {
            "id": f"DEF_{role}",
            "role": role,
            "is_defense": True,
            "speed_attr": 80,
            "awareness_attr": 80,
            "overall_attr": 80,
            "tackle_attribute": 80,
            "state": "PRE_SNAP",
            "x": 25.0,
            "z": 26.65,
            "start_x": 25.0,
            "start_z": 26.65,
            "vx": 0.0,
            "vz": 0.0,
            "route_waypoints": []
        }
        align_players_pre_snap(p, match_state.los)
        players.append(p)

    # Mock Ball Carrier (e.g. HB advancing downfield)
    ball_carrier = {
        "id": "OFF_HB",
        "role": "HB",
        "is_defense": False,
        "state": "BALL_CARRIER",
        "break_tackle_attribute": 75,
        "x": 20.0,
        "z": 26.65,
        "vx": 4.5,  # Moving forward at ~4.5 yds/sec
        "vz": 0.0
    }
    players.append(ball_carrier)
    ball = {"state": "HELD", "x": ball_carrier["x"], "z": ball_carrier["z"], "in_flight": False}

    # Snap hike
    for p in players:
        if p["is_defense"]:
            update_player_fsm(p, 0.0, hike_triggered=True, blitz_detected=is_blitz)

    log_frames = []
    total_ticks = int(sim_seconds / dt)
    tackle_event = None

    for tick in range(total_ticks):
        match_state.play_timer = tick * dt

        # Update ball carrier position
        ball_carrier["x"] += ball_carrier["vx"] * dt
        ball["x"] = ball_carrier["x"]

        # Update defensive AI target waypoints & FSM state
        update_defender_targets(players, ball, match_state)

        # Move defenders along route waypoints
        for p in players:
            if p["is_defense"]:
                update_player_along_route(p)

        # Check tackle collisions
        if not tackle_event:
            for p in players:
                if p["is_defense"]:
                    if check_tackle_radius((p["x"], p["z"]), (ball_carrier["x"], ball_carrier["z"]), tackle_radius=1.2):
                        outcome = resolve_tackle_attempt(p, ball_carrier)
                        tackle_event = {
                            "tick": tick,
                            "time": round(tick * dt, 2),
                            "tackler": p["role"],
                            "outcome": outcome,
                            "los_gained": round(ball_carrier["x"] - match_state.los, 2)
                        }
                        if outcome == "TACKLED":
                            ball_carrier["state"] = "TACKLED"

        if tick % 30 == 0:  # Every 0.5 sec
            mlb = next(p for p in players if p["role"] == "MLB")
            cb1 = next(p for p in players if p["role"] == "CB1")
            log_frames.append({
                "time": round(tick * dt, 2),
                "MLB": {"state": mlb["state"], "x": round(mlb["x"], 2), "z": round(mlb["z"], 2)},
                "CB1": {"state": cb1["state"], "x": round(cb1["x"], 2), "z": round(cb1["z"], 2)},
                "HB_X": round(ball_carrier["x"], 2)
            })

    return {
        "play_name": play.get("name"),
        "is_blitz": is_blitz,
        "tackle_event": tackle_event,
        "sample_frames": log_frames
    }

if __name__ == "__main__":
    print("==================================================")
    print("🛡️ DEFENSE AI & PURSUIT DIAGNOSTIC TEST")
    print("==================================================")
    
    res = run_defense_simulation(play_id="1", is_blitz=False)
    print(f"Play: {res['play_name']} | Blitz: {res['is_blitz']}")
    print("\n--- Telemetry Frames (Every 0.5s) ---")
    for f in res["sample_frames"]:
        print(f"Time {f['time']}s | HB_X: {f['HB_X']}y | MLB State: {f['MLB']['state']} (X={f['MLB']['x']}, Z={f['MLB']['z']}) | CB1 State: {f['CB1']['state']} (X={f['CB1']['x']}, Z={f['CB1']['z']})")
    
    print("\n--- Tackle Outcome ---")
    if res["tackle_event"]:
        print(f"Tackle Attempt by {res['tackle_event']['tackler']} at t={res['tackle_event']['time']}s: Result={res['tackle_event']['outcome']} (Yards Gained: {res['tackle_event']['los_gained']} yds)")
    else:
        print("No tackle made in 3.0 seconds.")
