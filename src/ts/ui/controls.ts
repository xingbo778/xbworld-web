/**
 * Observer mode controls — keyboard shortcuts.
 *
 * Unit order hotkeys and goto mode are removed.
 * Map tile clicks are handled by mapctrl.ts → do_map_click → show_city_dialog.
 */

import { on } from '../utils/dom';
import { close_city_dialog } from './cityDialog';

export function initControls(): void {
  on(document, 'keydown', handleKeyDown);
}

function handleKeyDown(e: KeyboardEvent): void {
  if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
  if (e.key === 'Escape') close_city_dialog();
}

export function getFocusedUnitId(): number | null { return null; }
export function activateGoto(): void {}
