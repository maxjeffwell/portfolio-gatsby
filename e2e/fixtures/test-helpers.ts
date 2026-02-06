import { Page, expect } from '@playwright/test';

/** Wait for Gatsby's client-side hydration to complete. */
export async function waitForHydration(page: Page) {
  await page.waitForLoadState('networkidle');
  // Gatsby adds ___gatsby to the root div after hydration
  await page.locator('#___gatsby').waitFor({ state: 'attached' });
}

/** Enable dark mode by clicking the toggle button. */
export async function enableDarkMode(page: Page) {
  await page.getByRole('button', { name: /switch to dark mode/i }).click();
  // Wait for theme transition
  await page.waitForTimeout(100);
}

/** All navigable pages on the site. */
export const PAGES = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about/' },
  { name: 'Projects', path: '/projects/' },
  { name: 'Blog', path: '/blog/' },
  { name: 'Contact', path: '/contact/' },
  { name: 'Resume', path: '/resume/' },
] as const;
