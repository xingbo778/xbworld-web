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
  resources: Record<number, Record<string, unknown> & { id: number }> = {};
  gameRules: Record<string, unknown> | null = null;
  specialists: Record<number, Record<string, unknown> & { id: number }> = {};
  nationGroups: unknown[] = [];
  cityRules: Record<number, Record<string, unknown> & { style_id: number }> = {};
  actions: Record<number, Record<string, unknown> & { id: number; enablers: unknown[] }> = {};
  goods: Record<number, Record<string, unknown> & { id: number }> = {};
  clauseInfos: Record<number, Record<string, unknown> & { type: number }> = {};
  effects: Record<string, (Record<string, unknown> & { effect_type: number })[]> = {};
  unitClasses: Record<number, Record<string, unknown> & { id: number; flags: number[] }> = {};
  terrainControl: Record<string, unknown> & { move_fragments?: number } = {};
  singleMove: number | undefined = undefined;
  extraIds: Record<string, number> = {};  // EXTRA_ROAD, EXTRA_RAIL, etc.

  // Rendering/runtime state (previously window globals)
  renderer: number = 0;  // RENDERER_2DCANVAS etc.
  sprites: Record<string, HTMLCanvasElement> = {};
  tileset: Record<string, number[]> = {};
  scenarioInfo: Record<string, unknown> | null = null;
  selectedPlayer: number = -1;
  diplstates: Record<number, number> = {};
  civserverport: string | number = '';
  freecivWikiDocs: Record<string, { image: string | null; summary: string; title: string }> = {};

  // Canvas/map rendering state
  mapviewCanvasCtx: CanvasRenderingContext2D | null = null;
  bufferCanvas: HTMLCanvasElement | null = null;
  bufferCanvasCtx: CanvasRenderingContext2D | null = null;
  mapviewCanvas: HTMLCanvasElement | null = null;
  dashedSupport: boolean = false;
  fullfog: string[] = [];

  // UI interaction state
  contextMenuActive: boolean = false;
  keyboardInput: boolean = true;
  mapviewMouseMovement: boolean = false;
  currentFocus: Unit[] = [];
  soundsEnabled: boolean = false;

  // Timer/network state
  lastTurnChangeTime: number = 0;
  turnChangeElapsed: number = 0;
  secondsToPhasedone: number = 0;
  secondsToPhasedoneSync: number = 0;
  pingLast: number = 0;
  connPingInfo: Record<string, unknown> | null = null;
  debugPingList: number[] = [];
  savedThisTurn: boolean = false;
  endgamePlayerInfo: Record<string, unknown>[] = [];
  benchmarkStart: number = 0;
  autoAttack: boolean = false;
  cityTileMap: { radius_sq: number; radius: number; base_sorted: number[][]; maps: (number[] | null)[] } | null = null;

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
  fcSeedrandom: (() => number) | null = null;
  civclientState: number = 0;  // ClientState enum
  heightOffset: number = 52;
  widthOffset: number = 10;

  // Timer IDs
  timeoutTimerId: ReturnType<typeof setInterval> | null = null;
  statusTimerId: ReturnType<typeof setInterval> | null = null;
  overviewTimerId: ReturnType<typeof setInterval> | null = null;

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
