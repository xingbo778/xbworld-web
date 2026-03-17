/**
 * DisconnectOverlay — full-screen modal shown on WebSocket disconnect.
 *
 * Two phases:
 *  • reconnecting — countdown + "Try Now" button; auto-dismisses on success.
 *  • disconnected  — give-up state with "Try Again" and "Reload Page" buttons.
 *
 * Driven by the `disconnectOverlay` signal in data/signals.ts.
 * connection.ts writes to the signal; this component only reads it.
 */
import { disconnectOverlay } from '../data/signals';
import { Button } from './Shared/Button';

// Lazily import connection functions to avoid circular deps at module load time.
async function doReconnectNow() {
  const { reconnectNow } = await import('../net/connection');
  reconnectNow();
}
async function doTryAgain() {
  const { tryAgain } = await import('../net/connection');
  tryAgain();
}

export function DisconnectOverlay() {
  const state = disconnectOverlay.value;
  if (!state) return null;

  if (state.phase === 'reconnecting') {
    return (
      <div class="xb-disconnect-overlay">
        <div class="xb-disconnect-box">
          <div class="xb-disconnect-icon">⚡</div>
          <h2 class="xb-disconnect-title">
            Connection Lost
          </h2>
          <p class="xb-disconnect-message">
            Reconnecting in <b class="xb-disconnect-countdown">{state.countdown}s</b>
            {' '}— attempt {state.attempt + 1} of {state.max}
          </p>
          <div class="xb-disconnect-actions">
            <Button onClick={doReconnectNow}>Try Now</Button>
            <button
              onClick={() => location.reload()}
              class="xb-disconnect-reload-btn"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  // phase === 'disconnected'
  return (
    <div class="xb-disconnect-overlay">
      <div class="xb-disconnect-box">
        <div class="xb-disconnect-icon">⚠</div>
        <h2 class="xb-disconnect-title xb-disconnect-title-error">
          Disconnected
        </h2>
        <p class="xb-disconnect-message">
          Could not reconnect to the game server.
        </p>
        <div class="xb-disconnect-actions">
          <Button onClick={doTryAgain}>Try Again</Button>
          <button
            onClick={() => location.reload()}
            class="xb-disconnect-reload-btn"
          >
            Reload Page
          </button>
        </div>
      </div>
    </div>
  );
}
