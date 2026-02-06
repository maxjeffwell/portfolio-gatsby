import { test, expect } from '@playwright/test';

test.describe('Blog Page', () => {
  test('should load the blog listing page', async ({ page }) => {
    await page.goto('/blog/');
    await expect(page).toHaveURL('/blog/');

    const heading = page.getByRole('heading').first();
    await expect(heading).toBeVisible();
  });

  test('should navigate to a blog post if posts exist', async ({ page }) => {
    await page.goto('/blog/');

    // Find blog post links (links that go to /blog/something/)
    const postLinks = page.locator('a[href^="/blog/"]').filter({ hasNotText: /^Blog$/ });
    const count = await postLinks.count();

    if (count > 0) {
      await postLinks.first().click();
      await expect(page).toHaveURL(/\/blog\/.+/);

      // Post should have a heading
      await expect(page.getByRole('heading').first()).toBeVisible();
    }
  });
});
