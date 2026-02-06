import { test, expect } from '@playwright/test';

test.describe('Projects Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/projects/');
  });

  test('should display project cards', async ({ page }) => {
    const headings = page.getByRole('heading');
    const count = await headings.count();
    expect(count).toBeGreaterThan(1); // Page heading + at least one project
  });

  test('should have external links for source and demos', async ({ page }) => {
    const externalLinks = page.locator('a[target="_blank"]');
    const count = await externalLinks.count();
    expect(count).toBeGreaterThan(0);

    // First link should have a valid href
    const href = await externalLinks.first().getAttribute('href');
    expect(href).toMatch(/^https?:\/\//);
  });
});
