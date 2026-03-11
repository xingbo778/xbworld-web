import type { UnitType, Player } from './types';
import { ACTION_COUNT, MAX_NUM_UNITS } from '../core/constants';
import { store } from './store';
import { actionByNumber as action_by_number, actionHasResult as action_has_result } from './actions';
import { playerInventionState as player_invention_state, TECH_KNOWN } from './tech';
export enum UCF {
  TERRAIN_SPEED = 0,
  TERRAIN_DEFENSE = 1,
  DAMAGE_SLOWS = 2,
  CAN_OCCUPY_CITY = 3,
  MISSILE = 4,
  BUILD_ANYWHERE = 5,
  UNREACHABLE = 6,
  COLLECT_RANSOM = 7,
  ZOC = 8,
  CAN_FORTIFY = 9,
  CAN_PILLAGE = 10,
  HUT_FRIGHTEN = 11,
}

export const UTYF_FLAGLESS = 29;
export const UTYF_PROVIDES_RANSOM = 30;

export const U_NOT_OBSOLETED: null = null;
export const U_LAST: number = MAX_NUM_UNITS;

export const unit_classes: Record<number, Record<string, unknown>> = {};

export function utype_can_do_action(putype: UnitType | null | undefined | Record<string, unknown>, action_id: number): boolean {
  if (putype == null || putype['utype_actions'] == null) return false;
  return (putype['utype_actions'] as { isSet(id: number): boolean }).isSet(action_id);
}

export function utype_can_do_action_result(putype: UnitType, result: number): boolean {
  for (let action_id = 0; action_id < ACTION_COUNT; action_id++) {
    if (utype_can_do_action(putype, action_id)) {
      const paction = action_by_number(action_id);
      if (paction != null && action_has_result(paction, result)) {
        return true;
      }
    }
  }
  return false;
}

export function can_player_build_unit_direct(p: Player | null, punittype: UnitType | null): boolean {
  if (punittype == null || p == null) return false;

  const techReq = punittype['tech_requirement'] as number | null | undefined;
  if (techReq != null && techReq >= 0) {
    if (player_invention_state(p, techReq) !== TECH_KNOWN) {
      return false;
    }
  }

  const obsoletedBy = punittype['obsoleted_by'] as number | null | undefined;
  if (obsoletedBy != null && obsoletedBy >= 0) {
    const obs_type = store.unitTypes[obsoletedBy];
    if (obs_type != null) {
      const obsTechReq = obs_type['tech_requirement'] as number | null | undefined;
      if (obsTechReq == null || obsTechReq < 0) {
        return false;
      }
      if (player_invention_state(p, obsTechReq) === TECH_KNOWN) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Returns the unit class object for the given unit type, or null if unavailable.
 * Reads store.unitClasses[punittype.unit_class].
 */
export function getUnitClassForType(punittype: UnitType | null | undefined): Record<string, unknown> | null {
  if (punittype == null) return null;
  const classId = (punittype as Record<string, unknown>)['unit_class'] as number | undefined;
  if (classId == null) return null;
  return store.unitClasses[classId] ?? null;
}

export function get_units_from_tech(tech_id: number): UnitType[] {
  const result: UnitType[] = [];
  for (const unit_type_id in store.unitTypes) {
    const punit_type = store.unitTypes[unit_type_id] as UnitType;
    if (punit_type == null) continue;
    if (punit_type.tech_requirement === tech_id) {
      result.push(punit_type);
    }
  }
  return result;
}

