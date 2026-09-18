"""
backend/run.py
Primary startup script for the Uvicorn ASGI server.
"""
import uvicorn
import os
import sys

# Establish the exact paths to ensure imports resolve correctly
current_dir = os.path.dirname(os.path.abspath(__file__))

# If this file is inside /backend, make the parent directory the project root
if os.path.basename(current_dir) == "backend":
    project_root = os.path.dirname(current_dir)
else:
    project_root = current_dir

# Ensure the root project directory is first in sys.path
if project_root not in sys.path:
    sys.path.insert(0, project_root)

if __name__ == "__main__":
    print("Starting Gridiron Simulation Engine on port 3000...")
    # Point Uvicorn directly to the app instance inside backend/app/main.py
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=3000, reload=True)