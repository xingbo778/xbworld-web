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
  buildProductionListData,
} from '../../ui/cityLogic';
import { get_unit_type_image_sprite, get_improvement_image_sprite } from '../../renderer/tilespec';
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
  { id: 'production', label: 'Can Build' },
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
  const prodList = activeTab === 'production' ? buildProductionListData(pcity) : null;

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

        <TabPanel id="production" activeTab={activeTab}>
          {prodList == null ? null : !prodList.hasData ? (
            <div style={{ color: 'var(--xb-text-secondary, #8b949e)', fontSize: 'var(--xb-font-size-sm, 12px)' }}>
              Build data not available (requires live server).
            </div>
          ) : (
            <div style={{ fontSize: 'var(--xb-font-size-sm, 12px)', maxHeight: 360, overflowY: 'auto' }}>
              {prodList.units.length > 0 && (
                <>
                  <div style={{ color: 'var(--xb-text-secondary, #8b949e)', marginBottom: 4 }}>Units ({prodList.units.length}):</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
                    {prodList.units.map(({ type, cost }) => {
                      const sprite = get_unit_type_image_sprite(type);
                      return (
                        <div key={type['id']} title={`${type['name']} — Cost: ${cost}`}
                          style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--xb-bg-tertiary, #21262d)', borderRadius: 3, padding: '2px 6px', cursor: 'default' }}>
                          {sprite && (
                            <div style={{
                              background: `transparent url(${sprite['image-src']})`,
                              backgroundPosition: `-${sprite['tileset-x']}px -${sprite['tileset-y']}px`,
                              width: sprite['width'], height: sprite['height'],
                              flexShrink: 0,
                            }} />
                          )}
                          <span>{type['name']}</span>
                          <span style={{ color: 'var(--xb-text-secondary, #8b949e)' }}>{cost}</span>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
              {prodList.improvements.length > 0 && (
                <>
                  <div style={{ color: 'var(--xb-text-secondary, #8b949e)', marginBottom: 4 }}>Improvements ({prodList.improvements.length}):</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {prodList.improvements.map(({ impr, cost }) => {
                      const sprite = get_improvement_image_sprite(impr);
                      return (
                        <div key={impr['id']} title={`${impr['name']} — Cost: ${cost}`}
                          style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--xb-bg-tertiary, #21262d)', borderRadius: 3, padding: '2px 6px', cursor: 'default' }}>
                          {sprite && (
                            <div style={{
                              background: `transparent url(${sprite['image-src']})`,
                              backgroundPosition: `-${sprite['tileset-x']}px -${sprite['tileset-y']}px`,
                              width: sprite['width'], height: sprite['height'],
                              flexShrink: 0,
                            }} />
                          )}
                          <span>{impr['name']}</span>
                          <span style={{ color: 'var(--xb-text-secondary, #8b949e)' }}>{cost}</span>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
              {prodList.units.length === 0 && prodList.improvements.length === 0 && (
                <div style={{ color: 'var(--xb-text-secondary, #8b949e)' }}>Nothing buildable.</div>
              )}
            </div>
          )}
        </TabPanel>
      </Tabs>
    </Dialog>
  );
}
