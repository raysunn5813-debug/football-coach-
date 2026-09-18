"""
scratch/test_oline_run_simulation.py
Diagnostic simulation script for Offensive Line Blocking, Pulling Linemen, and Running Back Lane Navigation.
"""
import sys
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from backend.routes.playbook import PLAY_DATABASE
from backend.engine.physics import update_player_along_route, resolve_collisions

def test_oline_run_simulation():
    los = 25.0
    hash_center_z = 26.65

    # Linemen & Pulling Guards setup
    linemen = [
        {"id": "OFF_LT", "role": "LT", "is_defense": False, "speed_attr": 65, "x": los - 0.5, "z": hash_center_z - 4.0, "route_waypoints": []},
        {"id": "OFF_BSG", "role": "BSG", "is_defense": False, "speed_attr": 72, "x": los - 0.5, "z": hash_center_z + 2.0, "route_waypoints": [{"x": los + 1.0, "z": hash_center_z - 3.0}]}
    ]

    # Running back taking handoff and following run lane
    hb = {
        "id": "OFF_HB",
        "role": "HB",
        "is_defense": False,
        "speed_attr": 88,
        "state": "BALL_CARRIER",
        "x": los - 5.0,
        "z": hash_center_z,
        "route_waypoints": [{"x": los + 2.0, "z": hash_center_z - 2.0}, {"x": los + 10.0, "z": hash_center_z - 2.0}]
    }

    # Simulate 2 seconds of physics movement
    dt = 1.0 / 60.0
    for tick in range(120):
        update_player_along_route(hb)
        for ol in linemen:
            update_player_along_route(ol)
        resolve_collisions(linemen + [hb])

    return {
        "hb_final_x": round(hb["x"], 2),
        "hb_final_z": round(hb["z"], 2),
        "bsg_final_x": round(linemen[1]["x"], 2),
        "bsg_final_z": round(linemen[1]["z"], 2),
        "wps_remaining": len(hb["route_waypoints"])
    }

if __name__ == "__main__":
    print("==================================================")
    print("🚜 OL BLOCKING & RUN GAME NAVIGATION TEST")
    print("==================================================")
    res = test_oline_run_simulation()
    print(f"HB Final Pos: ({res['hb_final_x']}, {res['hb_final_z']}) | Waypoints Remaining: {res['wps_remaining']}")
    print(f"Pulling Guard (BSG) Final Pos: ({res['bsg_final_x']}, {res['bsg_final_z']})")
