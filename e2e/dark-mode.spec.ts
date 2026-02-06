import { test, expect } from '@playwright/test';

test.describe('Dark Mode Toggle', () => {
  test('should toggle dark mode on click', async ({ page }) => {
    await page.goto('/');

    // Click to enable dark mode
    await page.getByRole('button', { name: /switch to dark mode/i }).click();

    // Verify the toggle label changed
    await expect(page.getByRole('button', { name: /switch to light mode/i })).toBeVisible();
  });

  test('should toggle back to light mode', async ({ page }) => {
    await page.goto('/');

    // Enable dark mode
    await page.getByRole('button', { name: /switch to dark mode/i }).click();

    // Disable dark mode
    await page.getByRole('button', { name: /switch to light mode/i }).click();

    // Should be back to dark mode toggle label
    await expect(page.getByRole('button', { name: /switch to dark mode/i })).toBeVisible();
  });

  test('should persist dark mode in localStorage across navigation', async ({ page }) => {
    await page.goto('/');

    // Enable dark mode
    await page.getByRole('button', { name: /switch to dark mode/i }).click();

    // Navigate to another page
    await page.goto('/projects/');

    // Should still be in dark mode
    await expect(page.getByRole('button', { name: /switch to light mode/i })).toBeVisible();

    // Verify localStorage
    const theme = await page.evaluate(() => localStorage.getItem('portfolio-theme'));
    expect(theme).toBe('dark');
  });

  test('should persist dark mode after page reload', async ({ page }) => {
    await page.goto('/');

    // Enable dark mode
    await page.getByRole('button', { name: /switch to dark mode/i }).click();

    // Reload the page
    await page.reload();

    // Should still be in dark mode
    await expect(page.getByRole('button', { name: /switch to light mode/i })).toBeVisible();
  });

  test('should show right-click context menu', async ({ page }) => {
    await page.goto('/');

    const toggle = page.getByRole('button', { name: /switch to dark mode/i });
    await toggle.click({ button: 'right' });

    // Context menu options should appear
    await expect(page.getByText('Follow system preference')).toBeVisible();
  });

  test('should reset to system preference from context menu', async ({ page }) => {
    await page.goto('/');

    // First enable dark mode
    await page.getByRole('button', { name: /switch to dark mode/i }).click();

    // Right-click to open context menu
    await page.getByRole('button', { name: /switch to light mode/i }).click({ button: 'right' });

    // Click "Follow system preference"
    await page.getByText('Follow system preference').click();

    // localStorage should be cleared
    const theme = await page.evaluate(() => localStorage.getItem('portfolio-theme'));
    expect(theme).toBeNull();
  });
});
