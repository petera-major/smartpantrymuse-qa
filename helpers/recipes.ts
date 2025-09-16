import { Page, Locator, expect } from '@playwright/test';

export async function goToRecipes(page: Page) {
  const link = page.getByRole('link', { name: /recipes|browse|discover|explore/i });
  if (await link.isVisible().catch(() => false)) await link.click();
}

export async function ensureResultsExist(page: Page) {

    const search = page.getByTestId('search-input')
    .or(page.getByPlaceholder(/search|ingredient|find/i))
    .or(page.getByRole('textbox').first());

  if (await search.isVisible().catch(() => false)) {
    await search.fill('chicken');
    const submit = page.getByTestId('search-submit')
      .or(page.getByRole('button', { name: /search|go|find/i }).first());
    if (await submit.isVisible().catch(() => false)) {
      await submit.click();
    } else {
      await search.press('Enter');
    }
  }
}

export async function findFirstRecipeCard(page: Page): Promise<Locator> {
  const candidates: Locator[] = [
    page.getByTestId('recipe-card'),
    page.locator('[data-testid*="recipe"]'),
    page.getByRole('article'),
    page.getByRole('link', { name: /view|details|recipe/i }),
    page.locator('[class*="card"]'),
  ];
  for (const c of candidates) {
    const first = c.first();
    if (await first.isVisible({ timeout: 1500 }).catch(() => false)) return first;
  }
  await expect(page.getByText(/recipe|ingredients|search/i)).toBeVisible({ timeout: 2000 });
  throw new Error('No recipe card found — add data-testid="recipe-card" or adjust selectors.');
}
