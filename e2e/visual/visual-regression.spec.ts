import { test, expect } from '@playwright/test';

const pages = [
  { name: 'home', path: '/' },
  { name: 'about', path: '/about/' },
  { name: 'projects', path: '/projects/' },
  { name: 'blog', path: '/blog/' },
  { name: 'contact', path: '/contact/' },
];

test.describe('Visual Regression', () => {
  for (const { name, path } of pages) {
    test(`${name} page - light mode`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot(`${name}-light.png`, {
        fullPage: true,
        animations: 'disabled',
      });
    });

    test(`${name} page - dark mode`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      const toggle = page.getByRole('button', { name: /switch to dark mode/i });
      if (await toggle.isVisible()) {
        await toggle.click();
        await page.waitForTimeout(200);
      }

      await expect(page).toHaveScreenshot(`${name}-dark.png`, {
        fullPage: true,
        animations: 'disabled',
      });
    });
  }

  test('home page - mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('home-mobile.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });
});
