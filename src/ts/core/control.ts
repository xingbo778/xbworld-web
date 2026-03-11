/**
 * Control barrel — re-exports all sub-modules for backward compatibility.
 *
 * Observer mode: unit command sub-modules are kept but their functions
 * check clientIsObserver() internally. Diplomat/player-only UI handlers
 * have been removed.
 */

// Re-export everything from sub-modules so that existing imports
// from '../core/control' continue to work unchanged.
export * from './control/controlState';
export * from './control/actionSelection';
export * from './control/chat';
export * from './control/keyboard';
export * from './control/mapClick';
export * from './control/gotoPath';
export * from './control/mouse';
export * from './control/unitCommands';
export * from './control/unitFocus';

// ---------------------------------------------------------------------------
// Imports needed only for control_init()
// ---------------------------------------------------------------------------
import { network_stop } from '../net/connection';
import { isTouchDevice as is_touch_device } from '../utils/helpers';
import { refreshNationOverview } from '../components/NationOverview';
import {
  updateNationScreen as update_nation_screen,
  centerOnPlayer as center_on_player,
} from '../data/nation';
import { overview_clicked } from '../core/overview';
import { mapview_window_resized } from '../renderer/mapview';
import { orientation_changed } from '../utils/mobile';
import { setKeyboardInput, setResizeEnabled, setUrgentFocusQueue } from './control/controlState';
import { global_keyboard_listener } from './control/keyboard';
import { chat_context_change, check_text_input } from './control/chat';
import * as S from './control/controlState';

// Suppress unused-variable warning (is_touch_device kept for backward compat)
void is_touch_device;

function set_default_mapview_active(): void { setKeyboardInput(true); }
function set_default_mapview_inactive(): void { setKeyboardInput(true); }

let _techPanelMounted = false;
function mount_tech_panel(): void {
  if (_techPanelMounted) {
    import('../components/Dialogs/TechDialog').then(({ refreshTechPanel }) => { refreshTechPanel(); });
    return;
  }
  const tabsTec = document.getElementById('tabs-tec');
  if (!tabsTec) return;
  const container = document.createElement('div');
  container.id = 'xb-tech-panel';
  tabsTec.appendChild(container);
  import('../components/Dialogs/TechDialog').then(({ mountTechPanel }) => {
    mountTechPanel(container);
  });
  _techPanelMounted = true;
}

let _nationOverviewMounted = false;
function mount_nation_overview(): void {
  if (_nationOverviewMounted) { refreshNationOverview(); return; }
  const tabsNat = document.getElementById('tabs-nat');
  if (!tabsNat) return;
  // Clear legacy HTML (nations_title, nations_button_div, nations/nations_list)
  // — NationOverview's ActionBar replaces the old button bar
  tabsNat.innerHTML = '';
  const container = document.createElement('div');
  container.id = 'xb-nation-overview';
  container.style.height = '100%';
  tabsNat.appendChild(container);
  // Lazy-import to keep control.ts as a .ts file (no JSX)
  import('../components/NationOverview').then(({ mountNationOverview }) => {
    mountNationOverview(container);
  });
  _nationOverviewMounted = true;
}

// ---------------------------------------------------------------------------
// control_init — observer-mode initialization
// ---------------------------------------------------------------------------
export function control_init(): void {
  setUrgentFocusQueue([]);

  document.addEventListener('keydown', global_keyboard_listener);
  window.addEventListener('resize', mapview_window_resized);
  window.addEventListener('orientationchange', orientation_changed);
  window.addEventListener('resize', orientation_changed);

  // Chat input handlers
  const gameTextInput = document.getElementById('game_text_input') as HTMLInputElement | null;
  gameTextInput?.addEventListener('keydown', (e) => check_text_input(e, gameTextInput));
  gameTextInput?.addEventListener('focus', () => { setKeyboardInput(false); setResizeEnabled(false); });
  gameTextInput?.addEventListener('blur', () => { setKeyboardInput(true); setResizeEnabled(true); });

  document.getElementById('chat_direction')?.addEventListener('click', () => chat_context_change());

  const pregameTextInput = document.getElementById('pregame_text_input') as HTMLInputElement | null;
  pregameTextInput?.addEventListener('keydown', (e) => check_text_input(e, pregameTextInput));
  pregameTextInput?.addEventListener('blur', () => {
    setKeyboardInput(true);
    if (pregameTextInput.value === '') pregameTextInput.value = '>';
  });
  pregameTextInput?.addEventListener('focus', () => {
    setKeyboardInput(false);
    if (pregameTextInput.value === '>') pregameTextInput.value = '';
  });

  // Disable text-selection during map interaction
  document.onselectstart = () => false;

  // Disable right-clicks (except specific elements)
  window.addEventListener('contextmenu', (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target?.id === 'game_text_input' || target?.id === 'overview_map' ||
        target?.parentElement?.id === 'game_message_area') return;
    if (!S.allow_right_click) e.preventDefault();
  }, false);

  // Tab navigation — observer mode shows: Map, Research, Nations
  document.getElementById('map_tab')?.addEventListener('click', () => setTimeout(set_default_mapview_active, 5));
  document.getElementById('tech_tab')?.addEventListener('click', () => { set_default_mapview_inactive(); mount_tech_panel(); });
  document.getElementById('players_tab')?.addEventListener('click', () => { set_default_mapview_inactive(); mount_nation_overview(); update_nation_screen(); });

  // Game Scores button — show sorted player rankings
  document.getElementById('game_scores_button')?.addEventListener('click', () => {
    import('../data/nation').then(({ getPlayerScoresSummary }) => {
      const text = getPlayerScoresSummary();
      import('../client/civClient').then(({ showDialogMessage }) => showDialogMessage('Game Scores', text));
    });
  });

  // Overview map click
  const overviewMap = document.getElementById('overview_map');
  overviewMap?.addEventListener('click', (e: MouseEvent) => {
    const rect = overviewMap.getBoundingClientRect();
    overview_clicked(e.pageX - (rect.left + window.scrollX), e.pageY - (rect.top + window.scrollY));
  });

  // Nation screen buttons
  document.getElementById('view_player_button')?.addEventListener('click', center_on_player);

  window.addEventListener('unload', () => network_stop());
}
