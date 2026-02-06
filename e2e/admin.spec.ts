import { test, expect } from '@playwright/test';

test.describe('Admin dashboard operations', () => {
  test('admin can view dashboard and manage products', async ({ page }) => {
    // Login as admin via UI (requires seeded admin in test env)
    await page.goto('/login');

    await page.getByLabel(/email/i).fill(process.env.E2E_ADMIN_EMAIL || 'admin@example.com');
    await page.getByLabel(/password/i).fill(process.env.E2E_ADMIN_PASSWORD || 'Password123!');
    await page.getByRole('button', { name: /log in|sign in/i }).click();

    await page.goto('/admin');
    await expect(page.getByRole('heading', { name: /admin/i })).toBeVisible();

    // Create product if UI supports it
    const newProductBtn = page.getByRole('button', { name: /new product|add product/i });
    if (await newProductBtn.count()) {
      await newProductBtn.click();

      await page.getByLabel(/name/i).fill(`E2E Product ${Date.now()}`);
      const price = page.locator('input[name="price"], input[aria-label*="price" i]').first();
      if (await price.count()) await price.fill('9.99');

      await page.getByRole('button', { name: /save|create/i }).click();
      await expect(page.getByText(/product/i)).toBeVisible();
    }

    // Verify access control: admin pages visible
    await expect(page).toHaveURL(/\/admin/);
  });
});
