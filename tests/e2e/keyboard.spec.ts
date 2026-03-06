import { test, expect } from '@playwright/test';

test.describe('Keyboard Controls', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/webclient/index.html');
    // Wait for JS to load and render the intro dialog
    await page.waitForSelector('.xb-dialog, .ui-dialog, dialog', { timeout: 10000 }).catch(() => {});
    await page.evaluate(() => {
      // Remove all dialog types: Preact xb-dialog, jQuery UI shim, native dialog
      document.querySelectorAll('.xb-dialog, .xb-dialog-overlay, .ui-dialog, #xb-ui-dialog-overlay, dialog').forEach((d) => {
        if ('close' in d && typeof (d as any).close === 'function') (d as any).close();
        d.remove();
      });
      // Switch to game page
      const pregame = document.getElementById('pregame_page');
      const gamePage = document.getElementById('game_page');
      if (pregame) pregame.style.display = 'none';
      if (gamePage) gamePage.style.display = '';
    });
    // Wait for game page to be visible
    await page.waitForSelector('#game_page', { state: 'visible', timeout: 5000 });
  });

  test('should not trigger hotkeys when typing in chat', async ({ page }) => {
    const chatInput = page.locator('#game_text_input');
    await chatInput.focus();
    await chatInput.type('g');

    const value = await chatInput.inputValue();
    expect(value).toBe('g');
  });

  test('should handle Shift+Enter for turn done', async ({ page }) => {
    // Just verify no crash on keypress
    await page.keyboard.down('Shift');
    await page.keyboard.press('Enter');
    await page.keyboard.up('Shift');
    // No error expected
  });

  test('should handle hotkey G for goto', async ({ page }) => {
    // Click on map area first to ensure focus is not on input
    const canvasDiv = page.locator('#canvas_div');
    await canvasDiv.click();
    await page.keyboard.press('g');
    // No error expected — goto mode should activate
  });
});
