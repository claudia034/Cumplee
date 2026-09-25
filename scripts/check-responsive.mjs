import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const sizes = [[320, 568], [375, 667], [390, 844], [430, 932], [768, 1024], [1366, 768], [1440, 900], [1920, 1080], [844, 390]];
try {
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(process.env.TEST_URL || 'http://127.0.0.1:5173/');
  await page.evaluate(() => document.fonts.ready);
  for (const [width, height] of sizes) {
    await page.setViewportSize({ width, height });
    for (let slide = 1; slide <= 7; slide++) {
      await page.getByRole('button', { name: `Ir a la página ${slide}`, exact: true }).click();
      const layout = await page.evaluate(() => {
        const active = document.querySelector('.slide.active');
        const nav = document.querySelector('.nav').getBoundingClientRect();
        const bounds = [...active.children].map(el => el.getBoundingClientRect());
        return {
          width: document.documentElement.scrollWidth,
          height: document.documentElement.scrollHeight,
          inside: bounds.every(rect => rect.left >= 0 && rect.right <= innerWidth),
          aboveNav: bounds.every(rect => rect.bottom <= nav.top + 1),
        };
      });
      const label = `${width}x${height}, página ${slide}`;
      assert(layout.width <= width, `Desbordamiento horizontal: ${label}`);
      assert(layout.inside, `Contenido recortado: ${label}`);
      assert(layout.aboveNav, `Navegación superpuesta: ${label}`);
      // Las pantallas más pequeñas pueden desplazarse para mantener el texto legible.
      if (height >= 667) assert(layout.height <= height + 1, `No cabe en pantalla: ${label} (${layout.height}px)`);
    }
    await page.getByRole('button', { name: 'Ir a la página 1', exact: true }).click();
    await page.screenshot({ path: `/tmp/cumplee-${width}x${height}.png`, fullPage: true });
    console.log(`OK: ${width}x${height}, siete páginas sin recortes ni superposición.`);
  }
  assert.deepEqual(errors, []);
} finally {
  await browser.close();
}
