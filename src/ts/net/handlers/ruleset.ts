/**
 * Ruleset packet handlers — pure data assignment to store/window globals.
 */
import { store } from '../../data/store';
import { VUT_ADVANCE, REQ_RANGE_PLAYER, EC_BASE, EC_ROAD } from '../../data/fcTypes';
import { A_NONE } from '../../data/tech';
import { isExtraCausedBy } from '../../data/extra';
import { BitVector } from '../../utils/bitvector';
import { stringUnqualify } from '../../utils/helpers';
import { improvements_init } from '../../data/improvement';
import { C_S_PREPARING } from '../../client/clientState';
import { setClientState as set_client_state } from '../../client/clientMain';

// Module-local state
export let terrain_control: any = {};
let roads: any[] = [];
let bases: any[] = [];

export function handle_ruleset_terrain(packet: any): void {
  if (packet['name'] === 'Lake') packet['graphic_str'] = packet['graphic_alt'];
  if (packet['name'] === 'Glacier') packet['graphic_str'] = 'tundra';
  store.terrains[packet['id']] = packet;
}

export function handle_ruleset_resource(packet: any): void {
  (window as any).resources[packet['id']] = packet;
}

export function handle_ruleset_game(packet: any): void {
  (window as any).game_rules = packet;
}

export function handle_ruleset_specialist(packet: any): void {
  (window as any).specialists[packet['id']] = packet;
}

export function handle_ruleset_nation_groups(packet: any): void {
  (window as any).nation_groups = packet['groups'];
}

export function handle_ruleset_nation(packet: any): void {
  store.nations[packet['id']] = packet;
}

export function handle_ruleset_city(packet: any): void {
  (window as any).city_rules[packet['style_id']] = packet;
}

export function handle_ruleset_government(packet: any): void {
  store.governments[packet['id']] = packet;
}

export function handle_ruleset_summary(packet: any): void {
  store.rulesSummary = packet['text'];
}

export function handle_ruleset_description_part(packet: any): void {
  if (store.rulesDescription == null) {
    store.rulesDescription = packet['text'];
  } else {
    store.rulesDescription += packet['text'];
  }
}

export function handle_ruleset_action(packet: any): void {
  (window as any).actions[packet['id']] = packet;
  packet['enablers'] = [];
}

export function handle_ruleset_goods(packet: any): void {
  (window as any).goods[packet['id']] = packet;
}

export function handle_ruleset_clause(packet: any): void {
  (window as any).clause_infos[packet['type']] = packet;
}

export function handle_ruleset_effect(packet: any): void {
  if ((window as any).effects[packet['effect_type']] == null) {
    (window as any).effects[packet['effect_type']] = [];
  }
  (window as any).effects[packet['effect_type']].push(packet);
}

export function handle_ruleset_unit(packet: any): void {
  if (packet['name'] != null && packet['name'].indexOf('?unit:') === 0) {
    packet['name'] = packet['name'].replace('?unit:', '');
  }
  packet['flags'] = new BitVector(packet['flags']);
  store.unitTypes[packet['id']] = packet;
}

export function handle_web_ruleset_unit_addition(packet: any): void {
  if (packet['utype_actions'] != null) {
    packet['utype_actions'] = new BitVector(packet['utype_actions']);
  }
  if (store.unitTypes[packet['id']] != null) {
    Object.assign(store.unitTypes[packet['id']], packet);
  }
}

export function recreate_old_tech_req(packet: any): void {
  packet['req'] = [];
  if (packet['research_reqs']) {
    for (let i = 0; i < packet['research_reqs'].length; i++) {
      const requirement = packet['research_reqs'][i];
      if (requirement.kind === VUT_ADVANCE
          && requirement.range === REQ_RANGE_PLAYER
          && requirement.present) {
        packet['req'].push(requirement.value);
      }
    }
  }
  while (packet['req'].length < 2) {
    packet['req'].push(A_NONE ?? 0);
  }
}

export function handle_ruleset_tech(packet: any): void {
  if (packet['name'] != null && packet['name'].indexOf('?tech:') === 0) {
    packet['name'] = packet['name'].replace('?tech:', '');
  }
  store.techs[packet['id']] = packet;
  recreate_old_tech_req(packet);
}

export function handle_ruleset_tech_class(_packet: any): void { /* TODO */ }
export function handle_ruleset_tech_flag(_packet: any): void { /* TODO */ }

export function handle_ruleset_terrain_control(packet: any): void {
  terrain_control = packet;
  (window as any).terrain_control = packet;
  (window as any).SINGLE_MOVE = packet['move_fragments'];
}

export function handle_ruleset_building(packet: any): void {
  store.improvements[packet['id']] = packet;
}

export function handle_ruleset_unit_class(packet: any): void {
  packet['flags'] = new BitVector(packet['flags']);
  (window as any).unit_classes[packet['id']] = packet;
}

export function handle_ruleset_disaster(_packet: any): void { /* TODO */ }
export function handle_ruleset_trade(_packet: any): void { /* TODO */ }
export function handle_rulesets_ready(_packet: any): void { /* TODO */ }
export function handle_ruleset_choices(_packet: any): void { /* TODO */ }
export function handle_game_load(_packet: any): void { /* TODO */ }
export function handle_ruleset_unit_flag(_packet: any): void { /* TODO */ }
export function handle_ruleset_unit_class_flag(_packet: any): void { /* TODO */ }
export function handle_ruleset_unit_bonus(_packet: any): void { /* TODO */ }
export function handle_ruleset_terrain_flag(_packet: any): void { /* TODO */ }
export function handle_ruleset_impr_flag(_packet: any): void { /* TODO */ }
export function handle_ruleset_government_ruler_title(_packet: any): void { /* TODO */ }

export function handle_ruleset_base(packet: any): void {
  if (!store.rulesControl) return;
  for (let i = 0; i < (store.rulesControl as any)['num_extra_types']; i++) {
    if (isExtraCausedBy(store.extras[i], EC_BASE)
        && store.extras[i]['base'] == null) {
      store.extras[i]['base'] = packet;
      (store.extras as any)[store.extras[i]['rule_name']]['base'] = packet;
      return;
    }
  }
  console.log("Didn't find Extra to put Base on");
  console.log(packet);
}

export function handle_ruleset_road(packet: any): void {
  if (!store.rulesControl) return;
  for (let i = 0; i < (store.rulesControl as any)['num_extra_types']; i++) {
    if (isExtraCausedBy(store.extras[i], EC_ROAD)
        && store.extras[i]['road'] == null) {
      store.extras[i]['road'] = packet;
      (store.extras as any)[store.extras[i]['rule_name']]['road'] = packet;
      return;
    }
  }
  console.log("Didn't find Extra to put Road on");
  console.log(packet);
}

export function handle_ruleset_action_enabler(packet: any): void {
  const paction = (window as any).actions[packet.enabled_action];
  if (paction === undefined) {
    console.log("Unknown action " + packet.action + " for enabler ");
    console.log(packet);
    return;
  }
  paction.enablers.push(packet);
}

export function handle_ruleset_extra(packet: any): void {
  packet['causes'] = new BitVector(packet['causes']);
  packet['rmcauses'] = new BitVector(packet['rmcauses']);
  packet['name'] = stringUnqualify(packet['name']);
  store.extras[packet['id']] = packet;
  (store.extras as any)[packet['rule_name']] = packet;

  if (isExtraCausedBy(packet, EC_ROAD) && packet['buildable']) {
    roads.push(packet);
  }
  if (isExtraCausedBy(packet, EC_BASE) && packet['buildable']) {
    bases.push(packet);
  }

  if (packet['rule_name'] === 'Railroad') (window as any)['EXTRA_RAIL'] = packet['id'];
  else if (packet['rule_name'] === 'Oil Well') (window as any)['EXTRA_OIL_WELL'] = packet['id'];
  else (window as any)['EXTRA_' + packet['rule_name'].toUpperCase()] = packet['id'];
}

export function handle_ruleset_counter(_packet: any): void { /* TODO */ }
export function handle_ruleset_extra_flag(_packet: any): void { /* TODO */ }
export function handle_ruleset_nation_sets(_packet: any): void { /* TODO */ }
export function handle_ruleset_style(_packet: any): void { /* TODO */ }
export function handle_nation_availability(_packet: any): void { /* TODO */ }
export function handle_ruleset_music(_packet: any): void { /* TODO */ }
export function handle_ruleset_multiplier(_packet: any): void { /* TODO */ }
export function handle_ruleset_action_auto(_packet: any): void { /* TODO */ }
export function handle_ruleset_achievement(_packet: any): void { /* TODO */ }
export function handle_achievement_info(_packet: any): void { /* TODO */ }
export function handle_team_name_info(_packet: any): void { /* TODO */ }
export function handle_popup_image(_packet: any): void { /* TODO */ }
export function handle_worker_task(_packet: any): void { /* TODO */ }
export function handle_play_music(_packet: any): void { /* TODO */ }

export function handle_ruleset_control(packet: any): void {
  store.rulesControl = packet;
  set_client_state(C_S_PREPARING);

  (window as any).effects = {};
  store.rulesSummary = null;
  store.rulesDescription = null;
  (window as any).game_rules = null;
  (window as any).nation_groups = [];
  store.nations = {};
  (window as any).specialists = {};
  store.techs = {};
  store.governments = {};
  terrain_control = {};
  (window as any).terrain_control = {};
  (window as any).SINGLE_MOVE = undefined;
  store.unitTypes = {};
  (window as any).unit_classes = {};
  (window as any).city_rules = {};
  store.terrains = {};
  (window as any).resources = {};
  (window as any).goods = {};
  (window as any).actions = {};

  improvements_init();

  for (const extra in store.extras) {
    const ename = (store.extras as any)[extra]['rule_name'];
    if (ename === 'Railroad') delete (window as any)['EXTRA_RAIL'];
    else if (ename === 'Oil Well') delete (window as any)['EXTRA_OIL_WELL'];
    else delete (window as any)['EXTRA_' + ename.toUpperCase()];
  }
  store.extras = {};
  roads = [];
  bases = [];

  (window as any).clause_infos = {};
}
