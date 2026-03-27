/**
 * PregameLobby — Preact replacement for the pregame player-list and
 * scenario-info DOM manipulation in core/pregame.ts.
 *
 * Mounts into #pregame_game_info and #pregame_player_list (two separate
 * render roots).  Subscribed to pregameRefresh and playerUpdated signals so
 * it re-renders whenever pregame.ts bumps either counter.
 */
import { render } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import { pregameRefresh, playerUpdated, rulesetReady } from '../data/signals';
import { store } from '../data/store';
import type { Nation, Player } from '../data/types';

// ── FlagCanvas — draws a nation flag sprite onto a <canvas> ──────────────────

interface FlagCanvasProps {
  sprite: CanvasImageSource | null;
}

function FlagCanvas({ sprite }: FlagCanvasProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, 29, 20);
    if (sprite != null) ctx.drawImage(sprite, 0, 0);
  }, [sprite]);

  return (
    <canvas
      ref={ref}
      width={29}
      height={20}
      class="pregame_flags xb-flag-canvas"
    />
  );
}

// ── ScenarioInfo ──────────────────────────────────────────────────────────────

function ScenarioInfo() {
  void pregameRefresh.value;

  const si = store.scenarioInfo;
  if (!si || !si['is_scenario']) return null;

  const desc = String(si['description'] || '');
  const authors = String(si['authors'] || '');
  const noNewCities = !!si['prevent_new_cities'];
  const name = String(si['name'] || '');

  return (
    <>
      {desc && (
        <p>
          {desc.split('\n').map((line, i) => (
            <>{i > 0 && <br />}{line}</>
          ))}
        </p>
      )}
      {authors && (
        <p>
          Scenario by{' '}
          {authors.split('\n').map((line, i) => (
            <>{i > 0 && <br />}{line}</>
          ))}
        </p>
      )}
      {noNewCities && <p>{name} forbids the founding of new cities.</p>}
    </>
  );
}

// ── PlayerList ────────────────────────────────────────────────────────────────

interface PlayerRowProps {
  id: number;
  player: Player;
}

function PlayerRow({ id, player }: PlayerRowProps) {
  void rulesetReady.value;

  const name = String(player.name ?? '');
  const isAI = name.indexOf('AI') !== -1;
  const isReady = player.is_ready === true;
  const nation = store.nations[player.nation] as Nation | undefined;
  const nationAdj = nation ? String(nation.adjective || '') : '';
  const sprite = nation ? store.sprites['f.' + nation.graphic_str] ?? null : null;

  let titleText: string;
  if (isReady) {
    titleText = 'Player ready' + (nationAdj ? ' - ' + nationAdj : '');
  } else if (!isAI) {
    titleText = 'Player not ready' + (nationAdj ? ' - ' + nationAdj : '');
  } else {
    titleText = 'AI Player (random nation)';
  }

  return (
    <div
      id={'pregame_plr_' + id}
      class={'pregame_player_name' + (isReady ? ' pregame_player_ready' : '')}
      title={titleText}
      data-player-name={name}
      data-player-id={String(player.playerno)}
    >
      {sprite != null && <FlagCanvas sprite={sprite} />}
      {!sprite && nation == null && (
        <div id={isAI ? 'pregame_ai_icon' : 'pregame_player_icon'} />
      )}
      <b>{name}</b>
    </div>
  );
}

export function PlayerList() {
  void pregameRefresh.value;
  void playerUpdated.value;
  void rulesetReady.value;

  const players = Object.entries(store.players).map(([idStr, p]) => ({
    id: parseInt(idStr),
    player: p,
  }));

  return (
    <>
      {players.map(({ id, player }) => (
        <PlayerRow key={id} id={id} player={player} />
      ))}
    </>
  );
}

export function ScenarioInfoPanel() {
  return <ScenarioInfo />;
}

// ── Mount helpers ─────────────────────────────────────────────────────────────

let _mountedInfo = false;
let _mountedList = false;

export function mountPregameLobby(): void {
  const infoEl = document.getElementById('pregame_game_info');
  const listEl = document.getElementById('pregame_player_list');

  if (infoEl && !_mountedInfo) {
    render(<ScenarioInfo />, infoEl);
    _mountedInfo = true;
  }
  if (listEl && !_mountedList) {
    render(<PlayerList />, listEl);
    _mountedList = true;
  }
}
