import { initTabs } from './tabs';
import { swal } from '../components/Dialogs/SwalDialog';
import { initTableSort } from '../utils/tableSort';
import { store } from '../data/store';
import { cityTile, cityOwner, getCityProductionTypeSprite as get_city_production_type_sprite, getCityProductionTime as get_city_production_time, getProductionProgress as get_production_progress, getCityProductionType as get_city_production_type, cityPopulation as city_population, cityTurnsToGrowthText as city_turns_to_growth_text } from '../data/city';
import { get_supported_units } from '../data/unit';
import { get_unit_city_info } from '../data/unit';
import { get_unit_image_sprite } from '../renderer/tilespec';
import { game_find_unit_by_number } from '../data/game';
import { VUT_UTYPE, VUT_IMPROVEMENT, FC_INFINITY, O_FOOD, O_SHIELD, O_TRADE, O_GOLD, O_LUXURY, O_SCIENCE, MAX_LEN_CITYNAME, MAX_LEN_NAME } from '../data/fcTypes';
import { get_improvement_image_sprite } from '../renderer/tilespec';
import { RENDERER_2DCANVAS } from '../core/constants';
import { tile_units } from '../data/unit';
import { clientState as client_state, C_S_RUNNING, clientIsObserver, clientPlaying } from '../client/clientState';
import { send_request as sendRequest } from '../net/connection';
import { packet_city_options_req, packet_city_buy, packet_city_change, packet_city_make_specialist, packet_city_make_worker, packet_city_rename, packet_city_sell, packet_city_change_specialist } from '../net/packetConstants';
import { isSmallScreen as is_small_screen, numberWithCommas, isTouchDevice as is_touch_device, blur_input_on_touchdevice } from '../utils/helpers';
import { setupWindowSize as setup_window_size } from '../client/clientMain';
import { set_city_mapview_active } from '../renderer/mapview';
import { center_tile_mapcanvas } from '../core/control';
import { update_map_canvas, update_map_canvas_full, mapview } from '../renderer/mapviewCommon';
import { setDefaultMapviewActive as set_default_mapview_active } from '../client/clientMain';
import { request_unit_do_action } from '../core/control';
import { ACTION_FOUND_CITY } from '../data/fcTypes';
import { keyboard_input } from '../core/control/controlState';
import { act_sel_queue_done } from '../ui/actionDialog';

// Import state from cityDialogState
import {
  citydlg_map_width, citydlg_map_height, tileset_width, tileset_height,
  cities, city_rules, city_trade_routes, goods,
  active_city, worklist_dialog_active, production_selection, worklist_selection,
  CITYO_DISBAND, CITYO_NEW_EINSTEIN, CITYO_NEW_TAXMAN, CITYO_LAST,
  FEELING_BASE, FEELING_LUXURY, FEELING_EFFECT, FEELING_NATIONALITY, FEELING_MARTIAL, FEELING_FINAL,
  MAX_LEN_WORKLIST, INCITE_IMPOSSIBLE_COST,
  city_tab_index, city_prod_clicks, city_screen_updater, city_tile_map,
  opt_show_unreachable_items,
  set_citydlg_map_width, set_citydlg_map_height,
  set_active_city, set_worklist_dialog_active, set_production_selection, set_worklist_selection,
  set_city_prod_clicks,
  set_city_screen_updater_fn
} from './cityDialogState';

// Import worklist functions from cityWorklist
import {
  city_worklist_dialog, populate_worklist_production_choices,
  extract_universal, find_universal_in_worklist,
  handle_worklist_select, handle_worklist_unselect,
  handle_current_worklist_select, handle_current_worklist_unselect,
  handle_current_worklist_click, handle_current_worklist_direct_remove,
  update_worklist_actions, send_city_worklist, send_city_worklist_add,
  city_change_production, city_add_to_worklist, city_insert_in_worklist,
  city_worklist_task_up, city_worklist_task_down, city_exchange_worklist_task,
  city_worklist_task_remove
} from './cityWorklist';

// Re-export everything from cityDialogState for backwards compatibility
export {
  citydlg_map_width, citydlg_map_height,
  cities, city_rules, city_trade_routes, goods,
  active_city, worklist_dialog_active, production_selection, worklist_selection,
  CITYO_DISBAND, CITYO_NEW_EINSTEIN, CITYO_NEW_TAXMAN, CITYO_LAST,
  FEELING_BASE, FEELING_LUXURY, FEELING_EFFECT, FEELING_NATIONALITY, FEELING_MARTIAL, FEELING_FINAL,
  MAX_LEN_WORKLIST, INCITE_IMPOSSIBLE_COST,
  city_tab_index, city_prod_clicks, city_screen_updater, city_tile_map,
  opt_show_unreachable_items
} from './cityDialogState';

// Re-export everything from cityWorklist for backwards compatibility
export {
  city_worklist_dialog, populate_worklist_production_choices,
  extract_universal, find_universal_in_worklist,
  handle_worklist_select, handle_worklist_unselect,
  handle_current_worklist_select, handle_current_worklist_unselect,
  handle_current_worklist_click, handle_current_worklist_direct_remove,
  update_worklist_actions, send_city_worklist, send_city_worklist_add,
  city_change_production, city_add_to_worklist, city_insert_in_worklist,
  city_worklist_task_up, city_worklist_task_down, city_exchange_worklist_task,
  city_worklist_task_remove
} from './cityWorklist';

declare const $: any;

// Register update_city_screen with the lazy proxy in cityDialogState
set_city_screen_updater_fn(update_city_screen);

/**************************************************************************
 ...
**************************************************************************/

export function show_city_dialog_by_id(pcity_id: any): void {
  show_city_dialog(cities[pcity_id]);
}

export function show_city_dialog(pcity: any): void {
  let turns_to_complete: any;
  let sprite: any;
  let punit: any;

  if (active_city != pcity || active_city == null) {
    set_city_prod_clicks(0);
    set_production_selection([]);
    set_worklist_selection([]);
  }

  if (active_city != null) close_city_dialog();
  set_active_city(pcity);
  if (pcity == null) return;

  // reset dialog page.
  $("#city_dialog").remove();
  $("<div id='city_dialog'></div>").appendTo("div#game_page");

  const city_data: any = {};

  $("#city_dialog").html((window as any).Handlebars.templates['city'](city_data));

  $("#city_canvas").click(city_mapview_mouse_click);

  show_city_traderoutes();

  let dialog_buttons: any = {};
  if (!is_small_screen()) {
    dialog_buttons = $.extend(dialog_buttons,
      {
       "Previous city" : function() {
         previous_city();
       },
       "Next city (N)" : function() {
         next_city();
       },
       "Buy (B)" : function() {
         request_city_buy();
       },
       "Rename" : function() {
         rename_city();
       }
     });
   } else {
       dialog_buttons = $.extend(dialog_buttons,
         {
          "Next" : function() {
            next_city();
          },
          "Buy" : function() {
            request_city_buy();
          }
        });
   }

   dialog_buttons = $.extend(dialog_buttons, {"Close": close_city_dialog});

  $("#city_dialog").attr("title", decodeURIComponent(pcity['name'])
                         + " (" + pcity['size'] + ")");
  $("#city_dialog").dialog({
			bgiframe: true,
			modal: false,
			width: is_small_screen() ? "98%" : "80%",
                        height: is_small_screen() ? $(window).height() + 10 : $(window).height() - 80,
                        close : city_dialog_close_handler,
            buttons: dialog_buttons
                   }).dialogExtend({
                     "minimizable" : true,
                     "closable" : true,
                     "minimize" : function(evt: any, dlg: any){ set_default_mapview_active(); },
                     "icons" : {
                       "minimize" : "ui-icon-circle-minus",
                       "restore" : "ui-icon-bullet"
                     }});

  $("#city_dialog").dialog('widget').keydown(city_keyboard_listener);
  $("#city_dialog").dialog('open');
  $("#game_text_input").blur();

  /* Prepare city dialog for small screens. */
  if (!is_small_screen()) {
    $("#city_tabs-6").remove();
    $(".extra_tabs_small").remove();
    $("#mobile_cma_checkbox").remove();
  } else {
    $("#city_tabs-5").remove();
    $(".extra_tabs_big").remove();
    $("#city_stats").hide();
    const units_element: any = $("#city_improvements_panel").detach();
    $('#city_units_tab').append(units_element);
   }

  initTabs('#city_tabs', { active: city_tab_index });

  $(".citydlg_tabs").height(is_small_screen() ? $(window).height() - 110 : $(window).height() - 225);

  city_worklist_dialog(pcity);

  const orig_renderer: any = (window as any).renderer;
  // (window as any).renderer = RENDERER_2DCANVAS; // This line is commented out in the original JS, so it's commented here too.
  set_citydlg_dimensions(pcity);
  set_city_mapview_active();
  center_tile_mapcanvas(cityTile(pcity));
  update_map_canvas(0, 0, mapview['store_width'] ?? 0, mapview['store_height'] ?? 0);
  // (window as any).renderer = orig_renderer; // This line is commented out in the original JS, so it's commented here too.

  let governor_text: string = "";
  if (typeof pcity['cma_enabled'] !== 'undefined') {
    governor_text = "<br>" + (pcity['cma_enabled'] ? "Governor Enabled" : "Governor Disabled");
  }

  $("#city_size").html("Population: " + numberWithCommas(city_population(pcity)*1000) + "<br>"
                       + "Size: " + pcity['size'] + "<br>"
                       + "Granary: " + pcity['food_stock'] + "/" + pcity['granary_size'] + "<br>"
                       + "Change in: " + city_turns_to_growth_text(pcity) + governor_text);

  const prod_type: any = get_city_production_type_sprite(pcity);
  $("#city_production_overview").html("Producing: " + (prod_type != null ? prod_type['type']['name'] : "None"));

  turns_to_complete = get_city_production_time(pcity);

  if (turns_to_complete != FC_INFINITY) {
    $("#city_production_turns_overview").html(turns_to_complete + " turns &nbsp;&nbsp;(" + get_production_progress(pcity) + ")");
  } else {
    $("#city_production_turns_overview").html("-");
  }

  let improvements_html: string = "";
  for (let z = 0; z < ((store.rulesControl as any)?.num_impr_types ?? 0); z ++) {
    if (pcity['improvements'] != null && pcity['improvements'].isSet(z)) {
       sprite = get_improvement_image_sprite(store.improvements[z]);
       if (sprite == null) {
         console.log("Missing sprite for improvement " + z);
         continue;
       }

      improvements_html = improvements_html +
       "<div id='city_improvement_element'><div style='background: transparent url("
           + sprite['image-src'] +
           ");background-position:-" + sprite['tileset-x'] + "px -" + sprite['tileset-y']
           + "px;  width: " + sprite['width'] + "px;height: " + sprite['height'] + "px;float:left; '"
           + "title=\"" + store.improvements[z]['helptext'] + "\" "
	   + "onclick='city_sell_improvement(" + z + ");'>"
           +"</div>" + store.improvements[z]['name'] + "</div>";
    }
  }
  $("#city_improvements_list").html(improvements_html);

  const punits: any = tile_units(cityTile(pcity));
  if (punits != null) {
    let present_units_html: string = "";
    for (let r = 0; r < punits.length; r++) {
      punit = punits[r];
      sprite = get_unit_image_sprite(punit);
      if (sprite == null) {
         console.log("Missing sprite for " + punit);
         continue;
       }

      present_units_html = present_units_html +
       "<div class='game_unit_list_item' title='" + get_unit_city_info(punit)
           + "' style='cursor:pointer;cursor:hand; background: transparent url("
           + sprite['image-src'] +
           ");background-position:-" + sprite['tileset-x'] + "px -" + sprite['tileset-y']
           + "px;  width: " + sprite['width'] + "px;height: " + sprite['height'] + "px;float:left; '"
           + " onclick='city_dialog_activate_unit(units[" + punit['id'] + "]);'"
           +"></div>";
    }
    $("#city_present_units_list").html(present_units_html);
  }

  const sunits: any = get_supported_units(pcity);
  if (sunits != null) {
    let supported_units_html: string = "";
    for (let t = 0; t < sunits.length; t++) {
      punit = sunits[t];
      sprite = get_unit_image_sprite(punit);
      if (sprite == null) {
         console.log("Missing sprite for " + punit);
         continue;
       }

      supported_units_html = supported_units_html +
       "<div class='game_unit_list_item' title='" + get_unit_city_info(punit)
           + "' style='cursor:pointer;cursor:hand; background: transparent url("
           + sprite['image-src'] +
           ");background-position:-" + sprite['tileset-x'] + "px -" + sprite['tileset-y']
           + "px;  width: " + sprite['width'] + "px;height: " + sprite['height'] + "px;float:left; '"
           + " onclick='city_dialog_activate_unit(units[" + punit['id'] + "]);'"
           +"></div>";
    }
    $("#city_supported_units_list").html(supported_units_html);
  }
  $(".game_unit_list_item").tooltip();

  if ('prod' in pcity && 'surplus' in pcity) {
    let food_txt: string = pcity['prod'][O_FOOD] + " ( ";
    if (pcity['surplus'][O_FOOD] > 0) food_txt += "+";
    food_txt += pcity['surplus'][O_FOOD] + ")";

    let shield_txt: string = pcity['prod'][O_SHIELD] + " ( ";
    if (pcity['surplus'][O_SHIELD] > 0) shield_txt += "+";
    shield_txt += pcity['surplus'][O_SHIELD] + ")";

    let trade_txt: string = pcity['prod'][O_TRADE] + " ( ";
    if (pcity['surplus'][O_TRADE] > 0) trade_txt += "+";
    trade_txt += pcity['surplus'][O_TRADE] + ")";

    let gold_txt: string = pcity['prod'][O_GOLD] + " ( ";
    if (pcity['surplus'][O_GOLD] > 0) gold_txt += "+";
    gold_txt += pcity['surplus'][O_GOLD] + ")";

    const luxury_txt: any = pcity['prod'][O_LUXURY];
    const science_txt: any = pcity['prod'][O_SCIENCE];

    $("#city_food").html(food_txt);
    $("#city_prod").html(shield_txt);
    $("#city_trade").html(trade_txt);
    $("#city_gold").html(gold_txt);
    $("#city_luxury").html(luxury_txt);
    $("#city_science").html(science_txt);

    $("#city_corruption").html(pcity['waste'][O_TRADE]);
    $("#city_waste").html(pcity['waste'][O_SHIELD]);
    $("#city_pollution").html(pcity['pollution']);
    $("#city_steal").html(pcity['steal']);
    $("#city_culture").html(pcity['culture']);
  }

  /* Handle citizens and specialists */
  let specialist_html: string = "";
  const citizen_types: string[] = ["angry", "unhappy", "content", "happy"];
  for (let s = 0; s < citizen_types.length; s++) {
    if (pcity['ppl_' + citizen_types[s]] == null) continue;
    for (let i = 0; i < pcity['ppl_' + citizen_types[s]][FEELING_FINAL]; i ++) {
      sprite = get_specialist_image_sprite("citizen." + citizen_types[s] + "_"
         + (i % 2));
      specialist_html = specialist_html +
      "<div class='specialist_item' style='background: transparent url("
           + sprite['image-src'] +
           ");background-position:-" + sprite['tileset-x'] + "px -" + sprite['tileset-y']
           + "px;  width: " + sprite['width'] + "px;height: " + sprite['height'] + "px;float:left; '"
           +" title='One " + citizen_types[s] + " citizen'></div>";
    }
  }

  for (let u = 0; u < pcity['specialists_size']; u++) {
    const spec_type_name: string = (window as any).specialists[u]['plural_name'];
    const spec_gfx_key: string = "specialist." + (window as any).specialists[u]['rule_name'] + "_0";
    for (let j = 0; j < pcity['specialists'][u]; j++) {
      sprite = get_specialist_image_sprite(spec_gfx_key);
      specialist_html = specialist_html +
      "<div class='specialist_item' style='cursor:pointer;cursor:hand; background: transparent url("
           + sprite['image-src'] +
           ");background-position:-" + sprite['tileset-x'] + "px -" + sprite['tileset-y']
           + "px;  width: " + sprite['width'] + "px;height: " + sprite['height'] + "px;float:left; '"
           + " onclick='city_change_specialist(" + pcity['id'] + "," + (window as any).specialists[u]['id'] + ");'"
           +" title='" + spec_type_name + " (click to change)'></div>";

    }
  }
  specialist_html += "<div style='clear: both;'></div>";
  $("#specialist_panel").html(specialist_html);

  $('#disbandable_city').off();
  $('#disbandable_city').prop('checked',
                              pcity['city_options'] != null && pcity['city_options'].isSet(CITYO_DISBAND));
  $('#disbandable_city').click(function() {
    const options: any = pcity['city_options'];
    const packet: any = {
      "pid"     : packet_city_options_req,
      "city_id" : active_city['id'],
      "options" : options.raw
    };

    /* Change the option value referred to by the packet. */
    if ($('#disbandable_city').prop('checked')) {
      options.set(CITYO_DISBAND);
    } else {
      options.unset(CITYO_DISBAND);
    }

    /* Send the (now updated) city options. */
    sendRequest(JSON.stringify(packet));

  });

  if (is_small_screen()) {
    $(".ui-tabs-anchor").css("padding", "2px");
  }

  show_city_governor_tab();
}

export function request_city_buy(): void {
  if (clientIsObserver()) return;
  const pcity: any = active_city;
  const pplayer: any = clientPlaying();

  // reset dialog page.
  $("#dialog").remove();
  $("<div id='dialog'></div>").appendTo("div#game_page");
  let buy_price_string: string = "";
  let buy_question_string: string = "";

  if (pcity['production_kind'] == VUT_UTYPE) {
    const punit_type: any = store.unitTypes[pcity['production_value']];
    if (punit_type != null) {
      buy_price_string = punit_type['name'] + " costs " + pcity['buy_cost'] + " gold.";
      buy_question_string = "Buy " + punit_type['name'] + " for " + pcity['buy_cost'] + " gold?";
    }
  } else {
    const improvement: any = store.improvements[pcity['production_value']];
    if (improvement != null) {
      buy_price_string = improvement['name'] + " costs " + pcity['buy_cost'] + " gold.";
      buy_question_string = "Buy " + improvement['name'] + " for " + pcity['buy_cost'] + " gold?";
    }
  }

  const treasury_text: string = "<br>Treasury contains " + pplayer['gold'] + " gold.";

  if (pcity['buy_cost'] > pplayer['gold']) {
    show_dialog_message("Buy It!",
      buy_price_string + treasury_text);
    return;
  }

  const dhtml: string = buy_question_string + treasury_text;


  $("#dialog").html(dhtml);

  $("#dialog").attr("title", "Buy It!");
  $("#dialog").dialog({
			bgiframe: true,
			modal: true,
			width: is_small_screen() ? "95%" : "50%",
			buttons: {
				"Yes": function() {
						send_city_buy();
						$("#dialog").dialog('close');
				},
				"No": function() {
						$("#dialog").dialog('close');

				}
			}
		});

  $("#dialog").dialog('open');
}

export function send_city_buy(): void {
  if (clientIsObserver()) return;
  if (active_city != null) {
    const packet: any = {"pid" : packet_city_buy, "city_id" : active_city['id']};
    sendRequest(JSON.stringify(packet));
  }
}

export function send_city_change(city_id: number, kind: any, value: any): void {
  const packet: any = {"pid" : packet_city_change, "city_id" : city_id,
                "production_kind": kind, "production_value" : value};
  sendRequest(JSON.stringify(packet));
}

export function close_city_dialog(): void {
  $("#city_dialog").dialog('close');
}

export function city_dialog_close_handler(): void {
  set_default_mapview_active();
  if (active_city != null) {
    setup_window_size ();
    center_tile_mapcanvas(cityTile(active_city));
    set_active_city(null);
     /*
      * TODO: this is just a hack to recover the background map.
      *       setup_window_size will resize (and thus clean) the map canvas,
      *       and this is now called when we show a city dialog while another
      *       one is open, which is unexpectedly common, tracing the functions
      *       shows two or three calls to show_city_dialog(). Maybe one internal
      *       from the client UI, the rest from info packets from the server.
      *       Both those duplicate calls and the stopping of map updates due
      *       to the 2D rendered being used to draw the minimap should go.
      */
    if ((window as any).renderer == RENDERER_2DCANVAS) {
      update_map_canvas_full();
    }

  }
  // (window as any).keyboard_input=true; // This is a global variable, not a local one.
  set_worklist_dialog_active(false);
}

export function do_city_map_click(ptile: any): void {
  let packet: any = null;
  if (ptile['worked'] == active_city['id']) {
    packet = {"pid"     : packet_city_make_specialist,
              "city_id" : active_city['id'],
              "tile_id" : ptile['index']};
  } else {
    packet = {"pid"     : packet_city_make_worker,
              "city_id" : active_city['id'],
              "tile_id" : ptile['index']};
  }
  sendRequest(JSON.stringify(packet));
}

export function city_name_dialog(suggested_name: string, unit_id: number): void {
  // reset dialog page.
  $("#city_name_dialog").remove();
  $("<div id='city_name_dialog'></div>").appendTo("div#game_page");

  $("#city_name_dialog").html($("<div>What should we call our new city?</div>"
                              + "<input id='city_name_req' type='text'>"));

  /* A suggested city name can contain an apostrophe ("'"). That character
   * is also used for single quotes. It shouldn't be added unescaped to a
   * string that later is interpreted as HTML. */
  /* TODO: Forbid city names containing an apostrophe or make sure that all
   * JavaScript using city names handles it correctly. Look for places
   * where a city name string is added to a string that later is
   * interpreted as HTML. Avoid the situation by directly using JavaScript
   * like below or by escaping the string. */
  $("#city_name_req").attr("value", suggested_name);

  $("#city_name_dialog").attr("title", "Build New City");
  $("#city_name_dialog").dialog({
			bgiframe: true,
			modal: true,
			width: "300",
			close: function() {
				// (window as any).keyboard_input=true; // This is a global variable, not a local one.
                act_sel_queue_done(unit_id);
			},
			buttons: [	{
					text: "Cancel",
				        click: function() {
						$("#city_name_dialog").remove();
                        // (window as any).keyboard_input=true; // This is a global variable, not a local one.
                        act_sel_queue_done(unit_id);
					}
				},{
					text: "Ok",
				        click: function() {
						const name: string = $("#city_name_req").val();
						if (name.length == 0 || name.length >= MAX_LEN_CITYNAME - 6
						    || encodeURIComponent(name).length  >= MAX_LEN_CITYNAME - 6) {
						  swal("City name is invalid. Please try a different shorter name.");
						  return;
						}

                        const actor_unit: any = game_find_unit_by_number(unit_id);
                        request_unit_do_action(ACTION_FOUND_CITY,
                          unit_id, actor_unit['tile'], 0,
                          encodeURIComponent(name));
						$("#city_name_dialog").remove();
						// (window as any).keyboard_input=true; // This is a global variable, not a local one.
                        act_sel_queue_done(unit_id);
					}
					}
				]
		});

  $("#city_name_req").attr('maxlength', MAX_LEN_NAME);

  $("#city_name_dialog").dialog('open');

  $('#city_name_dialog').keyup(function(e: any) {
    if (e.keyCode == 13) {
      const name: string = $("#city_name_req").val();
      const actor_unit: any = game_find_unit_by_number(unit_id);
      request_unit_do_action(ACTION_FOUND_CITY,
        unit_id, actor_unit['tile'], 0, encodeURIComponent(name));
	  $("#city_name_dialog").remove();
      // (window as any).keyboard_input=true; // This is a global variable, not a local one.
      act_sel_queue_done(unit_id);
    }
  });

  blur_input_on_touchdevice();
  // (window as any).keyboard_input=false; // This is a global variable, not a local one.

}

export function next_city(): void {
  if (!clientPlaying()) return;

  city_screen_updater.fireNow();

  let next_row: any = $('#cities_list_' + active_city['id']).next();
  if (next_row.length === 0) {
    // Either the city is not in the list anymore or it was the last item.
    // Anyway, go to the beginning
    next_row = $('#city_table tbody tr').first();
  }
  if (next_row.length > 0) {
    // If there's a city
    show_city_dialog(cities[next_row.attr('id').substr(12)]);
  }
}

export function previous_city(): void {
  if (!clientPlaying()) return;

  city_screen_updater.fireNow();

  let prev_row: any = $('#cities_list_' + active_city['id']).prev();
  if (prev_row.length === 0) {
    // Either the city is not in the list anymore or it was the last item.
    // Anyway, go to the end
    prev_row = $('#city_table tbody tr').last();
  }
  if (prev_row.length > 0) {
    // If there's a city
    show_city_dialog(cities[prev_row.attr('id').substr(12)]);
  }
}

export function city_sell_improvement(improvement_id: number): void {
  if (clientIsObserver()) return;
  if ('confirm' in window) {
    const agree: boolean = confirm("Are you sure you want to sell this building?");
    if (agree) {
      const packet: any = {"pid" : packet_city_sell, "city_id" : active_city['id'],
                  "build_id": improvement_id};
      sendRequest(JSON.stringify(packet));
    }
  } else {
    const packet: any = {"pid" : packet_city_sell, "city_id" : active_city['id'],
                "build_id": improvement_id};
    sendRequest(JSON.stringify(packet));
  }
}

export function city_change_specialist(city_id: number, from_specialist_id: number): void {
  if (clientIsObserver()) return;
  const city_message: any = {"pid": packet_city_change_specialist,
                      "city_id" : city_id,
                      "from" : from_specialist_id,
                      "to" : (from_specialist_id + 1) % 3};
  sendRequest(JSON.stringify(city_message));
}

export function rename_city(): void {
  if (clientIsObserver() || active_city == null) return;

  // reset dialog page.
  $("#city_name_dialog").remove();
  $("<div id='city_name_dialog'></div>").appendTo("div#game_page");

  $("#city_name_dialog").html($("<div>What should we call this city?</div>"
                                + "<input id='city_name_req' type='text'>"));
  /* The city name can contain an apostrophe ("'"). That character is also
   * used for single quotes. It shouldn't be added unescaped to a
   * string that later is interpreted as HTML. */
  $("#city_name_req").attr("value", active_city['name']);
  $("#city_name_dialog").attr("title", "Rename City");
  $("#city_name_dialog").dialog({
			bgiframe: true,
			modal: true,
			width: "300",
			close: function() {
				// (window as any).keyboard_input=true; // This is a global variable, not a local one.
			},
			buttons: [	{
					text: "Cancel",
				        click: function() {
						$("#city_name_dialog").remove();
        					// (window as any).keyboard_input=true; // This is a global variable, not a local one.
					}
				},{
					text: "Ok",
				        click: function() {
						const name: string = $("#city_name_req").val();
						if (name.length == 0 || name.length >= MAX_LEN_NAME - 4
						    || encodeURIComponent(name).length  >= MAX_LEN_NAME - 4) {
						  swal("City name is invalid");
						  return;
						}

						const packet: any = {"pid" : packet_city_rename, "name" : encodeURIComponent(name), "city_id" : active_city['id'] };
						sendRequest(JSON.stringify(packet));
						$("#city_name_dialog").remove();
						// (window as any).keyboard_input=true; // This is a global variable, not a local one.
					}
					}
				]
		});
  $("#city_name_req").attr('maxlength', MAX_LEN_NAME);

  $("#city_name_dialog").dialog('open');

  $('#city_name_dialog').keyup(function(e: any) {
    if (e.keyCode == 13) {
      const name: string = $("#city_name_req").val();
      const packet: any = {"pid" : packet_city_rename, "name" : encodeURIComponent(name), "city_id" : active_city['id'] };
      sendRequest(JSON.stringify(packet));
      $("#city_name_dialog").remove();
      // (window as any).keyboard_input=true; // This is a global variable, not a local one.
    }
  });
}

export function update_city_screen(): void {
  if (store.observing) return;

  const sortList: number[][] = [];
  document.querySelectorAll('#city_table thead th').forEach((th: Element) => {
    const el = th as HTMLElement;
    if (el.classList.contains('tablesorter-headerAsc')) sortList.push([(el as HTMLTableCellElement).cellIndex, 0]);
    else if (el.classList.contains('tablesorter-headerDesc')) sortList.push([(el as HTMLTableCellElement).cellIndex, 1]);
  });

  let city_list_html: string = "<table class='tablesorter' id='city_table' border=0 cellspacing=0>"
        + "<thead><tr><th>Name</th><th>Population</th><th>Size</th><th>State</th>"
        + "<th>Granary</th><th>Grows In</th><th>Producing</th>"
        + "<th>Surplus<br>Food/Prod/Trade</th><th>Economy<br>Gold/Luxury/Science</th></tr></thead><tbody>";
  let count: number = 0;
  for (const city_id in cities){
    const pcity: any = cities[city_id];
    if (clientPlaying() != null && cityOwner(pcity) != null && cityOwner(pcity).playerno == clientPlaying().playerno) {
      count++;
      const prod_type: any = get_city_production_type(pcity);
      let turns_to_complete_str: string;
      if (get_city_production_time(pcity) == FC_INFINITY) {
        turns_to_complete_str = "-"; //client does not know how long production will take yet.
      } else {
        turns_to_complete_str = get_city_production_time(pcity) + " turns";
      }

      city_list_html += "<tr class='cities_row' id='cities_list_" + pcity['id'] + "' onclick='javascript:show_city_dialog_by_id(" + pcity['id'] + ");'><td>"
              + pcity['name'] + "</td><td>" + numberWithCommas(city_population(pcity)*1000) +
              "</td><td>" + pcity['size'] + "</td><td>" + get_city_state(pcity) + "</td><td>" + pcity['food_stock'] + "/" + pcity['granary_size'] +
              "</td><td>" + city_turns_to_growth_text(pcity) + "</td>" +
              "<td>" + prod_type['name'] + " (" + turns_to_complete_str + ")" +
              "</td><td>" + pcity['surplus'][O_FOOD] + "/" + pcity['surplus'][O_SHIELD] + "/" + pcity['surplus'][O_TRADE] + "</td>" +
              "<td>" + pcity['prod'][O_GOLD] + "/" + pcity['prod'][O_LUXURY] + "/" + pcity['prod'][O_SCIENCE] + "<td>";

      city_list_html += "</tr>";
    }
  }

  city_list_html += "</tbody></table>";
  $("#cities_list").html(city_list_html);

  if (count == 0) {
    $("#city_table").html("You have no cities. Build new cities with the Settlers unit.");
  }

  $('#cities_scroll').css("height", $(window).height() - 200);

  initTableSort('#city_table', { sortList: sortList });
}

export function get_city_state(pcity: any): string | undefined {
  if (pcity == null) return;

  if (pcity['was_happy'] && pcity['size'] >= 3) {
    return "Celebrating";
  } else if (pcity['unhappy']) {
    return "Disorder";
  } else {
    return "Peace";
  }
}

export function city_keyboard_listener(ev: any): void {
  // Check if focus is in chat field, where these keyboard events are ignored.
  if ($('input:focus').length > 0 || !keyboard_input) return;

  if (C_S_RUNNING != client_state()) return;

  if (!ev) ev = window.event;
  const keyboard_key: string = String.fromCharCode(ev.keyCode);

  if (active_city != null) {
     switch (keyboard_key) {
       case 'N':
         next_city();
         ev.stopPropagation();
         break;

       case 'B':
         request_city_buy();
         ev.stopPropagation();
         break;
      }
  }
}

export function set_citydlg_dimensions(pcity: any): void {
  const city_radius: number = pcity.city_radius_sq;

  const radius_tiles: number = Math.ceil(Math.sqrt(city_radius));

  set_citydlg_map_width(tileset_width + radius_tiles * tileset_width);
  set_citydlg_map_height(tileset_height + radius_tiles * tileset_height);

  $("#city_canvas_div").css({"width":citydlg_map_width, "height":citydlg_map_height});
  $("#city_canvas").attr('width', citydlg_map_width);
  $("#city_canvas").attr('height', citydlg_map_height);
}

// Dummy functions for external references that are not part of the provided JS
function show_city_traderoutes(): void {}
function get_specialist_image_sprite(key: string): any {}
function city_mapview_mouse_click(): void {}
function show_city_governor_tab(): void {}
function show_dialog_message(title: string, message: string): void {}
function city_dialog_activate_unit(unit: any): void {}
