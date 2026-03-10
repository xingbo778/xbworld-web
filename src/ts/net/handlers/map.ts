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

    // Ensure received tiles are always visible. In Freeciv 3.4 the `known`
    // field is sent as a per-player bitmask array rather than a scalar, so
    // it may not be a clean 0/1/2 value. Since this client runs exclusively
    // in observer mode (revealmap GLOBAL), force every received tile to
    // TILE_KNOWN_SEEN (2) so the renderer draws it.
    if (!(packet['known'] as number) || (packet['known'] as number) < 2) {
      (packet as Record<string, unknown>)['known'] = 2;
    }

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

  // Set window.map dimensions so getMapInfo() and mapAllocate() can read them.
  // Legacy map.js used to do this; the TS handler must replicate it.
  const winMap = (window as any).map as Record<string, unknown> | undefined;
  if (winMap) {
    winMap.xsize = packet.xsize;
    winMap.ysize = packet.ysize;
    winMap.topology_id = packet.topology_id;
    winMap.wrap_id = packet.wrap_id;
  }

  mapInitTopology(false);
  mapAllocate();
  mapdeco_init();
}

export function handle_nuke_tile_info(packet: NukeTileInfoPacket): void {
  const ptile = indexToTile(packet['tile'])!;
  ptile['nuke'] = 60;
  play_sound('LrgExpl.ogg');
}
