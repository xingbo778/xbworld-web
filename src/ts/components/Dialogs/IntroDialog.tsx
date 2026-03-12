import { signal } from '@preact/signals';
import type { JSX } from 'preact';
import { useRef, useEffect } from 'preact/hooks';
import { Dialog } from '../Shared/Dialog';
import { Button } from '../Shared/Button';
import { store } from '../../data/store';

interface IntroState {
  open: boolean;
  title: string;
  message: string;
  error: string;
}

const state = signal<IntroState>({
  open: false,
  title: '',
  message: '',
  error: '',
});

export function showIntroDialog(title: string, message: string): void {
  state.value = { open: true, title, message, error: '' };
}

export function closeIntroDialog(): void {
  state.value = { ...state.value, open: false };
}

export function IntroDialog() {
  const { open, title, message, error } = state.value;
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && inputRef.current) {
      const saved = localStorage.getItem('username');
      if (saved) inputRef.current.value = saved;
      inputRef.current.focus();
    }
  }, [open]);

  const submit = () => {
    const name = inputRef.current?.value.trim() || '';
    if (name.length < 3) {
      state.value = { ...state.value, error: 'Username must be at least 3 characters.' };
      return;
    }
    store.username = name;
    localStorage.setItem('username', name);
    closeIntroDialog();
  };

  const handleKeyDown = (e: JSX.TargetedKeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') submit();
  };

  return (
    <Dialog
      title={title}
      open={open}
      width={window.innerWidth <= 600 ? '90%' : '50%'}
      modal={true}
    >
      <p>{message}</p>
      <div style={{ marginTop: '12px' }}>
        <label>
          Username:{' '}
          <input
            id="username_req"
            ref={inputRef}
            type="text"
            maxLength={32}
            onKeyDown={handleKeyDown}
            style={{
              padding: '4px 8px',
              fontSize: '14px',
              background: 'var(--xb-bg-elevated, #21262d)',
              color: 'var(--xb-text-primary, #e6edf3)',
              border: '1px solid var(--xb-border-default, #30363d)',
              borderRadius: 'var(--xb-radius-sm, 3px)',
              width: '200px',
              outline: 'none',
            }}
          />
        </label>
        {error && (
          <div style={{ color: 'var(--xb-accent-red, #f85149)', marginTop: '4px', fontSize: '13px' }}>{error}</div>
        )}
      </div>
      <div style={{ marginTop: '12px', textAlign: 'right' }}>
        <Button onClick={submit}>Observe Game</Button>
      </div>
    </Dialog>
  );
}
