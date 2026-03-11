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
    <div class="xb-block-overlay" style={{
      position: 'fixed',
      inset: '0',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0,0,0,0.75)',
    }}>
      <div class="xb-block-message" style={{
        background: 'var(--xb-bg-primary, #0d1117)',
        border: '1px solid var(--xb-border, #30363d)',
        borderRadius: '8px',
        padding: '24px 32px',
        color: 'var(--xb-text-primary, #e6edf3)',
        fontSize: '16px',
        textAlign: 'center',
        maxWidth: '480px',
      }}>
        {parseGameHtml(html)}
      </div>
    </div>
  );
}
