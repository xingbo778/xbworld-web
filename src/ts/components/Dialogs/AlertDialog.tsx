/**
 * AlertDialog — Preact replacement for the DOM-based showAlert() in ui/dialogs.ts.
 * Mounted once in App.tsx; activated via showAlertDialog().
 */
import { signal } from '@preact/signals';
import { Dialog } from '../Shared/Dialog';
import { Button } from '../Shared/Button';

type AlertType = 'info' | 'error' | 'warning';

interface AlertState {
  open: boolean;
  title: string;
  text: string;
  type: AlertType;
}

const alertState = signal<AlertState>({ open: false, title: '', text: '', type: 'info' });

export function showAlertDialog(
  title: string,
  text: string,
  type: AlertType = 'info',
): void {
  alertState.value = { open: true, title, text, type };
}

export function closeAlertDialog(): void {
  alertState.value = { ...alertState.value, open: false };
}

const TYPE_CLASS: Record<AlertType, string> = {
  info:    'xb-alert-text-info',
  warning: 'xb-alert-text-warning',
  error:   'xb-alert-text-error',
};

export function AlertDialog() {
  const { open, title, text, type } = alertState.value;
  if (!open) return null;
  return (
    <Dialog title={title} open onClose={closeAlertDialog} width={400} modal>
      <p class={`xb-alert-text ${TYPE_CLASS[type]}`}>{text}</p>
      <div class="xb-dialog-footer-right">
        <Button onClick={closeAlertDialog}>Ok</Button>
      </div>
    </Dialog>
  );
}
