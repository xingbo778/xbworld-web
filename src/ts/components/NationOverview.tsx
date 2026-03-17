/**
 * NationOverview — Preact panel showing all players' status (observer mode).
 *
 * Container with tab switching. Three sub-tabs are split into separate files:
 *  • NationsTab  — player score/gold/research overview (one row per player)
 *  • CitiesTab   — all cities with owner / size
 *  • UnitsTab    — all units with type / owner / HP
 *
 * Each sub-tab reads from store/signals directly — no props passed down.
 */
import { render } from 'preact';
import { signal } from '@preact/signals';
import { currentTurn, cityCount, unitCount, playerUpdated, researchUpdated, rulesetReady } from '../data/signals';
import { Tabs, TabPanel } from './Shared/Tabs';
import { NationsTab, nationOverviewTick } from './NationsTab';
import { CitiesTab } from './CitiesTab';
import { UnitsTab } from './UnitsTab';

type OverviewTab = 'nations' | 'cities' | 'units';

const _activeTab = signal<OverviewTab>('nations');

/** Bump to force a re-render of the Nations tab (and re-reads store). */
export function refreshNationOverview(): void { nationOverviewTick.value++; }
export function setNationOverviewTab(tab: OverviewTab): void { _activeTab.value = tab as OverviewTab; }

export function mountNationOverview(container: HTMLElement): void {
  render(<NationOverview />, container);
}

const OVERVIEW_TABS = [
  { id: 'nations', label: 'Nations' },
  { id: 'cities',  label: 'Cities'  },
  { id: 'units',   label: 'Units'   },
];

// ── root component ────────────────────────────────────────────────────────────

export function NationOverview() {
  nationOverviewTick.value; // explicit external refresh (refreshNationOverview())
  currentTurn.value;        // re-render on each new turn
  playerUpdated.value;      // re-render when any player changes
  researchUpdated.value;    // re-render when research state changes (RESEARCH_INFO)
  cityCount.value;          // re-render when city count changes
  unitCount.value;          // re-render when unit count changes
  rulesetReady.value;       // re-render when tech names become available
  const activeTab = _activeTab.value;

  return (
    <div class="xb-nation-overview">
      <h2 class="xb-nation-overview-title">Nations of the World</h2>
      <div class="xb-nation-overview-body">
        <Tabs
          tabs={OVERVIEW_TABS}
          activeTab={activeTab}
          onTabChange={(id) => { _activeTab.value = id as OverviewTab; }}
        >
          <TabPanel id="nations" activeTab={activeTab}><NationsTab /></TabPanel>
          <TabPanel id="cities"  activeTab={activeTab}><CitiesTab /></TabPanel>
          <TabPanel id="units"   activeTab={activeTab}><UnitsTab /></TabPanel>
        </Tabs>
      </div>
    </div>
  );
}
