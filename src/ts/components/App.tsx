import { render } from 'preact';
import { PillageDialog } from './Dialogs/PillageDialog';

function App() {
  return (
    <div id="xb-preact-root">
      <PillageDialog />
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
