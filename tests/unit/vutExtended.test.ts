/**
 * Unit tests for extended VUT requirement implementations.
 *
 * Covers:
 *  VNAT-1..4   VUT_NATION      — player nation match
 *  VACT-1..4   VUT_ACTIVITY    — unit activity state
 *  VUS-1..5    VUT_UNITSTATE   — unit transported / has-home-city
 *  VDR-1..6    VUT_DIPLREL     — diplomatic relation (DS_* states 0-6)
 *  VCT-1..6    VUT_CITYTILE    — city center / worked tile
 *  VMC-1..5    VUT_MINCULTURE  — minimum culture (city + player range)
 *  VTC-1..5    VUT_TERRAINCLASS — terrain class (land / ocean)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  VUT_NATION,
  VUT_ACTIVITY,
  VUT_UNITSTATE,
  VUT_DIPLREL,
  VUT_CITYTILE,
  VUT_MINCULTURE,
  VUT_TERRAINCLASS,
  REQ_RANGE_LOCAL,
  REQ_RANGE_CITY,
  REQ_RANGE_PLAYER,
  RPT_POSSIBLE,
  RPT_CERTAIN,
  ACTIVITY_IDLE,
  ACTIVITY_FORTIFIED,
  CITYT_CENTER,
  CITYT_WORKER,
  CITYT_CLAIMED,
  TC_LAND,
  TC_OCEAN,
  US_TRANSPORTED,
  US_HAS_HOME_CITY,
} from '@/data/fcTypes';
import type { City, MapInfo, Player, Tech, Terrain, Tile, Unit, UnitType } from '@/data/types';

type DiplStateMap = Record<number, { state: number }>;
type UnitClassLike = { id: number };
type VutExtendedStore = {
  unitTypes: Record<number, UnitType>;
  unitClasses: Record<number, UnitClassLike>;
  improvements: Record<number, { id: number }>;
  players: Record<number, Player>;
  cities: Record<number, City>;
  techs: Record<number, Tech>;
  terrains: Record<number, Terrain>;
  governments: Record<number, { id: number }>;
  rulesControl: { num_impr_types: number };
  gameInfo: null;
  mapInfo: MapInfo | null;
  nations: Record<number, { id: number }>;
};

// ---------------------------------------------------------------------------
// Store mock
// ---------------------------------------------------------------------------
const mockStore = vi.hoisted<VutExtendedStore>(() => ({
  unitTypes: {},
  unitClasses: {},
  improvements: {},
  players: {},
  cities: {},
  techs: {},
  terrains: {},
  governments: {},
  rulesControl: { num_impr_types: 0 },
  gameInfo: null,
  mapInfo: null,
  nations: {},
}));

vi.mock('@/data/store', () => ({ store: mockStore }));
vi.mock('@/data/tech', () => ({
  TECH_KNOWN: 2,
  playerInventionState: () => 0,
}));
vi.mock('@/data/map', async (importOriginal) => ({
  ...(await importOriginal() as object),
}));
vi.mock('@/renderer/tilespec', () => ({
  get_unit_type_image_sprite: vi.fn(() => null),
  get_improvement_image_sprite: vi.fn(() => null),
}));
vi.mock('@/core/events', () => ({
  globalEvents: { emit: vi.fn(), on: vi.fn() },
}));
vi.mock('@/client/clientState', () => ({
  clientState: vi.fn(() => 0),
  clientPlaying: vi.fn(() => null),
  clientIsObserver: () => true,
  setClientState: vi.fn(),
}));

import { isReqActive } from '@/data/requirements';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function makeReq(kind: number, value: number, present = true, range = REQ_RANGE_LOCAL) {
  return { kind, range, value, present };
}

function makePlayer(overrides: Partial<Player> = {}): Player {
  return {
    playerno: 1,
    name: 'Player',
    username: 'player',
    nation: 0,
    is_alive: true,
    is_ready: true,
    ai_skill_level: 0,
    gold: 0,
    tax: 0,
    luxury: 0,
    science: 0,
    expected_income: 0,
    team: 0,
    embassy_txt: '',
    ...overrides,
  };
}

function makeUnit(overrides: Partial<Unit> = {}): Unit {
  return {
    id: 1,
    owner: 0,
    tile: 0,
    type: 0,
    hp: 10,
    veteran: 0,
    movesleft: 0,
    activity: ACTIVITY_IDLE,
    transported_by: 0,
    homecity: 0,
    done_moving: false,
    ai: false,
    goto_tile: 0,
    ...overrides,
  };
}

function makeUnitType(overrides: Partial<UnitType> = {}): UnitType {
  return {
    id: 1,
    name: 'Warrior',
    rule_name: 'warrior',
    graphic_str: 'warrior',
    attack_strength: 1,
    defense_strength: 1,
    move_rate: 1,
    hp: 10,
    firepower: 1,
    build_cost: 10,
    vision_radius_sq: 2,
    flags: [],
    ...overrides,
  };
}

function makeTile(overrides: Partial<Tile> = {}): Tile {
  return {
    index: 0,
    x: 0,
    y: 0,
    terrain: 0,
    known: 0,
    extras: [],
    owner: 0,
    worked: 0,
    resource: 0,
    continent: 0,
    ...overrides,
  };
}

function makeCity(overrides: Partial<City> = {}): City {
  return {
    id: 1,
    owner: 0,
    tile: 0,
    name: 'City',
    size: 1,
    food_stock: 0,
    shield_stock: 0,
    production_kind: 0,
    production_value: 0,
    surplus: [],
    waste: [],
    unhappy_penalty: [],
    prod: [],
    citizen_extra: [],
    ppl_happy: [],
    ppl_content: [],
    ppl_unhappy: [],
    ppl_angry: [],
    improvements: [],
    ...overrides,
  };
}

function makeTerrain(id: number, name: string, tclass?: number): Terrain {
  return {
    id,
    name,
    graphic_str: name.toLowerCase(),
    movement_cost: 1,
    defense_bonus: 0,
    output: [],
    ...(tclass == null ? {} : { tclass }),
  };
}

function resetStore() {
  mockStore.unitTypes = {};
  mockStore.unitClasses = {};
  mockStore.improvements = {};
  mockStore.players = {};
  mockStore.cities = {};
  mockStore.techs = {};
  mockStore.terrains = {};
  mockStore.governments = {};
  mockStore.rulesControl = { num_impr_types: 0 };
  mockStore.gameInfo = null;
  mockStore.mapInfo = null;
  mockStore.nations = {};
}

// ---------------------------------------------------------------------------
// VNAT: VUT_NATION
// ---------------------------------------------------------------------------
describe('VUT_NATION — player nation check', () => {
  beforeEach(resetStore);

  it('VNAT-1: TRI_YES when player.nation matches req.value', () => {
    const player = makePlayer({ nation: 5 });
    expect(isReqActive(player, null, null, null, null, null, null,
      makeReq(VUT_NATION, 5), RPT_CERTAIN)).toBe(true);
  });

  it('VNAT-2: TRI_NO when player.nation does not match', () => {
    const player = makePlayer({ nation: 3 });
    expect(isReqActive(player, null, null, null, null, null, null,
      makeReq(VUT_NATION, 5), RPT_CERTAIN)).toBe(false);
  });

  it('VNAT-3: TRI_MAYBE (RPT_POSSIBLE→true) when targetPlayer is null', () => {
    expect(isReqActive(null, null, null, null, null, null, null,
      makeReq(VUT_NATION, 5), RPT_POSSIBLE)).toBe(true);
  });

  it('VNAT-4: present=false inverts — wrong nation means requirement met', () => {
    const player = makePlayer({ nation: 3 });
    expect(isReqActive(player, null, null, null, null, null, null,
      makeReq(VUT_NATION, 5, false), RPT_CERTAIN)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// VACT: VUT_ACTIVITY
// ---------------------------------------------------------------------------
describe('VUT_ACTIVITY — unit activity state', () => {
  beforeEach(resetStore);

  it('VACT-1: TRI_YES when unit.activity matches ACTIVITY_FORTIFIED', () => {
    const unit = makeUnit({ activity: ACTIVITY_FORTIFIED });
    expect(isReqActive(null, null, null, null, unit, null, null,
      makeReq(VUT_ACTIVITY, ACTIVITY_FORTIFIED), RPT_CERTAIN)).toBe(true);
  });

  it('VACT-2: TRI_NO when unit.activity is different', () => {
    const unit = makeUnit({ activity: ACTIVITY_IDLE });
    expect(isReqActive(null, null, null, null, unit, null, null,
      makeReq(VUT_ACTIVITY, ACTIVITY_FORTIFIED), RPT_CERTAIN)).toBe(false);
  });

  it('VACT-3: TRI_MAYBE when targetUnittype is null', () => {
    expect(isReqActive(null, null, null, null, null, null, null,
      makeReq(VUT_ACTIVITY, ACTIVITY_FORTIFIED), RPT_POSSIBLE)).toBe(true);
  });

  it('VACT-4: TRI_MAYBE when unit has no activity field (unit type, not instance)', () => {
    const unitType = makeUnitType({}); // no activity field usage in req path
    expect(isReqActive(null, null, null, null, unitType, null, null,
      makeReq(VUT_ACTIVITY, ACTIVITY_FORTIFIED), RPT_CERTAIN)).toBe(false); // TRI_MAYBE → RPT_CERTAIN → false
  });
});

// ---------------------------------------------------------------------------
// VUS: VUT_UNITSTATE
// ---------------------------------------------------------------------------
describe('VUT_UNITSTATE — unit state checks', () => {
  beforeEach(resetStore);

  it('VUS-1: US_TRANSPORTED → TRI_YES when transported_by is a valid id', () => {
    const unit = makeUnit({ transported_by: 7 });
    expect(isReqActive(null, null, null, null, unit, null, null,
      makeReq(VUT_UNITSTATE, US_TRANSPORTED), RPT_CERTAIN)).toBe(true);
  });

  it('VUS-2: US_TRANSPORTED → TRI_NO when transported_by is -1 (not transported)', () => {
    const unit = makeUnit({ transported_by: -1 });
    expect(isReqActive(null, null, null, null, unit, null, null,
      makeReq(VUT_UNITSTATE, US_TRANSPORTED), RPT_CERTAIN)).toBe(false);
  });

  it('VUS-3: US_HAS_HOME_CITY → TRI_YES when homecity is nonzero', () => {
    const unit = makeUnit({ homecity: 3 });
    expect(isReqActive(null, null, null, null, unit, null, null,
      makeReq(VUT_UNITSTATE, US_HAS_HOME_CITY), RPT_CERTAIN)).toBe(true);
  });

  it('VUS-4: US_HAS_HOME_CITY → TRI_NO when homecity is 0 (homeless)', () => {
    const unit = makeUnit({ homecity: 0 });
    expect(isReqActive(null, null, null, null, unit, null, null,
      makeReq(VUT_UNITSTATE, US_HAS_HOME_CITY), RPT_CERTAIN)).toBe(false);
  });

  it('VUS-5: unknown US_* value → TRI_MAYBE (RPT_POSSIBLE→true)', () => {
    const unit = makeUnit();
    expect(isReqActive(null, null, null, null, unit, null, null,
      makeReq(VUT_UNITSTATE, 99), RPT_POSSIBLE)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// VDR: VUT_DIPLREL
// ---------------------------------------------------------------------------
describe('VUT_DIPLREL — diplomatic relation check', () => {
  beforeEach(resetStore);

  const DS_WAR = 1;
  const DS_PEACE = 3;
  const DS_ALLIANCE = 4;

  function makePlayerWithDiplstates(diplstates: DiplStateMap): Player {
    return makePlayer({ diplstates });
  }

  it('VDR-1: TRI_YES when player has the required diplo state with any player (RANGE_PLAYER)', () => {
    const player = makePlayerWithDiplstates({ 2: { state: DS_WAR }, 3: { state: DS_PEACE } });
    expect(isReqActive(player, null, null, null, null, null, null,
      makeReq(VUT_DIPLREL, DS_WAR, true, REQ_RANGE_PLAYER), RPT_CERTAIN)).toBe(true);
  });

  it('VDR-2: TRI_NO when no player has the required state', () => {
    const player = makePlayerWithDiplstates({ 2: { state: DS_PEACE }, 3: { state: DS_ALLIANCE } });
    expect(isReqActive(player, null, null, null, null, null, null,
      makeReq(VUT_DIPLREL, DS_WAR, true, REQ_RANGE_PLAYER), RPT_CERTAIN)).toBe(false);
  });

  it('VDR-3: TRI_MAYBE when targetPlayer is null', () => {
    expect(isReqActive(null, null, null, null, null, null, null,
      makeReq(VUT_DIPLREL, DS_WAR, true, REQ_RANGE_PLAYER), RPT_POSSIBLE)).toBe(true);
  });

  it('VDR-4: TRI_MAYBE when player has no diplstates data', () => {
    const player = makePlayer(); // no diplstates field
    expect(isReqActive(player, null, null, null, null, null, null,
      makeReq(VUT_DIPLREL, DS_WAR, true, REQ_RANGE_PLAYER), RPT_POSSIBLE)).toBe(true);
  });

  it('VDR-5: TRI_MAYBE for REQ_RANGE_LOCAL (actor unknown)', () => {
    const player = makePlayerWithDiplstates({ 2: { state: DS_WAR } });
    expect(isReqActive(player, null, null, null, null, null, null,
      makeReq(VUT_DIPLREL, DS_WAR, true, REQ_RANGE_LOCAL), RPT_POSSIBLE)).toBe(true);
  });

  it('VDR-6: TRI_MAYBE for derived relation value ≥ 7 (compound relation)', () => {
    const player = makePlayerWithDiplstates({ 2: { state: DS_WAR } });
    expect(isReqActive(player, null, null, null, null, null, null,
      makeReq(VUT_DIPLREL, 8, true, REQ_RANGE_PLAYER), RPT_CERTAIN)).toBe(false); // TRI_MAYBE → false
  });
});

// ---------------------------------------------------------------------------
// VCT: VUT_CITYTILE
// ---------------------------------------------------------------------------
describe('VUT_CITYTILE — city tile type checks', () => {
  beforeEach(resetStore);

  it('VCT-1: CITYT_CENTER → TRI_YES when tile.index equals city.tile', () => {
    const tile = makeTile({ index: 42 });
    const city = makeCity({ id: 1, tile: 42 });
    expect(isReqActive(null, city, null, tile, null, null, null,
      makeReq(VUT_CITYTILE, CITYT_CENTER), RPT_CERTAIN)).toBe(true);
  });

  it('VCT-2: CITYT_CENTER → TRI_NO when tile is not the city center', () => {
    const tile = makeTile({ index: 43 });
    const city = makeCity({ id: 1, tile: 42 });
    expect(isReqActive(null, city, null, tile, null, null, null,
      makeReq(VUT_CITYTILE, CITYT_CENTER), RPT_CERTAIN)).toBe(false);
  });

  it('VCT-3: CITYT_CENTER → TRI_MAYBE when city is null', () => {
    const tile = makeTile({ index: 42 });
    expect(isReqActive(null, null, null, tile, null, null, null,
      makeReq(VUT_CITYTILE, CITYT_CENTER), RPT_POSSIBLE)).toBe(true);
  });

  it('VCT-4: CITYT_WORKER → TRI_YES when tile.worked is nonzero', () => {
    const tile = makeTile({ index: 10, worked: 3 }); // worked by city id=3
    expect(isReqActive(null, null, null, tile, null, null, null,
      makeReq(VUT_CITYTILE, CITYT_WORKER), RPT_CERTAIN)).toBe(true);
  });

  it('VCT-5: CITYT_WORKER → TRI_NO when tile.worked is 0 (unworked)', () => {
    const tile = makeTile({ index: 10, worked: 0 });
    expect(isReqActive(null, null, null, tile, null, null, null,
      makeReq(VUT_CITYTILE, CITYT_WORKER), RPT_CERTAIN)).toBe(false);
  });

  it('VCT-6: CITYT_CLAIMED → TRI_MAYBE always (no client-side radius data)', () => {
    const tile = makeTile({ index: 10, worked: 0 });
    expect(isReqActive(null, null, null, tile, null, null, null,
      makeReq(VUT_CITYTILE, CITYT_CLAIMED), RPT_POSSIBLE)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// VMC: VUT_MINCULTURE
// ---------------------------------------------------------------------------
describe('VUT_MINCULTURE — minimum culture check', () => {
  beforeEach(resetStore);

  it('VMC-1: TRI_YES when city.culture >= req.value (REQ_RANGE_CITY)', () => {
    const city = makeCity({ culture: 50 });
    expect(isReqActive(null, city, null, null, null, null, null,
      makeReq(VUT_MINCULTURE, 30, true, REQ_RANGE_CITY), RPT_CERTAIN)).toBe(true);
  });

  it('VMC-2: TRI_NO when city.culture < req.value', () => {
    const city = makeCity({ culture: 10 });
    expect(isReqActive(null, city, null, null, null, null, null,
      makeReq(VUT_MINCULTURE, 30, true, REQ_RANGE_CITY), RPT_CERTAIN)).toBe(false);
  });

  it('VMC-3: TRI_YES when player.culture >= req.value (REQ_RANGE_PLAYER)', () => {
    const player = makePlayer({ culture: 100 });
    expect(isReqActive(player, null, null, null, null, null, null,
      makeReq(VUT_MINCULTURE, 80, true, REQ_RANGE_PLAYER), RPT_CERTAIN)).toBe(true);
  });

  it('VMC-4: TRI_MAYBE when city has no culture field', () => {
    const city = makeCity(); // no culture field
    expect(isReqActive(null, city, null, null, null, null, null,
      makeReq(VUT_MINCULTURE, 30, true, REQ_RANGE_CITY), RPT_POSSIBLE)).toBe(true);
  });

  it('VMC-5: TRI_MAYBE when range is not CITY or PLAYER', () => {
    const city = makeCity({ culture: 50 });
    expect(isReqActive(null, city, null, null, null, null, null,
      makeReq(VUT_MINCULTURE, 30, true, REQ_RANGE_LOCAL), RPT_POSSIBLE)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// VTC: VUT_TERRAINCLASS
// ---------------------------------------------------------------------------
describe('VUT_TERRAINCLASS — terrain class check', () => {
  beforeEach(resetStore);

  it('VTC-1: TRI_YES when terrain tclass is TC_LAND (0)', () => {
    mockStore.terrains[1] = makeTerrain(1, 'Grassland', TC_LAND);
    const tile = makeTile({ terrain: 1 });
    expect(isReqActive(null, null, null, tile, null, null, null,
      makeReq(VUT_TERRAINCLASS, TC_LAND), RPT_CERTAIN)).toBe(true);
  });

  it('VTC-2: TRI_NO when tclass is TC_OCEAN but TC_LAND required', () => {
    mockStore.terrains[2] = makeTerrain(2, 'Ocean', TC_OCEAN);
    const tile = makeTile({ terrain: 2 });
    expect(isReqActive(null, null, null, tile, null, null, null,
      makeReq(VUT_TERRAINCLASS, TC_LAND), RPT_CERTAIN)).toBe(false);
  });

  it('VTC-3: TRI_YES when terrain class is TC_OCEAN and that is required', () => {
    mockStore.terrains[2] = makeTerrain(2, 'Ocean', TC_OCEAN);
    const tile = makeTile({ terrain: 2 });
    expect(isReqActive(null, null, null, tile, null, null, null,
      makeReq(VUT_TERRAINCLASS, TC_OCEAN), RPT_CERTAIN)).toBe(true);
  });

  it('VTC-4: TRI_MAYBE when terrain has no tclass field', () => {
    mockStore.terrains[3] = makeTerrain(3, 'Desert'); // no tclass
    const tile = makeTile({ terrain: 3 });
    expect(isReqActive(null, null, null, tile, null, null, null,
      makeReq(VUT_TERRAINCLASS, TC_LAND), RPT_POSSIBLE)).toBe(true);
  });

  it('VTC-5: TRI_MAYBE when targetTile is null', () => {
    expect(isReqActive(null, null, null, null, null, null, null,
      makeReq(VUT_TERRAINCLASS, TC_LAND), RPT_CERTAIN)).toBe(false);
  });
});
