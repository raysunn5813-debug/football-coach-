"""
backend/models/schemas.py
Pydantic schemas for API payload validation and data transfer.
"""
from pydantic import BaseModel
from typing import List

class Vector3(BaseModel):
    x: float
    y: float
    z: float = 0.0

class Player(BaseModel):
    id: str
    role: str
    is_defense: bool
    position: Vector3
    
    # Flat velocity attributes (Optimized for binary packing)
    vx: float = 0.0
    vy: float = 0.0
    vz: float = 0.0
    rotY: float = 0.0
    
    # Engine State
    state: str = "IDLE"
    current_waypoint_index: int = 0
    route_waypoints: List[Vector3] = []
    
    # Tactical AI & Physics attributes
    head_turned: bool = False
    plant_timer: int = 0
    block_timer: int = 0
    stumble_timer: int = 0
    
    # Player Stats
    stamina: float = 100.0
    speed_attr: int = 75
    overall_attr: int = 75

class PlayCall(BaseModel):
    play_id: str
    offensive_formation: str = "Shotgun"
    defensive_formation: str = "4-3"

class GameState(BaseModel):
    line_of_scrimmage: float = 25.0
    down: int = 1
    distance: float = 10.0
    time_remaining: float = 900.0
    quarter: int = 1
    play_active: bool = False
    players: List[Player] = []