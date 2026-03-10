import { registerHandler } from './index';
import { PacketType } from './protocol';
import { store } from '../../data/store';
import { globalEvents } from '../../core/events';
import { mapAllocate } from '../../data/map';
import { send_message as sendMessage } from '../connection';
import { PlayerFlag } from '../../data/player';
import { BitVector } from '../../utils/bitvector';
import type { GameInfo, CalendarInfo, MapInfo } from '../../data/types';
import type { ServerJoinReplyPacket } from '../handlers/packetTypes';

export function registerGameHandlers(): void {
  registerHandler(PacketType.PROCESSING_STARTED, () => {
    store.frozen = true;
  });

  registerHandler(PacketType.PROCESSING_FINISHED, () => {
    store.frozen = false;
    globalEvents.emit('game:unfrozen');
  });

  registerHandler(PacketType.SERVER_JOIN_REPLY, (packet) => {
    const p = packet as unknown as ServerJoinReplyPacket;
    if (p.you_can_join) {
      store.client.conn.id = p.conn_id ?? 0;
      globalEvents.emit('net:joined');
      if (store.observing) {
        // Wait for the initial packet batch to finish (PROCESSING_FINISHED),
        // then take an AI player slot to receive full map data.
        // Pure /observe gets no TILE_INFO from the Freeciv server.
        let taken = false;
        const doTake = () => {
          if (taken) return;
          taken = true;
          const aiPlayer = Object.values(store.players).find(p =>
            p['flags'] instanceof BitVector
              ? p['flags'].isSet(PlayerFlag.PLRF_AI)
              : false
          );
          if (aiPlayer && aiPlayer['name']) {
            sendMessage('/take ' + (aiPlayer['name'] as string));
          } else {
            sendMessage('/observe ');
          }
        };
        globalEvents.once('game:unfrozen', doTake);
        // Fallback: if PROCESSING_FINISHED never arrives, try after 3s
        setTimeout(doTake, 3000);
      }
    } else {
      globalEvents.emit('ui:alert', {
        title: 'Join failed',
        text: (p.reason as string) ?? 'Cannot join',
        type: 'error',
      });
    }
  });

  registerHandler(PacketType.GAME_INFO, (packet) => {
    store.gameInfo = packet as unknown as GameInfo;
    globalEvents.emit('game:info', packet);
  });

  registerHandler(PacketType.MAP_INFO, (packet) => {
    store.mapInfo = packet as unknown as MapInfo;
    mapAllocate();
    globalEvents.emit('map:allocated');
  });

  registerHandler(PacketType.CALENDAR_INFO, (packet) => {
    store.calendarInfo = packet as unknown as CalendarInfo;
  });

  registerHandler(PacketType.TIMEOUT_INFO, (packet) => {
    if (store.gameInfo) {
      (store.gameInfo as Record<string, unknown>).timeout = (
        packet as Record<string, unknown>
      ).timeout;
    }
  });

  registerHandler(PacketType.BEGIN_TURN, () => {
    globalEvents.emit('game:beginturn');
  });

  registerHandler(PacketType.END_TURN, () => {
    globalEvents.emit('game:endturn');
  });

  registerHandler(PacketType.NEW_YEAR, () => {
    globalEvents.emit('game:newyear');
  });

  registerHandler(PacketType.START_PHASE, () => {
    globalEvents.emit('game:startphase');
  });

  registerHandler(PacketType.END_PHASE, () => {
    globalEvents.emit('game:endphase');
  });

  registerHandler(PacketType.FREEZE_CLIENT, () => {
    store.frozen = true;
  });

  registerHandler(PacketType.THAW_CLIENT, () => {
    store.frozen = false;
  });

  registerHandler(PacketType.SERVER_SHUTDOWN, (packet) => {
    const p = packet as Record<string, unknown>;
    globalEvents.emit('ui:alert', {
      title: 'Server Shutdown',
      text: (p.message as string) ?? (p.reason as string) ?? 'Server is shutting down',
      type: 'error',
    });
  });
}
