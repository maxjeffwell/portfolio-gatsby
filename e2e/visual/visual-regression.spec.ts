import { test, expect, Page } from '@playwright/test';

const pages = [
  { name: 'home', path: '/' },
  { name: 'about', path: '/about/' },
  { name: 'projects', path: '/projects/' },
  { name: 'blog', path: '/blog/' },
  { name: 'contact', path: '/contact/' },
];

/**
 * Freeze all visual motion so Playwright can take two identical consecutive
 * screenshots.  This kills:
 *  - CSS transitions & animations (belt-and-suspenders with Playwright's own
 *    `animations: 'disabled'` flag)
 *  - JS setInterval timers (cursor blinks in TypingAnimation /
 *    SimpleTypingAnimation)
 *  - requestAnimationFrame loops (CanvasTypingAnimation / CanvasCodeSnippet)
 *  - smooth-scroll behavior
 */
async function stabilizePage(page: Page) {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
        scroll-behavior: auto !important;
      }
      /* Hide blinking cursors */
      [class*="cursor"], [class*="Cursor"] {
        opacity: 1 !important;
      }
    `,
  });

  await page.evaluate(() => {
    // Kill all setInterval timers (cursor blinks, etc.)
    const highestId = window.setInterval(() => {}, 0);
    for (let i = 1; i <= highestId; i++) window.clearInterval(i);

    // Stop requestAnimationFrame loops (canvas animations)
    window.requestAnimationFrame = () => 0;
    window.cancelAnimationFrame = () => {};

    // Wait for every <img> to finish loading
    return Promise.all(
      Array.from(document.querySelectorAll('img')).map((img) =>
        img.complete
          ? Promise.resolve()
          : new Promise<void>((r) => {
              img.onload = () => r();
              img.onerror = () => r();
            }),
      ),
    );
  });

  // Wait for web fonts to finish loading
  await page.evaluate(() => document.fonts.ready);

  // Brief settle time for any final paints
  await page.waitForTimeout(250);
}

const screenshotOpts = {
  fullPage: true,
  animations: 'disabled' as const,
  timeout: 15_000,
};

test.describe('Visual Regression', () => {
  for (const { name, path } of pages) {
    test(`${name} page - light mode`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      await stabilizePage(page);

      await expect(page).toHaveScreenshot(`${name}-light.png`, screenshotOpts);
    });

    test(`${name} page - dark mode`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      const toggle = page.getByRole('button', { name: /switch to dark mode/i });
      if (await toggle.isVisible()) {
        await toggle.click();
        await page.waitForTimeout(400);
      }

      await stabilizePage(page);

      await expect(page).toHaveScreenshot(`${name}-dark.png`, screenshotOpts);
    });
  }

  test('home page - mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await stabilizePage(page);

    await expect(page).toHaveScreenshot('home-mobile.png', screenshotOpts);
  });
});
