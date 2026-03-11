/**********************************************************************
    Freeciv-web - the web version of Freeciv. https://www.freeciv.org/
    Copyright (C) 2009-2017  The Freeciv-web project

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

***********************************************************************/

import { store } from '../data/store';
import type { Player } from '../data/types';
import { player_capital, get_diplstate_text, research_get, DiplState } from '../data/player';
import { TECH_KNOWN } from '../data/tech';
import { clientIsObserver as client_is_observer, clientPlaying } from '../client/clientState';
import type { IntelData } from '../components/Dialogs/IntelDialog';
import { showIntelDialog } from '../components/Dialogs/IntelDialog';

export function show_intelligence_report_dialog(): void {
  const selected_player = store.selectedPlayer;
  if (selected_player === -1) return;
  const pplayer = store.players[selected_player]!;

  if (client_is_observer()
      || (clientPlaying()?.['real_embassy'] as { isSet(bit: number): boolean } | undefined)?.isSet(selected_player)) {
    show_intelligence_report_embassy(pplayer);
  } else {
    show_intelligence_report_hearsay(pplayer);
  }
}

export function show_intelligence_report_hearsay(pplayer: Player): void {
  const gov = (pplayer['government'] as number) > 0
    ? String(store.governments[pplayer['government'] as number]?.['name'] ?? '(Unknown)')
    : '(Unknown)';
  const gold = (pplayer['gold'] as number) > 0 ? String(pplayer['gold']) : '—';
  let researching = '—';
  const researchingId = pplayer['researching'] as number | undefined;
  if (researchingId != null && researchingId > 0 && store.techs[researchingId] != null) {
    researching = String(store.techs[researchingId]['name']);
  }
  const nationAdj = (store.nations[pplayer['nation'] as number]?.['adjective'] as string) || (pplayer['name'] as string);
  const data: IntelData = {
    ruler: String(pplayer['name']),
    government: gov,
    capital: '(Establishing an embassy will show full details)',
    gold,
    tax: '—',
    science: '—',
    luxury: '—',
    culture: '—',
    researching,
    diplomacy: [],
    knownTechs: [],
  };
  showIntelDialog(`Intelligence report: ${nationAdj}`, data);
}

/** Build typed intel data for a player (embassy-level). No HTML strings. */
export function buildIntelData(pplayer: Player): IntelData {
  const capital = player_capital(pplayer);
  const gov = store.governments[pplayer['government'] as number];

  const research = research_get(pplayer);
  let researchText = '(Unknown)';
  const knownTechs: string[] = [];

  if (research != null) {
    const researchingTech = store.techs[research['researching'] as number];
    if (researchingTech !== undefined) {
      researchText = `${researchingTech['name']} (${research['bulbs_researched']}/${research['researching_cost']})`;
    } else {
      researchText = '(Nothing)';
    }
    const inventions = research['inventions'] as Record<string, number> | undefined;
    for (const tech_id in store.techs) {
      if (inventions?.[tech_id] === TECH_KNOWN) {
        knownTechs.push(store.techs[tech_id]['name'] as string);
      }
    }
  }

  const diplomacy: IntelData['diplomacy'] = [];
  if (pplayer['diplstates'] !== undefined) {
    (pplayer['diplstates'] as Record<string, unknown>[]).forEach((st, i) => {
      if (st['state'] !== DiplState.DS_NO_CONTACT && i !== (pplayer['playerno'] as number) && store.players[i]) {
        diplomacy.push({
          nation: (store.nations[store.players[i]['nation'] as number]?.['adjective'] as string) || 'Unknown',
          state: get_diplstate_text(st['state'] as number),
        });
      }
    });
  }

  return {
    ruler: pplayer['name'] as string,
    government: gov ? (gov['name'] as string) : '(Unknown)',
    capital: capital ? (capital as Record<string, unknown>)['name'] as string : '(capital unknown)',
    gold: String(pplayer['gold']),
    tax: `${pplayer['tax']}%`,
    science: `${pplayer['science']}%`,
    luxury: `${pplayer['luxury']}%`,
    culture: String(pplayer['culture']),
    researching: researchText,
    diplomacy,
    knownTechs,
  };
}

export function show_intelligence_report_embassy(pplayer: Player): void {
  const data = buildIntelData(pplayer);
  const nationAdj = (store.nations[pplayer['nation'] as number]?.['adjective'] as string) || (pplayer['name'] as string);
  showIntelDialog(`Foreign Intelligence: ${nationAdj} Empire`, data);
}
