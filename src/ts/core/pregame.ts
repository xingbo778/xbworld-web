import { clientState as client_state, C_S_PREPARING } from '../client/clientState';
import { setupWindowSize as setup_window_size } from '../client/clientMain';

declare const $: any;
declare const client: any;
declare const players: any;
declare const nations: any;
declare const sprites: any;
declare const scenario_info: any;
declare const ruleset_control: any;

export let observing: boolean = false;
export let update_player_info_pregame_queued: boolean = false;

export const QUALITY_MEDIUM: number = 2;
export const QUALITY_HIGH: number = 3;

export let graphics_quality: number = QUALITY_HIGH;
export let antialiasing_setting: boolean = true;

/**
 * Sanitize a username string for safe display.
 */
export function sanitize_username(un: string): string {
  return (un.trim()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/`/g, '&#96;')
    .replace(/\//g, '&#x2F;')
    .replace(/\\/g, '&#x5C;'));
}

/**
 * Display game/scenario info in the pregame lobby.
 */
export function update_game_info_pregame(): void {
  if (C_S_PREPARING != client_state()) return;

  let game_info_html = "";

  if (scenario_info != null && scenario_info['is_scenario']) {
    game_info_html += "<p>";
    game_info_html += scenario_info['description'].replace(/\n/g, "<br>");
    game_info_html += "</p>";

    if (scenario_info['authors']) {
      game_info_html += "<p>Scenario by ";
      game_info_html += scenario_info['authors'].replace(/\n/g, "<br>");
      game_info_html += "</p>";
    }

    if (scenario_info['prevent_new_cities']) {
      game_info_html += "<p>";
      game_info_html += scenario_info['name'] + " forbids the founding of new cities.";
      game_info_html += "</p>";
    }
  }

  $("#pregame_game_info").html(game_info_html);
  setup_window_size();
}

/**
 * Throttled wrapper for update_player_info_pregame_real.
 */
export function update_player_info_pregame(): void {
  if (update_player_info_pregame_queued) return;
  setTimeout(update_player_info_pregame_real, 1000);
  update_player_info_pregame_queued = true;
}

/**
 * Render the player list in pregame lobby (read-only for observers).
 */
export function update_player_info_pregame_real(): void {
  if (C_S_PREPARING != client_state()) {
    update_player_info_pregame_queued = false;
    return;
  }

  let player_html = "";
  for (const id in players) {
    const player = players[id];
    if (player != null) {
      const isAI = player['name'].indexOf("AI") !== -1;
      const iconId = isAI ? 'pregame_ai_icon' : 'pregame_player_icon';
      player_html += "<div id='pregame_plr_" + id
        + "' class='pregame_player_name'><div id='" + iconId + "'></div><b>"
        + player['name'] + "</b></div>";
    }
  }
  $("#pregame_player_list").html(player_html);

  for (const id in players) {
    const player = players[id];
    let nation_text = "";
    if (player['nation'] in nations) {
      nation_text = " - " + nations[player['nation']]['adjective'];
      const flag_html = $("<canvas id='pregame_nation_flags_" + id + "' width='29' height='20' class='pregame_flags'></canvas>");
      $("#pregame_plr_" + id).prepend(flag_html);
      const flag_canvas = document.getElementById('pregame_nation_flags_' + id) as HTMLCanvasElement;
      if (flag_canvas == null) continue;
      const flag_canvas_ctx = flag_canvas.getContext("2d");
      const tag = "f." + nations[player['nation']]['graphic_str'];
      if (sprites[tag] != null && flag_canvas_ctx != null) {
        flag_canvas_ctx.drawImage(sprites[tag], 0, 0);
      }
    }
    if (player['is_ready'] === true) {
      $("#pregame_plr_" + id).addClass("pregame_player_ready");
      $("#pregame_plr_" + id).attr("title", "Player ready" + nation_text);
    } else if (player['name'].indexOf("AI") === -1) {
      $("#pregame_plr_" + id).attr("title", "Player not ready" + nation_text);
    } else {
      $("#pregame_plr_" + id).attr("title", "AI Player (random nation)");
    }
    $("#pregame_plr_" + id).attr("name", player['name']);
    $("#pregame_plr_" + id).attr("playerid", player['playerno']);
  }
  $(".pregame_player_name").tooltip();

  update_player_info_pregame_queued = false;
}

/**
 * Map ruleset display name to directory name.
 */
export function ruledir_from_ruleset_name(ruleset_name: string, fall_back_dir: string): string {
  switch (ruleset_name) {
    case "Classic ruleset":
      return "classic";
    case "Civ2Civ3 ruleset":
      return "civ2civ3";
    case "Multiplayer ruleset":
      return "multiplayer";
    case "Webperimental":
      return "webperimental";
    default:
      console.log("Don't know the ruleset dir of \"" + ruleset_name
        + "\". Guessing \"" + fall_back_dir + "\".");
      return fall_back_dir;
  }
}
