// helpers/recipes.ts
import { Page, Locator } from '@playwright/test';

export async function goToRecipes(page: Page) {
    // try a nav link first
    const link = page.getByRole('link', { name: /recipes|browse|discover/i });
    if (await link.isVisible().catch(() => false)) await link.click();
  }

export async function ensureResultsExist(page: Page) {
    // if there is a search box, use it to populate results in recipe app
    const search = page.getByTestId('search-input').or(page.getByRole('textbox').first());
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
      page.locator('[class*="card"]').first(),
    ];
    for (const c of candidates) {
      const first = c.first();
      if (await first.isVisible({ timeout: 1000 }).catch(() => false)) return first;
    }
    throw new Error('No recipe card found — add data-testid="recipe-card" or adjust selectors.');
  }
