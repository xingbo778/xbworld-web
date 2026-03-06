import { store } from '../data/store';
import { canCityBuildNow, generateProductionList, getCityProductionTypeSprite as get_city_production_type_sprite, getCityProductionTime as get_city_production_time } from '../data/city';
import { VUT_UTYPE, VUT_IMPROVEMENT, FC_INFINITY } from '../data/fcTypes';
import { get_improvement_image_sprite } from '../renderer/tilespec';
import { clientIsObserver } from '../client/clientState';
import { send_request as sendRequest } from '../net/connection';
import { packet_city_worklist } from '../net/packetConstants';
import { isSmallScreen as is_small_screen, isTouchDevice as is_touch_device } from '../utils/helpers';
import {
  cities, active_city, worklist_dialog_active, production_selection, worklist_selection,
  city_prod_clicks, opt_show_unreachable_items, MAX_LEN_WORKLIST,
  set_worklist_dialog_active, set_production_selection, set_worklist_selection,
  set_city_prod_clicks, set_opt_show_unreachable_items
} from './cityDialogState';
import { send_city_change } from './cityDialog';

declare const $: any;

// Dummy function for external reference
function get_unit_type_image_sprite(unit_type: any): any {}

export function city_worklist_dialog(pcity: any): void {
  if (pcity == null) return;
  const universals_list: any[] = [];
  let kind: any;
  let value: any;

  if (pcity['worklist'] != null && pcity['worklist'].length != 0) {
    const work_list: any[] = pcity['worklist'];
    for (let i = 0; i < work_list.length; i++) {
      const work_item: any = work_list[i];
      kind = work_item['kind'];
      value = work_item['value'];
      if (kind == null || value == null || work_item.length == 0) continue;
      if (kind == VUT_IMPROVEMENT) {
        const pimpr: any = store.improvements[value];
	let build_cost: any = pimpr['build_cost'];
	if (pimpr['name'] == "Coinage") build_cost = "-";
	universals_list.push({"name" : pimpr['name'],
		"kind" : kind,
		"value" : value,
		"helptext" : pimpr['helptext'],
		"build_cost" : build_cost,
		"sprite" : get_improvement_image_sprite(pimpr)});
      } else if (kind == VUT_UTYPE) {
        const putype: any = store.unitTypes[value];
        universals_list.push({"name" : putype['name'],
		"kind" : kind,
		"value" : value,
		"helptext" : putype['helptext'],
		"build_cost" : putype['build_cost'],
		"sprite" : get_unit_type_image_sprite(putype)});
      } else {
        console.log("unknown kind: " + kind);
      }
    }
  }

  let worklist_html: string = "<table class='worklist_table'><tr><td>Type</td><td>Name</td><td>Cost</td></tr>";
  for (let j = 0; j < universals_list.length; j++) {
    const universal: any = universals_list[j];
    const sprite: any = universal['sprite'];
    if (sprite == null) {
      console.log("Missing sprite for " + universal['name']);
      continue;
    }

    worklist_html += "<tr class='prod_choice_list_item"
     + (canCityBuildNow(pcity, universal['kind'], universal['value']) ?
        "" : " cannot_build_item")
     + "' data-wlitem='" + j + "' "
     + " title=\"" + universal['helptext'] + "\">"
     + "<td><div class='production_list_item_sub' style=' background: transparent url("
           + sprite['image-src'] +
           ");background-position:-" + sprite['tileset-x'] + "px -" + sprite['tileset-y']
           + "px;  width: " + sprite['width'] + "px;height: " + sprite['height'] + "px;'"
           +"></div></td>"
     + "<td class='prod_choice_name'>" + universal['name'] + "</td>"
     + "<td class='prod_choice_cost'>" + universal['build_cost'] + "</td></tr>";
  }
  worklist_html += "</table>";
  $("#city_current_worklist").html(worklist_html);

  populate_worklist_production_choices(pcity);

  $('#show_unreachable_items').off('click');
  $('#show_unreachable_items').click(function() {
    set_opt_show_unreachable_items(!opt_show_unreachable_items);
    $('#show_unreachable_items').prop('checked', opt_show_unreachable_items);
    // TODO: properly update the selection only when needed,
    //       instead of always emptying it.
    if (production_selection.length !== 0) {
      set_production_selection([]);
      update_worklist_actions();
    }
    populate_worklist_production_choices(pcity);
  });
  $('#show_unreachable_items').prop('checked', opt_show_unreachable_items);

  set_worklist_dialog_active(true);
  const turns_to_complete: any = get_city_production_time(pcity);
  const prod_type: any = get_city_production_type_sprite(pcity);
  let prod_img_html: string = "";
  if (prod_type != null) {
    const sprite: any = prod_type['sprite'];
    prod_img_html = "<div style='background: transparent url("
           + sprite['image-src']
           + ");background-position:-" + sprite['tileset-x'] + "px -" + sprite['tileset-y']
           + "px;  width: " + sprite['width'] + "px;height: " + sprite['height'] + "px;float: left; '>"
           +"</div>";
  }

  let headline: string = prod_img_html + "<div id='prod_descr'>"
    + (is_small_screen() ? " " : " Production: ")
    + (prod_type != null ? prod_type['type']['name'] : "None");

  if (turns_to_complete != FC_INFINITY) {
    headline += ", turns: " + turns_to_complete;
  }

  $("#worklist_dialog_headline").html(headline + "</div>");

  $(".production_list_item_sub").tooltip();

  if (is_touch_device()) {
    $("#prod_buttons").html("<x-small>Click to change production, next clicks will add to worklist on mobile.</x-small>");
  }

  $(".button").button();

  const tab_h: number = $("#city_production_tab").height();
  $("#city_current_worklist").height(tab_h - 150);
  $("#worklist_production_choices").height(tab_h - 121);
  /* TODO: remove all hacky sizing and positioning */
  /* It would have been nice to use $("#city_current_worklist").position().top
     for worklist_control padding-top, but that's 0 on first run.
     73 is also wrong, as it depends on text size. */
  if (tab_h > 250) {
    $("#worklist_control").height(tab_h - 148).css("padding-top", 73);
  } else {
    $("#worklist_control").height(tab_h - 77);
  }

  const worklist_items: any = $("#city_current_worklist .prod_choice_list_item");
  const max_selection: number = Math.min(MAX_LEN_WORKLIST, worklist_items.length);
  for (let k = 0; k < worklist_selection.length; k++) {
    if (worklist_selection[k] >= max_selection) {
      worklist_selection.splice(k, worklist_selection.length - k);
      break;
    }
    worklist_items.eq(worklist_selection[k]).addClass("ui-selected");
  }

  if (!is_touch_device()) {
    $("#city_current_worklist .worklist_table").selectable({
       filter: "tr",
       selected: handle_current_worklist_select,
       unselected: handle_current_worklist_unselect
    });
  } else {
    worklist_items.click(handle_current_worklist_click);
  }

  worklist_items.dblclick(handle_current_worklist_direct_remove);

  update_worklist_actions();
}

export function populate_worklist_production_choices(pcity: any): void {
  const production_list: any[] = generateProductionList();
  let production_html: string = "<table class='worklist_table'><tr><td>Type</td><td>Name</td><td title='Attack/Defense/Firepower'>Info</td><td>Cost</td></tr>";
  for (let a = 0; a < production_list.length; a++) {
    const sprite: any = production_list[a]['sprite'];
    if (sprite == null) {
      console.log("Missing sprite for " + production_list[a]['value']);
      continue;
    }
    const kind: any = production_list[a]['kind'];
    const value: any = production_list[a]['value'];
    const can_build: boolean = canCityBuildNow(pcity, kind, value);

    if (can_build || opt_show_unreachable_items) {
      production_html += "<tr class='prod_choice_list_item kindvalue_item"
       + (can_build ? "" : " cannot_build_item")
       + "' data-value='" + value + "' data-kind='" + kind + "'>"
       + "<td><div class='production_list_item_sub' title=\"" + production_list[a]['helptext'] + "\" style=' background: transparent url("
           + sprite['image-src'] +
           ");background-position:-" + sprite['tileset-x'] + "px -" + sprite['tileset-y']
           + "px;  width: " + sprite['width'] + "px;height: " + sprite['height'] + "px;'"
           +"></div></td>"
       + "<td class='prod_choice_name'>" + production_list[a]['text'] + "</td>"
       + "<td class='prod_choice_name'>" + production_list[a]['unit_details'] + "</td>"
       + "<td class='prod_choice_cost'>" + production_list[a]['build_cost'] + "</td></tr>";
     }
  }
  production_html += "</table>";

  $("#worklist_production_choices").html(production_html);
  $("#worklist_production_choices .production_list_item_sub").tooltip();

  if (!is_touch_device()) {
    $("#worklist_production_choices .worklist_table").selectable({
       filter: "tr",
       selected: handle_worklist_select,
       unselected: handle_worklist_unselect
    });

    if (production_selection.length > 0) {
      const prod_items: any = $("#worklist_production_choices .kindvalue_item");
      const sel: string[] = [];
      production_selection.forEach(function (v: any) {
        sel.push("[data-value='" + v.value + "']" +
                 "[data-kind='"  + v.kind  + "']");
      });
      prod_items.filter(sel.join(",")).addClass("ui-selected");
    }

    $(".kindvalue_item").dblclick(function(this: any) {
      const value: number = parseFloat($(this).data('value'));
      const kind: number = parseFloat($(this).data('kind'));
      send_city_worklist_add(pcity['id'], kind, value);
    });
  } else {
    $(".kindvalue_item").click(function(this: any) {
      const value: number = parseFloat($(this).data('value'));
      const kind: number = parseFloat($(this).data('kind'));
      if (city_prod_clicks == 0) {
        send_city_change(pcity['id'], kind, value);
      } else {
        send_city_worklist_add(pcity['id'], kind, value);
      }
      set_city_prod_clicks(city_prod_clicks + 1);

    });
  }
}

export function extract_universal(element: any): any {
  return {
    value: parseFloat($(element).data("value")),
    kind:  parseFloat($(element).data("kind"))
  };
}

export function find_universal_in_worklist(universal: any, worklist: any[]): number {
  for (let i = 0; i < worklist.length; i++) {
    if (worklist[i].kind === universal.kind &&
        worklist[i].value === universal.value) {
      return i;
    }
  }
  return -1;
}

export function handle_worklist_select(event: any, ui: any): void {
  const selected: any = extract_universal(ui.selected);
  const idx: number = find_universal_in_worklist(selected, production_selection);
  if (idx < 0) {
    production_selection.push(selected);
    update_worklist_actions();
  }
}

export function handle_worklist_unselect(event: any, ui: any): void {
  const selected: any = extract_universal(ui.unselected);
  const idx: number = find_universal_in_worklist(selected, production_selection);
  if (idx >= 0) {
    production_selection.splice(idx, 1);
    update_worklist_actions();
  }
}

export function handle_current_worklist_select(event: any, ui: any): void {
  const idx: number = parseInt($(ui.selected).data('wlitem'), 10);
  let i: number = worklist_selection.length - 1;
  while (i >= 0 && worklist_selection[i] > idx)
    i--;
  if (i < 0 || worklist_selection[i] < idx) {
    worklist_selection.splice(i + 1, 0, idx);
    update_worklist_actions();
  }
}

export function handle_current_worklist_unselect(event: any, ui: any): void {
  const idx: number = parseInt($(ui.unselected).data('wlitem'), 10);
  let i: number = worklist_selection.length - 1;
  while (i >= 0 && worklist_selection[i] > idx)
    i--;
  if (i >= 0 && worklist_selection[i] === idx) {
    worklist_selection.splice(i, 1);
    update_worklist_actions();
  }
}

export function handle_current_worklist_click(this: any, event: any): void {
  event.stopPropagation();

  const element: any = $(this);
  const item: number = parseInt(element.data('wlitem'), 10);

  if (worklist_selection.length === 1 && worklist_selection[0] === item) {
     element.removeClass('ui-selected');
     set_worklist_selection([]);
  } else {
     element.siblings().removeClass('ui-selected');
     element.addClass('ui-selected');
     set_worklist_selection([item]);
  }

  update_worklist_actions();
}

export function update_worklist_actions(): void {
  if (worklist_selection.length > 0) {
    $("#city_worklist_up_btn").button("enable");
    $("#city_worklist_remove_btn").button("enable");

    if (worklist_selection[worklist_selection.length - 1] ===
        active_city['worklist'].length - 1) {
      $("#city_worklist_down_btn").button("disable");
    } else {
      $("#city_worklist_down_btn").button("enable");
    }

  } else {
    $("#city_worklist_up_btn").button("disable");
    $("#city_worklist_down_btn").button("disable");
    $("#city_worklist_exchange_btn").button("disable");
    $("#city_worklist_remove_btn").button("disable");
  }

  if (production_selection.length > 0) {
    $("#city_add_to_worklist_btn").button("enable");
    $("#city_worklist_insert_btn").button("enable");

    if (production_selection.length == worklist_selection.length ||
        worklist_selection.length == 1) {
      $("#city_worklist_exchange_btn").button("enable");
    } else {
      $("#city_worklist_exchange_btn").button("disable");
    }

  } else {
    $("#city_add_to_worklist_btn").button("disable");
    $("#city_worklist_insert_btn").button("disable");
    $("#city_worklist_exchange_btn").button("disable");
  }

  if (production_selection.length === 1) {
    $("#city_change_production_btn").button("enable");
  } else {
    $("#city_change_production_btn").button("disable");
  }
}

export function send_city_worklist(city_id: number): void {
  const worklist: any[] = cities[city_id]['worklist'];
  const overflow: number = worklist.length - MAX_LEN_WORKLIST;
  if (overflow > 0) {
    worklist.splice(MAX_LEN_WORKLIST, overflow);
  }

  sendRequest(JSON.stringify({pid     : packet_city_worklist,
                               city_id : city_id,
                               worklist: worklist}));
}

export function send_city_worklist_add(city_id: number, kind: any, value: any): void {
  const pcity: any = cities[city_id];
  if (pcity['worklist'].length >= MAX_LEN_WORKLIST) {
    return;
  }

  pcity['worklist'].push({"kind" : kind, "value" : value});

  send_city_worklist(city_id);
}

export function city_change_production(): void {
  if (clientIsObserver()) return;
  if (production_selection.length === 1) {
    send_city_change(active_city['id'], production_selection[0].kind,
                     production_selection[0].value);
  }
}

export function city_add_to_worklist(): void {
  if (production_selection.length > 0) {
    active_city['worklist'] = active_city['worklist'].concat(production_selection);
    send_city_worklist(active_city['id']);
  }
}

export function handle_current_worklist_direct_remove(this: any): void {
  const idx: number = parseInt($(this).data('wlitem'), 10);
  active_city['worklist'].splice(idx, 1);

  // User may dblclick a task while having other selected
  let i: number = worklist_selection.length - 1;
  while (i >= 0 && worklist_selection[i] > idx) {
    worklist_selection[i]--;
    i--;
  }
  if (i >= 0 && worklist_selection[i] === idx) {
    worklist_selection.splice(i, 1);
  }

  send_city_worklist(active_city['id']);
}

export function city_insert_in_worklist(): void {
  const count: number = Math.min(production_selection.length, MAX_LEN_WORKLIST);
  if (count === 0) return;

  let i: number;
  const wl: any[] = active_city['worklist'];

  if (worklist_selection.length === 0) {

    wl.splice(...[0, 0].concat(production_selection) as [number, number, ...any[]]);

    // Initialize the selection with the inserted items
    for (i = 0; i < count; i++) {
      worklist_selection.push(i);
    }

  } else {

    wl.splice(...[worklist_selection[0], 0].concat(production_selection) as [number, number, ...any[]]);

    for (i = 0; i < worklist_selection.length; i++) {
      worklist_selection[i] += count;
    }
  }

  send_city_worklist(active_city['id']);
}

export function city_worklist_task_up(): void {
  let count: number = worklist_selection.length;
  if (count === 0) return;

  let swap: any;
  const wl: any[] = active_city['worklist'];

  if (worklist_selection[0] === 0) {
    worklist_selection.shift();
    if (wl[0].kind !== active_city['production_kind'] ||
        wl[0].value !== active_city['production_value']) {
      swap = wl[0];
      wl[0] = {
        kind : active_city['production_kind'],
        value: active_city['production_value']
      };

      send_city_change(active_city['id'], swap.kind, swap.value);
    }
    count--;
  }

  for (let i = 0; i < count; i++) {
    const task_idx: number = worklist_selection[i];
    swap = wl[task_idx - 1];
    wl[task_idx - 1] = wl[task_idx];
    wl[task_idx] = swap;
    worklist_selection[i]--;
  }

  send_city_worklist(active_city['id']);
}

export function city_worklist_task_down(): void {
  let count: number = worklist_selection.length;
  if (count === 0) return;

  let swap: any;
  const wl: any[] = active_city['worklist'];

  if (worklist_selection[--count] === wl.length - 1) return;

  while (count >= 0) {
    const task_idx: number = worklist_selection[count];
    swap = wl[task_idx + 1];
    wl[task_idx + 1] = wl[task_idx];
    wl[task_idx] = swap;
    worklist_selection[count]++;
    count--;
  }

  send_city_worklist(active_city['id']);
}

export function city_exchange_worklist_task(): void {
  let prod_l: number = production_selection.length;
  if (prod_l === 0) return;

  let i: number;
  let same: boolean = true;
  const wl: any[] = active_city['worklist'];
  const task_l: number = worklist_selection.length;
  if (prod_l === task_l) {
    for (i = 0; i < prod_l; i++) {
      if (same &&
          (wl[worklist_selection[i]].kind !== production_selection[i].kind ||
           wl[worklist_selection[i]].value !== production_selection[i].value)) {
        same = false;
      }
      wl[worklist_selection[i]] = production_selection[i];
    }
  } else if (task_l === 1) {
    i = worklist_selection[0];
    wl.splice(...[i, 1].concat(production_selection) as [number, number, ...any[]]);
    same = false;
    while (--prod_l) {
      worklist_selection.push(++i);
    }
  }

  if (!same) {
    send_city_worklist(active_city['id']);
  }
}

export function city_worklist_task_remove(): void {
  let count: number = worklist_selection.length;
  if (count === 0) return;

  const wl: any[] = active_city['worklist'];

  while (--count >= 0) {
    wl.splice(worklist_selection[count], 1);
  }
  set_worklist_selection([]);

  send_city_worklist(active_city['id']);
}
