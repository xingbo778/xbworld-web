/**
 * Unit tests for core/control/gotoPath.ts
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { store } from '@/data/store';

const win = globalThis as unknown as Record<string, unknown>;

beforeEach(() => {
  store.reset();
});

describe('activate_goto', () => {
  it('is exported as a function', async () => {
    const { activate_goto } = await import('@/core/control/gotoPath');
    expect(typeof activate_goto).toBe('function');
  });

  it('does not throw', async () => {
    const { activate_goto } = await import('@/core/control/gotoPath');
    expect(() => activate_goto()).not.toThrow();
  });
});

describe('deactivate_goto', () => {
  it('is exported as a function', async () => {
    const { deactivate_goto } = await import('@/core/control/gotoPath');
    expect(typeof deactivate_goto).toBe('function');
  });

  it('does not throw with false', async () => {
    const { deactivate_goto } = await import('@/core/control/gotoPath');
    expect(() => deactivate_goto(false)).not.toThrow();
  });
});

describe('check_request_goto_path', () => {
  it('is exported as a function', async () => {
    const { check_request_goto_path } = await import('@/core/control/gotoPath');
    expect(typeof check_request_goto_path).toBe('function');
  });

  it('does not throw when no units in focus', async () => {
    const { check_request_goto_path } = await import('@/core/control/gotoPath');
    expect(() => check_request_goto_path()).not.toThrow();
  });
});

describe('update_goto_path', () => {
  it('is exported as a function', async () => {
    const { update_goto_path } = await import('@/core/control/gotoPath');
    expect(typeof update_goto_path).toBe('function');
  });

  it('does not throw when unit is absent from store', async () => {
    const { update_goto_path } = await import('@/core/control/gotoPath');
    expect(() => update_goto_path({
      unit_id: 999, dest: 0, dir: [], length: 0, turns: 0,
    })).not.toThrow();
  });
});

describe('send_end_turn', () => {
  it('is exported as a function', async () => {
    const { send_end_turn } = await import('@/core/control/gotoPath');
    expect(typeof send_end_turn).toBe('function');
  });
});

// ── Signal integration ────────────────────────────────────────────────────────

describe('activeUnitInfo signal — update_goto_path sets turns text', () => {
  beforeEach(() => {
    // indexToTile reads from window.tiles (legacy bridge)
    win.tiles = {
      0: { index: 0, x: 0, y: 0 },
      1: { index: 1, x: 1, y: 0 },
    };
  });

  afterEach(() => {
    delete win.tiles;
  });

  it('sets activeUnitInfo when update_goto_path has turns', async () => {
    const { update_goto_path } = await import('@/core/control/gotoPath');
    const { activeUnitInfo } = await import('@/data/signals');

    // Put a unit in the store so the early-return (punit == null) is skipped
    store.units[5] = { id: 5, tile: 0 } as never;

    // Reset signal to a known value
    activeUnitInfo.value = '';

    update_goto_path({ unit_id: 5, dest: 1, dir: [], length: 0, turns: 3 });

    expect(activeUnitInfo.value).toContain('3');
    expect(activeUnitInfo.value).toContain('Turns for goto');
  });

  it('does not update activeUnitInfo when unit is missing from store', async () => {
    const { update_goto_path } = await import('@/core/control/gotoPath');
    const { activeUnitInfo } = await import('@/data/signals');

    activeUnitInfo.value = 'previous';
    update_goto_path({ unit_id: 999, dest: 1, dir: [], length: 0, turns: 5 });
    // Should not have changed since unit 999 doesn't exist
    expect(activeUnitInfo.value).toBe('previous');
  });
});

describe('activate_goto_last', () => {
  it('is exported as a function', async () => {
    const { activate_goto_last } = await import('@/core/control/gotoPath');
    expect(typeof activate_goto_last).toBe('function');
  });

  it('does not throw when no units in focus', async () => {
    const { activate_goto_last } = await import('@/core/control/gotoPath');
    // S.current_focus is empty → deactivate_goto branch fires, no crash
    expect(() => activate_goto_last(0, 0)).not.toThrow();
  });
});
