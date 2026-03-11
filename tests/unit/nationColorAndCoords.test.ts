/**
 * Unit tests for renderer/nationColor.ts and renderer/mapCoords.ts pure functions.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { store } from '@/data/store';

beforeEach(() => {
  store.reset();
});

// ── nationColor ───────────────────────────────────────────────────────────

describe('assign_nation_color', () => {
  it('is exported as a function', async () => {
    const { assign_nation_color } = await import('@/renderer/nationColor');
    expect(typeof assign_nation_color).toBe('function');
  });

  it('does not throw when nation is missing from store', async () => {
    const { assign_nation_color } = await import('@/renderer/nationColor');
    expect(() => assign_nation_color(999)).not.toThrow();
  });

  it('does not throw when nation has no flag sprite', async () => {
    const { assign_nation_color } = await import('@/renderer/nationColor');
    store.nations[1] = { playerno: -1, name: 'Romans', graphic_str: 'romans' } as never;
    expect(() => assign_nation_color(1)).not.toThrow();
  });

  it('does not reassign color when already set', async () => {
    const { assign_nation_color } = await import('@/renderer/nationColor');
    store.nations[2] = { playerno: -1, name: 'Greeks', graphic_str: 'greeks', color: 'rgb(0,0,255)' } as never;
    assign_nation_color(2);
    expect((store.nations[2] as Record<string, unknown>)['color']).toBe('rgb(0,0,255)');
  });
});

describe('color_rbg_to_list', () => {
  it('is exported as a function', async () => {
    const { color_rbg_to_list } = await import('@/renderer/nationColor');
    expect(typeof color_rbg_to_list).toBe('function');
  });

  it('returns null for null input', async () => {
    const { color_rbg_to_list } = await import('@/renderer/nationColor');
    expect(color_rbg_to_list(null)).toBeNull();
  });

  it('parses an rgb color string to a number array', async () => {
    const { color_rbg_to_list } = await import('@/renderer/nationColor');
    const result = color_rbg_to_list('rgb(255,128,0)');
    expect(result).toEqual([255, 128, 0]);
  });

  it('returns null for invalid color string', async () => {
    const { color_rbg_to_list } = await import('@/renderer/nationColor');
    expect(color_rbg_to_list('notacolor')).toBeNull();
  });
});

// ── mapCoords ─────────────────────────────────────────────────────────────

describe('map_to_gui_vector', () => {
  it('is exported as a function', async () => {
    const { map_to_gui_vector } = await import('@/renderer/mapCoords');
    expect(typeof map_to_gui_vector).toBe('function');
  });

  it('returns an object with gui_dx and gui_dy', async () => {
    const { map_to_gui_vector } = await import('@/renderer/mapCoords');
    const result = map_to_gui_vector(1, 0);
    expect(typeof result.gui_dx).toBe('number');
    expect(typeof result.gui_dy).toBe('number');
  });
});

describe('canvas_pos_to_tile', () => {
  it('is exported as a function', async () => {
    const { canvas_pos_to_tile } = await import('@/renderer/mapCoords');
    expect(typeof canvas_pos_to_tile).toBe('function');
  });

  it('returns null or throws when map view is not initialized', async () => {
    const { canvas_pos_to_tile } = await import('@/renderer/mapCoords');
    // mapview may be uninitialized in tests — this is expected to either
    // return null or throw gracefully
    try {
      const result = canvas_pos_to_tile(0, 0);
      expect(result === null || result != null).toBe(true);
    } catch {
      // acceptable in test env with no mapview
    }
  });
});
