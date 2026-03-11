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

// ---------------------------------------------------------------------------
// Store mock
// ---------------------------------------------------------------------------
const mockStore = vi.hoisted(() => ({
  unitTypes: {} as Record<number, unknown>,
  unitClasses: {} as Record<number, unknown>,
  improvements: {} as Record<number, unknown>,
  players: {} as Record<number, unknown>,
  cities: {} as Record<number, unknown>,
  techs: {} as Record<number, unknown>,
  terrains: {} as Record<number, unknown>,
  governments: {} as Record<number, unknown>,
  rulesControl: { num_impr_types: 0 },
  gameInfo: null as unknown,
  mapInfo: null as unknown,
  nations: {} as Record<number, unknown>,
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

/* eslint-disable @typescript-eslint/no-explicit-any */

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function makeReq(kind: number, value: number, present = true, range = REQ_RANGE_LOCAL) {
  return { kind, range, value, present };
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
    const player = { playerno: 1, nation: 5 } as any;
    expect(isReqActive(player, null, null, null, null, null, null,
      makeReq(VUT_NATION, 5), RPT_CERTAIN)).toBe(true);
  });

  it('VNAT-2: TRI_NO when player.nation does not match', () => {
    const player = { playerno: 1, nation: 3 } as any;
    expect(isReqActive(player, null, null, null, null, null, null,
      makeReq(VUT_NATION, 5), RPT_CERTAIN)).toBe(false);
  });

  it('VNAT-3: TRI_MAYBE (RPT_POSSIBLE→true) when targetPlayer is null', () => {
    expect(isReqActive(null, null, null, null, null, null, null,
      makeReq(VUT_NATION, 5), RPT_POSSIBLE)).toBe(true);
  });

  it('VNAT-4: present=false inverts — wrong nation means requirement met', () => {
    const player = { playerno: 1, nation: 3 } as any;
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
    const unit = { id: 1, activity: ACTIVITY_FORTIFIED } as any;
    expect(isReqActive(null, null, null, null, unit, null, null,
      makeReq(VUT_ACTIVITY, ACTIVITY_FORTIFIED), RPT_CERTAIN)).toBe(true);
  });

  it('VACT-2: TRI_NO when unit.activity is different', () => {
    const unit = { id: 1, activity: ACTIVITY_IDLE } as any;
    expect(isReqActive(null, null, null, null, unit, null, null,
      makeReq(VUT_ACTIVITY, ACTIVITY_FORTIFIED), RPT_CERTAIN)).toBe(false);
  });

  it('VACT-3: TRI_MAYBE when targetUnittype is null', () => {
    expect(isReqActive(null, null, null, null, null, null, null,
      makeReq(VUT_ACTIVITY, ACTIVITY_FORTIFIED), RPT_POSSIBLE)).toBe(true);
  });

  it('VACT-4: TRI_MAYBE when unit has no activity field (unit type, not instance)', () => {
    const unitType = { id: 1, name: 'Warrior' } as any; // no activity field
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
    const unit = { id: 1, transported_by: 7 } as any;
    expect(isReqActive(null, null, null, null, unit, null, null,
      makeReq(VUT_UNITSTATE, US_TRANSPORTED), RPT_CERTAIN)).toBe(true);
  });

  it('VUS-2: US_TRANSPORTED → TRI_NO when transported_by is -1 (not transported)', () => {
    const unit = { id: 1, transported_by: -1 } as any;
    expect(isReqActive(null, null, null, null, unit, null, null,
      makeReq(VUT_UNITSTATE, US_TRANSPORTED), RPT_CERTAIN)).toBe(false);
  });

  it('VUS-3: US_HAS_HOME_CITY → TRI_YES when homecity is nonzero', () => {
    const unit = { id: 1, homecity: 3 } as any;
    expect(isReqActive(null, null, null, null, unit, null, null,
      makeReq(VUT_UNITSTATE, US_HAS_HOME_CITY), RPT_CERTAIN)).toBe(true);
  });

  it('VUS-4: US_HAS_HOME_CITY → TRI_NO when homecity is 0 (homeless)', () => {
    const unit = { id: 1, homecity: 0 } as any;
    expect(isReqActive(null, null, null, null, unit, null, null,
      makeReq(VUT_UNITSTATE, US_HAS_HOME_CITY), RPT_CERTAIN)).toBe(false);
  });

  it('VUS-5: unknown US_* value → TRI_MAYBE (RPT_POSSIBLE→true)', () => {
    const unit = { id: 1 } as any;
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

  function makePlayer(diplstates: Record<number, { state: number }>): any {
    return { playerno: 1, nation: 0, diplstates };
  }

  it('VDR-1: TRI_YES when player has the required diplo state with any player (RANGE_PLAYER)', () => {
    const player = makePlayer({ 2: { state: DS_WAR }, 3: { state: DS_PEACE } });
    expect(isReqActive(player, null, null, null, null, null, null,
      makeReq(VUT_DIPLREL, DS_WAR, true, REQ_RANGE_PLAYER), RPT_CERTAIN)).toBe(true);
  });

  it('VDR-2: TRI_NO when no player has the required state', () => {
    const player = makePlayer({ 2: { state: DS_PEACE }, 3: { state: DS_ALLIANCE } });
    expect(isReqActive(player, null, null, null, null, null, null,
      makeReq(VUT_DIPLREL, DS_WAR, true, REQ_RANGE_PLAYER), RPT_CERTAIN)).toBe(false);
  });

  it('VDR-3: TRI_MAYBE when targetPlayer is null', () => {
    expect(isReqActive(null, null, null, null, null, null, null,
      makeReq(VUT_DIPLREL, DS_WAR, true, REQ_RANGE_PLAYER), RPT_POSSIBLE)).toBe(true);
  });

  it('VDR-4: TRI_MAYBE when player has no diplstates data', () => {
    const player = { playerno: 1, nation: 0 } as any; // no diplstates field
    expect(isReqActive(player, null, null, null, null, null, null,
      makeReq(VUT_DIPLREL, DS_WAR, true, REQ_RANGE_PLAYER), RPT_POSSIBLE)).toBe(true);
  });

  it('VDR-5: TRI_MAYBE for REQ_RANGE_LOCAL (actor unknown)', () => {
    const player = makePlayer({ 2: { state: DS_WAR } });
    expect(isReqActive(player, null, null, null, null, null, null,
      makeReq(VUT_DIPLREL, DS_WAR, true, REQ_RANGE_LOCAL), RPT_POSSIBLE)).toBe(true);
  });

  it('VDR-6: TRI_MAYBE for derived relation value ≥ 7 (compound relation)', () => {
    const player = makePlayer({ 2: { state: DS_WAR } });
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
    const tile = { index: 42 } as any;
    const city = { id: 1, tile: 42 } as any;
    expect(isReqActive(null, city, null, tile, null, null, null,
      makeReq(VUT_CITYTILE, CITYT_CENTER), RPT_CERTAIN)).toBe(true);
  });

  it('VCT-2: CITYT_CENTER → TRI_NO when tile is not the city center', () => {
    const tile = { index: 43 } as any;
    const city = { id: 1, tile: 42 } as any;
    expect(isReqActive(null, city, null, tile, null, null, null,
      makeReq(VUT_CITYTILE, CITYT_CENTER), RPT_CERTAIN)).toBe(false);
  });

  it('VCT-3: CITYT_CENTER → TRI_MAYBE when city is null', () => {
    const tile = { index: 42 } as any;
    expect(isReqActive(null, null, null, tile, null, null, null,
      makeReq(VUT_CITYTILE, CITYT_CENTER), RPT_POSSIBLE)).toBe(true);
  });

  it('VCT-4: CITYT_WORKER → TRI_YES when tile.worked is nonzero', () => {
    const tile = { index: 10, worked: 3 } as any; // worked by city id=3
    expect(isReqActive(null, null, null, tile, null, null, null,
      makeReq(VUT_CITYTILE, CITYT_WORKER), RPT_CERTAIN)).toBe(true);
  });

  it('VCT-5: CITYT_WORKER → TRI_NO when tile.worked is 0 (unworked)', () => {
    const tile = { index: 10, worked: 0 } as any;
    expect(isReqActive(null, null, null, tile, null, null, null,
      makeReq(VUT_CITYTILE, CITYT_WORKER), RPT_CERTAIN)).toBe(false);
  });

  it('VCT-6: CITYT_CLAIMED → TRI_MAYBE always (no client-side radius data)', () => {
    const tile = { index: 10, worked: 0 } as any;
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
    const city = { id: 1, culture: 50 } as any;
    expect(isReqActive(null, city, null, null, null, null, null,
      makeReq(VUT_MINCULTURE, 30, true, REQ_RANGE_CITY), RPT_CERTAIN)).toBe(true);
  });

  it('VMC-2: TRI_NO when city.culture < req.value', () => {
    const city = { id: 1, culture: 10 } as any;
    expect(isReqActive(null, city, null, null, null, null, null,
      makeReq(VUT_MINCULTURE, 30, true, REQ_RANGE_CITY), RPT_CERTAIN)).toBe(false);
  });

  it('VMC-3: TRI_YES when player.culture >= req.value (REQ_RANGE_PLAYER)', () => {
    const player = { playerno: 1, culture: 100 } as any;
    expect(isReqActive(player, null, null, null, null, null, null,
      makeReq(VUT_MINCULTURE, 80, true, REQ_RANGE_PLAYER), RPT_CERTAIN)).toBe(true);
  });

  it('VMC-4: TRI_MAYBE when city has no culture field', () => {
    const city = { id: 1 } as any; // no culture field
    expect(isReqActive(null, city, null, null, null, null, null,
      makeReq(VUT_MINCULTURE, 30, true, REQ_RANGE_CITY), RPT_POSSIBLE)).toBe(true);
  });

  it('VMC-5: TRI_MAYBE when range is not CITY or PLAYER', () => {
    const city = { id: 1, culture: 50 } as any;
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
    mockStore.terrains[1] = { id: 1, name: 'Grassland', tclass: TC_LAND };
    const tile = { terrain: 1 } as any;
    expect(isReqActive(null, null, null, tile, null, null, null,
      makeReq(VUT_TERRAINCLASS, TC_LAND), RPT_CERTAIN)).toBe(true);
  });

  it('VTC-2: TRI_NO when tclass is TC_OCEAN but TC_LAND required', () => {
    mockStore.terrains[2] = { id: 2, name: 'Ocean', tclass: TC_OCEAN };
    const tile = { terrain: 2 } as any;
    expect(isReqActive(null, null, null, tile, null, null, null,
      makeReq(VUT_TERRAINCLASS, TC_LAND), RPT_CERTAIN)).toBe(false);
  });

  it('VTC-3: TRI_YES when terrain class is TC_OCEAN and that is required', () => {
    mockStore.terrains[2] = { id: 2, name: 'Ocean', tclass: TC_OCEAN };
    const tile = { terrain: 2 } as any;
    expect(isReqActive(null, null, null, tile, null, null, null,
      makeReq(VUT_TERRAINCLASS, TC_OCEAN), RPT_CERTAIN)).toBe(true);
  });

  it('VTC-4: TRI_MAYBE when terrain has no tclass field', () => {
    mockStore.terrains[3] = { id: 3, name: 'Desert' }; // no tclass
    const tile = { terrain: 3 } as any;
    expect(isReqActive(null, null, null, tile, null, null, null,
      makeReq(VUT_TERRAINCLASS, TC_LAND), RPT_POSSIBLE)).toBe(true);
  });

  it('VTC-5: TRI_MAYBE when targetTile is null', () => {
    expect(isReqActive(null, null, null, null, null, null, null,
      makeReq(VUT_TERRAINCLASS, TC_LAND), RPT_CERTAIN)).toBe(false);
  });
});
