import os
import sys
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
import json
from pathlib import Path

REPLAY_DIR = Path(r"C:\football coach\results_save\replays")

def inspect_all_replays():
    files = sorted(list(REPLAY_DIR.glob("*.json")), key=lambda p: p.stat().st_mtime, reverse=True)
    print(f"==================================================")
    print(f"📂 TOTAL REPLAY FILES FOUND: {len(files)}")
    print(f"==================================================\n")

    for f in files:
        try:
            with open(f, "r", encoding="utf-8") as file:
                data = json.load(file)
            
            meta = data.get("metadata", {})
            events = data.get("events", [])
            anomalies = data.get("anomalies", [])

            play_id = meta.get("play_id", "UNKNOWN")
            play_type = meta.get("play_type", "UNKNOWN")
            ticks = meta.get("total_ticks", 0)
            anomaly_cnt = meta.get("anomaly_count", len(anomalies))

            print(f"📄 File: {f.name}")
            print(f"   - Play ID: {play_id} | Type: {play_type} | Ticks: {ticks} | Anomalies: {anomaly_cnt}")
            if events:
                evt_summary = ", ".join([f"{e['event']}@t={e['tick']}" for e in events])
                print(f"   - Events: {evt_summary}")
            if anomalies:
                print(f"   - Anomaly Messages:")
                for a in anomalies:
                    print(f"     * [Tick {a.get('tick', '?')}] {a.get('type', 'WARNING')}: {a.get('message', 'No message')}")
            else:
                print(f"   - ✨ ZERO ANOMALIES (Clean Execution!)")
            print("-" * 60)
        except Exception as err:
            print(f"❌ Error reading {f.name}: {err}")

if __name__ == "__main__":
    inspect_all_replays()
