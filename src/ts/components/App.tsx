import { render } from 'preact';
import { MessageDialog } from './Dialogs/MessageDialog';
import { AlertDialog } from './Dialogs/AlertDialog';
import { AuthDialog } from './Dialogs/AuthDialog';
import { IntelDialog } from './Dialogs/IntelDialog';
import { SwalDialog } from './Dialogs/SwalDialog';
import { CityDialog } from './Dialogs/CityDialog';
import { CityBuyDialog } from './Dialogs/CityBuyDialog';
import { CityInputDialog } from './Dialogs/CityInputDialog';
import { TechGainedDialog } from './Dialogs/TechGainedDialog';
import { WikiDialog, TechInfoDialog } from './Dialogs/TechDialog';
import { TaxRatesDialog } from './Dialogs/TaxRatesDialog';
import { ChatContextDialog } from './ChatContextDialog';
import { BlockingOverlay } from './BlockingOverlay';
import { IntroDialog } from './Dialogs/IntroDialog';
import { StatusBar } from './StatusBar';

function App() {
  return (
    <div id="xb-preact-root">
      {/* Full-screen blocking overlay (loading/connecting) */}
      <BlockingOverlay />

      {/* Floating dialogs */}
      <MessageDialog />
      <AlertDialog />
      <AuthDialog />
      <IntelDialog />
      <SwalDialog />
      <CityDialog />
      <CityBuyDialog />
      <CityInputDialog />
      <TechGainedDialog />
      <WikiDialog />
      <TechInfoDialog />
      <TaxRatesDialog />
      <IntroDialog />
      <ChatContextDialog />

      {/* HUD — mounted into dedicated containers below */}
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
