import asyncio
import json
import websockets

async def test_live_game_stream():
    uri = "ws://localhost:3000/ws/match/SAINTS"
    print(f"Connecting to live 60Hz WebSocket match stream at {uri}...")
    
    async with websockets.connect(uri) as websocket:
        # 1. Read initial Roster Manifest
        manifest_msg = await websocket.recv()
        print("Connected to WebSocket match stream!")
        if isinstance(manifest_msg, str):
            manifest = json.loads(manifest_msg)
            print(f"--> Roster Manifest Loaded: {len(manifest.get('players', []))} players registered.")

        # 2. Send PRE_SNAP command for play ari_38 (73 Sluggo Seam)
        print("\n--> Sending PRE_SNAP for Play ari_38 (73 Sluggo Seam)...")
        await websocket.send(json.dumps({"command": "PRE_SNAP", "play_id": "ari_38"}))
        
        # Read PRE_SNAP_READY response
        pre_snap_resp = await websocket.recv()
        if isinstance(pre_snap_resp, str):
            print(f"--> Server Response: {pre_snap_resp.strip()}")

        # 3. Send SNAP command to hike the ball & initiate play execution
        print("--> Sending SNAP command! Play in motion...")
        await websocket.send(json.dumps({"command": "SNAP"}))

        # 4. Stream live binary telemetry frames & game event notifications
        binary_frame_count = 0
        events_received = []

        for _ in range(400): # Stream up to 6.6 seconds of 60Hz simulation
            try:
                msg = await asyncio.wait_for(websocket.recv(), timeout=0.1)
                if isinstance(msg, bytes):
                    binary_frame_count += 1
                else:
                    event_data = json.loads(msg)
                    print(f"\n[LIVE GAME EVENT]: {event_data.get('event')} | Down: {event_data.get('down')} | Distance: {event_data.get('distance')}y | LOS: {event_data.get('los')}y")
                    print(f"   Scores - Offense: {event_data.get('offense_score')} | Defense: {event_data.get('defense_score')}")
                    events_received.append(event_data)
                    break
            except asyncio.TimeoutError:
                continue

        print(f"\n[OK] Play Execution Test Complete!")
        print(f"   Processed {binary_frame_count} raw 60Hz Int16 binary telemetry frames.")
        print(f"   Received {len(events_received)} play completion event notifications.")

if __name__ == "__main__":
    asyncio.run(test_live_game_stream())
