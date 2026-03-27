export interface MapCanvasContextMenuTarget extends HTMLCanvasElement {
  contextMenu?(open: boolean): void;
}

export function getMapCanvasContainer(): HTMLElement | null {
  return document.getElementById('canvas_div');
}

export function getMapCanvas(): MapCanvasContextMenuTarget | null {
  return getMapCanvasContainer()?.querySelector('canvas') as MapCanvasContextMenuTarget | null;
}

export function getMapInputTarget(): HTMLElement | null {
  return getMapCanvas() ?? getMapCanvasContainer();
}

export function getMapInputRect(): DOMRect | null {
  return getMapInputTarget()?.getBoundingClientRect() ?? null;
}

export function setMapCursor(cursor: string): void {
  const target = getMapInputTarget();
  if (target) target.style.cursor = cursor;
}

export function setMapContextMenuOpen(open: boolean): void {
  getMapCanvas()?.contextMenu?.(open);
}

export function dispatchMapContextMenu(): void {
  getMapInputTarget()?.dispatchEvent(new Event('contextmenu'));
}
