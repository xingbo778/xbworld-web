/**
 * ChatBox — Preact-rendered in-game chat message list.
 *
 * Replaces the legacy DOM-based #game_message_area rendering in messages.ts.
 * Messages are pushed via pushChatMessage() and stored in a signal.
 * wait_for_text() reads chatLogText (in-memory) instead of the DOM.
 */
import { signal } from '@preact/signals';
import { render } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import { parseGameHtml } from '../utils/parseGameHtml';

export interface ChatEntry {
  id: number;
  html: string;
  className: string;
}

let _counter = 0;
export const chatEntries = signal<ChatEntry[]>([]);

/** Plain-text accumulator used by wait_for_text() — no DOM needed. */
export let chatLogText = '';

const MAX_MESSAGES = 500;

/** Push one chat message into the signal and the plain-text log. */
export function pushChatMessage(html: string, className: string): void {
  const entry: ChatEntry = { id: _counter++, html, className };
  let next = [...chatEntries.value, entry];
  if (next.length > MAX_MESSAGES) next = next.slice(-MAX_MESSAGES);
  chatEntries.value = next;

  // Strip HTML tags for wait_for_text() text search
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  chatLogText += (tmp.textContent ?? '') + '\n';
}

/** Clip the signal to the last `lines` messages (mirrors chatbox_clip_messages). */
export function clipChatMessages(lines: number): void {
  if (lines <= 0) {
    chatEntries.value = [];
    chatLogText = '';
    return;
  }
  const entries = chatEntries.value;
  if (entries.length <= lines) return;
  chatEntries.value = entries.slice(-lines);
}

function ChatBox() {
  const entries = chatEntries.value;
  const bottomRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries]);

  return (
    <ol style={{ margin: 0, padding: '0 0 4px 0', listStyle: 'none' }}>
      {entries.map(entry => (
        <li key={entry.id} class={entry.className || undefined}>
          {parseGameHtml(entry.html)}
        </li>
      ))}
      <li ref={bottomRef} style={{ height: 0, margin: 0, padding: 0 }} />
    </ol>
  );
}

export function mountChatBox(container: HTMLElement): void {
  render(<ChatBox />, container);
}
