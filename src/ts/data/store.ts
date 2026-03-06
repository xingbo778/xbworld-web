/**
 * Centralized game state store.
 * Replaces the scattered global variables with a single reactive store.
 */

import type {
  GameInfo,
  CalendarInfo,
  MapInfo,
  Tile,
  Terrain,
  UnitType,
  Unit,
  City,
  Player,
  Tech,
  Connection,
  Nation,
  Government,
  Improvement,
  Extra,
  ServerSetting,
} from './types';
import { globalEvents } from '../core/events';

export interface ClientState {
  conn: {
    id: number;
    playing: Player | null;
    established?: boolean;
    player_num?: number;
    observer?: boolean;
    [key: string]: unknown;
  };
}

class GameStore {
  gameInfo: GameInfo | null = null;
  calendarInfo: CalendarInfo | null = null;
  mapInfo: MapInfo | null = null;
  rulesControl: Record<string, unknown> | null = null;
  rulesSummary: string | null = null;
  rulesDescription: string | null = null;

  tiles: Record<number, Tile> = {};
  terrains: Record<number, Terrain> = {};
  unitTypes: Record<number, UnitType> = {};
  units: Record<number, Unit> = {};
  cities: Record<number, City> = {};
  players: Record<number, Player> = {};
  techs: Record<number, Tech> = {};
  connections: Record<number, Connection> = {};
  nations: Record<number, Nation> = {};
  governments: Record<number, Government> = {};
  improvements: Record<number, Improvement> = {};
  extras: Record<number, Extra> = {};
  serverSettings: Record<string, ServerSetting> = {};

  // Ruleset data (previously window globals)
  resources: Record<number, any> = {};
  gameRules: any = null;
  specialists: Record<number, any> = {};
  nationGroups: any[] = [];
  cityRules: Record<number, any> = {};
  actions: Record<number, any> = {};
  goods: Record<number, any> = {};
  clauseInfos: Record<number, any> = {};
  effects: Record<string, any[]> = {};
  unitClasses: Record<number, any> = {};
  terrainControl: any = {};
  singleMove: number | undefined = undefined;
  extraIds: Record<string, number> = {};  // EXTRA_ROAD, EXTRA_RAIL, etc.

  // Rendering/runtime state (previously window globals)
  renderer: number = 0;  // RENDERER_2DCANVAS etc.
  sprites: Record<string, any> = {};
  tileset: Record<string, any> = {};
  scenarioInfo: any = null;
  selectedPlayer: number = -1;
  diplstates: Record<number, any> = {};
  civserverport: string | number = '';
  freecivWikiDocs: Record<string, string> = {};

  client: ClientState = {
    conn: { id: 0, playing: null },
  };

  // Client-side state
  username: string | null = null;
  gameType: string = '';
  observing = false;
  frozen = false;
  phaseStartTime = 0;
  debugActive = false;
  autostart = false;

  reset(): void {
    this.tiles = {};
    this.terrains = {};
    this.unitTypes = {};
    this.units = {};
    this.cities = {};
    this.players = {};
    this.techs = {};
    this.connections = {};
    this.client.conn = { id: 0, playing: null };
    globalEvents.emit('store:reset');
  }

  findCityById(id: number): City | undefined {
    return this.cities[id];
  }

  findUnitById(id: number): Unit | undefined {
    return this.units[id];
  }

  findPlayerById(id: number): Player | undefined {
    return this.players[id];
  }

  getTile(index: number): Tile | undefined {
    return this.tiles[index];
  }
}

export const store = new GameStore();
