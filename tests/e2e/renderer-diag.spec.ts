/**
 * Quick diagnostic: check renderer mode and WebGL availability.
 */
import { test } from '@playwright/test';

test.describe.configure({ timeout: 30_000 });

test('renderer and webgl diagnostic', async ({ page }) => {
  await page.goto('/webclient/index.html?username=DiagUser', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(5000);

  const info2 = await page.evaluate(() => {
    const w = window as any;
    const testCanvas = document.createElement('canvas');
    const gl2 = testCanvas.getContext('webgl2');
    const gl1 = testCanvas.getContext('webgl');
    const gl = gl2 || gl1;
    return {
      storeRenderer: w.__store?.renderer,      // 1=2D, 2=Pixi
      pixiRendererExists: !!w.__store?.pixiRenderer,
      webgl2: !!gl2,
      webgl1: !!gl1,
      glRenderer: gl ? (gl as any).getParameter(0x1F01) : null,  // RENDERER string
      canvasesInDiv: document.querySelectorAll('#canvas_div canvas').length,
      mapviewCanvas: !!w.__store?.mapviewCanvas,
      civclientState: w.civclient_state,
    };
  });

  console.log('\n=== Renderer Diagnostic ===');
  console.log(JSON.stringify(info2, null, 2));

  const r = info2.storeRenderer;
  console.log(`\nRenderer: ${r === 2 ? 'Pixi/WebGL' : r === 1 ? '2D Canvas' : `unknown(${r})`}`);
  console.log(`Pixi initialized: ${info2.pixiRendererExists}`);
  console.log(`WebGL2 available: ${info2.webgl2}`);
  console.log(`WebGL1 available: ${info2.webgl1}`);
  console.log(`GL Renderer string: ${info2.glRenderer}`);
  console.log(`Canvases in #canvas_div: ${info2.canvasesInDiv}`);
});
