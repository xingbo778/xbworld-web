import { registerHandler } from './index';
import { PacketType } from './protocol';
import { store } from '../../data/store';
import { globalEvents } from '../../core/events';
import type { City } from '../../data/types';
import type {
  CityRemovePacket,
  WebCityInfoAdditionPacket,
} from '../handlers/packetTypes';

function mergeCity(packet: Record<string, unknown>, key: 'id' | 'city_id' = 'id'): void {
  const id = packet[key] as number;
  if (id !== undefined) {
    store.cities[id] = { ...store.cities[id], ...packet } as City;
  }
}

export function registerCityHandlers(): void {
  registerHandler(PacketType.CITY_INFO, (packet) => {
    const p = packet as unknown as City;
    store.cities[p.id] = p;
    globalEvents.emit('city:updated', packet);
  });

  registerHandler(PacketType.CITY_SHORT_INFO, (packet) => {
    mergeCity(packet);
    globalEvents.emit('city:updated', packet);
  });

  registerHandler(PacketType.CITY_REMOVE, (packet) => {
    const p = packet as unknown as CityRemovePacket;
    delete store.cities[p.city_id];
    globalEvents.emit('city:removed', packet);
  });

  registerHandler(PacketType.CITY_NAME_SUGGESTION_INFO, (packet) => {
    globalEvents.emit('city:namesuggestion', packet);
  });

  registerHandler(PacketType.WEB_CITY_INFO_ADDITION, (packet) => {
    const p = packet as unknown as WebCityInfoAdditionPacket;
    store.cities[p.id] = { ...store.cities[p.id], ...p } as City;
  });

  registerHandler(PacketType.CITY_NATIONALITIES, (packet) => {
    mergeCity(packet, 'city_id');
  });

  registerHandler(PacketType.CITY_RALLY_POINT, (packet) => {
    mergeCity(packet, 'city_id');
  });

  registerHandler(PacketType.TRADE_ROUTE_INFO, (packet) => {
    globalEvents.emit('city:traderoute', packet);
  });
}
