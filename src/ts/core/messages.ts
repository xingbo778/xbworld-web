/**********************************************************************
    Copyright (C) 2017  The Freeciv-web project

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

***********************************************************************/

import { E_CHAT_MSG, E_CHAT_PRIVATE, E_CHAT_ALLIES, E_CHAT_OBSERVER, fc_e_events } from '../data/eventConstants';
import { clientState, C_S_PREPARING } from '../client/clientState';
import { check_text_with_banlist } from '../utils/banlist';
import { isLongturn } from '../client/clientCore';

import { EventAggregator } from '../utils/EventAggregator';
import { pushChatMessage, clipChatMessages, chatLogText, mountChatBox } from '../components/ChatBox';

const is_longturn = isLongturn;
const civclient_state = clientState();

export let chatbox_active: boolean = true;
export const message_log: EventAggregator = new EventAggregator(update_chatbox, 125,
                                      EventAggregator.DP_ALL, 1000, 0);
export const previous_scroll: number = 0;
export const current_message_dialog_state: string | null = null;
export const max_chat_message_length: number = 350;

/**************************************************************************
 ...
**************************************************************************/
export function init_chatbox(): void
{
  chatbox_active = true;

  const panel = document.getElementById('game_chatbox_panel');
  if (panel) {
    panel.title = 'Messages';
    panel.style.display = 'block';
  }

  // Mount Preact ChatBox into the scrollable container (replaces DOM <ol>)
  const scrollDiv = document.getElementById('freeciv_custom_scrollbar_div');
  if (scrollDiv) {
    // Remove the legacy <ol> that was rendered into by the old DOM path
    const ol = scrollDiv.querySelector('ol#game_message_area');
    if (ol) ol.remove();
    mountChatBox(scrollDiv);
  }
}

/**************************************************************************
 Returns the kind of message (normal, private, ally).
 If an observer sends a private message, it will be treated as private.
 Same for a message to allies sent by an observer. That is, only public
 messages from observers will have the E_CHAT_OBSERVER type.
 There are quite a few message formats, selection is made depending on font
 color, that comes after the player in normal games or the timestamp or
 nothing in longturn games.

 Current examples:
 <b>player:</b><font color="#FFFFFF"><player> Normal message</font>
 <b>player:</b><font color="#A020F0">->{other} Private sent</font>
 <b>player:</b><font color="#A020F0">{player -> other} Private recv</font>
 <b>player:</b><font color="#551166">player to allies: allies msg</font>
 <b>observer:</b><font color="#FFFFFF"><(observer)> mesage</font>
 <b>observer:</b><font color="#A020F0">{(observer)} private from observer</font>
 <b>observer:</b><font color="#A020F0">*(observer)* private from observer</font>
 (T24 - 19:14:47) <font color="#FFFFFF"><player> player : lt msg with ts</player></font>
 <font color="#FFFFFF"><player> player : lt msg without ts</player></font>
 <font color="#A020F0">->{other} lt private sent msg</font>
 ...
**************************************************************************/
export function reclassify_chat_message(text: string | null): number
{
  // 29 characters just for the font tags
  if (text == null || text.length < 29) {
    return E_CHAT_MSG;
  }

  // Remove the player
  text = text.replace(/^<b>[^<]*:<\/b>/, "");

  // Remove the timestamp
  text = text.replace(/^\([^)]*\) /, "");

  // We should have the font tag now
  const color: string = text.substring(14, 20);
  if (color == "A020F0") {
    return E_CHAT_PRIVATE;
  } else if (color == "551166") {
    return E_CHAT_ALLIES;
  } else if (text.charAt(23) == '(') {
    return E_CHAT_OBSERVER;
  }
  return E_CHAT_MSG;
}

/**************************************************************************
 This adds new text to the main message chatbox. See update_chatbox() which
 does the actual update to the screen.
**************************************************************************/
export function add_chatbox_text(packet: Record<string, unknown>): void
{
    let text = packet['message'] as string | null;

    if (text == null) return;
    if (!check_text_with_banlist(text)) return;
    if (is_longturn()) {
      if (text.indexOf("waiting on") != -1 || text.indexOf("Lost connection") != -1 || text.indexOf("Not enough") != -1 || text.indexOf("has been removed") != -1 || text.indexOf("has connected") != -1) return;
    }
    if (text.length >= max_chat_message_length) return;

    if (packet['event'] === E_CHAT_MSG) {
      packet['event'] = reclassify_chat_message(text);
    }

    if (civclient_state <= C_S_PREPARING) {
      text = text.replace(/#FFFFFF/g, '#000000');
    } else {
      text = text.replace(/#0000FF/g, '#5555FF')
                 .replace(/#006400/g, '#00AA00')
                 .replace(/#551166/g, '#AA88FF')
                 .replace(/#A020F0/g, '#F020FF');
    }

    packet['message'] = text;
    message_log.update(packet);
}

/**************************************************************************
 Returns the chatbox messages as plain text (for wait_for_text).
 Reads from the in-memory chatLogText buffer — no DOM access needed.
**************************************************************************/
export function get_chatbox_text(): string | null
{
  return chatLogText || null;
}

/**************************************************************************
 Clears the chatbox.
**************************************************************************/
export function clear_chatbox(): void
{
  message_log.clear();
  chatbox_clip_messages(0);
}

/**************************************************************************
 Updates the chatbox text window.
 Pushes messages into the Preact ChatBox signal (always ready; no DOM wait).
**************************************************************************/
export function update_chatbox(messages: Record<string, unknown>[]): void
{
  for (let i = 0; i < messages.length; i++) {
    const html = messages[i]['message'] as string;
    const className = fc_e_events[messages[i]['event'] as number] || '';
    pushChatMessage(html, className);
    // Mirror to GameLog panel (lazy import to avoid circular dep)
    import('../components/GameLog').then(({ pushGameLogEntry }) => pushGameLogEntry(html)).catch(() => {});
  }
  if (messages.length > 0) {
    setTimeout(() => {
      const el = document.getElementById('freeciv_custom_scrollbar_div');
      if (el) el.scrollTop = el.scrollHeight;
    }, 100);
  }
}

/**************************************************************************
 Clips the chatbox text to a maximum number of lines.
**************************************************************************/
export function chatbox_clip_messages(lines?: number): void
{
  if (lines === undefined || lines < 0) {
    lines = 24;
  }

  // Flush the buffered messages first
  message_log.fireNow();

  clipChatMessages(lines);
}

/**************************************************************************
  Waits for the specified text to appear in the chat log, then
  executes the given JavaScript code.
**************************************************************************/
export function wait_for_text(text: string, runnable: () => void): void
{
  const chatbox_text: string | null = get_chatbox_text();
  if (chatbox_text != null && chatbox_text.indexOf(text) != -1) {
    runnable();
  } else {
    setTimeout(function () {
      wait_for_text(text, runnable);
    }, 100);
  }

}
