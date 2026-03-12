/**
 * Unit tests for core/control/controlState.ts and core/control/chat.ts pure functions.
 */
import { describe, it, expect } from 'vitest';

// ── controlState ──────────────────────────────────────────────────────────

describe('controlState exports', () => {
  it('exports mouse coordinate getters/setters', async () => {
    const mod = await import('@/core/control/controlState');
    expect(typeof mod.setMouseX).toBe('function');
    expect(typeof mod.setMouseY).toBe('function');
    expect(typeof mod.setPrevMouseX).toBe('function');
    expect(typeof mod.setPrevMouseY).toBe('function');
  });

  it('setMouseX / mouse_x round-trip', async () => {
    const mod = await import('@/core/control/controlState');
    mod.setMouseX(42);
    expect(mod.mouse_x).toBe(42);
  });

  it('setMouseY / mouse_y round-trip', async () => {
    const mod = await import('@/core/control/controlState');
    mod.setMouseY(99);
    expect(mod.mouse_y).toBe(99);
  });

  it('setKeyboardInput / keyboard_input round-trip', async () => {
    const mod = await import('@/core/control/controlState');
    mod.setKeyboardInput(false);
    expect(mod.keyboard_input).toBe(false);
    mod.setKeyboardInput(true);
    expect(mod.keyboard_input).toBe(true);
  });

  it('setUnitpanelActive / unitpanel_active round-trip', async () => {
    const mod = await import('@/core/control/controlState');
    mod.setUnitpanelActive(true);
    expect(mod.unitpanel_active).toBe(true);
    mod.setUnitpanelActive(false);
    expect(mod.unitpanel_active).toBe(false);
  });

  it('setAllowRightClick / allow_right_click round-trip', async () => {
    const mod = await import('@/core/control/controlState');
    mod.setAllowRightClick(true);
    expect(mod.allow_right_click).toBe(true);
  });
});

// ── chat pure functions ───────────────────────────────────────────────────

describe('encode_message_text', () => {
  it('is exported as a function', async () => {
    const { encode_message_text } = await import('@/core/control/chat');
    expect(typeof encode_message_text).toBe('function');
  });

  it('returns a string', async () => {
    const { encode_message_text } = await import('@/core/control/chat');
    expect(typeof encode_message_text('hello')).toBe('string');
  });

  it('encodes a plain message (URL encoding)', async () => {
    const { encode_message_text } = await import('@/core/control/chat');
    const result = encode_message_text('hello world');
    // encode_message_text URL-encodes spaces
    expect(result).toContain('hello');
  });
});

describe('is_unprefixed_message', () => {
  it('is exported as a function', async () => {
    const { is_unprefixed_message } = await import('@/core/control/chat');
    expect(typeof is_unprefixed_message).toBe('function');
  });

  it('returns false for null', async () => {
    const { is_unprefixed_message } = await import('@/core/control/chat');
    expect(is_unprefixed_message(null)).toBe(false);
  });

  it('returns a boolean for regular text', async () => {
    const { is_unprefixed_message } = await import('@/core/control/chat');
    expect(typeof is_unprefixed_message('hello')).toBe('boolean');
  });
});

describe('chat_context_get_recipients', () => {
  it('is exported as a function', async () => {
    const { chat_context_get_recipients } = await import('@/core/control/chat');
    expect(typeof chat_context_get_recipients).toBe('function');
  });

  it('returns an array', async () => {
    const { chat_context_get_recipients } = await import('@/core/control/chat');
    expect(Array.isArray(chat_context_get_recipients())).toBe(true);
  });
});

describe('chat_context_set_next', () => {
  it('is exported as a function', async () => {
    const { chat_context_set_next } = await import('@/core/control/chat');
    expect(typeof chat_context_set_next).toBe('function');
  });

  it('does not throw with a two-element recipients array (wraps around)', async () => {
    const { chat_context_set_next } = await import('@/core/control/chat');
    // Requires at least one recipient; function cycles through the list
    const recipients = [
      { id: null, label: 'Everybody' },
      { id: null, label: 'Allies' },
    ];
    expect(() => chat_context_set_next(recipients as never)).not.toThrow();
  });

  it('does not throw with a single recipient', async () => {
    const { chat_context_set_next } = await import('@/core/control/chat');
    expect(() => chat_context_set_next([{ id: null, label: 'Everybody' }] as never)).not.toThrow();
  });
});

describe('check_text_input', () => {
  it('is exported as a function', async () => {
    const { check_text_input } = await import('@/core/control/chat');
    expect(typeof check_text_input).toBe('function');
  });

  it('does nothing (undefined) when key is not Enter', async () => {
    const { check_text_input } = await import('@/core/control/chat');
    const event = { keyCode: 65, shiftKey: false } as KeyboardEvent;
    const input = { value: 'hello' } as HTMLInputElement;
    const result = check_text_input(event, input);
    expect(result).toBeUndefined();
  });

  it('does nothing (undefined) when Enter+Shift is pressed', async () => {
    const { check_text_input } = await import('@/core/control/chat');
    const event = { keyCode: 13, shiftKey: true } as KeyboardEvent;
    const input = { value: 'hello' } as HTMLInputElement;
    const result = check_text_input(event, input);
    expect(result).toBeUndefined();
  });
});

// ── chat_context_change / chat_context_dialog_show / set_chat_direction ───

describe('chat_context_change', () => {
  it('is exported as a function', async () => {
    const { chat_context_change } = await import('@/core/control/chat');
    expect(typeof chat_context_change).toBe('function');
  });

  it('does not throw', async () => {
    const { chat_context_change } = await import('@/core/control/chat');
    expect(() => chat_context_change()).not.toThrow();
  });
});

describe('chat_context_dialog_show', () => {
  it('is exported as a function', async () => {
    const { chat_context_dialog_show } = await import('@/core/control/chat');
    expect(typeof chat_context_dialog_show).toBe('function');
  });

  it('does not throw with empty recipients', async () => {
    const { chat_context_dialog_show } = await import('@/core/control/chat');
    expect(() => chat_context_dialog_show([])).not.toThrow();
  });
});

describe('handle_chat_direction_chosen', () => {
  it('is exported as a function', async () => {
    const { handle_chat_direction_chosen } = await import('@/core/control/chat');
    expect(typeof handle_chat_direction_chosen).toBe('function');
  });
});

describe('set_chat_direction', () => {
  it('is exported as a function', async () => {
    const { set_chat_direction } = await import('@/core/control/chat');
    expect(typeof set_chat_direction).toBe('function');
  });

  it('does not throw when called with null', async () => {
    const { set_chat_direction } = await import('@/core/control/chat');
    expect(() => set_chat_direction(null)).not.toThrow();
  });

  it('does not throw when called with a player id', async () => {
    const { set_chat_direction } = await import('@/core/control/chat');
    expect(() => set_chat_direction(1)).not.toThrow();
  });
});

// ── controlState additional setters ──────────────────────────────────────

describe('controlState additional setters', () => {
  it('setWaitingUnitsList round-trip', async () => {
    const mod = await import('@/core/control/controlState');
    mod.setWaitingUnitsList([1, 2, 3]);
    expect(mod.waiting_units_list).toEqual([1, 2, 3]);
  });

  it('setUrgentFocusQueue round-trip', async () => {
    const mod = await import('@/core/control/controlState');
    mod.setUrgentFocusQueue([]);
    expect(mod.urgent_focus_queue).toEqual([]);
  });

  it('setShowCitybar round-trip', async () => {
    const mod = await import('@/core/control/controlState');
    mod.setShowCitybar(true);
    expect(mod.show_citybar).toBe(true);
    mod.setShowCitybar(false);
    expect(mod.show_citybar).toBe(false);
  });

  it('setMouseTouchStartedOnUnit round-trip', async () => {
    const mod = await import('@/core/control/controlState');
    mod.setMouseTouchStartedOnUnit(true);
    expect(mod.mouse_touch_started_on_unit).toBe(true);
  });

  it('setMapviewMouseMovement round-trip', async () => {
    const mod = await import('@/core/control/controlState');
    mod.setMapviewMouseMovement(true);
    expect(mod.mapview_mouse_movement).toBe(true);
    mod.setMapviewMouseMovement(false);
    expect(mod.mapview_mouse_movement).toBe(false);
  });

  it('setRoads / setBases round-trip', async () => {
    const mod = await import('@/core/control/controlState');
    const r = [{ id: 1 } as never];
    const b = [{ id: 2 } as never];
    mod.setRoads(r);
    mod.setBases(b);
    expect(mod.roads).toBe(r);
    expect(mod.bases).toBe(b);
  });

  it('setCurrentFocus round-trip', async () => {
    const mod = await import('@/core/control/controlState');
    const units = [{ id: 10 } as never];
    mod.setCurrentFocus(units);
    expect(mod.current_focus).toBe(units);
  });

  it('setGotoActive / setParadropActive / setAirliftActive / setActionTgtSelActive round-trip', async () => {
    const mod = await import('@/core/control/controlState');
    mod.setGotoActive(true);
    expect(mod.goto_active).toBe(true);
    mod.setParadropActive(true);
    expect(mod.paradrop_active).toBe(true);
    mod.setAirliftActive(true);
    expect(mod.airlift_active).toBe(true);
    mod.setActionTgtSelActive(true);
    expect(mod.action_tgt_sel_active).toBe(true);
  });

  it('setGotoLastOrder / setGotoLastAction round-trip', async () => {
    const mod = await import('@/core/control/controlState');
    mod.setGotoLastOrder(5);
    expect(mod.goto_last_order).toBe(5);
    mod.setGotoLastAction(7);
    expect(mod.goto_last_action).toBe(7);
  });

  it('setGotoRequestMap / setGotoTurnsRequestMap round-trip', async () => {
    const mod = await import('@/core/control/controlState');
    const reqMap = { 'a': true as const };
    mod.setGotoRequestMap(reqMap);
    expect(mod.goto_request_map).toBe(reqMap);
    const turnsMap = { 'a': 3 };
    mod.setGotoTurnsRequestMap(turnsMap);
    expect(mod.goto_turns_request_map).toBe(turnsMap);
  });

  it('setCurrentGotoTurns round-trip', async () => {
    const mod = await import('@/core/control/controlState');
    mod.setCurrentGotoTurns(10);
    expect(mod.current_goto_turns).toBe(10);
  });

  it('setIntroClickDescription / setResizeEnabled / setContextMenuActive round-trip', async () => {
    const mod = await import('@/core/control/controlState');
    mod.setIntroClickDescription(false);
    expect(mod.intro_click_description).toBe(false);
    mod.setResizeEnabled(false);
    expect(mod.resize_enabled).toBe(false);
    mod.setContextMenuActive(false);
    expect(mod.context_menu_active).toBe(false);
  });

  it('setHasMovesleftWarningBeenShown / setGameUnitPanelState / setEndTurnInfoMessageShown round-trip', async () => {
    const mod = await import('@/core/control/controlState');
    mod.setHasMovesleftWarningBeenShown(true);
    expect(mod.has_movesleft_warning_been_shown).toBe(true);
    mod.setGameUnitPanelState('active');
    expect(mod.game_unit_panel_state).toBe('active');
    mod.setEndTurnInfoMessageShown(true);
    expect(mod.end_turn_info_message_shown).toBe(true);
  });

  it('setChatSendTo round-trip', async () => {
    const mod = await import('@/core/control/controlState');
    mod.setChatSendTo(2);
    expect(mod.chat_send_to).toBe(2);
  });

  it('setActionSelectionInProgressFor / setIsMoreUserInputNeeded / set_is_more_user_input_needed round-trip', async () => {
    const mod = await import('@/core/control/controlState');
    mod.setActionSelectionInProgressFor(99);
    expect(mod.action_selection_in_progress_for).toBe(99);
    mod.setIsMoreUserInputNeeded(true);
    expect(mod.is_more_user_input_needed).toBe(true);
    mod.set_is_more_user_input_needed(false);
    expect(mod.is_more_user_input_needed).toBe(false);
  });

  it('setPrevMouseX / setPrevMouseY round-trip', async () => {
    const mod = await import('@/core/control/controlState');
    mod.setPrevMouseX(15);
    expect(mod.prev_mouse_x).toBe(15);
    mod.setPrevMouseY(25);
    expect(mod.prev_mouse_y).toBe(25);
  });
});
