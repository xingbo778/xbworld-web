/**
 * Lightweight tab widget replacing jQuery UI .tabs().
 *
 * Manages tab navigation: clicking tab links shows corresponding panels,
 * hides others, and updates active state classes.
 */

interface TabsState {
  container: HTMLElement;
  tabs: HTMLAnchorElement[];
  panels: HTMLElement[];
  active: number;
}

const instances = new Map<string, TabsState>();

/**
 * Initialize a tab container. Finds all <li><a href="#panel-id"> links
 * in the first <ul> child and the corresponding panel elements.
 */
export function initTabs(selector: string, options?: { active?: number; heightStyle?: string }): void {
  const container = document.querySelector(selector) as HTMLElement;
  if (!container) return;

  const ul = container.querySelector('ul');
  if (!ul) return;

  const tabs: HTMLAnchorElement[] = [];
  const panels: HTMLElement[] = [];

  ul.querySelectorAll('li > a[href^="#"]').forEach((a) => {
    const anchor = a as HTMLAnchorElement;
    const panelId = anchor.getAttribute('href')!.substring(1);
    const panel = document.getElementById(panelId);
    if (panel) {
      tabs.push(anchor);
      panels.push(panel);
    }
  });

  const state: TabsState = {
    container,
    tabs,
    panels,
    active: options?.active ?? 0,
  };

  // Add click handlers
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      setActiveTab(selector, i);
    });
  });

  instances.set(selector, state);

  // Apply jQuery UI compatible CSS classes for styling
  container.classList.add('ui-tabs', 'ui-widget', 'ui-widget-content', 'ui-corner-all');
  ul.classList.add('ui-tabs-nav', 'ui-helper-reset', 'ui-helper-clearfix', 'ui-widget-header', 'ui-corner-all');
  ul.setAttribute('role', 'tablist');

  tabs.forEach((tab) => {
    const li = tab.parentElement;
    if (li) {
      li.classList.add('ui-state-default', 'ui-corner-top');
      li.setAttribute('role', 'tab');
    }
    tab.classList.add('ui-tabs-anchor');
  });

  panels.forEach((panel) => {
    panel.classList.add('ui-tabs-panel', 'ui-widget-content', 'ui-corner-bottom');
    panel.setAttribute('role', 'tabpanel');
  });

  // Apply initial state
  setActiveTab(selector, state.active);

  // heightStyle: 'fill' — set container height to window height
  if (options?.heightStyle === 'fill') {
    container.style.height = window.innerHeight + 'px';
  }
}

/**
 * Set the active tab by index.
 */
export function setActiveTab(selector: string, index: number): void {
  const state = instances.get(selector);
  if (!state) return;

  state.active = index;

  state.tabs.forEach((tab, i) => {
    const li = tab.parentElement;
    if (i === index) {
      li?.classList.add('ui-tabs-active', 'ui-state-active');
      tab.setAttribute('aria-selected', 'true');
      tab.setAttribute('tabindex', '0');
    } else {
      li?.classList.remove('ui-tabs-active', 'ui-state-active');
      tab.setAttribute('aria-selected', 'false');
      tab.setAttribute('tabindex', '-1');
    }
  });

  state.panels.forEach((panel, i) => {
    panel.style.display = i === index ? '' : 'none';
  });
}

/**
 * Get the active tab index.
 */
export function getActiveTab(selector: string): number {
  return instances.get(selector)?.active ?? 0;
}

/**
 * jQuery-compatible API bridge. Called from legacy code via window.
 */
export function jqTabsBridge(el: HTMLElement, ...args: any[]): any {
  const id = '#' + el.id;
  if (args.length === 0 || (args.length === 1 && typeof args[0] === 'object')) {
    // Init: $(el).tabs(options?)
    initTabs(id, args[0]);
    return;
  }
  if (args[0] === 'option' && args[1] === 'active') {
    if (args.length === 3) {
      // Set: $(el).tabs('option', 'active', index)
      setActiveTab(id, args[2]);
    } else {
      // Get: $(el).tabs('option', 'active')
      return getActiveTab(id);
    }
  }
}
