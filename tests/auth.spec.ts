import { test, expect } from '@playwright/test';
import { startApp } from '../helpers/app';
import { ensureLoggedIn } from '../helpers/auth';
import { ensureResultsExist, findFirstRecipeCard } from '../helpers/recipes';

test('bookmark flow triggers login, then saves', async ({ page, baseURL }) => {
  await startApp(page, baseURL);
  await ensureResultsExist(page);

  const card = await findFirstRecipeCard(page);
  await card.click();

  const bookmark = page.getByTestId('bookmark-toggle')
    .or(page.getByRole('button', { name: /save|bookmark|heart/i }).first());

  await bookmark.click();      // prompts login if logged out
  await ensureLoggedIn(page);  // fill creds if needed
  await bookmark.click();      // set saved state

  await expect(bookmark).toHaveAttribute('aria-pressed', /true/i);
});
