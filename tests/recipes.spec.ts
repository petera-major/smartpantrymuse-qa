import { test, expect } from '@playwright/test';
import { startApp } from '../helpers/app';
import { ensureResultsExist, findFirstRecipeCard } from '../helpers/recipes';

test('Get Started → set goal → search → open details', async ({ page, baseURL }) => {
  await startApp(page, baseURL);
  await ensureResultsExist(page);

  const card = await findFirstRecipeCard(page);
  await card.click();

  // title/ingredients on detail page
  await expect(
    page.getByTestId('recipe-title')
      .or(page.getByRole('heading'))
      .or(page.getByText(/ingredient/i))
  ).toBeVisible({ timeout: 8000 });
});
