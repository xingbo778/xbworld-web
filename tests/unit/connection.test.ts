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
  network_stop,
  send_request,
  _resetReconnectStateForTests,
  _isPingTimerActiveForTests,
  _isPacketWorkerActiveForTests,
  _isBeforeUnloadHandlerRegisteredForTests,
  check_websocket_ready,
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

  it('exhausts after MAX_RECONNECT_ATTEMPTS and sets disconnected', () => {
    websocket_init();

    // 5 abnormal closes, each triggering a scheduled reconnect attempt
    for (let i = 0; i < RECONNECT_DELAYS_MS.length; i++) {
      const currentWs = (window as any).ws as MockWebSocket;
      currentWs.onclose!(new CloseEvent('close', { code: 1006 }));
      expect(store.connectionState).toBe('reconnecting');
      vi.advanceTimersByTime(RECONNECT_DELAYS_MS[i]);
    }

    // 6th close: reconnect counter exhausted → disconnected, no further timer
    const finalWs = (window as any).ws as MockWebSocket;
    finalWs.onclose!(new CloseEvent('close', { code: 1006 }));
    expect(store.connectionState).toBe('disconnected');

    // Advancing further time must NOT create another WebSocket
    const wsAfterExhaustion = (window as any).ws as MockWebSocket;
    vi.advanceTimersByTime(60000);
    expect((window as any).ws).toBe(wsAfterExhaustion);
  });

  it('markServerShutdown during reconnect prevents further reconnects', () => {
    websocket_init();
    const ws1 = (window as any).ws as MockWebSocket;

    // Abnormal close → reconnecting, timer scheduled
    ws1.onclose!(new CloseEvent('close', { code: 1006 }));
    expect(store.connectionState).toBe('reconnecting');

    // Timer fires → new WS created
    vi.advanceTimersByTime(1000);
    const ws2 = (window as any).ws as MockWebSocket;
    expect(ws2).not.toBe(ws1);

    // Server signals intentional shutdown on the new connection
    markServerShutdown();
    ws2.onclose!(new CloseEvent('close', { code: 1000 }));

    // Must not reconnect — server explicitly shut down
    expect(store.connectionState).toBe('disconnected');
    vi.advanceTimersByTime(60000);
    // No new WS should appear
    expect((window as any).ws).toBe(ws2);
  });
});

// ---------------------------------------------------------------------------
// network_stop
// ---------------------------------------------------------------------------

describe('network_stop', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    _resetReconnectStateForTests();
    (window as any).civserverport = '6001';
    (window as any).ws = null;
  });

  afterEach(() => {
    _resetReconnectStateForTests();
    (window as any).ws = null;
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('cancels a pending reconnect timer so no new WS is created', () => {
    websocket_init();
    const ws1 = (window as any).ws as MockWebSocket;

    ws1.onclose!(new CloseEvent('close', { code: 1006 }));
    expect(store.connectionState).toBe('reconnecting');

    // Stop before the 1-second timer fires
    network_stop();
    expect((window as any).ws).toBeNull();

    // Advance past the scheduled delay — timer should have been cancelled
    vi.advanceTimersByTime(2000);
    expect((window as any).ws).toBeNull();
  });

  it('is safe to call when no WebSocket exists', () => {
    expect(() => network_stop()).not.toThrow();
    expect((window as any).ws).toBeNull();
  });

  it('is safe to call when no reconnect is pending', () => {
    websocket_init();
    network_stop();
    expect((window as any).ws).toBeNull();
    // No timers to cancel — advancing time is harmless
    vi.advanceTimersByTime(5000);
    expect((window as any).ws).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// send_request — readyState guard
// ---------------------------------------------------------------------------

describe('send_request', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    _resetReconnectStateForTests();
    (window as any).civserverport = '6001';
    (window as any).ws = null;
  });

  afterEach(() => {
    network_stop();
    _resetReconnectStateForTests();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('drops silently when ws is null (no error)', () => {
    expect(() => send_request('{"pid":1}')).not.toThrow();
  });

  it('sends payload when readyState is OPEN (1)', () => {
    websocket_init();
    const currentWs = (window as any).ws as MockWebSocket;
    const sendSpy = vi.spyOn(currentWs, 'send');
    currentWs.readyState = MockWebSocket.OPEN;

    send_request('{"pid":1}');

    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledWith('{"pid":1}');
  });

  it('does NOT send when readyState is CONNECTING (0)', () => {
    websocket_init();
    const currentWs = (window as any).ws as MockWebSocket;
    const sendSpy = vi.spyOn(currentWs, 'send');
    currentWs.readyState = MockWebSocket.CONNECTING;

    expect(() => send_request('{"pid":1}')).not.toThrow();
    expect(sendSpy).not.toHaveBeenCalled();
  });

  it('does NOT send when readyState is CLOSING (2)', () => {
    websocket_init();
    const currentWs = (window as any).ws as MockWebSocket;
    const sendSpy = vi.spyOn(currentWs, 'send');
    currentWs.readyState = MockWebSocket.CLOSING;

    expect(() => send_request('{"pid":1}')).not.toThrow();
    expect(sendSpy).not.toHaveBeenCalled();
  });

  it('does NOT send when readyState is CLOSED (3)', () => {
    websocket_init();
    const currentWs = (window as any).ws as MockWebSocket;
    const sendSpy = vi.spyOn(currentWs, 'send');
    currentWs.readyState = MockWebSocket.CLOSED;

    expect(() => send_request('{"pid":1}')).not.toThrow();
    expect(sendSpy).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// B2: network_stop resource cleanup
// ---------------------------------------------------------------------------

describe('network_stop — resource cleanup', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    _resetReconnectStateForTests();
    (window as any).civserverport = '6001';
    (window as any).ws = null;
  });

  afterEach(() => {
    _resetReconnectStateForTests();
    (window as any).ws = null;
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('clears ping_timer on network_stop()', () => {
    websocket_init();
    const currentWs = (window as any).ws as MockWebSocket;
    // Simulate onopen so check_websocket_ready runs and sets ping_timer
    // (In the mock ws.readyState is already OPEN=1, so trigger onopen manually)
    currentWs.onopen!(new Event('open'));
    // Flush the check_websocket_ready promise
    return Promise.resolve().then(() => {
      expect(_isPingTimerActiveForTests()).toBe(true);
      network_stop();
      expect(_isPingTimerActiveForTests()).toBe(false);
    });
  });

  it('removes _beforeUnloadHandler on network_stop()', () => {
    websocket_init();
    const currentWs = (window as any).ws as MockWebSocket;
    currentWs.onopen!(new Event('open'));
    return Promise.resolve().then(() => {
      expect(_isBeforeUnloadHandlerRegisteredForTests()).toBe(true);
      network_stop();
      expect(_isBeforeUnloadHandlerRegisteredForTests()).toBe(false);
    });
  });

  it('is safe to call network_stop() when ping_timer is not active', () => {
    // No websocket_init — no ping_timer
    expect(_isPingTimerActiveForTests()).toBe(false);
    expect(() => network_stop()).not.toThrow();
    expect(_isPingTimerActiveForTests()).toBe(false);
  });

  it('is safe to call network_stop() when _beforeUnloadHandler is not set', () => {
    expect(_isBeforeUnloadHandlerRegisteredForTests()).toBe(false);
    expect(() => network_stop()).not.toThrow();
    expect(_isBeforeUnloadHandlerRegisteredForTests()).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// B2: check_websocket_ready — stops retrying when ws is nulled
// ---------------------------------------------------------------------------

describe('check_websocket_ready — retry loop guard', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    _resetReconnectStateForTests();
    (window as any).civserverport = '6001';
    (window as any).ws = null;
  });

  afterEach(() => {
    _resetReconnectStateForTests();
    (window as any).ws = null;
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('stops retrying when ws is set to null before readyState is OPEN', async () => {
    // Set up a ws in CONNECTING state so check_websocket_ready schedules a retry
    const mockWs = new MockWebSocket('ws://localhost/test');
    mockWs.readyState = MockWebSocket.CONNECTING;
    (window as any).ws = mockWs;

    // Capture any new WebSocket creations (should be none)
    const initialWs = (window as any).ws;

    // Start check_websocket_ready — it will see readyState=CONNECTING and schedule retry
    const promise = check_websocket_ready();

    // Null out ws (simulating network_stop called between check_websocket_ready invocations)
    (window as any).ws = null;

    // Advance time — the retry should fire but immediately return (ws is null)
    vi.advanceTimersByTime(1000);

    await promise;

    // No new WebSocket should have been created
    expect((window as any).ws).toBeNull();
    // Confirm the retry fired and returned safely (no throw)
  });
});

// ---------------------------------------------------------------------------
// connectionBanner signal — replaces imperative DOM prepend
// ---------------------------------------------------------------------------

describe('connectionBanner signal', () => {
  beforeEach(async () => {
    vi.useFakeTimers();
    _resetReconnectStateForTests();
    (window as any).civserverport = '6001';
    (window as any).ws = null;
    // Reset banner
    const { connectionBanner } = await import('@/data/signals');
    connectionBanner.value = null;
  });

  afterEach(() => {
    _resetReconnectStateForTests();
    (window as any).ws = null;
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('connectionBanner signal starts null', async () => {
    const { connectionBanner } = await import('@/data/signals');
    expect(connectionBanner.value).toBeNull();
  });

  it('sets showReload banner when reconnect attempts are exhausted', async () => {
    const { connectionBanner } = await import('@/data/signals');

    websocket_init();
    // Exhaust all reconnect attempts
    for (let i = 0; i < RECONNECT_DELAYS_MS.length; i++) {
      const ws = (window as any).ws as MockWebSocket;
      ws.onclose!(new CloseEvent('close', { code: 1006 }));
      vi.advanceTimersByTime(RECONNECT_DELAYS_MS[i]);
    }
    // Final close — exhausted
    const finalWs = (window as any).ws as MockWebSocket;
    finalWs.onclose!(new CloseEvent('close', { code: 1006 }));

    expect(store.connectionState).toBe('disconnected');
    expect(connectionBanner.value).not.toBeNull();
    expect(connectionBanner.value?.showReload).toBe(true);
  });

  it('clears connectionBanner when reconnect succeeds', async () => {
    const { connectionBanner } = await import('@/data/signals');

    websocket_init();
    const ws1 = (window as any).ws as MockWebSocket;

    // Trigger reconnect
    ws1.onclose!(new CloseEvent('close', { code: 1006 }));
    expect(store.connectionState).toBe('reconnecting');

    // Reconnect timer fires, new ws created
    vi.advanceTimersByTime(1000);
    const ws2 = (window as any).ws as MockWebSocket;

    // New connection opens successfully
    ws2.onopen!(new Event('open'));
    expect(store.connectionState).toBe('connected');
    expect(connectionBanner.value).toBeNull();
  });
});
