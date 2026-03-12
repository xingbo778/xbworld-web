/**
 * Unit tests for renderer/tilespec.ts constants and renderer/mapview.ts exports.
 */
import { describe, it, expect } from 'vitest';

// ── tilespec constants ────────────────────────────────────────────────────

describe('tilespec layer constants', () => {
  it('exports LAYER_SPECIAL1 as a number', async () => {
    const { LAYER_SPECIAL1 } = await import('@/renderer/tilespec');
    expect(typeof LAYER_SPECIAL1).toBe('number');
  });

  it('exports LAYER_COUNT as a positive number', async () => {
    const { LAYER_COUNT } = await import('@/renderer/tilespec');
    expect(typeof LAYER_COUNT).toBe('number');
    expect(LAYER_COUNT).toBeGreaterThan(0);
  });

  it('exports MATCH_NONE as 0', async () => {
    const { MATCH_NONE } = await import('@/renderer/tilespec');
    expect(MATCH_NONE).toBe(0);
  });

  it('exports MATCH_SAME as 1', async () => {
    const { MATCH_SAME } = await import('@/renderer/tilespec');
    expect(MATCH_SAME).toBe(1);
  });

  it('exports CELL_WHOLE as 0', async () => {
    const { CELL_WHOLE } = await import('@/renderer/tilespec');
    expect(CELL_WHOLE).toBe(0);
  });

  it('exports CELL_CORNER as 1', async () => {
    const { CELL_CORNER } = await import('@/renderer/tilespec');
    expect(CELL_CORNER).toBe(1);
  });
});

// ── mapview ───────────────────────────────────────────────────────────────

describe('mapview exports', () => {
  it('is_small_screen is exported as a function', async () => {
    const { is_small_screen } = await import('@/renderer/mapview');
    expect(typeof is_small_screen).toBe('function');
  });

  it('is_small_screen returns a boolean', async () => {
    const { is_small_screen } = await import('@/renderer/mapview');
    expect(typeof is_small_screen()).toBe('boolean');
  });

  it('set_city_mapview_active is exported as a function', async () => {
    const { set_city_mapview_active } = await import('@/renderer/mapview');
    expect(typeof set_city_mapview_active).toBe('function');
  });

  it('set_default_mapview_inactive does not throw', async () => {
    const { set_default_mapview_inactive } = await import('@/renderer/mapview');
    expect(() => set_default_mapview_inactive()).not.toThrow();
  });
});

// ── initTilesetSprites / init_sprites / preload_check / init_cache_sprites / mapview_window_resized ──

describe('mapview additional exports', () => {
  it('initTilesetSprites is exported as a function', async () => {
    const { initTilesetSprites } = await import('@/renderer/mapview');
    expect(typeof initTilesetSprites).toBe('function');
  });

  it('init_sprites is exported as a function', async () => {
    const { init_sprites } = await import('@/renderer/mapview');
    expect(typeof init_sprites).toBe('function');
  });

  it('preload_check is exported as a function', async () => {
    const { preload_check } = await import('@/renderer/mapview');
    expect(typeof preload_check).toBe('function');
  });

  it('init_cache_sprites is exported as a function', async () => {
    const { init_cache_sprites } = await import('@/renderer/mapview');
    expect(typeof init_cache_sprites).toBe('function');
  });

  it('mapview_window_resized is exported as a function', async () => {
    const { mapview_window_resized } = await import('@/renderer/mapview');
    expect(typeof mapview_window_resized).toBe('function');
  });

  it('mapview_window_resized does not throw in test env', async () => {
    const { mapview_window_resized } = await import('@/renderer/mapview');
    expect(() => mapview_window_resized()).not.toThrow();
  });
});

describe('tilespec — fill_sprite_array', () => {
  it('is exported as a function', async () => {
    const { fill_sprite_array } = await import('@/renderer/tilespec');
    expect(typeof fill_sprite_array).toBe('function');
  });

  it('returns an array for null tile', async () => {
    const { fill_sprite_array } = await import('@/renderer/tilespec');
    const result = fill_sprite_array(0, null, null, null, null, null, false);
    expect(Array.isArray(result)).toBe(true);
  });
});
