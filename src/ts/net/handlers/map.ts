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
import { globalEvents } from '../../core/events';
import { incrementDebugCounter } from '../../utils/debugGlobals';

export function handle_tile_info(packet: TileInfoPacket): void {
  if (store.tiles != null) {
    packet['extras'] = new BitVector(packet['extras'] as number[]);

    // Ensure received tiles are always visible. In Freeciv 3.4 the `known`
    // field is sent as a per-player bitmask array rather than a scalar, so
    // it may not be a clean 0/1/2 value. Since this client runs exclusively
    // in observer mode (revealmap GLOBAL), force every received tile to
    // TILE_KNOWN_SEEN (2) so the renderer draws it.
    if (!(packet['known'] as number) || (packet['known'] as number) < 2) {
      packet.known = 2;
    }

    Object.assign(store.tiles[packet['tile']], packet);

    mark_overview_dirty();

    if (typeof mark_tile_dirty === 'function') {
      mark_tile_dirty(packet['tile']);
    }
    globalEvents.emit('tile:updated', packet);
  }
}

export function handle_map_info(packet: MapInfoPacket): void {
  incrementDebugCounter('__xbwHandleMapInfoCalled');
  store.mapInfo = packet;

  mapInitTopology(false);
  mapAllocate();
  mapdeco_init();
  globalEvents.emit('map:allocated');
}

export function handle_nuke_tile_info(packet: NukeTileInfoPacket): void {
  const ptile = indexToTile(packet['tile'])!;
  ptile['nuke'] = 60;
  play_sound('LrgExpl.ogg');
}
