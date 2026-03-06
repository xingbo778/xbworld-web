/**
 * Freeze/thaw and processing handlers.
 */
import { store } from '../../data/store';
import type { BasePacket } from './packetTypes';

export function handle_processing_started(_packet: BasePacket): void {
  store.frozen = true;
}

export function handle_processing_finished(_packet: BasePacket): void {
  store.frozen = false;
}

export function handle_investigate_started(_packet: BasePacket): void { /* no-op */ }
export function handle_investigate_finished(_packet: BasePacket): void { /* no-op */ }

export function handle_freeze_hint(_packet: BasePacket): void {
  store.frozen = true;
}

export function handle_thaw_hint(_packet: BasePacket): void {
  store.frozen = false;
}

export function handle_freeze_client(_packet: BasePacket): void {
  store.frozen = true;
}

export function handle_thaw_client(_packet: BasePacket): void {
  store.frozen = false;
}
