// helpers/auth.ts
import { Page, expect } from '@playwright/test';

export async function ensureLoggedIn(page: Page) {
  // If a login modal/screen appears, complete it. Otherwise do nothing.
  const loginEmail = page.getByTestId('login-email');
  if (await loginEmail.isVisible({ timeout: 1000 }).catch(() => false)) {
    await loginEmail.fill(process.env.TEST_EMAIL!);
    await page.getByTestId('login-password').fill(process.env.TEST_PASSWORD!);
    await page.getByTestId('login-submit').click();
    // confirm login succeeded (tweak to your UI)
    await expect(page.getByText(/welcome|hi|hello/i)).toBeVisible({ timeout: 7000 });
  }
}
