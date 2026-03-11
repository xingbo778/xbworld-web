/**
 * Unit tests for renderer/mapviewCommon.ts and renderer/tilesetConfig.ts constants.
 */
import { describe, it, expect } from 'vitest';

// ── mapviewCommon ─────────────────────────────────────────────────────────

describe('mapviewCommon constants', () => {
  it('MAPVIEW_REFRESH_INTERVAL is a positive number', async () => {
    const { MAPVIEW_REFRESH_INTERVAL } = await import('@/renderer/mapviewCommon');
    expect(typeof MAPVIEW_REFRESH_INTERVAL).toBe('number');
    expect(MAPVIEW_REFRESH_INTERVAL).toBeGreaterThan(0);
  });

  it('DIRTY_FULL_THRESHOLD is a positive number', async () => {
    const { DIRTY_FULL_THRESHOLD } = await import('@/renderer/mapviewCommon');
    expect(typeof DIRTY_FULL_THRESHOLD).toBe('number');
    expect(DIRTY_FULL_THRESHOLD).toBeGreaterThan(0);
  });
});

describe('mapviewCommon functions', () => {
  it('mark_tile_dirty is exported as a function', async () => {
    const { mark_tile_dirty } = await import('@/renderer/mapviewCommon');
    expect(typeof mark_tile_dirty).toBe('function');
  });

  it('mark_tile_dirty does not throw', async () => {
    const { mark_tile_dirty } = await import('@/renderer/mapviewCommon');
    expect(() => mark_tile_dirty(0)).not.toThrow();
  });

  it('mark_all_dirty is exported as a function', async () => {
    const { mark_all_dirty } = await import('@/renderer/mapviewCommon');
    expect(typeof mark_all_dirty).toBe('function');
  });

  it('mark_all_dirty does not throw', async () => {
    const { mark_all_dirty } = await import('@/renderer/mapviewCommon');
    expect(() => mark_all_dirty()).not.toThrow();
  });

  it('clear_dirty does not throw', async () => {
    const { clear_dirty } = await import('@/renderer/mapviewCommon');
    expect(() => clear_dirty()).not.toThrow();
  });

  it('mapdeco_init does not throw', async () => {
    const { mapdeco_init } = await import('@/renderer/mapviewCommon');
    expect(() => mapdeco_init()).not.toThrow();
  });
});

// ── tilesetConfig ─────────────────────────────────────────────────────────

describe('tilesetConfig constants', () => {
  it('tileset_tile_width is a positive number', async () => {
    const { tileset_tile_width } = await import('@/renderer/tilesetConfig');
    expect(typeof tileset_tile_width).toBe('number');
    expect(tileset_tile_width).toBeGreaterThan(0);
  });

  it('tileset_tile_height is a positive number', async () => {
    const { tileset_tile_height } = await import('@/renderer/tilesetConfig');
    expect(typeof tileset_tile_height).toBe('number');
    expect(tileset_tile_height).toBeGreaterThan(0);
  });

  it('tileset_name is a string', async () => {
    const { tileset_name } = await import('@/renderer/tilesetConfig');
    expect(typeof tileset_name).toBe('string');
    expect(tileset_name.length).toBeGreaterThan(0);
  });

  it('normal_tile_width matches tileset_tile_width', async () => {
    const { tileset_tile_width, normal_tile_width } = await import('@/renderer/tilesetConfig');
    expect(normal_tile_width).toBe(tileset_tile_width);
  });
});
