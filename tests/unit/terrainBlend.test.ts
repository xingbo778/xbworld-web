/**
 * Unit tests for terrain blending — tilespecTerrain.ts
 *
 * Verifies:
 * 1. MATCH_SAME direction bug fix: forest/hills/mountains/jungle overlays now
 *    check the correct cardinal neighbors (N/E/S/W) instead of (NW/N/NE/W).
 * 2. MATCH_SAME tileset null-guard: no crash when store.tileset entry is missing.
 * 3. CELL_CORNER null-guard: no crash when fog-boundary neighbors are undefined.
 *
 * DIR8 layout: NW=0, N=1, NE=2, W=3, E=4, SW=5, S=6, SE=7
 * cardinal_tileset_dirs = [N=1, E=4, S=6, W=3]
 * bit i in tileno → direction name from cardinal_tileset_dirs[i]:
 *   bit 0 (i=0) → "n"  (checks N neighbor, tterrain_near[1])
 *   bit 1 (i=1) → "e"  (checks E neighbor, tterrain_near[4])
 *   bit 2 (i=2) → "s"  (checks S neighbor, tterrain_near[6])
 *   bit 3 (i=3) → "w"  (checks W neighbor, tterrain_near[3])
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ---------------------------------------------------------------------------
// Minimal store mock — must be in place before importing tilespecTerrain
// ---------------------------------------------------------------------------
vi.mock('@/data/store', () => ({
  store: {
    sprites: {} as Record<string, unknown>,
    tileset: {} as Record<string, number[]>,
    terrains: {},
  },
}));

// Mock map helpers — keep originals, just expose dirCCW/dirCW
vi.mock('@/data/map', async (importOriginal) => ({
  ...(await importOriginal() as object),
  dirCCW: (d: number) => (d + 7) % 8,
  dirCW:  (d: number) => (d + 1) % 8,
}));

// ---------------------------------------------------------------------------
// Import after mocks
// ---------------------------------------------------------------------------
import { store }                    from '@/data/store';
import { fill_terrain_sprite_array, _terrainBlendStats, resetTerrainBlendStats }
  from '@/renderer/tilespecTerrain';

// ---------------------------------------------------------------------------
// Terrain stubs
// ---------------------------------------------------------------------------
const T_FOREST   = { graphic_str: 'forest'    } as any;
const T_PLAINS   = { graphic_str: 'plains'    } as any;
const T_HILLS    = { graphic_str: 'hills'     } as any;
const T_MOUNTAINS= { graphic_str: 'mountains' } as any;
const T_JUNGLE   = { graphic_str: 'jungle'    } as any;
const T_GRASSLAND= { graphic_str: 'grassland' } as any;

// DIR8 index constants
const NW=0, N=1, NE=2, W=3, E=4, SW=5, S=6, SE=7;

/** Build an 8-element neighbor array. `fill` = default terrain for all dirs. */
function makeNear(fill: any, overrides: Partial<Record<number, any>> = {}): any[] {
  const near = Array(8).fill(fill);
  for (const [dir, t] of Object.entries(overrides)) {
    near[Number(dir)] = t;
  }
  return near;
}

/** Dummy tile. */
const fakeTile: any = { index: 0, x: 0, y: 0, terrain: 0 };

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------
function spriteKeyForLayer(sprites: { key?: string | null }[]): string | null | undefined {
  return sprites[0]?.key;
}

// ---------------------------------------------------------------------------
// Before each: reset stats, clear tileset mock
// ---------------------------------------------------------------------------
beforeEach(() => {
  resetTerrainBlendStats();
  (store as any).sprites = {};
  (store as any).tileset = {};
});

// ===========================================================================
// 1. MATCH_SAME direction fix
// ===========================================================================

describe('MATCH_SAME overlay — direction indexing fix', () => {
  // All neighbors are plains (not forest) → tileno = 0000 → "n0e0s0w0"
  it('all non-forest neighbors → sprite key ends with n0e0s0w0', () => {
    const near = makeNear(T_PLAINS);
    const sprites = fill_terrain_sprite_array(1, fakeTile, T_FOREST, near);
    expect(sprites).toHaveLength(1);
    expect(sprites[0].key).toBe('t.l1.forest_n0e0s0w0');
  });

  // Only the North neighbor (tterrain_near[1]) is forest → bit 0 → "n1e0s0w0"
  it('North forest neighbor → sprite key n1e0s0w0', () => {
    const near = makeNear(T_PLAINS, { [N]: T_FOREST });
    const sprites = fill_terrain_sprite_array(1, fakeTile, T_FOREST, near);
    expect(sprites[0].key).toBe('t.l1.forest_n1e0s0w0');
  });

  // Only East neighbor (tterrain_near[4]) → bit 1 → "n0e1s0w0"
  it('East forest neighbor → sprite key n0e1s0w0', () => {
    const near = makeNear(T_PLAINS, { [E]: T_FOREST });
    const sprites = fill_terrain_sprite_array(1, fakeTile, T_FOREST, near);
    expect(sprites[0].key).toBe('t.l1.forest_n0e1s0w0');
  });

  // Only South neighbor (tterrain_near[6]) → bit 2 → "n0e0s1w0"
  it('South forest neighbor → sprite key n0e0s1w0', () => {
    const near = makeNear(T_PLAINS, { [S]: T_FOREST });
    const sprites = fill_terrain_sprite_array(1, fakeTile, T_FOREST, near);
    expect(sprites[0].key).toBe('t.l1.forest_n0e0s1w0');
  });

  // Only West neighbor (tterrain_near[3]) → bit 3 → "n0e0s0w1"
  it('West forest neighbor → sprite key n0e0s0w1', () => {
    const near = makeNear(T_PLAINS, { [W]: T_FOREST });
    const sprites = fill_terrain_sprite_array(1, fakeTile, T_FOREST, near);
    expect(sprites[0].key).toBe('t.l1.forest_n0e0s0w1');
  });

  // All cardinal neighbors are forest → "n1e1s1w1"
  it('All cardinal forest neighbors → sprite key n1e1s1w1', () => {
    const near = makeNear(T_PLAINS, { [N]: T_FOREST, [E]: T_FOREST, [S]: T_FOREST, [W]: T_FOREST });
    const sprites = fill_terrain_sprite_array(1, fakeTile, T_FOREST, near);
    expect(sprites[0].key).toBe('t.l1.forest_n1e1s1w1');
  });

  // Diagonal-only neighbors (NW, NE, SW, SE) should NOT set any bits → "n0e0s0w0"
  it('Diagonal-only forest neighbors are ignored → n0e0s0w0', () => {
    const near = makeNear(T_PLAINS, { [NW]: T_FOREST, [NE]: T_FOREST, [SW]: T_FOREST, [SE]: T_FOREST });
    const sprites = fill_terrain_sprite_array(1, fakeTile, T_FOREST, near);
    expect(sprites[0].key).toBe('t.l1.forest_n0e0s0w0');
  });

  // Regression: OLD bug would check tterrain_near[0]=NW, tterrain_near[1]=N etc.
  // With NW=forest but N=plains, old code set bit 0 → "n1e0s0w0"
  // New code: bit 0 = N neighbor = plains → "n0e0s0w0"
  it('REGRESSION: NW forest should NOT affect north bit', () => {
    const near = makeNear(T_PLAINS, { [NW]: T_FOREST });
    const sprites = fill_terrain_sprite_array(1, fakeTile, T_FOREST, near);
    expect(sprites[0].key).toBe('t.l1.forest_n0e0s0w0'); // NW ignored
  });

  // hills MATCH_SAME: layer 1
  it('Hills: East hills neighbor → n0e1s0w0', () => {
    const near = makeNear(T_PLAINS, { [E]: T_HILLS });
    const sprites = fill_terrain_sprite_array(1, fakeTile, T_HILLS, near);
    expect(sprites[0].key).toBe('t.l1.hills_n0e1s0w0');
  });

  // mountains MATCH_SAME: layer 1
  it('Mountains: South mountains neighbor → n0e0s1w0', () => {
    const near = makeNear(T_PLAINS, { [S]: T_MOUNTAINS });
    const sprites = fill_terrain_sprite_array(1, fakeTile, T_MOUNTAINS, near);
    expect(sprites[0].key).toBe('t.l1.mountains_n0e0s1w0');
  });

  // jungle MATCH_SAME: layer 1 — match_type = "jungle"
  it('Jungle: West jungle neighbor → n0e0s0w1', () => {
    const near = makeNear(T_GRASSLAND, { [W]: T_JUNGLE });
    const sprites = fill_terrain_sprite_array(1, fakeTile, T_JUNGLE, near);
    expect(sprites[0].key).toBe('t.l1.jungle_n0e0s0w1');
  });
});

// ===========================================================================
// 2. MATCH_SAME tileset null-guard
// ===========================================================================

describe('MATCH_SAME — null guard for missing tileset entry', () => {
  it('returns sprite with y=0 when tileset entry is absent (no crash)', () => {
    // store.tileset is empty — the key will be missing
    (store as any).tileset = {};
    const near = makeNear(T_PLAINS, { [N]: T_FOREST });
    let sprites: any[] = [];
    expect(() => {
      sprites = fill_terrain_sprite_array(1, fakeTile, T_FOREST, near);
    }).not.toThrow();
    expect(sprites[0].key).toBe('t.l1.forest_n1e0s0w0');
    expect(sprites[0].offset_y).toBe(0); // fallback when tileset entry missing
  });

  it('records a miss in stats when tileset entry absent', () => {
    (store as any).tileset = {};
    const near = makeNear(T_PLAINS);
    fill_terrain_sprite_array(1, fakeTile, T_FOREST, near);
    expect(_terrainBlendStats.matchSameKeysMissing).toBe(1);
    expect(_terrainBlendStats.matchSameKeysFound).toBe(0);
  });

  it('records a hit in stats when tileset entry present', () => {
    // Add a fake tileset entry with [x, y, w, h=20]
    (store as any).tileset = { 't.l1.forest_n0e0s0w0': [0, 0, 64, 20] };
    const near = makeNear(T_PLAINS);
    fill_terrain_sprite_array(1, fakeTile, T_FOREST, near);
    expect(_terrainBlendStats.matchSameKeysFound).toBe(1);
    expect(_terrainBlendStats.matchSameKeysMissing).toBe(0);
  });

  it('correct y-offset when tileset entry present', () => {
    // tileset_tile_height = 48, entry[3] = 20 → y = 48 - 20 = 28
    (store as any).tileset = { 't.l1.hills_n0e0s0w0': [0, 0, 64, 20] };
    const near = makeNear(T_PLAINS);
    const sprites = fill_terrain_sprite_array(1, fakeTile, T_HILLS, near);
    expect(sprites[0].offset_y).toBe(28); // 48 - 20
  });
});

// ===========================================================================
// 3. CELL_CORNER null-guard (fog boundary tiles)
// ===========================================================================

describe('CELL_CORNER — null neighbor guard', () => {
  it('does not crash when neighbor terrains are undefined (fog boundary)', () => {
    // Use coast which uses CELL_CORNER + MATCH_FULL
    const T_COAST = { graphic_str: 'coast' } as any;
    // Some neighbors undefined (as happens at fog boundary)
    const near = makeNear(T_COAST);
    near[NW] = undefined;
    near[N]  = undefined;
    near[NE] = undefined;

    let sprites: any[] = [];
    expect(() => {
      sprites = fill_terrain_sprite_array(0, fakeTile, T_COAST, near);
    }).not.toThrow();
    // Should still return corner sprites (4 entries)
    expect(sprites.length).toBe(4);
  });

  it('increments cellCornerNullNeighbors stat for undefined neighbors', () => {
    const T_COAST = { graphic_str: 'coast' } as any;
    const near = makeNear(T_COAST);
    near[N] = undefined; // affects corners that include the N neighbor
    fill_terrain_sprite_array(0, fakeTile, T_COAST, near);
    expect(_terrainBlendStats.cellCornerNullNeighbors).toBeGreaterThan(0);
  });
});

// ===========================================================================
// 4. Stats instrumentation
// ===========================================================================

describe('_terrainBlendStats instrumentation', () => {
  it('resetTerrainBlendStats clears all counters', () => {
    const near = makeNear(T_PLAINS);
    fill_terrain_sprite_array(1, fakeTile, T_FOREST, near); // increments matchSameRequests
    expect(_terrainBlendStats.matchSameRequests).toBeGreaterThan(0);
    resetTerrainBlendStats();
    expect(_terrainBlendStats.matchSameRequests).toBe(0);
    expect(_terrainBlendStats.matchSameKeysFound).toBe(0);
    expect(_terrainBlendStats.matchSameKeysMissing).toBe(0);
  });

  it('matchSameRequests increments once per MATCH_SAME call', () => {
    const near = makeNear(T_PLAINS);
    fill_terrain_sprite_array(1, fakeTile, T_FOREST, near);
    fill_terrain_sprite_array(1, fakeTile, T_HILLS, near);
    fill_terrain_sprite_array(1, fakeTile, T_MOUNTAINS, near);
    expect(_terrainBlendStats.matchSameRequests).toBe(3);
  });

  it('resetTerrainBlendStats clears dither transition counters', () => {
    (store as any).tileset = { '0grassland_forest': [0, 0, 64, 64] };
    const near = makeNear(T_GRASSLAND, { [N]: T_FOREST });
    fill_terrain_sprite_array(0, fakeTile, T_GRASSLAND, near);
    expect(_terrainBlendStats.ditherTransitionFound).toBeGreaterThan(0);
    resetTerrainBlendStats();
    expect(_terrainBlendStats.ditherTransitionFound).toBe(0);
    expect(_terrainBlendStats.ditherTransitionFallback).toBe(0);
  });
});

// ===========================================================================
// 5. MATCH_NONE dither — direct-neighbor transition fix (A2)
//
// BEFORE fix: the dither key was built using the neighbor's name only when
//   near_dlp.dither == true. For MATCH_SAME terrains (forest, hills, etc.)
//   dither is false, so terrain_near was set to the *current* terrain name,
//   producing e.g. "0grassland_grassland" even next to forest — a hard edge.
//
// AFTER fix: we probe store.tileset for the direct key first. The tileset
//   supplies smooth transition art for all 9×9 combinations (e.g.
//   "0grassland_forest", "0plains_mountains"), so the direct hit rate is
//   ~100% for all standard terrain pairings, eliminating the hard edges.
// ===========================================================================

describe('MATCH_NONE dither — direct-neighbor transition fix', () => {
  // DIR4_TO_DIR8 = [N=1, S=6, E=4, W=3]
  // i=0 → DIR8_NORTH (near[1]), dither_offset_x[0]=48, dither_offset_y[0]=0
  // i=1 → DIR8_SOUTH (near[6]), dither_offset_x[1]=0,  dither_offset_y[1]=24
  // i=2 → DIR8_EAST  (near[4]), dither_offset_x[2]=48, dither_offset_y[2]=24
  // i=3 → DIR8_WEST  (near[3]), dither_offset_x[3]=0,  dither_offset_y[3]=0

  it('BEFORE/AFTER: grassland→forest uses direct transition (not hard-edge fallback)', () => {
    // Old code would produce '0grassland_grassland' (no blending).
    // New code produces '0grassland_forest' (smooth edge).
    (store as any).tileset = { '0grassland_forest': [0, 0, 64, 64] };
    const near = makeNear(T_GRASSLAND, { [N]: T_FOREST });
    const sprites = fill_terrain_sprite_array(0, fakeTile, T_GRASSLAND, near);
    expect(sprites[0].key).toBe('0grassland_forest');
  });

  it('BEFORE/AFTER: plains→mountains uses direct transition', () => {
    (store as any).tileset = { '0plains_mountains': [0, 0, 64, 64] };
    const near = makeNear(T_PLAINS, { [N]: T_MOUNTAINS });
    const sprites = fill_terrain_sprite_array(0, fakeTile, T_PLAINS, near);
    expect(sprites[0].key).toBe('0plains_mountains');
  });

  it('BEFORE/AFTER: grassland→hills uses direct transition', () => {
    (store as any).tileset = { '2grassland_hills': [0, 0, 64, 64] };
    // E neighbor is hills → i=2 (DIR8_EAST = near[4])
    const near = makeNear(T_GRASSLAND, { [E]: T_HILLS });
    const sprites = fill_terrain_sprite_array(0, fakeTile, T_GRASSLAND, near);
    const eastSprite = sprites.find(s => s.offset_x === 48 && s.offset_y === 24);
    expect(eastSprite?.key).toBe('2grassland_hills');
  });

  it('falls back to same-terrain key when direct transition absent from tileset', () => {
    (store as any).tileset = {}; // no transition sprites loaded
    const near = makeNear(T_GRASSLAND, { [N]: T_FOREST });
    const sprites = fill_terrain_sprite_array(0, fakeTile, T_GRASSLAND, near);
    expect(sprites[0].key).toBe('0grassland_grassland');
  });

  it('same-terrain neighbor: direct_key === fallback_key, treated as found', () => {
    (store as any).tileset = { '0grassland_grassland': [0, 0, 64, 64] };
    const near = makeNear(T_GRASSLAND);
    const sprites = fill_terrain_sprite_array(0, fakeTile, T_GRASSLAND, near);
    expect(sprites[0].key).toBe('0grassland_grassland');
  });

  it('counts ditherTransitionFound for each direct-key hit', () => {
    // N=forest (i=0 → key "0grassland_forest"), E=hills (i=2 → key "2grassland_hills")
    (store as any).tileset = {
      '0grassland_forest': [0, 0, 64, 64],
      '2grassland_hills':  [0, 0, 64, 64],
    };
    const near = makeNear(T_GRASSLAND, { [N]: T_FOREST, [E]: T_HILLS });
    fill_terrain_sprite_array(0, fakeTile, T_GRASSLAND, near);
    expect(_terrainBlendStats.ditherTransitionFound).toBeGreaterThanOrEqual(2);
  });

  it('counts ditherTransitionFallback when direct key is absent', () => {
    (store as any).tileset = {}; // nothing
    const near = makeNear(T_GRASSLAND, { [N]: T_FOREST });
    fill_terrain_sprite_array(0, fakeTile, T_GRASSLAND, near);
    // N→forest: direct "0grassland_forest" missing → fallback
    expect(_terrainBlendStats.ditherTransitionFallback).toBeGreaterThanOrEqual(1);
  });

  it('south neighbor uses i=1 key prefix', () => {
    (store as any).tileset = { '1plains_jungle': [0, 0, 64, 64] };
    // S neighbor is jungle → i=1 (DIR8_SOUTH = near[6])
    const near = makeNear(T_PLAINS, { [S]: T_JUNGLE });
    const sprites = fill_terrain_sprite_array(0, fakeTile, T_PLAINS, near);
    const southSprite = sprites.find(s => s.offset_x === 0 && s.offset_y === 24);
    expect(southSprite?.key).toBe('1plains_jungle');
  });

  it('west neighbor uses i=3 key prefix', () => {
    (store as any).tileset = { '3grassland_mountains': [0, 0, 64, 64] };
    // W neighbor is mountains → i=3 (DIR8_WEST = near[3])
    const near = makeNear(T_GRASSLAND, { [W]: T_MOUNTAINS });
    const sprites = fill_terrain_sprite_array(0, fakeTile, T_GRASSLAND, near);
    const westSprite = sprites.find(s => s.offset_x === 0 && s.offset_y === 0);
    expect(westSprite?.key).toBe('3grassland_mountains');
  });
});
