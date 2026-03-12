/**
 * Unit tests for data/unit.ts
 *
 * Tests unit query functions migrated from legacy unit.js.
 * Only tests pure functions that don't require renderer or complex DOM.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock modules to break circular: unit → map → helpers → control → mapClick → unit
vi.mock('@/core/overview', () => ({ init_overview: vi.fn() }));
vi.mock('@/core/control', () => ({
  center_tile_mapcanvas: vi.fn(),
  control_init: vi.fn(),
  find_visible_unit: vi.fn(),
}));

import {
  unit_list_size,
  unit_list_without,
  move_points_text,
  get_unit_moves_left,
  ANIM_STEPS,
} from '@/data/unit';
import { store } from '@/data/store';

/* eslint-disable @typescript-eslint/no-explicit-any */

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

describe('Unit constants', () => {
  it('should have ANIM_STEPS = 8', () => {
    expect(ANIM_STEPS).toBe(8);
  });
});

// ---------------------------------------------------------------------------
// unit_list_size
// ---------------------------------------------------------------------------

describe('unit_list_size', () => {
  it('should return length of unit list', () => {
    expect(unit_list_size([{}, {}, {}] as any)).toBe(3);
    expect(unit_list_size([])).toBe(0);
  });

  it('should return 0 for null', () => {
    expect(unit_list_size(null)).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// unit_list_without
// ---------------------------------------------------------------------------

describe('unit_list_without', () => {
  it('should remove unit with matching id', () => {
    const units = [
      { id: 1, name: 'Warriors' },
      { id: 2, name: 'Phalanx' },
      { id: 3, name: 'Settler' },
    ] as any[];
    const result = unit_list_without(units, { id: 2 } as any);
    expect(result).toHaveLength(2);
    expect(result.map((u: any) => u.id)).toEqual([1, 3]);
  });

  it('should return same-length list if unit not found', () => {
    const units = [{ id: 1 }, { id: 2 }] as any[];
    const result = unit_list_without(units, { id: 99 } as any);
    expect(result).toHaveLength(2);
  });

  it('should not modify original array', () => {
    const units = [{ id: 1 }, { id: 2 }] as any[];
    unit_list_without(units, { id: 1 } as any);
    expect(units).toHaveLength(2);
  });
});

// ---------------------------------------------------------------------------
// move_points_text
// ---------------------------------------------------------------------------

describe('move_points_text', () => {
  beforeEach(() => {
    // Default SINGLE_MOVE is 3 in most rulesets
    store.singleMove = 3;
  });

  afterEach(() => {
    store.singleMove = undefined;
  });

  it('should display whole moves', () => {
    expect(move_points_text(6)).toBe('2'); // 6/3 = 2
    expect(move_points_text(9)).toBe('3'); // 9/3 = 3
    expect(move_points_text(0)).toBe('0');
  });

  it('should display fractional moves', () => {
    expect(move_points_text(1)).toBe('1/3'); // 0 whole + 1/3
    expect(move_points_text(2)).toBe('2/3'); // 0 whole + 2/3
  });

  it('should display mixed whole and fractional moves', () => {
    expect(move_points_text(4)).toBe('1 1/3'); // 1 whole + 1/3
    expect(move_points_text(5)).toBe('1 2/3'); // 1 whole + 2/3
    expect(move_points_text(7)).toBe('2 1/3'); // 2 whole + 1/3
  });
});

// ---------------------------------------------------------------------------
// get_unit_moves_left
// ---------------------------------------------------------------------------

describe('get_unit_moves_left', () => {
  beforeEach(() => {
    store.singleMove = 3;
  });

  afterEach(() => {
    store.singleMove = undefined;
  });

  it('should return formatted moves string', () => {
    expect(get_unit_moves_left({ movesleft: 6 } as any)).toBe('Moves:2');
    expect(get_unit_moves_left({ movesleft: 4 } as any)).toBe('Moves:1 1/3');
  });

  it('should return 0 for null unit', () => {
    expect(get_unit_moves_left(null)).toBe(0);
  });
});

// ── idex_lookup_unit ─────────────────────────────────────────────────────

describe('idex_lookup_unit', () => {
  it('returns unit from store by id', async () => {
    const { idex_lookup_unit } = await import('@/data/unit');
    store.units[55] = { id: 55 } as never;
    expect(idex_lookup_unit(55)?.id).toBe(55);
    delete store.units[55];
  });

  it('returns undefined for missing id', async () => {
    const { idex_lookup_unit } = await import('@/data/unit');
    expect(idex_lookup_unit(9999)).toBeUndefined();
  });
});

// ── client_remove_unit ───────────────────────────────────────────────────

describe('client_remove_unit', () => {
  it('removes unit from store.units', async () => {
    const { client_remove_unit } = await import('@/data/unit');
    store.units[77] = { id: 77, tile: -1 } as never;
    client_remove_unit({ id: 77 } as never);
    expect(store.units[77]).toBeUndefined();
  });
});

// ── unit_can_do_action ───────────────────────────────────────────────────

describe('unit_can_do_action', () => {
  it('is exported as a function', async () => {
    const { unit_can_do_action } = await import('@/data/unit');
    expect(typeof unit_can_do_action).toBe('function');
  });

  it('returns a boolean', async () => {
    const { unit_can_do_action } = await import('@/data/unit');
    // punit has no type in store → unit_type is undefined → utype_can_do_action returns false
    const result = unit_can_do_action({ id: 1, type: 999 } as never, 0);
    expect(typeof result).toBe('boolean');
  });
});

// ── unit_has_goto ────────────────────────────────────────────────────────

describe('unit_has_goto', () => {
  it('returns false when no connected player', async () => {
    const { unit_has_goto } = await import('@/data/unit');
    const unit = { id: 1, owner: 0, goto_tile: 5 } as never;
    expect(unit_has_goto(unit)).toBe(false);
  });
});

// ── update_unit_anim_list ────────────────────────────────────────────────

describe('update_unit_anim_list', () => {
  it('does not throw for null inputs', async () => {
    const { update_unit_anim_list } = await import('@/data/unit');
    expect(() => update_unit_anim_list(null, null)).not.toThrow();
  });

  it('does not throw when tiles are the same', async () => {
    const { update_unit_anim_list } = await import('@/data/unit');
    const u = { id: 1, tile: 5, anim_list: [] } as never;
    expect(() => update_unit_anim_list(u, u)).not.toThrow();
  });
});

// ── update_tile_unit / clear_tile_unit ───────────────────────────────────

describe('update_tile_unit / clear_tile_unit', () => {
  it('update_tile_unit does not throw for null unit', async () => {
    const { update_tile_unit } = await import('@/data/unit');
    expect(() => update_tile_unit(null)).not.toThrow();
  });

  it('clear_tile_unit does not throw for null unit', async () => {
    const { clear_tile_unit } = await import('@/data/unit');
    expect(() => clear_tile_unit(null)).not.toThrow();
  });
});
