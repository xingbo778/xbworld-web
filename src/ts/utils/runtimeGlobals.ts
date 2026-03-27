import { store } from '../data/store';

type RuntimeGlobals = typeof globalThis & {
  __VITEST__?: unknown;
};

const runtime = globalThis as RuntimeGlobals;

export function isVitestRuntime(): boolean {
  return Boolean(runtime.__VITEST__);
}

export function getSeededRandom(): (() => number) | null {
  const rng = store.fcSeedrandom;
  return typeof rng === 'function' ? (rng as () => number) : null;
}
