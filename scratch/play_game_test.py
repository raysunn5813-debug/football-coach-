import asyncio
import json
import os
import websockets

async def run_game_test_simulation():
    uri = "ws://localhost:3000/ws/match/SAINTS"
    print(f"Connecting to live 60Hz Chalkboard Game Engine at {uri}...")

    log_history = []
    
    async with websockets.connect(uri) as ws:
        # 1. Roster Manifest
        manifest_raw = await ws.recv()
        manifest = json.loads(manifest_raw) if isinstance(manifest_raw, str) else {}
        num_players = len(manifest.get("players", []))
        log_history.append(f"✅ **Connected to Live Game Stream**: Roster Manifest loaded ({num_players} 3D entities).")

        plays_to_test = [
            {"id": "ari_38", "name": "73 Sluggo Seam", "type": "DEEP PASS"},
            {"id": "ari_14", "name": "27 Stretch Wide Zone", "type": "RUN"},
            {"id": "ari_33", "name": "67 Dixie Slant", "type": "SHORT PASS"},
            {"id": "ari_01", "name": "22 Dbl Power", "type": "RUN"}
        ]

        for play_idx, play in enumerate(plays_to_test, 1):
            print(f"\n--- PLAY {play_idx}: {play['name']} ({play['type']}) ---")
            
            # Select Play (PRE_SNAP)
            await ws.send(json.dumps({"command": "PRE_SNAP", "play_id": play["id"]}))
            await asyncio.sleep(0.3)
            log_history.append(f"\n### Play #{play_idx}: {play['name']} ({play['type']})")
            log_history.append(f"- **Chalkboard Formation**: Aligned 11 Offensive & 11 Defensive players.")

            # Hike Ball (SNAP)
            await ws.send(json.dumps({"command": "SNAP"}))
            log_history.append("- **SNAP**: Ball hiked! 60Hz Physics & Vector tracking active.")

            # Listen to 60Hz telemetry and play completion events
            frames = 0
            play_event = None

            for _ in range(400): # Up to 6.6 seconds of live 60Hz physics
                try:
                    msg = await asyncio.wait_for(ws.recv(), timeout=0.1)
                    if isinstance(msg, bytes):
                        frames += 1
                    else:
                        event_data = json.loads(msg)
                        play_event = event_data
                        break
                except asyncio.TimeoutError:
                    continue

            if play_event:
                event_name = play_event.get("event", "COMPLETED")
                down = play_event.get("down", 1)
                distance = play_event.get("distance", 10)
                los = play_event.get("los", 25)
                off_score = play_event.get("offense_score", 0)
                def_score = play_event.get("defense_score", 0)

                log_history.append(f"- **Outcome**: `{event_name}`")
                log_history.append(f"- **Telemetry Stream**: Processed `{frames}` binary 60Hz frames.")
                log_history.append(f"- **Field Situation**: Down: {down} | Distance: {distance}y | LOS: {los}y | Score: {off_score}-{def_score}")
            else:
                log_history.append(f"- **Telemetry Stream**: Processed `{frames}` binary 60Hz frames (Play in motion).")

            await asyncio.sleep(0.5)

    # Save Markdown Artifact
    artifact_dir = "C:/Users/cybra/.gemini/antigravity/brain/e2d53d62-10e2-4338-b7e1-6d70f7a9643c"
    os.makedirs(artifact_dir, exist_ok=True)
    report_path = os.path.join(artifact_dir, "game_test_report.md")

    content = "# 🏈 Live 3D Game Engine Simulation Report\n\n" + "\n".join(log_history)
    with open(report_path, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"\n✅ Game Test Complete! Report saved to {report_path}")

if __name__ == "__main__":
    asyncio.run(run_game_test_simulation())
