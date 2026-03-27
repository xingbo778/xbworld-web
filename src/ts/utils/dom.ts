/**
 * Lightweight DOM helpers replacing jQuery.
 * Every function operates on native DOM elements.
 */
import { sanitizeGameHtml } from './safeHtml';

export function $id(id: string): HTMLElement | null {
  return document.getElementById(id);
}

export function show(el: HTMLElement | null): void {
  if (el) el.style.display = '';
}

export function hide(el: HTMLElement | null): void {
  if (el) el.style.display = 'none';
}

/**
 * Sanitize `html` and append its nodes into `container` without ever
 * setting innerHTML on a live DOM element.  The browser parses the
 * sanitized string into a detached temp element; its children are then
 * moved into the container one by one.
 */
export function appendSafeHtml(container: HTMLElement | null, html: string): void {
  if (!container) return;
  const tmp = document.createElement('div');
  tmp.innerHTML = sanitizeGameHtml(html);
  while (tmp.firstChild) container.appendChild(tmp.firstChild);
}

export function setText(el: HTMLElement | null, text: string): void {
  if (el) el.textContent = text;
}

export function addClass(el: HTMLElement | null, ...classes: string[]): void {
  if (el) el.classList.add(...classes);
}

export function removeClass(el: HTMLElement | null, ...classes: string[]): void {
  if (el) el.classList.remove(...classes);
}

export function toggleClass(el: HTMLElement | null, cls: string, force?: boolean): void {
  if (el) el.classList.toggle(cls, force);
}

export function on<K extends keyof HTMLElementEventMap>(
  el: HTMLElement | Document | Window | null,
  event: K,
  handler: (ev: HTMLElementEventMap[K]) => void,
  options?: AddEventListenerOptions,
): void {
  el?.addEventListener(event, handler as EventListener, options);
}

export function off<K extends keyof HTMLElementEventMap>(
  el: HTMLElement | Document | Window | null,
  event: K,
  handler: (ev: HTMLElementEventMap[K]) => void,
): void {
  el?.removeEventListener(event, handler as EventListener);
}

export function delegate(
  parent: HTMLElement | Document,
  selector: string,
  event: string,
  handler: (ev: Event, target: HTMLElement) => void,
): void {
  parent.addEventListener(event, (ev) => {
    const target = (ev.target as HTMLElement).closest(selector) as HTMLElement | null;
    if (target && parent.contains(target)) {
      handler(ev, target);
    }
  });
}

export function create(
  tag: string,
  attrs?: Record<string, string>,
  parent?: HTMLElement,
): HTMLElement {
  const el = document.createElement(tag);
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      el.setAttribute(k, v);
    }
  }
  if (parent) parent.appendChild(el);
  return el;
}

export function remove(el: HTMLElement | null): void {
  el?.remove();
}

export function setCSS(el: HTMLElement | null, styles: Partial<CSSStyleDeclaration>): void {
  if (!el) return;
  for (const [k, v] of Object.entries(styles)) {
    if (v == null) continue;
    el.style.setProperty(k.replace(/[A-Z]/g, c => '-' + c.toLowerCase()), String(v));
  }
}

export function ready(fn: () => void): void {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

/** Blocking UI overlay — delegates to Preact BlockingOverlay signal component. */
export function blockUI(message: string): void {
  import('../components/BlockingOverlay').then(({ showBlockingOverlay }) => showBlockingOverlay(message)).catch(() => {});
}

export function unblockUI(): void {
  import('../components/BlockingOverlay').then(({ hideBlockingOverlay }) => hideBlockingOverlay()).catch(() => {});
}
