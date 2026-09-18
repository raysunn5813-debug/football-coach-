"""
server/routes/schedule.py
Re-exports backend schedule_routes API endpoints.
"""
from backend.routes.schedule_routes import router, manager

__all__ = ["router", "manager"]
