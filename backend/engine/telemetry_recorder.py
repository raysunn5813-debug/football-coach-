"""
backend/engine/telemetry_recorder.py
Black-box recording and diagnostic system for the Gridiron Engine.
Captures tick-by-tick entity telemetry, detects wire-up anomalies, and serializes replay data to disk.
"""
import os
import sys
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
import json
import math
from datetime import datetime

import re

class GameTelemetryRecorder:
    def __init__(self, play_id: str, play_name: str = "", play_type: str = "PASS"):
        self.play_id = str(play_id)
        self.play_name = str(play_name or play_id)
        self.play_type = str(play_type).upper()  # 'RUN' or 'PASS'
        self.start_time = datetime.now().isoformat()
        self.ticks = []
        self.events = []
        self.anomalies = []

        # Ensure export directory exists
        self.export_dir = os.path.join(os.getcwd(), "results_save", "replays")
        os.makedirs(self.export_dir, exist_ok=True)

    def log_event(self, tick: int, event_type: str, details: dict = None):
        """Logs discrete play milestones (e.g., SNAP, HANDOFF, PASS_RELEASE, TACKLE)."""
        self.events.append({
            "tick": tick,
            "event": event_type,
            "details": details or {},
            "timestamp": datetime.now().isoformat()
        })
        print(f"📡 [TELEMETRY] Tick {tick:03d} | {event_type} | {details or ''}")

    def record_tick(self, tick: int, players: list, ball: dict):
        """
        Captures 60Hz entity telemetry and runs real-time Wire-up Inspector checks.
        Supports dicts, object instances, and player attribute mapping.
        """
        frame_data = {
            "tick": tick,
            "ball": {
                "x": round(float(ball.get("x", getattr(ball, "x", 0.0))), 3) if isinstance(ball, dict) else round(float(getattr(ball, "x", 0.0)), 3),
                "y": round(float(ball.get("y", getattr(ball, "y", 0.0))), 3) if isinstance(ball, dict) else round(float(getattr(ball, "y", 0.0)), 3),
                "z": round(float(ball.get("z", getattr(ball, "z", 0.0))), 3) if isinstance(ball, dict) else round(float(getattr(ball, "z", 0.0)), 3),
                "state": ball.get("state", getattr(ball, "state", "HELD")) if isinstance(ball, dict) else getattr(ball, "state", "HELD"),
                "carrier_id": ball.get("carrier_id", getattr(ball, "carrier_id", None)) if isinstance(ball, dict) else getattr(ball, "carrier_id", None)
            },
            "players": []
        }

        ball_carrier_id = frame_data["ball"]["carrier_id"]
        carrier_player = None

        for p in players:
            is_dict = isinstance(p, dict)
            p_id = p.get("id", str(p)) if is_dict else getattr(p, "id", str(p))
            role = p.get("role", "UNKNOWN") if is_dict else getattr(p, "role", "UNKNOWN")
            team = ("DEFENSE" if p.get("is_defense") else "OFFENSE") if is_dict else ("DEFENSE" if getattr(p, "is_defense", False) else getattr(p, "team", "OFFENSE"))
            px = float(p.get("x", 0.0)) if is_dict else float(getattr(p, "x", 0.0))
            py = float(p.get("y", 0.0)) if is_dict else float(getattr(p, "y", 0.0))
            pz = float(p.get("z", py)) if is_dict else float(getattr(p, "z", getattr(p, "y", 0.0)))
            vx = float(p.get("vx", 0.0)) if is_dict else float(getattr(p, "vx", 0.0))
            vz = float(p.get("vz", 0.0)) if is_dict else float(getattr(p, "vz", 0.0))
            state = p.get("state", "IDLE") if is_dict else getattr(p, "state", "IDLE")
            facing = float(p.get("facing", 0.0)) if is_dict else float(getattr(p, "facing", 0.0))

            p_data = {
                "id": p_id,
                "role": role,
                "team": team,
                "x": round(px, 3),
                "y": round(py, 3),
                "z": round(pz, 3),
                "vx": round(vx, 3),
                "vz": round(vz, 3),
                "state": state,
                "facing": round(facing, 2)
            }
            frame_data["players"].append(p_data)

            if p_id == ball_carrier_id or state == "BALL_CARRIER":
                carrier_player = p_data

            # Inspector Check 1: Route Disconnect (Player running route with no waypoints)
            waypoints = p.get("route_waypoints", p.get("route", [])) if is_dict else getattr(p, "route_waypoints", getattr(p, "route", []))
            current_step = p.get("current_step", 0) if is_dict else getattr(p, "current_step", 0)
            if state == "RUNNING_ROUTE" and (not waypoints or current_step >= len(waypoints)):
                self._flag_anomaly(tick, "ROUTE_DISCONNECT", f"Player {p_id} ({role}) in RUNNING_ROUTE with no valid waypoints.")

            # Inspector Check 2: Defender Stagnation (In Zone Drop without active anchor)
            zone_anchor = p.get("zone_anchor", None) if is_dict else getattr(p, "zone_anchor", None)
            if state == "HOLDING_ZONE" and (not zone_anchor or zone_anchor == (0.0, 0.0)):
                self._flag_anomaly(tick, "DEFENDER_STAGNATION", f"Defender {p_id} holding zone without target coordinates.")

            # Inspector Check 3: Run/Pass Mismatch
            if role == "QB" and self.play_type == "RUN" and state == "DROPBACK":
                self._flag_anomaly(tick, "RUN_PASS_MISMATCH", "Run play invoked but QB engaged in DROPBACK state.")

        # Inspector Check 4: Ball Disconnect (Carrier assigned but ball too far away while HELD)
        if carrier_player and frame_data["ball"]["state"] == "HELD" and ball_carrier_id:
            bx = frame_data["ball"]["x"]
            bz = frame_data["ball"]["z"]
            dx = bx - carrier_player["x"]
            dz = bz - carrier_player["z"]
            dist = math.hypot(dx, dz)
            if dist > 1.5:  # Distance exceeds 1.5 yards
                self._flag_anomaly(tick, "BALL_DISCONNECT", f"Ball carrier {carrier_player['id']} separated from ball by {dist:.2f} yards.")

        self.ticks.append(frame_data)

    def _flag_anomaly(self, tick: int, anomaly_type: str, message: str):
        """Internal helper to log structural disconnections without duplicating per tick."""
        for a in reversed(self.anomalies):
            if a["type"] == anomaly_type and a["message"] == message and (tick - a["tick"]) < 30:
                return

        warning = {
            "tick": tick,
            "type": anomaly_type,
            "message": message
        }
        self.anomalies.append(warning)
        print(f"⚠️ [WIRE-UP ANOMALY] Tick {tick:03d}: [{anomaly_type}] {message}")

    def export_replay(self) -> str:
        """Saves structured replay data to results_save/replays/."""
        # Format a clean, human-readable filename slug from the play name
        safe_play_name = re.sub(r'[^a-zA-Z0-9_-]', '_', self.play_name).strip('_')
        if not safe_play_name:
            safe_play_name = f"play_{self.play_id}"

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"replay_{safe_play_name}_{timestamp}.json"
        filepath = os.path.join(self.export_dir, filename)

        replay_payload = {
            "metadata": {
                "play_id": self.play_id,
                "play_name": self.play_name,
                "play_type": self.play_type,
                "start_time": self.start_time,
                "total_ticks": len(self.ticks),
                "total_events": len(self.events),
                "anomaly_count": len(self.anomalies)
            },
            "events": self.events,
            "anomalies": self.anomalies,
            "frames": self.ticks
        }

        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(replay_payload, f, indent=2)

        print(f"💾 Telemetry replay exported to: {filepath}")
        return filepath
