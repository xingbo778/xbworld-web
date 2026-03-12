/**
 * Unit tests for core/control/unitCommands.ts and core/control/keyboard.ts
 */
import { describe, it, expect } from 'vitest';

// ── unitCommands — no-op stubs ───────────────────────────────────────────

describe('unitCommands no-op stubs', () => {
  it('key_unit_auto_explore is a function and does not throw', async () => {
    const { key_unit_auto_explore } = await import('@/core/control/unitCommands');
    expect(typeof key_unit_auto_explore).toBe('function');
    expect(() => key_unit_auto_explore()).not.toThrow();
  });

  it('key_unit_load does not throw', async () => {
    const { key_unit_load } = await import('@/core/control/unitCommands');
    expect(() => key_unit_load()).not.toThrow();
  });

  it('key_unit_unload does not throw', async () => {
    const { key_unit_unload } = await import('@/core/control/unitCommands');
    expect(() => key_unit_unload()).not.toThrow();
  });

  it('key_unit_wait does not throw', async () => {
    const { key_unit_wait } = await import('@/core/control/unitCommands');
    expect(() => key_unit_wait()).not.toThrow();
  });

  it('key_unit_noorders does not throw', async () => {
    const { key_unit_noorders } = await import('@/core/control/unitCommands');
    expect(() => key_unit_noorders()).not.toThrow();
  });

  it('key_unit_idle does not throw', async () => {
    const { key_unit_idle } = await import('@/core/control/unitCommands');
    expect(() => key_unit_idle()).not.toThrow();
  });

  it('request_unit_do_action is exported as a function', async () => {
    const { request_unit_do_action } = await import('@/core/control/unitCommands');
    expect(typeof request_unit_do_action).toBe('function');
  });

  it('request_new_unit_activity is exported as a function', async () => {
    const { request_new_unit_activity } = await import('@/core/control/unitCommands');
    expect(typeof request_new_unit_activity).toBe('function');
  });
});

// ── keyboard ──────────────────────────────────────────────────────────────

describe('keyboard exports', () => {
  it('global_keyboard_listener is exported as a function', async () => {
    const { global_keyboard_listener } = await import('@/core/control/keyboard');
    expect(typeof global_keyboard_listener).toBe('function');
  });

  it('map_handle_key is a no-op that does not throw', async () => {
    const { map_handle_key } = await import('@/core/control/keyboard');
    expect(() => map_handle_key('a', 65, false, false, false, {} as never)).not.toThrow();
  });

  it('civclient_handle_key does not throw for unmapped keys', async () => {
    const { civclient_handle_key } = await import('@/core/control/keyboard');
    // Passing a key that has no binding should not crash
    expect(() => civclient_handle_key('z', 90, false, false, false, {} as never)).not.toThrow();
  });
});

describe('unitCommands — additional exports', () => {
  it('request_unit_act_sel_vs is exported as a function', async () => {
    const { request_unit_act_sel_vs } = await import('@/core/control/unitCommands');
    expect(typeof request_unit_act_sel_vs).toBe('function');
  });

  it('request_unit_act_sel_vs_own_tile is exported as a function', async () => {
    const { request_unit_act_sel_vs_own_tile } = await import('@/core/control/unitCommands');
    expect(typeof request_unit_act_sel_vs_own_tile).toBe('function');
  });

  it('request_unit_act_sel_vs_own_tile does not throw', async () => {
    const { request_unit_act_sel_vs_own_tile } = await import('@/core/control/unitCommands');
    expect(() => request_unit_act_sel_vs_own_tile()).not.toThrow();
  });
});

describe('key_unit_move', () => {
  it('is exported as a function', async () => {
    const { key_unit_move } = await import('@/core/control/unitCommands');
    expect(typeof key_unit_move).toBe('function');
  });

  it('does not throw for any direction', async () => {
    const { key_unit_move } = await import('@/core/control/unitCommands');
    for (let dir = 0; dir < 8; dir++) {
      expect(() => key_unit_move(dir)).not.toThrow();
    }
  });
});

describe('unitCommands — remaining no-op stubs', () => {
  const noops = [
    'key_unit_action_select',
    'key_unit_airbase',
    'key_unit_airlift',
    'key_unit_auto_work',
    'key_unit_build_city',
    'key_unit_clean',
    'key_unit_cultivate',
    'key_unit_disband',
    'key_unit_fortify',
    'key_unit_fortress',
    'key_unit_homecity',
    'key_unit_irrigate',
    'key_unit_mine',
    'key_unit_nuke',
    'key_unit_paradrop',
    'key_unit_pillage',
    'key_unit_plant',
    'key_unit_road',
    'key_unit_sentry',
    'key_unit_show_cargo',
    'key_unit_transform',
    'key_unit_upgrade',
  ] as const;

  for (const name of noops) {
    it(`${name} is a no-op function`, async () => {
      const mod = await import('@/core/control/unitCommands');
      const fn = mod[name] as () => void;
      expect(typeof fn).toBe('function');
      expect(() => fn()).not.toThrow();
    });
  }
});
