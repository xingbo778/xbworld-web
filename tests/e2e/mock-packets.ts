/**
 * Mock packet generator for E2E tests.
 *
 * Generates a minimal set of Freeciv 3.4 protocol packets that
 * simulate a running game, allowing the client to render:
 *   - Main map canvas with terrain sprites
 *   - Mini-map / overview
 *   - Unit sprites on tiles
 *   - Unit movement (tile changes)
 */

// --- Packet IDs (must match packetConstants.ts / packhandlers.ts) ---
const PID = {
  SERVER_JOIN_REPLY: 5,
  CONN_INFO: 115,
  MAP_INFO: 17,
  TILE_INFO: 15,
  GAME_INFO: 16,
  CALENDAR_INFO: 255,
  PLAYER_INFO: 51,
  WEB_PLAYER_INFO_ADDITION: 259,
  PLAYER_DIPLSTATE: 59,
  UNIT_INFO: 63,
  CITY_INFO: 31,
  RULESET_TERRAIN_CONTROL: 146,
  RULESET_TERRAIN: 151,
  RULESET_UNIT: 140,
  RULESET_UNIT_CLASS: 152,
  RULESET_CONTROL: 155,
  RULESET_EXTRA: 232,
  RULESET_NATION: 148,
  RULESET_GOVERNMENT: 145,
  RULESET_TECH: 144,
  RULESET_BUILDING: 150,
  RULESET_GAME: 141,
  RULESETS_READY: 225,
  CHAT_MSG: 25,
  CONNECT_MSG: 27,
  START_PHASE: 126,
  BEGIN_TURN: 128,
  NEW_YEAR: 127,
  PROCESSING_STARTED: 0,
  PROCESSING_FINISHED: 1,
  SET_TOPOLOGY: 253,
  RESEARCH_INFO: 60,
  TIMEOUT_INFO: 244,
  FREEZE_CLIENT: 130,
  THAW_CLIENT: 131,
} as const;

// --- Map configuration ---
const MAP_WIDTH = 20;
const MAP_HEIGHT = 16;
// Topology: isometric (TF_ISO=1), wrap X (WRAP_X=1)
const TOPOLOGY_ID = 1;  // TF_ISO
const WRAP_ID = 1;       // WRAP_X

// --- Terrain definitions ---
const TERRAINS = [
  { id: 0, name: 'Inaccessible', graphic_str: 'inaccessible', graphic_alt: 'inaccessible', movement_cost: 0, defense_bonus: 0, output: [0, 0, 0], color_red: 0, color_green: 0, color_blue: 0 },
  { id: 1, name: 'Ocean', graphic_str: 'floor', graphic_alt: 'floor', movement_cost: 1, defense_bonus: 0, output: [1, 0, 2], color_red: 0, color_green: 0, color_blue: 200 },
  { id: 2, name: 'Deep Ocean', graphic_str: 'floor', graphic_alt: 'floor', movement_cost: 1, defense_bonus: 0, output: [1, 0, 2], color_red: 0, color_green: 0, color_blue: 128 },
  { id: 3, name: 'Lake', graphic_str: 'lake', graphic_alt: 'lake', movement_cost: 1, defense_bonus: 0, output: [1, 0, 2], color_red: 32, color_green: 80, color_blue: 200 },
  { id: 4, name: 'Grassland', graphic_str: 'grassland', graphic_alt: 'grassland', movement_cost: 1, defense_bonus: 0, output: [2, 0, 1], color_red: 0, color_green: 200, color_blue: 0 },
  { id: 5, name: 'Plains', graphic_str: 'plains', graphic_alt: 'plains', movement_cost: 1, defense_bonus: 0, output: [1, 1, 1], color_red: 200, color_green: 200, color_blue: 0 },
  { id: 6, name: 'Desert', graphic_str: 'desert', graphic_alt: 'desert', movement_cost: 1, defense_bonus: 0, output: [0, 1, 0], color_red: 214, color_green: 185, color_blue: 106 },
  { id: 7, name: 'Forest', graphic_str: 'forest', graphic_alt: 'forest', movement_cost: 2, defense_bonus: 15, output: [1, 1, 1], color_red: 0, color_green: 128, color_blue: 0 },
  { id: 8, name: 'Hills', graphic_str: 'hills', graphic_alt: 'hills', movement_cost: 2, defense_bonus: 25, output: [1, 0, 0], color_red: 128, color_green: 128, color_blue: 0 },
  { id: 9, name: 'Mountains', graphic_str: 'mountains', graphic_alt: 'mountains', movement_cost: 3, defense_bonus: 50, output: [0, 1, 0], color_red: 128, color_green: 128, color_blue: 128 },
  { id: 10, name: 'Tundra', graphic_str: 'tundra', graphic_alt: 'tundra', movement_cost: 1, defense_bonus: 0, output: [1, 0, 0], color_red: 200, color_green: 200, color_blue: 200 },
  { id: 11, name: 'Jungle', graphic_str: 'jungle', graphic_alt: 'jungle', movement_cost: 2, defense_bonus: 15, output: [1, 0, 1], color_red: 0, color_green: 100, color_blue: 0 },
  { id: 12, name: 'Swamp', graphic_str: 'swamp', graphic_alt: 'swamp', movement_cost: 2, defense_bonus: 15, output: [1, 0, 0], color_red: 64, color_green: 128, color_blue: 64 },
];

// --- A simple terrain map (20x16) ---
// Mix of ocean, grassland, plains, forest, hills, mountains
function generateTerrainMap(): number[] {
  const map: number[] = [];
  for (let y = 0; y < MAP_HEIGHT; y++) {
    for (let x = 0; x < MAP_WIDTH; x++) {
      const idx = x + y * MAP_WIDTH;
      // Edges are ocean
      if (y <= 1 || y >= MAP_HEIGHT - 2 || x <= 1 || x >= MAP_WIDTH - 2) {
        map[idx] = 1; // Ocean
      } else if (y <= 3 || y >= MAP_HEIGHT - 4) {
        // Transitional zone — coast-like
        map[idx] = (x + y) % 3 === 0 ? 1 : 4; // ocean/grassland mix
      } else {
        // Land interior
        const r = ((x * 7 + y * 13) % 17);
        if (r < 4) map[idx] = 4;       // Grassland
        else if (r < 7) map[idx] = 5;  // Plains
        else if (r < 9) map[idx] = 7;  // Forest
        else if (r < 11) map[idx] = 8; // Hills
        else if (r < 12) map[idx] = 9; // Mountains
        else if (r < 13) map[idx] = 6; // Desert
        else if (r < 14) map[idx] = 10; // Tundra
        else if (r < 15) map[idx] = 11; // Jungle
        else if (r < 16) map[idx] = 12; // Swamp
        else map[idx] = 4;             // Grassland fallback
      }
    }
  }
  return map;
}

// --- Build initial packet sequence ---
export function buildInitPackets(): object[] {
  const terrainMap = generateTerrainMap();
  const packets: object[] = [];

  // 1. Server join reply
  packets.push({
    pid: PID.SERVER_JOIN_REPLY,
    you_can_join: true,
    conn_id: 1,
    message: '',
    capability: '+Freeciv.Web.Devel-3.4',
    challenge_file: '',
    salt: 0,
  });

  // 2. Connection info
  packets.push({
    pid: PID.CONN_INFO,
    id: 1,
    used: true,
    established: true,
    observer: true,
    player_num: -1,
    access_level: 1,
    username: 'TestObserver',
    addr: '127.0.0.1',
    capability: '+Freeciv.Web.Devel-3.4',
  });

  // 3. Connect message (triggers the wait_for_text callback)
  packets.push({
    pid: PID.CHAT_MSG,
    message: 'You are logged in as TestObserver.',
    event: 6, // E_CONNECTION
    conn_id: -1,
    tile: -1,
  });

  // 4. Set topology
  packets.push({
    pid: PID.SET_TOPOLOGY,
    topology_id: TOPOLOGY_ID,
  });

  // 5. Map info (triggers map allocation + overview init)
  packets.push({
    pid: PID.MAP_INFO,
    xsize: MAP_WIDTH,
    ysize: MAP_HEIGHT,
    topology_id: TOPOLOGY_ID,
    wrap_id: WRAP_ID,
  });

  // 6. Ruleset terrain control
  packets.push({
    pid: PID.RULESET_TERRAIN_CONTROL,
    move_fragments: 3,
    igter_cost: 1,
    pythagorean_diagonal: false,
  });

  // 7. Ruleset control
  packets.push({
    pid: PID.RULESET_CONTROL,
    num_unit_types: 2,
    num_impr_types: 0,
    num_tech_types: 1,
    num_extra_types: 0,
    government_count: 1,
    nation_count: 2,
    default_government: 0,
    government_during_revolution: 0,
    num_city_styles: 1,
    terrain_count: TERRAINS.length,
    resource_count: 0,
    num_specialist_types: 0,
    num_achievement_types: 0,
    num_goods_types: 0,
    num_disaster_types: 0,
    num_base_types: 0,
    num_road_types: 0,
    num_multipliers: 0,
    num_clause_types: 0,
    num_action_types: 0,
    num_trade_route_types: 0,
  });

  // 8. Ruleset terrains
  for (const t of TERRAINS) {
    packets.push({ pid: PID.RULESET_TERRAIN, ...t });
  }

  // 9. Ruleset unit class
  packets.push({
    pid: PID.RULESET_UNIT_CLASS,
    id: 0,
    name: 'Land',
    rule_name: 'Land',
    flags: [],
    min_speed: 3,
    hp_loss_pct: 0,
  });

  // 10. Ruleset unit types
  packets.push({
    pid: PID.RULESET_UNIT,
    id: 0,
    name: 'Warriors',
    rule_name: 'Warriors',
    graphic_str: 'u.warriors',
    graphic_alt: 'u.warriors',
    sound_move: 'mv_warriors',
    sound_move_alt: 'mv_generic',
    sound_fight: 'f_warriors',
    sound_fight_alt: 'f_generic',
    unit_class_id: 0,
    build_cost: 10,
    pop_cost: 0,
    attack_strength: 1,
    defense_strength: 1,
    move_rate: 3,
    vision_radius_sq: 8,
    transport_capacity: 0,
    hp: 10,
    firepower: 1,
    obsoleted_by: -1,
    converted_to: -1,
    fuel: 0,
    happy_cost: 1,
    upkeep: [0, 1, 0],
    paratroopers_range: 0,
    veteran_levels: 0,
    flags: [],
    roles: [],
    helptext: 'Basic infantry unit.',
  });

  packets.push({
    pid: PID.RULESET_UNIT,
    id: 1,
    name: 'Settlers',
    rule_name: 'Settlers',
    graphic_str: 'u.settlers',
    graphic_alt: 'u.settlers',
    sound_move: 'mv_settlers',
    sound_move_alt: 'mv_generic',
    sound_fight: 'f_generic',
    sound_fight_alt: 'f_generic',
    unit_class_id: 0,
    build_cost: 40,
    pop_cost: 1,
    attack_strength: 0,
    defense_strength: 1,
    move_rate: 6,
    vision_radius_sq: 8,
    transport_capacity: 0,
    hp: 20,
    firepower: 1,
    obsoleted_by: -1,
    converted_to: -1,
    fuel: 0,
    happy_cost: 0,
    upkeep: [0, 1, 0],
    paratroopers_range: 0,
    veteran_levels: 0,
    flags: [],
    roles: [],
    helptext: 'Builds cities.',
  });

  // 11. Nations
  packets.push({
    pid: PID.RULESET_NATION,
    id: 0,
    name: 'Roman',
    rule_name: 'Roman',
    adjective: 'Roman',
    translation_domain: '',
    flag_graphic: 'f.rome',
    color: 'rgb(255,0,0)',
    style: 0,
    leader_count: 1,
    leader_name: ['Caesar'],
    leader_is_male: [true],
    is_playable: true,
    barbarian_type: 0,
    groups: [],
  });
  packets.push({
    pid: PID.RULESET_NATION,
    id: 1,
    name: 'Greek',
    rule_name: 'Greek',
    adjective: 'Greek',
    translation_domain: '',
    flag_graphic: 'f.greece',
    color: 'rgb(0,0,255)',
    style: 0,
    leader_count: 1,
    leader_name: ['Alexander'],
    leader_is_male: [true],
    is_playable: true,
    barbarian_type: 0,
    groups: [],
  });

  // 12. Governments
  packets.push({
    pid: PID.RULESET_GOVERNMENT,
    id: 0,
    name: 'Despotism',
    rule_name: 'Despotism',
    graphic_str: 'gov.despotism',
    graphic_alt: '-',
    helptext: '',
  });

  // 13. Techs
  packets.push({
    pid: PID.RULESET_TECH,
    id: 0,
    name: 'None',
    rule_name: 'None',
    graphic_str: '-',
    graphic_alt: '-',
    helptext: '',
    research_reqs: [],
    req: [],
    root_req: -1,
    flags: [],
    cost: 0,
  });

  // 14. Ruleset game
  packets.push({
    pid: PID.RULESET_GAME,
    default_specialist: 0,
    veteran_chance: [100],
    veteran_name: ['Regular'],
    veteran_raise_chance: [0],
    veteran_work_raise_chance: [0],
    veteran_power_fact: [100],
    veteran_move_bonus: [0],
  });

  // 15. Rulesets ready
  packets.push({ pid: PID.RULESETS_READY });

  // 16. Players
  packets.push({
    pid: PID.PLAYER_INFO,
    playerno: 0,
    name: 'Caesar',
    username: 'ai*Caesar',
    is_alive: true,
    nation: 0,
    government: 0,
    target_government: 0,
    gold: 100,
    tax: 30,
    luxury: 0,
    science: 70,
    score: 10,
    turns_alive: 5,
    revolution_finishes: -1,
    ai: true,
    phase_done: false,
    nturns_idle: 0,
    flags: [],
    gives_shared_vision: [],
    color: { r: 255, g: 0, b: 0 },
    team: 0,
    is_ready: true,
    love: [],
  });
  packets.push({
    pid: PID.WEB_PLAYER_INFO_ADDITION,
    playerno: 0,
    nation: 0,
  });

  packets.push({
    pid: PID.PLAYER_INFO,
    playerno: 1,
    name: 'Alexander',
    username: 'ai*Alexander',
    is_alive: true,
    nation: 1,
    government: 0,
    target_government: 0,
    gold: 80,
    tax: 30,
    luxury: 0,
    science: 70,
    score: 8,
    turns_alive: 5,
    revolution_finishes: -1,
    ai: true,
    phase_done: false,
    nturns_idle: 0,
    flags: [],
    gives_shared_vision: [],
    color: { r: 0, g: 0, b: 255 },
    team: 1,
    is_ready: true,
    love: [],
  });
  packets.push({
    pid: PID.WEB_PLAYER_INFO_ADDITION,
    playerno: 1,
    nation: 1,
  });

  // Diplstate between players
  packets.push({
    pid: PID.PLAYER_DIPLSTATE,
    plr1: 0,
    plr2: 1,
    type: 0, // DS_WAR
    turns_left: 0,
    contact_turns_left: 0,
  });

  // 17. Research info
  packets.push({
    pid: PID.RESEARCH_INFO,
    id: 0,
    researching: 0,
    researching_cost: 0,
    bulbs_researched: 0,
    tech_goal: 0,
    inventions: [1], // first tech known
    team: 0,
  });
  packets.push({
    pid: PID.RESEARCH_INFO,
    id: 1,
    researching: 0,
    researching_cost: 0,
    bulbs_researched: 0,
    tech_goal: 0,
    inventions: [1],
    team: 1,
  });

  // 18. Game info (turn > 0 triggers C_S_RUNNING)
  packets.push({
    pid: PID.GAME_INFO,
    turn: 5,
    year: -3750,
    timeout: 0,
    first_timeout: 0,
    phase: 0,
    phase_mode: 0,
    gold: 100,
    tax: 30,
    luxury: 0,
    science: 70,
    government: 0,
    min_players: 1,
    max_players: 30,
    nplayers: 2,
    globalwarming: 0,
    heating: 0,
    nuclearwinter: 0,
    cooling: 0,
    techpenalty: 0,
    foodbox: 10,
    shieldbox: 10,
    aifill: 2,
    calendar_fragment_count: 0,
    fragments: 0,
  });

  // 19. Calendar info
  packets.push({
    pid: PID.CALENDAR_INFO,
    positive_year_label: 'AD',
    negative_year_label: 'BC',
    calendar_fragment_name: [],
  });

  // 20. Timeout info
  packets.push({
    pid: PID.TIMEOUT_INFO,
    last_turn_change_time: Date.now() / 1000,
    seconds_to_phasedone: 300,
  });

  // 21. Tile info — populate all tiles
  for (let y = 0; y < MAP_HEIGHT; y++) {
    for (let x = 0; x < MAP_WIDTH; x++) {
      const idx = x + y * MAP_WIDTH;
      const terrainId = terrainMap[idx];
      const isOcean = terrainId <= 3;
      packets.push({
        pid: PID.TILE_INFO,
        tile: idx,
        x,
        y,
        terrain: terrainId,
        resource: -1,
        continent: isOcean ? 0 : 1,
        known: 2,    // TILE_KNOWN_SEEN
        extras: [],  // no extras
        owner: isOcean ? 255 : (x < MAP_WIDTH / 2 ? 0 : 1),
        worked: 0,
        spec_sprite: '',
        label: '',
        claimer: 255,
        goto_dir: -1,
        nuke: 0,
        infra: [],
      });
    }
  }

  // 22. Units — place some warriors
  const unitPositions = [
    { id: 1, owner: 0, tile: 5 + 5 * MAP_WIDTH, type: 0 },  // Player 0 warrior
    { id: 2, owner: 0, tile: 6 + 6 * MAP_WIDTH, type: 1 },  // Player 0 settler
    { id: 3, owner: 1, tile: 14 + 5 * MAP_WIDTH, type: 0 }, // Player 1 warrior
    { id: 4, owner: 1, tile: 13 + 7 * MAP_WIDTH, type: 0 }, // Player 1 warrior
    { id: 5, owner: 0, tile: 7 + 8 * MAP_WIDTH, type: 0 },  // Player 0 warrior
  ];

  for (const u of unitPositions) {
    packets.push({
      pid: PID.UNIT_INFO,
      id: u.id,
      owner: u.owner,
      tile: u.tile,
      type: u.type,
      hp: 10,
      veteran: 0,
      movesleft: 3,
      activity: 0,  // ACTIVITY_IDLE
      transported_by: -1,
      homecity: 0,
      done_moving: false,
      ai: true,
      goto_tile: -1,
      action_decision_want: 0,
      action_decision_tile: -1,
      facing: 6,
      upkeep: [0, 1, 0],
      ssa_controller: 0,
    });
  }

  // 23. Start phase + begin turn
  packets.push({ pid: PID.START_PHASE, phase: 0 });
  packets.push({ pid: PID.BEGIN_TURN });

  return packets;
}

/**
 * Create a unit move packet: moves a unit from old tile to new tile.
 */
export function buildUnitMovePacket(
  unitId: number,
  owner: number,
  newTile: number,
  unitType: number = 0,
): object {
  return {
    pid: PID.UNIT_INFO,
    id: unitId,
    owner,
    tile: newTile,
    type: unitType,
    hp: 10,
    veteran: 0,
    movesleft: 2,  // reduced after move
    activity: 0,
    transported_by: -1,
    homecity: 0,
    done_moving: false,
    ai: true,
    goto_tile: -1,
    action_decision_want: 0,
    action_decision_tile: -1,
    facing: 6,
    upkeep: [0, 1, 0],
    ssa_controller: 0,
  };
}

export const MAP_DIMS = { width: MAP_WIDTH, height: MAP_HEIGHT };
