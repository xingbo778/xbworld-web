import { signal } from '@preact/signals';
import { useRef } from 'preact/hooks';
import { Dialog } from '../Shared/Dialog';
import { Button } from '../Shared/Button';

interface CityInputState {
  open: boolean;
  title: string;
  prompt: string;
  initialValue: string;
  maxLength: number;
  onSubmit: (name: string) => void;
  onCancel: () => void;
}

const state = signal<CityInputState>({
  open: false,
  title: '',
  prompt: '',
  initialValue: '',
  maxLength: 64,
  onSubmit: () => {},
  onCancel: () => {},
});

export function showCityInputDialog(
  title: string,
  prompt: string,
  initialValue: string,
  maxLength: number,
  onSubmit: (name: string) => void,
  onCancel: () => void,
): void {
  state.value = { open: true, title, prompt, initialValue, maxLength, onSubmit, onCancel };
}

export function closeCityInputDialog(): void {
  state.value = { ...state.value, open: false };
}

export function CityInputDialog() {
  const { open, title, prompt, initialValue, maxLength, onSubmit, onCancel } = state.value;
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit() {
    const name = inputRef.current?.value ?? '';
    onSubmit(name);
  }

  function handleCancel() {
    closeCityInputDialog();
    onCancel();
  }

  return (
    <Dialog title={title} open={open} onClose={handleCancel} width="320px" modal>
      <div class="xb-dialog-row">{prompt}</div>
      <input
        ref={inputRef}
        type="text"
        defaultValue={initialValue}
        maxLength={maxLength}
        class="xb-form-input-full"
        onKeyUp={(e) => { if (e.key === 'Enter') handleSubmit(); }}
      />
      <div class="xb-dialog-footer-flex">
        <Button onClick={handleSubmit}>Ok</Button>
        <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
      </div>
    </Dialog>
  );
}
