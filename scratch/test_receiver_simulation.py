"""
scratch/test_receiver_simulation.py
Diagnostic simulation script for WR/TE Route Execution, Waypoints, and Pass Catching Mechanics.
"""
import sys
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
import math
import random
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from backend.routes.playbook import PLAY_DATABASE
from backend.engine.physics import update_player_along_route, resolve_catch_attempt

def run_receiver_simulation(play_id=" ari_38", sim_seconds=4.0, dt=1.0/60.0):
    play = next((p for p in PLAY_DATABASE if str(p.get("id")) == str(play_id) or str(p.get("key")) == str(play_id)), PLAY_DATABASE[0])
    
    los = 25.0
    hash_center_z = 26.65

    # Parse routes from play data
    receivers = []
    routes = play.get("routes", [])

    for r in routes:
        role = r.get("player")
        if role in ["QB", "OL", "FB", "BSG", "BST"]:
            continue
        waypoints = r.get("waypoints", [])
        if not waypoints:
            continue
        
        # Convert waypoints to engine (x, z)
        converted_wp = [{"x": los + wp[1], "z": hash_center_z + wp[0]} for wp in waypoints]
        start_pos = converted_wp[0]

        rec = {
            "id": f"OFF_{role}",
            "role": role,
            "is_defense": False,
            "speed_attr": 88 if role in ["X", "Z"] else 82,
            "catch_skill": 85,
            "overall_attr": 84,
            "state": "RUNNING_ROUTE",
            "x": start_pos["x"],
            "z": start_pos["z"],
            "y": 0.0,
            "vx": 0.0,
            "vz": 0.0,
            "route_waypoints": converted_wp
        }
        receivers.append(rec)

    # Mock DB Coverage Defenders
    defenders = [
        {"id": "CB1", "role": "CB1", "is_defense": True, "x": los + 15.0, "z": hash_center_z - 14.0, "coverage_skill": 82, "overall_attr": 82},
        {"id": "FS", "role": "FS", "is_defense": True, "x": los + 20.0, "z": hash_center_z, "coverage_skill": 85, "overall_attr": 85}
    ]

    total_ticks = int(sim_seconds / dt)
    telemetry_samples = []

    for tick in range(total_ticks):
        current_time = tick * dt

        # Update receiver positions along their route waypoints
        for rec in receivers:
            update_player_along_route(rec)

        if tick % 30 == 0:  # Every 0.5s
            sample = {"time": round(current_time, 2), "positions": {}}
            for rec in receivers:
                sample["positions"][rec["role"]] = {
                    "x": round(rec["x"], 2),
                    "z": round(rec["z"], 2),
                    "wps_left": len(rec["route_waypoints"])
                }
            telemetry_samples.append(sample)

    # Test Catch Resolution at End of Route for primary target
    primary_target = receivers[0] if receivers else None
    catch_result = None
    if primary_target:
        catch_result = resolve_catch_attempt(
            primary_target,
            defenders,
            ball_target_x=primary_target["x"],
            ball_target_z=primary_target["z"],
            pass_accuracy=0.90
        )

    return {
        "play_name": play.get("name"),
        "receivers_count": len(receivers),
        "telemetry_samples": telemetry_samples,
        "primary_target": primary_target["role"] if primary_target else None,
        "catch_result": catch_result
    }

if __name__ == "__main__":
    print("==================================================")
    print("🏃 WR/TE ROUTE EXECUTION & CATCH MECHANICS TEST")
    print("==================================================")

    res = run_receiver_simulation(play_id="ari_38")
    print(f"Play: {res['play_name']} | Active Routes: {res['receivers_count']}")
    
    print("\n--- Route Progression Samples (Every 0.5s) ---")
    for sample in res["telemetry_samples"]:
        print(f"t={sample['time']}s:")
        for role, data in sample["positions"].items():
            print(f"   - {role}: Pos=({data['x']}, {data['z']}) | Waypoints Remaining={data['wps_left']}")

    print("\n--- Catch Resolution ---")
    print(f"Target: {res['primary_target']} | Contested Catch Outcome: {res['catch_result']}")
