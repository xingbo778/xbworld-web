/**
 * Player and diplomacy state handlers.
 */
import { store } from '../../data/store';
import { BitVector } from '../../utils/bitvector';
import { packet_unit_get_actions } from '../packetConstants';
import { send_request } from '../connection';
import { IDENTITY_NUMBER_ZERO } from '../../core/constants';
import { clientPlaying } from '../../client/clientState';
import { valid_player_by_number, DiplState, research_data } from '../../data/player';
import { tileOwner } from '../../data/tile';
import { indexToTile } from '../../data/map';
import { update_game_status_panel } from '../../data/game';
import { game_find_unit_by_number, game_find_city_by_number } from '../../data/game';
import { update_net_income } from '../../ui/rates';
import { update_tech_screen, is_tech_tree_init, tech_dialog_active } from '../../ui/techDialog';
import { assign_nation_color } from '../../renderer/nationColor';
import { update_player_info_pregame } from '../../core/pregame';
import {
  action_selection_actor_unit, action_selection_target_city,
  action_selection_target_unit, action_selection_target_tile,
  action_selection_target_extra,
} from '../../ui/actionDialog';

const REQEST_BACKGROUND_REFRESH = 1;

export function handle_player_info(packet: any): void {
  if (packet['name'] != null) {
    packet['name'] = decodeURIComponent(packet['name']);
  }

  store.players[packet['playerno']] = Object.assign(
    store.players[packet['playerno']] || {},
    packet
  );

  const p = store.players[packet['playerno']];
  if (p['flags'] != null && !(p['flags'] instanceof BitVector)) {
    p['flags'] = new BitVector(p['flags']);
  }
  if (p['gives_shared_vision'] != null && !(p['gives_shared_vision'] instanceof BitVector)) {
    p['gives_shared_vision'] = new BitVector(p['gives_shared_vision']);
  }

  if (clientPlaying() != null
      && packet['playerno'] === clientPlaying()['playerno']) {
    store.client.conn.playing = store.players[packet['playerno']];
  }
}

export function handle_web_player_info_addition(packet: any): void {
  Object.assign(store.players[packet['playerno']], packet);

  if (clientPlaying() != null) {
    if (packet['playerno'] === clientPlaying()['playerno']) {
      store.client.conn.playing = store.players[packet['playerno']];
      update_game_status_panel();
      update_net_income();
    }
  }
  update_player_info_pregame();

  if (is_tech_tree_init && tech_dialog_active) update_tech_screen();

  assign_nation_color(store.players[packet['playerno']]['nation']);
}

export function handle_player_remove(packet: any): void {
  delete store.players[packet['playerno']];
  update_player_info_pregame();
}

export function handle_player_attribute_chunk(_packet: any): void { /* no-op */ }

export function handle_player_diplstate(packet: any): void {
  let need_players_dialog_update = false;

  if (store.client == null || clientPlaying() == null) return;

  if (packet['plr2'] === clientPlaying()['playerno']) {
    const ds: any = store.players[packet['plr1']].diplstates;
    if (ds != undefined && ds[packet['plr2']] != undefined
        && ds[packet['plr2']]['state'] !== packet['type']) {
      need_players_dialog_update = true;
    }
  }

  if (packet['type'] === DiplState.DS_WAR && packet['plr2'] === clientPlaying()['playerno']
      && (window as any).diplstates[packet['plr1']] !== DiplState.DS_WAR && (window as any).diplstates[packet['plr1']] !== DiplState.DS_NO_CONTACT) {
    (window as any).alert_war(packet['plr1']);
  } else if (packet['type'] === DiplState.DS_WAR && packet['plr1'] === clientPlaying()['playerno']
      && (window as any).diplstates[packet['plr2']] !== DiplState.DS_WAR && (window as any).diplstates[packet['plr2']] !== DiplState.DS_NO_CONTACT) {
    (window as any).alert_war(packet['plr2']);
  }

  if (packet['plr1'] === clientPlaying()['playerno']) {
    (window as any).diplstates[packet['plr2']] = packet['type'];
  } else if (packet['plr2'] === clientPlaying()['playerno']) {
    (window as any).diplstates[packet['plr1']] = packet['type'];
  }

  if ((store.players[packet['plr1']] as any).diplstates === undefined) {
    (store.players[packet['plr1']] as any).diplstates = [];
  }
  (store.players[packet['plr1']] as any).diplstates[packet['plr2']] = {
    state: packet['type'],
    turns_left: packet['turns_left'],
    contact_turns_left: packet['contact_turns_left']
  };

  if (need_players_dialog_update
      && action_selection_actor_unit() !== IDENTITY_NUMBER_ZERO) {
    let tgt_tile: any;
    let tgt_unit: any;
    let tgt_city: any;

    if ((action_selection_target_unit() !== IDENTITY_NUMBER_ZERO
         && ((tgt_unit = game_find_unit_by_number(action_selection_target_unit())))
         && tgt_unit['owner'] === packet['plr1'])
        || (action_selection_target_city() !== IDENTITY_NUMBER_ZERO
            && ((tgt_city = game_find_city_by_number(action_selection_target_city())))
            && tgt_city['owner'] === packet['plr1'])
        || ((tgt_tile = indexToTile(action_selection_target_tile()))
            && tileOwner(tgt_tile) === packet['plr1'])) {
      const refresh_packet = {
        'pid': packet_unit_get_actions,
        'actor_unit_id': action_selection_actor_unit(),
        'target_unit_id': action_selection_target_unit(),
        'target_tile_id': action_selection_target_tile(),
        'target_extra_id': action_selection_target_extra(),
        'request_kind': REQEST_BACKGROUND_REFRESH,
      };
      send_request(JSON.stringify(refresh_packet));
    }
  }
}
