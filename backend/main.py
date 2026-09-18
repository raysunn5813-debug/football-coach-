"""
backend/app/main.py
Main FastAPI application entry point with dynamic path resolution for static files.
"""
import os
import sys
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, RedirectResponse, Response
from fastapi.staticfiles import StaticFiles

app = FastAPI(title="Gridiron Simulation Engine")

# 1. Robust Dynamic Path Resolution
current_file = Path(__file__).resolve()

# Scan parent directories for 'frontend' to locate repo root
project_root = None
for parent in [current_file.parent, current_file.parent.parent, current_file.parent.parent.parent, Path.cwd()]:
    if (parent / "frontend").exists():
        project_root = parent
        break

if not project_root:
    project_root = current_file.parent.parent.parent

if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))

# 2. Database Initialization
try:
    from backend.database import init_db
    init_db()
except Exception as e:
    print(f"Database init info: {e}")

# 3. CORS Middleware Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. Include API and WebSocket Routers
try:
    from backend.routes.game_stream import router as game_stream_router
    app.include_router(game_stream_router, tags=["Match Stream"])
except Exception as e:
    print(f"Warning/Error loading game_stream router: {e}")

try:
    from backend.routes.playbook import router as playbook_router
    app.include_router(playbook_router, prefix="/api/playbook", tags=["Playbook"])
except Exception as e:
    print(f"Warning/Error loading playbook router: {e}")

try:
    from backend.routes.league import router as league_router
    app.include_router(league_router, prefix="/api/teams", tags=["Teams"])
    app.include_router(league_router, prefix="/api/league", tags=["League"])
except Exception as e:
    print(f"Warning/Error loading league router: {e}")

try:
    from backend.routes.staff import router as staff_router
    # staff.py already declares prefix="/api/staff" — do NOT add it again here
    app.include_router(staff_router)
except Exception as e:
    print(f"Warning/Error loading staff router: {e}")

try:
    from backend.routes.telemetry import router as telemetry_router
    # telemetry.py already declares prefix="/api/telemetry"
    app.include_router(telemetry_router)
except Exception as e:
    print(f"Warning/Error loading telemetry router: {e}")

try:
    from backend.routes.practice import router as practice_router
    app.include_router(practice_router, prefix="/api/practice", tags=["Practice"])
except Exception as e:
    print(f"Warning/Error loading practice router: {e}")

try:
    from backend.routes.schedule_routes import router as schedule_router
    app.include_router(schedule_router)
except Exception as e:
    print(f"Warning/Error loading schedule router: {e}")

# 5. Health Check Endpoint
@app.get("/api/health")
async def health_check():
    return {"status": "Engine is hot and ready."}

# 6. Root Route Handler
@app.get("/", include_in_schema=False)
async def root():
    """Serves index.html or redirects directly to gameday UI."""
    index_path = project_root / "frontend" / "index.html"
    if index_path.exists():
        return FileResponse(str(index_path))
    return RedirectResponse(url="/gameday.html")

# 7. Favicon handler
@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return Response(status_code=204)

# 8. Dynamic Static File Mounting
if project_root:
    frontend_dir = project_root / "frontend"
    engine_dir = project_root / "engine"
    shared_dir = project_root / "shared"

    if engine_dir.exists():
        app.mount("/engine", StaticFiles(directory=str(engine_dir)), name="engine")
        print(f"[OK] Mounted static engine from: {engine_dir}")

    if shared_dir.exists():
        app.mount("/shared", StaticFiles(directory=str(shared_dir)), name="shared")
        print(f"[OK] Mounted static shared catalog from: {shared_dir}")

    if frontend_dir.exists():
        app.mount("/", StaticFiles(directory=str(frontend_dir), html=True), name="frontend")
        print(f"[OK] Mounted static frontend from: {frontend_dir}")
else:
    print("[ERROR] Could not locate 'frontend' directory relative to project root!")