/**
 * Nation color assignment — extracts dominant color from flag sprites.
 * Extracted from tilespec.ts.
 */
import { store } from '../data/store';

export function assign_nation_color(nation_id: number): void {
  const nation = store.nations[nation_id];
  if (nation == null || nation['color'] != null) return;

  const flag_key = "f." + nation['graphic_str'];
  const flag_sprite = store.sprites[flag_key];
  if (flag_sprite == null) return;
  const c = flag_sprite.getContext('2d');
  const width = store.tileset[flag_key][2];
  const height = store.tileset[flag_key][3];
  const color_counts: Record<string, number> = {};
  if (c == null) return;
  const img_data = c.getImageData(1, 1, width - 2, height - 2).data;

  for (let i = 0; i < img_data.length; i += 4) {
    const current_color = "rgb(" + img_data[i] + "," + img_data[i + 1] + ","
                        + img_data[i + 2] + ")";
    if (current_color in color_counts) {
      color_counts[current_color] = color_counts[current_color] + 1;
    } else {
      color_counts[current_color] = 1;
    }
  }

  let max = -1;
  let max_color: string | null = null;

  for (const current_color in color_counts) {
    if (color_counts[current_color] > max) {
      max = color_counts[current_color];
      max_color = current_color;
    }
  }

  nation['color'] = max_color;
}

export function color_rbg_to_list(pcolor: string | null): number[] | null {
  if (pcolor == null) return null;
  const color_rgb = pcolor.match(/\d+/g);
  if (!color_rgb) return null;
  return [parseFloat(color_rgb[0]), parseFloat(color_rgb[1]), parseFloat(color_rgb[2])];
}
