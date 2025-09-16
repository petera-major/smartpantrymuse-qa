import { Page } from '@playwright/test';

export async function startApp(page: Page, baseURL?: string) {
  if (baseURL) await page.goto(baseURL);
  // clicks the landing page get started to enter the app
  const cta = page.getByRole('button', { name: /get started/i }).or(
    page.getByRole('link', { name: /get started/i })
  );
  if (await cta.isVisible().catch(() => false)) {
    await cta.click();
  }
  const goalSelect = page.getByTestId('dietary-goal')
    .or(page.getByRole('combobox').first());
  if (await goalSelect.isVisible().catch(() => false)) {
    await goalSelect.selectOption('keto'); //keto dietary goal choice
  }
}

