import { test, expect } from '@playwright/test';

test.describe('Desktop Navigation', () => {
  test('should navigate through all pages via header links', async ({ page }) => {
    await page.goto('/');

    const nav = page.locator('nav[aria-label="Main navigation"]');

    const navLinks = [
      { name: 'Bio', path: '/about/' },
      { name: 'Projects', path: '/projects/' },
      { name: 'Blog', path: '/blog/' },
      { name: 'Contact', path: '/contact/' },
    ];

    for (const { name, path } of navLinks) {
      await nav.getByRole('link', { name }).click();
      await expect(page).toHaveURL(path);
    }
  });

  test('should navigate home via logo click', async ({ page }) => {
    await page.goto('/projects/');
    await page.getByRole('link', { name: /home/i }).first().click();
    await expect(page).toHaveURL('/');
  });
});

test.describe('Mobile Navigation', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('should open and close mobile drawer', async ({ page }) => {
    await page.goto('/');

    // Open drawer
    await page.getByRole('button', { name: 'open drawer' }).click();
    await expect(page.locator('[aria-label="Mobile navigation"]')).toBeVisible();

    // Close drawer
    await page.getByRole('button', { name: 'close drawer' }).click();
    await expect(page.locator('[aria-label="Mobile navigation"]')).not.toBeVisible();
  });

  test('should navigate via mobile drawer', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'open drawer' }).click();

    const drawer = page.locator('[aria-label="Mobile navigation"]');
    await drawer.getByRole('link', { name: 'Projects' }).click();
    await expect(page).toHaveURL('/projects/');
  });
});
