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

const labelStyle = {
  paddingRight: '12px',
  color: 'var(--xb-text-secondary, #8b949e)',
  whiteSpace: 'nowrap' as const,
  verticalAlign: 'top' as const,
  fontWeight: 600,
};

const valueStyle = {
  color: 'var(--xb-text-primary, #e6edf3)',
  verticalAlign: 'top' as const,
};

const sectionStyle = {
  marginTop: '12px',
  marginBottom: '4px',
  fontSize: '13px',
  fontWeight: 600 as const,
  color: 'var(--xb-accent-blue, #58a6ff)',
  borderBottom: '1px solid var(--xb-border-default, #30363d)',
  paddingBottom: '2px',
};

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
      <div style={{ maxHeight: '70vh', overflow: 'auto', fontSize: '13px' }}>
        {data && (
          <>
            {/* Basic info table */}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
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
                    <td style={labelStyle}>{label}:</td>
                    <td style={valueStyle}>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Diplomacy */}
            {data.diplomacy.length > 0 && (
              <>
                <div style={sectionStyle}>Diplomacy</div>
                <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                  {data.diplomacy.map((entry, i) => (
                    <li key={i} style={{ color: 'var(--xb-text-primary, #e6edf3)', padding: '2px 0' }}>
                      <span style={{ fontWeight: 600 }}>{entry.nation}</span>: {entry.state}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* Known techs */}
            {data.knownTechs.length > 0 && (
              <>
                <div style={sectionStyle}>Known Techs ({data.knownTechs.length})</div>
                <p style={{ margin: '4px 0', lineHeight: 1.6, color: 'var(--xb-text-primary, #e6edf3)' }}>
                  {data.knownTechs.join(', ')}
                </p>
              </>
            )}
          </>
        )}
      </div>
      <div style={{ marginTop: '12px', textAlign: 'right' }}>
        <Button onClick={closeIntelDialog}>Ok</Button>
      </div>
    </Dialog>
  );
}
