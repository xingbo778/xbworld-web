import { signal } from '@preact/signals';
import { Dialog } from '../Shared/Dialog';
import { Button } from '../Shared/Button';

interface MessageState {
  open: boolean;
  title: string;
  message: string;
}

const state = signal<MessageState>({
  open: false,
  title: '',
  message: '',
});

let autoCloseTimer: ReturnType<typeof setTimeout> | null = null;

export function showMessageDialog(title: string, message: string): void {
  if (autoCloseTimer) {
    clearTimeout(autoCloseTimer);
    autoCloseTimer = null;
  }
  state.value = { open: true, title, message };
  // Auto-close after 24 seconds (matches legacy behavior)
  autoCloseTimer = setTimeout(() => {
    closeMessageDialog();
  }, 24000);
}

export function closeMessageDialog(): void {
  if (autoCloseTimer) {
    clearTimeout(autoCloseTimer);
    autoCloseTimer = null;
  }
  state.value = { ...state.value, open: false };
  const input = document.getElementById('game_text_input') as HTMLElement | null;
  if (input) input.blur();
}

export function MessageDialog() {
  const { open, title, message } = state.value;

  return (
    <Dialog
      title={title}
      open={open}
      onClose={closeMessageDialog}
      width={window.innerWidth <= 600 ? '90%' : '50%'}
      modal={false}
    >
      <div
        style={{ maxHeight: '450px', overflow: 'auto' }}
        dangerouslySetInnerHTML={{ __html: message }}
      />
      <div style={{ marginTop: '12px', textAlign: 'right' }}>
        <Button onClick={closeMessageDialog}>Ok</Button>
      </div>
    </Dialog>
  );
}
