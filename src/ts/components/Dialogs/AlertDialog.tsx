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

const TYPE_COLOR: Record<AlertType, string> = {
  info:    'var(--xb-text-primary, #e6edf3)',
  warning: 'var(--xb-accent-yellow, #d29922)',
  error:   'var(--xb-accent-red, #f85149)',
};

export function AlertDialog() {
  const { open, title, text, type } = alertState.value;
  if (!open) return null;
  return (
    <Dialog title={title} open onClose={closeAlertDialog} width={400} modal>
      <p style={{ margin: '0 0 16px', color: TYPE_COLOR[type] }}>{text}</p>
      <div style={{ textAlign: 'right' }}>
        <Button onClick={closeAlertDialog}>Ok</Button>
      </div>
    </Dialog>
  );
}
