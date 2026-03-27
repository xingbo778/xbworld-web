export function setWindowValue(name: string, value: unknown): void {
  Reflect.set(window, name, value);
}

export function getWindowValue<T>(name: string): T | undefined {
  return Reflect.get(window, name) as T | undefined;
}

export function defineWindowGetter<T>(name: string, get: () => T): void {
  try {
    Object.defineProperty(window, name, {
      get,
      configurable: true,
      enumerable: true,
    });
  } catch {
    // defineProperty on window may fail in some environments
  }
}
