export interface MapviewState {
  width: number;
  height: number;
  gui_x0: number;
  gui_y0: number;
  store_width: number;
  store_height: number;
  [key: string]: unknown;
}

export const mapview: MapviewState = {
  width: 0,
  height: 0,
  gui_x0: 0,
  gui_y0: 0,
  store_width: 0,
  store_height: 0,
};
