import { afterEach, describe, expect, it } from 'vitest';

import { store } from '@/data/store';
import { getDebugWebSocket } from '@/utils/debugGlobals';
import {
  getCurrentWebSocketForTests,
  setCivserverportForTests,
  setCurrentWebSocketForTests,
} from '@/net/connection';

class MockWebSocket {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  readyState = MockWebSocket.OPEN;
  url: string;

  constructor(url: string) {
    this.url = url;
  }
}

describe('debugGlobals legacy bridge', () => {
  afterEach(() => {
    Reflect.deleteProperty(window, '__networkDebug');
    Reflect.deleteProperty(window, 'ws');
    Reflect.deleteProperty(window, 'civserverport');
    setCurrentWebSocketForTests(null);
    setCivserverportForTests(null);
    store.civserverport = '';
  });

  it('mirrors setCurrentWebSocketForTests to window.ws', () => {
    const ws = new MockWebSocket('ws://example.test/socket') as unknown as WebSocket;
    setCurrentWebSocketForTests(ws);

    expect(getCurrentWebSocketForTests()).toBe(ws);
    expect(Reflect.get(window, 'ws')).toBe(ws);
  });

  it('mirrors setCivserverportForTests to window and store', () => {
    setCivserverportForTests('6789');

    expect(Reflect.get(window, 'civserverport')).toBe('6789');
    expect(store.civserverport).toBe('6789');
  });

  it('prefers __networkDebug.ws over legacy window.ws', () => {
    const legacyWs = new MockWebSocket('ws://example.test/legacy') as unknown as WebSocket;
    const debugWs = new MockWebSocket('ws://example.test/debug') as unknown as WebSocket;

    Reflect.set(window, 'ws', legacyWs);
    Reflect.set(window, '__networkDebug', { ws: debugWs });

    expect(getDebugWebSocket()).toBe(debugWs);
  });
});
