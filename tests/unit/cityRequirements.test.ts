/**
 * Unit tests for city requirements / build-capability fixes:
 *
 * A1-Fix-1: canCityBuildImprovementDirect — new fallback filter so observer mode
 *            shows only buildable improvements (was showing ALL of them).
 * A1-Fix-2: cityCanBuy — no longer crashes when production_kind === VUT_UTYPE.
 * A1-Fix-3: doesCityHaveImprovement — redundant inner null-check removed (logic unchanged).
 * A1-Fix-4: buildProductionListData improvements path — symmetric with units path.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { VUT_UTYPE, VUT_IMPROVEMENT } from '@/data/fcTypes';

// ---------------------------------------------------------------------------
// Minimal BitVector mock
// ---------------------------------------------------------------------------
class MockBitVector {
  private bits: Set<number>;
  constructor(setBits: number[] = []) { this.bits = new Set(setBits); }
  isSet(n: number): boolean { return this.bits.has(n); }
}

// ---------------------------------------------------------------------------
// Module mocks — vi.mock factories cannot reference outer let/const, so we
// store mutable state in plain objects that ARE accessible inside the factory.
// ---------------------------------------------------------------------------

// Shared state object that the store mock delegates to
const storeState = {
  players: {} as Record<number, unknown>,
  cities: {} as Record<number, unknown>,
  improvements: {} as Record<number, unknown>,
  unitTypes: {} as Record<number, unknown>,
  specialists: {} as Record<number, unknown>,
  rulesControl: { num_impr_types: 3 } as Record<string, unknown>,
  gameInfo: null as Record<string, unknown> | null,
  tileset: {} as Record<string, unknown>,
};

vi.mock('@/data/store', () => ({
  store: new Proxy({}, {
    get(_target, prop: string) { return (storeState as Record<string, unknown>)[prop]; },
    set(_target, prop: string, value: unknown) { (storeState as Record<string, unknown>)[prop] = value; return true; },
  }),
}));

// Controllable spy for playerInventionState
const _techState = { returnVal: 0 };
vi.mock('@/data/tech', () => ({
  playerInventionState: (_player: unknown, _tech: number) => _techState.returnVal,
  TECH_KNOWN: 2,
}));

// Controllable spy for areReqsActive
const _reqsState = { returnVal: true };
vi.mock('@/data/requirements', () => ({
  areReqsActive: () => _reqsState.returnVal,
  universalBuildShieldCost: (_city: unknown, target: { build_cost: number }) => target.build_cost,
}));

vi.mock('@/data/unittype', () => ({
  can_player_build_unit_direct: () => true,
}));
vi.mock('@/data/map', () => ({ indexToTile: vi.fn() }));
vi.mock('@/renderer/tilespec', () => ({
  get_unit_type_image_sprite: () => null,
  get_improvement_image_sprite: () => null,
}));
vi.mock('@/client/clientState', () => ({ clientPlaying: () => null }));
vi.mock('@/core/events', () => ({ globalEvents: { emit: vi.fn(), once: vi.fn() } }));

// ---------------------------------------------------------------------------
// Import after mocks
// ---------------------------------------------------------------------------
import {
  canCityBuildImprovementDirect,
  cityCanBuy,
  doesCityHaveImprovement,
} from '@/data/city';
import { buildProductionListData } from '@/ui/cityLogic';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeImprovement(id: number, name: string, extra: Record<string, unknown> = {}): Record<string, unknown> {
  return { id, name, build_cost: 100, genus: 0, rule_name: name.toLowerCase(), graphic_str: name, graphic_alt: name, ...extra };
}

function makeCity(extra: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    id: 1,
    owner: 0,
    tile: 0,
    improvements: new MockBitVector([]), // no buildings by default
    production_kind: VUT_IMPROVEMENT,
    production_value: 0,
    did_buy: false,
    turn_founded: 1,
    shield_stock: 0,
    surplus: { 5: 5 }, // O_SHIELD=5
    ...extra,
  };
}

function makePlayer(knownTechs: number[] = []): Record<string, unknown> {
  return { playerno: 0, techs: knownTechs };
}

beforeEach(() => {
  storeState.improvements = {};
  storeState.unitTypes = {};
  storeState.players = { 0: makePlayer() };
  storeState.gameInfo = null;
  storeState.rulesControl = { num_impr_types: 3 };
  _techState.returnVal = 0; // TECH_UNKNOWN by default
  _reqsState.returnVal = true;
});

// ---------------------------------------------------------------------------
// A1-Fix-1: canCityBuildImprovementDirect
// ---------------------------------------------------------------------------

describe('canCityBuildImprovementDirect', () => {
  it('returns false when improvement is already built', () => {
    const impr = makeImprovement(0, 'Barracks');
    storeState.improvements[0] = impr;
    const city = makeCity({ improvements: new MockBitVector([0]) }); // Barracks already built
    expect(canCityBuildImprovementDirect(city as any, impr as any)).toBe(false);
  });

  it('returns true when improvement is not yet built and no tech/reqs', () => {
    const impr = makeImprovement(1, 'Library');
    storeState.improvements[1] = impr;
    const city = makeCity(); // nothing built
    expect(canCityBuildImprovementDirect(city as any, impr as any)).toBe(true);
  });

  it('returns false when tech_req is not known by player', () => {
    const impr = makeImprovement(1, 'Library', { tech_req: 5 });
    storeState.improvements[1] = impr;
    _techState.returnVal = 0; // TECH_UNKNOWN
    const city = makeCity();
    expect(canCityBuildImprovementDirect(city as any, impr as any)).toBe(false);
  });

  it('returns true when tech_req IS known by player', () => {
    const impr = makeImprovement(1, 'Library', { tech_req: 5 });
    storeState.improvements[1] = impr;
    _techState.returnVal = 2; // TECH_KNOWN
    const city = makeCity();
    expect(canCityBuildImprovementDirect(city as any, impr as any)).toBe(true);
  });

  it('returns true when tech_req is -1 (no tech required)', () => {
    const impr = makeImprovement(0, 'Barracks', { tech_req: -1 });
    storeState.improvements[0] = impr;
    const city = makeCity();
    expect(canCityBuildImprovementDirect(city as any, impr as any)).toBe(true);
  });

  it('returns false when build_reqs fail', () => {
    const impr = makeImprovement(1, 'Library', { build_reqs: [{ type: 'VUT_IMPROVEMENT', value: 99, range: 'City' }] });
    storeState.improvements[1] = impr;
    _reqsState.returnVal = false;
    const city = makeCity();
    expect(canCityBuildImprovementDirect(city as any, impr as any)).toBe(false);
  });

  it('returns true when build_reqs pass', () => {
    const impr = makeImprovement(1, 'University', { build_reqs: [{ type: 'VUT_IMPROVEMENT', value: 0 }] });
    storeState.improvements[1] = impr;
    _reqsState.returnVal = true;
    const city = makeCity();
    expect(canCityBuildImprovementDirect(city as any, impr as any)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// A1-Fix-2: cityCanBuy null-safety
// ---------------------------------------------------------------------------

describe('cityCanBuy', () => {
  it('returns false when producing a unit (VUT_UTYPE) — no crash', () => {
    const city = makeCity({ production_kind: VUT_UTYPE, production_value: 5 });
    expect(() => cityCanBuy(city as any)).not.toThrow();
    expect(cityCanBuy(city as any)).toBe(false);
  });

  it('returns false when production_kind is VUT_IMPROVEMENT but improvement missing', () => {
    const city = makeCity({ production_kind: VUT_IMPROVEMENT, production_value: 99 });
    // store.improvements[99] is undefined
    expect(() => cityCanBuy(city as any)).not.toThrow();
    expect(cityCanBuy(city as any)).toBe(false);
  });

  it('returns false for Coinage improvement', () => {
    const impr = makeImprovement(0, 'Coinage');
    storeState.improvements[0] = impr;
    const city = makeCity({ production_kind: VUT_IMPROVEMENT, production_value: 0 });
    expect(cityCanBuy(city as any)).toBe(false);
  });

  it('returns true for a normal improvement when conditions met', () => {
    const impr = makeImprovement(1, 'Barracks');
    storeState.improvements[1] = impr;
    storeState.gameInfo = { turn: 5 };
    const city = makeCity({
      production_kind: VUT_IMPROVEMENT,
      production_value: 1,
      did_buy: false,
      turn_founded: 3, // ≠ current turn 5
    });
    expect(cityCanBuy(city as any)).toBe(true);
  });

  it('returns false when city already bought this turn (did_buy=true)', () => {
    const impr = makeImprovement(1, 'Barracks');
    storeState.improvements[1] = impr;
    storeState.gameInfo = { turn: 5 };
    const city = makeCity({
      production_kind: VUT_IMPROVEMENT,
      production_value: 1,
      did_buy: true,
      turn_founded: 3,
    });
    expect(cityCanBuy(city as any)).toBe(false);
  });

  it('returns false when city was founded this turn', () => {
    const impr = makeImprovement(1, 'Barracks');
    storeState.improvements[1] = impr;
    storeState.gameInfo = { turn: 5 };
    const city = makeCity({
      production_kind: VUT_IMPROVEMENT,
      production_value: 1,
      did_buy: false,
      turn_founded: 5, // same as current turn
    });
    expect(cityCanBuy(city as any)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// A1-Fix-3: doesCityHaveImprovement (redundant null-check removed — logic unchanged)
// ---------------------------------------------------------------------------

describe('doesCityHaveImprovement', () => {
  it('returns false for null city', () => {
    expect(doesCityHaveImprovement(null, 'Barracks')).toBe(false);
  });

  it('returns false when improvements BitVector is null', () => {
    const city = makeCity({ improvements: null });
    expect(doesCityHaveImprovement(city as any, 'Barracks')).toBe(false);
  });

  it('returns true when the named improvement is built', () => {
    storeState.improvements[0] = makeImprovement(0, 'Barracks');
    storeState.improvements[1] = makeImprovement(1, 'Library');
    storeState.improvements[2] = makeImprovement(2, 'University');
    const city = makeCity({ improvements: new MockBitVector([0, 2]) }); // Barracks + University
    expect(doesCityHaveImprovement(city as any, 'Barracks')).toBe(true);
    expect(doesCityHaveImprovement(city as any, 'University')).toBe(true);
  });

  it('returns false when the named improvement is not built', () => {
    storeState.improvements[0] = makeImprovement(0, 'Barracks');
    storeState.improvements[1] = makeImprovement(1, 'Library');
    storeState.improvements[2] = makeImprovement(2, 'University');
    const city = makeCity({ improvements: new MockBitVector([0]) }); // only Barracks
    expect(doesCityHaveImprovement(city as any, 'Library')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// A1-Fix-4: buildProductionListData — improvements path symmetric fix
// ---------------------------------------------------------------------------

describe('buildProductionListData — improvements fallback', () => {
  it('shows NO improvements when hasData=false and all fail direct check', () => {
    storeState.improvements = {
      0: makeImprovement(0, 'Barracks', { tech_req: 5 }),  // tech not known
    };
    _techState.returnVal = 0; // TECH_UNKNOWN
    // City has no can_build_unit → hasData=false
    const city = makeCity();
    delete (city as any)['can_build_unit'];

    const result = buildProductionListData(city as any);
    expect(result.hasData).toBe(false);
    expect(result.improvements).toHaveLength(0);
  });

  it('shows improvement when hasData=false and direct check passes', () => {
    storeState.improvements = {
      0: makeImprovement(0, 'Barracks'), // no tech_req, no build_reqs
    };
    const city = makeCity();
    delete (city as any)['can_build_unit'];

    const result = buildProductionListData(city as any);
    expect(result.hasData).toBe(false);
    expect(result.improvements).toHaveLength(1);
    expect(result.improvements[0].impr.name).toBe('Barracks');
  });

  it('skips already-built improvements in hasData=false mode', () => {
    storeState.improvements = {
      0: makeImprovement(0, 'Barracks'),
    };
    // Barracks already built
    const city = makeCity({ improvements: new MockBitVector([0]) });
    delete (city as any)['can_build_unit'];

    const result = buildProductionListData(city as any);
    expect(result.improvements).toHaveLength(0);
  });

  it('uses canCityBuildImprovementNow when hasData=true', () => {
    storeState.improvements = {
      0: makeImprovement(0, 'Barracks'),
    };
    // City has can_build_improvement BitVector with bit 0 set
    const city = makeCity({
      can_build_unit: new MockBitVector([]),
      can_build_improvement: new MockBitVector([0]),
    });

    const result = buildProductionListData(city as any);
    expect(result.hasData).toBe(true);
    expect(result.improvements).toHaveLength(1);
  });

  it('excludes improvement when hasData=true but bit not set', () => {
    storeState.improvements = {
      0: makeImprovement(0, 'Barracks'),
    };
    const city = makeCity({
      can_build_unit: new MockBitVector([]),
      can_build_improvement: new MockBitVector([]), // bit 0 NOT set
    });

    const result = buildProductionListData(city as any);
    expect(result.hasData).toBe(true);
    expect(result.improvements).toHaveLength(0);
  });
});
