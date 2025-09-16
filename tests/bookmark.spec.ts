// tests/bookmark.spec.ts
import { test, expect } from '@playwright/test';
import { ensureLoggedIn } from '../helpers/auth';
import { goToRecipes, ensureResultsExist, findFirstRecipeCard } from '../helpers/recipes';
import { startApp } from '../helpers/app';


test('bookmark persists after reload', async ({ page, baseURL }) => {
  await startApp(page, baseURL);
  await goToRecipes(page);
  await ensureResultsExist(page);

  const card = await findFirstRecipeCard(page);
  await card.click();

  await ensureLoggedIn(page); // only acts if login visible

  const toggle = page.getByTestId('bookmark-toggle')
    .or(page.getByRole('button', { name: /save|bookmark|heart/i }).first());
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed', /true/i);
  await page.reload();
  await expect(page.getByTestId('bookmark-toggle')
    .or(page.getByRole('button', { name: /save|bookmark|heart/i }).first())
  ).toHaveAttribute('aria-pressed', /true/i);
});
