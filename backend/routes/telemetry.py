"""
backend/routes/telemetry.py
API endpoints for listing and retrieving black-box telemetry replays.
"""
import os
import json
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

router = APIRouter(prefix="/api/telemetry", tags=["Telemetry"])
REPLAY_DIR = os.path.join(os.getcwd(), "results_save", "replays")

@router.get("/replays")
def list_replays():
    """Lists all available replay files with metadata summary."""
    if not os.path.exists(REPLAY_DIR):
        return {"replays": []}

    replays = []
    for fname in os.listdir(REPLAY_DIR):
        if fname.endswith(".json"):
            fpath = os.path.join(REPLAY_DIR, fname)
            try:
                with open(fpath, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    replays.append({
                        "filename": fname,
                        "metadata": data.get("metadata", {})
                    })
            except Exception:
                continue

    return {"replays": sorted(replays, key=lambda x: x["filename"], reverse=True)}

@router.get("/replay/{filename}")
def download_replay(filename: str):
    """Downloads a complete frame-by-frame replay file."""
    filepath = os.path.join(REPLAY_DIR, filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="Replay file not found.")
    return FileResponse(
        filepath,
        media_type="application/octet-stream",
        filename=filename,
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )
