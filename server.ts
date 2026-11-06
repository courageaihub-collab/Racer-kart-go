import http from 'node:http';
import path from 'node:path';
import express, { Request, Response } from 'express';
import { WebSocketServer, WebSocket } from 'ws';

interface PlayerState {
  id: string;
  name: string;
  color: string;
  isReady: boolean;
  position: [number, number, number];
  quaternion: [number, number, number, number];
  speed: number;
  progress: number;
  lap: number;
  steer: number;
  throttle: number;
  drift: boolean;
  totalTime: number;
  finished: boolean;
  lastPing: number;
}

interface Room {
  id: string;
  hostId: string;
  players: Map<string, PlayerState>;
  sockets: Map<string, WebSocket>;
  status: 'waiting' | 'countdown' | 'racing' | 'finished';
  countdownStart: number;
  createdAt: number;
}

const GSTATIC_MODELS_BASE = 'https://www.gstatic.com/aistudio/starter-apps/desk-racer/models';
const rooms = new Map<string, Room>();

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });

app.use(express.json());

// Proxy gstatic 3D models for development and production reliability
app.get(['/api/gstatic-models/:file', '/assets/models/:file'], async (req: Request, res: Response) => {
  try {
    const file = req.params.file;
    const url = `${GSTATIC_MODELS_BASE}/${file}`;
    const remoteRes = await fetch(url);
    if (!remoteRes.ok) {
      res.status(remoteRes.status).send(`Failed to fetch model ${file}`);
      return;
    }
    const contentType = remoteRes.headers.get('content-type') || 'model/gltf-binary';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    const buffer = Buffer.from(await remoteRes.arrayBuffer());
    res.send(buffer);
  } catch (err) {
    console.error('Model proxy error:', err);
    res.status(500).send('Proxy error');
  }
});

// REST endpoint to get active public race lobbies
app.get('/api/rooms', (_req: Request, res: Response) => {
  const roomList = Array.from(rooms.values()).map((r) => ({
    id: r.id,
    playerCount: r.players.size,
    status: r.status,
    players: Array.from(r.players.values()).map((p) => ({
      id: p.id,
      name: p.name,
      color: p.color,
      isReady: p.isReady,
    })),
  }));
  res.json({ rooms: roomList });
});

// Broadcast helper within a specific room
function broadcastToRoom(room: Room, message: any, excludeSocket?: WebSocket) {
  const payload = JSON.stringify(message);
  for (const client of room.sockets.values()) {
    if (client !== excludeSocket && client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  }
}

// WebSocket Connection Handler
wss.on('connection', (ws: WebSocket) => {
  let currentRoomId: string | null = null;
  let currentPlayerId: string | null = null;

  ws.on('message', (rawData) => {
    try {
      const msg = JSON.parse(rawData.toString());

      // 1. Join / Create Room
      if (msg.type === 'join') {
        const { roomId = 'DESK-CIRCUIT', playerId, name = 'Desk Pilot', color = '#00e5ff' } = msg;
        currentRoomId = roomId;
        currentPlayerId = playerId || `player_${Math.random().toString(36).substring(2, 8)}`;

        let room = rooms.get(roomId);
        if (!room) {
          room = {
            id: roomId,
            hostId: currentPlayerId,
            players: new Map(),
            sockets: new Map(),
            status: 'waiting',
            countdownStart: 0,
            createdAt: Date.now(),
          };
          rooms.set(roomId, room);
        }

        const newPlayer: PlayerState = {
          id: currentPlayerId,
          name: name.slice(0, 16),
          color: color || '#00e5ff',
          isReady: true,
          position: [0, 0.036, 0.255],
          quaternion: [0, 0, 0, 1],
          speed: 0,
          progress: 0,
          lap: 1,
          steer: 0,
          throttle: 0,
          drift: false,
          totalTime: 0,
          finished: false,
          lastPing: Date.now(),
        };

        room.players.set(currentPlayerId, newPlayer);
        room.sockets.set(currentPlayerId, ws);

        // Send confirmation and full room state back to the joining player
        ws.send(
          JSON.stringify({
            type: 'room:init',
            roomId,
            playerId: currentPlayerId,
            isHost: room.hostId === currentPlayerId,
            status: room.status,
            players: Array.from(room.players.values()),
          })
        );

        // Broadcast to all other players in this room
        broadcastToRoom(
          room,
          {
            type: 'player:joined',
            player: newPlayer,
          },
          ws
        );
        return;
      }

      if (!currentRoomId || !currentPlayerId) return;
      const room = rooms.get(currentRoomId);
      if (!room) return;

      // 2. High-Frequency Live Kart Telemetry (Position, Orientation, Speed, Progress)
      if (msg.type === 'kart:telemetry') {
        const p = room.players.get(currentPlayerId);
        if (p) {
          p.position = msg.pos || p.position;
          p.quaternion = msg.quat || p.quaternion;
          p.speed = msg.speed ?? p.speed;
          p.progress = msg.progress ?? p.progress;
          p.lap = msg.lap ?? p.lap;
          p.steer = msg.steer ?? p.steer;
          p.throttle = msg.throttle ?? p.throttle;
          p.drift = Boolean(msg.drift);
        }

        // Broadcast delta to everyone else in this room
        broadcastToRoom(
          room,
          {
            type: 'kart:sync',
            id: currentPlayerId,
            pos: msg.pos,
            quat: msg.quat,
            speed: msg.speed,
            progress: msg.progress,
            lap: msg.lap,
            steer: msg.steer,
            throttle: msg.throttle,
            drift: msg.drift,
          },
          ws
        );
        return;
      }

      // 3. Start Race Countdown (Synchronized for all players in the room)
      if (msg.type === 'race:start_request') {
        room.status = 'countdown';
        room.countdownStart = Date.now() + 3500; // 3.5s countdown
        broadcastToRoom(room, {
          type: 'race:countdown_start',
          startTime: room.countdownStart,
        });
        return;
      }

      // 4. Lap Completed Event
      if (msg.type === 'race:lap_completed') {
        const p = room.players.get(currentPlayerId);
        if (p) {
          p.lap = msg.lap;
        }
        broadcastToRoom(room, {
          type: 'race:player_lap',
          id: currentPlayerId,
          lap: msg.lap,
          splitTime: msg.splitTime,
        });
        return;
      }

      // 5. Race Finish Event
      if (msg.type === 'race:finished') {
        const p = room.players.get(currentPlayerId);
        if (p) {
          p.finished = true;
          p.totalTime = msg.totalTime;
        }
        broadcastToRoom(room, {
          type: 'race:player_finished',
          id: currentPlayerId,
          totalTime: msg.totalTime,
          bestLap: msg.bestLap,
        });
        return;
      }

      // 6. Ping / Pong for live latency indicator
      if (msg.type === 'ping') {
        ws.send(JSON.stringify({ type: 'pong', clientTime: msg.t }));
        return;
      }
    } catch (err) {
      console.warn('WebSocket message error:', err);
    }
  });

  const cleanup = () => {
    if (currentRoomId && currentPlayerId) {
      const room = rooms.get(currentRoomId);
      if (room) {
        room.players.delete(currentPlayerId);
        room.sockets.delete(currentPlayerId);
        broadcastToRoom(room, {
          type: 'player:left',
          id: currentPlayerId,
        });
        if (room.players.size === 0) {
          rooms.delete(currentRoomId);
        } else if (room.hostId === currentPlayerId) {
          // Pass host to next remaining player
          const nextHost = Array.from(room.players.keys())[0];
          room.hostId = nextHost;
          broadcastToRoom(room, {
            type: 'room:new_host',
            hostId: nextHost,
          });
        }
      }
    }
  };

  ws.on('close', cleanup);
  ws.on('error', cleanup);
});

// Upgrade HTTP connections to WebSocket
server.on('upgrade', (request, socket, head) => {
  const { pathname } = new URL(request.url || '', `http://${request.headers.host}`);
  if (pathname === '/ws/race' || pathname === '/ws') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  }
});

// Mount Vite in development or serve static in production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';
  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve('dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const PORT = Number(process.env.PORT) || 3000;
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[Desk Racer] Realtime Multiplayer Server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
