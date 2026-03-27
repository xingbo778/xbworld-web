/**
 * XBWorld — Improvement data module (migrated from improvement.js)
 *
 * Pure query functions for buildings/improvements/wonders.
 * Phase 9: Now includes init, add_building, and id_by_name with
 * a module-local name→id cache (improvements_name_index).
 */

import { MAX_NUM_BUILDINGS } from '../core/constants';
import { store } from './store';
import type { Improvement } from './types';
import { VUT_ADVANCE } from './fcTypes';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
export const B_AIRPORT_NAME = 'Airport';
export const B_LAST = MAX_NUM_BUILDINGS;

// Module-local name→id cache (mirrors Legacy improvements_name_index)
const improvements_name_index: Record<string, number> = {};

// ---------------------------------------------------------------------------
// Initialisation
// ---------------------------------------------------------------------------

/**
 * Prepare improvements for use, resetting state from any previous ruleset.
 */
export function improvements_init(): void {
  const improvements = store.improvements;
  Object.keys(improvements).forEach((k) => delete improvements[Number(k)]);
  Object.keys(improvements_name_index).forEach(
    (k) => delete improvements_name_index[k]
  );
}

/**
 * Add a new improvement definition.
 */
export function improvements_add_building(improvement: Improvement): void {
  store.improvements[improvement.id] = improvement;
  improvements_name_index[improvement.name] = improvement.id;
}

// ---------------------------------------------------------------------------
// Query functions
// ---------------------------------------------------------------------------

/**
 * Returns list of improvements that require the given tech.
 */
export function get_improvements_from_tech(techId: number): Improvement[] {
  const improvements = store.improvements;
  const result: Improvement[] = [];
  for (const improvementId in improvements) {
    const pimprovement = improvements[improvementId];
    const reqs = get_improvement_requirements(parseInt(improvementId, 10));
    for (let i = 0; i < reqs.length; i++) {
      if (reqs[i] == techId) {
        result.push(pimprovement);
      }
    }
  }
  return result;
}

/**
 * Returns true if the improvement is a wonder.
 * Wonders have a soundtag starting with 'w'.
 */
export function is_wonder(improvement: Improvement): boolean {
  return (improvement['soundtag'] as string)[0] === 'w';
}

/**
 * Returns list of tech ids which are a requirement for the given improvement.
 */
export function get_improvement_requirements(improvementId: number): number[] {
  const improvements = store.improvements;
  const result: number[] = [];
  const improvement = improvements[improvementId];
  const reqs = improvement != null
    ? improvement['reqs'] as Array<{ kind?: number; present?: boolean; value?: number }> | undefined
    : undefined;
  if (reqs != null) {
    for (let i = 0; i < reqs.length; i++) {
      if (
        reqs[i].kind == VUT_ADVANCE &&
        reqs[i].present
      ) {
        result.push(reqs[i].value as number);
      }
    }
  }
  return result;
}

/**
 * Finds improvement id by exact name, or -1 if not found.
 * Uses the module-local name→id cache for O(1) lookup.
 */
export function improvement_id_by_name(name: string): number {
  return Object.prototype.hasOwnProperty.call(improvements_name_index, name)
    ? improvements_name_index[name]
    : -1;
}

// Also export for TS-internal use
export { improvement_id_by_name as improvementIdByName };

// ---------------------------------------------------------------------------
// Expose to legacy
// ---------------------------------------------------------------------------

// Constants
