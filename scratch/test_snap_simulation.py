"""Simulate SNAP handler run-detection and FSM outcomes without a live server."""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from backend.routes.playbook import PLAY_DATABASE
from backend.engine.fsm import update_player_fsm

TOKENS = ["RUN", "DIVE", "SWEEP", "PITCH", "COUNTER", "ZONE"]

def backend_is_run_play(play_name_str: str) -> bool:
    s = str(play_name_str).upper()
    return any(tok in s for tok in TOKENS)

def simulate_snap(play_key: str):
    play = next(
        (p for p in PLAY_DATABASE if str(p.get("key")) == str(play_key) or str(p.get("id")) == str(play_key)),
        None,
    )
    if not play:
        return None

    # Frontend sends key as play_name on SNAP
    frontend_payload_name = play_key
    is_run = backend_is_run_play(frontend_payload_name)

    qb = {"role": "QB", "state": "PRE_SNAP", "route_waypoints": []}
    hb = {"role": "HB", "state": "PRE_SNAP", "route_waypoints": [{"x": 30, "z": 26}], "x": 25.0, "z": 26.65}
    wlb = {"role": "WLB", "state": "PRE_SNAP", "route_waypoints": [], "is_defense": True}
    bsg = {"role": "BSG", "state": "PRE_SNAP", "route_waypoints": [{"x": 28, "z": 24}]}

    ball = {"state": "HELD", "x": 25.0, "z": 26.65}

    if is_run:
        hb["state"] = "BALL_CARRIER"
        ball["x"], ball["z"] = hb["x"], hb["z"]

    for p in [qb, hb, wlb, bsg]:
        update_player_fsm(p, 0.0, hike_triggered=True, blitz_detected=False)

    return {
        "play_name": play.get("name"),
        "schema_run": play.get("play_type") == "RUN",
        "frontend_snap_field": frontend_payload_name,
        "backend_detected_run": is_run,
        "qb_state": qb["state"],
        "hb_state": hb["state"],
        "wlb_state": wlb["state"],
        "bsg_state": bsg["state"],
        "ball_on_hb_at_snap": ball.get("x") == hb.get("x"),
    }

print("=== SNAP simulation (frontend sends play KEY) ===")
runs = [p for p in PLAY_DATABASE if p.get("play_type") == "RUN"][:10]
passes = [p for p in PLAY_DATABASE if p.get("play_type") != "RUN"][:5]

for p in runs + passes:
    key = str(p.get("key", p.get("id")))
    r = simulate_snap(key)
    if r:
        schema = "RUN" if r["schema_run"] else "PASS"
        detected = "RUN" if r["backend_detected_run"] else "PASS"
        match = "OK" if (r["schema_run"] == r["backend_detected_run"]) else "MISMATCH"
        print(f"[{match}] key={key!r} ({r['play_name'][:20]}) schema={schema} detected={detected} | QB={r['qb_state']} HB={r['hb_state']} WLB={r['wlb_state']} BSG={r['bsg_state']}")

print()
print("=== If play NAME were sent (report scenario) ===")
for name in ["I-Form Power 17", "Pistol Inside Zone", "36 Power", "27 Stretch Wide Zone", "22 Dbl", "34 Pike ISO", "38 Truck Perimeter"]:
    p = next((x for x in PLAY_DATABASE if x.get("name") == name or x.get("play_name") == name), None)
    detected = backend_is_run_play(name)
    schema = p.get("play_type") == "RUN" if p else False
    print(f"  {name}: schema={schema} keyword_detect={detected}")
