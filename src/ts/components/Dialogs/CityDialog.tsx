/**
 * CityDialog — read-only Preact city info dialog (observer mode).
 *
 * Displays city overview: stats, improvements, and units.
 * Production/worklist/governor tabs are omitted (player-only).
 */
import { signal } from '@preact/signals';
import { useCallback, useEffect, useState } from 'preact/hooks';
import type { City } from '../../data/types';
import { Dialog } from '../Shared/Dialog';
import { Tabs, TabPanel } from '../Shared/Tabs';
import {
  formatCitySize,
  formatProductionOverview,
  formatProductionTurns,
  formatResourceStats,
  buildImprovementsHtml,
  buildPresentUnitsHtml,
  buildSupportedUnitsHtml,
  get_city_state,
} from '../../ui/cityLogic';
import { cityOwner } from '../../data/city';
import { store } from '../../data/store';

// ── Shared signal ────────────────────────────────────────────────────────────
export const cityDialogSignal = signal<City | null>(null);

export function showCityDialogPreact(pcity: City): void {
  cityDialogSignal.value = pcity;
}

export function closeCityDialogPreact(): void {
  cityDialogSignal.value = null;
}

// ── Component ────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'buildings', label: 'Buildings' },
  { id: 'units', label: 'Units' },
];

export function CityDialog() {
  const pcity = cityDialogSignal.value;
  const [activeTab, setActiveTab] = useState('overview');

  // Reset tab when a different city opens
  useEffect(() => {
    if (pcity) setActiveTab('overview');
  }, [pcity?.id]);

  const onClose = useCallback(() => { cityDialogSignal.value = null; }, []);

  if (!pcity) return null;

  const owner = cityOwner(pcity);
  const title = `${pcity['name']} (${owner?.name ?? '?'}) — Size ${pcity['size']}`;

  const stats = formatResourceStats(pcity);
  const productionOverview = formatProductionOverview(pcity);
  const productionTurns = formatProductionTurns(pcity);
  const cityState = get_city_state(pcity);
  const sizeHtml = formatCitySize(pcity, '');
  const improvementsHtml = buildImprovementsHtml(pcity);
  const presentHtml = buildPresentUnitsHtml(pcity);
  const supportedHtml = buildSupportedUnitsHtml(pcity);

  return (
    <Dialog title={title} open onClose={onClose} width={560} modal={false}>
      <Tabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab}>
        <TabPanel id="overview" activeTab={activeTab}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {/* Left: size + production */}
            <div style={{ minWidth: 180 }}>
              <div
                style={{ fontSize: 'var(--xb-font-size-sm, 12px)', lineHeight: 1.6, color: 'var(--xb-text-primary, #e6edf3)' }}
                dangerouslySetInnerHTML={{ __html: sizeHtml }}
              />
              <div style={{ marginTop: 8, color: 'var(--xb-text-secondary, #8b949e)', fontSize: 'var(--xb-font-size-sm, 12px)' }}>
                {productionOverview}
              </div>
              <div
                style={{ color: 'var(--xb-text-secondary, #8b949e)', fontSize: 'var(--xb-font-size-sm, 12px)' }}
                dangerouslySetInnerHTML={{ __html: productionTurns }}
              />
              <div style={{ marginTop: 4, color: cityState === 'Disorder' ? 'var(--xb-status-error, #f85149)' : cityState === 'Celebrating' ? 'var(--xb-accent-green, #3fb950)' : 'var(--xb-text-secondary, #8b949e)', fontSize: 'var(--xb-font-size-sm, 12px)' }}>
                State: {cityState}
              </div>
            </div>

            {/* Right: resource table */}
            {stats && (
              <table style={{ fontSize: 'var(--xb-font-size-sm, 12px)', borderCollapse: 'collapse', color: 'var(--xb-text-primary, #e6edf3)' }}>
                <tbody>
                  {([
                    ['Food', stats.food],
                    ['Production', stats.prod],
                    ['Trade', stats.trade],
                    ['Gold', stats.gold],
                    ['Luxury', stats.luxury],
                    ['Science', stats.science],
                    ['Corruption', stats.corruption],
                    ['Waste', stats.waste],
                    ['Pollution', stats.pollution],
                    ['Culture', stats.culture],
                  ] as [string, string][]).map(([label, val]) => (
                    <tr key={label}>
                      <td style={{ paddingRight: 8, color: 'var(--xb-text-secondary, #8b949e)' }}>{label}:</td>
                      <td>{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </TabPanel>

        <TabPanel id="buildings" activeTab={activeTab}>
          {improvementsHtml ? (
            <div
              style={{ display: 'flex', flexWrap: 'wrap', gap: 4, fontSize: 'var(--xb-font-size-sm, 12px)' }}
              dangerouslySetInnerHTML={{ __html: improvementsHtml }}
            />
          ) : (
            <div style={{ color: 'var(--xb-text-secondary, #8b949e)', fontSize: 'var(--xb-font-size-sm, 12px)' }}>No buildings</div>
          )}
        </TabPanel>

        <TabPanel id="units" activeTab={activeTab}>
          <div style={{ fontSize: 'var(--xb-font-size-sm, 12px)', color: 'var(--xb-text-secondary, #8b949e)' }}>Present:</div>
          <div
            style={{ display: 'flex', flexWrap: 'wrap', gap: 2, marginBottom: 12 }}
            dangerouslySetInnerHTML={{ __html: presentHtml ?? '<span style="color:var(--xb-text-secondary)">None</span>' }}
          />
          <div style={{ fontSize: 'var(--xb-font-size-sm, 12px)', color: 'var(--xb-text-secondary, #8b949e)' }}>Supported:</div>
          <div
            style={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}
            dangerouslySetInnerHTML={{ __html: supportedHtml ?? '<span style="color:var(--xb-text-secondary)">None</span>' }}
          />
        </TabPanel>
      </Tabs>
    </Dialog>
  );
}
