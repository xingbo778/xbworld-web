import { signal } from '@preact/signals';
import { Dialog } from '../Shared/Dialog';
import { Button } from '../Shared/Button';

interface IntelState {
  open: boolean;
  title: string;
  html: string;
}

const state = signal<IntelState>({
  open: false,
  title: '',
  html: '',
});

export function showIntelDialog(title: string, html: string): void {
  state.value = { open: true, title, html };
}

export function closeIntelDialog(): void {
  state.value = { ...state.value, open: false };
  const input = document.getElementById('game_text_input') as HTMLElement | null;
  if (input) input.blur();
}

export function IntelDialog() {
  const { open, title, html } = state.value;

  return (
    <Dialog
      title={title}
      open={open}
      onClose={closeIntelDialog}
      width={window.innerWidth <= 600 ? '90%' : 'auto'}
      modal={true}
    >
      <div
        style={{ maxHeight: '70vh', overflow: 'auto' }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <div style={{ marginTop: '12px', textAlign: 'right' }}>
        <Button onClick={closeIntelDialog}>Ok</Button>
      </div>
    </Dialog>
  );
}
