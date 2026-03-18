/**
 * Game Log panel — shows game event messages in the Log tab.
 * Mirrors messages from #game_message_area into a full-height scrollable list.
 */
import { signal } from '@preact/signals';
import { render } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import { parseGameHtml } from '../utils/parseGameHtml';

interface LogEntry {
  id: number;
  html: string;
  ts: number;
  count: number;
}

let _counter = 0;
const logEntries = signal<LogEntry[]>([]);

/** Called from messages.ts to push a new log entry. Collapses consecutive duplicates. */
export function pushGameLogEntry(html: string): void {
  const prev = logEntries.value;
  if (prev.length > 0 && prev[prev.length - 1].html === html) {
    const last = prev[prev.length - 1];
    logEntries.value = [...prev.slice(0, -1), { ...last, count: last.count + 1 }];
    return;
  }
  let entries = [...prev, { id: _counter++, html, ts: Date.now(), count: 1 }];
  if (entries.length > 500) entries = entries.slice(-500);
  logEntries.value = entries;
}

function GameLog() {
  const entries = logEntries.value;
  const bottomRef = useRef<HTMLDivElement>(null);
  const autoScroll = useRef(true);

  useEffect(() => {
    if (autoScroll.current && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [entries]);

  return (
    <div class="xb-log-root">
      <div class="xb-log-header">
        <span class="xb-log-header-title">Game Event Log</span>
        <button
          onClick={() => { logEntries.value = []; }}
          class="xb-log-clear-btn"
        >
          Clear
        </button>
      </div>
      <div
        class="xb-log-body"
        onScroll={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          autoScroll.current = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
        }}
      >
        {entries.length === 0 && (
          <p class="xb-log-empty">
            Game events will appear here.
          </p>
        )}
        {entries.map(entry => (
          <div key={entry.id} class="xb-log-entry">
            {parseGameHtml(entry.html)}
            {entry.count > 1 && (
              <span class="xb-log-entry-count">×{entry.count}</span>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

export function mountGameLog(container: HTMLElement): void {
  // Pull existing messages from #game_message_area
  const existing = document.querySelectorAll('#game_message_area li');
  existing.forEach(li => {
    pushGameLogEntry(li.textContent ?? '');
  });
  render(<GameLog />, container);
}
