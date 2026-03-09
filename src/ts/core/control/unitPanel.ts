/**
 * Unit panel UI — observer mode stubs.
 *
 * In observer mode all three functions are no-ops:
 *   - update_unit_order_commands: observer guard returns {} immediately
 *   - init_game_unit_panel:       store.observing guard returns immediately
 *   - update_active_units_dialog: observer guard returns immediately
 *
 * The full player-mode implementations (GameDialog, DOM order buttons,
 * unit sprite rendering) have been removed.
 */

export function update_unit_order_commands(): { [key: string]: { name: string } } {
  return {};
}

export function init_game_unit_panel(): void {}

export function update_active_units_dialog(): void {}
