/**
 * Tests for ChatContextDialog Preact component and chat:directionChosen wiring.
 */
import { describe, it, expect, beforeEach } from 'vitest';

describe('ChatContextDialog signal API', () => {
  beforeEach(async () => {
    // Reset signal state between tests
    const { closeChatContextDialog } = await import('@/components/ChatContextDialog');
    closeChatContextDialog();
  });

  it('exports showChatContextDialog and closeChatContextDialog as functions', async () => {
    const { showChatContextDialog, closeChatContextDialog } = await import('@/components/ChatContextDialog');
    expect(typeof showChatContextDialog).toBe('function');
    expect(typeof closeChatContextDialog).toBe('function');
  });

  it('chatContextSignal starts closed', async () => {
    const { chatContextSignal, closeChatContextDialog } = await import('@/components/ChatContextDialog');
    closeChatContextDialog();
    expect(chatContextSignal.value.open).toBe(false);
  });

  it('showChatContextDialog opens the dialog with recipients', async () => {
    const { showChatContextDialog, chatContextSignal } = await import('@/components/ChatContextDialog');
    const recipients = [
      { id: null, flag: null, description: 'Everybody' },
      { id: 1, flag: null, description: 'Player 1' },
    ];
    showChatContextDialog(recipients, null);
    expect(chatContextSignal.value.open).toBe(true);
    expect(chatContextSignal.value.recipients).toHaveLength(2);
    expect(chatContextSignal.value.currentId).toBe(null);
  });

  it('closeChatContextDialog sets open to false', async () => {
    const { showChatContextDialog, closeChatContextDialog, chatContextSignal } =
      await import('@/components/ChatContextDialog');
    showChatContextDialog([{ id: null, flag: null, description: 'Everybody' }], null);
    expect(chatContextSignal.value.open).toBe(true);
    closeChatContextDialog();
    expect(chatContextSignal.value.open).toBe(false);
  });

  it('preserves recipients after close', async () => {
    const { showChatContextDialog, closeChatContextDialog, chatContextSignal } =
      await import('@/components/ChatContextDialog');
    const r = [{ id: null, flag: null, description: 'Everybody' }];
    showChatContextDialog(r, null);
    closeChatContextDialog();
    expect(chatContextSignal.value.recipients).toHaveLength(1);
  });

  it('updates currentId correctly', async () => {
    const { showChatContextDialog, chatContextSignal } = await import('@/components/ChatContextDialog');
    showChatContextDialog([{ id: 3, flag: null, description: 'Bob' }], 3);
    expect(chatContextSignal.value.currentId).toBe(3);
  });
});

describe('chat:directionChosen CustomEvent', () => {
  it('dispatching chat:directionChosen does not throw', () => {
    expect(() => {
      document.dispatchEvent(
        new CustomEvent('chat:directionChosen', { detail: { id: null } }),
      );
    }).not.toThrow();
  });

  it('dispatching with a player id does not throw', () => {
    expect(() => {
      document.dispatchEvent(
        new CustomEvent('chat:directionChosen', { detail: { id: 2 } }),
      );
    }).not.toThrow();
  });
});
