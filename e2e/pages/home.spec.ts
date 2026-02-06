import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the hero section', async ({ page }) => {
    // Hero section with heading should be visible
    const heading = page.getByRole('heading').first();
    await expect(heading).toBeVisible();
  });

  test('should render the typing animation', async ({ page }) => {
    // The typing animation container should have text content
    await page.waitForTimeout(1000); // Allow animation to start
    const heroText = page.locator('span').filter({ hasText: /.+/ }).first();
    await expect(heroText).toBeVisible();
  });

  test('should display the CTA section', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Stats should be visible
    await expect(page.getByText(/years/i).first()).toBeVisible();
  });
});
