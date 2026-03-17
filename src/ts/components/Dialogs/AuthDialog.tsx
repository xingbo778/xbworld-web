import { signal } from '@preact/signals';
import { useRef } from 'preact/hooks';
import { Dialog } from '../Shared/Dialog';
import { Button } from '../Shared/Button';
import { send_request } from '../../net/connection';
import { packet_authentication_reply } from '../../net/packetConstants';

interface AuthState {
  open: boolean;
  message: string;
}

const state = signal<AuthState>({
  open: false,
  message: '',
});

export function showAuthDialog(packet: { message: string; [key: string]: unknown }): void {
  state.value = { open: true, message: packet['message'] || '' };
}

function closeAuthDialog(): void {
  state.value = { ...state.value, open: false };
}

export function AuthDialog() {
  const { open, message } = state.value;
  const inputRef = useRef<HTMLInputElement>(null);

  const submit = () => {
    const pwd = inputRef.current?.value || '';
    const pwd_packet = {
      pid: packet_authentication_reply,
      password: pwd,
    };
    send_request(JSON.stringify(pwd_packet));
    closeAuthDialog();
  };

  return (
    <Dialog
      title="Private server needs password to enter"
      open={open}
      width={window.innerWidth <= 600 ? '80%' : '60%'}
      modal={true}
    >
      <div class="xb-dialog-row">{message}</div>
      <div class="xb-dialog-row-mt">
        <label>
          Password:{' '}
          <input
            ref={inputRef}
            type="text"
            class="xb-form-input-auth"
          />
        </label>
      </div>
      <div class="xb-dialog-footer-right">
        <Button onClick={submit}>Ok</Button>
      </div>
    </Dialog>
  );
}
