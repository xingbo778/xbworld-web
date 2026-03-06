import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  clientState,
  canClientChangeView,
  canClientControl,
  canClientIssueOrders,
  clientIsObserver,
} from '@/client/clientState';
import { ClientState } from '@/core/constants';
import { store } from '@/data/store';

describe('clientState', () => {
  beforeEach(() => {
    store.civclientState = ClientState.INITIAL;
    store.client = { conn: { id: 0, playing: null } };
    store.observing = false;
  });

  it('should return INITIAL when civclientState is not set', () => {
    expect(clientState()).toBe(ClientState.INITIAL);
  });

  it('should return the current state from store.civclientState', () => {
    store.civclientState = ClientState.RUNNING;
    expect(clientState()).toBe(ClientState.RUNNING);
  });
});

describe('clientIsObserver', () => {
  beforeEach(() => {
    store.client = { conn: { id: 0, playing: null } };
    store.observing = false;
  });

  /**
   * REGRESSION: Pitfall #9 — Optional chaining on uninitialized client.
   *
   * When client or client.conn is not initialized, the TS version with
   * `c?.conn?.playing == null` would return true (undefined == null → true),
   * incorrectly marking the player as an observer. This broke
   * advance_unit_focus() which skips observers, preventing the map from
   * centering on the player's units at game start.
   *
   * Legacy behavior: throws an error when client.conn is undefined,
   * effectively returning a non-true value to the caller.
   *
   * Fix: Return false when client or conn is not initialized.
   */
  it('should return false when client is undefined (not observer)', () => {
    store.client = undefined as any;
    store.observing = false;
    expect(clientIsObserver()).toBe(false);
  });

  it('should return false when client is null', () => {
    store.client = null as any;
    store.observing = false;
    expect(clientIsObserver()).toBe(false);
  });

  it('should return false when client.conn is undefined', () => {
    store.client = {} as any;
    store.observing = false;
    expect(clientIsObserver()).toBe(false);
  });

  it('should return false when client.conn is null', () => {
    store.client = { conn: null } as any;
    store.observing = false;
    expect(clientIsObserver()).toBe(false);
  });

  it('should return false when playing is set and not observer', () => {
    store.client = { conn: { id: 0, playing: { playerno: 0 } as any, observer: false } };
    store.observing = false;
    expect(clientIsObserver()).toBe(false);
  });

  it('should return true when playing is null (observer)', () => {
    store.client = { conn: { id: 0, playing: null, observer: false } };
    store.observing = false;
    expect(clientIsObserver()).toBe(true);
  });

  it('should return true when conn.observer is true', () => {
    store.client = { conn: { id: 0, playing: { playerno: 0 } as any, observer: true } };
    store.observing = false;
    expect(clientIsObserver()).toBe(true);
  });

  it('should return true when store.observing is true', () => {
    store.client = { conn: { id: 0, playing: { playerno: 0 } as any, observer: false } };
    store.observing = true;
    expect(clientIsObserver()).toBe(true);
  });
});

describe('canClientControl', () => {
  beforeEach(() => {
    store.client = { conn: { id: 0, playing: null } };
    store.observing = false;
  });

  it('should return true when not observer', () => {
    store.client = { conn: { id: 0, playing: { playerno: 0 } as any, observer: false } };
    store.observing = false;
    expect(canClientControl()).toBe(true);
  });

  it('should return false when observer', () => {
    store.client = { conn: { id: 0, playing: null, observer: false } };
    store.observing = false;
    expect(canClientControl()).toBe(false);
  });

  /**
   * REGRESSION: When client is uninitialized, canClientControl should
   * return true (not observer), not false.
   */
  it('should return true when client is uninitialized', () => {
    store.client = undefined as any;
    store.observing = false;
    expect(canClientControl()).toBe(true);
  });
});

describe('canClientIssueOrders', () => {
  beforeEach(() => {
    store.client = { conn: { id: 0, playing: null } };
    store.observing = false;
    store.civclientState = ClientState.INITIAL;
  });

  it('should return true when can control and running', () => {
    store.client = { conn: { id: 0, playing: { playerno: 0 } as any, observer: false } };
    store.observing = false;
    store.civclientState = ClientState.RUNNING;
    expect(canClientIssueOrders()).toBe(true);
  });

  it('should return false when observer', () => {
    store.client = { conn: { id: 0, playing: null, observer: false } };
    store.observing = false;
    store.civclientState = ClientState.RUNNING;
    expect(canClientIssueOrders()).toBe(false);
  });

  it('should return false when not running', () => {
    store.client = { conn: { id: 0, playing: { playerno: 0 } as any, observer: false } };
    store.observing = false;
    store.civclientState = ClientState.PREPARING;
    expect(canClientIssueOrders()).toBe(false);
  });
});

describe('canClientChangeView', () => {
  beforeEach(() => {
    store.client = { conn: { id: 0, playing: null } };
    store.observing = false;
    store.civclientState = ClientState.INITIAL;
  });

  it('should return true when playing and running', () => {
    store.client = { conn: { id: 0, playing: { playerno: 0 } as any, observer: false } };
    store.observing = false;
    store.civclientState = ClientState.RUNNING;
    expect(canClientChangeView()).toBe(true);
  });

  it('should return false when not running', () => {
    store.client = { conn: { id: 0, playing: { playerno: 0 } as any, observer: false } };
    store.observing = false;
    store.civclientState = ClientState.INITIAL;
    expect(canClientChangeView()).toBe(false);
  });
});
