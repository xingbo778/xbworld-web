/**
 * Standalone mock backend server for XBWorld.
 *
 * Serves both static web files AND simulates the Freeciv server protocol:
 *   1. Client sends login (pid=4)
 *   2. Server replies with join_reply + conn_info + chat "You are logged in as..."
 *   3. Client sends /observe command (pid=26)
 *   4. Server sends full game state (rulesets, map, tiles, units, etc.)
 *   5. Server periodically moves units to demonstrate movement
 *
 * Usage:
 *   npx tsx scripts/mock-server.ts
 *   Then open: http://127.0.0.1:8080/webclient/index.html
 *   Click "Observe Game" to see the map!
 */
import http from 'http';
import fs from 'fs';
import path from 'path';
import { WebSocketServer, WebSocket } from 'ws';
import { buildInitPackets, buildUnitMovePacket, MAP_DIMS } from '../tests/e2e/mock-packets';

const PORT = 8080;
const STATIC_ROOT = path.resolve(import.meta.dirname, '..', 'src', 'main', 'webapp');

// MIME type map
const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.map': 'application/json',
  '.txt': 'text/plain',
};

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const url = req.url || '';
  const urlPath = url.split('?')[0];

  // API: civclientlauncher
  if (urlPath.includes('/civclientlauncher')) {
    console.log(`[mock] ${req.method} ${urlPath} → success`);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    // Return port that makes proxyport = 1000 + port match our own port.
    // Client does: proxyport = 1000 + port, then connects to /civsocket/<proxyport>
    // We serve on PORT, so we need proxyport = PORT doesn't matter since we match any /civsocket/* path.
    // Just return a dummy port; the client constructs /civsocket/<proxyport> and we handle it.
    const gamePort = PORT - 1000; // proxyport = 1000 + gamePort = PORT
    res.end(JSON.stringify({ result: 'success', port: String(gamePort) }));
    return;
  }

  // Static file serving
  let filePath = path.join(STATIC_ROOT, urlPath);

  // Default to index.html for directories
  if (filePath.endsWith('/') || !path.extname(filePath)) {
    const tryIndex = path.join(filePath, 'index.html');
    if (fs.existsSync(tryIndex)) {
      filePath = tryIndex;
    }
  }

  try {
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath);
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      const data = fs.readFileSync(filePath);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    } else {
      res.writeHead(404);
      res.end('Not found: ' + urlPath);
    }
  } catch (err) {
    console.error(`[mock] Error serving ${urlPath}:`, err);
    res.writeHead(500);
    res.end('Internal server error');
  }
});

const wss = new WebSocketServer({ noServer: true });

server.on('upgrade', (req, socket, head) => {
  const url = req.url || '';
  if (url.includes('/civsocket')) {
    console.log(`[mock] WebSocket upgrade: ${url}`);
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit('connection', ws, req);
    });
  } else {
    socket.destroy();
  }
});

wss.on('connection', (ws) => {
  console.log('[mock] WebSocket connected');
  let loginHandled = false;
  let gameDataSent = false;
  let username = 'TestObserver';

  ws.on('message', (data) => {
    const msg = data.toString();
    try {
      const parsed = JSON.parse(msg);

      // pid=4: Login request
      if (parsed.pid === 4 && !loginHandled) {
        loginHandled = true;
        username = parsed.username || 'TestObserver';
        console.log(`[mock] Login from "${username}", sending join reply...`);

        // Phase 1: Send only join_reply + conn_info + chat message
        const phase1 = [
          {
            pid: 5, // SERVER_JOIN_REPLY
            you_can_join: true,
            conn_id: 1,
            message: '',
            capability: '+Freeciv.Web.Devel-3.4',
            challenge_file: '',
            salt: 0,
          },
          {
            pid: 115, // CONN_INFO
            id: 1,
            used: true,
            established: true,
            observer: true,
            player_num: -1,
            access_level: 1,
            username,
            addr: '127.0.0.1',
            capability: '+Freeciv.Web.Devel-3.4',
          },
          {
            pid: 25, // CHAT_MSG
            message: `You are logged in as ${username}.`,
            event: 6, // E_CONNECTION
            conn_id: -1,
            tile: -1,
          },
        ];

        ws.send(JSON.stringify(phase1));
        console.log('[mock] Phase 1 sent (join_reply + conn_info + chat)');
        return;
      }

      // pid=26: Chat message request (client sends /observe command)
      if (parsed.pid === 26 && !gameDataSent) {
        const chatMsg = parsed.message || '';
        console.log(`[mock] Chat command: "${chatMsg}"`);

        if (chatMsg.includes('/observe')) {
          gameDataSent = true;
          console.log('[mock] /observe received, sending game data...');

          const allPackets = buildInitPackets();
          // Skip packets we already sent (pid 5, 115)
          const gamePackets = allPackets.filter(
            (p: Record<string, unknown>) => p['pid'] !== 5 && p['pid'] !== 115
          );

          // Send a chat confirmation first
          ws.send(JSON.stringify([{
            pid: 25,
            message: `${username} is now observing.`,
            event: 6,
            conn_id: -1,
            tile: -1,
          }]));

          // Send game data in batches
          const BATCH = 50;
          let i = 0;
          const sendBatch = () => {
            if (i >= gamePackets.length || ws.readyState !== WebSocket.OPEN) return;
            const batch = gamePackets.slice(i, i + BATCH);
            ws.send(JSON.stringify(batch));
            i += BATCH;
            if (i < gamePackets.length) {
              setTimeout(sendBatch, 50);
            } else {
              console.log(`[mock] All ${gamePackets.length} game packets sent`);
              setTimeout(() => startUnitMovement(ws), 3000);
            }
          };
          sendBatch();
        }
        return;
      }

      // Ignore client info packets
      if (parsed.pid === 7 || parsed.pid === 126) {
        return;
      }

      console.log(`[mock] Received pid=${parsed.pid}`);
    } catch {
      console.log(`[mock] Non-JSON message: ${msg.substring(0, 100)}`);
    }
  });

  ws.on('close', () => {
    console.log('[mock] WebSocket disconnected');
  });
});

/** Periodically move units to demonstrate sprite movement */
function startUnitMovement(ws: WebSocket) {
  console.log('[mock] Starting unit movement simulation...');

  const patrolPath = [
    5 + 5 * MAP_DIMS.width,
    6 + 5 * MAP_DIMS.width,
    7 + 5 * MAP_DIMS.width,
    7 + 6 * MAP_DIMS.width,
    6 + 6 * MAP_DIMS.width,
    5 + 6 * MAP_DIMS.width,
  ];

  const patrolPath2 = [
    14 + 5 * MAP_DIMS.width,
    13 + 5 * MAP_DIMS.width,
    12 + 5 * MAP_DIMS.width,
    12 + 6 * MAP_DIMS.width,
    13 + 6 * MAP_DIMS.width,
    14 + 6 * MAP_DIMS.width,
  ];

  let step = 0;

  const interval = setInterval(() => {
    if (ws.readyState !== WebSocket.OPEN) {
      clearInterval(interval);
      return;
    }

    const tile1 = patrolPath[step % patrolPath.length];
    const tile2 = patrolPath2[step % patrolPath2.length];

    ws.send(JSON.stringify([
      buildUnitMovePacket(1, 0, tile1, 0),
      buildUnitMovePacket(3, 1, tile2, 0),
    ]));
    step++;
  }, 2000);
}

server.listen(PORT, '127.0.0.1', () => {
  console.log(`
╔══════════════════════════════════════════════════╗
║  XBWorld Mock Server                             ║
║  http://127.0.0.1:${PORT}/webclient/index.html      ║
╠══════════════════════════════════════════════════╣
║                                                  ║
║  Open the URL above in your browser.             ║
║  Click "Observe Game" to see the map!            ║
║                                                  ║
║  No separate Vite dev server needed.             ║
╚══════════════════════════════════════════════════╝
`);
});
