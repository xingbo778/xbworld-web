/**
 * Unit tests for net/connection.ts
 *
 * Focuses on the reconnect state machine: delay schedule, connectionState
 * transitions, markServerShutdown flag, and banner logic.
 * WebSocket itself is mocked via jsdom globals.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { store } from '@/data/store';

// ---------------------------------------------------------------------------
// Mock WebSocket before importing connection.ts
// ---------------------------------------------------------------------------
class MockWebSocket {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  readyState = MockWebSocket.OPEN;
  url: string;
  onopen: ((e: Event) => void) | null = null;
  onclose: ((e: CloseEvent) => void) | null = null;
  onerror: ((e: Event) => void) | null = null;
  onmessage: ((e: MessageEvent) => void) | null = null;

  constructor(url: string) { this.url = url; }
  send(_data: string) {}
  close(_code?: number, _reason?: string) {}
}
(globalThis as any).WebSocket = MockWebSocket;

// Mock swal so it doesn't throw
vi.mock('@/components/Dialogs/SwalDialog', () => ({ swal: vi.fn() }));
// Mock blockUI/unblockUI
vi.mock('@/utils/dom', async (importOriginal) => ({
  ...(await importOriginal() as object),
  blockUI: vi.fn(),
  unblockUI: vi.fn(),
}));

import {
  RECONNECT_DELAYS_MS,
  markServerShutdown,
  websocket_init,
  _resetReconnectStateForTests,
} from '@/net/connection';

/* eslint-disable @typescript-eslint/no-explicit-any */

// Stub localStorage — jsdom localStorage may not expose getItem as a function
// in some vitest environments. Replace it unconditionally with a minimal stub.
Object.defineProperty(globalThis, 'localStorage', {
  value: {
    getItem: (_key: string) => null,
    setItem: (_key: string, _val: string) => {},
    removeItem: (_key: string) => {},
    clear: () => {},
    length: 0,
    key: (_index: number) => null,
  },
  writable: true,
  configurable: true,
});

// ---------------------------------------------------------------------------
// Reconnect delays
// ---------------------------------------------------------------------------

describe('RECONNECT_DELAYS_MS', () => {
  it('has 5 entries', () => {
    expect(RECONNECT_DELAYS_MS).toHaveLength(5);
  });

  it('follows exponential backoff: 1s/2s/4s/8s/16s', () => {
    expect(RECONNECT_DELAYS_MS).toEqual([1000, 2000, 4000, 8000, 16000]);
  });

  it('max total wait is 31 seconds', () => {
    const total = RECONNECT_DELAYS_MS.reduce((a, b) => a + b, 0);
    expect(total).toBe(31000);
  });
});

// ---------------------------------------------------------------------------
// store.connectionState
// ---------------------------------------------------------------------------

describe('store.connectionState', () => {
  it('initialises as "connected"', () => {
    expect(store.connectionState).toBe('connected');
  });

  it('can be set to "reconnecting"', () => {
    store.connectionState = 'reconnecting';
    expect(store.connectionState).toBe('reconnecting');
    store.connectionState = 'connected'; // restore
  });

  it('can be set to "disconnected"', () => {
    store.connectionState = 'disconnected';
    expect(store.connectionState).toBe('disconnected');
    store.connectionState = 'connected'; // restore
  });
});

// ---------------------------------------------------------------------------
// markServerShutdown
// ---------------------------------------------------------------------------

describe('markServerShutdown', () => {
  it('is exported and callable without errors', () => {
    expect(() => markServerShutdown()).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// websocket_init + onclose reconnect logic (via MockWebSocket)
// ---------------------------------------------------------------------------

describe('websocket_init — onclose reconnect logic', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    _resetReconnectStateForTests();
    // Set civserverport via the window getter so websocket_init can read it
    (window as any).civserverport = '6001';
    // localStorage is stubbed at module level above
  });

  afterEach(() => {
    _resetReconnectStateForTests();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('transitions to "reconnecting" on abnormal close (code 1006)', () => {
    websocket_init();
    const currentWs = (window as any).ws as MockWebSocket;

    // Simulate abnormal close (network drop)
    const closeEvent = new CloseEvent('close', { code: 1006, reason: 'Abnormal Closure' });
    currentWs.onclose!(closeEvent);

    expect(store.connectionState).toBe('reconnecting');
  });

  it('does NOT reconnect on clean close (code 1000)', () => {
    websocket_init();
    const currentWs = (window as any).ws as MockWebSocket;

    const closeEvent = new CloseEvent('close', { code: 1000, reason: 'Normal Closure' });
    currentWs.onclose!(closeEvent);

    expect(store.connectionState).toBe('disconnected');
  });

  it('does NOT reconnect on code 1001 (Going Away)', () => {
    websocket_init();
    const currentWs = (window as any).ws as MockWebSocket;

    const closeEvent = new CloseEvent('close', { code: 1001, reason: 'Going Away' });
    currentWs.onclose!(closeEvent);

    expect(store.connectionState).toBe('disconnected');
  });

  it('does NOT reconnect after markServerShutdown(), sets disconnected', () => {
    websocket_init();
    const currentWs = (window as any).ws as MockWebSocket;

    markServerShutdown(); // server sent #12 before closing

    // Server closes with code 1000 after shutdown
    const closeEvent = new CloseEvent('close', { code: 1000, reason: '' });
    currentWs.onclose!(closeEvent);

    expect(store.connectionState).toBe('disconnected');
  });

  it('schedules reconnect after first delay (1s)', () => {
    websocket_init();
    const currentWs = (window as any).ws as MockWebSocket;

    const closeEvent = new CloseEvent('close', { code: 1006, reason: '' });
    currentWs.onclose!(closeEvent);

    expect(store.connectionState).toBe('reconnecting');

    // After 1 second, a new WebSocket should be created
    vi.advanceTimersByTime(1000);
    // websocket_init was called again internally
    const newWs = (window as any).ws as MockWebSocket;
    expect(newWs).not.toBe(currentWs); // new WS instance
  });

  it('resets to "connected" when reconnect succeeds (onopen fires)', () => {
    websocket_init();
    const currentWs = (window as any).ws as MockWebSocket;

    // Simulate abnormal close → reconnecting
    currentWs.onclose!(new CloseEvent('close', { code: 1006 }));
    expect(store.connectionState).toBe('reconnecting');

    // Fast-forward to reconnect attempt
    vi.advanceTimersByTime(1000);
    const newWs = (window as any).ws as MockWebSocket;

    // Simulate successful reconnect
    newWs.onopen!(new Event('open'));
    expect(store.connectionState).toBe('connected');
  });
});
