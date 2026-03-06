/**
 * Game state handlers — game_info, calendar, new_year, timeout, trade routes, etc.
 */
import { store } from '../../data/store';
import { C_S_RUNNING, C_S_OVER, clientState, clientIsObserver, clientPlaying } from '../../client/clientState';
import { setClientState as set_client_state } from '../../client/clientMain';
import { setPhaseStart } from '../../client/clientCore';
import { research_data } from '../../data/player';
import { TECH_KNOWN } from '../../data/tech';
import { city_trade_routes } from '../../ui/cityDialog';
import { update_tech_screen, queue_tech_gained_dialog, is_tech_tree_init, tech_dialog_active, bulbs_output_updater } from '../../ui/techDialog';
import { update_game_status_panel } from '../../data/game';
import { chatbox_clip_messages } from '../../core/messages';
import { mark_all_dirty } from '../../renderer/mapviewCommon';
import { setWaitingUnitsList } from '../../core/control/controlState';
import { get_units_in_focus, update_unit_focus, update_active_units_dialog } from '../../core/control/unitFocus';
import { auto_center_on_focus_unit } from '../../core/control/unitFocus';

export function handle_game_info(packet: any): void {
  store.gameInfo = packet;

  if (
    packet.turn > 0 &&
    typeof clientState === 'function' &&
    clientState() !== C_S_RUNNING
  ) {
    setTimeout(() => {
      if (clientState() !== C_S_RUNNING) {
        store.observing = true;
        set_client_state(C_S_RUNNING);
      }
    }, 2000);
  }
}

export function handle_calendar_info(packet: any): void {
  store.calendarInfo = packet;
}

export function handle_spaceship_info(_packet: any): void {
  // spaceship/spacerace feature removed
}

export function handle_new_year(packet: any): void {
  if (!store.gameInfo) return;
  store.gameInfo['year'] = packet['year'];
  store.gameInfo['fragments'] = packet['fragments'];
  store.gameInfo['turn'] = packet['turn'];
}

export function handle_timeout_info(packet: any): void {
  (window as any).last_turn_change_time = Math.ceil(packet['last_turn_change_time']);
  (window as any).seconds_to_phasedone = Math.floor(packet['seconds_to_phasedone']);
  (window as any).seconds_to_phasedone_sync = new Date().getTime();
}

export function handle_trade_route_info(packet: any): void {
  if (city_trade_routes[packet['city']] == null) {
    city_trade_routes[packet['city']] = {};
  }
  city_trade_routes[packet['city']][packet['index']] = packet;
}

export function handle_endgame_player(packet: any): void {
  (window as any).endgame_player_info.push(packet);
}

export function handle_unknown_research(packet: any): void {
  delete research_data[packet['id']];
}

export function handle_end_phase(_packet: any): void {
  chatbox_clip_messages();
}

export function handle_start_phase(_packet: any): void {
  set_client_state(C_S_RUNNING);
  setPhaseStart();
  (window as any).saved_this_turn = false;
}

export function handle_endgame_report(_packet: any): void {
  set_client_state(C_S_OVER);
}

export function handle_scenario_info(packet: any): void {
  store.scenarioInfo = packet;
}

export function handle_scenario_description(packet: any): void {
  store.scenarioInfo['description'] = packet['description'];
  const { update_game_info_pregame } = require('../../core/pregame');
  update_game_info_pregame();
}

export function handle_research_info(packet: any): void {
  let old_inventions: any = null;
  if (research_data[packet['id']] != null) {
    old_inventions = research_data[packet['id']]['inventions'];
  }

  research_data[packet['id']] = packet;

  if ((store.gameInfo as any)?.['team_pooled_research']) {
    for (const player_id in store.players) {
      const pplayer = store.players[player_id];
      if (pplayer['team'] === packet['id']) {
        Object.assign(pplayer, packet);
        delete pplayer['id'];
      }
    }
  } else {
    const pplayer = store.players[packet['id']];
    Object.assign(pplayer, packet);
    delete pplayer['id'];
  }

  if (!clientIsObserver() && old_inventions != null
      && clientPlaying() != null
      && clientPlaying()['playerno'] === packet['id']) {
    for (let i = 0; i < packet['inventions'].length; i++) {
      if (packet['inventions'][i] !== old_inventions[i]
          && packet['inventions'][i] === TECH_KNOWN) {
        queue_tech_gained_dialog(i);
        break;
      }
    }
  }

  if (is_tech_tree_init && tech_dialog_active) update_tech_screen();
  bulbs_output_updater.update();
}

export function handle_begin_turn(_packet: any): void {
  if (typeof mark_all_dirty === 'function') mark_all_dirty();

  if (!store.observing) {
    const btn = document.getElementById('turn_done_button') as HTMLButtonElement | null;
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Turn Done';
    }
  }
  setWaitingUnitsList([]);
  update_unit_focus();
  update_active_units_dialog();
  update_game_status_panel();

  const funits = get_units_in_focus();
  if (funits != null && funits.length === 0) {
    auto_center_on_focus_unit();
  }

  if (is_tech_tree_init && tech_dialog_active) update_tech_screen();
}

export function handle_end_turn(_packet: any): void {
  const { reset_unit_anim_list } = require('../../data/unit');
  reset_unit_anim_list();
  if (!store.observing) {
    const btn = document.getElementById('turn_done_button') as HTMLButtonElement | null;
    if (btn) btn.disabled = true;
  }
}
