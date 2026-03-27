/**
 * Unit tests for data/city.ts
 *
 * Tests all pure-data query functions migrated from legacy city.js.
 * Functions that depend on complex legacy globals (e.g. renderer, DOM)
 * are tested with minimal stubs.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  CITYO_DISBAND,
  CITYO_NEW_EINSTEIN,
  CITYO_NEW_TAXMAN,
  CITYO_LAST,
  FEELING_BASE,
  FEELING_LUXURY,
  FEELING_EFFECT,
  FEELING_NATIONALITY,
  FEELING_MARTIAL,
  FEELING_FINAL,
  MAX_LEN_WORKLIST,
  INCITE_IMPOSSIBLE_COST,
  cityOwnerPlayerId,
  cityOwner,
  cityTile,
  isCityCenter,
  isFreeWorked,
  isPrimaryCapital,
  getCityProductionType,
  cityTurnsToBuild,
  getProductionProgress,
  canCityBuildUnitNow,
  canCityBuildImprovementNow,
  canCityBuildNow,
  cityHasBuilding,
  doesCityHaveImprovement,
  cityCanBuy,
  cityTurnsToGrowthText,
  cityUnhappy,
  cityPopulation,
  dxyToCenterIndex,
  deltaTileHelper,
} from '@/data/city';
import {
  VUT_UTYPE,
  VUT_IMPROVEMENT,
  CAPITAL_PRIMARY,
  FC_INFINITY,
} from '@/data/fcTypes';
import type { GameInfo, Improvement, Player, Tile, UnitType } from '@/data/types';
import { universalBuildShieldCost } from '@/data/requirements';
import { store } from '@/data/store';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeCity(overrides: Record<string, any> = {}): any {
  return {
    id: 1,
    owner: 0,
    tile: 10,
    name: 'Rome',
    size: 5,
    food_stock: 20,
    shield_stock: 10,
    production_kind: VUT_UTYPE,
    production_value: 1,
    surplus: [0, 5, 0, 0, 0, 0], // index 1 = O_SHIELD
    waste: [],
    unhappy_penalty: [],
    prod: [],
    citizen_extra: [],
    ppl_happy: [0, 0, 0, 0, 0, 3],
    ppl_content: [0, 0, 0, 0, 0, 2],
    ppl_unhappy: [0, 0, 0, 0, 0, 0],
    ppl_angry: [0, 0, 0, 0, 0, 0],
    improvements: null,
    capital: 0,
    granary_turns: 5,
    did_buy: false,
    turn_founded: 0,
    style: 0,
    ...overrides,
  };
}

function makeBitVector(setBits: number[]): any {
  return {
    isSet(bit: number): boolean {
      return setBits.includes(bit);
    },
  };
}

function makeStorePlayer(playerno: number, name: string): Player {
  return {
    playerno,
    name,
    username: name.toLowerCase(),
    nation: 0,
    is_alive: true,
    is_ready: false,
    ai_skill_level: 0,
    gold: 0,
    tax: 0,
    luxury: 0,
    science: 0,
    expected_income: 0,
    team: 0,
    embassy_txt: '',
  };
}

function makeUnitType(id: number, name: string, extra: Partial<UnitType> = {}): UnitType {
  return {
    id,
    name,
    rule_name: name.toLowerCase(),
    graphic_str: '',
    attack_strength: 0,
    defense_strength: 0,
    move_rate: 0,
    hp: 1,
    firepower: 1,
    build_cost: 10,
    vision_radius_sq: 0,
    flags: [],
    ...extra,
  };
}

function makeImprovement(id: number, name: string, extra: Partial<Improvement> = {}): Improvement {
  return {
    id,
    name,
    rule_name: name.toLowerCase(),
    genus: 0,
    build_cost: 10,
    graphic_str: '',
    graphic_alt: '',
    ...extra,
  };
}

function makeGameInfo(turn: number): GameInfo {
  return {
    turn,
    year: 0,
    timeout: 0,
    first_timeout: 0,
    phase: 0,
    phase_mode: 0,
  };
}

function makeTileFixture(index: number, x: number, y: number): Tile {
  return {
    index,
    x,
    y,
    terrain: 0,
    known: 0,
    extras: [],
    owner: 0,
    worked: 0,
    resource: 0,
    continent: 0,
  };
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

describe('City constants', () => {
  it('should export CITYO_* constants with correct values', () => {
    expect(CITYO_DISBAND).toBe(0);
    expect(CITYO_NEW_EINSTEIN).toBe(1);
    expect(CITYO_NEW_TAXMAN).toBe(2);
    expect(CITYO_LAST).toBe(3);
  });

  it('should export FEELING_* constants with correct values', () => {
    expect(FEELING_BASE).toBe(0);
    expect(FEELING_LUXURY).toBe(1);
    expect(FEELING_EFFECT).toBe(2);
    expect(FEELING_NATIONALITY).toBe(3);
    expect(FEELING_MARTIAL).toBe(4);
    expect(FEELING_FINAL).toBe(5);
  });

  it('should export MAX_LEN_WORKLIST and INCITE_IMPOSSIBLE_COST', () => {
    expect(MAX_LEN_WORKLIST).toBe(64);
    expect(INCITE_IMPOSSIBLE_COST).toBe(1000 * 1000 * 1000);
  });
});

// ---------------------------------------------------------------------------
// Basic city queries
// ---------------------------------------------------------------------------

describe('cityOwnerPlayerId', () => {
  it('should return the owner id of a city', () => {
    const city = makeCity({ owner: 3 });
    expect(cityOwnerPlayerId(city)).toBe(3);
  });

  it('should return null for null city', () => {
    expect(cityOwnerPlayerId(null)).toBeNull();
  });

  it('should return null for undefined city', () => {
    expect(cityOwnerPlayerId(undefined)).toBeNull();
  });
});

describe('cityOwner', () => {
  beforeEach(() => {
    store.players = {
      0: makeStorePlayer(0, 'Player0'),
      1: makeStorePlayer(1, 'Player1'),
    };
  });

  afterEach(() => {
    store.players = {};
  });

  it('should return the player object that owns the city', () => {
    const city = makeCity({ owner: 1 });
    expect(cityOwner(city).name).toBe('Player1');
  });
});

describe('cityTile', () => {
  beforeEach(() => {
    store.tiles = {
      25: makeTileFixture(25, 5, 2),
    };
  });

  afterEach(() => {
    store.tiles = {};
  });

  it('should return the tile for a city', () => {
    const city = makeCity({ tile: 25 });
    const tile = cityTile(city)!;
    expect(tile.index).toBe(25);
    expect(tile.x).toBe(5);
    expect(tile.y).toBe(2);
  });

  it('should return null for null city', () => {
    expect(cityTile(null)).toBeNull();
  });
});

describe('isCityCenter', () => {
  it('should return true when tile index matches city tile', () => {
    const city = makeCity({ tile: 50 });
    expect(isCityCenter(city, { index: 50 } as Tile)).toBe(true);
  });

  it('should return false when tile index does not match', () => {
    const city = makeCity({ tile: 50 });
    expect(isCityCenter(city, { index: 51 } as Tile)).toBe(false);
  });
});

describe('isFreeWorked', () => {
  it('should return true for city center tile', () => {
    const city = makeCity({ tile: 50 });
    expect(isFreeWorked(city, { index: 50 } as Tile)).toBe(true);
  });

  it('should return false for non-center tile', () => {
    const city = makeCity({ tile: 50 });
    expect(isFreeWorked(city, { index: 49 } as Tile)).toBe(false);
  });
});

describe('isPrimaryCapital', () => {
  it('should return true when capital equals CAPITAL_PRIMARY (2)', () => {
    const city = makeCity({ capital: CAPITAL_PRIMARY });
    expect(isPrimaryCapital(city)).toBe(true);
  });

  it('should return false when capital is 0', () => {
    const city = makeCity({ capital: 0 });
    expect(isPrimaryCapital(city)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Production queries
// ---------------------------------------------------------------------------

describe('getCityProductionType', () => {
  beforeEach(() => {
    store.unitTypes = {
      1: makeUnitType(1, 'Warriors'),
      2: makeUnitType(2, 'Phalanx'),
    };
    store.improvements = {
      10: makeImprovement(10, 'Granary'),
      11: makeImprovement(11, 'Library'),
    };
  });

  afterEach(() => {
    store.unitTypes = {};
    store.improvements = {};
  });

  it('should return unit type when production_kind is VUT_UTYPE', () => {
    const city = makeCity({ production_kind: VUT_UTYPE, production_value: 1 });
    expect(getCityProductionType(city)!.name).toBe('Warriors');
  });

  it('should return improvement when production_kind is VUT_IMPROVEMENT', () => {
    const city = makeCity({ production_kind: VUT_IMPROVEMENT, production_value: 10 });
    expect(getCityProductionType(city)!.name).toBe('Granary');
  });

  it('should return null for null city', () => {
    expect(getCityProductionType(null)).toBeNull();
  });

  it('should return null for unknown production_kind', () => {
    const city = makeCity({ production_kind: 99, production_value: 1 });
    expect(getCityProductionType(city)).toBeNull();
  });
});

describe('cityTurnsToBuild', () => {
  // universalBuildShieldCost is imported directly and returns target.build_cost

  it('should return 1 when shield_stock >= cost', () => {
    const city = makeCity({ shield_stock: 50, surplus: [0, 5, 0, 0, 0, 0] });
    const target = { build_cost: 40 };
    expect(cityTurnsToBuild(city, target, true)).toBe(1);
  });

  it('should calculate turns when surplus is positive', () => {
    // cost=40, stock=10, surplus[O_SHIELD]=5 → (40-10-1)/5 + 1 = 29/5 + 1 = 5+1 = 6
    const city = makeCity({ shield_stock: 10, surplus: [0, 5, 0, 0, 0, 0] });
    const target = { build_cost: 40 };
    expect(cityTurnsToBuild(city, target, true)).toBe(6);
  });

  it('should return FC_INFINITY when surplus is zero', () => {
    const city = makeCity({ shield_stock: 10, surplus: [0, 0, 0, 0, 0, 0] });
    const target = { build_cost: 40 };
    expect(cityTurnsToBuild(city, target, true)).toBe(FC_INFINITY);
  });

  it('should return FC_INFINITY when surplus is negative', () => {
    const city = makeCity({ shield_stock: 10, surplus: [0, -3, 0, 0, 0, 0] });
    const target = { build_cost: 40 };
    expect(cityTurnsToBuild(city, target, true)).toBe(FC_INFINITY);
  });

  it('should ignore shield_stock when includeShieldStock is false', () => {
    // cost=40, stock=0 (ignored), surplus[O_SHIELD]=10 → (40-0-1)/10 + 1 = 39/10 + 1 = 3+1 = 4
    const city = makeCity({ shield_stock: 30, surplus: [0, 10, 0, 0, 0, 0] });
    const target = { build_cost: 40 };
    expect(cityTurnsToBuild(city, target, false)).toBe(4);
  });
});

describe('getProductionProgress', () => {
  beforeEach(() => {
    store.unitTypes = { 1: makeUnitType(1, 'Warriors', { build_cost: 30 }) };
    store.improvements = {
      10: makeImprovement(10, 'Granary', { build_cost: 60 }),
      11: makeImprovement(11, 'Coinage', { build_cost: 0 }),
    };
  });

  afterEach(() => {
    store.unitTypes = {};
    store.improvements = {};
  });

  it('should return "stock/cost" for unit production', () => {
    const city = makeCity({ production_kind: VUT_UTYPE, production_value: 1, shield_stock: 15 });
    expect(getProductionProgress(city)).toBe('15/30');
  });

  it('should return "stock/cost" for improvement production', () => {
    const city = makeCity({ production_kind: VUT_IMPROVEMENT, production_value: 10, shield_stock: 20 });
    expect(getProductionProgress(city)).toBe('20/60');
  });

  it('should return " " for Coinage', () => {
    const city = makeCity({ production_kind: VUT_IMPROVEMENT, production_value: 11, shield_stock: 0 });
    expect(getProductionProgress(city)).toBe(' ');
  });

  it('should return " " for null city', () => {
    expect(getProductionProgress(null)).toBe(' ');
  });
});

// ---------------------------------------------------------------------------
// Build capability queries
// ---------------------------------------------------------------------------

describe('canCityBuildUnitNow', () => {
  it('should return true when unit bit is set', () => {
    const city = makeCity({ can_build_unit: makeBitVector([1, 3, 5]) });
    expect(canCityBuildUnitNow(city, 3)).toBe(true);
  });

  it('should return false when unit bit is not set', () => {
    const city = makeCity({ can_build_unit: makeBitVector([1, 3, 5]) });
    expect(canCityBuildUnitNow(city, 2)).toBe(false);
  });

  it('should return false for null city', () => {
    expect(canCityBuildUnitNow(null, 1)).toBe(false);
  });

  it('should return false when can_build_unit is undefined', () => {
    const city = makeCity();
    expect(canCityBuildUnitNow(city, 1)).toBe(false);
  });
});

describe('canCityBuildImprovementNow', () => {
  it('should return true when improvement bit is set', () => {
    const city = makeCity({ can_build_improvement: makeBitVector([10, 20]) });
    expect(canCityBuildImprovementNow(city, 10)).toBe(true);
  });

  it('should return false when improvement bit is not set', () => {
    const city = makeCity({ can_build_improvement: makeBitVector([10, 20]) });
    expect(canCityBuildImprovementNow(city, 15)).toBe(false);
  });
});

describe('canCityBuildNow', () => {
  it('should delegate to canCityBuildUnitNow for VUT_UTYPE', () => {
    const city = makeCity({ can_build_unit: makeBitVector([1]) });
    expect(canCityBuildNow(city, VUT_UTYPE, 1)).toBe(true);
    expect(canCityBuildNow(city, VUT_UTYPE, 2)).toBe(false);
  });

  it('should delegate to canCityBuildImprovementNow for VUT_IMPROVEMENT', () => {
    const city = makeCity({ can_build_improvement: makeBitVector([10]) });
    expect(canCityBuildNow(city, VUT_IMPROVEMENT, 10)).toBe(true);
    expect(canCityBuildNow(city, VUT_IMPROVEMENT, 11)).toBe(false);
  });

  it('should return false for null kind or value', () => {
    const city = makeCity();
    expect(canCityBuildNow(city, null, 1)).toBe(false);
    expect(canCityBuildNow(city, 0, null)).toBe(false);
  });
});

describe('cityHasBuilding', () => {
  beforeEach(() => {
    store.rulesControl = { num_impr_types: 50 };
  });

  afterEach(() => {
    store.rulesControl = null;
  });

  it('should return true when improvement is present', () => {
    const city = makeCity({ improvements: makeBitVector([5, 10, 20]) });
    expect(cityHasBuilding(city, 10)).toBe(true);
  });

  it('should return false when improvement is not present', () => {
    const city = makeCity({ improvements: makeBitVector([5, 10, 20]) });
    expect(cityHasBuilding(city, 15)).toBe(false);
  });

  it('should return false for negative improvement id', () => {
    const city = makeCity({ improvements: makeBitVector([5]) });
    expect(cityHasBuilding(city, -1)).toBe(false);
  });

  it('should return false for improvement id >= num_impr_types', () => {
    const city = makeCity({ improvements: makeBitVector([5]) });
    expect(cityHasBuilding(city, 50)).toBe(false);
  });
});

describe('doesCityHaveImprovement', () => {
  beforeEach(() => {
    store.rulesControl = { num_impr_types: 3 };
    store.improvements = {
      0: makeImprovement(0, 'Palace'),
      1: makeImprovement(1, 'Granary'),
      2: makeImprovement(2, 'Library'),
    };
  });

  afterEach(() => {
    store.rulesControl = null;
    store.improvements = {};
  });

  it('should return true when city has the named improvement', () => {
    const city = makeCity({ improvements: makeBitVector([1]) });
    expect(doesCityHaveImprovement(city, 'Granary')).toBe(true);
  });

  it('should return false when city does not have the improvement', () => {
    const city = makeCity({ improvements: makeBitVector([1]) });
    expect(doesCityHaveImprovement(city, 'Library')).toBe(false);
  });

  it('should return false for null city', () => {
    expect(doesCityHaveImprovement(null, 'Granary')).toBe(false);
  });
});

describe('cityCanBuy', () => {
  beforeEach(() => {
    store.improvements = {
      10: makeImprovement(10, 'Granary'),
      11: makeImprovement(11, 'Coinage'),
    };
    store.gameInfo = makeGameInfo(5);
  });

  afterEach(() => {
    store.improvements = {};
    store.gameInfo = null;
  });

  it('should return true when city can buy', () => {
    const city = makeCity({ production_kind: VUT_IMPROVEMENT, did_buy: false, turn_founded: 1, production_value: 10 });
    expect(cityCanBuy(city)).toBe(true);
  });

  it('should return false when city already bought this turn', () => {
    const city = makeCity({ production_kind: VUT_IMPROVEMENT, did_buy: true, turn_founded: 1, production_value: 10 });
    expect(cityCanBuy(city)).toBe(false);
  });

  it('should return false when city was founded this turn', () => {
    const city = makeCity({ production_kind: VUT_IMPROVEMENT, did_buy: false, turn_founded: 5, production_value: 10 });
    expect(cityCanBuy(city)).toBe(false);
  });

  it('should return false when producing Coinage', () => {
    const city = makeCity({ production_kind: VUT_IMPROVEMENT, did_buy: false, turn_founded: 1, production_value: 11 });
    expect(cityCanBuy(city)).toBe(false);
  });

  it('should return false when producing a unit (VUT_UTYPE)', () => {
    const city = makeCity({ production_kind: VUT_UTYPE, did_buy: false, turn_founded: 1, production_value: 10 });
    expect(cityCanBuy(city)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// City growth and state
// ---------------------------------------------------------------------------

describe('cityTurnsToGrowthText', () => {
  it('should return "blocked" when granary_turns is 0', () => {
    expect(cityTurnsToGrowthText(makeCity({ granary_turns: 0 }))).toBe('blocked');
  });

  it('should return "never" when granary_turns > 1000000', () => {
    expect(cityTurnsToGrowthText(makeCity({ granary_turns: 1000001 }))).toBe('never');
  });

  it('should return starving text when granary_turns is negative', () => {
    expect(cityTurnsToGrowthText(makeCity({ granary_turns: -3 }))).toBe('Starving in 3 turns');
  });

  it('should return turns text for positive granary_turns', () => {
    expect(cityTurnsToGrowthText(makeCity({ granary_turns: 5 }))).toBe('5 turns');
  });
});

describe('cityUnhappy', () => {
  it('should return false when happy >= unhappy + 2*angry', () => {
    const city = makeCity({
      ppl_happy: [0, 0, 0, 0, 0, 5],
      ppl_unhappy: [0, 0, 0, 0, 0, 3],
      ppl_angry: [0, 0, 0, 0, 0, 1],
    });
    expect(cityUnhappy(city)).toBe(false);
  });

  it('should return true when happy < unhappy + 2*angry', () => {
    const city = makeCity({
      ppl_happy: [0, 0, 0, 0, 0, 2],
      ppl_unhappy: [0, 0, 0, 0, 0, 3],
      ppl_angry: [0, 0, 0, 0, 0, 1],
    });
    expect(cityUnhappy(city)).toBe(true);
  });
});

describe('cityPopulation', () => {
  it('should calculate population as size*(size+1)*5 (in thousands)', () => {
    expect(cityPopulation(makeCity({ size: 1 }))).toBe(10); // 1*2*5
    expect(cityPopulation(makeCity({ size: 5 }))).toBe(150); // 5*6*5
    expect(cityPopulation(makeCity({ size: 10 }))).toBe(550); // 10*11*5
  });
});

// ---------------------------------------------------------------------------
// Tile map functions
// ---------------------------------------------------------------------------

describe('dxyToCenterIndex', () => {
  it('should compute flat array index from dx, dy, r', () => {
    expect(dxyToCenterIndex(0, 0, 2)).toBe(12);
    expect(dxyToCenterIndex(-2, -2, 2)).toBe(0);
    expect(dxyToCenterIndex(2, 2, 2)).toBe(24);
    expect(dxyToCenterIndex(1, -1, 2)).toBe(16);
  });
});

describe('deltaTileHelper', () => {
  it('should return correct deltas when pos is near start', () => {
    const [dMin, dMax, i] = deltaTileHelper(1, 3, 10);
    expect(dMin).toBe(-1);
    expect(dMax).toBe(8);
    expect(i).toBe(2);
  });

  it('should return correct deltas when pos is near end', () => {
    const [dMin, dMax, i] = deltaTileHelper(8, 3, 10);
    expect(dMin).toBe(-8);
    expect(dMax).toBe(1);
    expect(i).toBe(5);
  });

  it('should return i=0 when pos is in the middle', () => {
    const [dMin, dMax, i] = deltaTileHelper(5, 3, 10);
    expect(dMin).toBe(-5);
    expect(dMax).toBe(4);
    expect(i).toBe(0);
  });
});


// ── removeCity ────────────────────────────────────────────────────────────

describe('removeCity', () => {
  it('removes city from store.cities', async () => {
    const { removeCity } = await import('@/data/city');
    store.cities[99] = { id: 99, owner: 0, tile: 0 } as never;
    removeCity(99);
    expect(store.cities[99]).toBeUndefined();
  });

  it('does nothing for null/undefined id', async () => {
    const { removeCity } = await import('@/data/city');
    expect(() => removeCity(null as never)).not.toThrow();
  });

  it('does nothing for non-existent city', async () => {
    const { removeCity } = await import('@/data/city');
    expect(() => removeCity(88888)).not.toThrow();
  });
});

// ── getCityProductionTypeSprite ───────────────────────────────────────────

describe('getCityProductionTypeSprite', () => {
  it('returns null for null city', async () => {
    const { getCityProductionTypeSprite } = await import('@/data/city');
    expect(getCityProductionTypeSprite(null)).toBeNull();
  });

  it('returns null when production_kind is not VUT_UTYPE or VUT_IMPROVEMENT', async () => {
    const { getCityProductionTypeSprite } = await import('@/data/city');
    expect(getCityProductionTypeSprite({ production_kind: 99, production_value: 0 } as never)).toBeNull();
  });
});

// ── getCityProductionTime ─────────────────────────────────────────────────

describe('getCityProductionTime', () => {
  it('returns a very large number (FC_INFINITY) for null city', async () => {
    const { getCityProductionTime } = await import('@/data/city');
    expect(getCityProductionTime(null)).toBeGreaterThan(999999);
  });

  it('returns a very large number (FC_INFINITY) for unknown production_kind', async () => {
    const { getCityProductionTime } = await import('@/data/city');
    expect(getCityProductionTime({ production_kind: 99, production_value: 0 } as never)).toBeGreaterThan(999999);
  });
});
