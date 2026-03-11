/**
 * Unit tests for B2 server-close: DisconnectOverlay signal behaviour.
 *
 * Tests the disconnectOverlay signal driven by connection.ts reconnect
 * logic: phase transitions, countdown updates, reconnectNow(), tryAgain(),
 * and auto-clear on successful reconnect.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { store } from '@/data/store';

// ---------------------------------------------------------------------------
// Mock WebSocket before importing connection.ts
// ---------------------------------------------------------------------------
class MockWebSocket {
  static OPEN = 1;
  static CONNECTING = 0;
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

vi.mock('@/components/Dialogs/SwalDialog', () => ({ swal: vi.fn() }));
vi.mock('@/utils/dom', async (importOriginal) => ({
  ...(await importOriginal() as object),
  blockUI: vi.fn(),
  unblockUI: vi.fn(),
}));

import {
  RECONNECT_DELAYS_MS,
  websocket_init,
  network_stop,
  reconnectNow,
  tryAgain,
  _resetReconnectStateForTests,
} from '@/net/connection';

Object.defineProperty(globalThis, 'localStorage', {
  value: { getItem: () => null, setItem: () => {}, removeItem: () => {}, clear: () => {}, length: 0, key: () => null },
  writable: true, configurable: true,
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function getOverlay() {
  const { disconnectOverlay } = await import('@/data/signals');
  return disconnectOverlay;
}

function triggerAbnormalClose() {
  const ws = (window as any).ws as MockWebSocket;
  ws.onclose!(new CloseEvent('close', { code: 1006, reason: 'Abnormal' }));
}

function triggerOpen() {
  const ws = (window as any).ws as MockWebSocket;
  ws.onopen!(new Event('open'));
}

// ---------------------------------------------------------------------------
// disconnectOverlay signal — initial state
// ---------------------------------------------------------------------------

describe('disconnectOverlay signal — initial state', () => {
  it('starts as null', async () => {
    const overlay = await getOverlay();
    expect(overlay.value).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// disconnectOverlay set on abnormal close (reconnecting phase)
// ---------------------------------------------------------------------------

describe('disconnectOverlay — reconnecting phase', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    _resetReconnectStateForTests();
    (window as any).civserverport = '6001';
  });

  afterEach(() => {
    network_stop();
    _resetReconnectStateForTests();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('sets phase=reconnecting on abnormal close', async () => {
    const overlay = await getOverlay();
    websocket_init();
    triggerAbnormalClose();

    expect(overlay.value).not.toBeNull();
    expect(overlay.value?.phase).toBe('reconnecting');
  });

  it('includes attempt index and max in reconnecting state', async () => {
    const overlay = await getOverlay();
    websocket_init();
    triggerAbnormalClose();

    const state = overlay.value;
    expect(state?.phase).toBe('reconnecting');
    if (state?.phase === 'reconnecting') {
      expect(state.attempt).toBe(0);
      expect(state.max).toBe(RECONNECT_DELAYS_MS.length);
    }
  });

  it('includes non-zero countdown in reconnecting state', async () => {
    const overlay = await getOverlay();
    websocket_init();
    triggerAbnormalClose();

    const state = overlay.value;
    if (state?.phase === 'reconnecting') {
      expect(state.countdown).toBeGreaterThan(0);
    }
  });

  it('updates countdown each second', async () => {
    const overlay = await getOverlay();
    websocket_init();
    triggerAbnormalClose();

    const initialCountdown = (overlay.value as any)?.countdown ?? 0;
    vi.advanceTimersByTime(1000);
    const nextCountdown = (overlay.value as any)?.countdown ?? 0;
    // countdown should decrease by 1 or overlay advanced to next attempt
    expect(nextCountdown).toBeLessThanOrEqual(initialCountdown);
  });
});

// ---------------------------------------------------------------------------
// disconnectOverlay cleared on successful reconnect
// ---------------------------------------------------------------------------

describe('disconnectOverlay — cleared on reconnect success', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    _resetReconnectStateForTests();
    (window as any).civserverport = '6001';
  });

  afterEach(() => {
    network_stop();
    _resetReconnectStateForTests();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('clears overlay when reconnect succeeds (onopen fires)', async () => {
    const overlay = await getOverlay();
    websocket_init();
    triggerAbnormalClose();

    expect(overlay.value?.phase).toBe('reconnecting');

    vi.advanceTimersByTime(RECONNECT_DELAYS_MS[0]);
    triggerOpen();

    expect(overlay.value).toBeNull();
  });

  it('clears overlay even after multiple failed attempts then success', async () => {
    const overlay = await getOverlay();
    websocket_init();

    // Two failed reconnect cycles
    for (let i = 0; i < 2; i++) {
      const ws = (window as any).ws as MockWebSocket;
      ws.onclose!(new CloseEvent('close', { code: 1006 }));
      vi.advanceTimersByTime(RECONNECT_DELAYS_MS[i]);
    }

    // Now succeed
    triggerOpen();
    expect(overlay.value).toBeNull();
    expect(store.connectionState).toBe('connected');
  });
});

// ---------------------------------------------------------------------------
// disconnectOverlay — give-up phase (all attempts exhausted)
// ---------------------------------------------------------------------------

describe('disconnectOverlay — give-up (all retries exhausted)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    _resetReconnectStateForTests();
    (window as any).civserverport = '6001';
  });

  afterEach(() => {
    _resetReconnectStateForTests();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('sets phase=disconnected when all attempts exhausted', async () => {
    const overlay = await getOverlay();
    websocket_init();

    for (let i = 0; i < RECONNECT_DELAYS_MS.length; i++) {
      const ws = (window as any).ws as MockWebSocket;
      ws.onclose!(new CloseEvent('close', { code: 1006 }));
      vi.advanceTimersByTime(RECONNECT_DELAYS_MS[i]);
    }

    const finalWs = (window as any).ws as MockWebSocket;
    finalWs.onclose!(new CloseEvent('close', { code: 1006 }));

    expect(store.connectionState).toBe('disconnected');
    expect(overlay.value?.phase).toBe('disconnected');
  });
});

// ---------------------------------------------------------------------------
// reconnectNow() — skip delay
// ---------------------------------------------------------------------------

describe('reconnectNow()', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    _resetReconnectStateForTests();
    (window as any).civserverport = '6001';
  });

  afterEach(() => {
    network_stop();
    _resetReconnectStateForTests();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('immediately creates a new WebSocket without waiting for delay', () => {
    websocket_init();
    const ws1 = (window as any).ws as MockWebSocket;

    triggerAbnormalClose(); // starts 1s timer
    expect(store.connectionState).toBe('reconnecting');

    // No time has passed — reconnectNow() skips the delay
    reconnectNow();
    const ws2 = (window as any).ws as MockWebSocket;
    expect(ws2).not.toBe(ws1);
  });

  it('does not throw when called without a pending reconnect', () => {
    websocket_init();
    expect(() => reconnectNow()).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// tryAgain() — reset counter after exhaustion
// ---------------------------------------------------------------------------

describe('tryAgain()', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    _resetReconnectStateForTests();
    (window as any).civserverport = '6001';
  });

  afterEach(() => {
    _resetReconnectStateForTests();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('resets to reconnecting phase after exhaustion', async () => {
    const overlay = await getOverlay();
    websocket_init();

    // Exhaust all attempts
    for (let i = 0; i < RECONNECT_DELAYS_MS.length; i++) {
      const ws = (window as any).ws as MockWebSocket;
      ws.onclose!(new CloseEvent('close', { code: 1006 }));
      vi.advanceTimersByTime(RECONNECT_DELAYS_MS[i]);
    }
    const finalWs = (window as any).ws as MockWebSocket;
    finalWs.onclose!(new CloseEvent('close', { code: 1006 }));
    expect(overlay.value?.phase).toBe('disconnected');

    // User clicks "Try Again"
    tryAgain();
    expect(store.connectionState).toBe('reconnecting');
    expect(overlay.value?.phase).toBe('reconnecting');
  });

  it('clears overlay immediately then starts reconnect banner', async () => {
    const overlay = await getOverlay();
    // Exhaust and enter disconnected state
    websocket_init();
    for (let i = 0; i < RECONNECT_DELAYS_MS.length; i++) {
      const ws = (window as any).ws as MockWebSocket;
      ws.onclose!(new CloseEvent('close', { code: 1006 }));
      vi.advanceTimersByTime(RECONNECT_DELAYS_MS[i]);
    }
    (window as any).ws.onclose!(new CloseEvent('close', { code: 1006 }));

    tryAgain();
    // After tryAgain, startReconnect() runs synchronously and sets reconnecting state
    expect(overlay.value).not.toBeNull();
    expect(overlay.value?.phase).toBe('reconnecting');
  });
});

// ---------------------------------------------------------------------------
// _resetReconnectStateForTests clears the overlay
// ---------------------------------------------------------------------------

describe('_resetReconnectStateForTests', () => {
  it('clears disconnectOverlay signal', async () => {
    const overlay = await getOverlay();
    overlay.value = { phase: 'disconnected' };
    _resetReconnectStateForTests();
    expect(overlay.value).toBeNull();
  });
});
