/**
 * Unit tests for tileTerrainNear, invalidateTerrainNearCache, clearTerrainNearCache
 * in data/terrain.ts.
 *
 * tileTerrainNear is the function that provides the 8-neighbor terrain array
 * to fill_terrain_sprite_array — it is the integration point between the map
 * tile graph and terrain blending. Key behaviors tested:
 *
 * 1. Known neighbors return correct terrain (N/E/S/W/diagonal)
 * 2. TILE_UNKNOWN neighbor → current tile's terrain (fog fallback)
 * 3. Null neighbor tile (map edge) → current tile's terrain (edge fallback)
 * 4. Result is cached on first call; second call returns same array object
 * 5. invalidateTerrainNearCache removes cache for a specific tile
 * 6. clearTerrainNearCache removes all cached entries
 * 7. Observer-mode fog boundary: all 8 neighbors unknown → all 8 slots = current terrain
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Mocks must be declared before importing the module under test ─────────────

const MOCK_TILE_KNOWN_SEEN  = 2;
const MOCK_TILE_KNOWN_UNSEEN = 1;
const MOCK_TILE_UNKNOWN     = 0;

vi.mock('@/data/store', () => ({
  store: {
    terrains: {} as Record<number, unknown>,
  },
}));

vi.mock('@/data/tile', () => ({
  tileGetKnown: vi.fn(),
  TILE_UNKNOWN:      0,
  TILE_KNOWN_UNSEEN: 1,
  TILE_KNOWN_SEEN:   2,
}));

vi.mock('@/data/map', () => ({
  mapstep: vi.fn(),
  Direction: {},
}));

vi.mock('@/core/log', () => ({
  logError: vi.fn(),
}));

// ── Import after mocks ─────────────────────────────────────────────────────────
import { store } from '@/data/store';
import { tileGetKnown } from '@/data/tile';
import { mapstep } from '@/data/map';
import {
  tileTerrainNear,
  invalidateTerrainNearCache,
  clearTerrainNearCache,
} from '@/data/terrain';

// ── Terrain stubs ─────────────────────────────────────────────────────────────
const T_GRASSLAND = { id: 0, graphic_str: 'grassland' };
const T_FOREST    = { id: 1, graphic_str: 'forest'    };
const T_PLAINS    = { id: 2, graphic_str: 'plains'    };
const T_COAST     = { id: 3, graphic_str: 'coast'     };
const T_OCEAN     = { id: 4, graphic_str: 'floor'     };
const T_HILLS     = { id: 5, graphic_str: 'hills'     };

/** Make a minimal tile object. */
function makeTile(index: number, terrainId: number): any {
  return { index, terrain: terrainId, x: index % 10, y: Math.floor(index / 10) };
}

beforeEach(() => {
  clearTerrainNearCache();
  vi.clearAllMocks();

  // Default store terrains
  (store as any).terrains = {
    0: T_GRASSLAND,
    1: T_FOREST,
    2: T_PLAINS,
    3: T_COAST,
    4: T_OCEAN,
    5: T_HILLS,
  };
});

// ===========================================================================
// 1. Known neighbors return correct terrain for all 8 directions
// ===========================================================================

describe('tileTerrainNear — known neighbors', () => {
  it('returns known neighbor terrain for each direction (0–7)', () => {
    const centerTile = makeTile(10, 0); // grassland
    const neighborTiles = [
      makeTile(0, 1),  // dir 0 NW: forest
      makeTile(1, 2),  // dir 1 N:  plains
      makeTile(2, 3),  // dir 2 NE: coast
      makeTile(3, 4),  // dir 3 W:  ocean
      makeTile(4, 5),  // dir 4 E:  hills
      makeTile(5, 1),  // dir 5 SW: forest
      makeTile(6, 2),  // dir 6 S:  plains
      makeTile(7, 3),  // dir 7 SE: coast
    ];
    const expectedTerrains = [
      T_FOREST, T_PLAINS, T_COAST, T_OCEAN, T_HILLS, T_FOREST, T_PLAINS, T_COAST
    ];

    vi.mocked(mapstep).mockImplementation((_tile, dir) => neighborTiles[dir]);
    vi.mocked(tileGetKnown).mockReturnValue(MOCK_TILE_KNOWN_SEEN);

    const near = tileTerrainNear(centerTile);
    expect(near).toHaveLength(8);
    for (let dir = 0; dir < 8; dir++) {
      expect(near[dir]).toBe(expectedTerrains[dir]);
    }
  });

  it('returns MATCH_SAME-correct N (dir1) and S (dir6) cardinal neighbors', () => {
    const centerTile = makeTile(20, 0); // grassland
    const northTile = makeTile(10, 1); // forest
    const southTile = makeTile(30, 2); // plains

    vi.mocked(mapstep).mockImplementation((_tile, dir) => {
      if (dir === 1) return northTile; // N
      if (dir === 6) return southTile; // S
      return centerTile; // all others same terrain
    });
    vi.mocked(tileGetKnown).mockReturnValue(MOCK_TILE_KNOWN_SEEN);

    const near = tileTerrainNear(centerTile);
    expect(near[1]).toBe(T_FOREST);   // N
    expect(near[6]).toBe(T_PLAINS);   // S
    expect(near[4]).toBe(T_GRASSLAND); // E (same as center)
    expect(near[3]).toBe(T_GRASSLAND); // W (same as center)
  });
});

// ===========================================================================
// 2. TILE_UNKNOWN neighbor → falls back to current tile's terrain (fog boundary)
// ===========================================================================

describe('tileTerrainNear — fog fallback (TILE_UNKNOWN neighbor)', () => {
  it('unknown neighbor → current tile terrain for that direction', () => {
    const centerTile = makeTile(10, 0); // grassland
    const unknownNeighbor = makeTile(1, 0);

    vi.mocked(mapstep).mockReturnValue(unknownNeighbor);
    vi.mocked(tileGetKnown).mockReturnValue(MOCK_TILE_UNKNOWN); // all unknown

    const near = tileTerrainNear(centerTile);
    // Every direction should fall back to current tile's terrain (grassland)
    for (let dir = 0; dir < 8; dir++) {
      expect(near[dir]).toBe(T_GRASSLAND);
    }
  });

  it('mixed known/unknown: unknown dirs get center terrain, known dirs get neighbor terrain', () => {
    const centerTile = makeTile(10, 0); // grassland
    const northTile  = makeTile(1, 1);  // forest
    const unknownTile = makeTile(2, 0);

    vi.mocked(mapstep).mockImplementation((_tile, dir) => {
      return dir === 1 ? northTile : unknownTile; // only N is different
    });
    vi.mocked(tileGetKnown).mockImplementation((tile: any) => {
      return tile === northTile ? MOCK_TILE_KNOWN_SEEN : MOCK_TILE_UNKNOWN;
    });

    const near = tileTerrainNear(centerTile);
    expect(near[1]).toBe(T_FOREST);    // N: known → forest
    // All others: unknown → grassland (center terrain)
    for (const dir of [0, 2, 3, 4, 5, 6, 7]) {
      expect(near[dir]).toBe(T_GRASSLAND);
    }
  });

  it('observer-mode fog boundary: all 8 neighbors TILE_UNKNOWN → all 8 = center terrain', () => {
    // In observer mode, unexplored tiles have all neighbors unknown.
    // The blending algorithm must get a valid terrain (not undefined) to prevent
    // visual artifacts — it should see the center terrain on all sides.
    const coastTile = makeTile(10, 3); // coast
    const neighbor  = makeTile(0, 3);

    vi.mocked(mapstep).mockReturnValue(neighbor);
    vi.mocked(tileGetKnown).mockReturnValue(MOCK_TILE_UNKNOWN);

    const near = tileTerrainNear(coastTile);
    for (let dir = 0; dir < 8; dir++) {
      expect(near[dir]).toBe(T_COAST); // coast sees coast everywhere → MATCH_FULL all-same
    }
  });
});

// ===========================================================================
// 3. Null neighbor tile (map edge) → falls back to current tile's terrain
// ===========================================================================

describe('tileTerrainNear — map edge (null neighbor tile)', () => {
  it('null mapstep result → current tile terrain for that direction', () => {
    const edgeTile = makeTile(0, 0); // grassland at map edge

    vi.mocked(mapstep).mockReturnValue(null); // all neighbors are off-map
    // tileGetKnown won't be called for null tile

    const near = tileTerrainNear(edgeTile);
    for (let dir = 0; dir < 8; dir++) {
      expect(near[dir]).toBe(T_GRASSLAND);
    }
  });

  it('partial edge: some directions are null, others are valid', () => {
    const cornerTile = makeTile(0, 2); // plains at corner
    const validTile  = makeTile(1, 0); // grassland neighbor in one direction

    vi.mocked(mapstep).mockImplementation((_tile, dir) => {
      return dir === 4 ? validTile : null; // only E has a neighbor
    });
    vi.mocked(tileGetKnown).mockImplementation((tile: any) => {
      return tile === validTile ? MOCK_TILE_KNOWN_SEEN : MOCK_TILE_UNKNOWN;
    });

    const near = tileTerrainNear(cornerTile);
    expect(near[4]).toBe(T_GRASSLAND); // E: grassland
    for (const dir of [0, 1, 2, 3, 5, 6, 7]) {
      expect(near[dir]).toBe(T_PLAINS); // edges: plains (center terrain)
    }
  });
});

// ===========================================================================
// 4. Cache — second call returns cached object; no repeated mapstep calls
// ===========================================================================

describe('tileTerrainNear — per-tile caching', () => {
  it('returns same array object on repeated calls (cache hit)', () => {
    const tile = makeTile(5, 0);
    vi.mocked(mapstep).mockReturnValue(null);

    const first  = tileTerrainNear(tile);
    const second = tileTerrainNear(tile);
    expect(first).toBe(second); // exact same reference
  });

  it('mapstep is called only 8 times (first call) then 0 times (cached)', () => {
    const tile = makeTile(6, 0);
    vi.mocked(mapstep).mockReturnValue(null);

    tileTerrainNear(tile);
    expect(vi.mocked(mapstep).mock.calls).toHaveLength(8);
    vi.mocked(mapstep).mockClear();

    tileTerrainNear(tile); // cache hit
    expect(vi.mocked(mapstep).mock.calls).toHaveLength(0);
  });

  it('different tiles have independent cache entries', () => {
    const tile1 = makeTile(1, 0); // grassland
    const tile2 = makeTile(2, 1); // forest
    vi.mocked(mapstep).mockReturnValue(null);

    const near1 = tileTerrainNear(tile1);
    const near2 = tileTerrainNear(tile2);
    expect(near1).not.toBe(near2);
    expect(near1[0]).toBe(T_GRASSLAND);
    expect(near2[0]).toBe(T_FOREST);
  });
});

// ===========================================================================
// 5. invalidateTerrainNearCache — removes cache for one tile
// ===========================================================================

describe('invalidateTerrainNearCache', () => {
  it('forces recomputation on next call after invalidation', () => {
    const tile = makeTile(7, 0);
    vi.mocked(mapstep).mockReturnValue(null);

    const first = tileTerrainNear(tile);
    invalidateTerrainNearCache(7);
    vi.mocked(mapstep).mockClear();

    tileTerrainNear(tile); // re-computes
    expect(vi.mocked(mapstep).mock.calls).toHaveLength(8);
    // Result array is a new object
    const third = tileTerrainNear(tile);
    expect(first).not.toBe(third); // different reference after invalidation+recompute
  });

  it('only invalidates the specified tile (other tiles remain cached)', () => {
    const tile1 = makeTile(8, 0);
    const tile2 = makeTile(9, 1);
    vi.mocked(mapstep).mockReturnValue(null);

    const near1 = tileTerrainNear(tile1);
    tileTerrainNear(tile2);

    invalidateTerrainNearCache(8); // only tile1
    vi.mocked(mapstep).mockClear();

    tileTerrainNear(tile2); // should be cached → 0 calls
    expect(vi.mocked(mapstep).mock.calls).toHaveLength(0);

    tileTerrainNear(tile1); // recomputes → 8 calls
    expect(vi.mocked(mapstep).mock.calls).toHaveLength(8);
    // Near1 was cached before, the second call returns a new (recalculated) result
    expect(near1).toBe(near1); // Original reference unchanged
  });

  it('no-op for tile index that was never cached', () => {
    expect(() => invalidateTerrainNearCache(99999)).not.toThrow();
  });
});

// ===========================================================================
// 6. clearTerrainNearCache — removes all cached entries
// ===========================================================================

describe('clearTerrainNearCache', () => {
  it('forces recomputation for all tiles after clearing', () => {
    const tiles = [makeTile(10, 0), makeTile(11, 1), makeTile(12, 2)];
    vi.mocked(mapstep).mockReturnValue(null);

    // Populate cache for 3 tiles
    tiles.forEach(t => tileTerrainNear(t));

    clearTerrainNearCache();
    vi.mocked(mapstep).mockClear();

    // Each tile now requires 8 mapstep calls
    tiles.forEach(t => tileTerrainNear(t));
    expect(vi.mocked(mapstep).mock.calls).toHaveLength(24); // 3 tiles × 8 dirs
  });

  it('does not throw when cache is already empty', () => {
    expect(() => clearTerrainNearCache()).not.toThrow();
  });
});

// ===========================================================================
// 7. TILE_KNOWN_UNSEEN neighbor — terrain IS available, should still be used
// ===========================================================================

describe('tileTerrainNear — TILE_KNOWN_UNSEEN (seen but in fog now)', () => {
  it('TILE_KNOWN_UNSEEN neighbor returns its terrain (not center terrain)', () => {
    // A tile that was seen before but is now in fog — it still has terrain data
    // and is NOT TILE_UNKNOWN. tileTerrainNear should return its actual terrain.
    const centerTile = makeTile(20, 0); // grassland
    const unseenTile  = makeTile(21, 1); // forest (seen before, now dark)

    vi.mocked(mapstep).mockReturnValue(unseenTile);
    vi.mocked(tileGetKnown).mockReturnValue(MOCK_TILE_KNOWN_UNSEEN);

    const near = tileTerrainNear(centerTile);
    // TILE_KNOWN_UNSEEN !== TILE_UNKNOWN → should use neighbor's terrain
    for (let dir = 0; dir < 8; dir++) {
      expect(near[dir]).toBe(T_FOREST);
    }
  });
});
