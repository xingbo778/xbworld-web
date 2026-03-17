import { signal } from '@preact/signals';
import { parseGameHtml } from '../../utils/parseGameHtml';
import { Dialog } from '../Shared/Dialog';
import { Button } from '../Shared/Button';

interface TechGainedState {
  open: boolean;
  title: string;
  message: string;
}

const state = signal<TechGainedState>({
  open: false,
  title: '',
  message: '',
});

export function showTechGainedDialog(title: string, message: string): void {
  state.value = { open: true, title, message };
}

function close(): void {
  state.value = { ...state.value, open: false };
  const input = document.getElementById('game_text_input') as HTMLElement | null;
  if (input) input.blur();
}

function showTechTree(): void {
  close();
  import('../../ui/tabs').then(m => m.setActiveTab('#tabs', 2));
  import('../../ui/techDialog').then(m => m.update_tech_screen());
}

export function TechGainedDialog() {
  const { open, title, message } = state.value;

  return (
    <Dialog
      title={title}
      open={open}
      onClose={close}
      width={window.innerWidth <= 600 ? '90%' : '60%'}
      modal={false}
    >
      <div class="xb-dialog-body-scroll" style={{ maxHeight: '70vh' }}>
        {parseGameHtml(message)}
      </div>
      <div class="xb-dialog-footer-flex">
        <Button onClick={close}>Close</Button>
        <Button variant="secondary" onClick={showTechTree}>Show Technology Tree</Button>
      </div>
    </Dialog>
  );
}
