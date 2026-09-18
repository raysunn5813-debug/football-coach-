"""
backend/engine/quarterback.py
Pocket health evaluation, corridor-aware progression reads, and scrambling mechanics.
"""
import math
try:
    from backend.engine.utils import get_prop, set_prop, get_pos, point_to_segment_distance
except ImportError:
    from engine.utils import get_prop, set_prop, get_pos, point_to_segment_distance


def process_qb_logic(qb, receivers, defenders, line_of_scrimmage_x=20.0, dt=0.01667, *args, **kwargs):
    if not qb:
        return None

    # Handle flexible positional argument signatures:
    # process_qb_logic(qb, receivers, defenders, play_timer, los_x)
    if isinstance(line_of_scrimmage_x, (int, float)) and len(args) >= 1 and isinstance(args[0], (int, float)):
        play_timer = line_of_scrimmage_x
        los_x = float(args[0])
    else:
        play_timer = dt
        los_x = float(line_of_scrimmage_x) if isinstance(line_of_scrimmage_x, (int, float)) else 20.0

    qb_x, qb_y, qb_z = get_pos(qb)
    qb_state = get_prop(qb, "state", "DROPBACK")

    # 1. Line of Scrimmage Crossing Check
    # If QB has crossed the line of scrimmage, force state to RUNNING and disallow passing
    if qb_x >= los_x and qb_state in ["SCRAMBLE_OUT", "SCRAMBLING", "DROPBACK", "SCANNING"]:
        set_prop(qb, "state", "BALL_CARRIER")
        set_prop(qb, "vx", 3.0)  # Full sprint downfield
        set_prop(qb, "vz", 0.0)
        return None

    # 2. Pocket Health Radius Check
    rushers_in_pocket = 0
    for d in defenders:
        dx, _, dz = get_pos(d)
        if ((dx - qb_x) ** 2 + (dz - qb_z) ** 2) <= 2.25:  # 1.5yd radius
            rushers_in_pocket += 1

    # Trigger scramble if pocket collapses
    if rushers_in_pocket >= 2 and qb_state not in ["SCRAMBLE_OUT", "BALL_CARRIER"]:
        set_prop(qb, "state", "SCRAMBLE_OUT")
        qb_run = get_prop(qb, "run", get_prop(qb, "run_attr", 50))
        # Mobility rating (e.g., Rodgers: 60, Dak: 80 vs Brady: 30) scales scramble speed
        scramble_vx = 0.8 + (float(qb_run) / 100.0) * 1.2
        scramble_vz = (2.5 + (float(qb_run) / 100.0) * 1.5) if qb_z < 26.65 else -(2.5 + (float(qb_run) / 100.0) * 1.5)
        set_prop(qb, "vx", scramble_vx)
        set_prop(qb, "vz", scramble_vz)
        return None

    # 3. Dynamic Progression Reads across ALL Receivers
    best_target = None
    best_score = -999.0

    for rx in receivers:
        rx_x, rx_y, rx_z = get_pos(rx)

        # Calculate nearest defender distance
        def_distances = [math.hypot(get_pos(d)[0] - rx_x, get_pos(d)[2] - rx_z) for d in defenders]
        min_def_dist = min(def_distances) if def_distances else 999.0

        # Calculate passing lane obstructions
        lane_obstructions = sum(
            1 for d in defenders 
            if point_to_segment_distance(get_pos(d)[0], get_pos(d)[2], qb_x, qb_z, rx_x, rx_z) < 1.8
        )

        depth_bonus = (rx_x - los_x) * 0.2
        score = min_def_dist + depth_bonus - (lane_obstructions * 2.5)

        if score > best_score:
            best_score = score
            best_target = rx

    # Deliver pass to best open receiver once dropback step completes (play_timer >= 0.7s)
    throw_threshold = 1.2 if play_timer >= 0.7 else 2.8
    if best_score >= throw_threshold and best_target is not None and qb_state not in ["BALL_CARRIER", "THROWING", "BALL_RELEASED"]:
        set_prop(qb, "state", "THROWING")
        set_prop(qb, "target_receiver_id", get_prop(best_target, "id"))
        return best_target

    return None