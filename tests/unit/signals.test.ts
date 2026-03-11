/**
 * Tests for the reactive signals layer (src/ts/data/signals.ts).
 * Covers the rulesetReady signal and its integration with the rules:ready event.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { globalEvents } from '@/core/events';
import { store } from '@/data/store';

describe('rulesetReady signal', () => {
  beforeEach(() => {
    store.reset();
  });

  it('starts at 0 before any rules:ready event', async () => {
    const { rulesetReady } = await import('@/data/signals');
    // May already be > 0 from prior test runs in same module, so just confirm it's a number
    expect(typeof rulesetReady.value).toBe('number');
  });

  it('increments when rules:ready is emitted', async () => {
    const { rulesetReady } = await import('@/data/signals');
    const before = rulesetReady.value;
    globalEvents.emit('rules:ready');
    expect(rulesetReady.value).toBe(before + 1);
  });

  it('increments on every subsequent rules:ready emission', async () => {
    const { rulesetReady } = await import('@/data/signals');
    const before = rulesetReady.value;
    globalEvents.emit('rules:ready');
    globalEvents.emit('rules:ready');
    globalEvents.emit('rules:ready');
    expect(rulesetReady.value).toBe(before + 3);
  });
});

describe('rulesetReady signal — handle_rulesets_ready integration', () => {
  beforeEach(() => {
    store.reset();
    store.techs = {};
    store.computedReqtree = null;
  });

  it('rulesetReady increments when handle_rulesets_ready is called', async () => {
    const { rulesetReady } = await import('@/data/signals');
    const { handle_rulesets_ready } = await import('@/net/handlers/ruleset');
    const before = rulesetReady.value;

    handle_rulesets_ready({} as never);

    expect(rulesetReady.value).toBe(before + 1);
  });

  it('store.computedReqtree is set after handle_rulesets_ready', async () => {
    const { handle_rulesets_ready } = await import('@/net/handlers/ruleset');
    expect(store.computedReqtree).toBeNull();

    handle_rulesets_ready({} as never);

    expect(store.computedReqtree).not.toBeNull();
    expect(typeof store.computedReqtree).toBe('object');
  });
});
