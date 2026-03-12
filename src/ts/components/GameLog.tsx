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
}

let _counter = 0;
const logEntries = signal<LogEntry[]>([]);

/** Called from messages.ts to push a new log entry. */
export function pushGameLogEntry(html: string): void {
  let entries = [...logEntries.value, { id: _counter++, html, ts: Date.now() }];
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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--xb-bg-primary, #0d1117)' }}>
      <div style={{
        padding: '8px 12px',
        borderBottom: '1px solid var(--xb-border-default, #30363d)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--xb-bg-secondary, #161b22)',
        flexShrink: 0,
      }}>
        <span style={{ color: 'var(--xb-accent-blue, #58a6ff)', fontWeight: 'bold', fontSize: '14px' }}>Game Event Log</span>
        <button
          onClick={() => { logEntries.value = []; }}
          style={{
            background: 'none', border: '1px solid var(--xb-border-default, #30363d)', color: 'var(--xb-text-secondary, #8b949e)',
            cursor: 'pointer', borderRadius: '4px', padding: '2px 8px', fontSize: '12px',
          }}
        >
          Clear
        </button>
      </div>
      <div
        style={{ flex: 1, overflowY: 'auto', padding: '8px 12px' }}
        onScroll={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          autoScroll.current = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
        }}
      >
        {entries.length === 0 && (
          <p style={{ color: 'var(--xb-text-secondary, #8b949e)', fontStyle: 'italic', fontSize: '13px', textAlign: 'center', marginTop: '40px' }}>
            Game events will appear here.
          </p>
        )}
        {entries.map(entry => (
          <div
            key={entry.id}
            style={{
              padding: '4px 0',
              borderBottom: '1px solid var(--xb-bg-elevated, #21262d)',
              fontSize: '13px',
              color: 'var(--xb-text-primary, #e6edf3)',
              lineHeight: '1.5',
            }}
          >
            {parseGameHtml(entry.html)}
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
    logEntries.value = [...logEntries.value, { id: _counter++, html: li.textContent ?? '', ts: Date.now() }];
  });
  render(<GameLog />, container);
}
