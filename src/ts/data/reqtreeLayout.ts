/**
 * Dynamic tech tree layout builder.
 *
 * Computes x/y pixel positions for all techs in store.techs by performing
 * a DAG depth analysis on the prerequisite graph.  The result is stored in
 * store.computedReqtree and used by TechDialog / techLogic instead of the
 * hardcoded reqtree.ts positions.
 *
 * Algorithm (Sugiyama-inspired, simplified grid):
 *  1. Extract direct prerequisites from each tech's pre-processed `req` array
 *     (produced by recreate_old_tech_req).  Only valid tech ids (present in
 *     the ruleset set, not A_NONE=0) are considered.
 *  2. Compute the "depth" (column index) of every tech via iterative
 *     relaxation: depth = max(depth of prereqs) + 1.  Root techs (no prereqs
 *     in the set) start at depth 0.
 *  3. Within each depth level sort techs by id for a deterministic order, then
 *     refine with a single barycentric pass that re-orders each group by the
 *     average row of its prerequisites (reduces visual edge crossings).
 *  4. Assign pixel coordinates:
 *       x = depth * LAYOUT_COL_WIDTH
 *       y = row   * LAYOUT_ROW_HEIGHT
 */

import type { Tech } from './types';

/** Pixel width of each tech column (box width + horizontal gap). */
export const LAYOUT_COL_WIDTH = 250;
/** Pixel height of each tech row (box height + vertical gap). */
export const LAYOUT_ROW_HEIGHT = 60;

/** Coordinate pair returned for every tech in the layout. */
export interface LayoutNode {
  x: number;
  y: number;
}

const A_NONE = 0; // matches tech.ts — avoid circular import

/**
 * Build a grid layout from the server-supplied tech data.
 *
 * @param techs  store.techs — Record<id, Tech> populated by RULESET_TECH packets.
 * @returns      Record keyed by stringified tech id (matching reqtree.ts convention).
 */
export function buildReqtreeLayout(techs: Record<number, Tech>): Record<string, LayoutNode> {
  const ids = Object.keys(techs).map(Number).filter(id => id > 0);
  if (ids.length === 0) return {};

  const idSet = new Set(ids);

  // --- Step 1: build prerequisite map (valid in-set ids only) ---
  // Uses the pre-processed `req` array (2 entries, padded with A_NONE)
  // produced by recreate_old_tech_req() in the ruleset handler.
  const prereqs = new Map<number, number[]>();
  for (const id of ids) {
    const tech = techs[id];
    const req = (tech['req'] as number[] | undefined) ?? [];
    const ps: number[] = [];
    for (const r of req) {
      if (r != null && r !== A_NONE && idSet.has(r)) ps.push(r);
    }
    prereqs.set(id, ps);
  }

  // --- Step 2: compute depth via iterative relaxation ---
  // Each iteration propagates depth from prereqs to dependents.
  // Converges in at most O(longest-chain) passes; capped at ids.length.
  const depth = new Map<number, number>();
  for (const id of ids) depth.set(id, 0);

  let changed = true;
  for (let iter = 0; changed && iter < ids.length; iter++) {
    changed = false;
    for (const id of ids) {
      const ps = prereqs.get(id)!;
      if (ps.length === 0) continue;
      let maxD = 0;
      for (const p of ps) maxD = Math.max(maxD, depth.get(p) ?? 0);
      const newD = maxD + 1;
      if (newD > (depth.get(id) ?? 0)) {
        depth.set(id, newD);
        changed = true;
      }
    }
  }

  // --- Step 3a: group by depth, initial sort by tech id ---
  const byDepth = new Map<number, number[]>();
  for (const id of ids) {
    const d = depth.get(id) ?? 0;
    if (!byDepth.has(d)) byDepth.set(d, []);
    byDepth.get(d)!.push(id);
  }
  for (const group of byDepth.values()) {
    group.sort((a, b) => a - b);
  }

  // Build a temporary row-index map for the barycentric pass
  const rowOf = new Map<number, number>();
  for (const [, group] of byDepth) {
    for (let r = 0; r < group.length; r++) rowOf.set(group[r], r);
  }

  // --- Step 3b: single barycentric pass (depth columns left→right) ---
  // For each column, re-sort techs by the average row of their prereqs.
  // Techs with no prereqs in the previous column keep their id-based order.
  const maxDepth = byDepth.size === 0 ? 0 : Math.max(...byDepth.keys());
  for (let d = 1; d <= maxDepth; d++) {
    const group = byDepth.get(d);
    if (!group || group.length <= 1) continue;

    const bary = new Map<number, number>();
    for (const id of group) {
      const ps = prereqs.get(id)!;
      if (ps.length === 0) {
        bary.set(id, id); // stable fallback: use tech id as sort key
      } else {
        const avg = ps.reduce((s, p) => s + (rowOf.get(p) ?? 0), 0) / ps.length;
        bary.set(id, avg);
      }
    }
    group.sort((a, b) => (bary.get(a) ?? a) - (bary.get(b) ?? b));

    // Update rowOf for subsequent depth levels
    for (let r = 0; r < group.length; r++) rowOf.set(group[r], r);
  }

  // --- Step 4: assign pixel coordinates ---
  const result: Record<string, LayoutNode> = {};
  for (const [d, group] of byDepth) {
    for (let row = 0; row < group.length; row++) {
      result[String(group[row])] = {
        x: d * LAYOUT_COL_WIDTH,
        y: row * LAYOUT_ROW_HEIGHT,
      };
    }
  }
  return result;
}
