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

    // The page should have paragraph text (bio content)
    const paragraphs = page.locator('p');
    const count = await paragraphs.count();
    expect(count).toBeGreaterThan(0);
  });
});
