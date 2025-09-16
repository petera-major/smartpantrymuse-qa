import { test, expect } from '@playwright/test';
import { goToRecipes, ensureResultsExist, findFirstRecipeCard } from '../helpers/recipes';
import { startApp } from '../helpers/app';

test('search shows results; details render', async ({ page, baseURL }) => {
  await startApp(page, baseURL);
  await goToRecipes(page);
  await ensureResultsExist(page);

  const card = await findFirstRecipeCard(page);
  await card.click();

  await expect(
    page.getByTestId('recipe-title').or(page.getByRole('heading'))
  ).toBeVisible();
  await expect(page.getByText(/ingredient/i)).toBeVisible();
});
