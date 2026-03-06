/**
 * City packet handlers.
 */
import { store } from '../../data/store';
import { BitVector } from '../../utils/bitvector';
import { C_S_RUNNING, clientState, clientIsObserver, clientPlaying } from '../../client/clientState';
import { cityUnhappy, removeCity } from '../../data/city';
import { mark_tile_dirty } from '../../renderer/mapviewCommon';
import { show_city_dialog_by_id, city_name_dialog, city_trade_routes } from '../../ui/cityDialog';
import { game_find_unit_by_number, game_find_city_by_number } from '../../data/game';
import { popup_sabotage_dialog } from '../../ui/actionDialog';

const REQEST_PLAYER_INITIATED = 0;

export function handle_city_info(packet: any): void {
  if (typeof mark_tile_dirty === 'function' && packet['tile'] != null) {
    mark_tile_dirty(packet['tile']);
  }

  packet['name'] = decodeURIComponent(packet['name']);
  packet['improvements'] = new BitVector(packet['improvements']);
  packet['city_options'] = new BitVector(packet['city_options']);
  packet['unhappy'] = cityUnhappy(packet);

  if (store.cities[packet['id']] == null) {
    const pcity = packet;
    store.cities[packet['id']] = packet;
    if (C_S_RUNNING === clientState() && !store.observing && store.benchmarkStart === 0
        && !clientIsObserver() && packet['owner'] === clientPlaying()?.playerno) {
      show_city_dialog_by_id(packet['id']);
    }
  } else {
    Object.assign(store.cities[packet['id']], packet);
  }

  const pcity = store.cities[packet['id']];
  pcity['shield_stock_changed'] = false;
  pcity['production_changed'] = false;
}

export function handle_city_nationalities(packet: any): void {
  if (store.cities[packet['id']] != null) {
    Object.assign(store.cities[packet['id']], packet);
  }
}

export function handle_city_rally_point(packet: any): void {
  if (store.cities[packet['id']] != null) {
    Object.assign(store.cities[packet['id']], packet);
  }
}

export function handle_web_city_info_addition(packet: any): void {
  if (store.cities[packet['id']] != null) {
    Object.assign(store.cities[packet['id']], packet);
  }
  // update_city_info_dialog was a legacy UI function — removed in observer mode
}

export function handle_city_short_info(packet: any): void {
  if (typeof mark_tile_dirty === 'function' && packet['tile'] != null) {
    mark_tile_dirty(packet['tile']);
  }

  packet['name'] = decodeURIComponent(packet['name']);
  packet['improvements'] = new BitVector(packet['improvements']);

  if (store.cities[packet['id']] == null) {
    store.cities[packet['id']] = packet;
  } else {
    Object.assign(store.cities[packet['id']], packet);
  }
}

export function handle_city_update_counters(packet: any): void {
  if (store.cities[packet['id']] != null) {
    store.cities[packet['id']]['counters'] = packet['counters'];
  }
}

export function handle_city_update_counter(_packet: any): void { /* TODO */ }

export function handle_city_remove(packet: any): void {
  removeCity(packet['city_id']);
}

export function handle_city_name_suggestion_info(packet: any): void {
  packet['name'] = decodeURIComponent(packet['name']);
  city_name_dialog(packet['name'], packet['unit_id']);
}

export function handle_city_sabotage_list(packet: any): void {
  if (packet['request_kind'] !== REQEST_PLAYER_INITIATED) {
    console.log('handle_city_sabotage_list(): was asked to not disturb the player. Unimplemented.');
  }
  popup_sabotage_dialog(
    game_find_unit_by_number(packet['actor_id']),
    game_find_city_by_number(packet['city_id'])!,
    new BitVector(packet['improvements']),
    packet['act_id']
  );
}
