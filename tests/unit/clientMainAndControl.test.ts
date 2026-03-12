/**
 * Unit tests for client/clientMain.ts and core/control.ts
 */
import { describe, it, expect } from 'vitest';

describe('client/clientMain', () => {
  it('setClientState is exported as a function', async () => {
    const { setClientState } = await import('@/client/clientMain');
    expect(typeof setClientState).toBe('function');
  });

  it('setClientState does not throw', async () => {
    const { setClientState } = await import('@/client/clientMain');
    expect(() => setClientState(0)).not.toThrow();
  });

  it('setupWindowSize is exported as a function', async () => {
    const { setupWindowSize } = await import('@/client/clientMain');
    expect(typeof setupWindowSize).toBe('function');
  });

  it('setupWindowSize does not throw', async () => {
    const { setupWindowSize } = await import('@/client/clientMain');
    expect(() => setupWindowSize()).not.toThrow();
  });

  it('setDefaultMapviewActive is exported as a function', async () => {
    const { setDefaultMapviewActive } = await import('@/client/clientMain');
    expect(typeof setDefaultMapviewActive).toBe('function');
  });

  it('showNewGameMessage is exported as a function', async () => {
    const { showNewGameMessage } = await import('@/client/clientMain');
    expect(typeof showNewGameMessage).toBe('function');
  });
});

describe('core/control', () => {
  it('control_init is exported as a function', async () => {
    const { control_init } = await import('@/core/control');
    expect(typeof control_init).toBe('function');
  });

  it('control_init does not throw', async () => {
    const { control_init } = await import('@/core/control');
    expect(() => control_init()).not.toThrow();
  });
});

describe('showEndgameDialog', () => {
  it('is exported as a function', async () => {
    const { showEndgameDialog } = await import('@/client/clientMain');
    expect(typeof showEndgameDialog).toBe('function');
  });

  it('does not throw with empty endgamePlayerInfo', async () => {
    const { showEndgameDialog } = await import('@/client/clientMain');
    const { store } = await import('@/data/store');
    store.endgamePlayerInfo = [];
    expect(() => showEndgameDialog()).not.toThrow();
  });
});
