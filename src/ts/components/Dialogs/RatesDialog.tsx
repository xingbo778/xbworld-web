import { signal } from '@preact/signals';
import { Dialog } from '../Shared/Dialog';
import { Button } from '../Shared/Button';
import { store } from '../../data/store';
import { governmentMaxRate } from '../../data/government';
import { sendPlayerRates } from '../../net/commands';
import { clientIsObserver } from '../../client/clientState';
import { getCurrentBulbsOutput } from '../../data/tech';
import { isSmallScreen } from '../../utils/helpers';
import { swal } from './SwalDialog';

interface RatesState {
  open: boolean;
  tax: number;
  lux: number;
  sci: number;
  lockTax: boolean;
  lockLux: boolean;
  lockSci: boolean;
}

const state = signal<RatesState>({
  open: false,
  tax: 0,
  lux: 0,
  sci: 0,
  lockTax: false,
  lockLux: false,
  lockSci: false,
});

function playing() {
  return store.client?.conn?.playing;
}

export function show_tax_rates_dialog(): void {
  if (clientIsObserver()) return;
  const p = playing();
  if (!p) return;
  state.value = {
    open: true,
    tax: p.tax ?? 0,
    lux: (p as any).luxury ?? 0,
    sci: p.science ?? 0,
    lockTax: false,
    lockLux: false,
    lockSci: false,
  };
}

function closeDialog(): void {
  state.value = { ...state.value, open: false };
}

function clampTo10(v: number): number {
  return Math.round(v / 10) * 10;
}

function adjustRates(
  changed: 'tax' | 'lux' | 'sci',
  newVal: number,
  cur: RatesState,
  maxrate: number,
): RatesState {
  newVal = clampTo10(Math.min(newVal, maxrate));
  let { tax, lux, sci, lockTax, lockLux, lockSci } = cur;

  if (changed === 'tax') {
    tax = newVal;
    if (!lockLux) lux = Math.min(Math.max(100 - tax - sci, 0), maxrate);
    if (tax + lux + sci !== 100 && !lockSci) sci = Math.min(Math.max(100 - tax - lux, 0), maxrate);
    if (tax + lux + sci !== 100) tax = 100 - lux - sci;
  } else if (changed === 'lux') {
    lux = newVal;
    if (!lockTax) tax = Math.min(Math.max(100 - lux - sci, 0), maxrate);
    if (tax + lux + sci !== 100 && !lockSci) sci = Math.min(Math.max(100 - lux - tax, 0), maxrate);
    if (tax + lux + sci !== 100) lux = 100 - tax - sci;
  } else {
    sci = newVal;
    if (!lockLux) lux = Math.min(Math.max(100 - tax - sci, 0), maxrate);
    if (tax + lux + sci !== 100 && !lockTax) tax = Math.min(Math.max(100 - sci - lux, 0), maxrate);
    if (tax + lux + sci !== 100) sci = 100 - lux - tax;
  }

  tax = Math.max(0, Math.min(100, tax));
  lux = Math.max(0, Math.min(100, lux));
  sci = Math.max(0, Math.min(100, sci));

  return { ...cur, tax, lux, sci };
}

function submitRates(tax: number, lux: number, sci: number): void {
  if (tax >= 0 && tax <= 100 && lux >= 0 && lux <= 100 && sci >= 0 && sci <= 100) {
    sendPlayerRates(tax, lux, sci);
  } else {
    swal('Invalid tax rate values');
  }
}

export function update_net_income(): void {
  // No-op: Preact component reads from store directly
}

export function update_net_bulbs(_bulbs?: number): void {
  // No-op: Preact component reads from store directly
}

export function RatesDialog() {
  const { open, tax, lux, sci, lockTax, lockLux, lockSci } = state.value;
  if (clientIsObserver()) return null;

  const p = playing();
  if (!p) return null;

  const maxrate = governmentMaxRate((p as any).government ?? 0);
  const govName = store.governments?.[(p as any).government]?.name ?? '';
  const netIncome = p.expected_income ?? 0;
  const cbo = getCurrentBulbsOutput();
  const netBulbs = cbo.self_bulbs - cbo.self_upkeep;

  const handleChange = (which: 'tax' | 'lux' | 'sci', val: number) => {
    const next = adjustRates(which, val, state.value, maxrate);
    state.value = next;
    submitRates(next.tax, next.lux, next.sci);
  };

  const sliderStyle = { width: '100%', cursor: 'pointer' };
  const rowStyle = { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' };
  const labelStyle = { width: '65px', textAlign: 'right' as const };
  const valStyle = { width: '40px', textAlign: 'right' as const };

  return (
    <Dialog
      title="Tax, Luxury and Science Rates"
      open={open}
      onClose={closeDialog}
      width={isSmallScreen() ? '90%' : 420}
      modal={false}
    >
      <div style={rowStyle}>
        <span style={labelStyle}>Tax:</span>
        <input
          type="range"
          min={0}
          max={maxrate}
          step={10}
          value={tax}
          onInput={(e) => handleChange('tax', Number((e.target as HTMLInputElement).value))}
          style={sliderStyle}
        />
        <span style={valStyle}>{tax}%</span>
        <label><input type="checkbox" checked={lockTax} onChange={() => { state.value = { ...state.value, lockTax: !lockTax }; }} /> Lock</label>
      </div>

      <div style={rowStyle}>
        <span style={labelStyle}>Luxury:</span>
        <input
          type="range"
          min={0}
          max={maxrate}
          step={10}
          value={lux}
          onInput={(e) => handleChange('lux', Number((e.target as HTMLInputElement).value))}
          style={sliderStyle}
        />
        <span style={valStyle}>{lux}%</span>
        <label><input type="checkbox" checked={lockLux} onChange={() => { state.value = { ...state.value, lockLux: !lockLux }; }} /> Lock</label>
      </div>

      <div style={rowStyle}>
        <span style={labelStyle}>Science:</span>
        <input
          type="range"
          min={0}
          max={maxrate}
          step={10}
          value={sci}
          onInput={(e) => handleChange('sci', Number((e.target as HTMLInputElement).value))}
          style={sliderStyle}
        />
        <span style={valStyle}>{sci}%</span>
        <label><input type="checkbox" checked={lockSci} onChange={() => { state.value = { ...state.value, lockSci: !lockSci }; }} /> Lock</label>
      </div>

      <div style={{ margin: '8px 0', fontStyle: 'italic', fontSize: '13px' }}>
        {govName} max rate: {maxrate}%
      </div>
      <div style={{ margin: '8px 0' }}>
        Net income: <b>{netIncome > 0 ? '+' + netIncome : netIncome}</b><br />
        Research: <b>{netBulbs > 0 ? '+' + netBulbs : netBulbs}</b>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="secondary" onClick={closeDialog}>Close</Button>
      </div>
    </Dialog>
  );
}
