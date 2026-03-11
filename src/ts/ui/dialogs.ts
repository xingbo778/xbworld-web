/**
 * Dialog system — Preact delegates.
 *
 * showAlert() delegates to AlertDialog (Preact).
 * showMessage() delegates to MessageDialog (Preact).
 *
 * The old DOM-builder showDialog/closeDialog have been removed (no callers).
 */

import { showAlertDialog } from '../components/Dialogs/AlertDialog';
import { showMessageDialog } from '../components/Dialogs/MessageDialog';

/** Show an alert dialog using the Preact AlertDialog component. */
export function showAlert(
  title: string,
  text: string,
  type: 'info' | 'error' | 'warning' = 'info',
): void {
  showAlertDialog(title, text, type);
}

/** Show a message dialog using the Preact MessageDialog component. */
export function showMessage(title: string, message: string): void {
  showMessageDialog(title, message);
}
