"""
backend/routes/schedule_routes.py
API Endpoints for Season Matchups and League Standings.
"""
from fastapi import APIRouter
from backend.engine.schedule_engine import SeasonScheduleManager

router = APIRouter(prefix="/api/schedule", tags=["Schedule"])
manager = SeasonScheduleManager(season_year=2026)

@router.get("/week/{week_num}")
async def get_weekly_matchups(week_num: int):
    """Returns all matchups and bye teams for a given week (1-22)."""
    return manager.get_week(week_num)

@router.get("/playoffs")
async def get_playoff_picture():
    """Returns matchups for Weeks 19 through 22."""
    playoffs = {}
    for w in range(19, 23):
        playoffs[w] = manager.get_week(w)
    return playoffs
