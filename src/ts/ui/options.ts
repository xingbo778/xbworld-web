/**
 * Game render option flags — imported by renderer and control modules.
 * These are set at startup or updated via server settings (setDrawFogOfWar).
 */

export const auto_center_on_unit: boolean = true;
export const popup_actor_arrival: boolean = true;
export let draw_fog_of_war: boolean = true;
/** Update the fog-of-war render flag from a server setting change. */
export function setDrawFogOfWar(val: boolean): void { draw_fog_of_war = val; }
export const draw_units: boolean = true;
export const draw_focus_unit: boolean = false;
