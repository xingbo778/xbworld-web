/**
 * Unit tests for server shutdown handling (Task B2).
 *
 * Covers handle_server_shutdown end-to-end:
 *   SD-1  markServerShutdown prevents reconnect after ws.onclose
 *   SD-2  stopGameTimers clears all three recurring intervals
 *   SD-3  network_stop is called (ws becomes null)
 *   SD-4  store.reset is called (game data cleared)
 *   SD-5  store.connectionState is set to 'disconnected'
 *   SD-6  UI notification (swal + chatbox) is emitted
 *   SD-7  Double-shutdown is safe (idempotent)
 *   SD-8  Shutdown during reconnect cancels timers and prevents new WS
 *   SD-9  Shutdown when no WS exists is safe
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { store } from '@/data/store';
import type { City, Player, Tile, Unit } from '@/data/types';

// ---------------------------------------------------------------------------
// WebSocket mock — must be registered BEFORE importing connection/server
// ---------------------------------------------------------------------------
class MockWebSocket {
  static OPEN = 1;
  static CONNECTING = 0;
  static CLOSED = 3;
  readyState = MockWebSocket.OPEN;
  url: string;
  onopen: ((e: Event) => void) | null = null;
  onclose: ((e: CloseEvent) => void) | null = null;
  onerror: ((e: Event) => void) | null = null;
  onmessage: ((e: MessageEvent) => void) | null = null;

  constructor(url: string) { this.url = url; }
  send(_data: string) {}
  close(_code?: number) {
    // Intentionally synchronous in tests to make timer checks deterministic
    this.readyState = MockWebSocket.CLOSED;
  }
}
Object.assign(globalThis, { WebSocket: MockWebSocket as unknown as typeof WebSocket });

// Stub localStorage
Object.defineProperty(globalThis, 'localStorage', {
  value: {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
    length: 0,
    key: () => null,
  },
  writable: true,
  configurable: true,
});

// ---------------------------------------------------------------------------
// Module mocks — via vi.hoisted to avoid TDZ issues
// ---------------------------------------------------------------------------
const { mockSwal, mockAddChatboxText, mockStopGameTimers } = vi.hoisted(() => ({
  mockSwal: vi.fn(),
  mockAddChatboxText: vi.fn(),
  mockStopGameTimers: vi.fn(),
}));

vi.mock('@/components/Dialogs/SwalDialog', () => ({ swal: mockSwal }));
vi.mock('@/utils/dom', () => ({ blockUI: vi.fn(), unblockUI: vi.fn() }));
vi.mock('@/core/messages', () => ({
  message_log: null,
  add_chatbox_text: mockAddChatboxText,
  wait_for_text: vi.fn(),
  clear_chatbox: vi.fn(),
  chatbox_active: false,
}));
vi.mock('@/client/civClient', () => ({
  stopGameTimers: mockStopGameTimers,
  showAuthDialog: vi.fn(),
  showDialogMessage: vi.fn(),
  initCommonIntroDialog: vi.fn(),
}));
vi.mock('@/client/clientState', () => ({
  C_S_PREPARING: 1,
  clientPlaying: () => null,
}));
vi.mock('@/client/clientMain', () => ({ setClientState: vi.fn() }));
vi.mock('@/client/clientCore', () => ({ requestObserveGame: vi.fn() }));
vi.mock('@/core/pages', () => ({
  set_client_page: vi.fn(), get_client_page: vi.fn(() => 0),
  PAGE_MAIN: 0, PAGE_NETWORK: 1, PAGE_START: 2,
}));
vi.mock('@/data/player', () => ({ valid_player_by_number: vi.fn() }));
vi.mock('@/core/log', () => ({ freelog: vi.fn() }));
vi.mock('@/core/pregame', () => ({
  update_player_info_pregame: vi.fn(),
  update_game_info_pregame: vi.fn(),
}));
vi.mock('@/data/map', () => ({ mapInitTopology: vi.fn() }));
vi.mock('@/net/commands', () => ({
  sendClientInfo: vi.fn(),
  sendConnPong: vi.fn(),
  sendChatMessage: vi.fn(),
}));
vi.mock('@/data/serverSettings', () => ({ applySettingEffect: vi.fn() }));
vi.mock('@/net/packhandlers', () => ({ client_handle_packet: vi.fn() }));
vi.mock('@/net/packetConstants', () => ({ packet_chat_msg_req: 26 }));

// ---------------------------------------------------------------------------
// Imports (after mocks)
// ---------------------------------------------------------------------------
import {
  websocket_init,
  network_stop,
  _resetReconnectStateForTests,
  RECONNECT_DELAYS_MS,
  getCurrentWebSocketForTests,
  setCurrentWebSocketForTests,
  setCivserverportForTests,
} from '@/net/connection';
import { handle_server_shutdown } from '@/net/handlers/server';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function resetAll(): void {
  vi.clearAllMocks();
  _resetReconnectStateForTests();
  setCivserverportForTests('6001');
  setCurrentWebSocketForTests(null);
  // Restore game state
  store.tiles = { 42: { index: 42 } as Tile };
  store.players = { 0: { playerno: 0 } as Player };
  store.units = {};
  store.cities = {};
  store.overviewTimerId = setInterval(() => {}, 99999);
  store.statusTimerId = setInterval(() => {}, 99999);
  store.timeoutTimerId = setInterval(() => {}, 99999);
}

function simulateConnected(): void {
  websocket_init();
  const ws = getCurrentWebSocketForTests() as MockWebSocket;
  ws.onopen!(new Event('open'));
}

// ---------------------------------------------------------------------------
// SD-1: markServerShutdown prevents reconnect
// ---------------------------------------------------------------------------
describe('SD-1: markServerShutdown prevents reconnect after ws.onclose', () => {
  beforeEach(() => { vi.useFakeTimers(); resetAll(); });
  afterEach(() => { _resetReconnectStateForTests(); vi.restoreAllMocks(); vi.useRealTimers(); });

  it('after shutdown, no reconnect timer is scheduled', () => {
    simulateConnected();
    handle_server_shutdown({});

    const wsAfterShutdown = getCurrentWebSocketForTests();
    vi.advanceTimersByTime(30000); // past all reconnect delays
    expect(getCurrentWebSocketForTests()).toBe(wsAfterShutdown); // no new WS created
  });

  it('store.connectionState is "disconnected" immediately', () => {
    simulateConnected();
    handle_server_shutdown({});
    expect(store.connectionState).toBe('disconnected');
  });
});

// ---------------------------------------------------------------------------
// SD-2: stopGameTimers is called
// ---------------------------------------------------------------------------
describe('SD-2: stopGameTimers clears game intervals', () => {
  beforeEach(() => { vi.useFakeTimers(); resetAll(); });
  afterEach(() => { _resetReconnectStateForTests(); vi.restoreAllMocks(); vi.useRealTimers(); });

  it('stopGameTimers() is called on shutdown', () => {
    handle_server_shutdown({});
    expect(mockStopGameTimers).toHaveBeenCalledTimes(1);
  });
});

// ---------------------------------------------------------------------------
// SD-3: network_stop is called (ws becomes null)
// ---------------------------------------------------------------------------
describe('SD-3: network_stop is called — ws cleared', () => {
  beforeEach(() => { vi.useFakeTimers(); resetAll(); });
  afterEach(() => { _resetReconnectStateForTests(); vi.restoreAllMocks(); vi.useRealTimers(); });

  it('ws is null after shutdown', () => {
    simulateConnected();
    expect(getCurrentWebSocketForTests()).not.toBeNull();

    handle_server_shutdown({});
    expect(getCurrentWebSocketForTests()).toBeNull();
  });

  it('safe to call shutdown when no ws exists', () => {
    // ws is null (never connected)
    expect(() => handle_server_shutdown({})).not.toThrow();
    expect(getCurrentWebSocketForTests()).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// SD-4: store.reset() is called — game data cleared
// ---------------------------------------------------------------------------
describe('SD-4: store.reset clears game data', () => {
  beforeEach(() => { vi.useFakeTimers(); resetAll(); });
  afterEach(() => { _resetReconnectStateForTests(); vi.restoreAllMocks(); vi.useRealTimers(); });

  it('store.tiles is cleared after shutdown', () => {
    expect(Object.keys(store.tiles).length).toBeGreaterThan(0);
    handle_server_shutdown({});
    expect(store.tiles).toEqual({});
  });

  it('store.players is cleared after shutdown', () => {
    expect(Object.keys(store.players).length).toBeGreaterThan(0);
    handle_server_shutdown({});
    expect(store.players).toEqual({});
  });

  it('store.cities and store.units are cleared', () => {
    store.cities = { 1: { id: 1 } as City };
    store.units = { 1: { id: 1 } as Unit };
    handle_server_shutdown({});
    expect(store.cities).toEqual({});
    expect(store.units).toEqual({});
  });
});

// ---------------------------------------------------------------------------
// SD-5: store.connectionState = 'disconnected'
// ---------------------------------------------------------------------------
describe('SD-5: connectionState transitions to disconnected', () => {
  beforeEach(() => { vi.useFakeTimers(); resetAll(); });
  afterEach(() => { _resetReconnectStateForTests(); vi.restoreAllMocks(); vi.useRealTimers(); });

  it('connectionState is "disconnected" after shutdown from connected', () => {
    store.connectionState = 'connected';
    handle_server_shutdown({});
    expect(store.connectionState).toBe('disconnected');
  });

  it('connectionState is "disconnected" after shutdown from reconnecting', () => {
    store.connectionState = 'reconnecting';
    handle_server_shutdown({});
    expect(store.connectionState).toBe('disconnected');
  });
});

// ---------------------------------------------------------------------------
// SD-6: UI notification — swal + chatbox
// ---------------------------------------------------------------------------
describe('SD-6: UI notification on shutdown', () => {
  beforeEach(() => { vi.useFakeTimers(); resetAll(); });
  afterEach(() => { _resetReconnectStateForTests(); vi.restoreAllMocks(); vi.useRealTimers(); });

  it('swal is called with error type', () => {
    handle_server_shutdown({});
    expect(mockSwal).toHaveBeenCalledTimes(1);
    const [title, , type] = mockSwal.mock.calls[0];
    expect(title).toMatch(/shutdown/i);
    expect(type).toBe('error');
  });

  it('chatbox receives shutdown message', () => {
    handle_server_shutdown({});
    expect(mockAddChatboxText).toHaveBeenCalledTimes(1);
    const arg = mockAddChatboxText.mock.calls[0][0] as { message: string };
    expect(arg.message).toMatch(/shut down/i);
  });
});

// ---------------------------------------------------------------------------
// SD-7: Double-shutdown is idempotent
// ---------------------------------------------------------------------------
describe('SD-7: double shutdown is safe', () => {
  beforeEach(() => { vi.useFakeTimers(); resetAll(); });
  afterEach(() => { _resetReconnectStateForTests(); vi.restoreAllMocks(); vi.useRealTimers(); });

  it('calling handle_server_shutdown twice does not throw', () => {
    simulateConnected();
    expect(() => {
      handle_server_shutdown({});
      handle_server_shutdown({});
    }).not.toThrow();
  });

  it('connectionState stays disconnected after double shutdown', () => {
    handle_server_shutdown({});
    handle_server_shutdown({});
    expect(store.connectionState).toBe('disconnected');
  });
});

// ---------------------------------------------------------------------------
// SD-8: Shutdown during reconnect cancels reconnect loop
// ---------------------------------------------------------------------------
describe('SD-8: shutdown during reconnect cancels pending timers', () => {
  beforeEach(() => { vi.useFakeTimers(); resetAll(); });
  afterEach(() => { _resetReconnectStateForTests(); vi.restoreAllMocks(); vi.useRealTimers(); });

  it('no new WS is created after shutdown even when reconnect timer would have fired', () => {
    simulateConnected();
    const ws1 = getCurrentWebSocketForTests() as MockWebSocket;

    // Trigger abnormal close → schedules reconnect in 1s
    ws1.onclose!(new CloseEvent('close', { code: 1006 }));
    expect(store.connectionState).toBe('reconnecting');

    // Shutdown arrives before reconnect timer fires
    handle_server_shutdown({});
    expect(store.connectionState).toBe('disconnected');

    // Advance past the reconnect delay — no new WS should appear
    const wsAfterShutdown = getCurrentWebSocketForTests();
    vi.advanceTimersByTime(RECONNECT_DELAYS_MS[0] + 1000);
    expect(getCurrentWebSocketForTests()).toBe(wsAfterShutdown);
  });
});

// ---------------------------------------------------------------------------
// SD-9: Shutdown when no WS exists
// ---------------------------------------------------------------------------
describe('SD-9: shutdown without active WebSocket', () => {
  beforeEach(() => { vi.useFakeTimers(); resetAll(); });
  afterEach(() => { _resetReconnectStateForTests(); vi.restoreAllMocks(); vi.useRealTimers(); });

  it('handle_server_shutdown does not throw when ws is null', () => {
    expect(getCurrentWebSocketForTests()).toBeNull();
    expect(() => handle_server_shutdown({})).not.toThrow();
  });

  it('store.connectionState is still set correctly', () => {
    handle_server_shutdown({});
    expect(store.connectionState).toBe('disconnected');
  });
});
