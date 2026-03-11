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
import { rulesetReady } from '../../data/signals';
import { research_get } from '../../data/player';
import { globalEvents } from '../../core/events';
import { reqtree } from '../../data/reqtree';
import { A_NONE, TECH_KNOWN } from '../../data/tech';
import { Dialog } from '../Shared/Dialog';
import { ProgressBar } from '../Shared/ProgressBar';
import {
  buildWikiDialogData,
  buildTechInfoDialogData,
} from '../../ui/techLogic';
import type { WikiDialogData, TechInfoDialogData, WikiDoc } from '../../ui/techLogic';
import type { Tech } from '../../data/types';

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

// Auto-refresh on game events
globalEvents.on('game:beginturn', () => { _refreshTick.value++; });
globalEvents.on('player:research', () => { _refreshTick.value++; });

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
  _refreshTick.value;    // subscribe to turn/research events
  rulesetReady.value;    // re-render when ruleset is loaded
  const players = Object.values(store.players);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {players.length === 0 && (
        <div style={{ color: 'var(--xb-text-secondary, #8b949e)', fontSize: 'var(--xb-font-size-sm, 12px)' }}>
          No player data yet.
        </div>
      )}
      {players.map((pplayer) => {
        const pr = research_get(pplayer);
        if (!pr) return null;
        const researching: number = pr['researching'] as number;
        const techData = store.techs[researching];
        const bulbs: number = (pr['bulbs_researched'] as number) ?? 0;
        const cost: number = ((pr['researching_cost'] as number) ?? 1) || 1;
        const pct = Math.min(100, Math.round((bulbs / cost) * 100));
        const nation = store.nations[(pplayer as Record<string, unknown>)['nation'] as number];
        const color: string = (nation as Record<string, unknown> | undefined)?.['color'] as string ?? 'var(--xb-accent-blue, #58a6ff)';
        return (
          <div
            key={(pplayer as Record<string, unknown>)['playerno'] as number}
            style={{
              background: 'var(--xb-bg-secondary, #161b22)',
              border: '1px solid var(--xb-border-default, #30363d)',
              borderRadius: 6,
              padding: '8px 12px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <span style={{ fontWeight: 600, color }}>
                {(pplayer as Record<string, unknown>)['name'] as string}
              </span>
              <span style={{ color: 'var(--xb-text-secondary, #8b949e)', fontSize: 'var(--xb-font-size-sm, 12px)' }}>
                {techData ? `${techData['name']} (${bulbs}/${cost})` : 'None'}
              </span>
            </div>
            <ProgressBar value={pct} max={100} color={color} />
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
      const nation = store.nations[(pplayer as Record<string, unknown>)['nation'] as number];
      const color = (nation as Record<string, unknown> | undefined)?.['color'] as string ?? '#58a6ff';

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
  _refreshTick.value; // subscribe to turn/research events
  rulesetReady.value; // re-render when ruleset (techs/computedReqtree) is loaded

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
    <div style={{ position: 'relative', width: canvasW, height: canvasH, flexShrink: 0 }}>
      {/* SVG connector lines */}
      <svg
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
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

        let borderColor = 'var(--xb-border-default, #30363d)';
        if (isResearching) borderColor = '#d4a017';
        else if (allKnown) borderColor = '#3fb950';

        return (
          <div
            key={techIdStr}
            title={`${tech['name']} — ${knownBy}/${total} players know this`}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: BOX_W,
              height: BOX_H,
              background: 'var(--xb-bg-secondary, #161b22)',
              border: `1px solid ${borderColor}`,
              borderRadius: 4,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '2px 6px',
              boxSizing: 'border-box',
              overflow: 'hidden',
            }}
          >
            <div style={{
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--xb-text-primary, #e6edf3)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {tech['name'] as string}
            </div>
            {/* Player status dots */}
            <div style={{ display: 'flex', gap: 2, marginTop: 2, flexWrap: 'nowrap', overflow: 'hidden' }}>
              {(status?.researchingColors ?? []).map((c, i) => (
                <span
                  key={`r${i}`}
                  title="Researching"
                  style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: c, outline: '1px solid #d4a017',
                    flexShrink: 0,
                  }}
                />
              ))}
              {(status?.knownColors ?? []).map((c, i) => (
                <span
                  key={`k${i}`}
                  title="Known"
                  style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: c,
                    flexShrink: 0,
                  }}
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

  const tabStyle = (active: boolean) => ({
    padding: '4px 12px',
    cursor: 'pointer',
    border: 'none',
    borderBottom: active ? '2px solid var(--xb-accent-blue, #58a6ff)' : '2px solid transparent',
    background: 'none',
    color: active ? 'var(--xb-text-primary, #e6edf3)' : 'var(--xb-text-secondary, #8b949e)',
    fontSize: 13,
    fontWeight: active ? 600 : 400,
  } as const);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Sub-tab bar */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--xb-border-default, #30363d)',
        padding: '4px 8px 0',
        flexShrink: 0,
      }}>
        <button style={tabStyle(activeTab === 'progress')} onClick={() => setActiveTab('progress')}>
          Research Progress
        </button>
        <button style={tabStyle(activeTab === 'tree')} onClick={() => setActiveTab('tree')}>
          Tech Tree
        </button>
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, overflow: 'auto', padding: activeTab === 'tree' ? 0 : 12 }}>
        {activeTab === 'progress' ? (
          <ResearchList />
        ) : (
          <div style={{ overflow: 'auto', width: '100%', height: '100%' }}>
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
          <a href={data.wikiUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
            {data.title}
          </a>
        </strong>
      </p>
      {data.imageUrl && (
        <img src={data.imageUrl} alt={data.title} style={{ maxWidth: '100%', marginBottom: 8, display: 'block' }} />
      )}
      <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{data.summary}</p>
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

  const dtStyle = { fontWeight: 600, paddingRight: 8, color: 'var(--xb-text-secondary, #8b949e)', whiteSpace: 'nowrap' as const };
  const ddStyle = { margin: 0 };

  return (
    <Dialog title={data.techName} open onClose={onClose} width={640}>
      {data.unit && (
        <section style={{ marginBottom: 12 }}>
          <p style={{ margin: '0 0 6px' }}><strong>Unit: {data.unit.name}</strong></p>
          {data.unit.helptext && <p style={{ margin: '0 0 6px', color: 'var(--xb-text-secondary, #8b949e)', fontSize: 'var(--xb-font-size-sm, 12px)' }}>{data.unit.helptext}</p>}
          <table style={{ borderCollapse: 'collapse', fontSize: 'var(--xb-font-size-sm, 12px)' }}>
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
                  <td style={dtStyle}>{label}</td>
                  <td style={ddStyle}>{val}</td>
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
              <a href={data.wiki.wikiUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
                Wikipedia: {data.wiki.title}
              </a>
            </strong>
          </p>
          {data.wiki.imageUrl && (
            <img src={data.wiki.imageUrl} alt={data.wiki.title} style={{ maxWidth: '100%', marginBottom: 8, display: 'block' }} />
          )}
          <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{data.wiki.summary}</p>
        </section>
      )}
    </Dialog>
  );
}
