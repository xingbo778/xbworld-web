/**
 * Unit tests for core/control/unitPanel.ts (observer-mode stubs)
 */
import { describe, it, expect } from 'vitest';

describe('unitPanel stubs', () => {
  it('update_unit_order_commands is exported and returns an object', async () => {
    const { update_unit_order_commands } = await import('@/core/control/unitPanel');
    expect(typeof update_unit_order_commands).toBe('function');
    expect(typeof update_unit_order_commands()).toBe('object');
  });

  it('init_game_unit_panel is a no-op that does not throw', async () => {
    const { init_game_unit_panel } = await import('@/core/control/unitPanel');
    expect(typeof init_game_unit_panel).toBe('function');
    expect(() => init_game_unit_panel()).not.toThrow();
  });

  it('update_active_units_dialog is a no-op that does not throw', async () => {
    const { update_active_units_dialog } = await import('@/core/control/unitPanel');
    expect(typeof update_active_units_dialog).toBe('function');
    expect(() => update_active_units_dialog()).not.toThrow();
  });
});
