"""
scratch/test_qb_simulation.py
Diagnostic simulation script for Quarterback operations: dropbacks, target progression, and ballistics.
"""
import sys
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
import math
import random
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from backend.engine.quarterback import process_qb_logic
from backend.engine.physics import calculate_pass_trajectory

def test_qb_simulation():
    los = 25.0
    qb = {
        "id": "OFF_QB",
        "role": "QB",
        "is_defense": False,
        "state": "DROPBACK",
        "x": los - 2.0,
        "z": 26.65,
        "short_attr": 85,
        "medium_attr": 80,
        "long_attr": 75,
        "awareness_attr": 85,
        "overall_attr": 84,
        "overall": 84
    }

    receivers = [
        {"id": "OFF_X", "role": "X", "state": "RUNNING_ROUTE", "x": los + 15.0, "z": 10.0, "overall_attr": 85},
        {"id": "OFF_Z", "role": "Z", "state": "RUNNING_ROUTE", "x": los + 8.0, "z": 40.0, "overall_attr": 80},
    ]

    defenders = [
        {"id": "DEF_CB1", "role": "CB1", "is_defense": True, "x": los + 14.0, "z": 10.0, "overall_attr": 80},
    ]

    # Test QB Decision Logic
    target = process_qb_logic(qb, receivers, defenders, line_of_scrimmage=los, dt=1.0/60.0)

    # Test Pass Trajectory Math
    target_pos = (los + 15.0, 1.8, 10.0)
    qb_pos = (qb["x"], 1.8, qb["z"])
    vx, vy0, vz, flight_time = calculate_pass_trajectory(qb_pos, target_pos, pass_speed=22.0)

    return {
        "target_selected": target.get("role") if target else None,
        "qb_state_after": qb["state"],
        "flight_time_seconds": round(flight_time, 2),
        "initial_vy0": round(vy0, 2)
    }

if __name__ == "__main__":
    print("==================================================")
    print("🎯 QUARTERBACK OPERATIONS DIAGNOSTIC TEST")
    print("==================================================")
    res = test_qb_simulation()
    print(f"Target Selected: {res['target_selected']}")
    print(f"QB State After Logic: {res['qb_state_after']}")
    print(f"Pass Flight Time: {res['flight_time_seconds']}s | Initial Vertical Velocity vy0: {res['initial_vy0']} yd/s")
