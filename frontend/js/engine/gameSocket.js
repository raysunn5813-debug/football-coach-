export let gameSocketClient = null;

export class GameSocketClient {
  constructor(gameId, playerMeshes, ballMesh) {
    this.gameId = gameId;
    this.playerMeshes = playerMeshes; // Map of player ID -> Three.js Mesh
    this.ballMesh = ballMesh;         // Three.js Ball Mesh
    this.socket = null;
    this.intentionalClose = false;

    // Clean up any previous client so it doesn't keep reconnecting in the background
    if (gameSocketClient && gameSocketClient !== this) {
      gameSocketClient.disconnect();
    }
    gameSocketClient = this;
  }

  connect() {
    this.intentionalClose = false;

    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsHost = window.location.host || 'localhost:3000';
    this.socket = new WebSocket(`${wsProtocol}//${wsHost}/ws/game/${this.gameId}`);
    this.socket.binaryType = 'arraybuffer';

    this.socket.onopen = () => {
      console.log(`Connected to 60Hz Binary Game Stream [Session: ${this.gameId}]`);
    };

    this.socket.onmessage = (event) => {
      if (event.data instanceof ArrayBuffer) {
        const telemetry = this.unpackBinaryFrame(event.data);
        this.renderFrame(telemetry);
      } else {
        try {
          const telemetry = JSON.parse(event.data);
          this.renderFrame(telemetry);
        } catch (e) {
          console.warn("Raw WebSocket message:", event.data);
        }
      }
    };

    this.socket.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    this.socket.onclose = () => {
      if (this.intentionalClose) {
        console.log(`Game socket for session ${this.gameId} closed intentionally.`);
        return;
      }
      console.warn("WebSocket disconnected. Attempting reconnect...");
      setTimeout(() => this.connect(), 2000);
    };
  }

  unpackBinaryFrame(buffer) {
    if (buffer.byteLength < 28) return null;
    const view = new DataView(buffer);

    const gameClock = view.getFloat32(0, true);
    const playClock = view.getFloat32(4, true);
    const los = view.getFloat32(8, true);
    const down = view.getUint8(12);
    const distance = view.getUint8(13);

    const bx = view.getFloat32(16, true);
    const by = view.getFloat32(20, true);
    const bz = view.getFloat32(24, true);

    const OFF_ROLES = ["LT", "LG", "C", "RG", "RT", "QB", "HB", "FB", "X", "Y", "Z"];
    const DEF_ROLES = ["DT1", "DT2", "DE1", "DE2", "MLB", "WLB", "SLB", "CB1", "CB2", "FS", "SS"];

    const players = [];
    let offset = 28;
    let idx = 0;

    while (offset + 20 <= buffer.byteLength) {
      const p_id_num = view.getUint16(offset, true);
      const px = view.getFloat32(offset + 2, true);
      const py = view.getFloat32(offset + 6, true);
      const pz = view.getFloat32(offset + 10, true);
      const pyaw = view.getFloat32(offset + 14, true);
      const stateCode = view.getUint8(offset + 18);

      let meshId = "";
      if (idx < 11) {
        meshId = `OFF_${OFF_ROLES[idx]}`;
      } else if (idx < 22) {
        meshId = `DEF_${DEF_ROLES[idx - 11]}`;
      } else {
        meshId = `P_${p_id_num}`;
      }

      players.push({
        id: meshId, p_id_num, state: stateCode, x: px, z: pz, y: py, rotY: pyaw
      });
      offset += 20;
      idx++;
    }

    return {
      gameClock,
      playClock,
      los,
      down,
      distance,
      ball: { x: bx, y: by, z: bz },
      players
    };
  }

  disconnect() {
    this.intentionalClose = true;
    if (this.socket) {
      this.socket.close();
    }
  }

  renderFrame(telemetry) {
    if (!telemetry) return;

    // 1. Update Ball Position & Elevation (With 10-yard Endzone Offset)
    if (this.ballMesh && telemetry.ball) {
      this.ballMesh.position.set(telemetry.ball.x + 10.0, (telemetry.ball.y || 0.8), telemetry.ball.z);
    }

    // 2. Update 3D Player Meshes (With 10-yard Endzone Offset & Rotations)
    if (telemetry.players) {
      telemetry.players.forEach(p => {
        const mesh = this.playerMeshes ? (this.playerMeshes.get(p.id) || this.playerMeshes.get(`OFF_${p.id}`) || this.playerMeshes.get(`DEF_${p.id}`)) : null;
        if (mesh) {
          mesh.position.set(p.x + 10.0, (p.y || 0) + 0.5, p.z);
          mesh.rotation.y = p.rotY || 0;
        }
      });
    }
  }

  sendCommand(actionPayload) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(actionPayload));
    }
  }
}
