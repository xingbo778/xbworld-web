/**
 * Observer mode controls — keyboard shortcuts and map click handling.
 *
 * Unit order hotkeys and goto mode are removed.
 * Map click opens city info dialog when applicable.
 */

import { globalEvents } from '../core/events';
import { store } from '../data/store';
import { on } from '../utils/dom';
import { show_city_dialog, close_city_dialog } from './cityDialog';
import { tileCity } from '../data/tile';

export function initControls(): void {
  on(document, 'keydown', handleKeyDown);

  globalEvents.on<{ tile: { index: number }; event: PointerEvent }>('map:tileclick', (data) => {
    if (!data) return;
    handleTileClick(data.tile.index);
  });
}

function handleKeyDown(e: KeyboardEvent): void {
  if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
  if (e.key === 'Escape') close_city_dialog();
}

function handleTileClick(tileIndex: number): void {
  const tile = store.tiles[tileIndex];
  if (!tile) return;

  const city = tileCity(tile);
  if (city) {
    show_city_dialog(city);
  } else {
    globalEvents.emit('tile:selected', tileIndex);
  }
}

export function getFocusedUnitId(): number | null { return null; }
export function activateGoto(): void {}
