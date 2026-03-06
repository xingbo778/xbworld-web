/**********************************************************************
    Freeciv-web - the web version of Freeciv. https://www.freeciv.org/
    Copyright (C) 2009-2015  The Freeciv-web project

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

**********************************************************************/

import { store } from '../data/store';
import { mapPosToTile } from '../data/map';
import { wrapHasFlag, WRAP_X, WRAP_Y } from '../data/map';
import { tileCity, tileGetKnown } from '../data/tile';
import { TILE_UNKNOWN } from '../data/tile';
import { tileTerrain } from '../data/terrain';
import { find_visible_unit } from './control';
import { cityOwnerPlayerId } from '../data/city';
import { center_tile_mapcanvas } from './control';
import { base_canvas_to_map_pos, canvas_pos_to_tile, mapview, mapview_slide } from '../renderer/mapviewCommon';
import { RENDERER_2DCANVAS } from './constants';
import { color_rbg_to_list } from '../renderer/tilespec';
import { clientState as client_state, C_S_RUNNING, C_S_OVER, clientPlaying } from '../client/clientState';

// Alias snake_case names to camelCase imports
const map_pos_to_tile = mapPosToTile;
const tile_city = tileCity;
const tile_get_known = tileGetKnown;
const tile_terrain = tileTerrain;
const city_owner_player_id = cityOwnerPlayerId;
const wrap_has_flag = wrapHasFlag;

export let OVERVIEW_TILE_SIZE: number = 1;
export let overviewTimerId: number = -1;
export let min_overview_width: number = 200;
export let max_overview_width: number = 300;
export let max_overview_height: number = 300;

export let OVERVIEW_REFRESH: any;

export let palette: number[][] = [];
export let palette_color_offset: number = 0;
export let palette_terrain_offset: number = 0;

export let overview_active: boolean = false;
export function setOverviewActive(v: boolean): void { overview_active = v; }

export const COLOR_OVERVIEW_UNKNOWN: number = 0; /* Black */
export const COLOR_OVERVIEW_MY_CITY: number = 1; /* white */
export const COLOR_OVERVIEW_ALLIED_CITY: number = 2;
export const COLOR_OVERVIEW_ENEMY_CITY: number = 3; /* cyan */
export const COLOR_OVERVIEW_MY_UNIT: number = 4; /* yellow */
export const COLOR_OVERVIEW_ALLIED_UNIT: number = 5;
export const COLOR_OVERVIEW_ENEMY_UNIT: number = 6; /* red */
export const COLOR_OVERVIEW_VIEWRECT: number = 7; /* white */

export let overview_hash: number = -1;
export let overview_current_state: any = null;


/****************************************************************************
  Initialize the overview map.
****************************************************************************/
export function init_overview(): void {
  while (min_overview_width > OVERVIEW_TILE_SIZE * (store.mapInfo as any)['xsize']) {
    OVERVIEW_TILE_SIZE++;
  }

  overview_active = true;

  const panel = document.getElementById('game_overview_panel');
  if (panel) {
    panel.title = 'World map';
    panel.style.display = 'block';
  }

  palette = generate_palette();

  redraw_overview();

  let new_width = OVERVIEW_TILE_SIZE * (store.mapInfo as any)['xsize'];
  if (new_width > max_overview_width) new_width = max_overview_width;
  let new_height = OVERVIEW_TILE_SIZE * (store.mapInfo as any)['ysize'];
  if (new_height > max_overview_height) new_height = max_overview_height;

  const overviewMap = document.getElementById('overview_map');
  if (overviewMap) {
    overviewMap.style.width = new_width + 'px';
    overviewMap.style.height = new_height + 'px';
    overviewMap.ondragstart = (e) => e.preventDefault();
  }
}

/****************************************************************************
  Redraw the overview map.
****************************************************************************/
export function redraw_overview(): void {
  if (!overview_active || mapview_slide['active'] || C_S_RUNNING > client_state()
      || (store.mapInfo as any)['xsize'] == null || (store.mapInfo as any)['ysize'] == null
      || !document.getElementById('overview_map')) return;

  const hash: number = generate_overview_hash((store.mapInfo as any)['xsize'], (store.mapInfo as any)['ysize']);

  if (hash != overview_hash) {
    renderOverviewToCanvas(
      generate_overview_grid((store.mapInfo as any)['xsize'], (store.mapInfo as any)['ysize']),
      palette
    );
    overview_hash = hash;
    render_viewrect();
  }
}


/****************************************************************************
  Render the overview grid directly to the canvas element (replaces bmp_lib).
****************************************************************************/
function renderOverviewToCanvas(grid: number[][], pal: number[][]): void {
  const canvas = document.getElementById('overview_img') as HTMLCanvasElement | null;
  if (!canvas || !grid.length || !grid[0].length || !pal.length) return;
  const rows = grid.length;
  const cols = grid[0].length;
  canvas.width = cols;
  canvas.height = rows;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const imageData = ctx.createImageData(cols, rows);
  const data = imageData.data;
  for (let y = 0; y < rows; y++) {
    const row = grid[y];
    if (!row) continue;
    for (let x = 0; x < cols; x++) {
      const idx = (y * cols + x) * 4;
      const colorIdx = row[x];
      if (colorIdx !== undefined && pal[colorIdx]) {
        const color = pal[colorIdx];
        data[idx] = color[0];
        data[idx + 1] = color[1];
        data[idx + 2] = color[2];
      }
      data[idx + 3] = 255;
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

/****************************************************************************
  Creates a grid representing the image for the overview map.
****************************************************************************/
export function generate_overview_grid(cols: number, rows: number): number[][] {
  // Loop variables
  let row: number;

  if (cols & 1) cols -= 1;  //Bugfix, the overview map doesn't support map size which is odd.
  if (rows & 1) rows -= 1;

  // The grid of points that make up the image.
  const grid: number[][] = Array(rows*OVERVIEW_TILE_SIZE);
  for (row = 0; row < rows * OVERVIEW_TILE_SIZE; row++) {
    grid[row] = Array(cols * OVERVIEW_TILE_SIZE);
  }

  for (let x = 0; x < rows ; x++) {
    for (let y = 0; y < cols; y++) {
      const ocolor: number = overview_tile_color(y, x);
      render_multipixel(grid, x, y, ocolor);
    }
  }

  return grid;
}

/****************************************************************************
  Creates a hash of the current overview map.
****************************************************************************/
export function generate_overview_hash(cols: number, rows: number): number {

  let hash: number = 0;

  for (let x = 0; x < rows ; x++) {
    for (let y = 0; y < cols; y++) {
      hash += overview_tile_color(y, x);
    }
  }

  const r: any = base_canvas_to_map_pos(0, 0);
  if (r != null) {
    hash += r['map_x'];
    hash += r['map_y'];
  }
  return hash;
}

/****************************************************************************
  ...
****************************************************************************/
export function render_viewrect(): void {
  if (C_S_RUNNING != client_state() && C_S_OVER != client_state()) return;

  const path: number[][] = [];

  if (mapview['gui_x0'] != 0 && mapview['gui_y0'] != 0) {

    let point: any = base_canvas_to_map_pos(0, 0);
    path.push([point.map_x, point.map_y]);
    point = base_canvas_to_map_pos(mapview['width'] ?? 0, 0);
    path.push([point.map_x, point.map_y]);
    point = base_canvas_to_map_pos(mapview['width'] ?? 0, mapview['height'] ?? 0);
    path.push([point.map_x, point.map_y]);
    point = base_canvas_to_map_pos(0, mapview['height'] ?? 0);
    path.push([point.map_x, point.map_y]);

  }

  const viewrect_canvas: HTMLCanvasElement | null = document.getElementById('overview_viewrect') as HTMLCanvasElement | null;
  if (viewrect_canvas == null) return;

  const overviewMap = document.getElementById('overview_map');
  const map_w: number = overviewMap?.offsetWidth ?? 200;
  const map_h: number = overviewMap?.offsetHeight ?? 200;
  viewrect_canvas.width = map_w;
  viewrect_canvas.height = map_h;

  const viewrect_ctx: CanvasRenderingContext2D | null = viewrect_canvas.getContext("2d");
  if (viewrect_ctx == null) return;

  viewrect_ctx.clearRect(0, 0, map_w, map_h);
  viewrect_ctx.strokeStyle = 'rgb(200,200,255)';
  viewrect_ctx.lineWidth = (store.mapInfo as any).xsize / map_w;
  viewrect_ctx.scale(map_w/(store.mapInfo as any).xsize, map_h/(store.mapInfo as any).ysize);

  viewrect_ctx.beginPath();
  add_closed_path(viewrect_ctx, path);

  if (wrap_has_flag(WRAP_X)) {
    viewrect_ctx.save();
    viewrect_ctx.translate((store.mapInfo as any).xsize, 0);
    add_closed_path(viewrect_ctx, path);
    viewrect_ctx.translate(-2 * (store.mapInfo as any).xsize, 0);
    add_closed_path(viewrect_ctx, path);
    viewrect_ctx.restore();
  }

  if (wrap_has_flag(WRAP_Y)) {
    viewrect_ctx.translate(0, (store.mapInfo as any).ysize);
    add_closed_path(viewrect_ctx, path);
    viewrect_ctx.translate(0, -2 * (store.mapInfo as any).ysize);
    add_closed_path(viewrect_ctx, path);
    if (wrap_has_flag(WRAP_X)) {
      viewrect_ctx.translate(-(store.mapInfo as any).xsize, 0);
      add_closed_path(viewrect_ctx, path);
      viewrect_ctx.translate(0, 2 * (store.mapInfo as any).ysize);
      add_closed_path(viewrect_ctx, path);
      viewrect_ctx.translate(2 * (store.mapInfo as any).xsize, 0);
      add_closed_path(viewrect_ctx, path);
      viewrect_ctx.translate(0, -2 * (store.mapInfo as any).ysize);
      add_closed_path(viewrect_ctx, path);
    }
  }

  viewrect_ctx.stroke();
}

export function add_closed_path(ctx: CanvasRenderingContext2D, path: number[][]): void {
  if (path.length === 0) return;
  ctx.moveTo(path[0][0], path[0][1]);
  for (let i = 1; i < path.length; i++) {
    ctx.lineTo(path[i][0], path[i][1]);
  }
  ctx.lineTo(path[0][0], path[0][1]);
}

/****************************************************************************
  ...
****************************************************************************/
export function render_multipixel(grid: number[][], x: number, y: number, ocolor: number): void {
  if (x >= 0 && y >= 0 && x < (store.mapInfo as any)['ysize'] && y < (store.mapInfo as any)['xsize']) {
    for (let px = 0; px < OVERVIEW_TILE_SIZE; px++) {
      for (let py = 0; py < OVERVIEW_TILE_SIZE; py++) {
          grid[(OVERVIEW_TILE_SIZE*x)+px][(OVERVIEW_TILE_SIZE*y)+py] = ocolor;
      }
    }
  }
}

/****************************************************************************
  Creates the palette for the overview map.
****************************************************************************/
export function generate_palette(): number[][] {
  const palette: number[][] = [];
  palette[COLOR_OVERVIEW_UNKNOWN] = [0,0,0];
  palette[COLOR_OVERVIEW_MY_CITY] = [255,255,255];
  palette[COLOR_OVERVIEW_ALLIED_CITY] = [0,255,255];
  palette[COLOR_OVERVIEW_ENEMY_CITY] = [0,255,255];
  palette[COLOR_OVERVIEW_MY_UNIT] = [255,255,0];
  palette[COLOR_OVERVIEW_ALLIED_UNIT] = [255,0,0];
  palette[COLOR_OVERVIEW_ENEMY_UNIT] = [255,0,0];
  palette[COLOR_OVERVIEW_VIEWRECT] = [200,200,255];
  palette_terrain_offset = palette.length;
  for (const terrain_id in store.terrains) {
    const terrain: any = store.terrains[terrain_id];
    palette.push([terrain['color_red'], terrain['color_green'], terrain['color_blue']]);
  }

  palette_color_offset = palette.length;
  const player_count: number = Object.keys(store.players).length;

  for (const player_id_str in store.players) {
    const player_id = Number(player_id_str);
    const pplayer: any = store.players[player_id];
    if (pplayer['nation'] == -1) {
      palette[palette_color_offset+(player_id % player_count)] = [0,0,0];
    } else {
      const pcolor: any = store.nations[pplayer['nation']]['color'];
      if (pcolor != null) {
        palette[palette_color_offset+(player_id % player_count)] = color_rbg_to_list(pcolor) ?? [];
      } else {
        palette[palette_color_offset+(player_id % player_count)] = [0,0,0];
      }
    }
  }
  return palette;
}

/****************************************************************************
  Returns the color of the tile at the given map position.
****************************************************************************/
export function overview_tile_color(map_x: number, map_y: number): number {
  const ptile: any = map_pos_to_tile(map_x, map_y);

  const pcity: any = tile_city(ptile);

  if (pcity != null) {
    if (clientPlaying() == null) {
      return COLOR_OVERVIEW_ENEMY_CITY;
    } else if (city_owner_player_id(pcity) == clientPlaying()['id']) {
      return COLOR_OVERVIEW_MY_CITY;
    } else {
      return COLOR_OVERVIEW_ENEMY_CITY;
    }
  }

  const punit: any = find_visible_unit(ptile);
  if (punit != null) {
    if (clientPlaying() == null) {
      return COLOR_OVERVIEW_ENEMY_UNIT;
    } else if (punit['owner'] == clientPlaying()['id']) {
      return COLOR_OVERVIEW_MY_UNIT;
    } else if (punit['owner'] != null && punit['owner'] != 255) {
      return palette_color_offset + punit['owner'];
    } else {
      return COLOR_OVERVIEW_ENEMY_UNIT;
    }
  }

  if (tile_get_known(ptile) != TILE_UNKNOWN) {
    if (ptile['owner'] != null && ptile['owner'] != 255) {
      return palette_color_offset + ptile['owner'];
    } else {
      return palette_terrain_offset + tile_terrain(ptile)!['id'];
    }
  }

  return COLOR_OVERVIEW_UNKNOWN;
}


/****************************************************************************
  ...
****************************************************************************/
export function overview_clicked (x: number, y: number): void {
  const overviewMap = document.getElementById('overview_map');
  const width: number = overviewMap?.offsetWidth ?? 200;
  const height: number = overviewMap?.offsetHeight ?? 200;

  const x1: number = Math.floor((x * (store.mapInfo as any)['xsize']) / width);
  const y1: number = Math.floor((y * (store.mapInfo as any)['ysize']) / height);

  const ptile: any = map_pos_to_tile(x1, y1);
  if (ptile != null) {
    center_tile_mapcanvas(ptile);
  }

  redraw_overview();
}
