from fastapi import APIRouter

router = APIRouter()

@router.get("/standings")
async def get_league_standings():
    return {
        "AFCEast": [{"name": "Buffalo Bills", "wins": 7, "losses": 2}, {"name": "New York Jets", "wins": 3, "losses": 6}],
        "NFCSouth": [{"name": "Atlanta Falcons", "wins": 6, "losses": 3}, {"name": "New Orleans Saints", "wins": 2, "losses": 7}]
    }

@router.post("/advance-week")
async def advance_week():
    return {"status": "success", "current_week": 11, "simulated_games": 15}

DEFAULT_SAINTS_STARTERS = [
    { "name": "Derek Carr", "pos": "QB", "status": "Healthy", "style": "Field General", "ovr": 80, "spd": 74, "acc": 78, "cat": 45, "pwr": 89, "passAcc": 83, "tak": 28, "str": 62 },
    { "name": "Alvin Kamara", "pos": "RB", "status": "Healthy", "style": "Receiving Back", "ovr": 86, "spd": 89, "acc": 92, "cat": 85, "pwr": 58, "passAcc": 30, "tak": 35, "str": 70 },
    { "name": "Chris Olave", "pos": "WR1", "status": "Healthy", "style": "Deep Threat", "ovr": 87, "spd": 93, "acc": 94, "cat": 89, "pwr": 35, "passAcc": 25, "tak": 25, "str": 55 },
    { "name": "Rashid Shaheed", "pos": "WR2", "status": "Healthy", "style": "Speedster", "ovr": 81, "spd": 96, "acc": 95, "cat": 82, "pwr": 30, "passAcc": 20, "tak": 20, "str": 50 },
    { "name": "Taysom Hill", "pos": "TE", "status": "Healthy", "style": "Power Athlete", "ovr": 79, "spd": 87, "acc": 88, "cat": 76, "pwr": 75, "passAcc": 70, "tak": 65, "str": 84 },
    { "name": "Cameron Jordan", "pos": "DE", "status": "Healthy", "style": "Power Rusher", "ovr": 83, "spd": 76, "acc": 81, "cat": 40, "pwr": 30, "passAcc": 20, "tak": 86, "str": 90 },
    { "name": "Demario Davis", "pos": "LB", "status": "Healthy", "style": "Field General", "ovr": 89, "spd": 84, "acc": 87, "cat": 68, "pwr": 35, "passAcc": 25, "tak": 92, "str": 86 },
    { "name": "Marshon Lattimore", "pos": "CB1", "status": "Healthy", "style": "Man Lock Down", "ovr": 88, "spd": 92, "acc": 93, "cat": 72, "pwr": 25, "passAcc": 15, "tak": 76, "str": 68 },
    { "name": "Tyrann Mathieu", "pos": "FS", "status": "Healthy", "style": "Ball Hawk", "ovr": 85, "spd": 87, "acc": 89, "cat": 80, "pwr": 30, "passAcc": 20, "tak": 82, "str": 66 }
]

DEFAULT_SAINTS_BENCH = [
    { "name": "Spencer Rattler", "pos": "QB", "status": "Backup", "style": "Scrambler", "ovr": 71, "spd": 82, "acc": 85, "cat": 40, "pwr": 85, "passAcc": 74, "tak": 25, "str": 60 },
    { "name": "Kendre Miller", "pos": "RB", "status": "Backup", "style": "Power Back", "ovr": 75, "spd": 88, "acc": 90, "cat": 68, "pwr": 40, "passAcc": 20, "tak": 30, "str": 78 },
    { "name": "Chase Young", "pos": "DE", "status": "Backup", "style": "Speed Rusher", "ovr": 81, "spd": 85, "acc": 88, "cat": 30, "pwr": 25, "passAcc": 15, "tak": 82, "str": 86 },
    { "name": "Kool-Aid McKinstry", "pos": "CB", "status": "Backup", "style": "Zone Hawk", "ovr": 76, "spd": 91, "acc": 92, "cat": 74, "pwr": 20, "passAcc": 15, "tak": 70, "str": 62 }
]

@router.get("/{team_id}/roster")
async def get_team_roster(team_id: str):
    return {
        "team_id": team_id,
        "budget": 5000000,
        "starters": DEFAULT_SAINTS_STARTERS,
        "bench": DEFAULT_SAINTS_BENCH
    }

