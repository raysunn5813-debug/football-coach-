"""
backend/app/main.py
Main FastAPI application entry point. Unified and consolidated.
"""
import sys
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")
from pathlib import Path
from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles

# 1. Resolve Project Root & Add to sys.path
current_file = Path(__file__).resolve()
project_root = None
for parent in [current_file.parent, current_file.parent.parent, current_file.parent.parent.parent, Path.cwd()]:
    if (parent / "frontend").exists():
        project_root = parent
        break

if project_root and str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))

app = FastAPI(title="Gridiron Simulation Engine")

# 2. CORS Middleware Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Health Check & Favicon
@app.get("/api/health")
async def health_check():
    return {"status": "Engine is hot, unified, and ready."}

@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return Response(status_code=204)

# 4. Include API and WebSocket Routers (STRICTLY FROM BACKEND)
try:
    from backend.routes import game_stream, playbook, schedule_routes, telemetry, staff, league, practice

    app.include_router(game_stream.router)
    app.include_router(playbook.router, prefix="/api/playbook", tags=["Playbook"])
    app.include_router(schedule_routes.router)
    app.include_router(telemetry.router)
    app.include_router(staff.router)
    app.include_router(league.router, prefix="/api/teams", tags=["Teams"])
    app.include_router(league.router, prefix="/api/league", tags=["League"])
    app.include_router(practice.router, prefix="/api/practice", tags=["Practice"])
    print("✅ Successfully loaded all backend API & WebSocket routers.")
except Exception as e:
    print(f"⚠️ Warning/Error loading routers: {e}")

# 5. Root Route Handler
@app.get("/")
async def root():
    """Redirects root URL requests directly to the gameday UI."""
    return RedirectResponse(url="/gameday.html")

class SafeStaticFiles(StaticFiles):
    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            if scope["type"] == "websocket":
                await send({"type": "websocket.close", "code": 4004})
            return
        await super().__call__(scope, receive, send)

# 6. Static File Mounting
if project_root:
    engine_dir = project_root / "engine"
    shared_dir = project_root / "shared"
    frontend_dir = project_root / "frontend"

    if engine_dir.exists():
        app.mount("/engine", SafeStaticFiles(directory=str(engine_dir)), name="engine")
        print(f"✅ Mounted static engine from: {engine_dir}")

    if shared_dir.exists():
        app.mount("/shared", SafeStaticFiles(directory=str(shared_dir)), name="shared")
        print(f"✅ Mounted static shared catalog from: {shared_dir}")

    if frontend_dir.exists():
        app.mount("/", SafeStaticFiles(directory=str(frontend_dir), html=True), name="frontend")
        print(f"✅ Mounted static frontend from: {frontend_dir}")
else:
    print("❌ CRITICAL ERROR: Could not locate 'frontend' directory relative to project root!")