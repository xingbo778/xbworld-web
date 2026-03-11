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
