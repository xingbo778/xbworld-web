/**
 * Game Log panel — shows game event messages in the Log tab.
 * Mirrors messages from #game_message_area into a full-height scrollable list.
 */
import { render } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { parseGameHtml } from '../utils/parseGameHtml';

interface LogEntry {
  id: number;
  html: string;
  ts: number;
}

let _entries: LogEntry[] = [];
let _counter = 0;
let _listeners: Array<(entries: LogEntry[]) => void> = [];

/** Called from messages.ts to push a new log entry. */
export function pushGameLogEntry(html: string): void {
  _entries = [..._entries, { id: _counter++, html, ts: Date.now() }];
  if (_entries.length > 500) _entries = _entries.slice(-500);
  _listeners.forEach(fn => fn(_entries));
}

function GameLog() {
  const [entries, setEntries] = useState<LogEntry[]>(_entries);
  const bottomRef = useRef<HTMLDivElement>(null);
  const autoScroll = useRef(true);

  useEffect(() => {
    const fn = (e: LogEntry[]) => { setEntries([...e]); };
    _listeners.push(fn);
    return () => { _listeners = _listeners.filter(f => f !== fn); };
  }, []);

  useEffect(() => {
    if (autoScroll.current && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [entries]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#0d1117' }}>
      <div style={{
        padding: '8px 12px',
        borderBottom: '1px solid #30363d',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#161b22',
        flexShrink: 0,
      }}>
        <span style={{ color: '#58a6ff', fontWeight: 'bold', fontSize: '14px' }}>📋 Game Event Log</span>
        <button
          onClick={() => { _entries = []; _listeners.forEach(fn => fn([])); setEntries([]); }}
          style={{
            background: 'none', border: '1px solid #30363d', color: '#8b949e',
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
          <p style={{ color: '#484f58', fontStyle: 'italic', fontSize: '13px', textAlign: 'center', marginTop: '40px' }}>
            Game events will appear here.
          </p>
        )}
        {entries.map(entry => (
          <div
            key={entry.id}
            style={{
              padding: '4px 0',
              borderBottom: '1px solid #21262d',
              fontSize: '13px',
              color: '#c9d1d9',
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
    _entries.push({ id: _counter++, html: li.textContent ?? '', ts: Date.now() });
  });
  render(<GameLog />, container);
}
