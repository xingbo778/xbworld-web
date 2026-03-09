/**
 * Map and tile handlers.
 */
import { store } from '../../data/store';
import { BitVector } from '../../utils/bitvector';
import { mapInitTopology, mapAllocate, indexToTile } from '../../data/map';
import { mark_tile_dirty, mapdeco_init } from '../../renderer/mapviewCommon';
import { play_sound } from '../../audio/sounds';
import type { TileInfoPacket, MapInfoPacket, NukeTileInfoPacket } from './packetTypes';
import { mark_overview_dirty } from '../../core/overview';

export function handle_tile_info(packet: TileInfoPacket): void {
  if (store.tiles != null) {
    packet['extras'] = new BitVector(packet['extras'] as number[]);

    Object.assign(store.tiles[packet['tile']], packet);

    mark_overview_dirty();

    if (typeof mark_tile_dirty === 'function') {
      mark_tile_dirty(packet['tile']);
    }
  }
}

export function handle_map_info(packet: MapInfoPacket): void {
  (window as any).__xbwHandleMapInfoCalled = ((window as any).__xbwHandleMapInfoCalled || 0) + 1;
  store.mapInfo = packet;
  (window as any).__xbwMapInfoXsize = packet.xsize;
  mapInitTopology(false);
  mapAllocate();
  mapdeco_init();
}

export function handle_nuke_tile_info(packet: NukeTileInfoPacket): void {
  const ptile = indexToTile(packet['tile'])!;
  ptile['nuke'] = 60;
  play_sound('LrgExpl.ogg');
}
