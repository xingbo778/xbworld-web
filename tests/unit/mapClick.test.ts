/**
 * Unit tests for core/control/mapClick.ts
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { store } from '@/data/store';

beforeEach(() => {
  store.reset();
});

describe('order_wants_direction', () => {
  it('is exported as a function', async () => {
    const { order_wants_direction } = await import('@/core/control/mapClick');
    expect(typeof order_wants_direction).toBe('function');
  });

  it('returns a boolean for any inputs', async () => {
    const { order_wants_direction } = await import('@/core/control/mapClick');
    const fakeTile = { tile: 0, x: 0, y: 0 } as never;
    expect(typeof order_wants_direction(0, 0, fakeTile)).toBe('boolean');
  });
});

describe('find_active_dialog', () => {
  it('is exported as a function', async () => {
    const { find_active_dialog } = await import('@/core/control/mapClick');
    expect(typeof find_active_dialog).toBe('function');
  });

  it('does not throw', async () => {
    const { find_active_dialog } = await import('@/core/control/mapClick');
    expect(() => find_active_dialog()).not.toThrow();
  });
});

describe('center_tile_mapcanvas', () => {
  it('is exported as a function', async () => {
    const { center_tile_mapcanvas } = await import('@/core/control/mapClick');
    expect(typeof center_tile_mapcanvas).toBe('function');
  });

  it('does not throw for null tile', async () => {
    const { center_tile_mapcanvas } = await import('@/core/control/mapClick');
    expect(() => center_tile_mapcanvas(null)).not.toThrow();
  });
});

describe('popit / popit_req', () => {
  it('popit does not throw', async () => {
    const { popit } = await import('@/core/control/mapClick');
    expect(() => popit()).not.toThrow();
  });

  it('popit_req does not throw for null tile', async () => {
    const { popit_req } = await import('@/core/control/mapClick');
    expect(() => popit_req(null)).not.toThrow();
  });
});

describe('center_on_any_city', () => {
  it('is exported as a function', async () => {
    const { center_on_any_city } = await import('@/core/control/mapClick');
    expect(typeof center_on_any_city).toBe('function');
  });

  it('does not throw when store has no cities', async () => {
    const { center_on_any_city } = await import('@/core/control/mapClick');
    expect(() => center_on_any_city()).not.toThrow();
  });
});
