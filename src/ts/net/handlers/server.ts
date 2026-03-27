/**
 * Server/connection handlers — join, auth, conn_info, settings, etc.
 */
import { store } from '../../data/store';
import { sendClientInfo, sendConnPong } from '../commands';
import { swal } from '../../components/Dialogs/SwalDialog';
import { C_S_PREPARING, clientPlaying } from '../../client/clientState';
import { setClientState as set_client_state } from '../../client/clientMain';
import { requestObserveGame } from '../../client/clientCore';
import { set_client_page, get_client_page, PAGE_MAIN, PAGE_NETWORK, PAGE_START } from '../../core/pages';
import { valid_player_by_number } from '../../data/player';
import { freelog } from '../../core/log';
import { showAuthDialog, stopGameTimers } from '../../client/civClient';
import { wait_for_text, add_chatbox_text } from '../../core/messages';
import { update_player_info_pregame, update_game_info_pregame } from '../../core/pregame';
import { mapInitTopology } from '../../data/map';
import { globalEvents } from '../../core/events';
import { getDebugWebSocket } from '../../utils/debugGlobals';
import type {
  BasePacket,
  ServerJoinReplyPacket,
  ConnInfoPacket,
  ConnPingPacket,
  AuthenticationReqPacket,
  ConnectMsgPacket,
  ServerInfoPacket,
  ConnPingInfoPacket,
  ServerSettingControlPacket,
  ServerSettingConstPacket,
  ServerSettingUpdatePacket,
} from './packetTypes';
import { applySettingEffect } from '../../data/serverSettings';
import { send_request as _send_request, markServerShutdown, network_stop } from '../connection';
import type { Connection, ServerSetting } from '../../data/types';

// Connection management
export function find_conn_by_id(id: number): Connection | undefined {
  return store.connections[id];
}

export function client_remove_cli_conn(connection: Connection): void {
  delete store.connections[connection['id']];
}

export function conn_list_append(connection: Connection): void {
  store.connections[connection['id']] = connection;
}

export function handle_server_join_reply(packet: ServerJoinReplyPacket): void {
  if (packet['you_can_join']) {
    store.client.conn.established = true;
    store.client.conn.id = packet['conn_id'];

    if (get_client_page() === PAGE_MAIN
        || get_client_page() === PAGE_NETWORK) {
      set_client_page(PAGE_START);
    }

    sendClientInfo();
    set_client_state(C_S_PREPARING);

    const urlParams = new URLSearchParams(window.location.search);
    const urlAction = urlParams.get('action');
    const urlRuleset = urlParams.get('ruleset');
    if (store.observing) {
      console.log('[xbw] join_reply: observer mode, scheduling requestObserveGame');
      // Primary: wait for "You are logged in as" in chat to confirm server is ready.
      wait_for_text('You are logged in as', requestObserveGame);
      // Fallback: in mid-game joins, clear_chatbox() may wipe the chat before
      // wait_for_text finds the text. Send observe/take after 3s regardless.
      setTimeout(requestObserveGame, 3000);
    }
  } else {
    swal('You were rejected from the game.', (packet['message'] || ''), 'error');
    store.client.conn.id = -1;
    set_client_page(PAGE_MAIN);
  }
}

export function handle_conn_info(packet: ConnInfoPacket): void {
  let pconn = find_conn_by_id(packet['id']);

  if (packet['used'] === false) {
    if (pconn == null) {
      freelog(0, 'Server removed unknown connection ' + packet['id']);
      return;
    }
    client_remove_cli_conn(pconn);
    pconn = undefined;
  } else {
    const pplayer = valid_player_by_number(packet['player_num']);
    packet['playing'] = pplayer;

    if (packet['id'] === store.client.conn.id) {
      if (store.client.conn.player_num == null
          || store.client.conn.player_num !== packet['player_num']) {
        // discard_diplomacy_dialogs — player-only, no-op in observer mode
      }
      store.client.conn = packet as unknown as Connection;
    }
    conn_list_append(packet as unknown as Connection);
  }

  if (packet['id'] === store.client.conn.id) {
    if (clientPlaying() !== packet['playing']) {
      set_client_state(C_S_PREPARING);
    }
  }
  globalEvents.emit('connection:updated', packet);
}

export function handle_conn_ping(_packet: ConnPingPacket): void {
  store.pingLast = new Date().getTime();
  sendConnPong();
}

export function handle_authentication_req(packet: AuthenticationReqPacket): void {
  showAuthDialog(packet);
}

/**
 * Handles the server shutdown packet (pid 8).
 *
 * Shutdown sequence:
 *  1. markServerShutdown() — prevents ws.onclose from triggering reconnect loop
 *  2. stopGameTimers()    — stops overview/status/timeout intervals
 *  3. network_stop()      — proactively closes ws + frees network resources
 *                           (ping_timer, _packetWorker, _beforeUnloadHandler)
 *  4. store.reset()       — clears stale game state (tiles, cities, players…)
 *  5. UI notification     — chatbox message + swal dialog
 *
 * If the server closes the WebSocket after the packet, ws.onclose sees
 * _serverShutdown=true and skips the reconnect path.  network_stop() also
 * sends a clean-close (code 1000) so the onclose guard is redundant but safe.
 */
export function handle_server_shutdown(_packet: BasePacket): void {
  markServerShutdown(); // must be first — sets flag before ws.close() fires
  stopGameTimers();     // stop recurring client-side intervals
  network_stop();       // close ws + terminate worker + clear timers
  store.reset();        // wipe stale game data
  store.connectionState = 'disconnected';
  add_chatbox_text({ message: 'The server has shut down.', conn_id: -1 } as unknown as ConnectMsgPacket);
  swal('Server Shutdown', 'The game server has shut down. Please reload the page to reconnect.', 'error');
}

export function handle_connect_msg(packet: ConnectMsgPacket): void {
  add_chatbox_text(packet);
}

export function handle_server_info(packet: ServerInfoPacket): void {
  if (packet['emerg_version'] > 0) {
    console.log('Server has version %d.%d.%d.%d%s',
      packet.major_version, packet.minor_version, packet.patch_version,
      packet.emerg_version, packet.version_label);
  } else {
    console.log('Server has version %d.%d.%d%s',
      packet.major_version, packet.minor_version, packet.patch_version,
      packet.version_label);
  }
}

export function handle_set_topology(packet: BasePacket): void {
  if (store.mapInfo && packet['topology_id'] != null) {
    store.mapInfo.topology_id = packet['topology_id'] as number;
  }
  if (store.mapInfo && packet['wrap_id'] != null) {
    store.mapInfo.wrap_id = packet['wrap_id'] as number;
  }
  mapInitTopology(false);
}

export function handle_conn_ping_info(packet: ConnPingInfoPacket): void {
  if (store.debugActive) {
    store.connPingInfo = packet;
    store.debugPingList.push(packet['ping_time'][0] * 1000);
  }
}

export function handle_single_want_hack_reply(_packet: BasePacket): void {
  // Legacy hack reply handler removed — observer mode only
}

export function handle_vote_new(packet: BasePacket): void {
  // Auto-vote YES on any vote via chat command (safer than PACKET_VOTE_SUBMIT)
  const voteId = (packet['vote_no'] ?? packet['id']) as number | undefined;
  if (voteId != null) {
    console.log('[xbw] vote_new: auto-voting YES on vote', voteId);
    // Use chat command approach: /vote yes <n>
    // Note: import send_message from connection is already available via send_request
    const ws = getDebugWebSocket();
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ pid: 26, message: '/vote yes ' + voteId }));
    }
  }
}
export function handle_vote_update(packet: BasePacket): void {
  const voteId = (packet['vote_no'] ?? packet['id']) as number | undefined;
  if (voteId != null) {
    store.votes[voteId] = packet;
  }
}
export function handle_vote_remove(packet: BasePacket): void {
  const voteId = (packet['vote_no'] ?? packet['id']) as number | undefined;
  if (voteId != null) {
    delete store.votes[voteId];
  }
}
export function handle_vote_resolve(packet: BasePacket): void {
  const voteId = (packet['vote_no'] ?? packet['id']) as number | undefined;
  if (voteId != null) {
    delete store.votes[voteId];
  }
}
export function handle_edit_startpos(_packet: BasePacket): void { /* no-op */ }
export function handle_edit_startpos_full(_packet: BasePacket): void { /* no-op */ }
export function handle_edit_object_created(_packet: BasePacket): void { /* no-op */ }

export function handle_server_setting_const(packet: ServerSettingConstPacket): void {
  const setting = packet as unknown as ServerSetting;
  // Resolve human-readable category name from the CONTROL packet.
  const catIndex = packet['category'] as number | undefined;
  if (catIndex != null && store.serverSettingCategories[catIndex] != null) {
    setting.categoryName = store.serverSettingCategories[catIndex];
  }
  store.serverSettings[packet['id']] = setting;
  store.serverSettings[packet['name']] = setting;
}

/** Shared helper: merge update fields into an existing slot and apply effects. */
function _applySettingUpdate(packet: ServerSettingUpdatePacket, type: ServerSetting['type']): void {
  const existing = store.serverSettings[packet['id']];
  if (existing == null) {
    // Guard: const packet must precede value packets in the Freeciv protocol,
    // but be defensive in case of unexpected ordering.
    console.warn('[xbw] server_setting update received before const for id', packet['id']);
    return;
  }
  Object.assign(existing, packet);
  existing['type'] = type;
  applySettingEffect(existing);
  globalEvents.emit('settings:updated');
}

export function handle_server_setting_int(packet: ServerSettingUpdatePacket): void {
  _applySettingUpdate(packet, 'int');
}

export function handle_server_setting_enum(packet: ServerSettingUpdatePacket): void {
  _applySettingUpdate(packet, 'enum');
}

export function handle_server_setting_bitwise(packet: ServerSettingUpdatePacket): void {
  _applySettingUpdate(packet, 'bitwise');
}

export function handle_server_setting_bool(packet: ServerSettingUpdatePacket): void {
  _applySettingUpdate(packet, 'bool');
}

export function handle_server_setting_str(packet: ServerSettingUpdatePacket): void {
  _applySettingUpdate(packet, 'str');
}

/**
 * SERVER_SETTING_CONTROL (pid 164) — sent once before all setting const+value
 * packets. Announces the total count and category name list.
 *
 * Side effects:
 *  1. Stores nSettings + categoryNames in the store for later reference.
 *  2. Pre-initialises placeholder slots so update handlers never hit undefined
 *     even if a const packet is somehow missed.
 */
export function handle_server_setting_control(packet: ServerSettingControlPacket): void {
  const nSettings = (packet['nSettings'] as number | undefined) ?? 0;
  const categoryNames = (packet['categoryNames'] as string[] | undefined) ?? [];

  store.serverSettingCount = nSettings;
  store.serverSettingCategories = categoryNames;

  // Pre-initialise every slot so update handlers can safely call Object.assign.
  for (let i = 0; i < nSettings; i++) {
    const key = String(i);
    if (store.serverSettings[key] == null) {
      store.serverSettings[key] = { id: i, name: '', category: 0, val: null };
    }
  }

  console.log(`[xbw] server_setting_control: ${nSettings} settings, ${categoryNames.length} categories`,
    categoryNames);
}
