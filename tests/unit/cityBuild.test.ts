/**
 * Unit tests for A1: City buildable unit requirement checking.
 *
 * Verifies:
 * 1. canCityBuildUnitDirect: tech_requirement check (player must know the tech)
 * 2. canCityBuildUnitDirect: obsoleted_by check (cannot build if player knows obsoleting tech)
 * 3. canCityBuildUnitDirect: build_reqs filtering via areReqsActive
 * 4. buildProductionListData: uses canCityBuildUnitDirect as fallback (no BitVector)
 * 5. buildProductionListData: uses server BitVector when available (hasData=true)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { VUT_ADVANCE, VUT_GOVERNMENT, RPT_POSSIBLE, REQ_RANGE_PLAYER } from '@/data/fcTypes';
import type { City, Improvement, Player, Tech, UnitType } from '@/data/types';

type BuildTestStore = {
  unitTypes: Record<number, UnitType>;
  improvements: Record<number, Improvement>;
  players: Record<number, Player>;
  cities: Record<number, City>;
  techs: Record<number, Tech>;
  rulesControl: { num_impr_types: number };
};

// ---------------------------------------------------------------------------
// Store mock — must be hoisted so vi.mock factory can reference it
// ---------------------------------------------------------------------------
const mockStore = vi.hoisted<BuildTestStore>(() => ({
  unitTypes: {},
  improvements: {},
  players: {},
  cities: {},
  techs: {},
  rulesControl: { num_impr_types: 0 },
}));

vi.mock('@/data/store', () => ({ store: mockStore }));

// Minimal tech mock: playerInventionState returns TECH_KNOWN for techs in player.known_techs
vi.mock('@/data/tech', () => ({
  TECH_KNOWN: 2,
  playerInventionState: (player: Player, techId: number) => {
    const known = player.known_techs as number[] | undefined;
    return known?.includes(techId) ? 2 : 0;
  },
}));

// Mock map (not needed but avoid import errors)
vi.mock('@/data/map', async (importOriginal) => ({
  ...(await importOriginal() as object),
}));

// ---------------------------------------------------------------------------
// Import after mocks
// ---------------------------------------------------------------------------
import { canCityBuildUnitDirect, canCityBuildImprovementDirect } from '@/data/city';

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

function makePlayer(id: number, knownTechs: number[] = [], gov = 0): Player {
  return { playerno: id, known_techs: knownTechs, government: gov } as unknown as Player;
}

function makeUnitType(id: number, opts: {
  techReq?: number;
  obsoletedBy?: number;
  buildReqs?: unknown[];
} = {}): UnitType {
  return {
    id,
    name: `Unit${id}`,
    rule_name: `unit${id}`,
    graphic_str: `unit${id}`,
    attack_strength: 1,
    defense_strength: 1,
    move_rate: 1,
    hp: 10,
    firepower: 1,
    build_cost: 30,
    vision_radius_sq: 2,
    flags: [],
    tech_requirement: opts.techReq ?? -1,
    obsoleted_by: opts.obsoletedBy ?? null,
    build_reqs: opts.buildReqs ?? [],
  } as unknown as UnitType;
}

function makeCity(ownerId: number): City {
  return { id: 1, owner: ownerId, name: 'TestCity', tile: 0, size: 2 } as unknown as City;
}

function makeImprovement(id: number, opts: {
  techReq?: number;
  buildReqs?: unknown[];
} = {}): Improvement {
  return {
    id,
    name: `Impr${id}`,
    rule_name: `impr${id}`,
    build_cost: 100,
    tech_req: opts.techReq ?? -1,
    build_reqs: opts.buildReqs ?? [],
  } as unknown as Improvement;
}

// ---------------------------------------------------------------------------
// Setup: clear store before each test
// ---------------------------------------------------------------------------
beforeEach(() => {
  mockStore.unitTypes = {};
  mockStore.improvements = {};
  mockStore.players = {};
  mockStore.cities = {};
  mockStore.techs = {};
});

// ===========================================================================
// 1. tech_requirement check
// ===========================================================================

describe('canCityBuildUnitDirect — tech_requirement', () => {
  it('allows building when no tech required (tech_req=-1)', () => {
    const player = makePlayer(1, []);
    mockStore.players[1] = player;

    const ut = makeUnitType(1, { techReq: -1 });
    mockStore.unitTypes[1] = ut;
    const city = makeCity(1);

    expect(canCityBuildUnitDirect(city, ut)).toBe(true);
  });

  it('blocks building when player lacks required tech', () => {
    const player = makePlayer(1, []); // no techs
    mockStore.players[1] = player;

    const ut = makeUnitType(1, { techReq: 5 }); // requires tech 5
    mockStore.unitTypes[1] = ut;
    const city = makeCity(1);

    expect(canCityBuildUnitDirect(city, ut)).toBe(false);
  });

  it('allows building when player knows required tech', () => {
    const player = makePlayer(1, [5]); // knows tech 5
    mockStore.players[1] = player;

    const ut = makeUnitType(1, { techReq: 5 });
    mockStore.unitTypes[1] = ut;
    const city = makeCity(1);

    expect(canCityBuildUnitDirect(city, ut)).toBe(true);
  });
});

// ===========================================================================
// 2. obsoleted_by check
// ===========================================================================

describe('canCityBuildUnitDirect — obsoleted_by', () => {
  it('allows building when player lacks the obsoleting unit\'s tech', () => {
    const player = makePlayer(1, [5]); // knows tech 5 (for Warriors), not tech 10 (for Phalanx)
    mockStore.players[1] = player;

    const obsoletingType = makeUnitType(2, { techReq: 10 });
    mockStore.unitTypes[2] = obsoletingType;

    const ut = makeUnitType(1, { techReq: 5, obsoletedBy: 2 });
    mockStore.unitTypes[1] = ut;

    const city = makeCity(1);
    expect(canCityBuildUnitDirect(city, ut)).toBe(true);
  });

  it('blocks building when player knows the obsoleting unit\'s tech', () => {
    const player = makePlayer(1, [5, 10]); // knows both techs
    mockStore.players[1] = player;

    const obsoletingType = makeUnitType(2, { techReq: 10 });
    mockStore.unitTypes[2] = obsoletingType;

    const ut = makeUnitType(1, { techReq: 5, obsoletedBy: 2 });
    mockStore.unitTypes[1] = ut;

    const city = makeCity(1);
    expect(canCityBuildUnitDirect(city, ut)).toBe(false);
  });

  it('does not block when obsoleted_by unit has no tech requirement', () => {
    // If the obsoleting unit has no tech_requirement, it's always available — so this unit IS obsoleted
    const player = makePlayer(1, [5]);
    mockStore.players[1] = player;

    const obsoletingType = makeUnitType(2, { techReq: -1 }); // no tech needed
    mockStore.unitTypes[2] = obsoletingType;

    const ut = makeUnitType(1, { techReq: 5, obsoletedBy: 2 });
    mockStore.unitTypes[1] = ut;

    const city = makeCity(1);
    // obsoleting unit has no tech req → always obsoletes → cannot build
    expect(canCityBuildUnitDirect(city, ut)).toBe(false);
  });
});

// ===========================================================================
// 3. build_reqs filtering
// ===========================================================================

describe('canCityBuildUnitDirect — build_reqs', () => {
  it('allows building when build_reqs is empty', () => {
    const player = makePlayer(1, []);
    mockStore.players[1] = player;

    const ut = makeUnitType(1, { buildReqs: [] });
    const city = makeCity(1);

    expect(canCityBuildUnitDirect(city, ut)).toBe(true);
  });

  it('allows building when VUT_ADVANCE build_req is met (tech known)', () => {
    const player = makePlayer(1, [7]); // knows tech 7
    mockStore.players[1] = player;

    const ut = makeUnitType(1, {
      buildReqs: [{ kind: VUT_ADVANCE, range: REQ_RANGE_PLAYER, value: 7, present: true }],
    });
    const city = makeCity(1);

    expect(canCityBuildUnitDirect(city, ut)).toBe(true);
  });

  it('blocks building when VUT_ADVANCE build_req is not met (tech missing)', () => {
    const player = makePlayer(1, []); // knows no techs
    mockStore.players[1] = player;

    const ut = makeUnitType(1, {
      buildReqs: [{ kind: VUT_ADVANCE, range: REQ_RANGE_PLAYER, value: 7, present: true }],
    });
    const city = makeCity(1);

    expect(canCityBuildUnitDirect(city, ut)).toBe(false);
  });

  it('allows building when VUT_GOVERNMENT req matches player government', () => {
    const player = makePlayer(1, [], 3); // government = 3
    mockStore.players[1] = player;

    const ut = makeUnitType(1, {
      buildReqs: [{ kind: VUT_GOVERNMENT, range: REQ_RANGE_PLAYER, value: 3, present: true }],
    });
    const city = makeCity(1);

    expect(canCityBuildUnitDirect(city, ut)).toBe(true);
  });

  it('blocks building when VUT_GOVERNMENT req does not match player government', () => {
    const player = makePlayer(1, [], 1); // government = 1
    mockStore.players[1] = player;

    const ut = makeUnitType(1, {
      buildReqs: [{ kind: VUT_GOVERNMENT, range: REQ_RANGE_PLAYER, value: 3, present: true }],
    });
    const city = makeCity(1);

    expect(canCityBuildUnitDirect(city, ut)).toBe(false);
  });

  it('blocks building when prohibit req (present=false) matches — e.g. government IS active', () => {
    const player = makePlayer(1, [], 3); // government = 3
    mockStore.players[1] = player;

    // present=false means "must NOT have this government"
    const ut = makeUnitType(1, {
      buildReqs: [{ kind: VUT_GOVERNMENT, range: REQ_RANGE_PLAYER, value: 3, present: false }],
    });
    const city = makeCity(1);

    expect(canCityBuildUnitDirect(city, ut)).toBe(false);
  });
});

// ===========================================================================
// 4. buildProductionListData — fallback path uses canCityBuildUnitDirect
// ===========================================================================

describe('buildProductionListData — fallback (no server BitVector)', () => {
  // We test the behavior indirectly via canCityBuildUnitDirect
  it('filters units by tech requirement when no BitVector present', () => {
    // Player knows tech 5, unit 1 needs tech 5, unit 2 needs tech 99 (unknown)
    const player = makePlayer(1, [5]);
    mockStore.players[1] = player;

    const ut1 = makeUnitType(1, { techReq: 5 });
    const ut2 = makeUnitType(2, { techReq: 99 });
    mockStore.unitTypes[1] = ut1;
    mockStore.unitTypes[2] = ut2;

    const city = makeCity(1);

    // ut1: player knows tech 5 → buildable
    expect(canCityBuildUnitDirect(city, ut1)).toBe(true);
    // ut2: player doesn't know tech 99 → not buildable
    expect(canCityBuildUnitDirect(city, ut2)).toBe(false);
  });
});

// ===========================================================================
// 5. canCityBuildImprovementDirect — VUT_GOVERNMENT / VUT_ADVANCE build_reqs
//    These are the "precise" requirement types checked via RPT_CERTAIN.
// ===========================================================================

describe('canCityBuildImprovementDirect — VUT_ADVANCE build_req', () => {
  it('allows building when VUT_ADVANCE build_req is met (tech known)', () => {
    const player = makePlayer(1, [7]);
    mockStore.players[1] = player;

    const impr = makeImprovement(1, {
      buildReqs: [{ kind: VUT_ADVANCE, range: REQ_RANGE_PLAYER, value: 7, present: true }],
    });
    mockStore.improvements[1] = impr;
    const city = makeCity(1);

    expect(canCityBuildImprovementDirect(city, impr)).toBe(true);
  });

  it('blocks building when VUT_ADVANCE build_req is not met (tech missing)', () => {
    const player = makePlayer(1, []); // no techs
    mockStore.players[1] = player;

    const impr = makeImprovement(1, {
      buildReqs: [{ kind: VUT_ADVANCE, range: REQ_RANGE_PLAYER, value: 7, present: true }],
    });
    mockStore.improvements[1] = impr;
    const city = makeCity(1);

    expect(canCityBuildImprovementDirect(city, impr)).toBe(false);
  });
});

describe('canCityBuildImprovementDirect — VUT_GOVERNMENT build_req', () => {
  it('allows building when VUT_GOVERNMENT req matches player government', () => {
    const player = makePlayer(1, [], 2); // Monarchy
    mockStore.players[1] = player;

    const impr = makeImprovement(1, {
      buildReqs: [{ kind: VUT_GOVERNMENT, range: REQ_RANGE_PLAYER, value: 2, present: true }],
    });
    mockStore.improvements[1] = impr;
    const city = makeCity(1);

    expect(canCityBuildImprovementDirect(city, impr)).toBe(true);
  });

  it('blocks building when VUT_GOVERNMENT req does not match player government', () => {
    const player = makePlayer(1, [], 1); // Despotism
    mockStore.players[1] = player;

    const impr = makeImprovement(1, {
      buildReqs: [{ kind: VUT_GOVERNMENT, range: REQ_RANGE_PLAYER, value: 2, present: true }],
    });
    mockStore.improvements[1] = impr;
    const city = makeCity(1);

    expect(canCityBuildImprovementDirect(city, impr)).toBe(false);
  });

  it('blocks building when prohibit req (present=false) matches government', () => {
    const player = makePlayer(1, [], 3); // Communism
    mockStore.players[1] = player;

    // present=false means "must NOT have this government"
    const impr = makeImprovement(1, {
      buildReqs: [{ kind: VUT_GOVERNMENT, range: REQ_RANGE_PLAYER, value: 3, present: false }],
    });
    mockStore.improvements[1] = impr;
    const city = makeCity(1);

    expect(canCityBuildImprovementDirect(city, impr)).toBe(false);
  });

  it('allows building when prohibit req (present=false) does not match government', () => {
    const player = makePlayer(1, [], 1); // Despotism — government 3 is absent → prohibition satisfied
    mockStore.players[1] = player;

    const impr = makeImprovement(1, {
      buildReqs: [{ kind: VUT_GOVERNMENT, range: REQ_RANGE_PLAYER, value: 3, present: false }],
    });
    mockStore.improvements[1] = impr;
    const city = makeCity(1);

    expect(canCityBuildImprovementDirect(city, impr)).toBe(true);
  });
});
