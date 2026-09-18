"""
scratch/test_pass_rush_simulation.py
Diagnostic simulation script for Defensive Line Pass Rush, Linebacker Blitzing, and Pressure/Sacks.
"""
import sys
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from backend.engine.physics import update_player_along_route, check_tackle_radius

def test_pass_rush_simulation():
    los = 25.0
    qb = {"id": "OFF_QB", "role": "QB", "is_defense": False, "state": "DROPBACK", "x": los - 6.0, "z": 26.65}

    pass_rushers = [
        {"id": "DEF_DE1", "role": "DE1", "is_defense": True, "speed_attr": 82, "x": los + 1.5, "z": 21.65, "route_waypoints": [{"x": los - 6.0, "z": 26.65}]},
        {"id": "DEF_MLB", "role": "MLB", "is_defense": True, "speed_attr": 85, "x": los + 4.5, "z": 26.65, "route_waypoints": [{"x": los - 6.0, "z": 26.65}]}
    ]

    dt = 1.0 / 60.0
    sack_event = None

    for tick in range(180): # 3.0 seconds
        time_sec = round(tick * dt, 2)
        for rusher in pass_rushers:
            update_player_along_route(rusher)
            if not sack_event and check_tackle_radius((rusher["x"], rusher["z"]), (qb["x"], qb["z"]), tackle_radius=1.2):
                sack_event = {
                    "time": time_sec,
                    "rusher": rusher["role"],
                    "loss_yards": round(los - qb["x"], 2)
                }

    return {
        "sack_event": sack_event,
        "de1_final_x": round(pass_rushers[0]["x"], 2),
        "mlb_final_x": round(pass_rushers[1]["x"], 2)
    }

if __name__ == "__main__":
    print("==================================================")
    print("⚡ PASS RUSH & BLITZ PRESSURE TEST")
    print("==================================================")
    res = test_pass_rush_simulation()
    if res["sack_event"]:
        print(f"💥 SACK! {res['sack_event']['rusher']} sacked the QB at t={res['sack_event']['time']}s (Loss of {res['sack_event']['loss_yards']} yards)")
    else:
        print(f"No sack in 3.0s | DE1 Final X: {res['de1_final_x']} | MLB Final X: {res['mlb_final_x']}")
