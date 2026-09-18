"""
backend/models/database_models.py
Updated SQLModel schema combining physical data and gameplay attributes.
"""
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship

class TeamModel(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    team_code: str = Field(index=True, unique=True)
    city: str
    name: str
    budget: int = 0
    wins: int = Field(default=0)
    losses: int = Field(default=0)
    ties: int = Field(default=0)

    players: List["PlayerModel"] = Relationship(back_populates="team")

class PlayerModel(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    player_id_str: str = Field(index=True, unique=True)
    
    # Free Agency Support (Optional team_id)
    team_id: Optional[int] = Field(default=None, foreign_key="teammodel.id")
    team: Optional[TeamModel] = Relationship(back_populates="players")
    
    # Core Info
    name: str
    position: str
    jersey_number: Optional[int] = None
    
    # 1. Physical & Bio Metadata (from ESPN)
    height_inches: int = 72
    weight_lbs: int = 200
    age: int = 25
    experience: int = 0
    college: Optional[str] = None
    salary: int = 0
    
    # 2. Gameplay Ratings (from Madden)
    overall: int = 80
    speed: int = 80
    strength: int = 80
    agility: int = 80
    change_of_direction: int = 80
    injury: int = 90
    awareness: int = 80
    ability: Optional[str] = None
