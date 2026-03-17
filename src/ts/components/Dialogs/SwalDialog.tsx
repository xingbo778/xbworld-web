/**
 * Drop-in replacement for SweetAlert (swal).
 *
 * Supports the two call signatures used in the codebase:
 *   swal(title)
 *   swal(title, text, type)
 *   swal({title, text, type, showCancelButton, confirmButtonText, ...}, callback)
 */
import { signal } from '@preact/signals';
import { Dialog } from '../Shared/Dialog';
import { Button } from '../Shared/Button';

interface SwalState {
  open: boolean;
  title: string;
  text: string;
  type: string; // 'warning' | 'error' | 'success' | 'info' | ''
  showCancelButton: boolean;
  confirmButtonText: string;
  onConfirm: (() => void) | null;
}

const state = signal<SwalState>({
  open: false,
  title: '',
  text: '',
  type: '',
  showCancelButton: false,
  confirmButtonText: 'OK',
  onConfirm: null,
});

function closeSwal(): void {
  state.value = { ...state.value, open: false };
}

function confirm(): void {
  const cb = state.value.onConfirm;
  closeSwal();
  if (cb) cb();
}

const TYPE_ICONS: Record<string, string> = {
  warning: '\u26a0\ufe0f',
  error: '\u274c',
  success: '\u2705',
  info: '\u2139\ufe0f',
};

export function swal(
  titleOrOpts: string | Record<string, unknown>,
  textOrCb?: string | (() => void),
  type?: string,
): void {
  if (typeof titleOrOpts === 'object') {
    const opts = titleOrOpts;
    const cb = typeof textOrCb === 'function' ? textOrCb : null;
    state.value = {
      open: true,
      title: (opts.title as string) || '',
      text: (opts.text as string) || '',
      type: (opts.type as string) || '',
      showCancelButton: !!opts.showCancelButton,
      confirmButtonText: (opts.confirmButtonText as string) || 'OK',
      onConfirm: cb,
    };
  } else {
    state.value = {
      open: true,
      title: titleOrOpts,
      text: typeof textOrCb === 'string' ? textOrCb : '',
      type: type || '',
      showCancelButton: false,
      confirmButtonText: 'OK',
      onConfirm: null,
    };
  }
}

export function SwalDialog() {
  const { open, title, text, type, showCancelButton, confirmButtonText } = state.value;

  const icon = TYPE_ICONS[type] || '';

  return (
    <Dialog
      title={icon ? `${icon} ${title}` : title}
      open={open}
      onClose={closeSwal}
      width={360}
      modal={true}
    >
      {text && <div class="xb-swal-text">{text}</div>}
      <div class="xb-dialog-footer-flex-end">
        {showCancelButton && (
          <Button onClick={closeSwal}>Cancel</Button>
        )}
        <Button onClick={confirm}>{confirmButtonText}</Button>
      </div>
    </Dialog>
  );
}
