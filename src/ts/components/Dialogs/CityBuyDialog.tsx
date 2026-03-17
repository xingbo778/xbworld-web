import { signal } from '@preact/signals';
import { parseGameHtml } from '../../utils/parseGameHtml';
import { Dialog } from '../Shared/Dialog';
import { Button } from '../Shared/Button';

interface CityBuyState {
  open: boolean;
  question: string;
}

const state = signal<CityBuyState>({ open: false, question: '' });

let _onConfirm: () => void = () => {};

export function showCityBuyDialog(question: string, onConfirm: () => void): void {
  _onConfirm = onConfirm;
  state.value = { open: true, question };
}

function close(): void {
  state.value = { ...state.value, open: false };
}

function handleYes(): void {
  close();
  _onConfirm();
}

export function CityBuyDialog() {
  const { open, question } = state.value;

  return (
    <Dialog title="Buy It!" open={open} onClose={close} width={window.innerWidth <= 600 ? '95%' : '50%'} modal>
      <div>{parseGameHtml(question)}</div>
      <div class="xb-dialog-footer-flex">
        <Button onClick={handleYes}>Yes</Button>
        <Button variant="secondary" onClick={close}>No</Button>
      </div>
    </Dialog>
  );
}
