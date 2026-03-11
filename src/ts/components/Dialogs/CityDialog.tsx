/**
 * CityDialog — read-only Preact city info dialog (observer mode).
 *
 * Displays city overview: stats, improvements, and units.
 * Production/worklist/governor tabs are omitted (player-only).
 */
import { render, h } from 'preact';
import { signal } from '@preact/signals';
import { useCallback, useEffect, useState } from 'preact/hooks';
import type { City } from '../../data/types';
import { rulesetReady } from '../../data/signals';
import { Dialog } from '../Shared/Dialog';
import { Tabs, TabPanel } from '../Shared/Tabs';
import {
  getCitySizeData,
  getProductionTurnsData,
  getImprovementItems,
  getPresentUnitItems,
  getSupportedUnitItems,
  formatProductionOverview,
  formatResourceStats,
  get_city_state,
  buildProductionListData,
} from '../../ui/cityLogic';
import { get_unit_type_image_sprite, get_improvement_image_sprite } from '../../renderer/tilespec';
import { cityOwner } from '../../data/city';
import { store } from '../../data/store';
import type { SpriteInfo } from '../../renderer/spriteGetters';

// ── Shared signal ────────────────────────────────────────────────────────────
export const cityDialogSignal = signal<City | null>(null);

export function showCityDialogPreact(pcity: City): void {
  cityDialogSignal.value = pcity;
}

export function closeCityDialogPreact(): void {
  cityDialogSignal.value = null;
}

export function mountCityDialog(container: HTMLElement): void {
  render(h(CityDialog, null), container);
}

// ── Sprite div helper ─────────────────────────────────────────────────────────
function SpriteDiv({ sprite, title, className }: { sprite: SpriteInfo; title?: string; className?: string }) {
  return (
    <div
      class={className}
      title={title}
      style={{
        background: `transparent url(${sprite['image-src']})`,
        backgroundPosition: `-${sprite['tileset-x']}px -${sprite['tileset-y']}px`,
        width: sprite['width'] as number,
        height: sprite['height'] as number,
        flexShrink: 0,
      }}
    />
  );
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
  rulesetReady.value; // re-render when improvements/unitTypes become available
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
  const sizeData = getCitySizeData(pcity);
  const prodTurns = getProductionTurnsData(pcity);
  const cityState = get_city_state(pcity);
  const improvementItems = getImprovementItems(pcity);
  const presentItems = getPresentUnitItems(pcity);
  const supportedItems = getSupportedUnitItems(pcity);
  const prodList = activeTab === 'production' ? buildProductionListData(pcity) : null;

  const secondaryStyle = { color: 'var(--xb-text-secondary, #8b949e)', fontSize: 'var(--xb-font-size-sm, 12px)' } as const;
  const rowStyle = { fontSize: 'var(--xb-font-size-sm, 12px)', lineHeight: '1.6', color: 'var(--xb-text-primary, #e6edf3)' } as const;

  return (
    <Dialog title={title} open onClose={onClose} width={560} modal={false}>
      <Tabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab}>

        {/* ── Overview tab ─────────────────────────────────────────────────── */}
        <TabPanel id="overview" activeTab={activeTab}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {/* Left: size + production */}
            <div style={{ minWidth: 180 }}>
              <div style={rowStyle}>
                <div>Population: {sizeData.population}</div>
                <div>Size: {sizeData.size}</div>
                <div>Granary: {sizeData.foodStock}/{sizeData.granarySize}</div>
                <div>Change in: {sizeData.growthText}</div>
              </div>
              <div style={{ marginTop: 8, ...secondaryStyle }}>
                {productionOverview}
              </div>
              <div style={secondaryStyle}>
                {prodTurns.turns !== null
                  ? `${prodTurns.turns} turns  (${prodTurns.progress})`
                  : '—'}
              </div>
              <div style={{
                marginTop: 4,
                fontSize: 'var(--xb-font-size-sm, 12px)',
                color: cityState === 'Disorder'
                  ? 'var(--xb-status-error, #f85149)'
                  : cityState === 'Celebrating'
                    ? 'var(--xb-accent-green, #3fb950)'
                    : 'var(--xb-text-secondary, #8b949e)',
              }}>
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

        {/* ── Buildings tab ─────────────────────────────────────────────────── */}
        <TabPanel id="buildings" activeTab={activeTab}>
          {improvementItems.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, fontSize: 'var(--xb-font-size-sm, 12px)' }}>
              {improvementItems.map(item => (
                <div key={item.id} title={item.helptext} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {item.sprite && <SpriteDiv sprite={item.sprite} />}
                  {item.name}
                </div>
              ))}
            </div>
          ) : (
            <div style={secondaryStyle}>No buildings</div>
          )}
        </TabPanel>

        {/* ── Units tab ─────────────────────────────────────────────────────── */}
        <TabPanel id="units" activeTab={activeTab}>
          <div style={secondaryStyle}>Present:</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2, marginBottom: 12 }}>
            {presentItems && presentItems.length > 0 ? (
              presentItems.map(item => (
                <SpriteDiv key={item.id} sprite={item.sprite} title={item.title} className="game_unit_list_item" />
              ))
            ) : (
              <span style={{ color: 'var(--xb-text-secondary)' }}>None</span>
            )}
          </div>
          <div style={secondaryStyle}>Supported:</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {supportedItems && supportedItems.length > 0 ? (
              supportedItems.map(item => (
                <SpriteDiv key={item.id} sprite={item.sprite} title={item.title} className="game_unit_list_item" />
              ))
            ) : (
              <span style={{ color: 'var(--xb-text-secondary)' }}>None</span>
            )}
          </div>
        </TabPanel>

        {/* ── Can Build tab ─────────────────────────────────────────────────── */}
        <TabPanel id="production" activeTab={activeTab}>
          {prodList == null ? null : !prodList.hasData ? (
            <div style={secondaryStyle}>
              Build data not available (requires live server).
            </div>
          ) : (
            <div style={{ fontSize: 'var(--xb-font-size-sm, 12px)', maxHeight: 360, overflowY: 'auto' }}>
              {prodList.units.length > 0 && (
                <>
                  <div style={{ ...secondaryStyle, marginBottom: 4 }}>Units ({prodList.units.length}):</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
                    {prodList.units.map(({ type, cost }) => {
                      const sprite = get_unit_type_image_sprite(type);
                      return (
                        <div key={type['id']} title={`${type['name']} — Cost: ${cost}`}
                          style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--xb-bg-tertiary, #21262d)', borderRadius: 3, padding: '2px 6px', cursor: 'default' }}>
                          {sprite && <SpriteDiv sprite={sprite} />}
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
                  <div style={{ ...secondaryStyle, marginBottom: 4 }}>Improvements ({prodList.improvements.length}):</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {prodList.improvements.map(({ impr, cost }) => {
                      const sprite = get_improvement_image_sprite(impr);
                      return (
                        <div key={impr['id']} title={`${impr['name']} — Cost: ${cost}`}
                          style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--xb-bg-tertiary, #21262d)', borderRadius: 3, padding: '2px 6px', cursor: 'default' }}>
                          {sprite && <SpriteDiv sprite={sprite} />}
                          <span>{impr['name']}</span>
                          <span style={{ color: 'var(--xb-text-secondary, #8b949e)' }}>{cost}</span>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
              {prodList.units.length === 0 && prodList.improvements.length === 0 && (
                <div style={secondaryStyle}>Nothing buildable.</div>
              )}
            </div>
          )}
        </TabPanel>
      </Tabs>
    </Dialog>
  );
}
