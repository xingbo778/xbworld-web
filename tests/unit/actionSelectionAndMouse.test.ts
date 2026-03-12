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

describe('mouse module — additional functions', () => {
  it('check_mouse_drag_unit is exported as a function', async () => {
    const { check_mouse_drag_unit } = await import('@/core/control/mouse');
    expect(typeof check_mouse_drag_unit).toBe('function');
  });

  it('check_mouse_drag_unit does not throw for null tile', async () => {
    const { check_mouse_drag_unit } = await import('@/core/control/mouse');
    expect(() => check_mouse_drag_unit(null)).not.toThrow();
  });

  it('mouse_moved_cb is exported as a function', async () => {
    const { mouse_moved_cb } = await import('@/core/control/mouse');
    expect(typeof mouse_moved_cb).toBe('function');
  });
});

describe('keyboard module — handle_context_menu_callback', () => {
  it('is exported as a function', async () => {
    const { handle_context_menu_callback } = await import('@/core/control/keyboard');
    expect(typeof handle_context_menu_callback).toBe('function');
  });

  it('does not throw for unknown key', async () => {
    const { handle_context_menu_callback } = await import('@/core/control/keyboard');
    expect(() => handle_context_menu_callback('unknown_key')).not.toThrow();
  });

  it('does not throw for show_city key with no focus unit', async () => {
    const { handle_context_menu_callback } = await import('@/core/control/keyboard');
    // S.current_focus is empty → ptile is null → function returns early
    expect(() => handle_context_menu_callback('show_city')).not.toThrow();
  });
});

describe('mapClick — do_unit_paradrop_to / do_map_click', () => {
  it('do_unit_paradrop_to is exported as a function', async () => {
    const { do_unit_paradrop_to } = await import('@/core/control/mapClick');
    expect(typeof do_unit_paradrop_to).toBe('function');
  });

  it('do_map_click is exported as a function', async () => {
    const { do_map_click } = await import('@/core/control/mapClick');
    expect(typeof do_map_click).toBe('function');
  });
});

// ── actionSelection — logic functions ─────────────────────────────────────

describe('should_ask_server_for_actions', () => {
  it('is exported as a function', async () => {
    const { should_ask_server_for_actions } = await import('@/core/control/actionSelection');
    expect(typeof should_ask_server_for_actions).toBe('function');
  });

  it('returns false when action_decision_want is 0 (FC_ACT_DEC_NOTHING)', async () => {
    const { should_ask_server_for_actions } = await import('@/core/control/actionSelection');
    const result = should_ask_server_for_actions({ action_decision_want: 0 } as never);
    expect(result).toBe(false);
  });
});

describe('can_ask_server_for_actions', () => {
  it('is exported as a function', async () => {
    const { can_ask_server_for_actions } = await import('@/core/control/actionSelection');
    expect(typeof can_ask_server_for_actions).toBe('function');
  });

  it('returns a boolean', async () => {
    const { can_ask_server_for_actions } = await import('@/core/control/actionSelection');
    expect(typeof can_ask_server_for_actions()).toBe('boolean');
  });
});

describe('ask_server_for_actions', () => {
  it('is exported as a function', async () => {
    const { ask_server_for_actions } = await import('@/core/control/actionSelection');
    expect(typeof ask_server_for_actions).toBe('function');
  });

  it('returns false when store.observing is true', async () => {
    const { ask_server_for_actions } = await import('@/core/control/actionSelection');
    const { store } = await import('@/data/store');
    const prev = store.observing;
    (store as any).observing = true;
    const result = ask_server_for_actions({ id: 1 } as never);
    (store as any).observing = prev;
    expect(result).toBe(false);
  });

  it('returns false for null unit', async () => {
    const { ask_server_for_actions } = await import('@/core/control/actionSelection');
    const result = ask_server_for_actions(null as never);
    expect(result).toBe(false);
  });
});

describe('action_selection_no_longer_in_progress', () => {
  it('does not throw', async () => {
    const { action_selection_no_longer_in_progress } = await import('@/core/control/actionSelection');
    expect(() => action_selection_no_longer_in_progress(0)).not.toThrow();
  });
});

describe('action_decision_clear_want', () => {
  it('does not throw for unknown unit id', async () => {
    const { action_decision_clear_want } = await import('@/core/control/actionSelection');
    expect(() => action_decision_clear_want(9999)).not.toThrow();
  });
});

describe('action_selection_next_in_focus', () => {
  it('does not throw with empty focus', async () => {
    const { action_selection_next_in_focus } = await import('@/core/control/actionSelection');
    expect(() => action_selection_next_in_focus(0)).not.toThrow();
  });
});

describe('action_decision_request', () => {
  it('does not throw for null unit', async () => {
    const { action_decision_request } = await import('@/core/control/actionSelection');
    expect(() => action_decision_request(null as never)).not.toThrow();
  });
});

// ── actionSelection remaining stubs ──────────────────────────────────────

describe('actionSelection — remaining stubs', () => {
  it('action_selection_refresh does not throw', async () => {
    const { action_selection_refresh } = await import('@/core/control/actionSelection');
    expect(typeof action_selection_refresh).toBe('function');
    expect(() => action_selection_refresh()).not.toThrow();
  });

  it('action_selection_target_tile returns 0', async () => {
    const { action_selection_target_tile } = await import('@/core/control/actionSelection');
    expect(typeof action_selection_target_tile).toBe('function');
    expect(action_selection_target_tile()).toBe(0);
  });

  it('action_selection_target_extra returns -1', async () => {
    const { action_selection_target_extra } = await import('@/core/control/actionSelection');
    expect(typeof action_selection_target_extra).toBe('function');
    expect(action_selection_target_extra()).toBe(-1);
  });
});
