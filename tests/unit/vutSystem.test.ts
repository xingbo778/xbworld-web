/**
 * Unit tests for B1 VUT system additions.
 *
 * Covers:
 *  VUT-1  VUT_UCFLAG — matches when unit class has the flag set
 *  VUT-2  VUT_UCFLAG — TRI_NO when unit class does NOT have the flag
 *  VUT-3  VUT_UCFLAG — TRI_MAYBE (→ RPT_POSSIBLE=true) when unit type is null
 *  VUT-4  VUT_UCFLAG — TRI_MAYBE when unit_class field is missing
 *  VUT-5  VUT_UCFLAG — TRI_MAYBE when class not found in store.unitClasses
 *  VUT-6  VUT_UCFLAG — TRI_MAYBE when flags BitVector missing on class
 *  VUT-7  VUT_UCFLAG — present=false negates the result
 *  VUT-8  generateProductionList filters units with UTYF_PROVIDES_RANSOM
 *  VUT-9  generateProductionList keeps units without UTYF_PROVIDES_RANSOM
 *  VUT-10 generateProductionList unit_details includes class label e.g. "[Land]"
 *  VUT-11 generateProductionList unit_details has attack/defense/firepower
 *  VUT-12 buildProductionListData filters units with UTYF_PROVIDES_RANSOM flag
 *  VUT-13 getUnitClassForType returns class object when available
 *  VUT-14 getUnitClassForType returns null for missing class
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  VUT_UCFLAG,
  REQ_RANGE_LOCAL,
  REQ_RANGE_PLAYER,
  RPT_POSSIBLE,
  RPT_CERTAIN,
  VUT_UTYPE,
} from '@/data/fcTypes';

// ---------------------------------------------------------------------------
// Store mock (hoisted so vi.mock factory can reference it)
// ---------------------------------------------------------------------------
const mockStore = vi.hoisted(() => ({
  unitTypes: {} as Record<number, unknown>,
  unitClasses: {} as Record<number, unknown>,
  improvements: {} as Record<number, unknown>,
  players: {} as Record<number, unknown>,
  cities: {} as Record<number, unknown>,
  techs: {} as Record<number, unknown>,
  rulesControl: { num_impr_types: 0 },
  gameInfo: null as unknown,
  mapInfo: null as unknown,
  nations: {} as Record<number, unknown>,
}));

vi.mock('@/data/store', () => ({ store: mockStore }));

vi.mock('@/data/tech', () => ({
  TECH_KNOWN: 2,
  playerInventionState: (_p: unknown, _id: number) => 0,
}));

vi.mock('@/data/map', async (importOriginal) => ({
  ...(await importOriginal() as object),
}));

vi.mock('@/data/improvement', () => ({
  improvements_init: vi.fn(),
  get_improvements_from_tech: vi.fn(() => []),
}));

vi.mock('@/renderer/tilespec', () => ({
  get_unit_type_image_sprite: vi.fn(() => null),
  get_improvement_image_sprite: vi.fn(() => null),
  tileset_tech_graphic_tag: vi.fn(() => null),
}));

// Real mini event emitter so city.ts cache callbacks actually fire
const _eventListeners = vi.hoisted(() => ({} as Record<string, Array<() => void>>));
vi.mock('@/core/events', () => ({
  globalEvents: {
    emit: vi.fn((event: string) => { (_eventListeners[event] ?? []).forEach(fn => fn()); }),
    on: vi.fn((event: string, fn: () => void) => {
      if (!_eventListeners[event]) _eventListeners[event] = [];
      _eventListeners[event].push(fn);
    }),
  },
}));

vi.mock('@/client/clientState', () => ({
  clientPlaying: () => null,
  clientIsObserver: () => true,
}));

// ---------------------------------------------------------------------------
// Imports (after mocks)
// ---------------------------------------------------------------------------
import { isReqActive, areReqsActive } from '@/data/requirements';
import { generateProductionList } from '@/data/city';
import { buildProductionListData } from '@/ui/cityLogic';
import { getUnitClassForType, UTYF_PROVIDES_RANSOM } from '@/data/unittype';
import type { UnitType } from '@/data/types';

/* eslint-disable @typescript-eslint/no-explicit-any */

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Create a fake BitVector that tracks which bits are set. */
function makeBitVector(setBits: number[] = []): { isSet(n: number): boolean } {
  return { isSet: (n: number) => setBits.includes(n) };
}

function makeReq(overrides: Partial<{ kind: number; range: number; value: number; present: boolean }> = {}) {
  return {
    kind: VUT_UCFLAG,
    range: REQ_RANGE_LOCAL,
    value: 0,
    present: true,
    ...overrides,
  };
}

function makeUnitType(id: number, opts: {
  unit_class?: number;
  flags?: { isSet(n: number): boolean } | null;
  attack?: number;
  defense?: number;
  firepower?: number;
  buildCost?: number;
  techReq?: number;
  buildReqs?: unknown[];
} = {}): UnitType {
  return {
    id,
    name: `Unit${id}`,
    rule_name: `unit${id}`,
    graphic_str: '',
    graphic_alt: '',
    unit_class: opts.unit_class ?? 0,
    flags: opts.flags ?? makeBitVector(),
    attack_strength: opts.attack ?? 1,
    defense_strength: opts.defense ?? 1,
    firepower: opts.firepower ?? 1,
    build_cost: opts.buildCost ?? 40,
    tech_requirement: opts.techReq ?? -1,
    obsoleted_by: -1,
    build_reqs: opts.buildReqs ?? [],
  } as unknown as UnitType;
}

function makeUnitClass(id: number, name: string, flagBits: number[] = []): Record<string, unknown> {
  return { id, name, flags: makeBitVector(flagBits) };
}

function resetStore() {
  mockStore.unitTypes = {};
  mockStore.unitClasses = {};
  mockStore.improvements = {};
  mockStore.players = {};
  mockStore.cities = {};
  mockStore.techs = {};
  mockStore.rulesControl = { num_impr_types: 0 };
  mockStore.gameInfo = null;
  mockStore.mapInfo = null;
  mockStore.nations = {};
  // Fire store:reset so city.ts clears _cachedProductionList
  (_eventListeners['store:reset'] ?? []).forEach(fn => fn());
}

// ---------------------------------------------------------------------------
// VUT-1..VUT-7: VUT_UCFLAG evaluation
// ---------------------------------------------------------------------------

describe('VUT_UCFLAG — unit class flag check', () => {
  beforeEach(resetStore);

  it('VUT-1: TRI_YES when unit class has the flag set', () => {
    const FLAG_BIT = 3; // e.g. CAN_OCCUPY_CITY
    mockStore.unitClasses[0] = makeUnitClass(0, 'Land', [FLAG_BIT]);
    const ut = makeUnitType(1, { unit_class: 0 });
    const result = isReqActive(null, null, null, null, ut, null, null,
      makeReq({ value: FLAG_BIT, present: true }), RPT_CERTAIN);
    expect(result).toBe(true);
  });

  it('VUT-2: TRI_NO when unit class does NOT have the flag', () => {
    mockStore.unitClasses[0] = makeUnitClass(0, 'Land', []); // no flags
    const ut = makeUnitType(1, { unit_class: 0 });
    const result = isReqActive(null, null, null, null, ut, null, null,
      makeReq({ value: 3, present: true }), RPT_CERTAIN);
    expect(result).toBe(false);
  });

  it('VUT-3: TRI_MAYBE (RPT_POSSIBLE→true) when targetUnittype is null', () => {
    const result = isReqActive(null, null, null, null, null, null, null,
      makeReq({ value: 3 }), RPT_POSSIBLE);
    expect(result).toBe(true);
  });

  it('VUT-3b: TRI_MAYBE (RPT_CERTAIN→false) when targetUnittype is null', () => {
    const result = isReqActive(null, null, null, null, null, null, null,
      makeReq({ value: 3 }), RPT_CERTAIN);
    expect(result).toBe(false);
  });

  it('VUT-4: TRI_MAYBE when unit_class field is missing', () => {
    const ut = { id: 1, name: 'Warrior', flags: makeBitVector() } as unknown as UnitType;
    const result = isReqActive(null, null, null, null, ut, null, null,
      makeReq({ value: 3 }), RPT_CERTAIN);
    expect(result).toBe(false); // TRI_MAYBE → RPT_CERTAIN → false
  });

  it('VUT-5: TRI_MAYBE when unit class not found in store.unitClasses', () => {
    const ut = makeUnitType(1, { unit_class: 99 }); // class 99 doesn't exist
    const result = isReqActive(null, null, null, null, ut, null, null,
      makeReq({ value: 3 }), RPT_POSSIBLE);
    expect(result).toBe(true); // TRI_MAYBE → RPT_POSSIBLE → true
  });

  it('VUT-6: TRI_MAYBE when class flags BitVector is missing', () => {
    mockStore.unitClasses[0] = { id: 0, name: 'Land' }; // no flags field
    const ut = makeUnitType(1, { unit_class: 0 });
    const result = isReqActive(null, null, null, null, ut, null, null,
      makeReq({ value: 3 }), RPT_POSSIBLE);
    expect(result).toBe(true); // TRI_MAYBE → RPT_POSSIBLE → true
  });

  it('VUT-7: present=false negates — TRI_NO becomes true (flag NOT set → requirement met)', () => {
    mockStore.unitClasses[0] = makeUnitClass(0, 'Land', []); // flag 3 NOT set
    const ut = makeUnitType(1, { unit_class: 0 });
    // present=false: requirement is "does NOT have this flag"
    const result = isReqActive(null, null, null, null, ut, null, null,
      makeReq({ value: 3, present: false }), RPT_CERTAIN);
    expect(result).toBe(true);
  });

  it('VUT-7b: present=false negates — TRI_YES becomes false (flag IS set → requirement not met)', () => {
    mockStore.unitClasses[0] = makeUnitClass(0, 'Land', [3]);
    const ut = makeUnitType(1, { unit_class: 0 });
    const result = isReqActive(null, null, null, null, ut, null, null,
      makeReq({ value: 3, present: false }), RPT_CERTAIN);
    expect(result).toBe(false);
  });

  it('areReqsActive works correctly with VUT_UCFLAG in a requirement list', () => {
    const FLAG = 8; // ZOC
    mockStore.unitClasses[2] = makeUnitClass(2, 'Land', [FLAG]);
    const ut = makeUnitType(5, { unit_class: 2 });
    const reqs = [makeReq({ value: FLAG, present: true })];
    expect(areReqsActive(null, null, null, null, ut, null, null, reqs, RPT_CERTAIN)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// VUT-8..VUT-11: generateProductionList flag-based filter + unit_details
// ---------------------------------------------------------------------------

describe('generateProductionList — flag-based unit filter + unit_details', () => {
  beforeEach(resetStore);

  it('VUT-8: filters out unit with UTYF_PROVIDES_RANSOM flag', () => {
    const barbarianFlags = makeBitVector([UTYF_PROVIDES_RANSOM]);
    mockStore.unitTypes[1] = makeUnitType(1, { flags: barbarianFlags });
    const list = generateProductionList();
    expect(list.filter(p => p.kind === VUT_UTYPE && p.value === 1)).toHaveLength(0);
  });

  it('VUT-9: keeps unit WITHOUT UTYF_PROVIDES_RANSOM flag', () => {
    mockStore.unitTypes[2] = makeUnitType(2, { flags: makeBitVector([]) });
    const list = generateProductionList();
    expect(list.filter(p => p.kind === VUT_UTYPE && p.value === 2)).toHaveLength(1);
  });

  it('VUT-9b: keeps unit when flags field is null (missing flags = no restriction)', () => {
    mockStore.unitTypes[3] = makeUnitType(3, { flags: null });
    const list = generateProductionList();
    expect(list.filter(p => p.kind === VUT_UTYPE && p.value === 3)).toHaveLength(1);
  });

  it('VUT-10: unit_details includes class label when unit class is known', () => {
    mockStore.unitClasses[0] = makeUnitClass(0, 'Land');
    mockStore.unitTypes[4] = makeUnitType(4, { unit_class: 0, attack: 3, defense: 2, firepower: 1 });
    const list = generateProductionList();
    const item = list.find(p => p.kind === VUT_UTYPE && p.value === 4);
    expect(item).toBeDefined();
    expect(item!.unit_details).toContain('[Land]');
  });

  it('VUT-11: unit_details has attack/defense/firepower values', () => {
    mockStore.unitTypes[5] = makeUnitType(5, { attack: 5, defense: 3, firepower: 2 });
    const list = generateProductionList();
    const item = list.find(p => p.kind === VUT_UTYPE && p.value === 5);
    expect(item).toBeDefined();
    expect(item!.unit_details).toContain('5');
    expect(item!.unit_details).toContain('3');
    expect(item!.unit_details).toContain('2');
  });

  it('VUT-11b: unit_details has no class label when unit class is unknown', () => {
    mockStore.unitTypes[6] = makeUnitType(6, { unit_class: 99 }); // class 99 not in store
    const list = generateProductionList();
    const item = list.find(p => p.kind === VUT_UTYPE && p.value === 6);
    expect(item).toBeDefined();
    expect(item!.unit_details).not.toContain('[');
  });
});

// ---------------------------------------------------------------------------
// VUT-12: buildProductionListData (cityLogic) flag-based filter
// ---------------------------------------------------------------------------

describe('buildProductionListData — UTYF_PROVIDES_RANSOM filter', () => {
  beforeEach(resetStore);

  function makeCity(id: number): any {
    return {
      id,
      owner: 1,
      improvements: { isSet: () => false },
      size: 2,
      // no can_build_unit → hasData=false path
    };
  }

  it('VUT-12: filters barbarian leader even in hasData=false path', () => {
    const barbarianFlags = makeBitVector([UTYF_PROVIDES_RANSOM]);
    mockStore.players[1] = { playerno: 1, government: 0 } as any;
    mockStore.unitTypes[1] = makeUnitType(1, { flags: barbarianFlags });
    const pcity = makeCity(1);
    const result = buildProductionListData(pcity);
    expect(result.units.find(u => u.type.id === 1)).toBeUndefined();
  });

  it('VUT-12b: keeps regular unit in hasData=false path', () => {
    mockStore.players[1] = { playerno: 1, government: 0 } as any;
    mockStore.unitTypes[2] = makeUnitType(2, { flags: makeBitVector([]) });
    const pcity = makeCity(1);
    const result = buildProductionListData(pcity);
    expect(result.units.find(u => u.type.id === 2)).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// VUT-13..VUT-14: getUnitClassForType helper
// ---------------------------------------------------------------------------

describe('getUnitClassForType helper', () => {
  beforeEach(resetStore);

  it('VUT-13: returns class object when available', () => {
    mockStore.unitClasses[0] = { id: 0, name: 'Land', flags: makeBitVector() };
    const ut = makeUnitType(1, { unit_class: 0 });
    const cls = getUnitClassForType(ut);
    expect(cls).not.toBeNull();
    expect(cls!['name']).toBe('Land');
  });

  it('VUT-14: returns null when unit type is null', () => {
    expect(getUnitClassForType(null)).toBeNull();
  });

  it('VUT-14b: returns null when unit_class field is missing', () => {
    const ut = { id: 1, name: 'Warrior' } as unknown as UnitType;
    expect(getUnitClassForType(ut)).toBeNull();
  });

  it('VUT-14c: returns null when class id not in store.unitClasses', () => {
    const ut = makeUnitType(1, { unit_class: 99 });
    expect(getUnitClassForType(ut)).toBeNull();
  });
});
