/**
 * Player and diplomacy state handlers.
 */
import { store } from '../../data/store';
import type { Tile, Unit, City } from '../../data/types';
import { BitVector } from '../../utils/bitvector';
import { sendUnitGetActions } from '../commands';
import { IDENTITY_NUMBER_ZERO } from '../../core/constants';
import { clientPlaying } from '../../client/clientState';
import { valid_player_by_number, DiplState, research_data } from '../../data/player';
import { tileOwner } from '../../data/tile';
import { indexToTile } from '../../data/map';
import { update_game_status_panel } from '../../data/game';
import { game_find_unit_by_number, game_find_city_by_number } from '../../data/game';

import { update_tech_screen, tech_dialog_active } from '../../ui/techDialog';
import { assign_nation_color } from '../../renderer/nationColor';
import { update_player_info_pregame } from '../../core/pregame';
import { globalEvents } from '../../core/events';
import {
  action_selection_actor_unit, action_selection_target_city,
  action_selection_target_unit, action_selection_target_tile,
  action_selection_target_extra,
} from '../../core/control/actionSelection';
import type {
  BasePacket,
  PlayerInfoPacket, WebPlayerInfoAdditionPacket,
  PlayerRemovePacket, PlayerDiplstatePacket,
} from './packetTypes';

const REQEST_BACKGROUND_REFRESH = 1;

export function handle_player_info(packet: PlayerInfoPacket): void {
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
      && packet['playerno'] === clientPlaying()!['playerno']) {
    store.client.conn.playing = store.players[packet['playerno']];
  }
}

export function handle_web_player_info_addition(packet: WebPlayerInfoAdditionPacket): void {
  Object.assign(store.players[packet['playerno']], packet);

  if (clientPlaying() != null) {
    if (packet['playerno'] === clientPlaying()!['playerno']) {
      store.client.conn.playing = store.players[packet['playerno']];
      update_game_status_panel();

    }
  }
  update_player_info_pregame();

  if (tech_dialog_active) update_tech_screen();

  assign_nation_color(store.players[packet['playerno']]['nation']);
  globalEvents.emit('player:updated', packet);
}

export function handle_player_remove(packet: PlayerRemovePacket): void {
  delete store.players[packet['playerno']];
  update_player_info_pregame();
  globalEvents.emit('player:removed', packet);
}

export function handle_player_attribute_chunk(_packet: BasePacket): void { /* no-op */ }

export function handle_player_diplstate(packet: PlayerDiplstatePacket): void {
  let need_players_dialog_update = false;

  if (store.client == null || clientPlaying() == null) return;

  if (packet['plr2'] === clientPlaying()!['playerno']) {
    const ds = (store.players[packet['plr1']] as unknown as { diplstates?: Record<number, { state: number }> }).diplstates;
    if (ds != undefined && ds[packet['plr2']] != undefined
        && ds[packet['plr2']]['state'] !== packet['type']) {
      need_players_dialog_update = true;
    }
  }

  if (packet['type'] === DiplState.DS_WAR && packet['plr2'] === clientPlaying()!['playerno']
      && store.diplstates[packet['plr1']] !== DiplState.DS_WAR && store.diplstates[packet['plr1']] !== DiplState.DS_NO_CONTACT) {
    // alert_war removed — observer mode only
  } else if (packet['type'] === DiplState.DS_WAR && packet['plr1'] === clientPlaying()!['playerno']
      && store.diplstates[packet['plr2']] !== DiplState.DS_WAR && store.diplstates[packet['plr2']] !== DiplState.DS_NO_CONTACT) {
    // alert_war removed — observer mode only
  }

  if (packet['plr1'] === clientPlaying()!['playerno']) {
    store.diplstates[packet['plr2']] = packet['type'];
  } else if (packet['plr2'] === clientPlaying()!['playerno']) {
    store.diplstates[packet['plr1']] = packet['type'];
  }

  if (store.players[packet['plr1']]['diplstates'] === undefined) {
    store.players[packet['plr1']]['diplstates'] = [] as unknown[];
  }
  (store.players[packet['plr1']]['diplstates'] as Record<number, unknown>)[packet['plr2']] = {
    state: packet['type'],
    turns_left: packet['turns_left'],
    contact_turns_left: packet['contact_turns_left']
  };

  if (need_players_dialog_update
      && action_selection_actor_unit() !== IDENTITY_NUMBER_ZERO) {
    let tgt_tile: Tile | null | undefined;
    let tgt_unit: Unit | null | undefined;
    let tgt_city: City | null | undefined;

    if ((action_selection_target_unit() !== IDENTITY_NUMBER_ZERO
         && ((tgt_unit = game_find_unit_by_number(action_selection_target_unit())))
         && tgt_unit['owner'] === packet['plr1'])
        || (action_selection_target_city() !== IDENTITY_NUMBER_ZERO
            && ((tgt_city = game_find_city_by_number(action_selection_target_city())))
            && tgt_city['owner'] === packet['plr1'])
        || ((tgt_tile = indexToTile(action_selection_target_tile()))
            && tileOwner(tgt_tile) === packet['plr1'])) {
      sendUnitGetActions(
        action_selection_actor_unit(),
        action_selection_target_unit(),
        action_selection_target_tile(),
        action_selection_target_extra(),
        REQEST_BACKGROUND_REFRESH
      );
    }
  }
}
