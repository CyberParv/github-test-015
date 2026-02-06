import { test, expect } from '@playwright/test';

test.describe('Authentication flows', () => {
  test('user can sign up, log out, and log in', async ({ page }) => {
    const email = `e2e_${Date.now()}@example.com`;

    await page.goto('/signup');
    await expect(page.getByRole('heading', { name: /sign up/i })).toBeVisible();

    await page.getByLabel(/name/i).fill('E2E User');
    await page.getByLabel(/email/i).fill(email);
    await page.getByLabel(/password/i).fill('Password123!');
    await page.getByRole('button', { name: /create account|sign up/i }).click();

    await expect(page).toHaveURL(/\/(menu|account|profile|)$/);

    // logout
    const logout = page.getByRole('button', { name: /logout/i }).or(page.getByRole('link', { name: /logout/i }));
    if (await logout.count()) {
      await logout.first().click();
      await expect(page).toHaveURL(/\/(login|)$/);
    }

    // login
    await page.goto('/login');
    await page.getByLabel(/email/i).fill(email);
    await page.getByLabel(/password/i).fill('Password123!');
    await page.getByRole('button', { name: /log in|sign in/i }).click();

    await expect(page).toHaveURL(/\/(menu|account|profile|)$/);
  });
});
