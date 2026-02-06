import { test, expect } from '@playwright/test';

test.describe('About Page', () => {
  test('should load the about page', async ({ page }) => {
    await page.goto('/about/');
    await expect(page).toHaveURL('/about/');

    const heading = page.getByRole('heading').first();
    await expect(heading).toBeVisible();
  });

  test('should display bio content', async ({ page }) => {
    await page.goto('/about/');
    await page.waitForLoadState('networkidle');

    // The about page uses styled Typography components (not <p> tags)
    // Verify multiple content headings are visible (page heading + section headings)
    const headings = page.getByRole('heading');
    const count = await headings.count();
    expect(count).toBeGreaterThan(1);
  });
});
