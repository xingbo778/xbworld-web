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

  const overlayStyle = {
    position: 'fixed' as const,
    inset: '0',
    zIndex: 10000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0,0,0,0.82)',
  };

  const boxStyle = {
    background: 'var(--xb-bg-primary, #0d1117)',
    border: '1px solid var(--xb-border-default, #30363d)',
    borderRadius: '10px',
    padding: '32px 40px',
    color: 'var(--xb-text-primary, #e6edf3)',
    textAlign: 'center' as const,
    maxWidth: '440px',
    width: '90%',
    boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
  };

  if (state.phase === 'reconnecting') {
    return (
      <div style={overlayStyle}>
        <div style={boxStyle}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>⚡</div>
          <h2 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 700 }}>
            Connection Lost
          </h2>
          <p style={{ margin: '0 0 20px', color: 'var(--xb-text-secondary, #8b949e)', fontSize: '14px' }}>
            Reconnecting in <b style={{ color: 'var(--xb-text-primary, #e6edf3)' }}>{state.countdown}s</b>
            {' '}— attempt {state.attempt + 1} of {state.max}
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <Button onClick={doReconnectNow}>Try Now</Button>
            <button
              onClick={() => location.reload()}
              style={{
                background: 'none',
                border: '1px solid var(--xb-border-default, #30363d)',
                color: 'var(--xb-text-secondary, #8b949e)',
                borderRadius: '6px',
                padding: '6px 16px',
                cursor: 'pointer',
                fontSize: '13px',
              }}
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
    <div style={overlayStyle}>
      <div style={boxStyle}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>⚠</div>
        <h2 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 700, color: 'var(--xb-accent-red, #f85149)' }}>
          Disconnected
        </h2>
        <p style={{ margin: '0 0 20px', color: 'var(--xb-text-secondary, #8b949e)', fontSize: '14px' }}>
          Could not reconnect to the game server.
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <Button onClick={doTryAgain}>Try Again</Button>
          <button
            onClick={() => location.reload()}
            style={{
              background: 'none',
              border: '1px solid var(--xb-border-default, #30363d)',
              color: 'var(--xb-text-secondary, #8b949e)',
              borderRadius: '6px',
              padding: '6px 16px',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            Reload Page
          </button>
        </div>
      </div>
    </div>
  );
}
