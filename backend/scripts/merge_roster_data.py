"""
backend/scripts/merge_roster_data.py
Merges ESPN bio data and Madden ratings into the local database.
"""
import sys
import os

# 1. Pathing Fix: Force Python to recognize the root project directory
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(os.path.dirname(current_dir))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

import json
import urllib.request
import re
from sqlmodel import Session, select

# 2. Engine Imports
from backend.database import engine  # type: ignore
from backend.database_models import TeamModel, PlayerModel  # type: ignore

def parse_height_to_inches(ht_str: str) -> int:
    """Converts '6\' 5"' -> 77 inches."""
    try:
        match = re.search(r"(\d+)'\s*(\d+)", str(ht_str))
        if match:
            feet, inches = map(int, match.groups())
            return (feet * 12) + inches
    except Exception:
        pass
    return 72

def parse_weight_lbs(wt_str: str) -> int:
    """Converts '237 lbs' -> 237."""
    try:
        nums = re.findall(r"\d+", str(wt_str))
        if nums:
            return int(nums[0])
    except Exception:
        pass
    return 200

def parse_currency(salary_str: str) -> int:
    """Converts '$38,500,000' -> 38500000."""
    try:
        cleaned = re.sub(r"[^\d]", "", str(salary_str))
        return int(cleaned) if cleaned else 0
    except Exception:
        return 0

def fetch_espn_roster_details(espn_team_id: str):
    """Fetches detailed bio data from ESPN."""
    url = f"https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/{espn_team_id}?enable=roster"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            athletes = []
            for group in data.get("team", {}).get("athletes", []):
                for item in group.get("items", []):
                    athletes.append(item)
            return athletes
    except Exception as e:
        print(f"ESPN API fetch failed for team {espn_team_id}: {e}")
        return []

def sync_espn_and_madden(team_code: str, espn_team_id: str, madden_ratings_list: list):
    """
    1. Creates base player records from ESPN (Bio/Physicals).
    2. Enriches records with Madden attributes where names match.
    """
    with Session(engine) as session:
        # Fetch or create team
        team = session.exec(select(TeamModel).where(TeamModel.team_code == team_code)).first()
        if not team:
            team = TeamModel(name=f"{team_code} Team", team_code=team_code, city=team_code)
            session.add(team)
            session.commit()
            session.refresh(team)

        madden_lookup = { p["PLAYER"].lower().strip(): p for p in madden_ratings_list }
        espn_athletes = fetch_espn_roster_details(espn_team_id)

        for ath in espn_athletes:
            full_name = ath.get("fullName", "Unknown Player")
            p_id_str = f"{team_code}_{ath.get('id', '0')}"

            player = session.exec(select(PlayerModel).where(PlayerModel.player_id_str == p_id_str)).first()
            if not player:
                player = PlayerModel(player_id_str=p_id_str, team_id=team.id, name=full_name, position="ATH")

            # --- 1. Populate ESPN Bio Data ---
            player.team_id = team.id
            player.position = ath.get("position", {}).get("abbreviation", "ATH")
            player.jersey_number = int(ath.get("jersey", 0)) if str(ath.get("jersey")).isdigit() else None
            player.height_inches = parse_height_to_inches(ath.get("displayHeight", "6' 0\""))
            player.weight_lbs = parse_weight_lbs(ath.get("displayWeight", "200 lbs"))
            player.age = ath.get("age", 25)
            player.experience = ath.get("experience", {}).get("years", 0)
            player.college = ath.get("college", {}).get("name", "N/A")
            
            # --- 2. Overlay Madden Ratings ---
            madden_match = madden_lookup.get(full_name.lower().strip())
            if madden_match:
                player.overall = madden_match.get("OVR", 80)
                player.speed = madden_match.get("SPD", 80)
                player.strength = madden_match.get("STR", 80)
                player.agility = madden_match.get("AGI", 80)
                player.change_of_direction = madden_match.get("COD", 80)
                player.injury = madden_match.get("INJ", 90)
                player.awareness = madden_match.get("AWR", 80)
                player.ability = madden_match.get("ABILITY")

            session.add(player)

        session.commit()
        print(f"Successfully merged ESPN & Madden rosters for {team_code}!")

if __name__ == "__main__":
    # Mapping of all 32 NFL Teams: { "Team Code": "ESPN_ID" }
    NFL_TEAMS = {
        "ATL": "1", "BUF": "2", "CHI": "3", "CIN": "4", "CLE": "5",
        "DAL": "6", "DEN": "7", "DET": "8", "GB": "9", "TEN": "10",
        "IND": "11", "KC": "12", "LV": "13", "LAR": "14", "MIA": "15",
        "MIN": "16", "NE": "17", "NO": "18", "NYG": "19", "NYJ": "20",
        "PHI": "21", "ARI": "22", "PIT": "23", "LAC": "24", "SF": "25",
        "SEA": "26", "TB": "27", "WAS": "28", "CAR": "29", "JAX": "30",
        "BAL": "33", "HOU": "34"
    }

    print("Initiating full league roster sync...")
    
    for team_code, espn_id in NFL_TEAMS.items():
        print(f"Downloading data for {team_code}...")
        # Note: Pass your loaded Madden JSON list here if available, 
        # otherwise passing [] fetches the baseline physicals.
        sync_espn_and_madden(team_code, espn_id, [])
        
    print("Full 32-team league sync complete. Your SQLite database is ready for gameday.")