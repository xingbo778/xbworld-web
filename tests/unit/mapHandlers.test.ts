/**
 * Unit tests for net/handlers/map.ts packet handlers.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('@/core/overview', () => ({
  init_overview: vi.fn(),
  mark_overview_dirty: vi.fn(),
}));

vi.mock('@/renderer/mapviewCommon', () => ({
  mark_tile_dirty: vi.fn(),
  mapdeco_init: vi.fn(),
  mark_all_dirty: vi.fn(),
}));

vi.mock('@/audio/sounds', () => ({
  play_sound: vi.fn(),
}));

import { store } from '@/data/store';

beforeEach(() => {
  store.reset();
});

describe('handle_tile_info', () => {
  it('is exported as a function', async () => {
    const { handle_tile_info } = await import('@/net/handlers/map');
    expect(typeof handle_tile_info).toBe('function');
  });

  it('does not throw when tiles is null/empty', async () => {
    const { handle_tile_info } = await import('@/net/handlers/map');
    store.tiles = null as never;
    expect(() => handle_tile_info({ tile: 0, extras: [], known: 2, terrain: 0, resource: -1 } as never)).not.toThrow();
  });

  it('updates existing tile in store', async () => {
    const { handle_tile_info } = await import('@/net/handlers/map');
    store.tiles = { 5: { tile: 5, terrain: 0, known: 0 } } as never;
    handle_tile_info({ tile: 5, extras: [], known: 2, terrain: 3 } as never);
    expect(store.tiles[5]?.terrain).toBe(3);
  });

  it('forces known=2 when packet known < 2', async () => {
    const { handle_tile_info } = await import('@/net/handlers/map');
    store.tiles = { 7: { tile: 7, terrain: 0, known: 0 } } as never;
    handle_tile_info({ tile: 7, extras: [], known: 0, terrain: 1 } as never);
    expect(store.tiles[7]?.known).toBe(2);
  });
});

describe('handle_map_info', () => {
  it('is exported as a function', async () => {
    const { handle_map_info } = await import('@/net/handlers/map');
    expect(typeof handle_map_info).toBe('function');
  });

  it('stores map info in store', async () => {
    const { handle_map_info } = await import('@/net/handlers/map');
    handle_map_info({ xsize: 80, ysize: 50, topology_id: 1, wrap_id: 1 } as never);
    expect(store.mapInfo?.xsize).toBe(80);
  });

  it('does not throw for a standard map size', async () => {
    const { handle_map_info } = await import('@/net/handlers/map');
    expect(() => handle_map_info({ xsize: 80, ysize: 50, topology_id: 1, wrap_id: 1 } as never)).not.toThrow();
  });

  it('handle_map_info emits map:allocated → mapInfo signal updated', async () => {
    const { handle_map_info } = await import('@/net/handlers/map');
    const { mapInfo } = await import('@/data/signals');
    handle_map_info({ xsize: 120, ysize: 80, topology_id: 1, wrap_id: 1 } as never);
    expect((mapInfo.value as Record<string, unknown>)?.['xsize']).toBe(120);
    expect((mapInfo.value as Record<string, unknown>)?.['ysize']).toBe(80);
  });
});

describe('handle_nuke_tile_info', () => {
  it('is exported as a function', async () => {
    const { handle_nuke_tile_info } = await import('@/net/handlers/map');
    expect(typeof handle_nuke_tile_info).toBe('function');
  });

  it('sets nuke=60 on the target tile when tile exists in store.tiles', async () => {
    const { handle_nuke_tile_info } = await import('@/net/handlers/map');
    const tile: Record<string, unknown> = { tile: 0, terrain: 0, known: 2 };
    store.tiles = { 0: tile as never };
    handle_nuke_tile_info({ tile: 0 } as never);
    expect(tile['nuke']).toBe(60);
    store.tiles = {};
  });
});
