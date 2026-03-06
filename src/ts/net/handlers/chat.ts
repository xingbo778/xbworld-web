/**
 * Chat and message handlers.
 */
import { store } from '../../data/store';
import { E_SCRIPT, E_UNDEFINED } from '../../data/eventConstants';
import { showDialogMessage } from '../../client/civClient';
import { add_chatbox_text } from '../../core/messages';
import { isLongturn } from '../../client/clientCore';
import type { ChatMsgPacket, PageMsgPacket, PageMsgPartPacket } from './packetTypes';

interface PageMsgState {
  headline?: string;
  caption?: string;
  event?: number;
  missing_parts?: number;
  message?: string;
}

let page_msg: PageMsgState = {};

export function handle_chat_msg(packet: ChatMsgPacket): void {
  let message: string | unknown = packet['message'];
  const conn_id = packet['conn_id'];
  const event = packet['event'];
  const ptile = packet['tile'];

  if (message == null) return;
  if (event == null || event < 0 || event >= E_UNDEFINED) {
    console.log('Undefined message event type');
    console.log(packet);
    packet['event'] = E_UNDEFINED;
  }

  if (store.connections[conn_id] != null) {
    if (!isLongturn()) {
      message = '<b>' + store.connections[conn_id]['username'] + ':</b>' + message;
    }
  } else if (packet['event'] === E_SCRIPT) {
    const regxp = /\n/gi;
    message = (message as string).replace(regxp, '<br>\n');
    showDialogMessage('Message for you:', message as string);
    return;
  } else {
    if ((message as string).indexOf('/metamessage') !== -1) return;
    if ((message as string).indexOf('Metaserver message string') !== -1) return;

    if (ptile != null && ptile > 0) {
      message = "<span class='chatbox_text_tileinfo' "
          + "onclick='center_tile_id(" + ptile + ");'>" + message + '</span>';
    }
  }

  packet['message'] = message as string;
  add_chatbox_text(packet);
}

export function handle_early_chat_msg(packet: ChatMsgPacket): void {
  handle_chat_msg(packet);
}

export function handle_page_msg(packet: PageMsgPacket): void {
  page_msg['headline'] = packet['headline'];
  page_msg['caption'] = packet['caption'];
  page_msg['event'] = packet['event'];
  page_msg['missing_parts'] = packet['parts'];
  page_msg['message'] = '';
}

export function handle_page_msg_part(packet: PageMsgPartPacket): void {
  page_msg['message'] = page_msg['message']! + packet['lines'];
  page_msg['missing_parts']!--;

  if (page_msg['missing_parts'] === 0) {
    const regxp = /\n/gi;
    page_msg['message'] = page_msg['message']!.replace(regxp, '<br>\n');
    showDialogMessage(page_msg['headline']!, page_msg['message']!);
    page_msg = {};
  }
}
