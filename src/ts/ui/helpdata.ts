/**********************************************************************
    Freeciv-web - the web version of Freeciv. https://www.freeciv.org/
    Copyright (C) 2009-2015  The Freeciv-web project

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

**********************************************************************/

import { setHtml as domSetHtml } from '../utils/dom';
import { is_wonder, get_improvement_requirements } from '../data/improvement';
import { unittype_ids_alphabetic } from '../data/unit';
import { U_NOT_OBSOLETED } from '../data/unittype';
import { get_unit_type_image_sprite, get_technology_image_sprite, get_improvement_image_sprite } from '../renderer/tilespec';
import type { SpriteInfo } from '../renderer/spriteGetters';
import { move_points_text } from '../data/unit';
import { ruledir_from_ruleset_name } from '../core/pregame';
import { get_advances_text } from './techDialog';
import { toTitleCase, stringUnqualify } from '../utils/helpers';
import { store } from '../data/store';
import type { Improvement, UnitType, Tech, Terrain, Government } from '../data/types';

function get_helpdata_order(): string[] { return (store as unknown as Record<string, unknown>)['helpdata_order'] as string[] || []; }
function get_helpdata(): Record<string, { text: string }> { return (store as unknown as Record<string, unknown>)['helpdata'] as Record<string, { text: string }> || {}; }
function get_freeciv_wiki_docs(): Record<string, unknown> { return (store as unknown as Record<string, unknown>)['freeciv_wiki_docs'] as Record<string, unknown> || {}; }

function byId(id: string): HTMLElement | null { return document.getElementById(id); }
function setHtml(id: string, html: string): void { const el = byId(id); if (el) domSetHtml(el, html); }
function appendLi(parentId: string, helptag: string, text: string): void {
  const li = document.createElement('li');
  li.dataset.helptag = helptag;
  li.textContent = text;
  byId(parentId)?.appendChild(li);
}

export const toplevel_menu_items: string[] = [
  "help_terrain",
  "help_economy",
  "help_cities",
  "help_city_improvements",
  "help_wonders_of_the_world",
  "help_units",
  "help_combat",
  "help_technology",
  "help_government",
];

export const hidden_menu_items: string[] = [
  "help_connecting",
  "help_languages",
  "help_governor",
  "help_chatline",
  "help_about",
  "help_worklist_editor",
];

/**************************************************************************
 Show the Freeciv-web Help Dialog
**************************************************************************/
export function show_help(): void {
  const tabsHel = byId('tabs-hel');
  if (tabsHel) tabsHel.style.display = '';
  byId('help_menu')?.remove();
  byId('help_info_page')?.remove();

  const menu = document.createElement('ul');
  menu.id = 'help_menu';
  const infoPage = document.createElement('div');
  infoPage.id = 'help_info_page';
  tabsHel?.appendChild(menu);
  tabsHel?.appendChild(infoPage);

  for (const sec_id in get_helpdata_order()) {
    const key: string = get_helpdata_order()[sec_id];
    if (hidden_menu_items.indexOf(key) > -1) {
      continue;
    } else if (key.indexOf("help_gen") !== -1) {
      generate_help_menu(key);
    } else if (toplevel_menu_items.indexOf(key) > -1) {
      generate_help_toplevel(key);
    } else {
      const parent_key: string = find_parent_help_key(key);
      const li = document.createElement('li');
      li.id = key;
      li.dataset.helptag = key;
      li.textContent = helpdata_tag_to_title(key);
      document.querySelector(parent_key)?.appendChild(li);
    }
  }

  // Make menu items clickable
  menu.addEventListener('click', function(ev) {
    const li = (ev.target as HTMLElement).closest('li[data-helptag]');
    if (li) {
      handle_help_menu_select_native(li as HTMLElement);
    }
  });

  show_help_intro();
  if (tabsHel) tabsHel.style.height = (window.innerHeight - 60) + 'px';
  const menuEl = byId('help_menu');
  const infoEl = byId('help_info_page');
  if (infoEl && menuEl) {
    infoEl.style.maxWidth = (window.innerWidth - menuEl.offsetWidth - 60) + 'px';
  }
}

/**************************************************************************
...
**************************************************************************/
export function show_help_intro(): void {
  fetch("/docs/help_intro.txt").then(r => r.text()).then(data => {
    setHtml('help_info_page', data);
  });
}

/**************************************************************************
...
**************************************************************************/
export function generate_help_menu(key: string): void {
  let impr_id: string;
  let improvement: Improvement;
  if (key === "help_gen_terrain") {
    for (const terrain_id in store.terrains) {
      const terrain = store.terrains[Number(terrain_id)];
      appendLi("help_terrain_ul", key + "_" + terrain["id"], terrain["name"]);
    }
  } else if (key === "help_gen_improvements") {
    for (impr_id in store.improvements) {
      improvement = store.improvements[Number(impr_id)];
      if (is_wonder(improvement)) continue;
      appendLi("help_city_improvements_ul", key + "_" + improvement["id"], improvement["name"]);
    }
  } else if (key === "help_gen_wonders") {
    for (impr_id in store.improvements) {
      improvement = store.improvements[Number(impr_id)];
      if (!is_wonder(improvement)) continue;
      appendLi("help_wonders_of_the_world_ul", key + "_" + improvement["id"], improvement["name"]);
    }
  } else if (key === "help_gen_units") {
    const unit_ids = unittype_ids_alphabetic();
    for (let i = 0; i < unit_ids.length; i++) {
      const unit_id = unit_ids[i];
      const punit_type: UnitType = store.unitTypes[Number(unit_id)];
      appendLi("help_units_ul", key + "_" + punit_type["id"], punit_type["name"]);
    }
  } else if (key === "help_gen_techs") {
    for (const tech_id in store.techs) {
      if (tech_id === "0") continue;
      const tech = store.techs[Number(tech_id)];
      appendLi("help_technology_ul", key + "_" + tech["id"], tech["name"]);
    }
  } else if (key === "help_gen_governments") {
    for (const gov_id in store.governments) {
      const pgov = store.governments[Number(gov_id)];
      appendLi("help_government_ul", key + "_" + pgov["id"], pgov["name"]);
    }
  } else if (key === "help_gen_ruleset") {
    const parent_key = find_parent_help_key(key);
    const li = document.createElement('li');
    li.id = key;
    li.dataset.helptag = key;
    li.textContent = "About Current Ruleset";
    document.querySelector(parent_key)?.appendChild(li);
  }
}

/**************************************************************************
...
**************************************************************************/
export function render_sprite(sprite: SpriteInfo | null): string {
  if (!sprite) return '';
  return "<div class='help_unit_image' style=' background: transparent url(" +
    sprite["image-src"] +
    ");background-position:-" +
    sprite["tileset-x"] +
    "px -" +
    sprite["tileset-y"] +
    "px;  width: " +
    sprite["width"] +
    "px;height: " +
    sprite["height"] +
    "px;'" +
    "></div>";
}

/**************************************************************************
...
**************************************************************************/
export function generate_help_toplevel(key: string): void {
  const parent_key = find_parent_help_key(key);
  const li = document.createElement('li');
  li.id = key;
  li.dataset.helptag = key;
  li.textContent = helpdata_tag_to_title(key);
  document.querySelector(parent_key)?.appendChild(li);

  const ul = document.createElement('ul');
  ul.id = key + '_ul';
  ul.className = 'help_submenu';
  li.appendChild(ul);
}

/**************************************************************************
...
**************************************************************************/
export function find_parent_help_key(key: string): string {
  if (key === "help_terrain_alterations") {
    return "#help_terrain_ul";
  } else if (key === "help_villages" || key === "help_borders") {
    return "#help_terrain_ul";
  } else if (key === "help_food" || key === "help_production" || key === "help_trade") {
    return "#help_economy_ul";
  } else if (
    key === "help_specialists" ||
    key === "help_happiness" ||
    key === "help_pollution" ||
    key === "help_plague" ||
    key === "help_migration"
  ) {
    return "#help_cities_ul";
  } else if (key === "help_combat_example_1" || key === "help_combat_example_2") {
    return "#help_combat_ul";
  } else {
    return "#help_menu";
  }
}

/**************************************************************************
...
**************************************************************************/
function handle_help_menu_select_native(item: HTMLElement): void {
  const selected_tag = item.dataset.helptag || '';
  if (selected_tag.indexOf("help_gen") !== -1) {
    generate_help_text(selected_tag);
  } else if (selected_tag === "help_copying") {
    fetch("/docs/LICENSE.txt").then(r => r.text()).then(data => {
      setHtml('help_info_page', "<h1>Freeciv-Web License</h1>" + data.replace(/\n/g, "<br>"));
    });
  } else if (selected_tag === "help_controls") {
    fetch("/docs/controls.txt").then(r => r.text()).then(data => {
      setHtml('help_info_page', data.replace(/\n/g, "<br>"));
    });
  } else {
    const msg = "<h1>" + helpdata_tag_to_title(selected_tag) + "</h1>" + get_helpdata()[selected_tag]["text"];
    setHtml('help_info_page', msg);
  }

  byId('help_info_page')?.focus();
}

// Keep old export name for backward compat
export function handle_help_menu_select(ui: { item?: HTMLElement | HTMLElement[] }): void {
  const item = Array.isArray(ui.item) ? ui.item[0] : ui.item;
  if (item) handle_help_menu_select_native(item);
}

/**************************************************************************
  Returns a button that shows the extracted Wikipedia data about an item.
**************************************************************************/
export function wiki_on_item_button(item_name: string): string {
  item_name = stringUnqualify(item_name);

  if (get_freeciv_wiki_docs()[item_name] == null) {
    console.log("No wiki data about " + item_name);
    return "";
  }

  return (
    "<button class='help_button' onclick=\"show_wikipedia_dialog('" +
    item_name.replace(/\\/g, "\\\\").replace(/'/g, "\\'") +
    "');\">Wikipedia on " +
    item_name +
    "</button>"
  );
}

/**************************************************************************
  Format a long text description of the current ruleset.
**************************************************************************/
export function helpdata_format_current_ruleset(): string {
  let msg = "";
  if (store.rulesControl != null) {
    msg += "<h1>" + (store.rulesControl as Record<string, unknown>)["name"] + "</h1>";
  }
  if (store.rulesSummary != null) {
    msg += "<p>" + store.rulesSummary.replace(/\n/g, "<br>") + "</p>";
  }
  if (store.rulesDescription != null) {
    msg += "<p>" + store.rulesDescription.replace(/\n/g, "<br>") + "</p>";
  }
  return msg;
}

/**************************************************************************
...
**************************************************************************/
export function generate_help_text(key: string): void {
  const rulesetdir: string = ruledir_from_ruleset_name((store.rulesControl as Record<string, unknown> | null)?.["name"] as string ?? "", "");
  let msg = "";

  if (key.indexOf("help_gen_terrain") !== -1) {
    const terrain = store.terrains[parseInt(key.replace("help_gen_terrain_", ""))];
    msg =
      "<h1>" + terrain["name"] + "</h1>" +
      terrain["helptext"] +
      "<br><br>Movement cost: " + terrain["movement_cost"] +
      "<br>Defense bonus: " + terrain["defense_bonus"] +
      "<br>Food/Prod/Trade: " +
      terrain["output"][0] + "/" + terrain["output"][1] + "/" + terrain["output"][2];
  } else if (key.indexOf("help_gen_improvements") !== -1 || key.indexOf("help_gen_wonders") !== -1) {
    const improvement: Improvement = store.improvements[
      parseInt(key.replace("help_gen_wonders_", "").replace("help_gen_improvements_", ""))
    ];
    msg =
      "<h1>" + improvement["name"] + "</h1>" +
      render_sprite(get_improvement_image_sprite(improvement)) +
      "<br>" + improvement["helptext"] +
      "<br><br>Cost: " + improvement["build_cost"] +
      "<br>Upkeep: " + improvement["upkeep"];
    const reqs = get_improvement_requirements(improvement["id"]);
    if (reqs != null) {
      msg += "<br>Requirements: ";
      for (let n = 0; n < reqs.length; n++) {
        msg += store.techs[reqs[n]]["name"] + " ";
      }
    }
    msg += "<br><br>";
    msg += wiki_on_item_button(improvement["name"]);
  } else if (key.indexOf("help_gen_units") !== -1) {
    let obsolete_by: UnitType | undefined;
    const punit_type: UnitType = store.unitTypes[parseInt(key.replace("help_gen_units_", ""))];

    msg = "<h1>" + punit_type["name"] + "</h1>";
    msg += render_sprite(get_unit_type_image_sprite(punit_type));
    msg += "<br>";
    msg += "<div id='manual_non_helptext_facts'>";
    msg += "<div id='utype_fact_cost'>Cost: " + punit_type["build_cost"] + "</div>";
    msg += "<div id='utype_fact_upkeep'></div>";
    msg += "<div id='utype_fact_attack_str'>Attack: " + punit_type["attack_strength"] + "</div>";
    msg += "<div id='utype_fact_defense_str'>Defense: " + punit_type["defense_strength"] + "</div>";
    msg += "<div id='utype_fact_firepower'>Firepower: " + punit_type["firepower"] + "</div>";
    msg += "<div id='utype_fact_hp'>Hitpoints: " + punit_type["hp"] + "</div>";
    msg += "<div id='utype_fact_move_rate'>Moves: " + move_points_text(punit_type["move_rate"]) + "</div>";
    msg += "<div id='utype_fact_vision'>Vision: " + punit_type["vision_radius_sq"] + "</div>";

    const ireqs = get_improvement_requirements(punit_type["impr_requirement"] as number);
    if (ireqs != null && ireqs.length > 0) {
      msg += "<div id='utype_fact_req_building'>Building Requirements: ";
      for (let m = 0; m < ireqs.length; m++) {
        msg += store.techs[ireqs[m]]["name"] + " ";
      }
      msg += "</div>";
    }

    const treq = punit_type["tech_requirement"] as number;
    if (treq != null && store.techs[treq] != null) {
      msg += "<div id='utype_fact_req_tech'>Tech Requirements: " + store.techs[treq]["name"] + "</div>";
    }

    obsolete_by = store.unitTypes[punit_type["obsoleted_by"] as number];
    msg += "<div id='utype_fact_obsolete'>Obsolete by: ";
    if (obsolete_by === U_NOT_OBSOLETED || obsolete_by == null) {
      msg += "None";
    } else {
      msg += obsolete_by["name"];
    }
    msg += "</div>";
    msg += "</div>";
    msg += "<div id='helptext'><p>" + punit_type["helptext"] + "</p></div>";
    msg += wiki_on_item_button(punit_type["name"]);
    msg += "<div id='datastore' hidden='true'></div>";
  } else if (key.indexOf("help_gen_techs") !== -1) {
    const tech: Tech = store.techs[parseInt(key.replace("help_gen_techs_", ""))];
    msg =
      "<h1>" + tech["name"] + "</h1>" +
      render_sprite(get_technology_image_sprite(tech)) +
      "<br>" + get_advances_text(tech["id"]);
    msg += "<br><br>";
    msg += wiki_on_item_button(tech["name"]);
  } else if (key === "help_gen_ruleset") {
    msg = helpdata_format_current_ruleset();
  } else if (key.indexOf("help_gen_governments") !== -1) {
    const pgov = store.governments[parseInt(key.replace("help_gen_governments_", ""))];
    msg = "<h1>" + pgov["name"] + "</h1>";
    msg += "<div id='helptext'><p>" + pgov["helptext"] + "</p></div>";
    msg += wiki_on_item_button(pgov["name"]);
  }

  setHtml('help_info_page', msg);

  /* Load auto-generated help from freeciv-manual HTML files */
  if (rulesetdir.length !== 0) {
    if (key.indexOf("help_gen_units") !== -1) {
      const utype_id = parseInt(key.replace("help_gen_units_", ""));

      fetch("../man/" + rulesetdir + "7.html")
        .then(r => r.text())
        .then(html => {
          const doc = new DOMParser().parseFromString(html, 'text/html');
          const helptext = doc.querySelector('#utype' + utype_id + ' .helptext');
          if (helptext) {
            const el = byId('helptext');
            if (el) domSetHtml(el, helptext.innerHTML);
          }
          const upkeep = doc.querySelector('#utype' + utype_id + ' .upkeep');
          if (upkeep) {
            const el = byId('utype_fact_upkeep');
            if (el) domSetHtml(el, upkeep.innerHTML);
          }
        })
        .catch(() => {});
    } else if (key.indexOf("help_gen_governments") !== -1) {
      const gov_id = parseInt(key.replace("help_gen_governments_", ""));

      fetch("../man/" + rulesetdir + "6.html")
        .then(r => r.text())
        .then(html => {
          const doc = new DOMParser().parseFromString(html, 'text/html');
          const helptext = doc.querySelector('#gov' + gov_id + ' .helptext');
          if (helptext) {
            const el = byId('helptext');
            if (el) domSetHtml(el, helptext.innerHTML);
          }
        })
        .catch(() => {});
    }
  }
}

/**************************************************************************
...
**************************************************************************/
export function helpdata_tag_to_title(tag: string): string {
  const result = tag
    .replace("_of_the_world", "")
    .replace("help_", "")
    .replace("gen_", "")
    .replace("misc_", "")
    .replace(/_/g, " ");
  return toTitleCase(result);
}
