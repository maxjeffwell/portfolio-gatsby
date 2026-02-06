import { test, expect } from '@playwright/test';

test.describe('CTA Section', () => {
  test('should display contact buttons', async ({ page }) => {
    await page.goto('/');

    // Scroll to bottom where CTA lives
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    await expect(page.getByRole('link', { name: /email/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /github/i }).first()).toBeVisible();
  });

  test('should have correct GitHub link', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    const githubLink = page.getByRole('link', { name: /github/i }).first();
    await expect(githubLink).toHaveAttribute('href', /github\.com/);
  });
});

test.describe('Project Cards', () => {
  test('should display project cards on projects page', async ({ page }) => {
    await page.goto('/projects/');

    // At least one project card should be visible
    const headings = page.getByRole('heading');
    await expect(headings.first()).toBeVisible();
  });

  test('should have source code links', async ({ page }) => {
    await page.goto('/projects/');

    // Check for source/demo links
    const externalLinks = page.locator('a[target="_blank"]');
    const count = await externalLinks.count();
    expect(count).toBeGreaterThan(0);
  });
});
