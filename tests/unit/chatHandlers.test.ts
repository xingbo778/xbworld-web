/**
 * Tests for chat and message packet handlers.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { store } from '@/data/store';

beforeEach(() => {
  store.reset();
});

// ── handle_chat_msg ────────────────────────────────────────────────────────

describe('handle_chat_msg', () => {
  it('is exported as a function', async () => {
    const { handle_chat_msg } = await import('@/net/handlers/chat');
    expect(typeof handle_chat_msg).toBe('function');
  });

  it('ignores packets with null message (no throw)', async () => {
    const { handle_chat_msg } = await import('@/net/handlers/chat');
    expect(() => handle_chat_msg({ message: null, conn_id: 0, event: 0, tile: -1 } as never)).not.toThrow();
  });

  it('ignores metamessage strings (no throw)', async () => {
    const { handle_chat_msg } = await import('@/net/handlers/chat');
    // message not in a known connection → metamessage check fires → returns early
    expect(() => handle_chat_msg({ message: '/metamessage test', conn_id: 999, event: 0, tile: -1 } as never)).not.toThrow();
  });

  it('ignores "Metaserver message string" messages', async () => {
    const { handle_chat_msg } = await import('@/net/handlers/chat');
    expect(() => handle_chat_msg({ message: 'Metaserver message string test', conn_id: 999, event: 0, tile: -1 } as never)).not.toThrow();
  });
});

// ── handle_page_msg / handle_page_msg_part ─────────────────────────────────

describe('handle_page_msg + handle_page_msg_part', () => {
  it('are exported as functions', async () => {
    const { handle_page_msg, handle_page_msg_part } = await import('@/net/handlers/chat');
    expect(typeof handle_page_msg).toBe('function');
    expect(typeof handle_page_msg_part).toBe('function');
  });

  it('handle_page_msg does not throw for a valid packet', async () => {
    const { handle_page_msg } = await import('@/net/handlers/chat');
    expect(() => handle_page_msg({ headline: 'News', caption: '', event: 0, parts: 2 } as never)).not.toThrow();
  });

  it('handle_page_msg_part accumulates parts without throwing', async () => {
    const { handle_page_msg, handle_page_msg_part } = await import('@/net/handlers/chat');
    handle_page_msg({ headline: 'Test', caption: '', event: 0, parts: 2 } as never);
    expect(() => handle_page_msg_part({ lines: 'Part one\n' } as never)).not.toThrow();
    // second part completes the message — showDialogMessage is called internally
    expect(() => handle_page_msg_part({ lines: 'Part two' } as never)).not.toThrow();
  });
});

// ── handle_early_chat_msg ──────────────────────────────────────────────────

describe('handle_early_chat_msg', () => {
  it('is exported as a function', async () => {
    const { handle_early_chat_msg } = await import('@/net/handlers/chat');
    expect(typeof handle_early_chat_msg).toBe('function');
  });

  it('delegates to handle_chat_msg (does not throw)', async () => {
    const { handle_early_chat_msg } = await import('@/net/handlers/chat');
    expect(() => handle_early_chat_msg({ message: 'early msg', conn_id: 0, event: 0, tile: -1 } as never)).not.toThrow();
  });
});
