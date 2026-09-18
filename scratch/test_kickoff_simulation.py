"""
scratch/test_kickoff_simulation.py
Diagnostic simulation script for Kickoffs and Kick Returns: kickoff distance, touchbacks, return lanes, and coverage pursuit.
"""
import sys
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
import math
import random
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

def simulate_kickoff(kickoff_los=35.0, kicker_power=88):
    # Kickoff from 35-yard line
    base_distance = 60.0 + (kicker_power / 100.0) * 15.0  # 88 power = ~73.2 yards (lands 8 yards deep in endzone)
    actual_distance = base_distance + random.uniform(-2.0, 2.0)
    landing_x = kickoff_los + actual_distance  # 100.0 is endzone line, 110.0 is back of endzone

    is_touchback = landing_x >= 100.0

    # If returned, calculate return yards based on coverage speed vs returner speed
    return_yards = 0
    if not is_touchback:
        returner_speed = 90
        coverage_speed = 84
        speed_delta = returner_speed - coverage_speed
        return_yards = int(max(15, min(95, 22 + (speed_delta * 1.5) + random.uniform(-5, 10))))

    return {
        "kickoff_los": kickoff_los,
        "kick_distance_yards": round(actual_distance, 1),
        "landing_x": round(landing_x, 1),
        "is_touchback": is_touchback,
        "return_yards": return_yards
    }

if __name__ == "__main__":
    print("==================================================")
    print("🚀 KICKOFF & KICK RETURN DIAGNOSTIC TEST")
    print("==================================================")
    for power in [75, 85, 92]:
        res = simulate_kickoff(kicker_power=power)
        outcome = "TOUCHBACK ⚪" if res["is_touchback"] else f"RETURNED ({res['return_yards']} yards) 🏃"
        print(f"Kicker Power {power}: Distance={res['kick_distance_yards']}yds | Landed={res['landing_x']}yd line | Outcome={outcome}")
