"""
backend/engine/fsm.py
Player Finite State Machine with normalized (X, Y, Z) coordinates.
"""
import math
try:
    from backend.engine.utils import get_prop, set_prop, get_pos, set_pos
except ImportError:
    from engine.utils import get_prop, set_prop, get_pos, set_pos

HASH_CENTER_Z = 26.65

def get_role_group(role: str) -> str:
    if not role:
        return 'UNKNOWN'
    r = role.upper()
    if r.startswith(('LB', 'MLB', 'OLB', 'ILB', 'WLB', 'SLB')):
        return 'LB'
    if r == 'C' or r.startswith(('LT', 'LG', 'RG', 'RT')) or (r.startswith('OL') and not r.startswith('OLB')):
        return 'OL'
    if r.startswith(('WR', 'W')):
        return 'WR'
    if r.startswith('TE'):
        return 'TE'
    if r.startswith('QB'):
        return 'QB'
    if r.startswith(('RB', 'HB', 'FB')):
        return 'RB'
    if r.startswith(('DE', 'DT', 'NT', 'DL')):
        return 'DL'
    if r.startswith(('CB', 'FS', 'SS', 'DB')):
        return 'DB'
    return role

PRE_SNAP_OFFSETS = {
    # Offense (Relative to LOS_X, HASH_CENTER_Z = 26.65)
    "LT": (-0.5, -4.0),
    "LG": (-0.5, -2.0),
    "C":  (-0.5,  0.0),
    "RG": (-0.5,  2.0),
    "RT": (-0.5,  4.0),
    "OL": (-0.5,  0.0),
    "QB": (-4.5,  0.0),
    "HB": (-7.0, -2.0),
    "FB": (-6.0,  0.0),
    "RB": (-7.0, -2.0),
    "X":  (-0.5, -18.0),
    "WR1": (-0.5, -18.0),
    "Y":  (-0.5,  6.0),
    "TE": (-0.5,  6.0),
    "Z":  (-1.0,  18.0),
    "WR2": (-1.0,  18.0),
    "H":  (-1.0, -9.0),
    "WR3": (-1.0, -9.0),
    "SLOT": (-1.0, -9.0),

    # Defense (Ahead of LOS)
    "DE1": (1.5, -5.0),
    "DT1": (1.5, -1.5),
    "DT2": (1.5,  1.5),
    "DE2": (1.5,  5.0),
    "WLB": (4.5, -5.0),
    "MLB": (4.5,  0.0),
    "SLB": (4.5,  5.0),
    "CB1": (5.5, -18.0),
    "CB2": (5.5,  18.0),
    "FS":  (14.0, -6.0),
    "SS":  (10.0,  6.0)
}

def align_players_pre_snap(player, line_of_scrimmage_x=20.0, lateral_offset=0.0):
    """Reset a single player's FSM state and (x, z) position for the pre-snap
    stance based on authentic positional formation offsets."""
    role = get_prop(player, "role", "WR")
    set_prop(player, "state", "PRE_SNAP")
    set_prop(player, "vx", 0.0)
    set_prop(player, "vy", 0.0)
    set_prop(player, "vz", 0.0)

    offset_x, offset_z = PRE_SNAP_OFFSETS.get(role, (0.0, lateral_offset))
    target_x = float(line_of_scrimmage_x + offset_x)
    target_z = float(HASH_CENTER_Z + offset_z)

    set_pos(player, x=target_x, y=0.0, z=target_z)
    set_prop(player, "start_x", target_x)
    set_prop(player, "start_z", target_z)

def update_player_fsm(player, current_play_time=0.0, hike_triggered=True, blitz_detected=False, is_run_play=False, *args, **kwargs):
    state = get_prop(player, "state", "PRE_SNAP")
    if state in ("BALL_CARRIER", "THROWING", "BALL_RELEASED", "TACKLE_SUCCESS", "TACKLED", "INJURED"):
        return

    if state == "PRE_SNAP" and hike_triggered:
        role = get_prop(player, "role", "")
        group = get_role_group(role)
        is_defense = get_prop(player, "is_defense", False)

        if is_defense:
            if group in ("DL", "OL"):
                set_prop(player, "state", "ENGAGED")
            else:  # LB, DB
                set_prop(player, "state", "ZONE_DROP")
        else:  # Offense
            if group == "QB":
                if is_run_play or kwargs.get("is_run_play"):
                    set_prop(player, "state", "HANDOFF_PRESENT")
                else:
                    set_prop(player, "state", "DROPBACK")
            elif group == "OL":
                set_prop(player, "state", "ENGAGED")
            elif group in ("WR", "TE", "RB") or role in ["WR1", "WR2", "WR3", "X", "Y", "Z", "H", "F", "HB", "FB"]:
                route = get_prop(player, "route", get_prop(player, "route_waypoints", []))
                if route and len(route) > 0:
                    set_prop(player, "state", "RUNNING_ROUTE")
                    if blitz_detected:
                        orig_x, _, _ = get_pos(player)
                        if isinstance(route[0], dict):
                            route[0]["x"] = min(route[0].get("x", orig_x + 5.0), orig_x + 5.0)
                        elif hasattr(route[0], "x"):
                            route[0].x = min(route[0].x, orig_x + 5.0)
                else:
                    set_prop(player, "state", "ENGAGED")


# Zone-drop depth (yards past the LOS) each coverage role settles into before
# reading the play and converting to ball pursuit.
ZONE_DEPTHS = {"CB1": 12.0, "CB2": 12.0, "FS": 16.0, "SS": 14.0, "MLB": 6.0, "WLB": 5.0, "SLB": 5.0}


def update_defender_targets(players, ball, match_state):
    """Per-tick target/waypoint calculation for offensive and defensive linemen,
    linebackers, and secondary coverage.

    Ensures OL/DL fight in the trench at the LOS, preventing defenders from
    teleporting into the backfield on tick 1, and giving play action / run plays
    realistic 6-12 second development time."""
    los = getattr(match_state, "los", 25.0)
    play_timer = getattr(match_state, "play_timer", 0.0)
    is_run_play = bool(getattr(match_state, "is_run_play", False))
    blitzing = bool(getattr(match_state, "blitz_this_play", False))

    ball_carrier = next((p for p in players if get_prop(p, "state") == "BALL_CARRIER"), None)
    qb = next((p for p in players if get_role_group(get_prop(p, "role", "")) == "QB"), None)

    for p in players:
        role = get_prop(p, "role", "")
        group = get_role_group(role)
        state = get_prop(p, "state")
        is_def = get_prop(p, "is_defense", False)

        # -------------------------------------------------------------------
        # 1. OFFENSIVE LINE (OL): Push forward on RUN, form pocket on PASS
        # -------------------------------------------------------------------
        if not is_def and group == "OL":
            if state == "ENGAGED":
                if is_run_play:
                    # Drive forward past LOS to seal run lanes
                    target_x = los + 1.5
                else:
                    # Pass protection pocket setup
                    target_x = los - 1.5
                start_z = get_prop(p, "start_z", HASH_CENTER_Z)
                set_prop(p, "route_waypoints", [{"x": target_x, "z": start_z}])

        # -------------------------------------------------------------------
        # 2. DEFENSIVE LINE (DL): Contain at LOS during block engagement
        # -------------------------------------------------------------------
        elif is_def and group == "DL":
            if state == "ENGAGED":
                # DL stay engaged at line of scrimmage trench during block period
                # Rushers break free after 3.5s on pass (or 2.2s if blitzing)
                block_shed_time = 2.2 if blitzing else 3.5
                if play_timer >= block_shed_time:
                    set_prop(p, "state", "BALL_PURSUIT")
                else:
                    # Trench engagement target: battle at line of scrimmage
                    start_z = get_prop(p, "start_z", HASH_CENTER_Z)
                    set_prop(p, "route_waypoints", [{"x": los + 0.5, "z": start_z}])

        # -------------------------------------------------------------------
        # 3. LINEBACKERS & SECONDARY: Read-and-react timing
        # -------------------------------------------------------------------
        elif is_def and state == "ZONE_DROP":
            if is_run_play:
                # Read-and-react on run plays (1.8s read time or when carrier crosses LOS)
                carrier_x = get_pos(ball_carrier)[0] if ball_carrier else los
                if play_timer >= 1.8 or carrier_x >= los + 0.5:
                    set_prop(p, "state", "BALL_PURSUIT")
                else:
                    start_z = get_prop(p, "start_z", HASH_CENTER_Z)
                    set_prop(p, "route_waypoints", [{"x": los + 2.0, "z": start_z}])
            else:
                zone_x = los + ZONE_DEPTHS.get(role, 6.0)
                zone_z = get_prop(p, "start_z", HASH_CENTER_Z)
                px, _, pz = get_pos(p)
                pa_freeze_until = getattr(match_state, "pa_freeze_until", 0.0)
                if play_timer < pa_freeze_until:
                    continue  # Hold zone drop during play action fake
                if math.hypot(zone_x - px, zone_z - pz) < 1.0:
                    set_prop(p, "state", "BALL_PURSUIT")
                else:
                    set_prop(p, "route_waypoints", [{"x": zone_x, "z": zone_z}])

        # -------------------------------------------------------------------
        # 4. BALL PURSUIT: Pursue active carrier or in-flight ball
        # -------------------------------------------------------------------
        elif is_def and state == "BALL_PURSUIT":
            target_player = ball_carrier or qb
            if target_player:
                tx, _, tz = get_pos(target_player)
                set_prop(p, "route_waypoints", [{"x": tx, "z": tz}])
            elif get_prop(ball, "in_flight", False):
                set_prop(p, "route_waypoints", [{"x": ball.get("x", los), "z": ball.get("z", HASH_CENTER_Z)}])

