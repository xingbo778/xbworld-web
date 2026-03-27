/**
 * Ruleset packet handlers — pure data assignment to store.
 */
import { store } from '../../data/store';
import { globalEvents } from '../../core/events';
import { VUT_ADVANCE, REQ_RANGE_PLAYER, EC_BASE, EC_ROAD } from '../../data/fcTypes';
import { A_NONE } from '../../data/tech';
import { isExtraCausedBy } from '../../data/extra';
import { BitVector } from '../../utils/bitvector';
import { stringUnqualify } from '../../utils/helpers';
import { improvements_init } from '../../data/improvement';
import { buildReqtreeLayout } from '../../data/reqtreeLayout';
import { C_S_PREPARING } from '../../client/clientState';
import { setClientState as set_client_state } from '../../client/clientMain';
import type {
  BasePacket,
  RulesetTerrainPacket,
  RulesetResourcePacket,
  RulesetGamePacket,
  RulesetSpecialistPacket,
  RulesetNationGroupsPacket,
  RulesetNationPacket,
  RulesetCityPacket,
  RulesetGovernmentPacket,
  RulesetSummaryPacket,
  RulesetDescriptionPartPacket,
  RulesetActionPacket,
  RulesetGoodsPacket,
  RulesetClausePacket,
  RulesetEffectPacket,
  RulesetUnitPacket,
  WebRulesetUnitAdditionPacket,
  RulesetTechPacket,
  RulesetTerrainControlPacket,
  RulesetBuildingPacket,
  RulesetUnitClassPacket,
  RulesetBasePacket,
  RulesetRoadPacket,
  RulesetActionEnablerPacket,
  RulesetExtraPacket,
  RulesetControlPacket,
} from './packetTypes';
import type { UnitType, Extra, Government, City } from '../../data/types';

// Module-local state
export let terrain_control: RulesetTerrainControlPacket | Record<string, never> = {};
let roads: Extra[] = [];
let bases: Extra[] = [];

type UnitTypeWithBonuses = UnitType & { bonuses?: BasePacket[] };
type GovernmentWithTitles = Government & { male_title?: unknown; female_title?: unknown };
type CityWithWorkerTasks = City & { workerTasks?: BasePacket[] };
type ExtraStore = Record<number, Extra> & Record<string, Extra>;
type RulesetUnitPacketWithBitVector = Omit<RulesetUnitPacket, 'flags'> & { flags: BitVector };
type WebRulesetUnitAdditionPacketWithBitVector =
  Omit<WebRulesetUnitAdditionPacket, 'utype_actions'> & { utype_actions?: BitVector };
type RulesetUnitClassPacketWithBitVector = Omit<RulesetUnitClassPacket, 'flags'> & { flags: BitVector };
type RulesetExtraPacketWithBitVectors =
  Omit<RulesetExtraPacket, 'causes' | 'rmcauses'> & { causes: BitVector; rmcauses: BitVector };

export function handle_ruleset_terrain(packet: RulesetTerrainPacket): void {
  if (packet['name'] === 'Lake') packet['graphic_str'] = packet['graphic_alt'];
  if (packet['name'] === 'Glacier') packet['graphic_str'] = 'tundra';
  store.terrains[packet['id']] = packet;
}

export function handle_ruleset_resource(packet: RulesetResourcePacket): void {
  store.resources[packet['id']] = packet;
}

export function handle_ruleset_game(packet: RulesetGamePacket): void {
  store.gameRules = packet;
}

export function handle_ruleset_specialist(packet: RulesetSpecialistPacket): void {
  store.specialists[packet['id']] = packet;
}

export function handle_ruleset_nation_groups(packet: RulesetNationGroupsPacket): void {
  store.nationGroups = packet['groups'];
}

export function handle_ruleset_nation(packet: RulesetNationPacket): void {
  store.nations[packet['id']] = packet;
}

export function handle_ruleset_city(packet: RulesetCityPacket): void {
  store.cityRules[packet['style_id']] = packet;
}

export function handle_ruleset_government(packet: RulesetGovernmentPacket): void {
  store.governments[packet['id']] = packet;
}

export function handle_ruleset_summary(packet: RulesetSummaryPacket): void {
  store.rulesSummary = packet['text'];
}

export function handle_ruleset_description_part(packet: RulesetDescriptionPartPacket): void {
  if (store.rulesDescription == null) {
    store.rulesDescription = packet['text'];
  } else {
    store.rulesDescription += packet['text'];
  }
}

export function handle_ruleset_action(packet: RulesetActionPacket): void {
  const action = { ...packet, enablers: [] as unknown[] };
  store.actions[action['id']] = action;
}

export function handle_ruleset_goods(packet: RulesetGoodsPacket): void {
  store.goods[packet['id']] = packet;
}

export function handle_ruleset_clause(packet: RulesetClausePacket): void {
  store.clauseInfos[packet['type']] = packet;
}

export function handle_ruleset_effect(packet: RulesetEffectPacket): void {
  if (store.effects[packet['effect_type']] == null) {
    store.effects[packet['effect_type']] = [];
  }
  store.effects[packet['effect_type']].push(packet);
}

export function handle_ruleset_unit(packet: RulesetUnitPacket): void {
  if (packet['name'] != null && packet['name'].indexOf('?unit:') === 0) {
    packet['name'] = packet['name'].replace('?unit:', '');
  }
  // flags is converted from raw number[] to BitVector in place
  const unitPacket = packet as unknown as RulesetUnitPacketWithBitVector;
  unitPacket.flags = new BitVector(packet['flags']);
  store.unitTypes[packet['id']] = unitPacket as unknown as UnitType;
}

export function handle_web_ruleset_unit_addition(packet: WebRulesetUnitAdditionPacket): void {
  if (packet['utype_actions'] != null) {
    (packet as unknown as WebRulesetUnitAdditionPacketWithBitVector).utype_actions =
      new BitVector(packet['utype_actions']);
  }
  if (store.unitTypes[packet['id']] != null) {
    Object.assign(store.unitTypes[packet['id']], packet);
  }
}

export function recreate_old_tech_req(packet: RulesetTechPacket): void {
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

export function handle_ruleset_tech(packet: RulesetTechPacket): void {
  if (packet['name'] != null && packet['name'].indexOf('?tech:') === 0) {
    packet['name'] = packet['name'].replace('?tech:', '');
  }
  store.techs[packet['id']] = packet;
  recreate_old_tech_req(packet);
}

export function handle_ruleset_tech_class(packet: BasePacket): void {
  store.techClasses[packet['id'] as number] = packet;
}

export function handle_ruleset_tech_flag(packet: BasePacket): void {
  store.techFlags[packet['id'] as number] = packet;
}

export function handle_ruleset_terrain_control(packet: RulesetTerrainControlPacket): void {
  terrain_control = packet;
  store.terrainControl = packet;
  store.singleMove = packet['move_fragments'];
}

export function handle_ruleset_building(packet: RulesetBuildingPacket): void {
  store.improvements[packet['id']] = packet;
}

export function handle_ruleset_unit_class(packet: RulesetUnitClassPacket): void {
  // flags is converted from raw number[] to BitVector in place
  const unitClassPacket = packet as unknown as RulesetUnitClassPacketWithBitVector;
  unitClassPacket.flags = new BitVector(packet['flags']);
  store.unitClasses[packet['id']] = unitClassPacket as unknown as typeof store.unitClasses[number];
}

export function handle_ruleset_disaster(packet: BasePacket): void {
  store.disasters[packet['id'] as number] = packet;
}

export function handle_ruleset_trade(packet: BasePacket): void {
  store.tradeRules = packet;
}

export function handle_rulesets_ready(_packet: BasePacket): void {
  store.computedReqtree = buildReqtreeLayout(store.techs);
  console.log(`[xbw] reqtree: built dynamic layout for ${Object.keys(store.computedReqtree).length} techs`);
  globalEvents.emit('rules:ready');
}

export function handle_ruleset_choices(_packet: BasePacket): void { /* server-side only, no client action needed */ }
export function handle_game_load(_packet: BasePacket): void { /* no client action needed */ }

export function handle_ruleset_unit_flag(packet: BasePacket): void {
  store.unitFlags[packet['id'] as number] = packet;
}

export function handle_ruleset_unit_class_flag(packet: BasePacket): void {
  store.unitClassFlags[packet['id'] as number] = packet;
}

export function handle_ruleset_unit_bonus(packet: BasePacket): void {
  const unit_type_id = packet['unit'] as number;
  if (unit_type_id != null && store.unitTypes[unit_type_id] != null) {
    const unitType = store.unitTypes[unit_type_id] as UnitTypeWithBonuses;
    if (unitType.bonuses == null) unitType.bonuses = [];
    unitType.bonuses.push(packet);
  }
}

export function handle_ruleset_terrain_flag(packet: BasePacket): void {
  store.terrainFlags[packet['id'] as number] = packet;
}

export function handle_ruleset_impr_flag(packet: BasePacket): void {
  store.imprFlags[packet['id'] as number] = packet;
}

export function handle_ruleset_government_ruler_title(packet: BasePacket): void {
  const gov_id = packet['gov'] as number;
  const gov = store.governments[gov_id] as GovernmentWithTitles | undefined;
  if (gov != null) {
    gov.male_title = packet['male_title'];
    gov.female_title = packet['female_title'];
  }
}

export function handle_ruleset_base(packet: RulesetBasePacket): void {
  if (!store.rulesControl) return;
  const extras = store.extras as ExtraStore;
  for (let i = 0; i < (store.rulesControl['num_extra_types'] as number); i++) {
    if (isExtraCausedBy(store.extras[i], EC_BASE)
        && store.extras[i]['base'] == null) {
      store.extras[i]['base'] = packet;
      extras[store.extras[i]['rule_name'] as string]['base'] = packet;
      return;
    }
  }
  console.log("Didn't find Extra to put Base on");
  console.log(packet);
}

export function handle_ruleset_road(packet: RulesetRoadPacket): void {
  if (!store.rulesControl) return;
  const extras = store.extras as ExtraStore;
  for (let i = 0; i < (store.rulesControl['num_extra_types'] as number); i++) {
    if (isExtraCausedBy(store.extras[i], EC_ROAD)
        && store.extras[i]['road'] == null) {
      store.extras[i]['road'] = packet;
      extras[store.extras[i]['rule_name'] as string]['road'] = packet;
      return;
    }
  }
  console.log("Didn't find Extra to put Road on");
  console.log(packet);
}

export function handle_ruleset_action_enabler(packet: RulesetActionEnablerPacket): void {
  const paction = store.actions[packet.enabled_action];
  if (paction === undefined) {
    console.log("Unknown action " + packet.action + " for enabler ");
    console.log(packet);
    return;
  }
  paction.enablers.push(packet);
}

export function handle_ruleset_extra(packet: RulesetExtraPacket): void {
  // causes/rmcauses are converted from raw number[] to BitVector in place
  const rec = packet as unknown as RulesetExtraPacketWithBitVectors;
  rec.causes = new BitVector(packet['causes']);
  rec.rmcauses = new BitVector(packet['rmcauses']);
  packet['name'] = stringUnqualify(packet['name']);
  const extra = rec as unknown as Extra;
  const extras = store.extras as ExtraStore;
  store.extras[packet['id']] = extra;
  extras[packet['rule_name']] = extra;

  if (isExtraCausedBy(extra, EC_ROAD) && packet['buildable']) {
    roads.push(extra);
  }
  if (isExtraCausedBy(extra, EC_BASE) && packet['buildable']) {
    bases.push(extra);
  }

  if (packet['rule_name'] === 'Railroad') store.extraIds['EXTRA_RAIL'] = packet['id'];
  else if (packet['rule_name'] === 'Oil Well') store.extraIds['EXTRA_OIL_WELL'] = packet['id'];
  else store.extraIds['EXTRA_' + packet['rule_name'].toUpperCase()] = packet['id'];
}

export function handle_ruleset_counter(packet: BasePacket): void {
  store.counters[packet['id'] as number] = packet;
}

export function handle_ruleset_extra_flag(packet: BasePacket): void {
  store.extraFlags[packet['id'] as number] = packet;
}

export function handle_ruleset_nation_sets(packet: BasePacket): void {
  store.nationSets = (packet['sets'] as unknown[] | undefined) ?? packet;
}

export function handle_ruleset_style(packet: BasePacket): void {
  store.styles[packet['id'] as number] = packet;
}

export function handle_nation_availability(packet: BasePacket): void {
  store.nationAvailability = packet;
}

export function handle_ruleset_music(_packet: BasePacket): void { /* no audio support */ }

export function handle_ruleset_multiplier(packet: BasePacket): void {
  store.multipliers[packet['id'] as number] = packet;
}

export function handle_ruleset_action_auto(packet: BasePacket): void {
  store.actionAutos[packet['id'] as number] = packet;
}

export function handle_ruleset_achievement(packet: BasePacket): void {
  store.achievements[packet['id'] as number] = packet;
}

export function handle_achievement_info(packet: BasePacket): void {
  const id = packet['id'] as number;
  if (store.achievementInfo[id] == null) store.achievementInfo[id] = {};
  store.achievementInfo[id][packet['player_id'] as number] = packet;
}

export function handle_team_name_info(packet: BasePacket): void {
  store.teamNames[packet['team_id'] as number] = packet['name'] as string;
}

export function handle_popup_image(_packet: BasePacket): void { /* no popup image support */ }

export function handle_worker_task(packet: BasePacket): void {
  const city_id = packet['city_id'] as number;
  if (city_id != null && store.cities[city_id] != null) {
    const city = store.cities[city_id] as CityWithWorkerTasks;
    if (city.workerTasks == null) city.workerTasks = [];
    city.workerTasks.push(packet);
  }
}

export function handle_play_music(_packet: BasePacket): void { /* no audio support */ }

export function handle_ruleset_control(packet: RulesetControlPacket): void {
  store.rulesControl = packet;
  set_client_state(C_S_PREPARING);

  store.effects = {};
  store.rulesSummary = null;
  store.rulesDescription = null;
  store.gameRules = null;
  store.nationGroups = [];
  store.nations = {};
  store.specialists = {};
  store.techs = {};
  store.computedReqtree = null;
  store.governments = {};
  terrain_control = {};
  store.terrainControl = {};
  store.singleMove = undefined;
  store.unitTypes = {};
  store.unitClasses = {};
  store.cityRules = {};
  store.terrains = {};
  store.resources = {};
  store.goods = {};
  store.actions = {};

  improvements_init();

  const extras = store.extras as ExtraStore;
  for (const extra in store.extras) {
    const ename = extras[extra]['rule_name'];
    if (ename === 'Railroad') delete store.extraIds['EXTRA_RAIL'];
    else if (ename === 'Oil Well') delete store.extraIds['EXTRA_OIL_WELL'];
    else delete store.extraIds['EXTRA_' + ename.toUpperCase()];
  }
  store.extras = {};
  roads = [];
  bases = [];

  store.clauseInfos = {};

  // Reset supplementary ruleset data stores
  store.techClasses = {};
  store.techFlags = {};
  store.unitFlags = {};
  store.unitClassFlags = {};
  store.terrainFlags = {};
  store.imprFlags = {};
  store.extraFlags = {};
  store.disasters = {};
  store.multipliers = {};
  store.achievements = {};
  store.achievementInfo = {};
  store.counters = {};
  store.styles = {};
  store.actionAutos = {};
  store.tradeRules = null;
  store.nationSets = null;
  store.nationAvailability = null;
}
