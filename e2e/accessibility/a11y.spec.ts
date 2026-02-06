import { test, expect } from '@playwright/test';
import AxeBuilder from 'axe-playwright';

const pages = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about/' },
  { name: 'Projects', path: '/projects/' },
  { name: 'Blog', path: '/blog/' },
  { name: 'Contact', path: '/contact/' },
  { name: 'Resume', path: '/resume/' },
];

for (const { name, path } of pages) {
  test(`${name} page should have no accessibility violations (light mode)`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test(`${name} page should have no accessibility violations (dark mode)`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState('networkidle');

    // Enable dark mode
    const toggle = page.getByRole('button', { name: /switch to dark mode/i });
    if (await toggle.isVisible()) {
      await toggle.click();
      await page.waitForTimeout(200);
    }

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });
}
