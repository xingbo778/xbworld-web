/**
 * Unit tests for data/cityTileMap.ts geometry functions.
 */
import { describe, it, expect } from 'vitest';

describe('dxyToCenterIndex', () => {
  it('is exported as a function', async () => {
    const { dxyToCenterIndex } = await import('@/data/cityTileMap');
    expect(typeof dxyToCenterIndex).toBe('function');
  });

  it('center (0,0) with radius 1 maps to index 4', async () => {
    // r=1: grid is 3x3 (indices 0..8), center = (0+1)*(2*1+1)+(0+1) = 3+1 = 4
    const { dxyToCenterIndex } = await import('@/data/cityTileMap');
    expect(dxyToCenterIndex(0, 0, 1)).toBe(4);
  });

  it('(-1,-1) with radius 1 maps to index 0', async () => {
    const { dxyToCenterIndex } = await import('@/data/cityTileMap');
    expect(dxyToCenterIndex(-1, -1, 1)).toBe(0);
  });

  it('(1,1) with radius 1 maps to index 8', async () => {
    const { dxyToCenterIndex } = await import('@/data/cityTileMap');
    expect(dxyToCenterIndex(1, 1, 1)).toBe(8);
  });

  it('center (0,0) with radius 2 maps to index 12', async () => {
    // r=2: grid is 5x5 (indices 0..24), center = (0+2)*(2*2+1)+(0+2) = 10+2 = 12
    const { dxyToCenterIndex } = await import('@/data/cityTileMap');
    expect(dxyToCenterIndex(0, 0, 2)).toBe(12);
  });
});

describe('buildCityTileMap', () => {
  it('is exported as a function', async () => {
    const { buildCityTileMap } = await import('@/data/cityTileMap');
    expect(typeof buildCityTileMap).toBe('function');
  });

  it('does not throw for radiusSq=0', async () => {
    const { buildCityTileMap } = await import('@/data/cityTileMap');
    expect(() => buildCityTileMap(0)).not.toThrow();
  });

  it('does not throw for radiusSq=9 (standard city radius)', async () => {
    const { buildCityTileMap } = await import('@/data/cityTileMap');
    expect(() => buildCityTileMap(9)).not.toThrow();
  });
});

// ── getCityDxyToIndex ─────────────────────────────────────────────────────

describe('getCityDxyToIndex', () => {
  it('is exported as a function', async () => {
    const { getCityDxyToIndex } = await import('@/data/cityTileMap');
    expect(typeof getCityDxyToIndex).toBe('function');
  });
});

// ── buildCityTileMapWithLimits ────────────────────────────────────────────

describe('buildCityTileMapWithLimits', () => {
  it('is exported as a function', async () => {
    const { buildCityTileMapWithLimits } = await import('@/data/cityTileMap');
    expect(typeof buildCityTileMapWithLimits).toBe('function');
  });

  it('does not throw for typical parameters', async () => {
    const { buildCityTileMapWithLimits, buildCityTileMap } = await import('@/data/cityTileMap');
    // First build the base tile map
    buildCityTileMap(9);
    expect(() => buildCityTileMapWithLimits(-2, 2, -2, 2)).not.toThrow();
  });
});
