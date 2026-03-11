/**
 * Tests for freeze/thaw and processing packet handlers.
 * These handlers set store.frozen but emit no globalEvents.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { store } from '@/data/store';

beforeEach(() => {
  store.reset();
});

describe('handle_processing_started / handle_processing_finished', () => {
  it('handle_processing_started sets store.frozen to true', async () => {
    const { handle_processing_started } = await import('@/net/handlers/freezeThaw');
    store.frozen = false;
    handle_processing_started({} as never);
    expect(store.frozen).toBe(true);
  });

  it('handle_processing_finished sets store.frozen to false', async () => {
    const { handle_processing_finished } = await import('@/net/handlers/freezeThaw');
    store.frozen = true;
    handle_processing_finished({} as never);
    expect(store.frozen).toBe(false);
  });
});

describe('handle_freeze_hint / handle_thaw_hint', () => {
  it('handle_freeze_hint sets store.frozen to true', async () => {
    const { handle_freeze_hint } = await import('@/net/handlers/freezeThaw');
    store.frozen = false;
    handle_freeze_hint({} as never);
    expect(store.frozen).toBe(true);
  });

  it('handle_thaw_hint sets store.frozen to false', async () => {
    const { handle_thaw_hint } = await import('@/net/handlers/freezeThaw');
    store.frozen = true;
    handle_thaw_hint({} as never);
    expect(store.frozen).toBe(false);
  });
});

describe('handle_freeze_client / handle_thaw_client', () => {
  it('handle_freeze_client sets store.frozen to true', async () => {
    const { handle_freeze_client } = await import('@/net/handlers/freezeThaw');
    store.frozen = false;
    handle_freeze_client({} as never);
    expect(store.frozen).toBe(true);
  });

  it('handle_thaw_client sets store.frozen to false', async () => {
    const { handle_thaw_client } = await import('@/net/handlers/freezeThaw');
    store.frozen = true;
    handle_thaw_client({} as never);
    expect(store.frozen).toBe(false);
  });
});

describe('handle_investigate_started / handle_investigate_finished', () => {
  it('handle_investigate_started is a no-op', async () => {
    const { handle_investigate_started } = await import('@/net/handlers/freezeThaw');
    expect(() => handle_investigate_started({} as never)).not.toThrow();
    expect(store.frozen).toBe(false); // unchanged
  });

  it('handle_investigate_finished is a no-op', async () => {
    const { handle_investigate_finished } = await import('@/net/handlers/freezeThaw');
    expect(() => handle_investigate_finished({} as never)).not.toThrow();
    expect(store.frozen).toBe(false); // unchanged
  });
});
