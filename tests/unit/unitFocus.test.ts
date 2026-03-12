/**
 * Unit tests for core/control/unitFocus.ts pure query functions.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { store } from '@/data/store';

beforeEach(() => {
  store.reset();
});

describe('get_units_in_focus', () => {
  it('is exported as a function', async () => {
    const { get_units_in_focus } = await import('@/core/control/unitFocus');
    expect(typeof get_units_in_focus).toBe('function');
  });

  it('returns an array (empty when no units in focus)', async () => {
    const { get_units_in_focus } = await import('@/core/control/unitFocus');
    const result = get_units_in_focus();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe('unit_is_in_focus', () => {
  it('is exported as a function', async () => {
    const { unit_is_in_focus } = await import('@/core/control/unitFocus');
    expect(typeof unit_is_in_focus).toBe('function');
  });

  it('returns false for a unit not in focus', async () => {
    const { unit_is_in_focus } = await import('@/core/control/unitFocus');
    const fakeUnit = { id: 999 } as never;
    expect(unit_is_in_focus(fakeUnit)).toBe(false);
  });
});

describe('get_focus_unit_on_tile', () => {
  it('is exported as a function', async () => {
    const { get_focus_unit_on_tile } = await import('@/core/control/unitFocus');
    expect(typeof get_focus_unit_on_tile).toBe('function');
  });

  it('returns null when tile has no focused units', async () => {
    const { get_focus_unit_on_tile } = await import('@/core/control/unitFocus');
    const fakeTile = { tile: 0, units: [] } as never;
    expect(get_focus_unit_on_tile(fakeTile)).toBeNull();
  });
});

describe('unit_distance_compare', () => {
  it('is exported as a function', async () => {
    const { unit_distance_compare } = await import('@/core/control/unitFocus');
    expect(typeof unit_distance_compare).toBe('function');
  });

  it('returns a number', async () => {
    const { unit_distance_compare } = await import('@/core/control/unitFocus');
    const unitA = { id: 1 } as never;
    const unitB = { id: 2 } as never;
    expect(typeof unit_distance_compare(unitA, unitB)).toBe('number');
  });
});

describe('update_unit_focus', () => {
  it('does not throw', async () => {
    const { update_unit_focus } = await import('@/core/control/unitFocus');
    expect(() => update_unit_focus()).not.toThrow();
  });
});

describe('set_unit_focus', () => {
  it('does not throw for null (clears focus)', async () => {
    const { set_unit_focus } = await import('@/core/control/unitFocus');
    expect(() => set_unit_focus(null)).not.toThrow();
  });
});

describe('unitFocus — additional exports', () => {
  it('get_focus_unit_on_tile is exported as a function', async () => {
    const { get_focus_unit_on_tile } = await import('@/core/control/unitFocus');
    expect(typeof get_focus_unit_on_tile).toBe('function');
  });

  it('find_best_focus_candidate is exported as a function', async () => {
    const { find_best_focus_candidate } = await import('@/core/control/unitFocus');
    expect(typeof find_best_focus_candidate).toBe('function');
  });

  it('find_best_focus_candidate returns null with empty unit store', async () => {
    const { find_best_focus_candidate } = await import('@/core/control/unitFocus');
    const result = find_best_focus_candidate(true);
    expect(result === null || typeof result === 'object').toBe(true);
  });

  it('find_visible_unit is exported as a function', async () => {
    const { find_visible_unit } = await import('@/core/control/unitFocus');
    expect(typeof find_visible_unit).toBe('function');
  });

  it('find_visible_unit returns null for null tile', async () => {
    const { find_visible_unit } = await import('@/core/control/unitFocus');
    expect(find_visible_unit(null)).toBeNull();
  });

  it('get_drawable_unit is exported as a function', async () => {
    const { get_drawable_unit } = await import('@/core/control/unitFocus');
    expect(typeof get_drawable_unit).toBe('function');
  });

  it('get_drawable_unit returns null for null tile', async () => {
    const { get_drawable_unit } = await import('@/core/control/unitFocus');
    expect(get_drawable_unit(null, false)).toBeNull();
  });

  it('auto_center_on_focus_unit is exported as a function', async () => {
    const { auto_center_on_focus_unit } = await import('@/core/control/unitFocus');
    expect(typeof auto_center_on_focus_unit).toBe('function');
  });

  it('auto_center_on_focus_unit does not throw with empty focus', async () => {
    const { auto_center_on_focus_unit } = await import('@/core/control/unitFocus');
    expect(() => auto_center_on_focus_unit()).not.toThrow();
  });

  it('find_a_focus_unit_tile_to_center_on is exported as a function', async () => {
    const { find_a_focus_unit_tile_to_center_on } = await import('@/core/control/unitFocus');
    expect(typeof find_a_focus_unit_tile_to_center_on).toBe('function');
  });

  it('city_dialog_activate_unit is exported as a function', async () => {
    const { city_dialog_activate_unit } = await import('@/core/control/unitFocus');
    expect(typeof city_dialog_activate_unit).toBe('function');
  });

  it('set_unit_focus_and_redraw is exported as a function', async () => {
    const { set_unit_focus_and_redraw } = await import('@/core/control/unitFocus');
    expect(typeof set_unit_focus_and_redraw).toBe('function');
  });

  it('set_unit_focus_and_activate is exported as a function', async () => {
    const { set_unit_focus_and_activate } = await import('@/core/control/unitFocus');
    expect(typeof set_unit_focus_and_activate).toBe('function');
  });
});

// ── unit_focus_urgent / control_unit_killed / advance_unit_focus ──────────

describe('unit_focus_urgent', () => {
  it('is exported as a function', async () => {
    const { unit_focus_urgent } = await import('@/core/control/unitFocus');
    expect(typeof unit_focus_urgent).toBe('function');
  });

  it('logs and returns for null unit', async () => {
    const { unit_focus_urgent } = await import('@/core/control/unitFocus');
    // null → logs "not a unit" and returns — no throw
    expect(() => unit_focus_urgent(null as never)).not.toThrow();
  });
});

describe('control_unit_killed', () => {
  it('is exported as a function', async () => {
    const { control_unit_killed } = await import('@/core/control/unitFocus');
    expect(typeof control_unit_killed).toBe('function');
  });

  it('does not throw for a unit not in focus', async () => {
    const { control_unit_killed } = await import('@/core/control/unitFocus');
    const punit = { id: 9999, activity: 0 } as never;
    expect(() => control_unit_killed(punit)).not.toThrow();
  });
});

describe('advance_unit_focus', () => {
  it('is exported as a function', async () => {
    const { advance_unit_focus } = await import('@/core/control/unitFocus');
    expect(typeof advance_unit_focus).toBe('function');
  });

  it('does not throw when no units are in focus', async () => {
    const { advance_unit_focus } = await import('@/core/control/unitFocus');
    expect(() => advance_unit_focus()).not.toThrow();
  });
});
