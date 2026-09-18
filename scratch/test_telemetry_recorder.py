import sys
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
import os

# Push root directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.engine.telemetry_recorder import GameTelemetryRecorder

class DummyPlayer:
    def __init__(self, pid, role, team, x, y, state):
        self.id = pid
        self.role = role
        self.team = team
        self.x = x
        self.y = y
        self.z = y
        self.vx = 0.0
        self.vz = 0.0
        self.state = state
        self.facing = 0.0
        self.route = []
        self.current_step = 0
        self.zone_anchor = (0.0, 0.0)

def run_synthetic_test():
    print("--- Starting Telemetry Recorder Scratch Verification ---")
    recorder = GameTelemetryRecorder(play_id="TEST_PLAY_99", play_type="RUN")
    recorder.log_event(0, "PRE_SNAP")
    recorder.log_event(5, "SNAP")

    # Mock Entities
    qb = DummyPlayer("QB1", "QB", "OFFENSE", 25.0, 20.0, "DROPBACK") # Synthetic Mismatch (RUN play, QB DROPBACK)
    wr1 = DummyPlayer("WR1", "WR", "OFFENSE", 25.0, 5.0, "RUNNING_ROUTE") # Synthetic Route Disconnect (No waypoints)
    cb1 = DummyPlayer("CB1", "CB", "DEFENSE", 30.0, 5.0, "HOLDING_ZONE") # Synthetic Stagnation (anchor is 0,0)

    players = [qb, wr1, cb1]
    
    # Mock Ball separated from carrier
    ball = {"x": 30.0, "y": 20.0, "z": 20.0, "carrier_id": "QB1"} # Ball at 30, QB at 25 -> 5yd gap

    for tick in range(1, 181):
        recorder.record_tick(tick, players, ball)

    filepath = recorder.export_replay()
    print(f"\n[SUCCESS] Replay file created at: {filepath}")
    print(f"Total Ticks Captured: {len(recorder.ticks)}")
    print(f"Anomalies Flagged: {len(recorder.anomalies)}")
    
    print("\n--- Detected Anomaly Summary ---")
    for a in recorder.anomalies:
        print(f"  * [Tick {a['tick']:03d}] {a['type']}: {a['message']}")

if __name__ == "__main__":
    run_synthetic_test()
