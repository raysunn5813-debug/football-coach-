"""
scratch/test_punting_simulation.py
Diagnostic simulation script for Punting & Punt Returns: hang-time, distance trajectory, fair catch choice, and gunner coverage.
"""
import sys
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
import math
import random
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

def simulate_punt_play(punting_team_los=35.0, punter_power=84, punter_accuracy=82):
    # Punter is 14 yards behind LOS
    punter_x = punting_team_los - 14.0
    punter_z = 26.65

    # Punt distance math: 84 power -> ~46 yard punt
    base_dist = 30.0 + (punter_power / 100.0) * 20.0
    actual_dist = base_dist + random.uniform(-3.0, 3.0)
    landing_x = punter_x + actual_dist

    # Hangtime math (seconds): 4.0 to 4.8 seconds
    hangtime_sec = 4.0 + (punter_power / 100.0) * 0.8

    # Check for Touchback (landing_x >= 100.0 yards / opponent endzone)
    is_touchback = landing_x >= 100.0

    # Gunner coverage speed (88 speed gunner running for hangtime_sec)
    gunner_speed_yds_per_sec = 8.5
    gunner_dist_covered = gunner_speed_yds_per_sec * hangtime_sec
    gunner_position_x = (punting_team_los) + gunner_dist_covered

    # Returner proximity decision (if gunner is within 3 yards at landing time -> Fair Catch)
    separation = landing_x - gunner_position_x
    is_fair_catch = (separation <= 3.5) and not is_touchback

    return {
        "los": punting_team_los,
        "punt_distance_yards": round(actual_dist, 1),
        "hangtime_seconds": round(hangtime_sec, 2),
        "landing_yardline": round(landing_x, 1),
        "is_touchback": is_touchback,
        "gunner_dist_covered": round(gunner_dist_covered, 1),
        "is_fair_catch": is_fair_catch
    }

if __name__ == "__main__":
    print("==================================================")
    print("🦵 PUNTING & PUNT RETURN DIAGNOSTIC TEST")
    print("==================================================")
    for los in [20, 35, 50]:
        res = simulate_punt_play(punting_team_los=los)
        print(f"Punt from Own {los}yd line: Distance={res['punt_distance_yards']}yds | Hangtime={res['hangtime_seconds']}s | Landed={res['landing_yardline']}yd line | Touchback={res['is_touchback']} | Fair Catch={res['is_fair_catch']}")
