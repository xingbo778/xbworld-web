export function incrementDebugCounter(name: string, delta = 1): number {
  const next = ((Reflect.get(window, name) as number | undefined) ?? 0) + delta;
  Reflect.set(window, name, next);
  return next;
}

export function incrementDebugBucket(name: string, key: number): number {
  const bucket = ((Reflect.get(window, name) as Record<number, number> | undefined) ?? {});
  const next = (bucket[key] ?? 0) + 1;
  bucket[key] = next;
  Reflect.set(window, name, bucket);
  return next;
}

export function setDebugValue(name: string, value: unknown): void {
  Reflect.set(window, name, value);
}

export function getDebugWebSocket(): WebSocket | null {
  return (Reflect.get(window, 'ws') as WebSocket | null | undefined) ?? null;
}
