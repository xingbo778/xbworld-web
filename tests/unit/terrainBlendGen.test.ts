/**
 * Unit tests for A2 terrain blend generation.
 *
 * Tests the generateBlendSprite() function and blendStats counters:
 *   - returns null when source or neighbor sprite is missing
 *   - generates a canvas and stores it under the expected cache key
 *   - returns the cache key on success
 *   - returns the same key on subsequent calls (cache hit)
 *   - increments blendStats.generated on first call
 *   - increments blendStats.cacheHits on cache hits
 *   - clearBlendCache() removes all __blend_ keys from store.sprites
 *   - resetBlendStats() zeros counters
 *   - gradient direction constant coverage (all 4 cardinal indices)
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { store } from '@/data/store';

// ---------------------------------------------------------------------------
// Canvas mock helpers — jsdom provides HTMLCanvasElement but getContext('2d')
// returns null without a native implementation. We mock it per-test.
// ---------------------------------------------------------------------------

interface MockCtx {
  drawImage: ReturnType<typeof vi.fn>;
  fillRect: ReturnType<typeof vi.fn>;
  save: ReturnType<typeof vi.fn>;
  restore: ReturnType<typeof vi.fn>;
  createLinearGradient: ReturnType<typeof vi.fn>;
  fillStyle: string;
  globalCompositeOperation: string;
}

function makeMockCtx(): MockCtx {
  return {
    drawImage: vi.fn(),
    fillRect: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    createLinearGradient: vi.fn().mockReturnValue({
      addColorStop: vi.fn(),
    }),
    fillStyle: '',
    globalCompositeOperation: 'source-over',
  };
}

function makeMockCanvas(w: number, h: number, ctx: MockCtx | null = makeMockCtx()) {
  return {
    width: w,
    height: h,
    getContext: vi.fn().mockReturnValue(ctx),
  } as unknown as HTMLCanvasElement;
}

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

// We need to intercept document.createElement('canvas') to return mock canvases.
// The blend generator calls it twice (main + tmp).
let canvasCallCount = 0;
let mainCtxMock: MockCtx;
let tmpCtxMock: MockCtx;

function patchCreateElement(mainCtx: MockCtx | null = makeMockCtx(), tmpCtx: MockCtx | null = makeMockCtx()) {
  canvasCallCount = 0;
  mainCtxMock = mainCtx!;
  tmpCtxMock = tmpCtx!;

  vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
    if (tag === 'canvas') {
      canvasCallCount++;
      if (canvasCallCount === 1) return makeMockCanvas(48, 24, mainCtx);
      return makeMockCanvas(48, 24, tmpCtx);
    }
    // Delegate everything else to the real implementation
    return document.createElement.call(document, tag);
  });
}

function makeImageBitmap(w: number, h: number): ImageBitmap {
  return { width: w, height: h, close: vi.fn() } as unknown as ImageBitmap;
}

beforeEach(() => {
  // Clear any previously generated blend sprites from the store
  const sprites = store.sprites as Record<string, HTMLCanvasElement | ImageBitmap>;
  for (const key of Object.keys(sprites)) {
    if (key.startsWith('__blend_')) delete sprites[key];
  }
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// Tests: missing sprites
// ---------------------------------------------------------------------------

describe('generateBlendSprite — missing sprites', () => {
  it('returns null when source sprite is missing', async () => {
    const { generateBlendSprite, resetBlendStats } = await import('@/renderer/terrainBlendGen');
    resetBlendStats();
    const sprites = store.sprites as Record<string, HTMLCanvasElement | ImageBitmap>;
    sprites['nbr_key'] = makeImageBitmap(48, 24);
    delete (sprites as Record<string, unknown>)['src_key'];

    const result = generateBlendSprite(0, 'src_key', 'nbr_key');
    expect(result).toBeNull();

    delete (sprites as Record<string, unknown>)['nbr_key'];
  });

  it('returns null when neighbor sprite is missing', async () => {
    const { generateBlendSprite, resetBlendStats } = await import('@/renderer/terrainBlendGen');
    resetBlendStats();
    const sprites = store.sprites as Record<string, HTMLCanvasElement | ImageBitmap>;
    sprites['src_key2'] = makeImageBitmap(48, 24);
    delete (sprites as Record<string, unknown>)['nbr_key2'];

    const result = generateBlendSprite(0, 'src_key2', 'nbr_key2');
    expect(result).toBeNull();

    delete (sprites as Record<string, unknown>)['src_key2'];
  });

  it('returns null when both sprites are missing', async () => {
    const { generateBlendSprite } = await import('@/renderer/terrainBlendGen');
    const result = generateBlendSprite(0, 'missing_a', 'missing_b');
    expect(result).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Tests: successful generation
// ---------------------------------------------------------------------------

describe('generateBlendSprite — successful generation', () => {
  it('generates a canvas stored under the expected cache key', async () => {
    const { generateBlendSprite, resetBlendStats } = await import('@/renderer/terrainBlendGen');
    resetBlendStats();
    patchCreateElement();

    const sprites = store.sprites as Record<string, HTMLCanvasElement | ImageBitmap>;
    sprites['0grassland_grassland'] = makeImageBitmap(48, 24);
    sprites['0forest_forest'] = makeImageBitmap(48, 24);

    const result = generateBlendSprite(0, '0grassland_grassland', '0forest_forest');
    const expectedKey = '__blend_0_0grassland_grassland_0forest_forest';

    expect(result).toBe(expectedKey);
    expect(sprites[expectedKey]).toBeDefined();

    delete (sprites as Record<string, unknown>)['0grassland_grassland'];
    delete (sprites as Record<string, unknown>)['0forest_forest'];
    delete (sprites as Record<string, unknown>)[expectedKey];
  });

  it('increments blendStats.generated on first call', async () => {
    const { generateBlendSprite, blendStats, resetBlendStats } = await import('@/renderer/terrainBlendGen');
    resetBlendStats();
    patchCreateElement();

    const sprites = store.sprites as Record<string, HTMLCanvasElement | ImageBitmap>;
    sprites['0plains_plains'] = makeImageBitmap(48, 24);
    sprites['0desert_desert'] = makeImageBitmap(48, 24);

    generateBlendSprite(1, '0plains_plains', '0desert_desert');
    expect(blendStats.generated).toBe(1);
    expect(blendStats.cacheHits).toBe(0);

    const blendKey = '__blend_1_0plains_plains_0desert_desert';
    delete (sprites as Record<string, unknown>)['0plains_plains'];
    delete (sprites as Record<string, unknown>)['0desert_desert'];
    delete (sprites as Record<string, unknown>)[blendKey];
  });

  it('returns the same key on second call (cache hit)', async () => {
    const { generateBlendSprite, blendStats, resetBlendStats } = await import('@/renderer/terrainBlendGen');
    resetBlendStats();
    patchCreateElement();

    const sprites = store.sprites as Record<string, HTMLCanvasElement | ImageBitmap>;
    sprites['0hills_hills'] = makeImageBitmap(48, 24);
    sprites['0mountains_mountains'] = makeImageBitmap(48, 24);

    const key1 = generateBlendSprite(2, '0hills_hills', '0mountains_mountains');
    vi.restoreAllMocks(); // stop createElement mock for second call
    const key2 = generateBlendSprite(2, '0hills_hills', '0mountains_mountains');

    expect(key1).toBe(key2);
    expect(blendStats.generated).toBe(1);
    expect(blendStats.cacheHits).toBe(1);

    const blendKey = '__blend_2_0hills_hills_0mountains_mountains';
    delete (sprites as Record<string, unknown>)['0hills_hills'];
    delete (sprites as Record<string, unknown>)['0mountains_mountains'];
    delete (sprites as Record<string, unknown>)[blendKey];
  });

  it('uses both canvas 2D drawing calls (drawImage on main and tmp)', async () => {
    const { generateBlendSprite, resetBlendStats } = await import('@/renderer/terrainBlendGen');
    resetBlendStats();
    const mainCtx = makeMockCtx();
    const tmpCtx = makeMockCtx();
    patchCreateElement(mainCtx, tmpCtx);

    const sprites = store.sprites as Record<string, HTMLCanvasElement | ImageBitmap>;
    sprites['0tundra_tundra'] = makeImageBitmap(48, 24);
    sprites['0swamp_swamp'] = makeImageBitmap(48, 24);

    generateBlendSprite(3, '0tundra_tundra', '0swamp_swamp');

    // Main canvas draws: (1) source terrain, (2) masked tmp canvas
    expect(mainCtx.drawImage).toHaveBeenCalledTimes(2);
    // Tmp canvas draws: (1) neighbor terrain; gradient mask applied via fillRect
    expect(tmpCtx.drawImage).toHaveBeenCalledTimes(1);
    expect(tmpCtx.fillRect).toHaveBeenCalledTimes(1);
    // Gradient mask uses destination-in compositing
    expect(tmpCtx.globalCompositeOperation).toBe('destination-in');

    const blendKey = '__blend_3_0tundra_tundra_0swamp_swamp';
    delete (sprites as Record<string, unknown>)['0tundra_tundra'];
    delete (sprites as Record<string, unknown>)['0swamp_swamp'];
    delete (sprites as Record<string, unknown>)[blendKey];
  });

  it('returns null when canvas context is unavailable', async () => {
    const { generateBlendSprite, resetBlendStats } = await import('@/renderer/terrainBlendGen');
    resetBlendStats();
    patchCreateElement(null, null); // null ctx = unavailable

    const sprites = store.sprites as Record<string, HTMLCanvasElement | ImageBitmap>;
    sprites['0ocean_ocean'] = makeImageBitmap(48, 24);
    sprites['0coast_coast'] = makeImageBitmap(48, 24);

    const result = generateBlendSprite(0, '0ocean_ocean', '0coast_coast');
    expect(result).toBeNull();

    delete (sprites as Record<string, unknown>)['0ocean_ocean'];
    delete (sprites as Record<string, unknown>)['0coast_coast'];
  });
});

// ---------------------------------------------------------------------------
// Tests: all 4 cardinal directions produce distinct cache keys
// ---------------------------------------------------------------------------

describe('generateBlendSprite — cardinal directions', () => {
  it('produces distinct keys for each of the 4 cardinal directions', async () => {
    const { generateBlendSprite, resetBlendStats } = await import('@/renderer/terrainBlendGen');
    resetBlendStats();

    const sprites = store.sprites as Record<string, HTMLCanvasElement | ImageBitmap>;
    sprites['0src_src'] = makeImageBitmap(48, 24);
    sprites['0nbr_nbr'] = makeImageBitmap(48, 24);

    const keys = new Set<string | null>();
    for (let i = 0; i < 4; i++) {
      patchCreateElement();
      const key = generateBlendSprite(i, '0src_src', '0nbr_nbr');
      keys.add(key);
      if (key) delete (sprites as Record<string, unknown>)[key];
      vi.restoreAllMocks();
    }

    // All 4 directions produce distinct non-null keys
    expect(keys.size).toBe(4);
    expect(keys.has(null)).toBe(false);

    delete (sprites as Record<string, unknown>)['0src_src'];
    delete (sprites as Record<string, unknown>)['0nbr_nbr'];
  });
});

// ---------------------------------------------------------------------------
// Tests: clearBlendCache
// ---------------------------------------------------------------------------

describe('clearBlendCache', () => {
  it('removes all __blend_ keys from store.sprites', async () => {
    const { clearBlendCache, generateBlendSprite, resetBlendStats } = await import('@/renderer/terrainBlendGen');
    resetBlendStats();

    const sprites = store.sprites as Record<string, HTMLCanvasElement | ImageBitmap>;
    sprites['0t1_t1'] = makeImageBitmap(48, 24);
    sprites['0t2_t2'] = makeImageBitmap(48, 24);

    patchCreateElement();
    generateBlendSprite(0, '0t1_t1', '0t2_t2');
    vi.restoreAllMocks();

    const blendKey = '__blend_0_0t1_t1_0t2_t2';
    expect(sprites[blendKey]).toBeDefined();

    clearBlendCache();
    expect(sprites[blendKey]).toBeUndefined();

    delete (sprites as Record<string, unknown>)['0t1_t1'];
    delete (sprites as Record<string, unknown>)['0t2_t2'];
  });

  it('does not remove non-blend sprites', async () => {
    const { clearBlendCache } = await import('@/renderer/terrainBlendGen');

    const sprites = store.sprites as Record<string, HTMLCanvasElement | ImageBitmap>;
    sprites['t.l0.grassland_n1e0s0w0'] = makeImageBitmap(96, 48);

    clearBlendCache();
    expect(sprites['t.l0.grassland_n1e0s0w0']).toBeDefined();

    delete (sprites as Record<string, unknown>)['t.l0.grassland_n1e0s0w0'];
  });
});

// ---------------------------------------------------------------------------
// Tests: resetBlendStats
// ---------------------------------------------------------------------------

describe('resetBlendStats', () => {
  it('zeros both counters', async () => {
    const { blendStats, resetBlendStats } = await import('@/renderer/terrainBlendGen');
    (blendStats as Record<string, number>).generated = 99;
    (blendStats as Record<string, number>).cacheHits = 42;

    resetBlendStats();
    expect(blendStats.generated).toBe(0);
    expect(blendStats.cacheHits).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Tests: HTMLCanvasElement source sprites (not just ImageBitmap)
// ---------------------------------------------------------------------------

describe('generateBlendSprite — HTMLCanvasElement source', () => {
  it('handles HTMLCanvasElement source sprites (reads .width/.height directly)', async () => {
    const { generateBlendSprite, resetBlendStats } = await import('@/renderer/terrainBlendGen');
    resetBlendStats();
    patchCreateElement();

    const sprites = store.sprites as Record<string, HTMLCanvasElement | ImageBitmap>;
    // Use a real HTMLCanvasElement as source (width/height from property)
    const srcCanvas = document.createElement('canvas');
    srcCanvas.width = 48;
    srcCanvas.height = 24;
    sprites['0canvas_src'] = srcCanvas;
    sprites['0canvas_nbr'] = makeImageBitmap(48, 24);

    const result = generateBlendSprite(0, '0canvas_src', '0canvas_nbr');
    expect(result).toBe('__blend_0_0canvas_src_0canvas_nbr');

    const blendKey = '__blend_0_0canvas_src_0canvas_nbr';
    delete (sprites as Record<string, unknown>)['0canvas_src'];
    delete (sprites as Record<string, unknown>)['0canvas_nbr'];
    delete (sprites as Record<string, unknown>)[blendKey];
  });
});
