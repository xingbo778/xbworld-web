/**
 * BlockingOverlay — full-screen loading/connecting overlay.
 * Replaces the DOM-builder blockUI() / unblockUI() in utils/dom.ts.
 * Activated via showBlockingOverlay() / hideBlockingOverlay() imperative API.
 */
import { signal } from '@preact/signals';
import { parseGameHtml } from '../utils/parseGameHtml';

const overlayHtml = signal<string | null>(null);

export function showBlockingOverlay(html: string): void {
  overlayHtml.value = html;
}

export function hideBlockingOverlay(): void {
  overlayHtml.value = null;
}

export function BlockingOverlay() {
  const html = overlayHtml.value;
  if (!html) return null;
  return (
    <div class="xb-block-overlay xb-overlay xb-overlay-backdrop">
      <div class="xb-block-message xb-overlay-content">
        {parseGameHtml(html)}
      </div>
    </div>
  );
}
