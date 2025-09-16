import { Page } from '@playwright/test';

export async function startApp(page: Page, baseURL?: string) {
  if (baseURL) await page.goto(baseURL, { waitUntil: 'domcontentloaded' });

  // clicks get started
  const getStarted = page.getByRole('button', { name: /get started/i })
    .or(page.getByRole('link', { name: /get started/i }));
  if (await getStarted.isVisible().catch(() => false)) {
    await getStarted.click();
  }

  await page.waitForLoadState('networkidle');

  await selectDietaryGoal(page, 'Keto');  
}

export async function selectDietaryGoal(page: Page, goalLabel: string) {
  const combo = page.getByTestId('dietary-goal').or(page.getByRole('combobox').first());
  if (!(await combo.isVisible().catch(() => false))) return;

  try {
    await combo.selectOption({ label: goalLabel }); 
    return;
  } catch {
  }

  // open and click an option by text
  await combo.click();
  const option =
    page.getByRole('option', { name: new RegExp(`^${goalLabel}$`, 'i') }).first()
      .or(page.getByText(new RegExp(`^${goalLabel}$`, 'i')).first());
  if (await option.isVisible({ timeout: 1500 }).catch(() => false)) {
    await option.click();
    return;
  }

  const options = combo.locator('option');
  const labels = await options.allTextContents().catch(() => []);
  const match = labels.find(l => l.trim().toLowerCase() === goalLabel.toLowerCase());
  if (match) {
    await combo.selectOption({ label: match }); 
  }
}



