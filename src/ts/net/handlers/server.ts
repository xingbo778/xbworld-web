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
import { showAuthDialog } from '../../client/civClient';
import { discard_diplomacy_dialogs } from '../../ui/diplomacy';
import { wait_for_text, add_chatbox_text } from '../../core/messages';
import { update_player_info_pregame, update_game_info_pregame } from '../../core/pregame';

// Connection management
export function find_conn_by_id(id: number): any {
  return store.connections[id];
}

export function client_remove_cli_conn(connection: any): void {
  delete store.connections[connection['id']];
}

export function conn_list_append(connection: any): void {
  store.connections[connection['id']] = connection;
}

export function handle_server_join_reply(packet: any): void {
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
    if ((urlAction === 'new' || urlAction === 'hack') && urlRuleset != null) {
      (window as any).change_ruleset(urlRuleset);
    }

    if (store.autostart) {
      if ((window as any).loadTimerId === -1) {
        wait_for_text('You are logged in as', (window as any).pregame_start_game);
      } else {
        wait_for_text('Load complete', (window as any).pregame_start_game);
      }
    } else if (store.observing) {
      wait_for_text('You are logged in as', requestObserveGame);
    }
  } else {
    swal('You were rejected from the game.', (packet['message'] || ''), 'error');
    store.client.conn.id = -1;
    set_client_page(PAGE_MAIN);
  }
}

export function handle_conn_info(packet: any): void {
  let pconn = find_conn_by_id(packet['id']);

  if (packet['used'] === false) {
    if (pconn == null) {
      freelog((window as any).LOG_VERBOSE, 'Server removed unknown connection ' + packet['id']);
      return;
    }
    client_remove_cli_conn(pconn);
    pconn = null;
  } else {
    const pplayer = valid_player_by_number(packet['player_num']);
    packet['playing'] = pplayer;

    if (packet['id'] === store.client.conn.id) {
      if (store.client.conn.player_num == null
          || store.client.conn.player_num !== packet['player_num']) {
        discard_diplomacy_dialogs();
      }
      store.client.conn = packet;
    }
    conn_list_append(packet);
  }

  if (packet['id'] === store.client.conn.id) {
    if (clientPlaying() !== packet['playing']) {
      set_client_state(C_S_PREPARING);
    }
  }
}

export function handle_conn_ping(packet: any): void {
  store.pingLast = new Date().getTime();
  sendConnPong();
}

export function handle_authentication_req(packet: any): void {
  showAuthDialog(packet);
}

export function handle_server_shutdown(_packet: any): void { /* TODO */ }

export function handle_connect_msg(packet: any): void {
  add_chatbox_text(packet);
}

export function handle_server_info(packet: any): void {
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

export function handle_set_topology(_packet: any): void { /* TODO */ }

export function handle_conn_ping_info(packet: any): void {
  if (store.debugActive) {
    store.connPingInfo = packet;
    store.debugPingList.push(packet['ping_time'][0] * 1000);
  }
}

export function handle_single_want_hack_reply(packet: any): void {
  if (typeof (window as any).handle_single_want_hack_reply_orig === 'function') {
    (window as any).handle_single_want_hack_reply_orig(packet);
  }
}

export function handle_vote_new(_packet: any): void { /* TODO */ }
export function handle_vote_update(_packet: any): void { /* TODO */ }
export function handle_vote_remove(_packet: any): void { /* TODO */ }
export function handle_vote_resolve(_packet: any): void { /* TODO */ }
export function handle_edit_startpos(_packet: any): void { /* no-op */ }
export function handle_edit_startpos_full(_packet: any): void { /* no-op */ }
export function handle_edit_object_created(_packet: any): void { /* no-op */ }

export function handle_server_setting_const(packet: any): void {
  store.serverSettings[packet['id']] = packet;
  store.serverSettings[packet['name']] = packet;
}

export function handle_server_setting_int(packet: any): void {
  Object.assign(store.serverSettings[packet['id']], packet);
}

export function handle_server_setting_enum(packet: any): void {
  Object.assign(store.serverSettings[packet['id']], packet);
}

export function handle_server_setting_bitwise(packet: any): void {
  Object.assign(store.serverSettings[packet['id']], packet);
}

export function handle_server_setting_bool(packet: any): void {
  Object.assign(store.serverSettings[packet['id']], packet);
}

export function handle_server_setting_str(packet: any): void {
  Object.assign(store.serverSettings[packet['id']], packet);
}

export function handle_server_setting_control(_packet: any): void { /* TODO */ }
