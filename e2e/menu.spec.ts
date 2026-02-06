import { test, expect } from '@playwright/test';

test.describe('Menu browsing', () => {
  test('user can browse menu and open a product page', async ({ page }) => {
    await page.goto('/menu');
    await expect(page.getByRole('heading', { name: /menu/i })).toBeVisible();

    // Click first product card/link
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    if (await firstProduct.count()) {
      await firstProduct.click();
    } else {
      // fallback to a generic product link
      await page.getByRole('link').first().click();
    }

    await expect(page).toHaveURL(/\/menu\//);
    await expect(page.getByRole('heading')).toBeVisible();
    await expect(page.getByText(/\$|price/i)).toBeVisible();
  });
});
