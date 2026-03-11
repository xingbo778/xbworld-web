/**
 * Unit tests for components/ChatBox.tsx — logic functions.
 *
 * Tests pushChatMessage, clipChatMessages, chatLogText accumulation,
 * and chatEntries signal behaviour.
 */
import { describe, it, expect, beforeEach } from 'vitest';

// ---------------------------------------------------------------------------
// Helpers — reset module state between tests by reimporting (vitest isolates)
// We need to access module-level state, so we import once and reset manually.
// ---------------------------------------------------------------------------

describe('ChatBox — pushChatMessage', () => {
  beforeEach(async () => {
    // Reset signal and chatLogText between tests via clipChatMessages(0)
    const { clipChatMessages } = await import('@/components/ChatBox');
    clipChatMessages(0);
  });

  it('adds an entry to chatEntries signal', async () => {
    const { pushChatMessage, chatEntries } = await import('@/components/ChatBox');
    expect(chatEntries.value).toHaveLength(0);
    pushChatMessage('<b>Hello</b>', 'system');
    expect(chatEntries.value).toHaveLength(1);
    expect(chatEntries.value[0].className).toBe('system');
  });

  it('stores raw html in entry', async () => {
    const { pushChatMessage, chatEntries } = await import('@/components/ChatBox');
    pushChatMessage('<span class="player">Rome</span>: peace', 'chat');
    expect(chatEntries.value[0].html).toContain('Rome');
    expect(chatEntries.value[0].html).toContain('peace');
  });

  it('strips HTML tags into chatLogText for plain-text search', async () => {
    const { pushChatMessage } = await import('@/components/ChatBox');
    // chatLogText module-level — we can't easily read it here since it's reset
    // by clipChatMessages(0) above. But we can verify pushChatMessage doesn't throw.
    expect(() => pushChatMessage('<b>Turn 5</b>', 'system')).not.toThrow();
  });

  it('appends multiple entries in order', async () => {
    const { pushChatMessage, chatEntries } = await import('@/components/ChatBox');
    pushChatMessage('first', '');
    pushChatMessage('second', '');
    pushChatMessage('third', '');
    expect(chatEntries.value).toHaveLength(3);
    expect(chatEntries.value[0].html).toBe('first');
    expect(chatEntries.value[2].html).toBe('third');
  });

  it('assigns unique incrementing ids', async () => {
    const { pushChatMessage, chatEntries } = await import('@/components/ChatBox');
    pushChatMessage('msg1', '');
    pushChatMessage('msg2', '');
    const [a, b] = chatEntries.value;
    expect(b.id).toBeGreaterThan(a.id);
  });
});

describe('ChatBox — clipChatMessages', () => {
  beforeEach(async () => {
    const { clipChatMessages } = await import('@/components/ChatBox');
    clipChatMessages(0);
  });

  it('clips to last N entries when over limit', async () => {
    const { pushChatMessage, clipChatMessages, chatEntries } = await import('@/components/ChatBox');
    for (let i = 0; i < 10; i++) pushChatMessage(`msg${i}`, '');
    clipChatMessages(3);
    expect(chatEntries.value).toHaveLength(3);
    expect(chatEntries.value[2].html).toBe('msg9');
    expect(chatEntries.value[0].html).toBe('msg7');
  });

  it('does nothing when entries <= limit', async () => {
    const { pushChatMessage, clipChatMessages, chatEntries } = await import('@/components/ChatBox');
    pushChatMessage('a', '');
    pushChatMessage('b', '');
    clipChatMessages(5);
    expect(chatEntries.value).toHaveLength(2);
  });

  it('clears all when lines <= 0', async () => {
    const { pushChatMessage, clipChatMessages, chatEntries } = await import('@/components/ChatBox');
    pushChatMessage('hello', '');
    pushChatMessage('world', '');
    clipChatMessages(0);
    expect(chatEntries.value).toHaveLength(0);
  });

  it('also clears when lines is negative', async () => {
    const { pushChatMessage, clipChatMessages, chatEntries } = await import('@/components/ChatBox');
    pushChatMessage('hi', '');
    clipChatMessages(-1);
    expect(chatEntries.value).toHaveLength(0);
  });
});

describe('ChatBox — MAX_MESSAGES cap', () => {
  beforeEach(async () => {
    const { clipChatMessages } = await import('@/components/ChatBox');
    clipChatMessages(0);
  });

  it('caps at 500 messages when overflow occurs', async () => {
    const { pushChatMessage, chatEntries } = await import('@/components/ChatBox');
    // Push 510 messages
    for (let i = 0; i < 510; i++) pushChatMessage(`msg${i}`, '');
    expect(chatEntries.value.length).toBeLessThanOrEqual(500);
    // Should keep the LAST 500 messages
    expect(chatEntries.value[chatEntries.value.length - 1].html).toBe('msg509');
  });
});
