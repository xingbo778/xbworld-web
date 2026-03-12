/**
 * Unit tests for core/overview.ts pure functions and constants.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { store } from '@/data/store';

beforeEach(() => { store.reset(); });

describe('overview constants', () => {
  it('exports COLOR_OVERVIEW_* constants as numbers', async () => {
    const {
      COLOR_OVERVIEW_UNKNOWN, COLOR_OVERVIEW_MY_CITY, COLOR_OVERVIEW_ALLIED_CITY,
      COLOR_OVERVIEW_ENEMY_CITY, COLOR_OVERVIEW_MY_UNIT, COLOR_OVERVIEW_ALLIED_UNIT,
      COLOR_OVERVIEW_ENEMY_UNIT, COLOR_OVERVIEW_VIEWRECT,
    } = await import('@/core/overview');
    expect(typeof COLOR_OVERVIEW_UNKNOWN).toBe('number');
    expect(typeof COLOR_OVERVIEW_MY_CITY).toBe('number');
    expect(typeof COLOR_OVERVIEW_ALLIED_CITY).toBe('number');
    expect(typeof COLOR_OVERVIEW_ENEMY_CITY).toBe('number');
    expect(typeof COLOR_OVERVIEW_MY_UNIT).toBe('number');
    expect(typeof COLOR_OVERVIEW_ALLIED_UNIT).toBe('number');
    expect(typeof COLOR_OVERVIEW_ENEMY_UNIT).toBe('number');
    expect(typeof COLOR_OVERVIEW_VIEWRECT).toBe('number');
  });

  it('COLOR_OVERVIEW_UNKNOWN is 0 (black)', async () => {
    const { COLOR_OVERVIEW_UNKNOWN } = await import('@/core/overview');
    expect(COLOR_OVERVIEW_UNKNOWN).toBe(0);
  });
});

describe('mark_overview_dirty', () => {
  it('is exported as a function', async () => {
    const { mark_overview_dirty } = await import('@/core/overview');
    expect(typeof mark_overview_dirty).toBe('function');
  });

  it('does not throw', async () => {
    const { mark_overview_dirty } = await import('@/core/overview');
    expect(() => mark_overview_dirty()).not.toThrow();
  });
});

describe('setOverviewActive', () => {
  it('is exported as a function', async () => {
    const { setOverviewActive } = await import('@/core/overview');
    expect(typeof setOverviewActive).toBe('function');
  });

  it('does not throw', async () => {
    const { setOverviewActive } = await import('@/core/overview');
    expect(() => setOverviewActive(true)).not.toThrow();
    expect(() => setOverviewActive(false)).not.toThrow();
  });
});

describe('overview:frame event listener', () => {
  it('emitting overview:frame does not throw (calls redraw_overview)', async () => {
    // Importing overview registers the globalEvents.on('overview:frame', ...) listener
    await import('@/core/overview');
    const { globalEvents } = await import('@/core/events');
    expect(() => globalEvents.emit('overview:frame')).not.toThrow();
  });

  it('mark_overview_viewport_dirty is exported and does not throw', async () => {
    const { mark_overview_viewport_dirty } = await import('@/core/overview');
    expect(typeof mark_overview_viewport_dirty).toBe('function');
    expect(() => mark_overview_viewport_dirty()).not.toThrow();
  });
});

// ── generate_palette ────────────────────────────────────────────────────────

describe('generate_palette', () => {
  it('is exported as a function', async () => {
    const { generate_palette } = await import('@/core/overview');
    expect(typeof generate_palette).toBe('function');
  });

  it('returns an array with at least 8 entries for the fixed color slots', async () => {
    const { generate_palette } = await import('@/core/overview');
    const pal = generate_palette();
    expect(Array.isArray(pal)).toBe(true);
    expect(pal.length).toBeGreaterThanOrEqual(8);
  });

  it('COLOR_OVERVIEW_UNKNOWN slot is [0,0,0] (black)', async () => {
    const { generate_palette, COLOR_OVERVIEW_UNKNOWN } = await import('@/core/overview');
    const pal = generate_palette();
    expect(pal[COLOR_OVERVIEW_UNKNOWN]).toEqual([0, 0, 0]);
  });

  it('COLOR_OVERVIEW_MY_CITY slot is [255,255,255] (white)', async () => {
    const { generate_palette, COLOR_OVERVIEW_MY_CITY } = await import('@/core/overview');
    const pal = generate_palette();
    expect(pal[COLOR_OVERVIEW_MY_CITY]).toEqual([255, 255, 255]);
  });

  it('COLOR_OVERVIEW_MY_UNIT slot is [255,255,0] (yellow)', async () => {
    const { generate_palette, COLOR_OVERVIEW_MY_UNIT } = await import('@/core/overview');
    const pal = generate_palette();
    expect(pal[COLOR_OVERVIEW_MY_UNIT]).toEqual([255, 255, 0]);
  });

  it('COLOR_OVERVIEW_VIEWRECT slot is [200,200,255]', async () => {
    const { generate_palette, COLOR_OVERVIEW_VIEWRECT } = await import('@/core/overview');
    const pal = generate_palette();
    expect(pal[COLOR_OVERVIEW_VIEWRECT]).toEqual([200, 200, 255]);
  });

  it('each palette entry is an array of 3 numbers', async () => {
    const { generate_palette } = await import('@/core/overview');
    const pal = generate_palette();
    for (const entry of pal) {
      expect(Array.isArray(entry)).toBe(true);
      expect(entry.length).toBe(3);
      for (const channel of entry) {
        expect(typeof channel).toBe('number');
      }
    }
  });
});

// ── add_closed_path ─────────────────────────────────────────────────────────

describe('add_closed_path', () => {
  it('is exported as a function', async () => {
    const { add_closed_path } = await import('@/core/overview');
    expect(typeof add_closed_path).toBe('function');
  });

  it('does nothing for an empty path', async () => {
    const { add_closed_path } = await import('@/core/overview');
    const moves: string[] = [];
    const mockCtx = {
      moveTo: (x: number, y: number) => moves.push(`M${x},${y}`),
      lineTo: (x: number, y: number) => moves.push(`L${x},${y}`),
    } as unknown as CanvasRenderingContext2D;
    add_closed_path(mockCtx, []);
    expect(moves.length).toBe(0);
  });

  it('draws closed path for a triangle', async () => {
    const { add_closed_path } = await import('@/core/overview');
    const ops: string[] = [];
    const mockCtx = {
      moveTo: (x: number, y: number) => ops.push(`M${x},${y}`),
      lineTo: (x: number, y: number) => ops.push(`L${x},${y}`),
    } as unknown as CanvasRenderingContext2D;
    add_closed_path(mockCtx, [[0, 0], [10, 0], [5, 10]]);
    // moveTo first point, lineTo second and third, lineTo back to first
    expect(ops).toEqual(['M0,0', 'L10,0', 'L5,10', 'L0,0']);
  });

  it('draws closed path for a single point (moveTo + lineTo back)', async () => {
    const { add_closed_path } = await import('@/core/overview');
    const ops: string[] = [];
    const mockCtx = {
      moveTo: (x: number, y: number) => ops.push(`M${x},${y}`),
      lineTo: (x: number, y: number) => ops.push(`L${x},${y}`),
    } as unknown as CanvasRenderingContext2D;
    add_closed_path(mockCtx, [[3, 7]]);
    expect(ops).toEqual(['M3,7', 'L3,7']);
  });
});

// ── generate_overview_grid / generate_overview_hash ─────────────────────────

describe('generate_overview_grid and generate_overview_hash', () => {
  it('generate_overview_grid is exported as a function', async () => {
    const { generate_overview_grid } = await import('@/core/overview');
    expect(typeof generate_overview_grid).toBe('function');
  });

  it('generate_overview_hash is exported as a function', async () => {
    const { generate_overview_hash } = await import('@/core/overview');
    expect(typeof generate_overview_hash).toBe('function');
  });

  it('generate_overview_grid returns a 2D array for a 4x4 map', async () => {
    const { generate_overview_grid } = await import('@/core/overview');
    // Set up minimal mapInfo so render_multipixel bounds checks pass
    store.mapInfo = { xsize: 4, ysize: 4 } as never;
    const grid = generate_overview_grid(4, 4);
    expect(Array.isArray(grid)).toBe(true);
    // With OVERVIEW_TILE_SIZE=1, grid has rows*TILE_SIZE = 4 rows
    expect(grid.length).toBe(4);
    expect(Array.isArray(grid[0])).toBe(true);
  });

  it('generate_overview_hash returns a number for a 4x4 map', async () => {
    const { generate_overview_hash } = await import('@/core/overview');
    store.mapInfo = { xsize: 4, ysize: 4 } as never;
    const hash = generate_overview_hash(4, 4);
    expect(typeof hash).toBe('number');
  });

  it('generate_overview_grid_and_hash returns consistent grid and hash', async () => {
    const { generate_overview_grid_and_hash } = await import('@/core/overview');
    store.mapInfo = { xsize: 2, ysize: 2 } as never;
    const result = generate_overview_grid_and_hash(2, 2);
    expect(result).toHaveProperty('grid');
    expect(result).toHaveProperty('hash');
    expect(Array.isArray(result.grid)).toBe(true);
    expect(typeof result.hash).toBe('number');
  });

  it('odd col/row counts are rounded down to even', async () => {
    const { generate_overview_grid_and_hash } = await import('@/core/overview');
    store.mapInfo = { xsize: 4, ysize: 4 } as never;
    // Pass odd values — function subtracts 1 from each
    const result = generate_overview_grid_and_hash(3, 3);
    // rows rounds to 2, cols rounds to 2 → grid has 2 rows
    expect(result.grid.length).toBe(2);
  });
});

// ── render_viewrect ───────────────────────────────────────────────────────

describe('render_viewrect', () => {
  it('is exported as a function', async () => {
    const { render_viewrect } = await import('@/core/overview');
    expect(typeof render_viewrect).toBe('function');
  });

  it('does nothing when client state is not C_S_RUNNING', async () => {
    const { render_viewrect } = await import('@/core/overview');
    // In test env, client state is not C_S_RUNNING → function returns early
    expect(() => render_viewrect()).not.toThrow();
  });
});

// ── overview_tile_color ───────────────────────────────────────────────────

describe('overview_tile_color', () => {
  it('is exported as a function', async () => {
    const { overview_tile_color } = await import('@/core/overview');
    expect(typeof overview_tile_color).toBe('function');
  });

  it('returns a number', async () => {
    const { overview_tile_color } = await import('@/core/overview');
    const result = overview_tile_color(0, 0);
    expect(typeof result).toBe('number');
  });
});

// ── overview_clicked ──────────────────────────────────────────────────────

describe('overview_clicked', () => {
  it('is exported as a function', async () => {
    const { overview_clicked } = await import('@/core/overview');
    expect(typeof overview_clicked).toBe('function');
  });

  it('does not throw (no active mapview in test env)', async () => {
    const { overview_clicked } = await import('@/core/overview');
    expect(() => overview_clicked(0, 0)).not.toThrow();
  });
});
