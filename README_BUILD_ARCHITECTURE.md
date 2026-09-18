# Gridiron Simulation Engine - Unified Build & File Structure Architecture

**Date**: July 31, 2026  
**Backup Folder**: `backups/UNIFIED_BUILD_BACKUP_20260731/`

---

## ⚠️ CRITICAL NOTICE: File System Update & Legacy Purge

1. **The `server/` Directory Has Been Permanently Nuked**:
   - All duplicate logic, models, database schemas, and routes previously in `server/` have been consolidated into `backend/`.
   - **DO NOT** recreate or reference the `server/` directory.

2. **Active Folders to Use for the New Build**:

   | Folder / Path | Purpose & Description |
   |---|---|
   | `backend/` | **Primary Server Backend** (FastAPI app in `backend/app/main.py`, database models in `backend/models/` & `backend/database_models.py`, routes in `backend/routes/`, startup entry point `backend/run.py`). |
   | `frontend/` | **User Interface** (Static HTML, CSS, JavaScript files including `gameday.html`, `playbook.html`, `franchise.html`, etc.). |
   | `engine/` | **60Hz Physics & Simulation Engine** (Physics solver, FSM, route calculations, quarterback logic, collision detection). |
   | `shared/` | **Shared Assets & Catalogs** (Shared play database, team definitions, schemas, constants). |
   | `assets/` | **Media & Graphic Assets** (Sprites, turf textures, UI icons). |
   | `franchise.db` | **SQLite Database** (Stores league rosters, team states, game results). |

3. **Legacy / Spec Archive Folders (Not Used by Active App Server)**:
   - `defensive playbook/`, `defensive scouting/`, `offensive playbooks/`, `GAME_SPEC.md/`, `rules/`, `idea/`: Reference archives and game specifications.

---

## 🚀 How to Launch the Unified Application

To start the unified simulation engine:

```powershell
& "C:\football coach\.venv\Scripts\python.exe" "backend/run.py"
```

- **Server Port**: `http://localhost:3000`
- **Root Redirect**: Accessing `http://localhost:3000/` automatically redirects to `/gameday.html`.
- **Health Check**: `http://localhost:3000/api/health` returns `{"status": "Engine is hot, unified, and ready."}`.
