/**
 * Unit tests for data/unittype.ts
 *
 * Tests unit type query functions: utype_can_do_action,
 * can_player_build_unit_direct, get_units_from_tech.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  UCF,
  UTYF_FLAGLESS,
  UTYF_PROVIDES_RANSOM,
  U_NOT_OBSOLETED,
  U_LAST,
  utype_can_do_action,
  can_player_build_unit_direct,
  get_units_from_tech,
} from '@/data/unittype';
import { store } from '@/data/store';
import { TECH_KNOWN } from '@/data/tech';
import type { Player, UnitType } from '@/data/types';

// Helper to create a player with inventions
function makePlayerWithTechs(knownTechs: number[]): Player {
  const inventions: Record<number, number> = {};
  for (const t of knownTechs) {
    inventions[t] = TECH_KNOWN;
  }
  return { inventions } as unknown as Player;
}

function makeUnitType(overrides: Partial<UnitType> = {}): UnitType {
  return {
    id: 0,
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

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

describe('Unittype constants', () => {
  it('should export UCF enum values', () => {
    expect(UCF.TERRAIN_SPEED).toBe(0);
    expect(UCF.CAN_OCCUPY_CITY).toBe(3);
    expect(UCF.MISSILE).toBe(4);
    expect(UCF.ZOC).toBe(8);
    expect(UCF.CAN_FORTIFY).toBe(9);
    expect(UCF.CAN_PILLAGE).toBe(10);
  });

  it('should export UTYF constants', () => {
    expect(UTYF_FLAGLESS).toBe(29);
    expect(UTYF_PROVIDES_RANSOM).toBe(30);
  });

  it('should export U_NOT_OBSOLETED as null', () => {
    expect(U_NOT_OBSOLETED).toBeNull();
  });

  it('should export U_LAST as a positive number', () => {
    expect(U_LAST).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// utype_can_do_action
// ---------------------------------------------------------------------------

describe('utype_can_do_action', () => {
  it('should return true when action is set', () => {
    const putype = {
      utype_actions: {
        isSet: (id: number) => id === 5,
      },
    };
    expect(utype_can_do_action(putype, 5)).toBe(true);
  });

  it('should return false when action is not set', () => {
    const putype = {
      utype_actions: {
        isSet: (id: number) => id === 5,
      },
    };
    expect(utype_can_do_action(putype, 3)).toBe(false);
  });

  it('should return false for null putype', () => {
    expect(utype_can_do_action(null, 0)).toBe(false);
  });

  it('should return false when utype_actions is null', () => {
    expect(utype_can_do_action({ utype_actions: null }, 0)).toBe(false);
  });

  it('should return false when utype_actions is undefined', () => {
    expect(utype_can_do_action({}, 0)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// can_player_build_unit_direct
// ---------------------------------------------------------------------------

describe('can_player_build_unit_direct', () => {
  beforeEach(() => {
    store.unitTypes = {};
  });

  afterEach(() => {
    store.unitTypes = {};
  });

  it('should return false for null player', () => {
    expect(can_player_build_unit_direct(null, makeUnitType({ tech_requirement: 5 }))).toBe(false);
  });

  it('should return false for null unittype', () => {
    expect(can_player_build_unit_direct(makePlayerWithTechs([]), null)).toBe(false);
  });

  it('should return true when player knows required tech', () => {
    const player = makePlayerWithTechs([10]);
    const utype = makeUnitType({ tech_requirement: 10 });
    expect(can_player_build_unit_direct(player, utype)).toBe(true);
  });

  it('should return false when player lacks required tech', () => {
    const player = makePlayerWithTechs([5]);
    const utype = makeUnitType({ tech_requirement: 10 });
    expect(can_player_build_unit_direct(player, utype)).toBe(false);
  });

  it('should return true when no tech requirement', () => {
    const player = makePlayerWithTechs([]);
    const utype = makeUnitType({ tech_requirement: -1 });
    expect(can_player_build_unit_direct(player, utype)).toBe(true);
  });

  it('should return false when obsoleted_by unit is buildable', () => {
    const player = makePlayerWithTechs([10, 20]);
    const utype = makeUnitType({ tech_requirement: 10, obsoleted_by: 2 });
    store.unitTypes = {
      2: makeUnitType({ id: 2, tech_requirement: 20 }),
    };
    expect(can_player_build_unit_direct(player, utype)).toBe(false);
  });

  it('should return true when obsoleting unit tech is not known', () => {
    const player = makePlayerWithTechs([10]);
    const utype = makeUnitType({ tech_requirement: 10, obsoleted_by: 2 });
    store.unitTypes = {
      2: makeUnitType({ id: 2, tech_requirement: 20 }),
    };
    expect(can_player_build_unit_direct(player, utype)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// get_units_from_tech
// ---------------------------------------------------------------------------

describe('get_units_from_tech', () => {
  beforeEach(() => {
    store.unitTypes = {
      0: makeUnitType({ id: 0, name: 'Warriors', tech_requirement: -1 }),
      1: makeUnitType({ id: 1, name: 'Phalanx', tech_requirement: 5 }),
      2: makeUnitType({ id: 2, name: 'Musketeers', tech_requirement: 10 }),
      3: makeUnitType({ id: 3, name: 'Pikemen', tech_requirement: 5 }),
    };
  });

  afterEach(() => {
    store.unitTypes = {};
  });

  it('should return units requiring the given tech', () => {
    const units = get_units_from_tech(5);
    expect(units).toHaveLength(2);
    expect(units.map((u) => u.name)).toContain('Phalanx');
    expect(units.map((u) => u.name)).toContain('Pikemen');
  });

  it('should return empty array when no units require the tech', () => {
    expect(get_units_from_tech(99)).toHaveLength(0);
  });

  it('should return units with no tech requirement when tech_requirement is -1', () => {
    const units = get_units_from_tech(-1);
    expect(units).toHaveLength(1);
    expect(units[0].name).toBe('Warriors');
  });
});

// ── utype_can_do_action_result ────────────────────────────────────────────

describe('utype_can_do_action_result', () => {
  it('is exported as a function', async () => {
    const { utype_can_do_action_result } = await import('@/data/unittype');
    expect(typeof utype_can_do_action_result).toBe('function');
  });

  it('returns false when unit has no actions', async () => {
    const { utype_can_do_action_result } = await import('@/data/unittype');
    const putype = { utype_actions: { isSet: () => false } } as never;
    expect(utype_can_do_action_result(putype, 0)).toBe(false);
  });
});
