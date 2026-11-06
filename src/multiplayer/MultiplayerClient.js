import * as THREE from 'three';

/**
 * MultiplayerClient.js
 * Real-time WebSocket racing synchronization for Desk Racer:
 * - Cross-device multiplayer (iPhone, Android, Mac, PC, Tablets)
 * - 30Hz Interpolated 3D Opponent Karts with customizable body colors
 * - Synchronized Start Countdown, Lap Leaderboard & Ping measurement
 */

export class MultiplayerClient {
  constructor(scene, options = {}) {
    this.scene = scene;
    this.options = options;
    this.ws = null;
    this.roomId = null;
    this.localPlayerId = null;
    this.localPlayerName = options.name || 'Desk Pilot';
    this.localKartColor = options.color || '#00e5ff';
    this.isHost = false;
    this.status = 'disconnected'; // 'disconnected' | 'connecting' | 'connected' | 'in_room'
    this.pingMs = 18;

    this.opponents = new Map(); // id -> OpponentRecord
    this.callbacks = {
      onRoomState: () => {},
      onCountdown: () => {},
      onPlayerLap: () => {},
      onPlayerFinished: () => {},
      onPing: () => {},
      onStatus: () => {},
    };

    this.lastSendTime = 0;
    this.sendIntervalMs = 33; // 30Hz telemetry updates
    this.pingInterval = null;
  }

  on(event, cb) {
    if (this.callbacks[event]) {
      this.callbacks[event] = cb;
    }
  }

  connect() {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this.status = 'connecting';
    this.callbacks.onStatus(this.status);

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/race`;

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.status = 'connected';
        this.callbacks.onStatus(this.status);
        this.startPingLoop();
      };

      this.ws.onmessage = (event) => {
        this.handleMessage(event.data);
      };

      this.ws.onclose = () => {
        this.status = 'disconnected';
        this.callbacks.onStatus(this.status);
        this.clearOpponents();
        this.stopPingLoop();
      };

      this.ws.onerror = (err) => {
        console.warn('Multiplayer WS error:', err);
      };
    } catch (err) {
      console.error('Failed to connect to multiplayer server:', err);
      this.status = 'disconnected';
      this.callbacks.onStatus(this.status);
    }
  }

  startPingLoop() {
    this.stopPingLoop();
    this.pingInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping', t: performance.now() }));
      }
    }, 2500);
  }

  stopPingLoop() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  joinRoom(roomId, playerName, kartColor) {
    this.roomId = roomId.toUpperCase().trim();
    this.localPlayerName = playerName || this.localPlayerName;
    this.localKartColor = kartColor || this.localKartColor;

    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.connect();
      // Wait for open
      const checkOpen = setInterval(() => {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          clearInterval(checkOpen);
          this.sendJoinPayload();
        }
      }, 50);
      return;
    }

    this.sendJoinPayload();
  }

  sendJoinPayload() {
    this.ws.send(
      JSON.stringify({
        type: 'join',
        roomId: this.roomId,
        name: this.localPlayerName,
        color: this.localKartColor,
      })
    );
  }

  requestStartRace() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'race:start_request' }));
    }
  }

  sendLapCompleted(lap, splitTime) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'race:lap_completed', lap, splitTime }));
    }
  }

  sendRaceFinished(totalTime, bestLap) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'race:finished', totalTime, bestLap }));
    }
  }

  sendTelemetry(st) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN || !this.roomId) return;
    const now = performance.now();
    if (now - this.lastSendTime < this.sendIntervalMs) return;
    this.lastSendTime = now;

    const pos = [st.position.x, st.position.y, st.position.z];
    const quat = [st.quaternion.x, st.quaternion.y, st.quaternion.z, st.quaternion.w];

    this.ws.send(
      JSON.stringify({
        type: 'kart:telemetry',
        pos,
        quat,
        speed: st.speedKmh || (st.speed * 3.6),
        progress: st.sNorm || 0,
        lap: st.lap || 1,
        steer: st.steer || 0,
        throttle: st.throttle || 0,
        drift: Boolean(st.isDrifting),
      })
    );
  }

  handleMessage(raw) {
    try {
      const data = JSON.parse(raw);

      if (data.type === 'room:init') {
        this.status = 'in_room';
        this.localPlayerId = data.playerId;
        this.isHost = data.isHost;
        this.clearOpponents();

        for (const p of data.players) {
          if (p.id !== this.localPlayerId) {
            this.createOpponentKart(p);
          }
        }
        this.callbacks.onRoomState({
          roomId: this.roomId,
          isHost: this.isHost,
          status: data.status,
          players: data.players,
        });
        this.callbacks.onStatus(this.status);
        return;
      }

      if (data.type === 'player:joined') {
        if (data.player && data.player.id !== this.localPlayerId) {
          this.createOpponentKart(data.player);
        }
        return;
      }

      if (data.type === 'player:left') {
        this.removeOpponentKart(data.id);
        return;
      }

      if (data.type === 'kart:sync') {
        const opp = this.opponents.get(data.id);
        if (opp) {
          opp.targetPos.set(data.pos[0], data.pos[1], data.pos[2]);
          opp.targetQuat.set(data.quat[0], data.quat[1], data.quat[2], data.quat[3]);
          opp.speed = data.speed || 0;
          opp.progress = data.progress || 0;
          opp.lap = data.lap || 1;
          opp.isDrifting = Boolean(data.drift);
          opp.lastSync = performance.now();
        }
        return;
      }

      if (data.type === 'race:countdown_start') {
        this.callbacks.onCountdown(data.startTime);
        return;
      }

      if (data.type === 'race:player_lap') {
        this.callbacks.onPlayerLap(data);
        return;
      }

      if (data.type === 'race:player_finished') {
        this.callbacks.onPlayerFinished(data);
        return;
      }

      if (data.type === 'pong') {
        this.pingMs = Math.max(1, Math.round(performance.now() - data.clientTime));
        this.callbacks.onPing(this.pingMs);
        return;
      }
    } catch (err) {
      console.warn('Multiplayer packet parsing error:', err);
    }
  }

  // ---------------------------------------------------------------------------
  // 3D OPPONENT KART MESH & NAMEPLATE GENERATION
  // ---------------------------------------------------------------------------
  createOpponentKart(player) {
    if (this.opponents.has(player.id)) return;

    const kartColorHex = player.color || '#ff3b30';
    const colorObj = new THREE.Color(kartColorHex);

    const kartRoot = new THREE.Group();
    kartRoot.name = `Opponent_${player.id}`;
    kartRoot.scale.setScalar(0.38);

    // Aerodynamic micro-kart body
    const bodyGeo = new THREE.BoxGeometry(0.012, 0.005, 0.022);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: colorObj,
      roughness: 0.28,
      metalness: 0.85,
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    kartRoot.add(bodyMesh);

    // Front Nosecone
    const noseGeo = new THREE.ConeGeometry(0.006, 0.011, 4);
    noseGeo.rotateX(-Math.PI * 0.5);
    const noseMesh = new THREE.Mesh(noseGeo, bodyMat);
    noseMesh.position.set(0, 0, 0.012);
    kartRoot.add(noseMesh);

    // Rear Spoiler
    const wingGeo = new THREE.BoxGeometry(0.015, 0.0015, 0.004);
    const wingMat = new THREE.MeshStandardMaterial({ color: 0x111318, roughness: 0.5 });
    const wingMesh = new THREE.Mesh(wingGeo, wingMat);
    wingMesh.position.set(0, 0.007, -0.010);
    kartRoot.add(wingMesh);

    // Miniature Driver Helmet
    const helmetGeo = new THREE.SphereGeometry(0.0035, 12, 10);
    const helmetMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.2,
      metalness: 0.3,
    });
    const helmetMesh = new THREE.Mesh(helmetGeo, helmetMat);
    helmetMesh.position.set(0, 0.005, 0.002);
    kartRoot.add(helmetMesh);

    // Under-kart Neon Glow Light
    const glowGeo = new THREE.PlaneGeometry(0.018, 0.028);
    glowGeo.rotateX(-Math.PI * 0.5);
    const glowMat = new THREE.MeshBasicMaterial({
      color: colorObj,
      transparent: true,
      opacity: 0.65,
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    glowMesh.position.set(0, 0.001, 0);
    kartRoot.add(glowMesh);

    // Floating 3D Billboard Nameplate above opponent kart
    const nameSprite = this.createNameplateSprite(player.name, kartColorHex);
    nameSprite.position.set(0, 0.026, 0);
    kartRoot.add(nameSprite);

    this.scene.add(kartRoot);

    const oppRecord = {
      id: player.id,
      name: player.name,
      color: kartColorHex,
      mesh: kartRoot,
      nameSprite,
      currentPos: new THREE.Vector3(0, 0.036, 0.255),
      targetPos: new THREE.Vector3(0, 0.036, 0.255),
      currentQuat: new THREE.Quaternion(),
      targetQuat: new THREE.Quaternion(),
      speed: 0,
      progress: 0,
      lap: 1,
      isDrifting: false,
      lastSync: performance.now(),
    };

    this.opponents.set(player.id, oppRecord);
  }

  createNameplateSprite(name, colorHex) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    // Rounded background pill
    ctx.fillStyle = 'rgba(10, 14, 22, 0.88)';
    ctx.beginPath();
    ctx.roundRect(8, 8, 240, 48, 24);
    ctx.fill();

    ctx.lineWidth = 3;
    ctx.strokeStyle = colorHex || '#00e5ff';
    ctx.stroke();

    // Player Name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold italic 22px Orbitron, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(name.toUpperCase(), 128, 32);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const spriteMat = new THREE.SpriteMaterial({ map: texture, depthTest: false });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(0.048, 0.012, 1.0);
    return sprite;
  }

  removeOpponentKart(id) {
    const opp = this.opponents.get(id);
    if (opp) {
      this.scene.remove(opp.mesh);
      opp.mesh.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (child.material.map) child.material.map.dispose();
          child.material.dispose();
        }
      });
      this.opponents.delete(id);
    }
  }

  clearOpponents() {
    for (const id of Array.from(this.opponents.keys())) {
      this.removeOpponentKart(id);
    }
  }

  /**
   * Called every frame in the Three.js render loop to smoothly interpolate remote karts
   */
  update(dt) {
    const lerpFactor = Math.min(1.0, dt * 18.0);
    const slerpFactor = Math.min(1.0, dt * 16.0);

    for (const opp of this.opponents.values()) {
      opp.currentPos.lerp(opp.targetPos, lerpFactor);
      opp.currentQuat.slerp(opp.targetQuat, slerpFactor);

      opp.mesh.position.copy(opp.currentPos);
      opp.mesh.quaternion.copy(opp.currentQuat);
    }
  }

  /**
   * Returns live opponent list for the 2D/3D minimap radar
   */
  getOpponentsData() {
    const list = [];
    for (const opp of this.opponents.values()) {
      list.push({
        id: opp.id,
        name: opp.name,
        color: opp.color,
        position: opp.currentPos,
        lap: opp.lap,
        progress: opp.progress,
        speed: opp.speed,
      });
    }
    return list;
  }

  disconnect() {
    this.stopPingLoop();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.clearOpponents();
    this.status = 'disconnected';
    this.callbacks.onStatus(this.status);
  }
}
