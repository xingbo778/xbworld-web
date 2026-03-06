/**
 * Map and tile handlers.
 */
import { store } from '../../data/store';
import { BitVector } from '../../utils/bitvector';
import { mapInitTopology, mapAllocate, indexToTile } from '../../data/map';
import { mark_tile_dirty, mapdeco_init } from '../../renderer/mapviewCommon';
import { play_sound } from '../../audio/sounds';

export function handle_tile_info(packet: any): void {
  if (store.tiles != null) {
    packet['extras'] = new BitVector(packet['extras']);

    Object.assign(store.tiles[packet['tile']], packet);

    if (typeof mark_tile_dirty === 'function') {
      mark_tile_dirty(packet['tile']);
    }
  }
}

export function handle_map_info(packet: any): void {
  store.mapInfo = packet;
  mapInitTopology(false);
  mapAllocate();
  mapdeco_init();
}

export function handle_nuke_tile_info(packet: any): void {
  const ptile = indexToTile(packet['tile']);
  ptile['nuke'] = 60;
  play_sound('LrgExpl.ogg');
}
