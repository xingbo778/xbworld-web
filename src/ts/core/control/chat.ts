/**
 * Chat context and message handling.
 *
 * Extracted from core/control.ts — chat_context_*, set_chat_direction,
 * encode_message_text, is_unprefixed_message, check_text_input.
 */

import { isLongturn as is_longturn } from '../../client/clientCore';
import { clientState as client_state, C_S_RUNNING, clientPlaying } from '../../client/clientState';
import { PlayerFlag } from '../../data/player';
import { send_message } from '../../net/connection';
import { isTouchDevice as is_touch_device } from '../../utils/helpers';
import { message_log, max_chat_message_length } from '../../core/messages';
import { E_LOG_ERROR } from '../../data/eventConstants';
import * as S from './controlState';

const FC_PLRF_AI = PlayerFlag.PLRF_AI;

import { store } from '../../data/store';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A chat recipient entry shown in the recipient picker. */
interface ChatRecipient {
  id: number | null;
  flag: CanvasImageSource | null;
  description: string;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function chat_context_change(): void {
  const recipients = chat_context_get_recipients();
  if (recipients.length < 4) {
    chat_context_set_next(recipients);
  } else {
    chat_context_dialog_show(recipients);
  }
}

export function chat_context_get_recipients(): ChatRecipient[] {
  const pm: ChatRecipient[] = [];

  pm.push({ id: null, flag: null, description: 'Everybody' });

  let self = -1;
  if (clientPlaying() != null) {
    self = clientPlaying()!['playerno'];
  }

  for (const player_id_str in store.players) {
    const player_id = parseInt(player_id_str);
    if (player_id == self) continue;

    const pplayer = store.players[player_id];
    if (pplayer['flags']!.isSet(FC_PLRF_AI)) continue;
    if (!pplayer['is_alive']) continue;
    if (is_longturn() && pplayer['name'].indexOf("New Available Player") != -1) continue;

    const nation = store.nations[pplayer['nation']];
    if (nation == null) continue;

    pm.push({
      id: player_id,
      description: pplayer['name'] + " of the " + nation['adjective'],
      flag: store.sprites["f." + nation['graphic_str']]
    });
  }

  pm.sort(function(a: ChatRecipient, b: ChatRecipient) {
    if (a.id == null) return -1;
    if (b.id == null) return 1;
    if (a.id == self) return -1;
    if (b.id == self) return 1;
    if (a.description < b.description) return -1;
    if (a.description > b.description) return 1;
    return 0;
  });

  return pm;
}

export function chat_context_set_next(recipients: ChatRecipient[]): void {
  let next = 0;
  while (next < recipients.length && recipients[next].id != S.chat_send_to) {
    next++;
  }
  next++;
  if (next >= recipients.length) {
    next = 0;
  }

  set_chat_direction(recipients[next].id);
}

export function chat_context_dialog_show(recipients: ChatRecipient[]): void {
  const existingDlg = document.getElementById('chat_context_dialog');
  if (existingDlg) existingDlg.remove();
  const dlgDiv = document.createElement('div');
  dlgDiv.id = 'chat_context_dialog';
  dlgDiv.title = 'Choose chat recipient';
  document.querySelector('div#game_page')!.appendChild(dlgDiv);

  let self = -1;
  if (clientPlaying() != null) {
    self = clientPlaying()!['playerno'];
  }

  const tbody_el = document.createElement('tbody');

  const add_row = function(id: number | null, flag: CanvasImageSource | null, description: string): CanvasRenderingContext2D {
    let flag_canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, row: HTMLTableRowElement, cell: HTMLTableCellElement;
    row = document.createElement('tr');
    cell = document.createElement('td');
    flag_canvas = document.createElement('canvas');
    flag_canvas.width = 29;
    flag_canvas.height = 20;
    ctx = flag_canvas.getContext("2d")!;
    if (flag != null) {
      ctx.drawImage(flag, 0, 0);
    }
    cell.appendChild(flag_canvas);
    row.appendChild(cell);
    cell = document.createElement('td');
    cell.appendChild(document.createTextNode(description));
    row.appendChild(cell);
    if (id != null) {
      row.dataset.chatSendTo = String(id);
    }
    tbody_el.appendChild(row);
    return ctx;
  };

  for (let i = 0; i < recipients.length; i++) {
    if (recipients[i].id != S.chat_send_to) {
      const ctx = add_row(recipients[i].id, recipients[i].flag,
        recipients[i].description);

      if (recipients[i].id == null || recipients[i].id == self) {
        ctx.font = "18px FontAwesome";
        ctx.fillStyle = "rgba(32, 32, 32, 1)";
        if (recipients[i].id == null) {
          ctx.fillText(S.CHAT_ICON_EVERYBODY, 5, 15);
        } else {
          ctx.fillText(S.CHAT_ICON_ALLIES, 8, 16);
        }
      }
    }
  }

  const table = document.createElement('table');
  table.appendChild(tbody_el);
  table.addEventListener('click', function(ev: Event) {
    const row = (ev.target as HTMLElement).closest('tbody tr') as HTMLElement | null;
    if (row) {
      handle_chat_direction_chosen.call(row, ev);
    }
  });
  dlgDiv.appendChild(table);

  // Show as a simple positioned popup
  dlgDiv.style.cssText = 'position:absolute;z-index:5000;background:#222;border:1px solid #555;padding:8px;max-height:' + Math.floor(0.9 * window.innerHeight) + 'px;overflow-y:auto;';
  dlgDiv.style.display = 'block';
}

export function handle_chat_direction_chosen(this: HTMLElement, ev: Event): void {
  const new_send_to = this.dataset.chatSendTo;
  const chatDlg = document.getElementById('chat_context_dialog');
  if (chatDlg) chatDlg.remove();
  if (new_send_to == null) {
    set_chat_direction(null);
  } else {
    set_chat_direction(parseFloat(new_send_to));
  }
}

export function set_chat_direction(player_id: number | null): void {
  if (player_id == S.chat_send_to) return;

  let player_name: string;
  const iconEl = document.getElementById('chat_direction') as HTMLCanvasElement | null;
  if (!iconEl) return;
  const ctx = iconEl.getContext('2d');
  if (!ctx) return;

  if (player_id == null || player_id < 0) {
    player_id = null;
    ctx.clearRect(0, 0, 29, 20);
    ctx.font = "18px FontAwesome";
    ctx.fillStyle = "rgba(192, 192, 192, 1)";
    ctx.fillText(S.CHAT_ICON_EVERYBODY, 7, 15);
    player_name = 'everybody';
  } else if (clientPlaying() != null
    && player_id == clientPlaying()!['playerno']) {
    ctx.clearRect(0, 0, 29, 20);
    ctx.font = "18px FontAwesome";
    ctx.fillStyle = "rgba(192, 192, 192, 1)";
    ctx.fillText(S.CHAT_ICON_ALLIES, 10, 16);
    player_name = 'allies';
  } else {
    const pplayer = store.players[player_id];
    if (pplayer == null) return;
    player_name = pplayer['name']
      + " of the " + (store.nations[pplayer['nation']]?.['adjective'] || pplayer['name']);
    ctx.clearRect(0, 0, 29, 20);
    const flag = store.sprites["f." + store.nations[pplayer['nation']]['graphic_str']];
    if (flag != null) {
      ctx.drawImage(flag, 0, 0);
    }
  }

  iconEl.title = "Sending messages to " + player_name;
  S.setChatSendTo(player_id as number);
  const textInput = document.getElementById('game_text_input');
  if (textInput) textInput.focus();
}

export function encode_message_text(message: string): string {
  message = message.replace(/^\s+|\s+$/g, "");
  message = message.replace(/&/g, "&amp;");
  message = message.replace(/'/g, "&apos;");
  message = message.replace(/"/g, "&quot;");
  message = message.replace(/</g, "&lt;");
  message = message.replace(/>/g, "&gt;");
  return encodeURIComponent(message);
}

export function is_unprefixed_message(message: string | null): boolean {
  if (message === null) return false;
  if (message.length === 0) return true;

  const first = message.charAt(0);
  if (first === '/' || first === '.' || first === ':') return false;

  let quoted_pos = -1;
  if (first === '"' || first === "'") {
    quoted_pos = message.indexOf(first, 1);
  }
  const private_mark = message.indexOf(':', quoted_pos);
  if (private_mark < 0) return true;
  const space_pos = message.indexOf(' ', quoted_pos);
  return (space_pos !== -1 && (space_pos < private_mark));
}

export function check_text_input(event: KeyboardEvent, chatboxtextarea: HTMLInputElement): boolean | undefined {
  if (event.keyCode == 13 && !event.shiftKey) {
    let message = chatboxtextarea.value;

    if (S.chat_send_to != null && S.chat_send_to >= 0
      && is_unprefixed_message(message)) {
      if (clientPlaying() != null
        && S.chat_send_to == clientPlaying()!['playerno']) {
        message = ". " + encode_message_text(message);
      } else {
        const pplayer = store.players[S.chat_send_to];
        if (pplayer == null) {
          set_chat_direction(null);
          return;
        }
        let player_name = pplayer['name'];
        const badchars = [' ', '"', "'"];
        for (const c of badchars) {
          const i = player_name.indexOf(c);
          if (i > 0) {
            player_name = player_name.substring(0, i);
          }
        }
        message = player_name + encode_message_text(": " + message);
      }
    } else {
      message = encode_message_text(message);
    }

    chatboxtextarea.value = '';
    if (!is_touch_device()) chatboxtextarea.focus();
    S.setKeyboardInput(true);

    if (message.length >= 4 && message === message.toUpperCase()) {
      return;
    }

    if (is_longturn() && C_S_RUNNING == client_state()
      && message != null && message.indexOf(encode_message_text("/set")) != -1) {
      return;
    }

    if (message.length >= max_chat_message_length) {
      message_log.update({
        event: E_LOG_ERROR,
        message: "Error! The message is too long. Limit: " + max_chat_message_length
      });
      return;
    }

    send_message(message);
    return false;
  }
}
