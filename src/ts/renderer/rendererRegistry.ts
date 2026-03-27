export interface ActiveRenderer {
  resize(): void;
  markAllDirty(): void;
}

let activeRenderer: ActiveRenderer | null = null;

export function setActiveRenderer(renderer: ActiveRenderer): void {
  activeRenderer = renderer;
}

export function getActiveRenderer(): ActiveRenderer | null {
  return activeRenderer;
}

export function clearActiveRenderer(renderer?: ActiveRenderer): void {
  if (renderer == null || activeRenderer === renderer) {
    activeRenderer = null;
  }
}
