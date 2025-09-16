import { test, expect } from '@playwright/test';

test('dietary filter + search returns results; details render', async ({ page, baseURL }) => {
  await page.goto(baseURL!);

  await page.getByTestId('dietary-filter').selectOption('keto'); // adjust if needed
  await page.getByTestId('search-input').fill('chicken');
  await page.getByTestId('search-submit').click();

  const cards = page.getByTestId('recipe-card');

  // ✅ FIX: check numeric count
  const n = await cards.count();
  expect(n).toBeGreaterThan(0);

  // or: await expect(cards.first()).toBeVisible();

  await cards.first().click();
  await expect(page.getByTestId('recipe-title')).toBeVisible();
  await expect(page.getByText(/ingredients/i)).toBeVisible();
});
