/**
 * WebSocket connection manager — COMPLETE replacement for clinet.js.
 *
 * Phase 5: This module replaces clinet.js AND the inline patch script
 * in index.html. It exposes all functions via exposeToLegacy using the
 * exact same names as the Legacy code.
 *
 * Includes patches from the inline script:
 *   - Read port from JSON response body (Railway CDN strips custom headers)
 *   - Handle array-wrapped packets from the WebSocket proxy
 */

import { store } from '../data/store';
import { E_LOG_ERROR } from '../data/eventConstants';
import { swal } from '../components/Dialogs/SwalDialog';

import { message_log } from '../core/messages';
import { EventAggregator } from '../utils/EventAggregator';
import { sendChatMessage } from './commands';
function getMessageLog(): EventAggregator {
  return message_log;
}

import { showDialogMessage as show_dialog_message } from '../client/civClient';
import { client_handle_packet } from './packhandlers';
import { packet_chat_msg_req } from './packetConstants';
import { blockUI, unblockUI } from '../utils/dom';
async function sha512hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest('SHA-512', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

const win = window as unknown as Record<string, unknown>;

// Packet worker — JSON.parse off the main thread.
// Uses an inline Blob URL so the worker URL never mismatches after a build.
let _packetWorker: Worker | null = null;
function getPacketWorker(): Worker | null {
  if (_packetWorker) return _packetWorker;
  try {
    const code = `self.onmessage=function(e){try{let p=JSON.parse(e.data);if(!Array.isArray(p))p=[p];postMessage({packets:p});}catch(err){postMessage({error:err.message,raw:e.data});}}`;
    const blob = new Blob([code], { type: 'application/javascript' });
    _packetWorker = new Worker(URL.createObjectURL(blob));
    return _packetWorker;
  } catch {
    return null;
  }
}

// Module-local state (was var in clinet.js)
console.log('[xbw] connection.ts module loaded');
let error_shown = false;
let syncTimerId = -1;
let clinet_last_send = 0;
export let debug_client_speed_list: number[] = [];
const freeciv_version = '+Freeciv.Web.Devel-3.4';
let ws: WebSocket | null = null;
let civserverport: string | null = null;
let ping_last = new Date().getTime();
let _beforeUnloadHandler: ((e: BeforeUnloadEvent) => string) | null = null;
const pingtime_check = 240000;
let ping_timer: ReturnType<typeof setInterval> | null = null;

/**
 * Initialize the Network communication, by requesting a valid server port.
 * Always connects as observer.
 */
export function network_init(): void {
  if (!('WebSocket' in window)) {
    swal('WebSockets not supported', '', 'error');
    return;
  }

  // If civserverport is provided via URL param, connect directly (skip launcher)
  const urlParams = new URLSearchParams(window.location.search);
  const urlPort = urlParams.get('civserverport');
  if (urlPort) {
    civserverport = urlPort;
    websocket_init();
    return;
  }

  fetch('/civclientlauncher?action=observe', { method: 'POST' })
    .then(response => {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.json().then(data => ({ data, response }));
    })
    .then(({ data, response }) => {
      let port: string | null = null;
      let result: string | null = null;

      // Try JSON body first (works with Railway CDN which strips custom headers)
      if (data && data.port != null) {
        port = String(data.port);
        result = data.result || 'success';
      }

      // Fallback to response headers
      if (!port) {
        port = response.headers.get('port');
        result = response.headers.get('result');
      }

      if (port != null && result === 'success') {
        civserverport = port;
        websocket_init();
      } else {
        show_dialog_message('Network error', 'Invalid server port. Error: ' + result);
      }
    })
    .catch(error => {
      show_dialog_message(
        'Network error',
        'Unable to communicate with game launcher. Error: ' + error.message
      );
    });
}

/**
 * Initialize the WebSocket connection.
 * Includes the proxy patch: handles both single-packet and array-wrapped packets.
 */
export function websocket_init(): void {
  blockUI('<h2>Please wait while connecting to the server.</h2>');
  const proxyport = 1000 + parseFloat(civserverport!);
  const ws_protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
  const port = window.location.port ? ':' + window.location.port : '';
  const wsUrl = ws_protocol + window.location.hostname + port + '/civsocket/' + proxyport;
  console.log('[xbw] websocket_init: connecting to', wsUrl);
  ws = new WebSocket(wsUrl);

  // Try to use Web Worker for JSON.parse; fall back to main-thread parsing.
  const worker = getPacketWorker();

  type AnyPacket = NonNullable<Parameters<typeof client_handle_packet>[0]>;
  const processPackets = (parsed: AnyPacket) => {
    if (typeof client_handle_packet === 'undefined' || !parsed) {
      return;
    }
    if ((window as any).__xbwPacketCount === undefined) (window as any).__xbwPacketCount = 0;
    (window as any).__xbwPacketCount += parsed.length;
    // Use larger chunks for big batches (tile replays) to reduce setTimeout overhead.
    // Each tile packet is a fast O(1) assign, so 200 per chunk still stays under ~2ms.
    const CHUNK = parsed.length > 200 ? 200 : 50;
    if (parsed.length <= CHUNK) {
      client_handle_packet!(parsed);
    } else {
      const processChunk = (start: number) => {
        client_handle_packet!(parsed.slice(start, start + CHUNK) as AnyPacket);
        if (start + CHUNK < parsed.length) {
          setTimeout(() => processChunk(start + CHUNK), 0);
        }
      };
      processChunk(0);
    }
  };

  const mainThreadParse = (event: MessageEvent) => {
    try {
      let parsed = JSON.parse(event.data);
      if (!Array.isArray(parsed)) parsed = [parsed];
      processPackets(parsed);
    } catch (e) {
      console.error('Failed to parse packet:', e);
    }
  };

  if (worker) {
    let workerReady = false;
    const pendingMessages: string[] = [];

    worker.onmessage = function (e: MessageEvent) {
      workerReady = true;
      if (e.data.error) {
        console.error('Packet worker parse error:', e.data.error);
      } else {
        processPackets(e.data.packets);
      }
    };
    // If the Worker script fails to load (e.g. 404), fall back to main-thread parsing.
    worker.onerror = function (ev: ErrorEvent) {
      ev.preventDefault();
      console.warn('Packet worker failed to load, falling back to main-thread parsing');
      _packetWorker = null;
      // Process any pending messages that were sent before the error
      if (ws) ws.onmessage = mainThreadParse;
      for (const msg of pendingMessages) {
        mainThreadParse({ data: msg } as MessageEvent);
      }
      pendingMessages.length = 0;
    };
    ws.onmessage = function (event: MessageEvent) {
      if (!workerReady && _packetWorker) {
        pendingMessages.push(event.data);
      }
      if (_packetWorker) {
        worker.postMessage(event.data);
      } else {
        mainThreadParse(event);
      }
    };
  } else {
    ws.onmessage = mainThreadParse;
  }

  ws.onopen = (e) => {
    console.log('[xbw] WebSocket onopen fired, readyState:', ws?.readyState, 'event:', e.type);
    check_websocket_ready();
  };

  ws.onclose = function (event: CloseEvent) {
    swal(
      'Network Error',
      'Connection to server is closed. Please reload the page to restart. Sorry!',
      'error'
    );
    const ml = getMessageLog();
    if (ml != null) {
      ml.update({
        event: E_LOG_ERROR,
        message: 'Error: connection to server is closed. Please reload the page to restart. Sorry!',
      });
    }
    console.info('WebSocket connection closed, code+reason: ' + event.code + ', ' + event.reason);

    const turnBtn = document.getElementById('turn_done_button') as HTMLButtonElement | null;
    if (turnBtn) turnBtn.disabled = true;
    const saveBtn = document.getElementById('save_button') as HTMLButtonElement | null;
    if (saveBtn) saveBtn.disabled = true;

    if (_beforeUnloadHandler) {
      window.removeEventListener('beforeunload', _beforeUnloadHandler);
      _beforeUnloadHandler = null;
    }

    if (ping_timer) clearInterval(ping_timer);
  };

  ws.onerror = function (evt: Event) {
    show_dialog_message(
      'Network error',
      'A problem occured with the ' + document.location.protocol
        + ' WebSocket connection to the server: ' + (ws ? ws.url : '')
    );
    console.error('WebSocket error:', evt);
  };
}

/**
 * When the WebSocket connection is open and ready to communicate, then
 * send the first login message to the server.
 */
export async function check_websocket_ready(): Promise<void> {
  if (ws != null && ws.readyState === 1) {
    let sha_password: string | null = null;
    const stored_password = localStorage.getItem('password') ?? '';
    if (stored_password != null && stored_password !== '') {
      sha_password = encodeURIComponent(await sha512hex(stored_password));
    }

    const login_message = {
      pid: 4,
      username: store.username,
      capability: freeciv_version,
      version_label: '-dev',
      major_version: 3,
      minor_version: 3,
      patch_version: 90,
      port: civserverport,
      password: sha_password,
    };
    ws.send(JSON.stringify(login_message));

    // Leaving the page without saving can now be an issue.
    _beforeUnloadHandler = function (e: BeforeUnloadEvent) {
      e.preventDefault();
      return 'Do you really want to leave your nation behind now?';
    };
    window.addEventListener('beforeunload', _beforeUnloadHandler);

    // The connection is now up. Verify that it remains alive.
    ping_timer = setInterval(ping_check, pingtime_check);

    unblockUI();
  } else {
    setTimeout(check_websocket_ready, 500);
  }
}

/**
 * Stops network sync.
 */
export function network_stop(): void {
  if (ws != null) ws.close();
  ws = null;
}

/**
 * Sends a request to the server, with a JSON packet.
 */
export function send_request(packet_payload: string): void {
  if (ws != null) {
    ws.send(packet_payload);
  }
  if (store.debugActive) {
    clinet_last_send = new Date().getTime();
  }
}

/**
 * Debug timing collection.
 */
export function clinet_debug_collect(): void {
  const time_elapsed = new Date().getTime() - clinet_last_send;
  debug_client_speed_list.push(time_elapsed);
  clinet_last_send = new Date().getTime();
}

/**
 * Detect server disconnections, by checking the time since the last
 * ping packet from the server.
 */
export function ping_check(): void {
  const time_since_last_ping = new Date().getTime() - ping_last;
  if (time_since_last_ping > pingtime_check) {
    console.log(
      'Error: Missing PING message from server, indicates server connection problem.'
    );
  }
}

/**
 * Send the chat message to the server after a delay.
 */
export function send_message_delayed(message: string, delay: number): void {
  setTimeout(function () { send_message(message); }, delay);
}

/**
 * Sends a chat message to the server.
 */
export function send_message(message: string): void {
  sendChatMessage(message);
}

// ============================================================================
// Expose to Legacy — exact same names as clinet.js
// ============================================================================

// Expose module-local state that Legacy code reads
// Override ws/civserverport/ping_last with getters so legacy reads get current values
Object.defineProperty(win, 'ws', {
  get: () => ws,
  set: (v: WebSocket | null) => { ws = v; },
  configurable: true,
});

Object.defineProperty(win, 'civserverport', {
  get: () => civserverport,
  set: (v: string | null) => { civserverport = v; },
  configurable: true,
});

Object.defineProperty(win, 'ping_last', {
  get: () => ping_last,
  set: (v: number) => { ping_last = v; },
  configurable: true,
});
