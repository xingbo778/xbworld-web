/**
 * TaxRatesDialog — read-only display of the current player's tax/luxury/science rates.
 * Activated by the 'show-tax-rates' data-action in StatusPanel.
 * Mounted once in App.tsx; opened via showTaxRatesDialog().
 */
import { signal } from '@preact/signals';
import { Dialog } from '../Shared/Dialog';
import { Button } from '../Shared/Button';
import { clientPlaying } from '../../client/clientState';
import { playerUpdated } from '../../data/signals';

const open = signal(false);

export function showTaxRatesDialog(): void {
  open.value = true;
}

export function closeTaxRatesDialog(): void {
  open.value = false;
}

function RateBar({ label, icon, value }: { label: string; icon: string; value: number }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span>{icon} {label}</span>
        <b>{value}%</b>
      </div>
      <div style={{
        height: '8px',
        background: 'var(--xb-bg-secondary, #161b22)',
        borderRadius: '4px',
        overflow: 'hidden',
      }}>
        <div style={{
          width: value + '%',
          height: '100%',
          background: 'var(--xb-accent-blue, #388bfd)',
          borderRadius: '4px',
          transition: 'width 0.2s',
        }} />
      </div>
    </div>
  );
}

export function TaxRatesDialog() {
  // Subscribe so the dialog re-renders when player data changes.
  void playerUpdated.value;
  if (!open.value) return null;

  const pplayer = clientPlaying();
  const tax = pplayer ? Number(pplayer['tax']) : 0;
  const lux = pplayer ? Number(pplayer['luxury']) : 0;
  const sci = pplayer ? Number(pplayer['science']) : 0;

  return (
    <Dialog
      title="Tax Rates"
      open
      onClose={closeTaxRatesDialog}
      width={340}
      modal={false}
    >
      <div style={{ padding: '8px 0' }}>
        <RateBar label="Tax" icon="📊" value={tax} />
        <RateBar label="Luxury" icon="🎵" value={lux} />
        <RateBar label="Science" icon="🧪" value={sci} />
        <p style={{ margin: '12px 0 4px', fontSize: '0.85em', color: 'var(--xb-text-secondary, #8b949e)' }}>
          Total: {tax + lux + sci}%
        </p>
      </div>
      <div style={{ marginTop: '8px', textAlign: 'right' }}>
        <Button onClick={closeTaxRatesDialog}>Close</Button>
      </div>
    </Dialog>
  );
}
