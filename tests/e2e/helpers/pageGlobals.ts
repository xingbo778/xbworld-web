export interface XbwStoreSnapshot {
  username?: string | null;
  connectionState?: string;
  civclientState?: number;
  observing?: boolean;
  renderer?: number;
  pixiRenderer?: unknown;
  mapviewCanvas?: unknown;
  cities?: Record<string, unknown>;
  players?: Record<string, { name?: string | null }>;
  units?: Record<string, unknown>;
  terrains?: Record<string, unknown>;
  tiles?: Record<string, unknown>;
  sprites?: Record<string, unknown>;
  mapInfo?: { xsize?: number; ysize?: number; turn?: number };
  gameInfo?: { turn?: number };
}

export interface XbwSpriteDiag {
  init_sprites_called: boolean;
  preload_check_called: number;
  init_cache_called: boolean;
  phase1_started: boolean;
  phase1_done: boolean;
  phase2_batches: number;
  phase2_done: boolean;
  sprites_populated: number;
  errors: string[];
}

export interface XbwPerfMonitorSnapshot {
  label: string;
  time: number;
  usedJSHeapSize: number;
  totalJSHeapSize: number;
}

export interface XbwPerfMonitorReport {
  fps: number;
  frameCount: number;
  frameTimeP50: number;
  frameTimeP95: number;
  frameTimeP99: number;
  frameTimeMax: number;
  longTaskCount: number;
  longTaskTotalMs: number;
  longTaskMaxMs: number;
  heapSnapshots: XbwPerfMonitorSnapshot[];
}

export interface XbwPerfMonitor {
  frames: number[];
  longTasks: Array<{ start: number; duration: number }>;
  heapSnapshots: XbwPerfMonitorSnapshot[];
  start: () => void;
  stop: () => void;
  snapshot: (label: string) => void;
  report: (windowMs: number) => XbwPerfMonitorReport;
}

export interface TerrainBlendStatsSnapshot {
  matchSameRequests: number;
  matchSameKeysFound: number;
  matchSameKeysMissing: number;
  cellCornerRequests: number;
  cellCornerNullNeighbors: number;
}

export interface XbwNetworkDebug {
  state?: {
    readyState?: number | string;
    civserverport?: string | null;
    url?: string | null;
    onmessageType?: string | null;
  };
  ws?: WebSocket | null;
  forceClose?: (code: number, reason?: string, wasClean?: boolean) => { ok: boolean };
  resetReconnectState?: () => void;
}

export interface XbwMapDebug {
  setMapInfo?: (mapInfo: Record<string, unknown>) => void;
  mapInitTopology?: () => void;
  mapAllocate?: () => void;
}

export interface XbwPageGlobals extends Window {
  __store?: XbwStoreSnapshot;
  __networkDebug?: XbwNetworkDebug;
  __mapDebug?: XbwMapDebug;
  __terrainBlendStats?: TerrainBlendStatsSnapshot;
  __resetTerrainBlendStats?: () => void;
  send_message?: (message: string) => void;
  set_client_state?: (state: number) => void;
  mark_all_dirty?: () => void;
  redraw_overview?: () => void;
  update_map_canvas_full?: () => void;
  update_game_status_panel?: () => void;
  setTheme?: (theme: string) => void;
  showCityDialogPreact?: (city: unknown) => void;
  city_dialog?: { show?: (city: unknown) => void };
  cityDialogSignal?: { value: unknown };
  showIntelDialog?: () => void;
  intel_dialog?: { show?: () => void };
  tileset?: Record<string, unknown>;
  __perfMonitor?: XbwPerfMonitor;
  __perfRaf?: number;
  __spriteDiag?: XbwSpriteDiag;
  __cibCallCount?: number;
  __xbwHandleMapInfoCalled?: number;
  __xbwCenterCalled?: number;
  __xbwMidTileNull?: boolean;
  __xbwMapview?: { x0?: number; y0?: number };
  __xbwOverviewActive?: boolean;
  __xbwInitOverviewCalled?: number;
  __xbwInitOverviewNoMapInfo?: boolean;
  __xbwMapInfoXsize?: number;
  __xbwReceivedPids?: Record<string, unknown>;
  __xbwPacketCount?: number;
  __xbwOnMessageCalled?: number;
  __xbwProcessPacketsCalled?: number;
  __xbwEarlyReturn?: string | null;
  __xbwMainThreadParsing?: boolean;
  __xbwParseError?: string | null;
  __xbwGameInfoTurn?: number;
  __xbwGameInfoCalled?: number;
  __xbwSetRunningScheduled?: number;
  __xbwSetRunningFired?: number;
  __xbwAlreadyRunning?: boolean;
  __xbwSetClientStateCalled?: number[];
  __longTasks?: Array<{ name: string; startTime: number; duration: number }>;
  __longTaskDetails?: Array<Record<string, unknown>>;
  __rafCallbacks?: Array<Record<string, unknown>>;
  __intervalCallbacks?: Array<Record<string, unknown>>;
  __packetStats?: {
    handlerTimes: Record<number, number[]>;
    slowPackets: Array<{ pid: number; ms: number }>;
  };
  __perfFrames?: number[];
  __wsMessages?: number;
  __wsTotalMs?: number;
}
