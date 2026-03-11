/**
 * Unit tests for renderer/tilespecLayers.ts and renderer/tilespecTerrain.ts
 */
import { describe, it, expect } from 'vitest';

// ── tilespecLayers ────────────────────────────────────────────────────────

describe('fill_fog_sprite_array', () => {
  it('is exported as a function', async () => {
    const { fill_fog_sprite_array } = await import('@/renderer/tilespecLayers');
    expect(typeof fill_fog_sprite_array).toBe('function');
  });

  it('returns an array for null tile', async () => {
    const { fill_fog_sprite_array } = await import('@/renderer/tilespecLayers');
    const result = fill_fog_sprite_array(null, null, null);
    expect(Array.isArray(result)).toBe(true);
  });
});

describe('get_select_sprite', () => {
  it('is exported as a function', async () => {
    const { get_select_sprite } = await import('@/renderer/tilespecLayers');
    expect(typeof get_select_sprite).toBe('function');
  });

  it('does not throw', async () => {
    const { get_select_sprite } = await import('@/renderer/tilespecLayers');
    expect(() => get_select_sprite()).not.toThrow();
  });
});

describe('get_tile_specials_sprite', () => {
  it('is exported as a function', async () => {
    const { get_tile_specials_sprite } = await import('@/renderer/tilespecLayers');
    expect(typeof get_tile_specials_sprite).toBe('function');
  });
});

// ── tilespecTerrain ───────────────────────────────────────────────────────

describe('_terrainBlendStats', () => {
  it('is exported as an object', async () => {
    const { _terrainBlendStats } = await import('@/renderer/tilespecTerrain');
    expect(typeof _terrainBlendStats).toBe('object');
    expect(_terrainBlendStats).not.toBeNull();
  });
});

describe('resetTerrainBlendStats', () => {
  it('is exported as a function', async () => {
    const { resetTerrainBlendStats } = await import('@/renderer/tilespecTerrain');
    expect(typeof resetTerrainBlendStats).toBe('function');
  });

  it('does not throw', async () => {
    const { resetTerrainBlendStats } = await import('@/renderer/tilespecTerrain');
    expect(() => resetTerrainBlendStats()).not.toThrow();
  });
});

describe('fill_terrain_sprite_layer', () => {
  it('is exported as a function', async () => {
    const { fill_terrain_sprite_layer } = await import('@/renderer/tilespecTerrain');
    expect(typeof fill_terrain_sprite_layer).toBe('function');
  });

  it('returns an array for a minimal tile', async () => {
    const { fill_terrain_sprite_layer } = await import('@/renderer/tilespecTerrain');
    const fakeTile = { tile: 0, terrain: 0, extras: { isSet: () => false }, known: 2 } as never;
    const result = fill_terrain_sprite_layer(0, fakeTile, undefined, []);
    expect(Array.isArray(result)).toBe(true);
  });
});
