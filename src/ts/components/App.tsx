import { render } from 'preact';
import { useRef } from 'preact/hooks';
import type { ComponentChildren } from 'preact';
import type { ReadonlySignal } from '@preact/signals';
import { MessageDialog } from './Dialogs/MessageDialog';
import { AlertDialog } from './Dialogs/AlertDialog';
import { AuthDialog } from './Dialogs/AuthDialog';
import { IntelDialog } from './Dialogs/IntelDialog';
import { SwalDialog } from './Dialogs/SwalDialog';
import { CityDialog, cityDialogSignal } from './Dialogs/CityDialog';
import { CityBuyDialog } from './Dialogs/CityBuyDialog';
import { CityInputDialog } from './Dialogs/CityInputDialog';
import { TechGainedDialog } from './Dialogs/TechGainedDialog';
import { WikiDialog, TechInfoDialog, wikiDialogSignal, techInfoDialogSignal } from './Dialogs/TechDialog';
import { TaxRatesDialog } from './Dialogs/TaxRatesDialog';
import { GameScoresDialog } from './Dialogs/GameScoresDialog';
import { TileInfoDialog } from './Dialogs/TileInfoDialog';
import { ChatContextDialog } from './ChatContextDialog';
import { BlockingOverlay } from './BlockingOverlay';
import { DisconnectOverlay } from './DisconnectOverlay';
import { IntroDialog } from './Dialogs/IntroDialog';
import { StatusBar } from './StatusBar';
import { AdminDashboard, adminPanelOpen } from './AdminDashboard';

/**
 * LazyMountOnce — defers mounting children until the controlling signal is
 * truthy for the first time, then keeps them mounted permanently.
 *
 * Benefit: heavy dialogs (CityDialog, TechDialog) are not instantiated at
 * app startup — no hooks run, no effects fire, no signal subscriptions are
 * created — until the user actually opens them for the first time.
 * After first activation the dialog stays in the tree (avoiding re-mount
 * cost on subsequent opens).
 */
function LazyMountOnce({ signal: sig, children }: {
  signal: ReadonlySignal<unknown>;
  children: ComponentChildren;
}) {
  const ever = useRef(false);
  if (!ever.current && sig.value) ever.current = true;
  return ever.current ? <>{children}</> : null;
}

function App() {
  return (
    <div id="xb-preact-root">
      {/* Full-screen blocking overlay (loading/connecting) */}
      <BlockingOverlay />
      {/* Disconnect/reconnect modal */}
      <DisconnectOverlay />

      {/* Floating dialogs — lightweight dialogs mount immediately */}
      <MessageDialog />
      <AlertDialog />
      <AuthDialog />
      <IntelDialog />
      <SwalDialog />
      <CityBuyDialog />
      <CityInputDialog />
      <TechGainedDialog />
      <TaxRatesDialog />
      <GameScoresDialog />
      <TileInfoDialog />
      <IntroDialog />
      <ChatContextDialog />

      {/* Heavy dialogs — deferred until first open via LazyMountOnce */}
      <LazyMountOnce signal={cityDialogSignal}>
        <CityDialog />
      </LazyMountOnce>
      <LazyMountOnce signal={wikiDialogSignal}>
        <WikiDialog />
      </LazyMountOnce>
      <LazyMountOnce signal={techInfoDialogSignal}>
        <TechInfoDialog />
      </LazyMountOnce>

      {/* Admin dashboard overlay — deferred until first open */}
      <LazyMountOnce signal={adminPanelOpen}>
        {adminPanelOpen.value && (
          <div
            style={{
              position: 'fixed', inset: 0, zIndex: 2000,
              background: 'rgba(0,0,0,0.6)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}
            onClick={(e) => { if (e.target === e.currentTarget) adminPanelOpen.value = false; }}
          >
            <div style={{ position: 'relative', width: '90vw', maxWidth: '1200px', height: '85vh', overflow: 'hidden', borderRadius: '8px' }}>
              <button
                onClick={() => { adminPanelOpen.value = false; }}
                style={{ position: 'absolute', top: 8, right: 8, zIndex: 10, background: 'transparent', border: 'none', color: 'var(--xb-text-primary)', fontSize: '18px', cursor: 'pointer', lineHeight: 1 }}
                aria-label="Close admin"
              >×</button>
              <AdminDashboard />
            </div>
          </div>
        )}
      </LazyMountOnce>
    </div>
  );
}

let mounted = false;

export function mountPreactApp(): void {
  if (mounted) return;
  let container = document.getElementById('xb-preact-dialogs');
  if (!container) {
    container = document.createElement('div');
    container.id = 'xb-preact-dialogs';
    document.body.appendChild(container);
  }
  render(<App />, container);

  // Mount StatusBar into the bottom status element if it exists
  const statusContainer = document.getElementById('xb-status-bar-mount') ?? (() => {
    const el = document.createElement('div');
    el.id = 'xb-status-bar-mount';
    el.style.position = 'fixed';
    el.style.bottom = '0';
    el.style.left = '0';
    el.style.right = '0';
    el.style.zIndex = '800';
    document.body.appendChild(el);
    return el;
  })();
  render(<StatusBar />, statusContainer);

  mounted = true;
}
