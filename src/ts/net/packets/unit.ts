import { registerHandler } from './index';
import { PacketType } from './protocol';
import { store } from '../../data/store';
import { globalEvents } from '../../core/events';
import type { Unit } from '../../data/types';

export function registerUnitHandlers(): void {
  registerHandler(PacketType.UNIT_INFO, (packet) => {
    const p = packet as unknown as Unit;
    store.units[p.id] = p;
    globalEvents.emit('unit:updated', packet);
  });

  registerHandler(PacketType.UNIT_SHORT_INFO, (packet) => {
    const p = packet as Record<string, unknown>;
    const id = (p.id ?? p.unit_id) as number | undefined;
    if (id !== undefined) {
      store.units[id] = { ...store.units[id], ...p } as Unit;
    }
    globalEvents.emit('unit:updated', packet);
  });

  registerHandler(PacketType.UNIT_REMOVE, (packet) => {
    const p = packet as Record<string, unknown>;
    delete store.units[p.unit_id as number];
    globalEvents.emit('unit:removed', packet);
  });

  registerHandler(PacketType.UNIT_COMBAT_INFO, (packet) => {
    globalEvents.emit('unit:combat', packet);
  });

  registerHandler(PacketType.UNIT_ACTIONS, (packet) => {
    globalEvents.emit('unit:actions', packet);
  });

  registerHandler(PacketType.UNIT_ACTION_ANSWER, (packet) => {
    globalEvents.emit('unit:actionanswer', packet);
  });
}
