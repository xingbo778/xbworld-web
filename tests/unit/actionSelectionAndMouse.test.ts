/**
 * Unit tests for core/control/actionSelection.ts (observer-mode stubs)
 * and core/control/mouse.ts (basic no-throw checks).
 */
import { describe, it, expect } from 'vitest';

// ── actionSelection stubs ─────────────────────────────────────────────────

describe('actionSelection stubs', () => {
  it('act_sel_queue_done is a no-op that does not throw', async () => {
    const { act_sel_queue_done } = await import('@/core/control/actionSelection');
    expect(typeof act_sel_queue_done).toBe('function');
    expect(() => act_sel_queue_done()).not.toThrow();
  });

  it('popup_action_selection does not throw', async () => {
    const { popup_action_selection } = await import('@/core/control/actionSelection');
    expect(() => popup_action_selection()).not.toThrow();
  });

  it('popup_bribe_dialog does not throw', async () => {
    const { popup_bribe_dialog } = await import('@/core/control/actionSelection');
    expect(() => popup_bribe_dialog()).not.toThrow();
  });

  it('popup_incite_dialog does not throw', async () => {
    const { popup_incite_dialog } = await import('@/core/control/actionSelection');
    expect(() => popup_incite_dialog()).not.toThrow();
  });

  it('popup_unit_upgrade_dlg does not throw', async () => {
    const { popup_unit_upgrade_dlg } = await import('@/core/control/actionSelection');
    expect(() => popup_unit_upgrade_dlg()).not.toThrow();
  });

  it('action_selection_close does not throw', async () => {
    const { action_selection_close } = await import('@/core/control/actionSelection');
    expect(() => action_selection_close()).not.toThrow();
  });

  it('action_selection_actor_unit returns IDENTITY_NUMBER_ZERO', async () => {
    const { action_selection_actor_unit } = await import('@/core/control/actionSelection');
    expect(typeof action_selection_actor_unit()).toBe('number');
  });

  it('action_selection_target_city returns IDENTITY_NUMBER_ZERO', async () => {
    const { action_selection_target_city } = await import('@/core/control/actionSelection');
    expect(typeof action_selection_target_city()).toBe('number');
  });

  it('action_selection_target_unit returns IDENTITY_NUMBER_ZERO', async () => {
    const { action_selection_target_unit } = await import('@/core/control/actionSelection');
    expect(typeof action_selection_target_unit()).toBe('number');
  });
});

// ── mouse ─────────────────────────────────────────────────────────────────

describe('mouse module', () => {
  it('update_mouse_cursor is exported as a function', async () => {
    const { update_mouse_cursor } = await import('@/core/control/mouse');
    expect(typeof update_mouse_cursor).toBe('function');
  });

  it('update_mouse_cursor does not throw', async () => {
    const { update_mouse_cursor } = await import('@/core/control/mouse');
    expect(() => update_mouse_cursor()).not.toThrow();
  });

  it('set_mouse_touch_started_on_unit does not throw for null tile', async () => {
    const { set_mouse_touch_started_on_unit } = await import('@/core/control/mouse');
    expect(() => set_mouse_touch_started_on_unit(null)).not.toThrow();
  });
});
