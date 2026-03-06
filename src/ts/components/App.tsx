import { render } from 'preact';
import { PillageDialog } from './Dialogs/PillageDialog';
import { MessageDialog } from './Dialogs/MessageDialog';
import { AuthDialog } from './Dialogs/AuthDialog';
import { IntroDialog } from './Dialogs/IntroDialog';
import { IntelDialog } from './Dialogs/IntelDialog';
import { SwalDialog } from './Dialogs/SwalDialog';
import { GovernmentDialog } from './Dialogs/GovernmentDialog';
import { RatesDialog } from './Dialogs/RatesDialog';

function App() {
  return (
    <div id="xb-preact-root">
      <PillageDialog />
      <MessageDialog />
      <AuthDialog />
      <IntroDialog />
      <IntelDialog />
      <SwalDialog />
      <GovernmentDialog />
      <RatesDialog />
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
  mounted = true;
}
