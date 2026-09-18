"""
backend/engine/generate_schedule.py
Generates an 18-week regular season and 4-week playoff schedule.
"""
import os
import pickle
from datetime import datetime, timedelta

try:
    from backend.engine.schedule_engine import get_date_mapping, pickle_wrap
except ImportError:
    from schedule_engine import get_date_mapping, pickle_wrap

def build_mock_season():
    print("Generating 2026 Season Schedule...")
    date_map = get_date_mapping("2026-09-10")
    weeks = {}

    # Core teams to feature in the schedule
    teams = ["NYJ", "CLE", "ATL", "KC", "SF", "NE", "GB", "DAL"]
    
    for w in range(1, 23):
        # Assign titles based on week number
        if w <= 18:
            round_name = f"Regular Season — Week {w}"
        elif w == 19:
            round_name = "Wildcard Round"
        elif w == 20:
            round_name = "Divisional Round"
        elif w == 21:
            round_name = "Conference Finals"
        else:
            round_name = "Championship Super Bowl"

        # Determine the display date
        display_date = date_map.get(w, {}).get("display_date", f"Week {w}")

        weeks[w] = {
            "week_number": w,
            "round_name": round_name,
            "date": display_date,
            "matchups": []
        }

        # Generate rotating mock matchups for regular season
        if w <= 18:
            weeks[w]["matchups"] = [
                {
                    "id": f"s2026_w{w}_m1",
                    "away_team": teams[w % 8],
                    "home_team": teams[(w + 1) % 8],
                    "away_record": "0-0",
                    "home_record": "0-0",
                    "away_score": 0,
                    "home_score": 0,
                    "is_divisional": True,
                    "is_completed": False,
                    "date": display_date
                },
                {
                    "id": f"s2026_w{w}_m2",
                    "away_team": teams[(w + 2) % 8],
                    "home_team": teams[(w + 3) % 8],
                    "away_record": "0-0",
                    "home_record": "0-0",
                    "away_score": 0,
                    "home_score": 0,
                    "is_divisional": False,
                    "is_completed": False,
                    "date": display_date
                },
                {
                    "id": f"s2026_w{w}_m3",
                    "away_team": teams[(w + 4) % 8],
                    "home_team": teams[(w + 5) % 8],
                    "away_record": "0-0",
                    "home_record": "0-0",
                    "away_score": 0,
                    "home_score": 0,
                    "is_divisional": False,
                    "is_completed": False,
                    "date": display_date
                }
            ]
        else:
            # Playoff round placeholders
            weeks[w]["matchups"] = [
                {
                    "id": f"s2026_w{w}_m1",
                    "away_team": teams[(w + 1) % 8],
                    "home_team": teams[(w + 2) % 8],
                    "away_record": "SEED 6",
                    "home_record": "SEED 3",
                    "away_score": 0,
                    "home_score": 0,
                    "is_divisional": False,
                    "is_completed": False,
                    "date": display_date
                }
            ]

    print("Schedule generated successfully.")
    return weeks

if __name__ == "__main__":
    os.makedirs("backups/schedules", exist_ok=True)
    cache_file = "backups/schedules/season_2026.pkl"
    # Execute and cache the schedule
    schedule_data = pickle_wrap(cache_file, build_mock_season, easy_override=True)
    print(f"Saved to {cache_file}.")
