/**
 * Unit tests for small data modules and clientCore.
 *
 * Covers: improvement.ts, extra.ts, actions.ts, government.ts,
 *         terrain.ts, unittype.ts, clientCore.ts
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

// Direct imports for functions
import {
  is_wonder,
  get_improvement_requirements,
  get_improvements_from_tech,
  improvementIdByName,
  improvements_init,
  improvements_add_building,
} from '@/data/improvement';
import { store } from '@/data/store';
import {
  EXTRA_NONE,
  BASE_GUI_FORTRESS,
  BASE_GUI_AIRBASE,
  extraByNumber,
  isExtraCausedBy,
  isExtraRemovedBy,
} from '@/data/extra';
import {
  actionByNumber,
  actionHasResult,
  actionProbPossible,
} from '@/data/actions';
import { governmentMaxRate } from '@/data/government';
import { EFT_MAX_RATES, VUT_GOVERNMENT, REQ_RANGE_PLAYER } from '@/data/fcTypes';
import {
  UTYF_FLAGLESS,
  UTYF_PROVIDES_RANSOM,
  U_NOT_OBSOLETED,
  utype_can_do_action,
} from '@/data/unittype';
import {
  tileSetTerrain,
  tileTerrain,
  isOceanTile,
} from '@/data/terrain';
import {
  isLongturn,
  isServer,
  setPhaseStart,
  getInvalidUsernameReason,
} from '@/client/clientCore';
import type { Extra, Improvement, Terrain, Tile } from '@/data/types';

type SmallModulesWindow = Window & {
  check_text_with_banlist_exact?: (name: string) => boolean;
};

const win = window as SmallModulesWindow;

function makeImprovementFixture(
  id: number,
  name: string,
  extra: Partial<Improvement> = {},
): Improvement {
  return {
    id,
    name,
    rule_name: name.toLowerCase(),
    genus: 0,
    build_cost: 100,
    graphic_str: name,
    graphic_alt: name,
    ...extra,
  };
}

function makeTerrain(terrain: number): Tile {
  return {
    index: 0,
    x: 0,
    y: 0,
    terrain,
    known: 0,
    extras: [],
    owner: 0,
    worked: 0,
    resource: 0,
    continent: 0,
  };
}

function makeTerrainType(id: number, name: string, graphicStr: string): Terrain {
  return {
    id,
    name,
    graphic_str: graphicStr,
    movement_cost: 1,
    defense_bonus: 0,
    output: [],
  };
}

// ===========================================================================
// improvement.ts
// ===========================================================================

describe('improvement.ts', () => {
  beforeEach(() => {
    improvements_init();
    const buildings = [
      makeImprovementFixture(0, 'Palace', { soundtag: 'b_palace', reqs: [{ kind: 4, value: 5, present: true }] }),
      makeImprovementFixture(1, 'Barracks', { soundtag: 'b_barracks', reqs: [{ kind: 4, value: 3, present: true }] }),
      makeImprovementFixture(2, 'Great Wall', { soundtag: 'w_great_wall', reqs: [{ kind: 4, value: 10, present: true }] }),
      makeImprovementFixture(3, 'Library', { soundtag: 'b_library', reqs: [] }),
    ];
    buildings.forEach((b) => improvements_add_building(b));
  });

  afterEach(() => {
    improvements_init();
  });

  describe('is_wonder', () => {
    it('should return true for wonders (soundtag starts with w)', () => {
      expect(is_wonder(store.improvements[2])).toBe(true);
    });

    it('should return false for buildings (soundtag starts with b)', () => {
      expect(is_wonder(store.improvements[0])).toBe(false);
      expect(is_wonder(store.improvements[1])).toBe(false);
    });
  });

  describe('get_improvement_requirements', () => {
    it('should return tech ids from reqs with kind=VUT_ADVANCE and present=true', () => {
      expect(get_improvement_requirements(0)).toEqual([5]);
      expect(get_improvement_requirements(1)).toEqual([3]);
    });

    it('should return empty array when no reqs', () => {
      expect(get_improvement_requirements(3)).toEqual([]);
    });

    it('should return empty array for non-existent improvement', () => {
      expect(get_improvement_requirements(99)).toEqual([]);
    });
  });

  describe('get_improvements_from_tech', () => {
    it('should return improvements that require the given tech', () => {
      const result = get_improvements_from_tech(5);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Palace');
    });

    it('should return empty array for tech with no improvements', () => {
      expect(get_improvements_from_tech(99)).toEqual([]);
    });
  });

  describe('improvementIdByName (TS internal)', () => {
    it('should find improvement by name', () => {
      expect(improvementIdByName('Palace')).toBe(0);
      expect(improvementIdByName('Library')).toBe(3);
    });

    it('should return -1 for non-existent name', () => {
      expect(improvementIdByName('NonExistent')).toBe(-1);
    });
  });
});

// ===========================================================================
// extra.ts
// ===========================================================================

describe('extra.ts', () => {
  function mockBV(...setBits: number[]) {
    return { isSet: (bit: number) => setBits.includes(bit) };
  }

  beforeEach(() => {
    store.extras = {
      0: { id: 0, name: 'Road', rule_name: 'road', causes: mockBV(0, 1), rmcauses: mockBV(), gui_type: 0 } as never,
      1: { id: 1, name: 'Fortress', rule_name: 'fortress', causes: mockBV(0, 2), rmcauses: mockBV(1), gui_type: BASE_GUI_FORTRESS } as never,
      2: { id: 2, name: 'Airbase', rule_name: 'airbase', causes: mockBV(0, 2), rmcauses: mockBV(1), gui_type: BASE_GUI_AIRBASE } as never,
    };
    store.rulesControl = { num_extra_types: 10 };
  });

  afterEach(() => {
    store.extras = {};
    store.rulesControl = null;
  });

  describe('constants', () => {
    it('should have correct extra constants', () => {
      expect(EXTRA_NONE).toBe(-1);
      expect(BASE_GUI_FORTRESS).toBe(0);
      expect(BASE_GUI_AIRBASE).toBe(1);
    });
  });

  describe('extraByNumber', () => {
    it('should return extra by id', () => {
      expect(extraByNumber(0)?.name).toBe('Road');
      expect(extraByNumber(1)?.name).toBe('Fortress');
    });

    it('should return null for non-existent extra', () => {
      expect(extraByNumber(99)).toBeNull();
    });
  });

  describe('isExtraCausedBy', () => {
    it('should return true when cause bit is set', () => {
      expect(isExtraCausedBy(store.extras[0], 0)).toBe(true);
      expect(isExtraCausedBy(store.extras[0], 1)).toBe(true);
    });

    it('should return false when cause bit is not set', () => {
      expect(isExtraCausedBy(store.extras[0], 2)).toBe(false);
    });
  });

  describe('isExtraRemovedBy', () => {
    it('should return true when rmcause bit is set', () => {
      expect(isExtraRemovedBy(store.extras[1], 1)).toBe(true);
    });

    it('should return false when rmcause bit is not set', () => {
      expect(isExtraRemovedBy(store.extras[1], 0)).toBe(false);
    });
  });
});

// ===========================================================================
// actions.ts
// ===========================================================================

describe('actions.ts', () => {
  beforeEach(() => {
    store.actions = {
      0: { id: 0, result: 10, ui_name: 'Attack', enablers: [] },
      1: { id: 1, result: 20, ui_name: 'Fortify', enablers: [] },
    };
  });

  afterEach(() => {
    store.actions = {};
  });

  describe('actionByNumber', () => {
    it('should return action by id', () => {
      expect(actionByNumber(0)?.ui_name).toBe('Attack');
    });

    it('should return null for non-existent action', () => {
      expect(actionByNumber(99)).toBeNull();
    });
  });

  describe('actionHasResult', () => {
    it('should return true when result matches', () => {
      expect(actionHasResult(actionByNumber(0), 10)).toBe(true);
    });

    it('should return false when result does not match', () => {
      expect(actionHasResult(actionByNumber(0), 20)).toBe(false);
    });

    it('should return null for null action', () => {
      expect(actionHasResult(null, 10)).toBeNull();
    });
  });

  describe('actionProbPossible', () => {
    it('should return true when max > 0', () => {
      expect(actionProbPossible({ min: 0, max: 100 })).toBe(true);
    });

    it('should return false when max is 0 and no not_impl', () => {
      expect(actionProbPossible({ min: 0, max: 0 })).toBe(false);
    });
  });
});

// ===========================================================================
// government.ts
// ===========================================================================

/** Helper: set an EFT_MAX_RATES effect with optional government requirement. */
function makeMaxRatesEffect(effectValue: number, govtId?: number): Record<string, unknown> {
  return {
    effect_type: EFT_MAX_RATES,
    effect_value: effectValue,
    reqs: govtId != null
      ? [{ kind: VUT_GOVERNMENT, range: REQ_RANGE_PLAYER, value: govtId, present: true }]
      : [],
  };
}

describe('government.ts', () => {
  describe('governmentMaxRate — effects-based', () => {
    beforeEach(() => { store.effects = {}; });
    afterEach(() => { store.effects = {}; });

    it('returns 100 when store.effects has no EFT_MAX_RATES data', () => {
      expect(governmentMaxRate(1)).toBe(100);
    });

    it('returns 100 when EFT_MAX_RATES array is empty', () => {
      store.effects[EFT_MAX_RATES] = [];
      expect(governmentMaxRate(1)).toBe(100);
    });

    it('returns effect_value for government with matching VUT_GOVERNMENT requirement', () => {
      store.effects[EFT_MAX_RATES] = [
        makeMaxRatesEffect(60, 1), // Despotism
        makeMaxRatesEffect(70, 2), // Monarchy
      ] as never;
      expect(governmentMaxRate(1)).toBe(60);
      expect(governmentMaxRate(2)).toBe(70);
    });

    it('returns 100 when no effects match the given government', () => {
      store.effects[EFT_MAX_RATES] = [
        makeMaxRatesEffect(60, 1), // only Despotism has an effect
      ] as never;
      expect(governmentMaxRate(5)).toBe(100); // Democracy: no matching effect
    });

    it('applies unconditional effect (empty reqs) to all governments', () => {
      store.effects[EFT_MAX_RATES] = [
        makeMaxRatesEffect(80), // no government requirement → applies everywhere
      ] as never;
      expect(governmentMaxRate(1)).toBe(80);
      expect(governmentMaxRate(3)).toBe(80);
    });

    it('sums multiple matching effects', () => {
      store.effects[EFT_MAX_RATES] = [
        makeMaxRatesEffect(60, 1), // government-specific: +60
        makeMaxRatesEffect(20),    // unconditional: +20
      ] as never;
      // Despotism (1): 60 + 20 = 80
      expect(governmentMaxRate(1)).toBe(80);
      // Monarchy (2): only the unconditional effect applies → 20
      expect(governmentMaxRate(2)).toBe(20);
    });

    it('returns 100 for unknown government id when no matching effects', () => {
      store.effects[EFT_MAX_RATES] = [
        makeMaxRatesEffect(60, 1),
      ] as never;
      expect(governmentMaxRate(99)).toBe(100);
    });
  });
});

// ===========================================================================
// terrain.ts
// ===========================================================================

describe('terrain.ts', () => {
  beforeEach(() => {
    store.terrains = {
      0: makeTerrainType(0, 'Grassland', 'grassland'),
      1: makeTerrainType(1, 'Ocean', 'floor'),
      2: makeTerrainType(2, 'Coast', 'coast'),
      3: makeTerrainType(3, 'Desert', 'desert'),
    };
  });

  afterEach(() => {
    store.terrains = {};
  });

  describe('tile_set_terrain / tile_terrain', () => {
    it('should set and get terrain', () => {
      const ptile = makeTerrain(-1);
      tileSetTerrain(ptile, 2);
      expect(ptile.terrain).toBe(2);
      const t = tileTerrain(ptile);
      expect(t?.name).toBe('Coast');
    });

    it('should return undefined for invalid terrain id', () => {
      const ptile = makeTerrain(99);
      expect(tileTerrain(ptile)).toBeUndefined();
    });
  });

  describe('is_ocean_tile', () => {
    it('should return true for floor terrain (Ocean)', () => {
      const ptile = makeTerrain(1);
      expect(isOceanTile(ptile)).toBe(true);
    });

    it('should return true for coast terrain', () => {
      const ptile = makeTerrain(2);
      expect(isOceanTile(ptile)).toBe(true);
    });

    it('should return false for land terrain', () => {
      const ptile = makeTerrain(0);
      expect(isOceanTile(ptile)).toBe(false);
    });

    it('should return false for invalid terrain', () => {
      const ptile = makeTerrain(99);
      expect(isOceanTile(ptile)).toBe(false);
    });
  });
});

// ===========================================================================
// unittype.ts
// ===========================================================================

describe('unittype.ts', () => {
  describe('constants', () => {
    it('should export correct unittype constants', () => {
      expect(UTYF_FLAGLESS).toBe(29);
      expect(UTYF_PROVIDES_RANSOM).toBe(30);
      expect(U_NOT_OBSOLETED).toBeNull();
    });
  });

  describe('utype_can_do_action', () => {
    it('should return true when action is set', () => {
      const putype = {
        utype_actions: { isSet: (id: number) => id === 5 },
      };
      expect(utype_can_do_action(putype, 5)).toBe(true);
    });

    it('should return false when action is not set', () => {
      const putype = {
        utype_actions: { isSet: (id: number) => id === 5 },
      };
      expect(utype_can_do_action(putype, 3)).toBe(false);
    });

    it('should return false for null putype', () => {
      expect(utype_can_do_action(null, 5)).toBe(false);
    });

    it('should return false when utype_actions is null', () => {
      expect(utype_can_do_action({ utype_actions: null }, 5)).toBe(false);
    });
  });
});

// ===========================================================================
// clientCore.ts
// ===========================================================================

describe('clientCore.ts', () => {
  describe('game type queries', () => {
    afterEach(() => {
      store.gameType = '';
    });

    it('isLongturn should return true for longturn game', () => {
      store.gameType = 'longturn';
      expect(isLongturn()).toBe(true);
    });

    it('isLongturn should return false for other game types', () => {
      store.gameType = 'singleplayer';
      expect(isLongturn()).toBe(false);
    });

    it('isServer should always return false', () => {
      expect(isServer()).toBe(false);
    });
  });

  describe('setPhaseStart', () => {
    afterEach(() => {
      store.phaseStartTime = 0;
    });

    it('should set phase_start_time to current time', () => {
      const before = Date.now();
      setPhaseStart();
      const after = Date.now();
      expect(store.phaseStartTime).toBeGreaterThanOrEqual(before);
      expect(store.phaseStartTime).toBeLessThanOrEqual(after);
    });
  });

  describe('getInvalidUsernameReason', () => {
    it('should return "empty" for null', () => {
      expect(getInvalidUsernameReason(null)).toBe('empty');
    });

    it('should return "empty" for empty string', () => {
      expect(getInvalidUsernameReason('')).toBe('empty');
    });

    it('should return "too short" for 1-2 char names', () => {
      expect(getInvalidUsernameReason('ab')).toBe('too short');
      expect(getInvalidUsernameReason('a')).toBe('too short');
    });

    it('should return "too long" for names >= 32 chars', () => {
      expect(getInvalidUsernameReason('a'.repeat(32))).toBe('too long');
    });


    it('should return invalid for names starting with number', () => {
      expect(getInvalidUsernameReason('1abc')).toContain('invalid');
    });

    it('should return invalid for names with special chars', () => {
      expect(getInvalidUsernameReason('abc def')).toContain('invalid');
      expect(getInvalidUsernameReason('abc@def')).toContain('invalid');
    });

    it('should return null for valid names', () => {
      expect(getInvalidUsernameReason('player1')).toBeNull();
      expect(getInvalidUsernameReason('TestUser')).toBeNull();
      expect(getInvalidUsernameReason('abc')).toBeNull();
    });

    it('should return "banned" when banlist check fails', () => {
      win.check_text_with_banlist_exact = (name: string) => name !== 'badword';
      expect(getInvalidUsernameReason('badword')).toBe('banned');
      delete win.check_text_with_banlist_exact;
    });
  });
});
