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
 *  - IntersectionObserver-triggered Framer Motion animations (pre-scrolled
 *    so all InView callbacks fire before we kill timers/RAF)
 */
async function stabilizePage(page: Page) {
  // 1. Scroll through the full page to trigger every IntersectionObserver
  //    callback (e.g. ProjectCardWithInView Framer Motion animations).
  await page.evaluate(async () => {
    const height = document.body.scrollHeight;
    const step = window.innerHeight;
    for (let y = 0; y <= height; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 100));
    }
    window.scrollTo(0, 0);
  });

  // 2. Brief wait for triggered animations to start
  await page.waitForTimeout(300);

  // 3. Inject CSS to nuke all transitions and animations
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
        scroll-behavior: auto !important;
      }
      [class*="cursor"], [class*="Cursor"] {
        opacity: 1 !important;
      }
    `,
  });

  // 4. Kill JS-based animations and freeze video playback
  await page.evaluate(() => {
    // Clear all setInterval timers (cursor blinks, etc.)
    const highestId = window.setInterval(() => {}, 0);
    for (let i = 1; i <= highestId; i++) window.clearInterval(i);

    // Stop requestAnimationFrame loops (canvas animations)
    window.requestAnimationFrame = () => 0;
    window.cancelAnimationFrame = () => {};

    // Pause all videos (autoPlay loop videos produce different frames
    // on each screenshot, preventing stable comparison)
    document.querySelectorAll('video').forEach((video) => {
      video.pause();
      video.removeAttribute('autoplay');
    });

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

  // 5. Wait for web fonts
  await page.evaluate(() => document.fonts.ready);

  // 6. Final settle time
  await page.waitForTimeout(250);
}

const screenshotOpts = {
  fullPage: true,
  animations: 'disabled' as const,
  timeout: 30_000,
};

test.describe('Visual Regression', () => {
  for (const { name, path } of pages) {
    test(`${name} page - light mode`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(500);
      await stabilizePage(page);

      await expect(page).toHaveScreenshot(`${name}-light.png`, screenshotOpts);
    });

    test(`${name} page - dark mode`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(500);

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
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);
    await stabilizePage(page);

    await expect(page).toHaveScreenshot('home-mobile.png', screenshotOpts);
  });
});
