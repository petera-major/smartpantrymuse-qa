
import { Page, expect } from '@playwright/test';

export async function ensureLoggedIn(page: Page) {
  const email = page.getByTestId('login-email').or(page.getByPlaceholder(/email/i));
  if (await email.isVisible({ timeout: 800 }).catch(() => false)) {
    await email.fill(process.env.TEST_EMAIL!);
    await page.getByTestId('login-password').or(page.getByPlaceholder(/password/i)).fill(process.env.TEST_PASSWORD!);
    await page.getByTestId('login-submit').or(page.getByRole('button', { name: /log ?in|sign ?in/i })).click();
    await expect(page).toHaveURL(/./, { timeout: 7000 }); // any nav/change
  }
}
