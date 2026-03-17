import { signal } from '@preact/signals';
import { Dialog } from '../Shared/Dialog';
import { Button } from '../Shared/Button';

// ── Typed data structure (no HTML strings) ───────────────────────────────────

export interface IntelDiplEntry {
  nation: string;
  state: string;
}

export interface IntelData {
  ruler: string;
  government: string;
  capital: string;
  gold: string;
  tax: string;
  science: string;
  luxury: string;
  culture: string;
  researching: string;
  diplomacy: IntelDiplEntry[];
  knownTechs: string[];
}

interface IntelState {
  open: boolean;
  title: string;
  data: IntelData | null;
}

const state = signal<IntelState>({
  open: false,
  title: '',
  data: null,
});

export function showIntelDialog(title: string, data: IntelData): void {
  state.value = { open: true, title, data };
}

export function closeIntelDialog(): void {
  state.value = { ...state.value, open: false };
  const input = document.getElementById('game_text_input') as HTMLElement | null;
  if (input) input.blur();
}

// ── Component ─────────────────────────────────────────────────────────────────

export function IntelDialog() {
  const { open, title, data } = state.value;

  return (
    <Dialog
      title={title}
      open={open}
      onClose={closeIntelDialog}
      width={window.innerWidth <= 600 ? '90%' : 'auto'}
      modal={true}
    >
      <div class="xb-dialog-body-scroll" style={{ maxHeight: '70vh', fontSize: '13px' }}>
        {data && (
          <>
            {/* Basic info table */}
            <table class="xb-table" style={{ borderCollapse: 'collapse' }}>
              <tbody>
                {([
                  ['Ruler', data.ruler],
                  ['Government', data.government],
                  ['Capital', data.capital],
                  ['Gold', data.gold],
                  ['Tax', data.tax],
                  ['Science', data.science],
                  ['Luxury', data.luxury],
                  ['Culture', data.culture],
                  ['Researching', data.researching],
                ] as [string, string][]).map(([label, value]) => (
                  <tr key={label}>
                    <td class="xb-intel-label">{label}:</td>
                    <td class="xb-intel-value">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Diplomacy */}
            {data.diplomacy.length > 0 && (
              <>
                <div class="xb-intel-section-header">Diplomacy</div>
                <ul class="xb-intel-dipl-list">
                  {data.diplomacy.map((entry, i) => (
                    <li key={i} class="xb-intel-dipl-item">
                      <span style={{ fontWeight: 600 }}>{entry.nation}</span>: {entry.state}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* Known techs */}
            {data.knownTechs.length > 0 && (
              <>
                <div class="xb-intel-section-header">Known Techs ({data.knownTechs.length})</div>
                <p class="xb-intel-techs">
                  {data.knownTechs.join(', ')}
                </p>
              </>
            )}
          </>
        )}
      </div>
      <div class="xb-dialog-footer-right">
        <Button onClick={closeIntelDialog}>Ok</Button>
      </div>
    </Dialog>
  );
}
