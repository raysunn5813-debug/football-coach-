"""
scratch/test_kicking_simulation.py
Diagnostic simulation script for Field Goals and Extra Points: kick trajectory, accuracy scatter, distance, and goalpost checks.
"""
import sys
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
import math
import random
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

def simulate_field_goal_kick(kick_distance_yards=45, kicker_power=85, kicker_accuracy=80):
    # Standard NFL goalposts: 10 yards behind 0-yard line, uprights 18.5 feet (6.16 yards) wide
    # Target goalpost is at x = 0.0 (endzone line + 10yd back = -10.0), z = 26.65 (center of field)
    los_x = kick_distance_yards - 17.0  # 17 yards back for snap + hold
    hold_x = los_x - 7.0
    hold_z = 26.65

    target_x = -10.0  # Crossbar/upright plane
    target_z = 26.65

    total_dist = hold_x - target_x

    # Kicker power dictates max range: 85 power ~ 55-60 yards max
    max_range = 35.0 + (kicker_power / 100.0) * 30.0
    has_distance = max_range >= kick_distance_yards

    # Kicker accuracy dictates lateral deviation angle (in degrees)
    accuracy_variance = (100.0 - kicker_accuracy) * 0.15  # degrees max deviation
    angle_offset_deg = random.uniform(-accuracy_variance, accuracy_variance)
    angle_rad = math.radians(angle_offset_deg)

    final_z_offset = total_dist * math.tan(angle_rad)
    final_z = hold_z + final_z_offset

    # Crossbar height is 10 feet (3.33 yards) above ground
    # Check if ball passes between uprights (z between 23.57 and 29.73)
    upright_left_z = 26.65 - 3.08
    upright_right_z = 26.65 + 3.08

    is_good = has_distance and (upright_left_z <= final_z <= upright_right_z)

    return {
        "kick_distance_yards": kick_distance_yards,
        "kicker_power": kicker_power,
        "kicker_accuracy": kicker_accuracy,
        "has_distance": has_distance,
        "final_z": round(final_z, 2),
        "is_good": is_good
    }

if __name__ == "__main__":
    print("==================================================")
    print("👟 FIELD GOAL & EXTRA POINT KICKING TEST")
    print("==================================================")
    for dist in [33, 45, 53, 62]:
        res = simulate_field_goal_kick(kick_distance_yards=dist, kicker_power=85, kicker_accuracy=80)
        status = "GOOD! 🟢" if res["is_good"] else "NO GOOD 🔴"
        print(f"{dist}-Yard FG Attempt: Result={status} | Distance OK: {res['has_distance']} | Final Z Offset: {res['final_z']}")
