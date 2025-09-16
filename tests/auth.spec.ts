// tests/auth.spec.ts
import { test, expect } from '@playwright/test';
import { ensureLoggedIn } from '../helpers/auth';

test('attempting to bookmark when logged out prompts login, then succeeds', async ({ page, baseURL }) => {
  await page.goto(baseURL!);

  // Open first recipe detail (adjust if your list is on another route)
  const firstCard = page.getByTestId('recipe-card').first();
  await expect(firstCard).toBeVisible();
  await firstCard.click();

  // Try to bookmark -> should trigger login UI if logged out
  await page.getByTestId('bookmark-toggle').click();

  // If login appears, complete it
  await ensureLoggedIn(page);

  // Click again in case your app requires post-login re-click
  await page.getByTestId('bookmark-toggle').click();

  // Saved state asserted (change to your UI logic: aria-pressed/filled heart, etc.)
  await expect(page.getByTestId('bookmark-toggle')).toHaveAttribute('aria-pressed', 'true');
});

test('bad creds show error and does not log in', async ({ page, baseURL }) => {
  await page.goto(baseURL!);

  // Open a recipe and trigger login by saving
  await page.getByTestId('recipe-card').first().click();
  await page.getByTestId('bookmark-toggle').click();

  // Fill wrong creds (this assumes a login form appears)
  await page.getByTestId('login-email').fill('wrong@example.com');
  await page.getByTestId('login-password').fill('nottherightpass');
  await page.getByTestId('login-submit').click();

  await expect(page.getByText(/invalid|incorrect|try again|failed/i)).toBeVisible();
  // Still not saved
  await expect(page.getByTestId('bookmark-toggle')).not.toHaveAttribute('aria-pressed', 'true');
});
