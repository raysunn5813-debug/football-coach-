"""Test get_role_group edge cases the report missed."""
import sys
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from backend.engine.fsm import get_role_group, update_player_fsm

roles = ["WLB", "MLB", "SLB", "WR1", "X", "HB", "LT", "BSG", "BST", "DE1"]
print("=== Role group mapping ===")
for role in roles:
    print(f"  {role:5} -> {get_role_group(role)}")

print("\n=== Post-SNAP states ===")
for role in ["WLB", "MLB", "SLB"]:
    p = {"role": role, "state": "PRE_SNAP", "route_waypoints": []}
    update_player_fsm(p, 0.0, hike_triggered=True)
    print(f"  {role} -> {p['state']}")
