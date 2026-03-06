import { setHtml as domSetHtml } from '../utils/dom';
import { store } from '../data/store';
import { canCityBuildNow, generateProductionList, getCityProductionTypeSprite as get_city_production_type_sprite, getCityProductionTime as get_city_production_time } from '../data/city';
import type { ProductionItem } from '../data/city';
import { VUT_UTYPE, VUT_IMPROVEMENT, FC_INFINITY } from '../data/fcTypes';
import { get_improvement_image_sprite, get_unit_type_image_sprite } from '../renderer/tilespec';
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
import type { City, Improvement, UnitType } from '../data/types';
import type { SpriteInfo } from '../renderer/spriteGetters';

/** An entry in a city's worklist (kind + value). */
interface WorklistEntry {
  kind: number;
  value: number;
  [key: string]: unknown;
}

/** A worklist item with display information. */
interface WorklistItem {
  name: string;
  kind: number;
  value: number;
  helptext: unknown;
  build_cost: number | string;
  sprite: SpriteInfo | null;
}

function ac(): City | null { return active_city; }
function byId(id: string): HTMLElement | null { return document.getElementById(id); }
function setHtml(id: string, html: string): void { const el = byId(id); if (el) domSetHtml(el, html); }
function setHeight(id: string, px: number): void { const el = byId(id); if (el) el.style.height = px + 'px'; }
function setBtnEnabled(id: string, enabled: boolean): void {
  const el = byId(id) as HTMLButtonElement | null;
  if (el) el.disabled = !enabled;
}

export function city_worklist_dialog(pcity: City): void {
  if (pcity == null) return;
  const universals_list: WorklistItem[] = [];
  let kind: number;
  let value: number;

  if (pcity['worklist'] != null && (pcity['worklist'] as WorklistEntry[]).length != 0) {
    const work_list: WorklistEntry[] = pcity['worklist'] as WorklistEntry[];
    for (let i = 0; i < work_list.length; i++) {
      const work_item: WorklistEntry = work_list[i];
      kind = work_item['kind'];
      value = work_item['value'];
      if (kind == null || value == null) continue;
      if (kind == VUT_IMPROVEMENT) {
        const pimpr: Improvement = store.improvements[value];
	let build_cost: number | string = pimpr['build_cost'];
	if (pimpr['name'] == "Coinage") build_cost = "-";
	universals_list.push({"name" : pimpr['name'],
		"kind" : kind,
		"value" : value,
		"helptext" : pimpr['helptext'],
		"build_cost" : build_cost,
		"sprite" : get_improvement_image_sprite(pimpr)});
      } else if (kind == VUT_UTYPE) {
        const putype: UnitType = store.unitTypes[value];
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
    const universal: WorklistItem = universals_list[j];
    const sprite: SpriteInfo | null = universal['sprite'];
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
  setHtml("city_current_worklist", worklist_html);

  populate_worklist_production_choices(pcity);

  const showUnreachable = byId('show_unreachable_items') as HTMLInputElement | null;
  if (showUnreachable) {
    const newEl = showUnreachable.cloneNode(true) as HTMLInputElement;
    showUnreachable.parentNode?.replaceChild(newEl, showUnreachable);
    newEl.addEventListener('click', function() {
      set_opt_show_unreachable_items(!opt_show_unreachable_items);
      newEl.checked = opt_show_unreachable_items;
      if (production_selection.length !== 0) {
        set_production_selection([]);
        update_worklist_actions();
      }
      populate_worklist_production_choices(pcity);
    });
    newEl.checked = opt_show_unreachable_items;
  }

  set_worklist_dialog_active(true);
  const turns_to_complete: number = get_city_production_time(pcity);
  const prod_type: { type: UnitType | Improvement; sprite: unknown } | null = get_city_production_type_sprite(pcity);
  let prod_img_html: string = "";
  if (prod_type != null) {
    const sprite = prod_type['sprite'] as SpriteInfo;
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

  setHtml("worklist_dialog_headline", headline + "</div>");

  // tooltip() was jQuery UI no-op; native title attribute already set

  if (is_touch_device()) {
    setHtml("prod_buttons", "<x-small>Click to change production, next clicks will add to worklist on mobile.</x-small>");
  }

  // $(".button").button() was jQuery UI no-op

  const tabEl = byId('city_production_tab');
  const tab_h: number = tabEl ? tabEl.offsetHeight : 400;
  setHeight("city_current_worklist", tab_h - 150);
  setHeight("worklist_production_choices", tab_h - 121);
  /* TODO: remove all hacky sizing and positioning */
  const wlControl = byId('worklist_control');
  if (wlControl) {
    if (tab_h > 250) {
      wlControl.style.height = (tab_h - 148) + 'px';
      wlControl.style.paddingTop = '73px';
    } else {
      wlControl.style.height = (tab_h - 77) + 'px';
    }
  }

  const worklistContainer = byId('city_current_worklist');
  const worklist_items = worklistContainer
    ? Array.from(worklistContainer.querySelectorAll('.prod_choice_list_item')) as HTMLElement[]
    : [];
  const max_selection: number = Math.min(MAX_LEN_WORKLIST, worklist_items.length);
  for (let k = 0; k < worklist_selection.length; k++) {
    if (worklist_selection[k] >= max_selection) {
      worklist_selection.splice(k, worklist_selection.length - k);
      break;
    }
    worklist_items[worklist_selection[k]]?.classList.add("ui-selected");
  }

  if (!is_touch_device()) {
    // Replace jQuery UI selectable with click-based selection
    worklist_items.forEach(item => {
      item.addEventListener('click', function(e) {
        if (e.ctrlKey || e.metaKey) {
          // Toggle selection
          if (item.classList.contains('ui-selected')) {
            item.classList.remove('ui-selected');
            handle_current_worklist_unselect(e, { unselected: item });
          } else {
            item.classList.add('ui-selected');
            handle_current_worklist_select(e, { selected: item });
          }
        } else {
          // Single select
          worklist_items.forEach(el => el.classList.remove('ui-selected'));
          item.classList.add('ui-selected');
          set_worklist_selection([]);
          handle_current_worklist_select(e, { selected: item });
        }
      });
    });
  } else {
    worklist_items.forEach(item => {
      item.addEventListener('click', handle_current_worklist_click.bind(item));
    });
  }

  worklist_items.forEach(item => {
    item.addEventListener('dblclick', handle_current_worklist_direct_remove.bind(item));
  });

  update_worklist_actions();
}

export function populate_worklist_production_choices(pcity: City): void {
  const production_list: ProductionItem[] = generateProductionList();
  let production_html: string = "<table class='worklist_table'><tr><td>Type</td><td>Name</td><td title='Attack/Defense/Firepower'>Info</td><td>Cost</td></tr>";
  for (let a = 0; a < production_list.length; a++) {
    const sprite = production_list[a]['sprite'] as SpriteInfo | null;
    if (sprite == null) {
      console.log("Missing sprite for " + production_list[a]['value']);
      continue;
    }
    const kind: number = production_list[a]['kind'];
    const value: number = production_list[a]['value'];
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

  setHtml("worklist_production_choices", production_html);
  // tooltip() no-op — native title attribute already set

  const choicesContainer = byId('worklist_production_choices');
  const kindValueItems = choicesContainer
    ? Array.from(choicesContainer.querySelectorAll('.kindvalue_item')) as HTMLElement[]
    : [];

  if (!is_touch_device()) {
    // Replace jQuery UI selectable with click-based selection
    kindValueItems.forEach(item => {
      item.addEventListener('click', function(e) {
        if (e.ctrlKey || e.metaKey) {
          if (item.classList.contains('ui-selected')) {
            item.classList.remove('ui-selected');
            handle_worklist_unselect(e, { unselected: item });
          } else {
            item.classList.add('ui-selected');
            handle_worklist_select(e, { selected: item });
          }
        } else {
          kindValueItems.forEach(el => el.classList.remove('ui-selected'));
          item.classList.add('ui-selected');
          set_production_selection([]);
          handle_worklist_select(e, { selected: item });
        }
      });
    });

    if (production_selection.length > 0) {
      production_selection.forEach(function (v: { kind: number; value: number }) {
        const match = choicesContainer?.querySelector(
          "[data-value='" + v.value + "'][data-kind='" + v.kind + "']"
        );
        match?.classList.add("ui-selected");
      });
    }

    kindValueItems.forEach(item => {
      item.addEventListener('dblclick', function() {
        const value = parseFloat(item.dataset.value || '0');
        const kind = parseFloat(item.dataset.kind || '0');
        send_city_worklist_add(pcity['id'], kind, value);
      });
    });
  } else {
    kindValueItems.forEach(item => {
      item.addEventListener('click', function() {
        const value = parseFloat(item.dataset.value || '0');
        const kind = parseFloat(item.dataset.kind || '0');
        if (city_prod_clicks == 0) {
          send_city_change(pcity['id'], kind, value);
        } else {
          send_city_worklist_add(pcity['id'], kind, value);
        }
        set_city_prod_clicks(city_prod_clicks + 1);
      });
    });
  }
}

export function extract_universal(element: HTMLElement): WorklistEntry {
  const el = element as HTMLElement;
  return {
    value: parseFloat(el.dataset.value || el.getAttribute('data-value') || '0'),
    kind:  parseFloat(el.dataset.kind || el.getAttribute('data-kind') || '0')
  };
}

export function find_universal_in_worklist(universal: WorklistEntry, worklist: WorklistEntry[]): number {
  for (let i = 0; i < worklist.length; i++) {
    if (worklist[i].kind === universal.kind &&
        worklist[i].value === universal.value) {
      return i;
    }
  }
  return -1;
}

export function handle_worklist_select(event: Event, ui: { selected: HTMLElement }): void {
  const selected: WorklistEntry = extract_universal(ui.selected);
  const idx: number = find_universal_in_worklist(selected, production_selection);
  if (idx < 0) {
    production_selection.push(selected);
    update_worklist_actions();
  }
}

export function handle_worklist_unselect(event: Event, ui: { unselected: HTMLElement }): void {
  const selected: WorklistEntry = extract_universal(ui.unselected);
  const idx: number = find_universal_in_worklist(selected, production_selection);
  if (idx >= 0) {
    production_selection.splice(idx, 1);
    update_worklist_actions();
  }
}

export function handle_current_worklist_select(event: Event, ui: { selected: HTMLElement }): void {
  const idx: number = parseInt(ui.selected.dataset.wlitem || '0', 10);
  let i: number = worklist_selection.length - 1;
  while (i >= 0 && worklist_selection[i] > idx)
    i--;
  if (i < 0 || worklist_selection[i] < idx) {
    worklist_selection.splice(i + 1, 0, idx);
    update_worklist_actions();
  }
}

export function handle_current_worklist_unselect(event: Event, ui: { unselected: HTMLElement }): void {
  const idx: number = parseInt(ui.unselected.dataset.wlitem || '0', 10);
  let i: number = worklist_selection.length - 1;
  while (i >= 0 && worklist_selection[i] > idx)
    i--;
  if (i >= 0 && worklist_selection[i] === idx) {
    worklist_selection.splice(i, 1);
    update_worklist_actions();
  }
}

export function handle_current_worklist_click(this: HTMLElement, event: Event): void {
  event.stopPropagation();

  const element = this as HTMLElement;
  const item: number = parseInt(element.dataset.wlitem || '0', 10);

  if (worklist_selection.length === 1 && worklist_selection[0] === item) {
     element.classList.remove('ui-selected');
     set_worklist_selection([]);
  } else {
     // Remove ui-selected from siblings
     const parent = element.parentElement;
     if (parent) {
       parent.querySelectorAll('.ui-selected').forEach(el => el.classList.remove('ui-selected'));
     }
     element.classList.add('ui-selected');
     set_worklist_selection([item]);
  }

  update_worklist_actions();
}

export function update_worklist_actions(): void {
  if (worklist_selection.length > 0) {
    setBtnEnabled("city_worklist_up_btn", true);
    setBtnEnabled("city_worklist_remove_btn", true);

    if (worklist_selection[worklist_selection.length - 1] ===
        ((active_city as City)['worklist'] as WorklistEntry[]).length - 1) {
      setBtnEnabled("city_worklist_down_btn", false);
    } else {
      setBtnEnabled("city_worklist_down_btn", true);
    }

  } else {
    setBtnEnabled("city_worklist_up_btn", false);
    setBtnEnabled("city_worklist_down_btn", false);
    setBtnEnabled("city_worklist_exchange_btn", false);
    setBtnEnabled("city_worklist_remove_btn", false);
  }

  if (production_selection.length > 0) {
    setBtnEnabled("city_add_to_worklist_btn", true);
    setBtnEnabled("city_worklist_insert_btn", true);

    if (production_selection.length == worklist_selection.length ||
        worklist_selection.length == 1) {
      setBtnEnabled("city_worklist_exchange_btn", true);
    } else {
      setBtnEnabled("city_worklist_exchange_btn", false);
    }

  } else {
    setBtnEnabled("city_add_to_worklist_btn", false);
    setBtnEnabled("city_worklist_insert_btn", false);
    setBtnEnabled("city_worklist_exchange_btn", false);
  }

  if (production_selection.length === 1) {
    setBtnEnabled("city_change_production_btn", true);
  } else {
    setBtnEnabled("city_change_production_btn", false);
  }
}

export function send_city_worklist(city_id: number): void {
  const worklist: WorklistEntry[] = cities[city_id]['worklist'] as WorklistEntry[];
  const overflow: number = worklist.length - MAX_LEN_WORKLIST;
  if (overflow > 0) {
    worklist.splice(MAX_LEN_WORKLIST, overflow);
  }

  sendRequest(JSON.stringify({pid     : packet_city_worklist,
                               city_id : city_id,
                               worklist: worklist}));
}

export function send_city_worklist_add(city_id: number, kind: number, value: number): void {
  const pcity: City = cities[city_id];
  if ((pcity['worklist'] as WorklistEntry[]).length >= MAX_LEN_WORKLIST) {
    return;
  }

  (pcity['worklist'] as WorklistEntry[]).push({"kind" : kind, "value" : value});

  send_city_worklist(city_id);
}

export function city_change_production(): void {
  if (clientIsObserver()) return;
  if (production_selection.length === 1) {
    send_city_change(ac()!['id'], production_selection[0].kind,
                     production_selection[0].value);
  }
}

export function city_add_to_worklist(): void {
  if (production_selection.length > 0) {
    ac()!['worklist'] = (ac()!['worklist'] as WorklistEntry[]).concat(production_selection);
    send_city_worklist(ac()!['id']);
  }
}

export function handle_current_worklist_direct_remove(this: HTMLElement): void {
  const idx: number = parseInt((this as HTMLElement).dataset.wlitem || '0', 10);
  (ac()!['worklist'] as WorklistEntry[]).splice(idx, 1);

  // User may dblclick a task while having other selected
  let i: number = worklist_selection.length - 1;
  while (i >= 0 && worklist_selection[i] > idx) {
    worklist_selection[i]--;
    i--;
  }
  if (i >= 0 && worklist_selection[i] === idx) {
    worklist_selection.splice(i, 1);
  }

  send_city_worklist(ac()!['id']);
}

export function city_insert_in_worklist(): void {
  const count: number = Math.min(production_selection.length, MAX_LEN_WORKLIST);
  if (count === 0) return;

  let i: number;
  const wl: WorklistEntry[] = ac()!['worklist'] as WorklistEntry[];

  if (worklist_selection.length === 0) {

    wl.splice(0, 0, ...production_selection);

    // Initialize the selection with the inserted items
    for (i = 0; i < count; i++) {
      worklist_selection.push(i);
    }

  } else {

    wl.splice(worklist_selection[0], 0, ...production_selection);

    for (i = 0; i < worklist_selection.length; i++) {
      worklist_selection[i] += count;
    }
  }

  send_city_worklist(ac()!['id']);
}

export function city_worklist_task_up(): void {
  let count: number = worklist_selection.length;
  if (count === 0) return;

  let swap: WorklistEntry;
  const wl: WorklistEntry[] = ac()!['worklist'] as WorklistEntry[];

  if (worklist_selection[0] === 0) {
    worklist_selection.shift();
    if (wl[0].kind !== ac()!['production_kind'] ||
        wl[0].value !== ac()!['production_value']) {
      swap = wl[0];
      wl[0] = {
        kind : ac()!['production_kind'],
        value: ac()!['production_value']
      };

      send_city_change(ac()!['id'], swap.kind, swap.value);
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

  send_city_worklist(ac()!['id']);
}

export function city_worklist_task_down(): void {
  let count: number = worklist_selection.length;
  if (count === 0) return;

  let swap: WorklistEntry;
  const wl: WorklistEntry[] = ac()!['worklist'] as WorklistEntry[];

  if (worklist_selection[--count] === wl.length - 1) return;

  while (count >= 0) {
    const task_idx: number = worklist_selection[count];
    swap = wl[task_idx + 1];
    wl[task_idx + 1] = wl[task_idx];
    wl[task_idx] = swap;
    worklist_selection[count]++;
    count--;
  }

  send_city_worklist(ac()!['id']);
}

export function city_exchange_worklist_task(): void {
  let prod_l: number = production_selection.length;
  if (prod_l === 0) return;

  let i: number;
  let same: boolean = true;
  const wl: WorklistEntry[] = ac()!['worklist'] as WorklistEntry[];
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
    wl.splice(i, 1, ...production_selection);
    same = false;
    while (--prod_l) {
      worklist_selection.push(++i);
    }
  }

  if (!same) {
    send_city_worklist(ac()!['id']);
  }
}

export function city_worklist_task_remove(): void {
  let count: number = worklist_selection.length;
  if (count === 0) return;

  const wl: WorklistEntry[] = ac()!['worklist'] as WorklistEntry[];

  while (--count >= 0) {
    wl.splice(worklist_selection[count], 1);
  }
  set_worklist_selection([]);

  send_city_worklist(ac()!['id']);
}
