// tests/bookmark.spec.ts
import { test, expect } from '@playwright/test';
import { ensureLoggedIn } from '../helpers/auth';

test('bookmark persists after reload', async ({ page, baseURL }) => {
  await page.goto(baseURL!);

  // Open a recipe
  await page.getByTestId('recipe-card').first().click();

  // If login pops up (first time in a new browser), complete it
  await ensureLoggedIn(page);

  // Toggle save
  const toggle = page.getByTestId('bookmark-toggle');
  await toggle.click();

  // Verify saved state, reload, verify again
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await page.reload();
  await expect(page.getByTestId('bookmark-toggle')).toHaveAttribute('aria-pressed', 'true');

  // (optional) clean up: un-save so test is idempotent
  await page.getByTestId('bookmark-toggle').click();
  await expect(page.getByTestId('bookmark-toggle')).toHaveAttribute('aria-pressed', 'false');
});
