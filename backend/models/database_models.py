"""
backend/models/database_models.py
SQLModel definitions for persistent SQLite database storage.
"""
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List

class TeamModel(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    team_code: str = Field(index=True, unique=True) # e.g., "SAINTS"
    city: str
    name: str
    budget: int
    wins: int = Field(default=0)
    losses: int = Field(default=0)
    ties: int = Field(default=0)

    players: List["PlayerModel"] = Relationship(back_populates="team")

class PlayerModel(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    player_id_str: str = Field(index=True, unique=True) # e.g., "qb_1"
    name: str
    position: str
    overall: int
    speed: int
    strength: int
    awareness: int
    fatigue: int = Field(default=100)
    contract_salary: int

    team_id: Optional[int] = Field(default=None, foreign_key="teammodel.id")
    team: Optional[TeamModel] = Relationship(back_populates="players")