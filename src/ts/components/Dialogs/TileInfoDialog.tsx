/**
 * TileInfoDialog — shows server tile-info text with clickable player links.
 *
 * Replaces the HTML-string approach in handle_web_info_text_message():
 * server text is parsed into TileInfoLine[] by mapctrl.ts, then rendered
 * here with native Preact onClick instead of data-action delegation.
 */
import { signal } from '@preact/signals';
import { Dialog } from '../Shared/Dialog';
import { Button } from '../Shared/Button';
import { nationTableSelectPlayer } from '../../data/nation';

export interface TileInfoLine {
  /** Full plain text for lines with no player match. */
  text?: string;
  /** For lines with a matched player: text before the player name. */
  prefix?: string;
  /** The player's display name. */
  playerName?: string;
  /** The player number for nationTableSelectPlayer(). */
  playerNo?: number;
  /** Text after the player name (e.g. connection status). */
  suffix?: string;
}

interface TileInfoState {
  open: boolean;
  lines: TileInfoLine[];
}

const state = signal<TileInfoState>({ open: false, lines: [] });

export function showTileInfoDialog(lines: TileInfoLine[]): void {
  state.value = { open: true, lines };
}

function closeTileInfoDialog(): void {
  state.value = { ...state.value, open: false };
}

export function TileInfoDialog() {
  const { open, lines } = state.value;
  if (!open) return null;

  return (
    <Dialog
      title="Tile Information"
      open
      onClose={closeTileInfoDialog}
      width={440}
      modal={false}
    >
      <div style={{ maxHeight: '360px', overflow: 'auto', lineHeight: 1.6 }}>
        {lines.map((line, i) => (
          <div key={i}>
            {line.playerNo != null ? (
              <>
                {line.prefix}
                <button
                  onClick={() => {
                    nationTableSelectPlayer(line.playerNo!);
                    closeTileInfoDialog();
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    color: 'var(--xb-accent-blue, #58a6ff)',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    font: 'inherit',
                  }}
                >
                  {line.playerName}
                </button>
                {line.suffix}
              </>
            ) : (
              line.text ?? ''
            )}
          </div>
        ))}
      </div>
      <div style={{ marginTop: '12px', textAlign: 'right' }}>
        <Button onClick={closeTileInfoDialog}>Close</Button>
      </div>
    </Dialog>
  );
}
