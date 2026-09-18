"""
backend/engine/schedule_engine.py
Handles 18-Week Regular Season + 4-Round Playoff Scheduling with Pickle Caching.
"""
import os
import pickle
from datetime import datetime, timedelta

def pickle_wrap(filename: str, callback, easy_override: bool = False):
    """Caches expensive schedule generation outputs to disk using Pickle."""
    if os.path.isfile(filename) and not easy_override:
        with open(filename, "rb") as file:
            return pickle.load(file)
    else:
        output = callback()
        os.makedirs(os.path.dirname(filename), exist_ok=True)
        with open(filename, "wb") as new_file:
            pickle.dump(output, new_file)
        return output


def get_date_mapping(start_date_str: str) -> dict:
    """
    Maps 22 NFL weeks (18 Regular Season + 4 Playoff rounds) 
    to accurate calendar dates starting from a Thursday launch date.
    """
    start_date = datetime.strptime(start_date_str, "%Y-%m-%d")
    date_mapping = {}

    for week in range(1, 23):
        thursday = start_date + timedelta(weeks=week - 1)
        sunday = thursday + timedelta(days=3)
        monday = thursday + timedelta(days=4)

        date_mapping[week] = {
            "thursday": thursday.strftime("%b %d, %Y"),
            "sunday": sunday.strftime("%b %d, %Y"),
            "monday": monday.strftime("%b %d, %Y"),
            "display_date": sunday.strftime("%b %d")
        }
    return date_mapping


def get_round_name(week_num: int) -> str:
    """Converts a numerical week into standard NFL season designations."""
    if week_num <= 18:
        return f"Regular Season — Week {week_num}"
    elif week_num == 19:
        return "Wildcard Round"
    elif week_num == 20:
        return "Divisional Round"
    elif week_num == 21:
        return "Conference Finals"
    elif week_num == 22:
        return "Championship Super Bowl"
    return "Offseason"


class SeasonScheduleManager:
    """Generates and manages matchups across all 22 weeks of a season."""

    def __init__(self, season_year: int = 2026, start_date: str = "2026-09-10"):
        self.season_year = season_year
        self.start_date = start_date
        self.cache_file = f"backups/schedules/season_{season_year}.pkl"
        
        # Load from pickle cache or build fresh
        self.schedule_data = pickle_wrap(
            self.cache_file, 
            self._generate_full_season
        )

    def _generate_full_season(self) -> dict:
        date_map = get_date_mapping(self.start_date)
        weeks = {}

        # Default team pairs for demonstration (Expandable to full 32-team roster)
        sample_matchups = [
            {"away": "GB", "home": "CHI", "is_divisional": True},
            {"away": "NE", "home": "NYJ", "is_divisional": True},
            {"away": "DAL", "home": "NYG", "is_divisional": True},
            {"away": "KC",  "home": "LV",  "is_divisional": True},
            {"away": "SF",  "home": "SEA", "is_divisional": True},
            {"away": "ATL", "home": "NO",  "is_divisional": True},
        ]

        for w in range(1, 23):
            round_label = get_round_name(w)
            weeks[w] = {
                "week_number": w,
                "round_name": round_label,
                "date": date_map[w]["display_date"],
                "matchups": [],
                "byes": []
            }

            # Populate regular season games (Weeks 1-18)
            if w <= 18:
                for idx, m in enumerate(sample_matchups):
                    weeks[w]["matchups"].append({
                        "id": f"s{self.season_year}_w{w}_m{idx+1}",
                        "week_number": w,
                        "away_team": m["away"],
                        "home_team": m["home"],
                        "away_record": "0-0",
                        "home_record": "0-0",
                        "away_score": None,
                        "home_score": None,
                        "is_divisional": m["is_divisional"],
                        "is_completed": False,
                        "date": date_map[w]["display_date"]
                    })
            else:
                # Playoff placeholders (TBD until regular season completes)
                weeks[w]["matchups"].append({
                    "id": f"s{self.season_year}_w{w}_m1",
                    "week_number": w,
                    "away_team": "TBD",
                    "home_team": "TBD",
                    "away_record": "SEED 6",
                    "home_record": "SEED 3",
                    "away_score": None,
                    "home_score": None,
                    "is_divisional": False,
                    "is_completed": False,
                    "date": date_map[w]["display_date"]
                })

        return weeks

    def get_week(self, week_num: int) -> dict:
        return self.schedule_data.get(week_num, {})
