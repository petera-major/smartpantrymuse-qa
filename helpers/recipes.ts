import { Page, Locator, expect } from '@playwright/test';

export async function ensureResultsExist(page: Page) {
  // 3) Perform a search to populate cards
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

  // give the list a moment to render
  await page.waitForLoadState('networkidle');
}

export async function findFirstRecipeCard(page: Page): Promise<Locator> {
  // 4) Find something card-like, or a link/article item
  const candidates: Locator[] = [
    page.getByTestId('recipe-card'),
    page.getByRole('article'),
    page.getByRole('listitem'),
    page.locator('[class*="card"]'),
    page.getByRole('link', { name: /view|details|recipe/i }),
    page.getByRole('button', { name: /view|details/i }),
  ];
  for (const c of candidates) {
    const first = c.first();
    if (await first.isVisible({ timeout: 2000 }).catch(() => false)) return first;
  }

  // As a final clue for debugging, require at least any “search/recipe” UI text
  await expect(
    page.getByText(/search|recipe|ingredients/i)
  ).toBeVisible({ timeout: 3000 });
  throw new Error('No recipe card found. Add data-testid="recipe-card" to your cards or tweak the selectors.');
}
