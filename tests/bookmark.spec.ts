// tests/bookmark.spec.ts
import { test, expect } from '@playwright/test';
import { ensureLoggedIn } from '../helpers/auth';

test('bookmark persists after reload', async ({ page, baseURL }) => {
  await page.goto(baseURL!);

  // open a recipe
  await page.getByTestId('recipe-card').first().click();

  // if login pops up (first time in a new browser), complete it
  await ensureLoggedIn(page);

  // toggle save
  const toggle = page.getByTestId('bookmark-toggle');
  await toggle.click();

  // verify saved state, reload, verify again
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await page.reload();
  await expect(page.getByTestId('bookmark-toggle')).toHaveAttribute('aria-pressed', 'true');

  await page.getByTestId('bookmark-toggle').click();
  await expect(page.getByTestId('bookmark-toggle')).toHaveAttribute('aria-pressed', 'false');
});
