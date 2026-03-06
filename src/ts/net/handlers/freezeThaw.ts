/**
 * Freeze/thaw and processing handlers.
 */
import { store } from '../../data/store';

export function handle_processing_started(_packet: any): void {
  store.frozen = true;
}

export function handle_processing_finished(_packet: any): void {
  store.frozen = false;
}

export function handle_investigate_started(_packet: any): void { /* no-op */ }
export function handle_investigate_finished(_packet: any): void { /* no-op */ }

export function handle_freeze_hint(_packet: any): void {
  store.frozen = true;
}

export function handle_thaw_hint(_packet: any): void {
  store.frozen = false;
}

export function handle_freeze_client(_packet: any): void {
  store.frozen = true;
}

export function handle_thaw_client(_packet: any): void {
  store.frozen = false;
}
