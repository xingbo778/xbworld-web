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
  // Sprite positions/sizes are data-driven — must remain inline
  return (
    <div
      class={`xb-sprite-div${className ? ` ${className}` : ''}`}
      title={title}
      style={{
        background: `transparent url(${sprite['image-src']})`,
        backgroundPosition: `-${sprite['tileset-x']}px -${sprite['tileset-y']}px`,
        width: sprite['width'] as number,
        height: sprite['height'] as number,
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

  return (
    <Dialog title={title} open onClose={onClose} width={560} modal={false}>
      <Tabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab}>

        {/* ── Overview tab ─────────────────────────────────────────────────── */}
        <TabPanel id="overview" activeTab={activeTab}>
          <div class="xb-city-overview-layout">
            {/* Left: size + production */}
            <div class="xb-city-overview-left">
              <div class="xb-city-overview-row">
                <div>Population: {sizeData.population}</div>
                <div>Size: {sizeData.size}</div>
                <div>Granary: {sizeData.foodStock}/{sizeData.granarySize}</div>
                <div>Change in: {sizeData.growthText}</div>
              </div>
              <div class="xb-city-secondary" style={{ marginTop: 8 }}>
                {productionOverview}
              </div>
              <div class="xb-city-secondary">
                {prodTurns.turns !== null
                  ? `${prodTurns.turns} turns  (${prodTurns.progress})`
                  : '—'}
              </div>
              <div class={
                cityState === 'Disorder'
                  ? 'xb-city-state-disorder'
                  : cityState === 'Celebrating'
                    ? 'xb-city-state-celebrating'
                    : 'xb-city-state-normal'
              }>
                State: {cityState}
              </div>
            </div>

            {/* Right: resource table */}
            {stats && (
              <table class="xb-city-resource-table">
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
                      <td class="xb-city-resource-label">{label}:</td>
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
            <div class="xb-city-buildings-wrap">
              {improvementItems.map(item => (
                <div key={item.id} title={item.helptext} class="xb-city-building-item">
                  {item.sprite && <SpriteDiv sprite={item.sprite} />}
                  {item.name}
                </div>
              ))}
            </div>
          ) : (
            <div class="xb-city-secondary">No buildings</div>
          )}
        </TabPanel>

        {/* ── Units tab ─────────────────────────────────────────────────────── */}
        <TabPanel id="units" activeTab={activeTab}>
          <div class="xb-city-secondary">Present:</div>
          <div class="xb-city-units-section">
            {presentItems && presentItems.length > 0 ? (
              presentItems.map(item => (
                <SpriteDiv key={item.id} sprite={item.sprite} title={item.title} className="game_unit_list_item" />
              ))
            ) : (
              <span class="xb-city-secondary">None</span>
            )}
          </div>
          <div class="xb-city-secondary">Supported:</div>
          <div class="xb-city-units-section" style={{ marginBottom: 0 }}>
            {supportedItems && supportedItems.length > 0 ? (
              supportedItems.map(item => (
                <SpriteDiv key={item.id} sprite={item.sprite} title={item.title} className="game_unit_list_item" />
              ))
            ) : (
              <span class="xb-city-secondary">None</span>
            )}
          </div>
        </TabPanel>

        {/* ── Can Build tab ─────────────────────────────────────────────────── */}
        <TabPanel id="production" activeTab={activeTab}>
          {prodList == null ? null : !prodList.hasData ? (
            <div class="xb-city-secondary">
              Build data not available (requires live server).
            </div>
          ) : (
            <div class="xb-city-can-build-scroll">
              {prodList.units.length > 0 && (
                <>
                  <div class="xb-city-section-header" style={{ marginBottom: 4 }}>Units ({prodList.units.length}):</div>
                  <div class="xb-city-can-build-group">
                    {prodList.units.map(({ type, cost }) => {
                      const sprite = get_unit_type_image_sprite(type);
                      return (
                        <div key={type['id']} title={`${type['name']} — Cost: ${cost}`}
                          class="xb-city-can-build-item">
                          {sprite && <SpriteDiv sprite={sprite} />}
                          <span>{type['name']}</span>
                          <span class="xb-city-can-build-cost">{cost}</span>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
              {prodList.improvements.length > 0 && (
                <>
                  <div class="xb-city-section-header" style={{ marginBottom: 4 }}>Improvements ({prodList.improvements.length}):</div>
                  <div class="xb-city-can-build-group" style={{ marginBottom: 0 }}>
                    {prodList.improvements.map(({ impr, cost }) => {
                      const sprite = get_improvement_image_sprite(impr);
                      return (
                        <div key={impr['id']} title={`${impr['name']} — Cost: ${cost}`}
                          class="xb-city-can-build-item">
                          {sprite && <SpriteDiv sprite={sprite} />}
                          <span>{impr['name']}</span>
                          <span class="xb-city-can-build-cost">{cost}</span>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
              {prodList.units.length === 0 && prodList.improvements.length === 0 && (
                <div class="xb-city-secondary">Nothing buildable.</div>
              )}
            </div>
          )}
        </TabPanel>
      </Tabs>
    </Dialog>
  );
}
