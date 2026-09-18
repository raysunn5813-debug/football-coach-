from fastapi import APIRouter
from pydantic import BaseModel, Field

router = APIRouter()

class PracticeRequest(BaseModel):
    drill_type: str = Field(..., example="Tactical Drill")

@router.get("")
@router.get("/")
@router.get("/status")
async def get_practice_status():
    return {
        "status": "success",
        "days_remaining": 5,
        "active_drill": "Tactical Drill",
        "fatigue": "Low"
    }

@router.post("/run")
async def run_practice(payload: PracticeRequest):
    return {
        "status": "success",
        "drill": payload.drill_type,
        "fatigue_change": "+5%",
        "attribute_boost": {"Derek Carr": "+1 Pass Acc", "Alvin Kamara": "+1 Speed"}
    }
