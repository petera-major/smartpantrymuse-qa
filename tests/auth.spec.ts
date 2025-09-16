import { test, expect } from '@playwright/test';
import { ensureLoggedIn } from '../helpers/auth';
import { goToRecipes, ensureResultsExist, findFirstRecipeCard } from '../helpers/recipes';
import { startApp } from '../helpers/app';

test('bookmark flow triggers login, then saves', async ({ page, baseURL }) => {
  await startApp(page, baseURL);
  await goToRecipes(page);
  await ensureResultsExist(page);

  const card = await findFirstRecipeCard(page);
  await card.click();

  const bookmark = page.getByTestId('bookmark-toggle')
    .or(page.getByRole('button', { name: /save|bookmark|heart/i }).first());
  await bookmark.click();      //  prompt login if logged out
  await ensureLoggedIn(page);  // fills creds if login appears
  await bookmark.click();      // set saved state

  await expect(bookmark).toHaveAttribute('aria-pressed', /true/i);
});