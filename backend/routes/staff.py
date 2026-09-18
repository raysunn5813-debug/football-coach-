"""
backend/routes/staff.py
Comprehensive Coaching Staff & Front Office Management API.
Supports Head Coach ratings (Offense/Defense split), Coordinators, Scout, Doctor, Psychologist, Analyst, and Play-Calling Delegation.
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict

router = APIRouter(prefix="/api/staff", tags=["Staff Management"])

class StaffHireRequest(BaseModel):
    coach_id: str
    role: str

class DelegationRequest(BaseModel):
    mode: str  # 'CALL_BOTH', 'CALL_OFFENSE', 'CALL_DEFENSE', 'DELEGATE_BOTH'

# In-Memory Active Coaching Staff Store
DEFAULT_STAFF = {
    "HEAD_COACH": {
        "id": "hc_01",
        "name": "Coach Marcus Vance",
        "role": "Head Coach",
        "title": "Head Coach (Offensive Mind)",
        "offense_rating": 84,
        "defense_rating": 52,
        "overall": 81,
        "specialty": "Offensive Architect",
        "salary": 3200000,
        "hired": True
    },
    "OFFENSIVE_COORD": {
        "id": "oc_01",
        "name": "Klint Kubiak",
        "role": "Offensive Coordinator",
        "title": "Offensive Coordinator",
        "offense_rating": 86,
        "defense_rating": 45,
        "overall": 84,
        "specialty": "Spread & Motion Passing",
        "salary": 1400000,
        "hired": True
    },
    "DEFENSIVE_COORD": {
        "id": "dc_01",
        "name": "Rex Ryan",
        "role": "Defensive Coordinator",
        "title": "Defensive Coordinator",
        "offense_rating": 42,
        "defense_rating": 88,
        "overall": 85,
        "specialty": "Aggressive 46 Blitz",
        "salary": 1500000,
        "hired": True
    },
    "SPECIAL_TEAMS": {
        "id": "st_01",
        "name": "Dave Fipp",
        "role": "Special Teams Coord.",
        "title": "Special Teams Coordinator",
        "offense_rating": 60,
        "defense_rating": 60,
        "overall": 79,
        "specialty": "Kick Return & Hangtime",
        "salary": 750000,
        "hired": True
    },
    "CHIEF_SCOUT": {
        "id": "sc_01",
        "name": "Will McClay",
        "role": "Chief Scout",
        "title": "Chief Scout",
        "scouting_rating": 91,
        "overall": 90,
        "specialty": "Draft Potential Evaluation",
        "salary": 900000,
        "hired": True
    },
    "TEAM_DOCTOR": {
        "id": "doc_01",
        "name": "Dr. James Andrews",
        "role": "Team Doctor",
        "title": "Head Team Physician",
        "medical_rating": 94,
        "overall": 93,
        "specialty": "+40% ACL & Soft Tissue Recovery",
        "salary": 800000,
        "hired": True
    },
    "SPORTS_PSYCH": {
        "id": "psy_01",
        "name": "Dr. Clete McLeod",
        "role": "Sports Psychologist",
        "title": "Lead Mental Performance Coach",
        "morale_rating": 88,
        "overall": 87,
        "specialty": "+15% 4th Quarter Comeback Energy",
        "salary": 650000,
        "hired": True
    },
    "DATA_ANALYST": {
        "id": "ana_01",
        "name": "Ernie Adams",
        "role": "Data Analyst",
        "title": "Director of Football Research",
        "analytics_rating": 95,
        "overall": 94,
        "specialty": "Predictive Tendency Matrix",
        "salary": 850000,
        "hired": True
    }
}

MARKETPLACE_CANDIDATES = [
    {
        "id": "hc_02",
        "name": "Bill Belichick",
        "role": "Head Coach",
        "title": "Head Coach (Defensive Mastermind)",
        "offense_rating": 68,
        "defense_rating": 96,
        "overall": 94,
        "specialty": "Sub-package Matchup Eraser",
        "salary": 4500000,
        "hired": False
    },
    {
        "id": "hc_03",
        "name": "Lincoln Riley",
        "role": "Head Coach",
        "title": "Head Coach (Air Raid Virtuoso)",
        "offense_rating": 95,
        "defense_rating": 48,
        "overall": 88,
        "specialty": "QB Development & Deep Vertical",
        "salary": 3800000,
        "hired": False
    },
    {
        "id": "oc_02",
        "name": "Ben Johnson",
        "role": "Offensive Coordinator",
        "title": "Offensive Coordinator",
        "offense_rating": 92,
        "defense_rating": 50,
        "overall": 90,
        "specialty": "Creative Play-Action Concepts",
        "salary": 2100000,
        "hired": False
    },
    {
        "id": "dc_02",
        "name": "Vic Fangio",
        "role": "Defensive Coordinator",
        "title": "Defensive Coordinator",
        "offense_rating": 40,
        "defense_rating": 94,
        "overall": 91,
        "specialty": "Two-High Shell Coverage",
        "salary": 2200000,
        "hired": False
    }
]

DELEGATION_SETTINGS = {
    "mode": "CALL_OFFENSE",  # Options: CALL_BOTH, CALL_OFFENSE, CALL_DEFENSE, DELEGATE_BOTH
    "description": "User calls Offensive plays; AI Defensive Coordinator calls Defense."
}

@router.get("")
@router.get("/")
@router.get("/staff")
async def get_staff_overview():
    return {
        "status": "success",
        "current_staff": DEFAULT_STAFF,
        "marketplace": MARKETPLACE_CANDIDATES,
        "delegation": DELEGATION_SETTINGS
    }

@router.post("/hire")
async def hire_coach(req: StaffHireRequest):
    candidate = next((c for c in MARKETPLACE_CANDIDATES if c["id"] == req.coach_id), None)
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found.")

    role_key = req.role.upper().replace(" ", "_")
    for k, staff_member in DEFAULT_STAFF.items():
        if staff_member["role"].upper().replace(" ", "_") == role_key or k == role_key:
            DEFAULT_STAFF[k] = candidate
            candidate["hired"] = True
            return {
                "status": "success",
                "message": f"Successfully hired {candidate['name']} as {candidate['role']}.",
                "staff": DEFAULT_STAFF
            }

    raise HTTPException(status_code=400, detail="Invalid staff role specified.")

@router.post("/delegation")
async def update_delegation(req: DelegationRequest):
    valid_modes = {
        "CALL_BOTH": "User calls both Offense & Defense plays.",
        "CALL_OFFENSE": "User calls Offense; AI DC calls Defense.",
        "CALL_DEFENSE": "User calls Defense; AI OC calls Offense.",
        "DELEGATE_BOTH": "AI OC & DC call both units (Head Coach Oversight Mode)."
    }

    if req.mode not in valid_modes:
        raise HTTPException(status_code=400, detail="Invalid delegation mode.")

    DELEGATION_SETTINGS["mode"] = req.mode
    DELEGATION_SETTINGS["description"] = valid_modes[req.mode]

    return {
        "status": "success",
        "delegation": DELEGATION_SETTINGS
    }
