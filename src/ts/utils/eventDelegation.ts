/**
 * Event delegation registry — replaces window globals for inline onclick strings.
 *
 * Usage:
 *   // Register:
 *   registerAction('show-city', (el) => showCity(Number(el.dataset.cityid)));
 *
 *   // In HTML:
 *   <tr data-action="show-city" data-cityid="42">
 *
 * A single 'click' listener on document handles all delegated actions.
 */

type ActionHandler = (el: HTMLElement, e: MouseEvent) => void;

const _registry = new Map<string, ActionHandler>();

/** Register a handler for the given action name. */
export function registerAction(name: string, handler: ActionHandler): void {
  _registry.set(name, handler);
}

// Single delegated click listener installed once.
document.addEventListener('click', (e: MouseEvent) => {
  const target = e.target as HTMLElement | null;
  if (!target) return;
  // Walk up to find the element with data-action
  const el = target.closest('[data-action]') as HTMLElement | null;
  if (!el) return;
  const action = el.dataset['action'];
  if (!action) return;
  const handler = _registry.get(action);
  if (handler) {
    e.preventDefault();
    handler(el, e);
  }
});
