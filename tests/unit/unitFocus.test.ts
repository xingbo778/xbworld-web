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
