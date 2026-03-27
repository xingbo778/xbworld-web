/**
 * TechDialog / TechPanel — Preact research progress views (observer mode).
 *
 * TechDialog: floating modal (used when opened via update_tech_screen).
 * TechPanel:  inline tab content mounted into #tabs-tec (lazy, replaces canvas tech tab).
 *             Contains two sub-tabs: Research Progress list + Visual Tech Tree.
 */
import { render } from 'preact';
import { signal } from '@preact/signals';
import { useCallback, useState } from 'preact/hooks';
import { store } from '../../data/store';
import { currentTurn, researchUpdated, rulesetReady, playerUpdated } from '../../data/signals';
import { research_get } from '../../data/player';
import { reqtree } from '../../data/reqtree';
import { A_NONE, TECH_KNOWN } from '../../data/tech';
import { Dialog } from '../Shared/Dialog';
import { ProgressBar } from '../Shared/ProgressBar';
import {
  buildWikiDialogData,
  buildTechInfoDialogData,
} from '../../ui/techLogic';
import type { WikiDialogData, TechInfoDialogData, WikiDoc } from '../../ui/techLogic';
import type { Nation, Player, Tech } from '../../data/types';

// ── Signals ───────────────────────────────────────────────────────────────────
export const techDialogOpen = signal(false);
/** Bump to force re-render when research data changes */
const _refreshTick = signal(0);

export function openTechDialog(): void {
  techDialogOpen.value = true;
  _refreshTick.value++;
}
export function closeTechDialog(): void { techDialogOpen.value = false; }

/** Refresh the panel (and modal if open) with latest research data. */
export function refreshTechPanel(): void { _refreshTick.value++; }

// Auto-refresh is now driven by currentTurn + researchUpdated signals
// read inside ResearchList/TechTree render bodies — no globalEvents wiring needed.

// ── Tech tree layout constants ────────────────────────────────────────────────
const XSCALE = 1.2;
const BOX_W = 180;
const BOX_H = 46;
const PAD = 8;

/**
 * Returns the active tech tree layout: the server-computed dynamic layout if
 * available (after rules:ready fires), falling back to the hardcoded static
 * positions from reqtree.ts.
 */
function getActiveLayout(): typeof reqtree {
  return (store.computedReqtree as typeof reqtree | null) ?? reqtree;
}

// ── Shared content ────────────────────────────────────────────────────────────
function ResearchList() {
  _refreshTick.value;    // explicit external refresh (refreshTechPanel / openTechDialog)
  currentTurn.value;     // re-render on each new turn
  researchUpdated.value; // re-render when research state changes
  rulesetReady.value;    // re-render when ruleset is loaded
  playerUpdated.value;   // re-render when player count/state changes
  const players = Object.values(store.players);
  return (
    <div class="xb-research-list">
      {players.length === 0 && (
        <div class="xb-research-empty">
          No player data yet.
        </div>
      )}
      {players.map((pplayer) => {
        // Prefer research_data entry; fall back to research fields merged onto player object
        const pr = research_get(pplayer) ?? (pplayer as Record<string, unknown>);
        const researching: number = (pr['researching'] as number) ?? 0;
        const techData = store.techs[researching];
        const bulbs: number = (pr['bulbs_researched'] as number) ?? 0;
        const cost: number = ((pr['researching_cost'] as number) ?? 1) || 1;
        const pct = Math.min(100, Math.round((bulbs / cost) * 100));
        const nation = store.nations[pplayer.nation] as (Nation & { color?: string }) | undefined;
        const color = nation?.color ?? 'var(--xb-accent-blue, #58a6ff)';
        const hasResearch = researching > 0;
        return (
          <div
            key={pplayer.playerno}
            class="xb-research-card"
            style={{ borderLeft: `3px solid ${color}` }}
          >
            <div class="xb-research-card-header" style={{ marginBottom: hasResearch ? 4 : 0 }}>
              {/* color is dynamic player color — kept inline */}
              <span class="xb-research-card-name" style={{ color }}>
                {pplayer.name}
              </span>
              <span class="xb-research-card-detail">
                {hasResearch ? `${techData?.name ?? `Tech #${researching}`} (${bulbs}/${cost})` : '—'}
              </span>
            </div>
            {hasResearch && <ProgressBar value={pct} max={100} color={color} />}
          </div>
        );
      })}
    </div>
  );
}

// ── Tech Tree ─────────────────────────────────────────────────────────────────

interface TechStatus {
  knownColors: string[];     // player colors who know this tech
  researchingColors: string[]; // player colors researching this tech
}

function computeTechStatus(): Map<number, TechStatus> {
  const map = new Map<number, TechStatus>();
  const players = Object.values(store.players);

  for (const techIdStr of Object.keys(getActiveLayout())) {
    const techId = Number(techIdStr);
    const known: string[] = [];
    const researching: string[] = [];

    for (const pplayer of players) {
      const pr = research_get(pplayer);
      if (!pr) continue;
      const nation = store.nations[pplayer.nation] as (Nation & { color?: string }) | undefined;
      const color = nation?.color ?? '#58a6ff';

      const techArr = pr['techs'] as Record<string, number> | undefined;
      if (techArr && techArr[techId] === TECH_KNOWN) {
        known.push(color);
      } else if ((pr['researching'] as number) === techId) {
        researching.push(color);
      }
    }
    map.set(techId, { knownColors: known, researchingColors: researching });
  }
  return map;
}

function getPrereqs(tech: Tech, layout: typeof reqtree): number[] {
  // Use the pre-processed req[] array (produced by recreate_old_tech_req)
  const req = (tech['req'] as number[] | undefined) ?? [];
  const result: number[] = [];
  for (const id of req) {
    if (id !== A_NONE && String(id) in layout) result.push(id);
  }
  return result;
}

function TechTree() {
  _refreshTick.value;    // explicit external refresh
  currentTurn.value;     // re-render on each new turn
  researchUpdated.value; // re-render when research state changes
  rulesetReady.value;    // re-render when ruleset (techs/computedReqtree) is loaded

  const techs = store.techs;
  const layout = getActiveLayout();
  const techStatus = computeTechStatus();

  // Compute canvas bounds from the active layout (dynamic or static)
  let canvasW = 0;
  let canvasH = 0;
  for (const node of Object.values(layout)) {
    canvasW = Math.max(canvasW, Math.floor(node.x * XSCALE) + BOX_W + PAD * 2);
    canvasH = Math.max(canvasH, node.y + BOX_H + PAD * 2);
  }

  // Build SVG lines for prereq connections
  const lines: { x1: number; y1: number; x2: number; y2: number; key: string }[] = [];
  for (const [techIdStr, node] of Object.entries(layout)) {
    const techId = Number(techIdStr);
    const tech = techs[techId] as Tech | undefined;
    if (!tech) continue;
    const prereqs = getPrereqs(tech, layout);
    const tx = Math.floor(node.x * XSCALE) + PAD;
    const ty = node.y + PAD;

    for (const prereqId of prereqs) {
      const preNode = layout[prereqId];
      if (!preNode) continue;
      const px = Math.floor(preNode.x * XSCALE) + PAD + BOX_W;
      const py = preNode.y + PAD + BOX_H / 2;
      lines.push({
        x1: px, y1: py,
        x2: tx, y2: ty + BOX_H / 2,
        key: `${prereqId}-${techId}`,
      });
    }
  }

  return (
    <div class="xb-tech-tree-canvas" style={{ width: canvasW, height: canvasH }}>
      {/* SVG connector lines */}
      <svg
        class="xb-tech-tree-svg"
        width={canvasW}
        height={canvasH}
      >
        {lines.map(l => (
          <line
            key={l.key}
            x1={l.x1} y1={l.y1}
            x2={l.x2} y2={l.y2}
            stroke="var(--xb-border-default, #30363d)"
            strokeWidth={1}
          />
        ))}
      </svg>

      {/* Tech boxes */}
      {Object.entries(layout).map(([techIdStr, node]) => {
        const techId = Number(techIdStr);
        const tech = techs[techId] as Tech | undefined;
        if (!tech) return null;
        const x = Math.floor(node.x * XSCALE) + PAD;
        const y = node.y + PAD;
        const status = techStatus.get(techId);
        const isResearching = (status?.researchingColors.length ?? 0) > 0;
        const knownBy = status?.knownColors.length ?? 0;
        const total = Object.keys(store.players).length;
        const allKnown = total > 0 && knownBy === total;

        // borderColor is dynamic (conditional on game state) — kept inline
        let borderColor = 'var(--xb-border-default, #30363d)';
        if (isResearching) borderColor = 'var(--xb-accent-orange, #d29922)';
        else if (allKnown) borderColor = 'var(--xb-accent-green, #3fb950)';

        return (
          <div
            key={techIdStr}
            title={`${tech['name']} — ${knownBy}/${total} players know this`}
            class="xb-tech-box"
            style={{
              left: x,
              top: y,
              width: BOX_W,
              height: BOX_H,
              border: `1px solid ${borderColor}`,
            }}
          >
            <div class="xb-tech-box-name">
              {tech['name'] as string}
            </div>
            {/* Player status dots */}
            <div class="xb-tech-box-dots">
              {(status?.researchingColors ?? []).map((c, i) => (
                <span
                  key={`r${i}`}
                  title="Researching"
                  class="xb-tech-dot xb-tech-dot-researching"
                  style={{ background: c }}
                />
              ))}
              {(status?.knownColors ?? []).map((c, i) => (
                <span
                  key={`k${i}`}
                  title="Known"
                  class="xb-tech-dot"
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── TechPanel — inline tab content with sub-tabs ──────────────────────────────
export function TechPanel() {
  const [activeTab, setActiveTab] = useState<'progress' | 'tree'>('progress');

  return (
    <div class="xb-tech-panel-root">
      {/* Sub-tab bar */}
      <div class="xb-tech-subtab-bar">
        <button
          class={`xb-tech-subtab ${activeTab === 'progress' ? 'xb-tech-subtab-active' : 'xb-tech-subtab-inactive'}`}
          onClick={() => setActiveTab('progress')}
        >
          Research Progress
        </button>
        <button
          class={`xb-tech-subtab ${activeTab === 'tree' ? 'xb-tech-subtab-active' : 'xb-tech-subtab-inactive'}`}
          onClick={() => setActiveTab('tree')}
        >
          Tech Tree
        </button>
      </div>

      {/* Tab content — padding only when not on tree tab */}
      <div
        class={`xb-tech-panel-content${activeTab !== 'tree' ? ' xb-tech-panel-content-padded' : ''}`}
      >
        {activeTab === 'progress' ? (
          <ResearchList />
        ) : (
          <div class="xb-tech-tree-wrap">
            <TechTree />
          </div>
        )}
      </div>
    </div>
  );
}

export function mountTechPanel(container: HTMLElement): void {
  render(<TechPanel />, container);
}

// ── TechDialog — floating modal ───────────────────────────────────────────────
export function TechDialog() {
  const open = techDialogOpen.value;
  const onClose = useCallback(() => { techDialogOpen.value = false; }, []);
  if (!open) return null;
  return (
    <Dialog title="Research Progress" open onClose={onClose} width={480} modal={false}>
      <ResearchList />
    </Dialog>
  );
}

// ── WikiDialog ─────────────────────────────────────────────────────────────────

export const wikiDialogSignal = signal<WikiDialogData | null>(null);

export function showWikiDialogPreact(
  tech_name: string,
  docs: Record<string, WikiDoc>,
): void {
  const data = buildWikiDialogData(tech_name, docs);
  if (data) wikiDialogSignal.value = data;
}

export function closeWikiDialog(): void { wikiDialogSignal.value = null; }

export function WikiDialog() {
  const data = wikiDialogSignal.value;
  const onClose = useCallback(() => { wikiDialogSignal.value = null; }, []);
  if (!data) return null;
  return (
    <Dialog title={data.techName} open onClose={onClose} width={600}>
      <p style={{ margin: '0 0 8px' }}>
        <strong>
          <a href={data.wikiUrl} target="_blank" rel="noopener noreferrer" class="xb-wiki-link">
            {data.title}
          </a>
        </strong>
      </p>
      {data.imageUrl && (
        <img src={data.imageUrl} alt={data.title} class="xb-wiki-image" />
      )}
      <p class="xb-wiki-summary">{data.summary}</p>
    </Dialog>
  );
}

// ── TechInfoDialog ─────────────────────────────────────────────────────────────

export const techInfoDialogSignal = signal<TechInfoDialogData | null>(null);

export function showTechInfoDialogPreact(
  tech_name: string,
  unit_type_id: number | null,
  improvement_id: number | null,
  docs: Record<string, WikiDoc>,
): void {
  techInfoDialogSignal.value = buildTechInfoDialogData(tech_name, unit_type_id, improvement_id, docs);
}

export function closeTechInfoDialog(): void { techInfoDialogSignal.value = null; }

export function TechInfoDialog() {
  const data = techInfoDialogSignal.value;
  const onClose = useCallback(() => { techInfoDialogSignal.value = null; }, []);
  if (!data) return null;

  return (
    <Dialog title={data.techName} open onClose={onClose} width={640}>
      {data.unit && (
        <section style={{ marginBottom: 12 }}>
          <p style={{ margin: '0 0 6px' }}><strong>Unit: {data.unit.name}</strong></p>
          {data.unit.helptext && <p class="xb-tech-info-helptext">{data.unit.helptext}</p>}
          <table class="xb-tech-info-table">
            <tbody>
              {([
                ['Cost',        data.unit.build_cost],
                ['Attack',      data.unit.attack_strength],
                ['Defense',     data.unit.defense_strength],
                ['Firepower',   data.unit.firepower],
                ['Hitpoints',   data.unit.hp],
                ['Moves',       data.unit.move_rate_text],
                ['Vision',      data.unit.vision_radius_sq],
              ] as [string, string | number][]).map(([label, val]) => (
                <tr key={label}>
                  <td class="xb-tech-info-dt">{label}</td>
                  <td class="xb-tech-info-dd">{val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
      {data.improvement && (
        <section style={{ marginBottom: 12 }}>
          <p style={{ margin: 0 }}><strong>Improvement info</strong>: {data.improvement.helptext}</p>
        </section>
      )}
      {data.wiki && (
        <section style={{ marginTop: data.unit || data.improvement ? 8 : 0 }}>
          <p style={{ margin: '0 0 8px' }}>
            <strong>
              <a href={data.wiki.wikiUrl} target="_blank" rel="noopener noreferrer" class="xb-wiki-link">
                Wikipedia: {data.wiki.title}
              </a>
            </strong>
          </p>
          {data.wiki.imageUrl && (
            <img src={data.wiki.imageUrl} alt={data.wiki.title} class="xb-wiki-image" />
          )}
          <p class="xb-wiki-summary">{data.wiki.summary}</p>
        </section>
      )}
    </Dialog>
  );
}
