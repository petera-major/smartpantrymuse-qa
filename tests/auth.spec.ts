import { test, expect } from '@playwright/test';
import { ensureLoggedIn } from '../helpers/auth';
import { goToRecipes, ensureResultsExist, findFirstRecipeCard } from '../helpers/recipes';

test('bookmark flow triggers login, then saves', async ({ page, baseURL }) => {
  await page.goto(baseURL!);
  await goToRecipes(page);
  await ensureResultsExist(page);

  const card = await findFirstRecipeCard(page);
  await card.click();

  const bookmark = page.getByTestId('bookmark-toggle')
    .or(page.getByRole('button', { name: /save|bookmark|heart/i }).first());
  await bookmark.click();      // prompt login if logged out
  await ensureLoggedIn(page);  // fills creds if login appears
  await bookmark.click();      // click again to set saved state

  await expect(bookmark).toHaveAttribute('aria-pressed', /true/i);
});

test('bad creds show error (only if login form appears)', async ({ page, baseURL }) => {
  await page.goto(baseURL!);
  await goToRecipes(page);
  await ensureResultsExist(page);

  const card = await findFirstRecipeCard(page);
  await card.click();

  const bookmark = page.getByTestId('bookmark-toggle')
    .or(page.getByRole('button', { name: /save|bookmark|heart/i }).first());
  await bookmark.click();

  const email = page.getByTestId('login-email').or(page.getByPlaceholder(/email/i));
  if (await email.isVisible().catch(() => false)) {
    await email.fill('wrong@example.com');
    await page.getByTestId('login-password').or(page.getByPlaceholder(/password/i)).fill('badpass123!');
    await page.getByTestId('login-submit').or(page.getByRole('button', { name: /log ?in|sign ?in/i })).click();
    await expect(page.getByText(/invalid|incorrect|try again|failed/i)).toBeVisible();
  } else {
    test.skip(true, 'Login form did not appear on bookmark click.');
  }
});
