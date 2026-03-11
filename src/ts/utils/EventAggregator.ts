/**
 * Aggregates events to call their handler at a reduced frequency.
 * Ported from javascript/libs/EventAggregator.js into the TS bundle.
 */

export const DP_NONE = 0;
export const DP_FIRST = 1;
export const DP_LAST = 2;
export const DP_COUNT = 3;
export const DP_ALL = 4;

export class EventAggregator {
  static DP_NONE = DP_NONE;
  static DP_FIRST = DP_FIRST;
  static DP_LAST = DP_LAST;
  static DP_COUNT = DP_COUNT;
  static DP_ALL = DP_ALL;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  handler: Function;
  timeout: number;
  latency: number;
  maxDelays: number;
  delayTimeout: number;
  dataPolicy: number;
  timer: ReturnType<typeof setTimeout> | null = null;
  data: unknown;
  burst = false;
  delays = 0;
  count = 0;

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    handler: Function,
    timeout?: number,
    dataPolicy?: number,
    latency?: number,
    maxDelays?: number,
    delayTimeout?: number
  ) {
    this.handler = handler;
    this.timeout = timeout || 1000;
    this.latency = latency === 0 ? 0 : (latency || this.timeout);
    this.maxDelays = maxDelays || 0;
    this.delayTimeout = delayTimeout === 0 ? 0 : (delayTimeout || this.timeout / 2);
    this.dataPolicy = dataPolicy || DP_NONE;
    this.clear();
  }

  private _setTimeout(delay: number) {
    return setTimeout(() => this.fired(), delay);
  }

  fireNow(): void {
    if (this.count > 0) {
      const count = this.count;
      const data = this.data;
      this.cancel();
      this.clear();
      switch (this.dataPolicy) {
        case DP_FIRST:
        case DP_LAST:
        case DP_ALL:
          this.handler(data);
          break;
        case DP_COUNT:
          this.handler(count);
          break;
        default:
          this.handler();
      }
      if (this.latency > 0) {
        this.timer = this._setTimeout(this.latency);
      }
    }
  }

  update(data?: unknown): void {
    switch (this.dataPolicy) {
      case DP_FIRST:
        if (this.count === 0) this.data = data;
        break;
      case DP_LAST:
        this.data = data;
        break;
      case DP_ALL:
        (this.data as unknown[]).push(data);
        break;
    }
    this.count++;
    if (this.timer === null) {
      this.timer = this._setTimeout(this.timeout);
    } else if (this.count > 1) {
      this.burst = true;
    }
  }

  private fired(): void {
    if (this.burst && this.delays < this.maxDelays) {
      this.burst = false;
      this.delays++;
      this.timer = this._setTimeout(this.delayTimeout);
    } else {
      this.timer = null;
      this.fireNow();
    }
  }

  cancel(): void {
    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  clear(): void {
    if (this.dataPolicy === DP_ALL) {
      this.data = [];
    } else {
      this.data = undefined;
    }
    this.burst = false;
    this.delays = 0;
    this.count = 0;
  }
}

