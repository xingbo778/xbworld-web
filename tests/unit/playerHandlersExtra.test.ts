/**
 * Additional unit tests for player packet handlers not covered by handlerEvents.test.ts.
 * Covers: handle_web_player_info_addition, handle_player_attribute_chunk, handle_player_diplstate.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { store } from '@/data/store';
import { globalEvents } from '@/core/events';

beforeEach(() => {
  store.reset();
});

describe('handle_web_player_info_addition', () => {
  it('is exported as a function', async () => {
    const { handle_web_player_info_addition } = await import('@/net/handlers/player');
    expect(typeof handle_web_player_info_addition).toBe('function');
  });

  it('updates player data and emits player:updated', async () => {
    const { handle_web_player_info_addition } = await import('@/net/handlers/player');
    store.players[2] = { playerno: 2, name: 'Caesar' } as never;

    const handler = globalEvents.on('player:updated', () => {});
    const spy = { called: false };
    globalEvents.on('player:updated', () => { spy.called = true; });

    handle_web_player_info_addition({ playerno: 2, real_embassy: 5 } as never);

    expect(store.players[2].real_embassy).toBe(5);
    expect(spy.called).toBe(true);
    globalEvents.off('player:updated', handler as never);
  });
});

describe('handle_player_attribute_chunk', () => {
  it('is a no-op (does not throw)', async () => {
    const { handle_player_attribute_chunk } = await import('@/net/handlers/player');
    expect(() => handle_player_attribute_chunk({} as never)).not.toThrow();
  });
});

describe('handle_player_diplstate', () => {
  it('is exported as a function', async () => {
    const { handle_player_diplstate } = await import('@/net/handlers/player');
    expect(typeof handle_player_diplstate).toBe('function');
  });

  it('is a no-op when clientPlaying() is null', async () => {
    // store has no playing conn → clientPlaying() returns null
    const { handle_player_diplstate } = await import('@/net/handlers/player');
    expect(() => handle_player_diplstate({ plr1: 0, plr2: 1, type: 2 } as never)).not.toThrow();
  });
});

// ── Signal integration ────────────────────────────────────────────────────

describe('handle_player_info → playerUpdated / playerCount signals', () => {
  it('handle_player_info emits player:updated → playerUpdated signal increments', async () => {
    const { handle_player_info } = await import('@/net/handlers/player');
    const { playerUpdated } = await import('@/data/signals');
    const before = playerUpdated.value;
    handle_player_info({ playerno: 0, name: 'Caesar', nation: 1, is_alive: true } as never);
    expect(playerUpdated.value).toBe(before + 1);
  });

  it('handle_player_info increments playerCount when new player added', async () => {
    const { handle_player_info } = await import('@/net/handlers/player');
    const { playerCount } = await import('@/data/signals');
    store.players = {};
    handle_player_info({ playerno: 5, name: 'New', nation: 0, is_alive: true } as never);
    expect(playerCount.value).toBe(1);
  });
});
