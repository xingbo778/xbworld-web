/**
 * Nation screen UI module — DOM-heavy functions extracted from nation.ts.
 *
 * Contains:
 * - updateNationScreen (the main Nations tab builder)
 * - Row selection / button handlers
 * - Private message dialog
 * - Center-on-player, take/toggle-AI helpers
 */

// ---------------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------------
import { store } from './store';
import type { Player } from './types';
import { DiplState, PlayerFlag, get_ai_level_text, get_diplstate_text, get_embassy_text } from './player';
import { cityTile, cityOwnerPlayerId } from './city';
import { swal } from '../components/Dialogs/SwalDialog';
import { initTableSort } from '../utils/tableSort';
import { clientIsObserver, clientPlaying, canClientControl, clientState, C_S_OVER } from '../client/clientState';
import { isLongturn } from '../client/clientCore';
import { setDefaultMapviewActive } from '../client/clientMain';
import { isSmallScreen as is_small_screen } from '../utils/helpers';
import { setHtml } from '../utils/dom';
import { center_tile_mapcanvas } from '../core/control/mapClick';
import { send_message } from '../net/connection';
import { sendDiplomacyCancelPact, sendDiplomacyInitMeeting, sendChatMessage } from '../net/commands';
import { encode_message_text } from '../core/control/chat';
import { keyboard_input, setKeyboardInput } from '../core/control/controlState';
import { getUrlVar } from '../utils/helpers';
import { getDiplstates, colLove, getScoreText, takePlayer, aitogglePlayer } from './nation';

// CLAUSE_VISION and diplomacy_cancel_treaty loaded dynamically to avoid data->ui cycle
const CLAUSE_VISION = 8;  // protocol constant

// ---------------------------------------------------------------------------
// Helpers to access shared window globals
// ---------------------------------------------------------------------------
function getSelectedPlayer(): number {
  return store.selectedPlayer;
}
function setSelectedPlayer(v: number): void {
  store.selectedPlayer = v;
}

// ---------------------------------------------------------------------------
// Helpers for jQuery UI widgets still loaded globally
// ---------------------------------------------------------------------------
function jqButtonEnable(id: string): void {
  const el = document.getElementById(id) as HTMLButtonElement | null;
  if (el) el.disabled = false;
}
function jqButtonDisable(id: string): void {
  const el = document.getElementById(id) as HTMLButtonElement | null;
  if (el) el.disabled = true;
}
function jqButtonLabel(id: string, label: string): void {
  const el = document.getElementById(id);
  if (el) {
    const inner = el.querySelector('.ui-button-text') as HTMLElement | null;
    if (inner) inner.textContent = label;
    else el.textContent = label;
  }
}

// ---------------------------------------------------------------------------
// UI / DOM functions
// ---------------------------------------------------------------------------

/**
 * Rebuilds and displays the Nations of the World table.
 * Replaces update_nation_screen() in nation.js.
 */
export function updateNationScreen(): void {
  const diplstates = getDiplstates();
  let total_players = 0;
  let no_humans = 0;
  let no_ais = 0;
  let nation_list_html =
    "<table class='tablesorter' id='nation_table' width='95%' border=0 cellspacing=0 >" +
    '<thead><tr><th>Flag</th><th>Color</th><th>Player Name:</th>' +
    "<th>Nation:</th><th class='nation_attitude'>Attitude</th><th>Score</th><th>AI/Human</th><th>Alive?</th>" +
    '<th>Diplomatic state</th><th>Embassy</th><th>Shared vision</th>' +
    "<th class='nation_team'>Team</th><th>State</th></tr></thead><tbody class='nation_table_body'>";

  for (const player_id in store.players) {
    const pplayer = store.players[player_id as unknown as number];
    if (pplayer['nation'] === -1) continue;
    if (isLongturn() && pplayer['name'].indexOf('New Available Player') !== -1) continue;
    total_players++;

    const flag_html =
      "<canvas id='nation_dlg_flags_" + player_id +
      "' width='29' height='20' class='nation_flags'></canvas>";

    let plr_class = '';
    if (
      !clientIsObserver() &&
      clientPlaying() != null &&
      Number(player_id) === clientPlaying()!['playerno']
    ) {
      plr_class = 'nation_row_self';
    }
    if (!pplayer['is_alive']) plr_class = 'nation_row_dead';
    if (
      !clientIsObserver() &&
      diplstates[Number(player_id)] != null &&
      diplstates[Number(player_id)] === DiplState.DS_WAR
    ) {
      plr_class = 'nation_row_war';
    }

    nation_list_html +=
      "<tr data-plrid='" + player_id + "' class='" + plr_class + "'><td>" + flag_html + '</td>';
    nation_list_html +=
      "<td><div style='background-color: " +
      store.nations[pplayer['nation']]['color'] +
      "; margin: 5px; width: 25px; height: 25px;'></div></td>";
    nation_list_html +=
      '<td>' +
      pplayer['name'] +
      '</td><td title="' +
      store.nations[pplayer['nation']]['legend'] +
      '">' +
      store.nations[pplayer['nation']]['adjective'] +
      '</td>' +
      "<td class='nation_attitude'>" +
      colLove(pplayer) +
      '</td>' +
      '<td>' +
      getScoreText(pplayer) +
      '</td>' +
      '<td>' +
      (pplayer['flags']!.isSet(PlayerFlag.PLRF_AI)
        ? get_ai_level_text(pplayer) + ' AI'
        : 'Human') +
      '</td><td>' +
      (pplayer['is_alive'] ? 'Alive' : 'Dead') +
      '</td>';

    if (
      !clientIsObserver() &&
      clientPlaying() != null &&
      diplstates[Number(player_id)] != null &&
      Number(player_id) !== clientPlaying()!['playerno']
    ) {
      nation_list_html += '<td>' + get_diplstate_text(diplstates[Number(player_id)]) + '</td>';
    } else {
      nation_list_html += '<td>-</td>';
    }

    nation_list_html += '<td>' + get_embassy_text(Number(player_id)) + '</td>';
    nation_list_html += '<td>';
    if (!clientIsObserver() && clientPlaying() != null) {
      if (
        pplayer['gives_shared_vision']!.isSet(clientPlaying()!['playerno']) &&
        clientPlaying()!['gives_shared_vision']!.isSet(Number(player_id))
      ) {
        nation_list_html += 'Both ways';
      } else if (pplayer['gives_shared_vision']!.isSet(clientPlaying()!['playerno'])) {
        nation_list_html += 'To you';
      } else if (clientPlaying()!['gives_shared_vision']!.isSet(Number(player_id))) {
        nation_list_html += 'To them';
      } else {
        nation_list_html += 'None';
      }
    }
    nation_list_html += '</td>';
    nation_list_html += "<td class='nation_team'>" + (pplayer['team'] + 1) + '</td>';

    let pstate = ' ';
    if (pplayer['phase_done'] && !pplayer['flags']!.isSet(PlayerFlag.PLRF_AI)) {
      pstate = 'Done';
    } else if (!pplayer['flags']!.isSet(PlayerFlag.PLRF_AI) && (pplayer['nturns_idle'] ?? 0) > 1) {
      pstate += 'Idle for ' + pplayer['nturns_idle'] + ' turns';
    } else if (!pplayer['phase_done'] && !pplayer['flags']!.isSet(PlayerFlag.PLRF_AI)) {
      pstate = 'Moving';
    }
    nation_list_html += "<td id='player_state_" + player_id + "'>" + pstate + '</td>';
    nation_list_html += '</tr>';

    if (!pplayer['flags']!.isSet(PlayerFlag.PLRF_AI) && pplayer['is_alive'] && (pplayer['nturns_idle'] ?? 0) <= 4) {
      no_humans++;
    }
    if (pplayer['flags']!.isSet(PlayerFlag.PLRF_AI) && pplayer['is_alive']) no_ais++;
  }

  nation_list_html += '</tbody></table>';

  const nationsListEl = document.getElementById('nations_list');
  setHtml(nationsListEl, nation_list_html);

  const nationsTitleEl = document.getElementById('nations_title');
  if (nationsTitleEl) nationsTitleEl.textContent = 'Nations of the World';

  const nationsLabelEl = document.getElementById('nations_label');
  if (nationsLabelEl) {
    nationsLabelEl.textContent =
      'Human players: ' +
        no_humans +
        '. AIs: ' +
        no_ais +
        '. Inactive/dead: ' +
        (total_players - no_humans - no_ais) +
        '.';
  }

  selectNoNation();

  if (isLongturn()) {
    const takeBtn = document.getElementById('take_player_button');
    if (takeBtn) takeBtn.style.display = 'none';
    const toggleBtn = document.getElementById('toggle_ai_button');
    if (toggleBtn) toggleBtn.style.display = 'none';
    const scoresBtn = document.getElementById('game_scores_button');
    if (scoresBtn) scoresBtn.style.display = 'none';
  }

  // NOTE: upstream has `if (is_small_screen)` without `()` — a bug that
  // always evaluates to truthy (the function reference itself).  We preserve
  // the original behaviour by calling the function correctly.
  if (is_small_screen()) {
    const takeBtn = document.getElementById('take_player_button');
    if (takeBtn) takeBtn.style.display = 'none';
  }

  // Draw nation flags onto their canvas elements.
  for (const player_id in store.players) {
    const pplayer = store.players[player_id];
    const flag_canvas = document.getElementById('nation_dlg_flags_' + player_id) as HTMLCanvasElement | null;
    if (flag_canvas) {
      const flag_canvas_ctx = flag_canvas.getContext('2d');
      const tag = 'f.' + store.nations[pplayer['nation']]['graphic_str'];
      if (flag_canvas_ctx != null && store.sprites[tag] != null) {
        flag_canvas_ctx.drawImage(store.sprites[tag], 0, 0);
      }
    }
  }

  initTableSort('#nation_table', { sortList: [[2, 0]] });

  if (is_small_screen()) {
    const nationsEl = document.getElementById('nations');
    if (nationsEl) {
      nationsEl.style.height = (window.innerHeight - 150) + 'px';
      nationsEl.style.width = window.innerWidth + 'px';
    }
  }

  /* Fetch online (connected) players on this game from Freeciv-proxy. */
  const statusUrl = '/civsocket/' + (parseInt(String(store.civserverport)) + 1000) + '/status';
  fetch(statusUrl, { cache: 'no-store' })
    .then(function (response) { return response.text(); })
    .then(function (data: string) {
      const online_players: Record<string, boolean> = {};
      const players_re = /username: <b>([^<]*)/g;
      let found: RegExpExecArray | null;
      while ((found = players_re.exec(data)) !== null) {
        if (found[1].length > 0) {
          online_players[found[1].toLowerCase()] = true;
        }
      }
      for (const player_id in store.players) {
        const pplayer = store.players[player_id];
        if (online_players[pplayer['username'].toLowerCase()]) {
          const stateEl = document.getElementById('player_state_' + player_id);
          if (stateEl) {
            setHtml(stateEl, "<span style='color: #00EE00;'><b>Online</b></span>");
          }
        }
      }
      const nationTable = document.getElementById('nation_table');
      if (nationTable) nationTable.dispatchEvent(new Event('update'));
    })
    .catch(function () { /* ignore fetch errors */ });

  if (isLongturn()) {
    document.querySelectorAll('.nation_attitude').forEach(function (el) {
      (el as HTMLElement).style.display = 'none';
    });
    document.querySelectorAll('.nation_team').forEach(function (el) {
      (el as HTMLElement).style.display = 'none';
    });
  }
}

/**
 * Handles a click on a row in the nation table.
 * Replaces handle_nation_table_select() in nation.js.
 */
export function handleNationTableSelect(this: HTMLElement, ev: Event): void {
  ev.stopPropagation();
  const new_element = ev.currentTarget as HTMLElement;
  const new_player = parseFloat(new_element.dataset.plrid || '');
  if (new_player === getSelectedPlayer()) {
    new_element.classList.remove('ui-selected');
    selectNoNation();
  } else {
    const parent = new_element.parentElement;
    if (parent) {
      Array.from(parent.children).forEach(function (sibling) {
        if (sibling !== new_element) sibling.classList.remove('ui-selected');
      });
    }
    new_element.classList.add('ui-selected');
    setSelectedPlayer(new_player);
    selectANation();
  }
}

/**
 * Enables the appropriate action buttons for the selected nation.
 * Replaces select_a_nation() in nation.js.
 */
export function selectANation(): void {
  const diplstates = getDiplstates();
  const player_id = getSelectedPlayer();
  const pplayer = store.players[getSelectedPlayer()];
  if (pplayer == null) return;

  const selected_myself =
    clientPlaying() != null && player_id === clientPlaying()!['playerno'];
  const both_alive_and_different =
    clientPlaying() != null &&
    player_id !== clientPlaying()!['playerno'] &&
    pplayer['is_alive'] &&
    clientPlaying()!['is_alive'];

  if (
    pplayer['is_alive'] &&
    (clientIsObserver() ||
      selected_myself ||
      (diplstates[player_id] != null && diplstates[player_id] !== DiplState.DS_NO_CONTACT) ||
      clientState() === C_S_OVER)
  ) {
    jqButtonEnable('view_player_button');
  } else {
    jqButtonDisable('view_player_button');
  }

  if (
    !clientIsObserver() &&
    both_alive_and_different &&
    diplstates[player_id] != null &&
    diplstates[player_id] !== DiplState.DS_NO_CONTACT
  ) {
    jqButtonEnable('meet_player_button');
  } else {
    jqButtonDisable('meet_player_button');
  }

  if (

    !pplayer['flags']!.isSet(PlayerFlag.PLRF_AI) &&
    diplstates[player_id] != null &&
    diplstates[player_id] === DiplState.DS_NO_CONTACT
  ) {
    jqButtonDisable('meet_player_button');
  }

  if (pplayer['flags']!.isSet(PlayerFlag.PLRF_AI) || selected_myself) {
    jqButtonDisable('send_message_button');
  } else {
    jqButtonEnable('send_message_button');
  }

  if (
    !clientIsObserver() &&
    both_alive_and_different &&
    pplayer['team'] !== clientPlaying()!['team'] &&
    diplstates[player_id] != null &&
    diplstates[player_id] !== DiplState.DS_WAR &&
    diplstates[player_id] !== DiplState.DS_NO_CONTACT
  ) {
    jqButtonEnable('cancel_treaty_button');
  } else {
    jqButtonDisable('cancel_treaty_button');
  }

  if (canClientControl() && !selected_myself) {
    if (
      diplstates[player_id] === DiplState.DS_CEASEFIRE ||
      diplstates[player_id] === DiplState.DS_ARMISTICE ||
      diplstates[player_id] === DiplState.DS_PEACE
    ) {
      jqButtonLabel('cancel_treaty_button', 'Declare war');
    } else {
      jqButtonLabel('cancel_treaty_button', 'Cancel treaty');
    }
  }

  if (
    canClientControl() &&
    both_alive_and_different &&
    pplayer['team'] !== clientPlaying()!['team'] &&
    clientPlaying()!['gives_shared_vision']!.isSet(player_id)
  ) {
    jqButtonEnable('withdraw_vision_button');
  } else {
    jqButtonDisable('withdraw_vision_button');
  }

  if (
    clientIsObserver() ||
    (both_alive_and_different && diplstates[player_id] !== DiplState.DS_NO_CONTACT)
  ) {
    jqButtonEnable('intelligence_report_button');
  } else {
    jqButtonDisable('intelligence_report_button');
  }

  if (

    clientIsObserver() &&
    pplayer['flags']!.isSet(PlayerFlag.PLRF_AI) &&
    store.nations[pplayer['nation']]['is_playable'] &&
    getUrlVar('multi') === 'true'
  ) {
    jqButtonEnable('take_player_button');
  } else {
    jqButtonDisable('take_player_button');
  }

  jqButtonEnable('toggle_ai_button');
}

/**
 * Marks the selected player as none and disables all action buttons
 * except the scores one.
 * Replaces select_no_nation() in nation.js.
 */
export function selectNoNation(): void {
  setSelectedPlayer(-1);
  try {
    const container = document.getElementById('nations_button_div');
    if (container) {
      const buttons = container.querySelectorAll('button');
      buttons.forEach(function (btn) {
        if (btn.id !== 'game_scores_button') {
          btn.disabled = true;
        }
      });
    }
  } catch (_e) { /* buttons may not be initialized yet */ }
}

/**
 * Changes to the nations tab, selects a player and scrolls the table
 * so that it is on view.
 * Replaces nation_table_select_player() in nation.js.
 */
export function nationTableSelectPlayer(player_no: number): void {
  const playersTabLink = document.querySelector('#players_tab a') as HTMLElement | null;
  if (playersTabLink) playersTabLink.click();
  const row = document.querySelector('#nation_table tr[data-plrid="' + player_no + '"]') as HTMLElement | null;
  if (row) {
    row.click();
    row.scrollIntoView();
  }
}

/** Handles the "Cancel Treaty" button click. */
export async function cancelTreatyClicked(): Promise<void> {
  if (getSelectedPlayer() === -1) return;
  const { diplomacy_cancel_treaty } = await import('../ui/diplomacy');
  diplomacy_cancel_treaty(getSelectedPlayer());
  setDefaultMapviewActive();
}

/** Handles the "Withdraw Vision" button click. */
export function withdrawVisionClicked(): void {
  if (getSelectedPlayer() === -1) return;
  sendDiplomacyCancelPact(getSelectedPlayer(), CLAUSE_VISION);
  setDefaultMapviewActive();
}

/** Handles the "Meet" button click in the nation dialog. */
export function nationMeetClicked(): void {
  if (getSelectedPlayer() === -1) return;
  const pplayer = store.players[getSelectedPlayer()];
  if (pplayer == null) return;
  sendDiplomacyInitMeeting(pplayer['playerno']);
  setDefaultMapviewActive();
}

/** Handles the "Take Player" button click. */
export function takePlayerClicked(): void {
  if (getSelectedPlayer() === -1) return;
  const pplayer = store.players[getSelectedPlayer()];
  takePlayer(pplayer['name']);
  setDefaultMapviewActive();
}

/** Handles the "Toggle AI" button click. */
export function toggleAiClicked(): void {
  if (getSelectedPlayer() === -1) return;
  const pplayer = store.players[getSelectedPlayer()];
  aitogglePlayer(pplayer['name']);
  setDefaultMapviewActive();
}

/**
 * Centers the map on the selected player's first city.
 * Replaces center_on_player() in nation.js.
 */
export function centerOnPlayer(): void {
  if (getSelectedPlayer() === -1) return;
  for (const city_id in store.cities) {
    const pcity = store.cities[city_id];
    if (cityOwnerPlayerId(pcity) === getSelectedPlayer()) {
      center_tile_mapcanvas(cityTile(pcity));
      setDefaultMapviewActive();
      return;
    }
  }
}

/**
 * Sends a private chat message to another player.
 * Only called from within the private-message dialog.
 * Replaces send_private_message() in nation.js.
 */
export function sendPrivateMessage(other_player_name: string): void {
  const inputEl = document.getElementById('private_message_text') as HTMLInputElement | null;
  const message =
    other_player_name + ': ' + encode_message_text(inputEl ? inputEl.value : '');
  sendChatMessage(message);
  setKeyboardInput(true);
  const dlg = document.getElementById('dialog');
  if (dlg) dlg.remove();
}

/**
 * Shows the dialog for sending a private message to another human player.
 * Replaces show_send_private_message_dialog() in nation.js.
 */
export function showSendPrivateMessageDialog(): void {
  if (getSelectedPlayer() === -1) return;
  const pplayer = store.players[getSelectedPlayer()];
  if (pplayer == null) {
    swal('Please select a player to send a private message to first.');
    return;
  }
  const name: string = pplayer['name'];
  setKeyboardInput(false);

  const oldDialog = document.getElementById('dialog');
  if (oldDialog) oldDialog.remove();

  const gamePage = document.querySelector('div#game_page');
  const dialogEl = document.createElement('div');
  dialogEl.id = 'dialog';
  if (gamePage) gamePage.appendChild(dialogEl);

  const intro_html =
    "Message: <input id='private_message_text' type='text' size='50' maxlength='80'>";
  setHtml(dialogEl, intro_html);
  dialogEl.setAttribute('title', 'Send private message to ' + name);

  // Show as a simple modal dialog
  dialogEl.style.cssText = 'position:fixed;z-index:5000;background:#222;border:1px solid #555;padding:16px;top:30%;left:50%;transform:translateX(-50%);width:' + (is_small_screen() ? '80%' : '40%') + ';';
  const sendBtn = document.createElement('button');
  sendBtn.textContent = 'Send';
  sendBtn.style.cssText = 'margin-top:8px;margin-right:8px;';
  sendBtn.addEventListener('click', function() { sendPrivateMessage(name); });
  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Cancel';
  cancelBtn.style.cssText = 'margin-top:8px;';
  cancelBtn.addEventListener('click', function() { dialogEl.remove(); });
  dialogEl.appendChild(document.createElement('br'));
  dialogEl.appendChild(sendBtn);
  dialogEl.appendChild(cancelBtn);

  dialogEl.addEventListener('keyup', function (e: KeyboardEvent) {
    if (e.keyCode === 13) {
      sendPrivateMessage(name);
    }
  });
}
