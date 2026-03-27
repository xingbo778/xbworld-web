import type { Page } from '@playwright/test';

interface ConnectOptions {
  username?: string;
  query?: Record<string, string>;
  waitForGamePage?: boolean;
  timeout?: number;
  settleMs?: number;
}

export async function connectAsObserver(page: Page, options: ConnectOptions = {}): Promise<boolean> {
  const {
    username = 'E2EObserver',
    query = {},
    waitForGamePage = true,
    timeout = 25_000,
    settleMs = 3_000,
  } = options;

  const params = new URLSearchParams({ ...query, username });
  await page.goto(`/webclient/index.html?${params.toString()}`, {
    waitUntil: 'domcontentloaded',
  });

  if (waitForGamePage) {
    try {
      await page.waitForSelector('#game_page', { state: 'visible', timeout });
    } catch {
      return false;
    }
    if (settleMs > 0) {
      await page.waitForTimeout(settleMs);
    }
  }

  return true;
}
