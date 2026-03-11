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
