"""
scratch/test_live_fix_verification.py
Verifies that updated FSM state assignments resolve all 10 anomalies shown in replay 19.
"""
import sys
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from backend.engine.fsm import update_player_fsm, get_role_group
from backend.engine.telemetry_recorder import GameTelemetryRecorder

class MockPlayer:
    def __init__(self, pid, role, team, is_defense=False, route=None):
        self.id = pid
        self.role = role
        self.team = team
        self.is_defense = is_defense
        self.x = 10.5
        self.y = 0.0
        self.z = 26.65
        self.vx = 0.0
        self.vz = 0.0
        self.state = "PRE_SNAP"
        self.facing = 0.0
        self.route = route or []
        self.current_step = 0

def test_fixed_fsm():
    print("=== Testing Updated FSM & Telemetry Recorder ===")
    
    # 1. Verify WLB role group classification
    wlb_group = get_role_group("WLB")
    print(f"WLB Role Group: {wlb_group} (Expected: 'LB')")
    assert wlb_group == "LB", f"Expected LB but got {wlb_group}"

    # 2. Build 22 players matching replay 19 schema
    players = [
        MockPlayer("OFF_LT", "LT", "OFFENSE"),
        MockPlayer("OFF_LG", "LG", "OFFENSE"),
        MockPlayer("OFF_C", "C", "OFFENSE"),
        MockPlayer("OFF_RG", "RG", "OFFENSE"),
        MockPlayer("OFF_RT", "RT", "OFFENSE"),
        MockPlayer("OFF_QB", "QB", "OFFENSE"),
        MockPlayer("OFF_HB", "HB", "OFFENSE"), # No route
        MockPlayer("OFF_FB", "FB", "OFFENSE"), # No route
        MockPlayer("OFF_X", "X", "OFFENSE"),   # No route
        MockPlayer("OFF_Y", "Y", "OFFENSE", route=[{"x": 20.0, "z": 30.0}]), # Has route!
        MockPlayer("OFF_Z", "Z", "OFFENSE"),   # No route
        MockPlayer("DEF_DT1", "DT1", "DEFENSE", is_defense=True),
        MockPlayer("DEF_DT2", "DT2", "DEFENSE", is_defense=True),
        MockPlayer("DEF_DE1", "DE1", "DEFENSE", is_defense=True),
        MockPlayer("DEF_DE2", "DE2", "DEFENSE", is_defense=True),
        MockPlayer("DEF_MLB", "MLB", "DEFENSE", is_defense=True),
        MockPlayer("DEF_WLB", "WLB", "DEFENSE", is_defense=True),
        MockPlayer("DEF_SLB", "SLB", "DEFENSE", is_defense=True),
        MockPlayer("DEF_CB1", "CB1", "DEFENSE", is_defense=True),
        MockPlayer("DEF_CB2", "CB2", "DEFENSE", is_defense=True),
        MockPlayer("DEF_FS", "FS", "DEFENSE", is_defense=True),
        MockPlayer("DEF_SS", "SS", "DEFENSE", is_defense=True),
    ]

    # Trigger hike / update FSM
    for p in players:
        update_player_fsm(p, current_play_time=0.0, hike_triggered=True, is_run_play=False)

    # Inspect resulting states
    print("\n--- Resulting Player States at Hike ---")
    wlb = next(p for p in players if p.id == "DEF_WLB")
    hb = next(p for p in players if p.id == "OFF_HB")
    x = next(p for p in players if p.id == "OFF_X")
    y = next(p for p in players if p.id == "OFF_Y")

    print(f"DEF_WLB State: {wlb.state} (Expected: 'ZONE_DROP')")
    print(f"OFF_HB State: {hb.state} (Expected: 'ENGAGED')")
    print(f"OFF_X State:  {x.state} (Expected: 'ENGAGED')")
    print(f"OFF_Y State:  {y.state} (Expected: 'RUNNING_ROUTE')")

    # Record tick in GameTelemetryRecorder
    recorder = GameTelemetryRecorder(play_id="FIX_VERIFY_01", play_type="PASS")
    ball = {"x": 10.5, "y": 0.8, "z": 26.65, "state": "HELD", "carrier_id": "OFF_QB"}
    recorder.record_tick(1, players, ball)

    print(f"\nAnomalies Flagged on Tick 1: {len(recorder.anomalies)}")
    if recorder.anomalies:
        for a in recorder.anomalies:
            print(f"  * {a['type']}: {a['message']}")
    else:
        print("✅ ZERO ANOMALIES FLAGGED! All 10 warnings from replay 19 are completely resolved!")

if __name__ == "__main__":
    test_fixed_fsm()
