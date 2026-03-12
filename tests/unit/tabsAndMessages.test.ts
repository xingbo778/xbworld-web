/**
 * Unit tests for ui/tabs.ts and core/messages.ts pure functions.
 */
import { describe, it, expect, beforeEach } from 'vitest';

// ── tabs ──────────────────────────────────────────────────────────────────

function makeTabWidget(): { container: HTMLElement; cleanup: () => void } {
  const container = document.createElement('div');
  container.id = 'test-tabs-widget';

  // Tab nav
  const ul = document.createElement('ul');
  for (let i = 0; i < 3; i++) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#test-panel-${i}`;
    a.textContent = `Tab ${i}`;
    li.appendChild(a);
    ul.appendChild(li);
  }
  container.appendChild(ul);

  // Panels
  for (let i = 0; i < 3; i++) {
    const div = document.createElement('div');
    div.id = `test-panel-${i}`;
    div.textContent = `Content ${i}`;
    container.appendChild(div);
  }

  document.body.appendChild(container);
  return { container, cleanup: () => document.body.removeChild(container) };
}

describe('initTabs', () => {
  it('is exported as a function', async () => {
    const { initTabs } = await import('@/ui/tabs');
    expect(typeof initTabs).toBe('function');
  });

  it('does not throw when selector matches nothing', async () => {
    const { initTabs } = await import('@/ui/tabs');
    expect(() => initTabs('#nonexistent-tabs-xyz')).not.toThrow();
  });

  it('does not throw for a valid tab widget', async () => {
    const { initTabs } = await import('@/ui/tabs');
    const { cleanup } = makeTabWidget();
    expect(() => initTabs('#test-tabs-widget')).not.toThrow();
    cleanup();
  });

  it('shows first panel by default (active=0)', async () => {
    const { initTabs } = await import('@/ui/tabs');
    const { cleanup } = makeTabWidget();
    initTabs('#test-tabs-widget', { active: 0 });
    const panel0 = document.getElementById('test-panel-0');
    expect(panel0?.style.display).not.toBe('none');
    cleanup();
  });
});

describe('setActiveTab / getActiveTab', () => {
  it('setActiveTab does not throw when selector matches nothing', async () => {
    const { setActiveTab } = await import('@/ui/tabs');
    expect(() => setActiveTab('#nonexistent', 1)).not.toThrow();
  });

  it('getActiveTab returns 0 (default) when selector matches nothing', async () => {
    const { getActiveTab } = await import('@/ui/tabs');
    expect(getActiveTab('#nonexistent')).toBe(0);
  });

  it('setActiveTab activates the given tab index', async () => {
    const { initTabs, setActiveTab, getActiveTab } = await import('@/ui/tabs');
    const { cleanup } = makeTabWidget();
    initTabs('#test-tabs-widget', { active: 0 });
    setActiveTab('#test-tabs-widget', 2);
    expect(getActiveTab('#test-tabs-widget')).toBe(2);
    cleanup();
  });
});

// ── messages ──────────────────────────────────────────────────────────────

describe('reclassify_chat_message', () => {
  it('is exported as a function', async () => {
    const { reclassify_chat_message } = await import('@/core/messages');
    expect(typeof reclassify_chat_message).toBe('function');
  });

  it('returns a number for regular text', async () => {
    const { reclassify_chat_message } = await import('@/core/messages');
    expect(typeof reclassify_chat_message('hello world')).toBe('number');
  });

  it('returns a number for null input', async () => {
    const { reclassify_chat_message } = await import('@/core/messages');
    expect(typeof reclassify_chat_message(null)).toBe('number');
  });
});

describe('get_chatbox_text / clear_chatbox', () => {
  it('get_chatbox_text returns null or string', async () => {
    const { get_chatbox_text } = await import('@/core/messages');
    const result = get_chatbox_text();
    expect(result === null || typeof result === 'string').toBe(true);
  });

  it('clear_chatbox does not throw', async () => {
    const { clear_chatbox } = await import('@/core/messages');
    expect(() => clear_chatbox()).not.toThrow();
  });
});

describe('chatbox_clip_messages', () => {
  it('does not throw with no arguments', async () => {
    const { chatbox_clip_messages } = await import('@/core/messages');
    expect(() => chatbox_clip_messages()).not.toThrow();
  });

  it('does not throw with a numeric argument', async () => {
    const { chatbox_clip_messages } = await import('@/core/messages');
    expect(() => chatbox_clip_messages(50)).not.toThrow();
  });
});

describe('max_chat_message_length', () => {
  it('is exported as a number', async () => {
    const { max_chat_message_length } = await import('@/core/messages');
    expect(typeof max_chat_message_length).toBe('number');
    expect(max_chat_message_length).toBeGreaterThan(0);
  });
});

// ── wait_for_text ──────────────────────────────────────────────────────────

describe('wait_for_text', () => {
  it('is exported as a function', async () => {
    const { wait_for_text } = await import('@/core/messages');
    expect(typeof wait_for_text).toBe('function');
  });

  it('calls runnable immediately when text is already in the chatbox', async () => {
    const { wait_for_text, add_chatbox_text, message_log } = await import('@/core/messages');
    const { clipChatMessages } = await import('@/components/ChatBox');

    // Seed chatbox with a known string
    message_log.fireNow();
    clipChatMessages(0);
    add_chatbox_text({ message: 'target-string-xyz', event: 0, conn_id: 0, tile: -1 });
    message_log.fireNow();

    let called = false;
    wait_for_text('target-string-xyz', () => { called = true; });
    expect(called).toBe(true);
  });

  it('does not call runnable when text is absent (no timer advance)', async () => {
    const { wait_for_text, message_log } = await import('@/core/messages');
    const { clipChatMessages } = await import('@/components/ChatBox');
    const { vi } = await import('vitest');

    vi.useFakeTimers();
    message_log.fireNow();
    clipChatMessages(0);

    let called = false;
    wait_for_text('text-that-is-not-there', () => { called = true; });
    expect(called).toBe(false);
    vi.useRealTimers();
  });

  it('calls runnable after retry when text appears in chatbox', async () => {
    const { wait_for_text, add_chatbox_text, message_log } = await import('@/core/messages');
    const { clipChatMessages } = await import('@/components/ChatBox');
    const { vi } = await import('vitest');

    vi.useFakeTimers();
    message_log.fireNow();
    clipChatMessages(0);

    let called = false;
    wait_for_text('delayed-text-abc', () => { called = true; });
    expect(called).toBe(false);

    // Add text and flush synchronously before advancing timers
    add_chatbox_text({ message: 'delayed-text-abc', event: 0, conn_id: 0, tile: -1 });
    message_log.fireNow();

    // Advance past the 100 ms retry interval
    vi.advanceTimersByTime(150);
    expect(called).toBe(true);
    vi.useRealTimers();
  });
});
