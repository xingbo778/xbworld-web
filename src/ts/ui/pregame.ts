/**
 * Pregame lobby UI — observer-only mode.
 */

import { store } from '../data/store';
import { $id, show } from '../utils/dom';
import { isSmallScreen } from '../utils/helpers';
import { network_init } from '../net/connection';
import { showDialog, closeDialog } from './dialogs';

export function initPregame(): void {
  // No player-only buttons to bind in observer mode.
}

export function showIntroDialog(title: string, message: string): void {
  showDialog('intro_dialog', {
    title,
    content: `
      <p>${message}</p>
      <div style="margin-top: 12px;">
        <label for="username_req">Username:</label>
        <input id="username_req" type="text" maxlength="32" style="width: 200px; padding: 4px;" />
        <div id="username_validation_result" style="color: red; display: none;"></div>
      </div>
    `,
    modal: true,
    width: isSmallScreen() ? '90%' : '50%',
    buttons: {
      'Observe Game': () => {
        const input = $id('username_req') as HTMLInputElement | null;
        if (!input) return;
        const name = input.value.trim();
        if (!name || name.length < 3) {
          const valResult = $id('username_validation_result');
          if (valResult) {
            valResult.textContent = 'Username must be at least 3 characters.';
            show(valResult);
          }
          return;
        }
        store.username = name;
        localStorage.setItem('username', name);
        closeDialog('intro_dialog');
        network_init();
      },
    },
  });

  const savedName = localStorage.getItem('username');
  if (savedName) {
    const input = $id('username_req') as HTMLInputElement | null;
    if (input) input.value = savedName;
  }
}

export function initCommonIntroDialog(): void {
  showIntroDialog(
    'Welcome to XBWorld',
    'You are joining the game as an observer. Please enter your name:',
  );
}
