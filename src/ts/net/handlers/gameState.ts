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
import { update_tech_screen, queue_tech_gained_dialog, tech_dialog_active } from '../../ui/techDialog';
import { globalEvents } from '../../core/events';
import { update_game_status_panel } from '../../data/game';
import { chatbox_clip_messages } from '../../core/messages';
import { mark_all_dirty } from '../../renderer/mapviewCommon';
import { setWaitingUnitsList } from '../../core/control/controlState';
import { get_units_in_focus, update_unit_focus, update_active_units_dialog } from '../../core/control/unitFocus';
import { auto_center_on_focus_unit } from '../../core/control/unitFocus';
import { update_game_info_pregame } from '../../core/pregame';
import { reset_unit_anim_list } from '../../data/unit';
import type {
  BasePacket,
  GameInfoPacket, CalendarInfoPacket, NewYearPacket,
  TimeoutInfoPacket, TradeRouteInfoPacket, EndgamePlayerPacket,
  UnknownResearchPacket, ScenarioInfoPacket, ScenarioDescriptionPacket,
  ResearchInfoPacket,
} from './packetTypes';

export function handle_game_info(packet: GameInfoPacket): void {
  store.gameInfo = packet;
  globalEvents.emit('game:info', packet);

  const turn = packet.turn ?? 0;
  const obs = store.observing;
  const curState = typeof clientState === 'function' ? clientState() : -1;
  console.log('[xbw] handle_game_info turn=' + turn + ' observing=' + obs + ' clientState=' + curState);

  if (
    typeof clientState === 'function' &&
    clientState() !== C_S_RUNNING &&
    (packet.turn > 0 || store.observing)
  ) {
    console.log('[xbw] handle_game_info: scheduling C_S_RUNNING transition in 2s');
    setTimeout(() => {
      if (clientState() !== C_S_RUNNING) {
        console.log('[xbw] handle_game_info: firing C_S_RUNNING transition');
        store.observing = true;
        set_client_state(C_S_RUNNING);
      } else {
        console.log('[xbw] handle_game_info: already C_S_RUNNING, skip');
      }
    }, 2000);
  }
}

export function handle_calendar_info(packet: CalendarInfoPacket): void {
  store.calendarInfo = packet;
}

export function handle_spaceship_info(_packet: BasePacket): void {
  // spaceship/spacerace feature removed
}

export function handle_new_year(packet: NewYearPacket): void {
  if (!store.gameInfo) return;
  // Assign a new object so Preact signal detects the change (signals use === comparison).
  store.gameInfo = { ...store.gameInfo, year: packet['year'], fragments: packet['fragments'], turn: packet['turn'] } as typeof store.gameInfo;
  globalEvents.emit('game:newyear', packet);
}

export function handle_timeout_info(packet: TimeoutInfoPacket): void {
  store.lastTurnChangeTime = Math.ceil(packet['last_turn_change_time']);
  store.secondsToPhasedone = Math.floor(packet['seconds_to_phasedone']);
  store.secondsToPhasedoneSync = new Date().getTime();
}

export function handle_trade_route_info(packet: TradeRouteInfoPacket): void {
  if (city_trade_routes[packet['city']] == null) {
    city_trade_routes[packet['city']] = {};
  }
  city_trade_routes[packet['city']][packet['index']] = packet;
}

export function handle_endgame_player(packet: EndgamePlayerPacket): void {
  store.endgamePlayerInfo.push(packet);
  (window as unknown as Record<string, unknown>)['endgame_player_info'] = store.endgamePlayerInfo;  // legacy JS bridge
}

export function handle_unknown_research(packet: UnknownResearchPacket): void {
  delete research_data[packet['id']];
}

export function handle_end_phase(_packet: BasePacket): void {
  chatbox_clip_messages();
}

export function handle_start_phase(_packet: BasePacket): void {
  set_client_state(C_S_RUNNING);
  setPhaseStart();
  store.savedThisTurn = false;
}

export function handle_endgame_report(_packet: BasePacket): void {
  set_client_state(C_S_OVER);
}

export function handle_scenario_info(packet: ScenarioInfoPacket): void {
  store.scenarioInfo = packet;
}

export function handle_scenario_description(packet: ScenarioDescriptionPacket): void {
  store.scenarioInfo!['description'] = packet['description'];
  update_game_info_pregame();
}

export function handle_research_info(packet: ResearchInfoPacket): void {
  let old_inventions: number[] | null = null;
  if (research_data[packet['id']] != null) {
    old_inventions = research_data[packet['id']]['inventions'] as number[];
  }

  research_data[packet['id']] = packet;

  if (store.gameInfo?.['team_pooled_research']) {
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
      && clientPlaying()!['playerno'] === packet['id']) {
    for (let i = 0; i < packet['inventions'].length; i++) {
      if (packet['inventions'][i] !== old_inventions[i]
          && packet['inventions'][i] === TECH_KNOWN) {
        queue_tech_gained_dialog(i);
        break;
      }
    }
  }

  if (tech_dialog_active) update_tech_screen();
  globalEvents.emit('player:research');
}

export function handle_begin_turn(_packet: BasePacket): void {
  globalEvents.emit('game:beginturn');
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

  if (tech_dialog_active) update_tech_screen();
}

export function handle_end_turn(_packet: BasePacket): void {
  reset_unit_anim_list();
  if (!store.observing) {
    const btn = document.getElementById('turn_done_button') as HTMLButtonElement | null;
    if (btn) btn.disabled = true;
  }
}
