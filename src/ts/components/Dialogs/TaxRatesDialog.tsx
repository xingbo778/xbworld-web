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
    <div class="xb-tax-rate-item">
      <div class="xb-tax-rate-header">
        <span>{icon} {label}</span>
        <b>{value}%</b>
      </div>
      <div class="xb-tax-track">
        {/* width is dynamic — keep inline */}
        <div class="xb-tax-fill" style={{ width: value + '%' }} />
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
      <div class="xb-tax-rates-padding">
        <RateBar label="Tax" icon="📊" value={tax} />
        <RateBar label="Luxury" icon="🎵" value={lux} />
        <RateBar label="Science" icon="🧪" value={sci} />
        <p class="xb-tax-total">
          Total: {tax + lux + sci}%
        </p>
      </div>
      <div class="xb-dialog-footer-right">
        <Button onClick={closeTaxRatesDialog}>Close</Button>
      </div>
    </Dialog>
  );
}
