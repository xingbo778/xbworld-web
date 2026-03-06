/**
 * Mock Freeciv backend for local testing.
 * Simulates civclientlauncher + civserver WebSocket with minimal map data.
 */
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { URL } from 'url';

const PORT = parseInt(process.env.MOCK_PORT || '8002');
const FAKE_CIV_PORT = 5555;
const MAP_X = 40;
const MAP_Y = 25;

// AI players for observer mode
const AI_PLAYERS = [
  { playerno: 0, name: 'Caesar',    color: [255, 0, 0] },
  { playerno: 1, name: 'Cleopatra', color: [0, 0, 255] },
  { playerno: 2, name: 'Gandhi',    color: [0, 200, 0] },
];

// Terrain IDs matching PixiRenderer expectations
const TERRAINS = [
  { id: 0, name: 'Coast',      graphic_str: 'coast',      graphic_alt: 'coast',      movement_cost: 1, defense_bonus: 0, output: [0, 1, 0, 0, 0, 0], color_red: 100, color_green: 140, color_blue: 180 },
  { id: 1, name: 'Ocean',      graphic_str: 'floor',      graphic_alt: 'ocean',      movement_cost: 1, defense_bonus: 0, output: [0, 1, 0, 0, 0, 0], color_red: 40, color_green: 60, color_blue: 140 },
  { id: 2, name: 'Desert',     graphic_str: 'desert',     graphic_alt: 'desert',     movement_cost: 1, defense_bonus: 0, output: [0, 0, 1, 0, 0, 0], color_red: 200, color_green: 190, color_blue: 130 },
  { id: 3, name: 'Forest',     graphic_str: 'forest',     graphic_alt: 'forest',     movement_cost: 2, defense_bonus: 15, output: [1, 1, 0, 0, 0, 0], color_red: 30, color_green: 100, color_blue: 30 },
  { id: 4, name: 'Grassland',  graphic_str: 'grassland',  graphic_alt: 'grassland',  movement_cost: 1, defense_bonus: 0, output: [2, 0, 0, 0, 0, 0], color_red: 90, color_green: 160, color_blue: 60 },
  { id: 5, name: 'Hills',      graphic_str: 'hills',      graphic_alt: 'hills',      movement_cost: 2, defense_bonus: 10, output: [1, 0, 0, 0, 0, 0], color_red: 140, color_green: 120, color_blue: 60 },
  { id: 6, name: 'Jungle',     graphic_str: 'jungle',     graphic_alt: 'jungle',     movement_cost: 2, defense_bonus: 15, output: [1, 0, 0, 0, 0, 0], color_red: 20, color_green: 80, color_blue: 20 },
  { id: 7, name: 'Mountains',  graphic_str: 'mountains',  graphic_alt: 'mountains',  movement_cost: 3, defense_bonus: 25, output: [0, 0, 1, 0, 0, 0], color_red: 130, color_green: 100, color_blue: 80 },
  { id: 8, name: 'Plains',     graphic_str: 'plains',     graphic_alt: 'plains',     movement_cost: 1, defense_bonus: 0, output: [1, 1, 0, 0, 0, 0], color_red: 160, color_green: 170, color_blue: 70 },
  { id: 9, name: 'Swamp',      graphic_str: 'swamp',      graphic_alt: 'swamp',      movement_cost: 2, defense_bonus: 10, output: [1, 0, 0, 0, 0, 0], color_red: 70, color_green: 100, color_blue: 70 },
  { id: 10, name: 'Tundra',    graphic_str: 'tundra',     graphic_alt: 'tundra',     movement_cost: 1, defense_bonus: 0, output: [1, 0, 0, 0, 0, 0], color_red: 170, color_green: 170, color_blue: 170 },
  { id: 11, name: 'Arctic',    graphic_str: 'arctic',     graphic_alt: 'arctic',     movement_cost: 2, defense_bonus: 0, output: [0, 0, 0, 0, 0, 0], color_red: 230, color_green: 230, color_blue: 250 },
  { id: 12, name: 'Lake',      graphic_str: 'lake',       graphic_alt: 'lake',       movement_cost: 1, defense_bonus: 0, output: [0, 2, 0, 0, 0, 0], color_red: 80, color_green: 120, color_blue: 200 },
  { id: 13, name: 'Deep Ocean', graphic_str: 'floor',      graphic_alt: 'deep_ocean', movement_cost: 1, defense_bonus: 0, output: [0, 1, 0, 0, 0, 0], color_red: 20, color_green: 30, color_blue: 100 },
];

/** Pre-generate the full terrain map so coast tiles are only placed next to land */
const terrainMap = new Array(MAP_X * MAP_Y);
(function generateMap() {
  // Pass 1: generate land vs ocean
  for (let y = 0; y < MAP_Y; y++) {
    for (let x = 0; x < MAP_X; x++) {
      const nx = x / MAP_X;
      const ny = y / MAP_Y;
      const distFromCenter = Math.sqrt(Math.pow(nx - 0.5, 2) + Math.pow(ny - 0.5, 2));
      const isOcean = distFromCenter > 0.4 || (y < 2) || (y >= MAP_Y - 2);

      if (isOcean) {
        terrainMap[y * MAP_X + x] = 1; // ocean (floor) placeholder
      } else {
        const r = Math.random();
        const latFactor = Math.abs(ny - 0.5) * 2;
        if (latFactor > 0.7) terrainMap[y * MAP_X + x] = r > 0.5 ? 11 : 10;
        else if (latFactor > 0.5) terrainMap[y * MAP_X + x] = r > 0.6 ? 3 : (r > 0.3 ? 8 : 5);
        else if (r > 0.7) terrainMap[y * MAP_X + x] = 6;
        else if (r > 0.5) terrainMap[y * MAP_X + x] = 4;
        else if (r > 0.3) terrainMap[y * MAP_X + x] = 8;
        else if (r > 0.15) terrainMap[y * MAP_X + x] = 3;
        else if (r > 0.05) terrainMap[y * MAP_X + x] = 5;
        else terrainMap[y * MAP_X + x] = 7;
      }
    }
  }

  // Pass 2: place coast tiles where ocean is adjacent to land (only direct neighbors)
  const isLand = (t) => t !== 1 && t !== 0 && t !== 13 && t !== 12;
  // First, mark which ocean tiles should become coast
  const coastCandidates = new Set();
  for (let y = 0; y < MAP_Y; y++) {
    for (let x = 0; x < MAP_X; x++) {
      const idx = y * MAP_X + x;
      if (terrainMap[idx] !== 1) continue;
      for (const [dx, dy] of [[-1,0],[1,0],[0,-1],[0,1]]) {
        const nx2 = x + dx, ny2 = y + dy;
        if (nx2 >= 0 && nx2 < MAP_X && ny2 >= 0 && ny2 < MAP_Y) {
          if (isLand(terrainMap[ny2 * MAP_X + nx2])) { coastCandidates.add(idx); break; }
        }
      }
    }
  }
  for (const idx of coastCandidates) {
    terrainMap[idx] = 0; // coast
  }
  // Pass 3: also convert coast tiles that are 1 step from land coast to coast
  // This creates a 2-tile wide coast band for smoother transitions
  for (let y = 0; y < MAP_Y; y++) {
    for (let x = 0; x < MAP_X; x++) {
      const idx = y * MAP_X + x;
      if (terrainMap[idx] !== 1) continue;
      for (const [dx, dy] of [[-1,0],[1,0],[0,-1],[0,1]]) {
        const nx2 = x + dx, ny2 = y + dy;
        if (nx2 >= 0 && nx2 < MAP_X && ny2 >= 0 && ny2 < MAP_Y) {
          if (terrainMap[ny2 * MAP_X + nx2] === 0) { terrainMap[idx] = 0; break; }
        }
      }
    }
  }
})();

function generateTerrain(x, y) {
  return terrainMap[y * MAP_X + x];
}

function sendPackets(ws, packets) {
  ws.send(JSON.stringify(packets));
}

/** Handle WebSocket connection — always observer mode */
function handleConnection(ws, req) {
  console.log('Observer WebSocket connected, url:', req.url);

  ws.on('message', (data) => {
    try {
      const packet = JSON.parse(data.toString());
      console.log('Received packet pid=' + packet.pid);

      if (packet.pid === 4) {
        console.log('Observer login from:', packet.username);
        sendGameInit(ws, packet.username);
      }
    } catch (e) {
      console.error('Parse error:', e.message);
    }
  });

  ws.on('close', () => console.log('Observer disconnected'));
}

function sendGameInit(ws, username) {
  console.log(`Sending game init (observer) for ${username}`);
  // 1. Server join reply
  sendPackets(ws, [{ pid: 5, you_can_join: true, conn_id: 1, message: '' }]);

  // 2. Server info
  sendPackets(ws, [{
    pid: 29, emerg_version: 0, major_version: 3, minor_version: 1,
    patch_version: 90, version_label: '-dev',
  }]);

  // 3. Connect message
  sendPackets(ws, [{ pid: 27, message: 'You are logged in as ' + username }]);

  // 4. Game info
  sendPackets(ws, [{
    pid: 16, turn: 0, year: -4000, timeout: 0, first_timeout: 0,
    phase: 0, phase_mode: 0, global_advances: [],
    gold: 50, tax: 0, science: 0, luxury: 0,
  }]);

  // 5. Calendar info
  sendPackets(ws, [{
    pid: 255, calendar_fragment_count: 0, calendar_fragments: [],
    positive_year_label: 'AD', negative_year_label: 'BC',
    calendar_fragment_name: [],
  }]);

  // 6. Map info (critical - triggers map_allocate)
  sendPackets(ws, [{
    pid: 17, xsize: MAP_X, ysize: MAP_Y,
    topology_id: 0, wrap_id: 0,
  }]);

  // 7. Ruleset control (must come BEFORE terrain definitions — it resets w.terrains)
  sendPackets(ws, [{
    pid: 155,
    num_unit_classes: 2, num_unit_types: 3, num_impr_types: 0,
    num_tech_types: 0, num_extra_types: 0, num_base_types: 0,
    num_road_types: 0, num_disaster_types: 0, num_achievement_types: 0,
    num_multipliers: 0, num_styles: 0, government_count: 0,
    nation_count: 1, playable_nation_count: 1, style_count: 0,
    terrain_count: TERRAINS.length, resource_count: 0,
    num_goods_types: 0, default_government: 0, default_music_style: -1,
    preferred_tileset: '', name: 'mock', description: 'Mock ruleset',
    enabled_actions: [], enabled_unit_class_flags: [], enabled_unit_type_flags: [],
    enabled_impr_flags: [], enabled_tech_flags: [], enabled_terrain_flags: [],
    enabled_extra_flags: [],
  }]);

  // 8. Terrain control
  sendPackets(ws, [{
    pid: 146,
    num_resources: 0,
    ocean_reclaim_requirement: 3,
    land_channel_requirement: 3,
    terrain_thaw_requirement: 0,
    terrain_freeze_requirement: 0,
    lake_max_size: 0,
    min_start_native_area: 0,
    move_fragments: 3,
    igter_cost: 1,
  }]);

  // 9. Ruleset terrain definitions
  for (const t of TERRAINS) {
    sendPackets(ws, [{
      pid: 151,
      ...t,
      rule_name: t.name.toLowerCase(),
      citizens_graphic: '',
      helptext: '',
      flags: [],
      native_to: [],
      // color_red/green/blue now come from TERRAINS via spread
      base_time: 1, road_time: 1,
      irrigation_result: 0, irrigation_food_incr: 0, irrigation_time: 0,
      mining_result: 0, mining_shield_incr: 0, mining_time: 0,
      animal: -1, transform_result: 0, transform_time: 0,
      placing_time: 1, pillage_time: 1, clean_pollution_time: 1,
      clean_fallout_time: 1, property: [0, 0, 0, 0, 0],
    }]);
  }

  // 10. Nation definitions (pid 148) — must come before player info
  const NATIONS = [
    { id: 0, adjective: 'Roman', rule_name: 'roman', translation_name: 'Roman', graphic_str: 'roman', flag_graphic: 'f.roman', color: 'rgb(255,0,0)', legend: 'The Roman Empire' },
    { id: 1, adjective: 'Egyptian', rule_name: 'egyptian', translation_name: 'Egyptian', graphic_str: 'egypt', flag_graphic: 'f.egypt', color: 'rgb(0,0,255)', legend: 'Ancient Egypt' },
    { id: 2, adjective: 'Indian', rule_name: 'indian', translation_name: 'Indian', graphic_str: 'india', flag_graphic: 'f.india', color: 'rgb(0,200,0)', legend: 'The Indian Subcontinent' },
  ];
  for (const n of NATIONS) {
    sendPackets(ws, [{
      pid: 148,
      id: n.id,
      adjective: n.adjective,
      rule_name: n.rule_name,
      translation_name: n.translation_name,
      graphic_str: n.graphic_str,
      flag_graphic: n.flag_graphic,
      color: n.color,
      legend: n.legend,
      leader_count: 0,
      leaders: [],
      style: 0,
      is_playable: true,
      barbarian_type: 0,
      groups: [],
    }]);
  }

  // 11. Player info — send AI players for observer to watch
  for (const ai of AI_PLAYERS) {
    sendPackets(ws, [{
      pid: 51,
      playerno: ai.playerno, name: ai.name, username: ai.name,
      nation: ai.playerno, is_alive: true, is_connected: true,
      team: ai.playerno, is_ready: true,
      turns_alive: 5, phase_done: false,
      nturns_idle: 0, ai_skill_level: 5,
      government: 0, target_government: 0,
      real_embassy: [0], city_options: [0],
      gold: 100 + ai.playerno * 50, tax: 30, science: 60, luxury: 10,
      revolution_finishes: 0, culture: ai.playerno * 10,
      mood: 0,
      style: 0,
      music_style: -1,
      science_cost: 0,
      love: [],
      color_valid: true,
      color_red: ai.color[0], color_green: ai.color[1], color_blue: ai.color[2],
      multip: [], multip_target: [],
      flags: [1],  // bit 0 = PLRF_AI
      diplstates: [], gives_shared_vision: [0],
      wonders: [], tech_upkeep: 0,
    }]);
  }

  // 11b. Research info (pid 60) — one per player
  const MOCK_TECHS = ['Alphabet', 'Pottery', 'Bronze Working'];
  for (const ai of AI_PLAYERS) {
    sendPackets(ws, [{
      pid: 60,
      id: ai.playerno,
      researching: ai.playerno,  // tech id they're researching
      researching_cost: 50 + ai.playerno * 10,
      bulbs_researched: 20 + ai.playerno * 5,
      tech_goal: -1,
      inventions: [],
    }]);
  }

  // 11c. Tech definitions (pid 140) — minimal set for display
  for (let i = 0; i < MOCK_TECHS.length; i++) {
    sendPackets(ws, [{
      pid: 144,
      id: i,
      name: MOCK_TECHS[i],
      rule_name: MOCK_TECHS[i].toLowerCase().replace(/ /g, '_'),
      req: [-1, -1],
      root_req: -1,
      flags: [0],
      helptext: '',
      graphic_str: '',
      graphic_alt: '',
      cost: 50 + i * 10,
      num_reqs: 0,
    }]);
  }

  // 11d. Unit class definitions (pid 163)
  const UNIT_CLASSES = [
    { id: 0, name: 'Land', rule_name: 'Land', move_type: 0, min_speed: 3, hp_loss_pct: 0, flags: [] },
    { id: 1, name: 'Sea', rule_name: 'Sea', move_type: 1, min_speed: 6, hp_loss_pct: 0, flags: [] },
  ];
  for (const uc of UNIT_CLASSES) {
    sendPackets(ws, [{ pid: 163, ...uc, helptext: '' }]);
  }

  // 11e. Unit type definitions (pid 140)
  const UNIT_TYPES = [
    { id: 0, name: 'Warriors', rule_name: 'Warriors', graphic_str: 'u.warriors', graphic_alt: '-',
      unit_class_id: 0, build_cost: 10, attack_strength: 1, defense_strength: 1,
      move_rate: 3, hp: 10, firepower: 1, vision_radius_sq: 2, flags: [] },
    { id: 1, name: 'Settlers', rule_name: 'Settlers', graphic_str: 'u.settlers', graphic_alt: '-',
      unit_class_id: 0, build_cost: 40, attack_strength: 0, defense_strength: 1,
      move_rate: 6, hp: 20, firepower: 1, vision_radius_sq: 2, flags: [] },
    { id: 2, name: 'Trireme', rule_name: 'Trireme', graphic_str: 'u.trireme', graphic_alt: '-',
      unit_class_id: 1, build_cost: 40, attack_strength: 1, defense_strength: 1,
      move_rate: 9, hp: 10, firepower: 1, vision_radius_sq: 2, flags: [] },
  ];
  for (const ut of UNIT_TYPES) {
    sendPackets(ws, [{
      pid: 140, ...ut,
      obsoleted_by: -1, converted_to: -1, transport_capacity: 0,
      bombard_rate: 0, city_size: 0, city_slots: 0, cargo: [],
      targets: [], embarks: [], disembarks: [], bonuses: [],
      helptext: '', paratroopers_range: 0, paratroopers_mr_req: 0,
      paratroopers_mr_sub: 0, veteran_levels: 1,
      veteran_name: ['green'], power_fact: [100], move_bonus: [0],
      raise_chance: [0], work_raise_chance: [0],
    }]);
  }

  // 11f. Web ruleset unit addition (pid 217) — needed for utype_actions
  for (const ut of UNIT_TYPES) {
    sendPackets(ws, [{
      pid: 217, id: ut.id, utype_actions: [],
    }]);
  }

  // 12. Connection info — always observer
  sendPackets(ws, [{
    pid: 115, id: 1, used: true, established: true,
    player_num: -1,
    observer: true,
    access_level: 0, username: username,
    addr: '127.0.0.1', capability: '+Freeciv.Web.Devel-3.3',
  }]);

  // 12. Rulesets ready
  sendPackets(ws, [{ pid: 225 }]);

  // 13. Send all tile data
  console.log('Sending ' + (MAP_X * MAP_Y) + ' tiles...');
  const tileBatch = [];
  for (let y = 0; y < MAP_Y; y++) {
    for (let x = 0; x < MAP_X; x++) {
      const index = y * MAP_X + x;
      tileBatch.push({
        pid: 15,
        tile: index,
        x: x,
        y: y,
        known: 2, // TILE_KNOWN_SEEN
        terrain: generateTerrain(x, y),
        extras: [0], // empty BitVector
        resource: -1,
        owner: 255,
        worked: 0,
        continent: 1,
        spec_sprite: '',
        label: '',
        height: 0,
      });

      // Send in batches of 50 tiles
      if (tileBatch.length >= 50) {
        sendPackets(ws, tileBatch.splice(0));
      }
    }
  }
  // Send remaining tiles
  if (tileBatch.length > 0) {
    sendPackets(ws, tileBatch.splice(0));
  }

  console.log('All tiles sent!');

  // 13b. Send units for each AI player on land tiles
  let unitId = 100;
  const landTiles = [];
  for (let y = 0; y < MAP_Y; y++) {
    for (let x = 0; x < MAP_X; x++) {
      const t = terrainMap[y * MAP_X + x];
      if (t !== 0 && t !== 1 && t !== 13 && t !== 12) { // not water
        landTiles.push(y * MAP_X + x);
      }
    }
  }
  // Give each AI player some units spread across the land
  for (const ai of AI_PLAYERS) {
    const numUnits = 4;
    for (let i = 0; i < numUnits; i++) {
      const tileIdx = landTiles[Math.floor((ai.playerno * numUnits + i) * landTiles.length / (AI_PLAYERS.length * numUnits))];
      const unitType = i === 0 ? 1 : 0; // first unit is settler, rest are warriors
      sendPackets(ws, [{
        pid: 63, // unit_info
        id: unitId,
        owner: ai.playerno,
        tile: tileIdx,
        homecity: 0,
        veteran: 0,
        type: unitType,
        movesleft: unitType === 1 ? 6 : 3,
        hp: unitType === 1 ? 20 : 10,
        activity: 0, // ACTIVITY_IDLE
        activity_tgt: -1,
        changed_from: 0,
        changed_from_tgt: -1,
        ai: 1,
        fuel: 0,
        goto_tile: -1,
        action_decision_want: 0,
        action_decision_tile: -1,
        transported: false,
        transported_by: 0,
        occupy: 0,
        battlegroup: -1,
        has_orders: false,
        orders_length: 0, orders_index: 0, orders_repeat: false, orders_vigilant: false,
        orders: [],
        done_moving: false,
        paradropped: false,
        facing: 6,
      }]);
      unitId++;
    }
  }
  console.log('Units sent!');

  // 14. Start game phase
  sendPackets(ws, [
    { pid: 127, year: -4000, fragments: 0, turn: 0 }, // new_year
    { pid: 126, phase: 0 }, // start_phase
    { pid: 128 }, // begin_turn
  ]);

  // 15. Periodic ping to keep connection alive
  const pingInterval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      sendPackets(ws, [{ pid: 88 }]); // conn_ping
    } else {
      clearInterval(pingInterval);
    }
  }, 30000);
}

// Create HTTP server
const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (url.pathname === '/civclientlauncher' && req.method === 'POST') {
    console.log('Observer game launch request');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ port: FAKE_CIV_PORT, result: 'success' }));
    return;
  }

  if (url.pathname === '/meta/status') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('ok;1;0;1');
    return;
  }

  if (url.pathname === '/game/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'running', agents: [] }));
    return;
  }

  // Serve a simple test page
  if (url.pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<html><body><h1>Mock Freeciv Backend</h1><p>Running on port ' + PORT + '</p></body></html>');
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

// WebSocket server for /civsocket/*
const wss = new WebSocketServer({ noServer: true });

server.on('upgrade', (req, socket, head) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  if (url.pathname.startsWith('/civsocket/')) {
    console.log('WebSocket upgrade:', url.pathname);
    wss.handleUpgrade(req, socket, head, (ws) => {
      handleConnection(ws, req);
    });
  } else {
    socket.destroy();
  }
});

server.listen(PORT, () => {
  console.log(`Mock Freeciv backend running on http://localhost:${PORT}`);
  console.log(`WebSocket endpoint: ws://localhost:${PORT}/civsocket/${1000 + FAKE_CIV_PORT}`);
});
