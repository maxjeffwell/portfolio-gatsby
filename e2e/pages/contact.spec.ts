import { test, expect } from '@playwright/test';

test.describe('Contact Page', () => {
  test('should load the contact page', async ({ page }) => {
    await page.goto('/contact/');
    await expect(page).toHaveURL('/contact/');

    const heading = page.getByRole('heading').first();
    await expect(heading).toBeVisible();
  });

  test('should have contact information', async ({ page }) => {
    await page.goto('/contact/');

    // Should have at least one link (email, phone, or social)
    const links = page.getByRole('link');
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
  });
});
