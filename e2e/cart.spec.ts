import { test, expect } from '@playwright/test';

test.describe('Cart operations', () => {
  test('add item to cart and update quantity', async ({ page }) => {
    await page.goto('/menu');

    // open first product
    const card = page.locator('[data-testid="product-card"]').first();
    if (await card.count()) {
      await card.click();
    } else {
      await page.getByRole('link').first().click();
    }

    // add to cart
    await page.getByRole('button', { name: /add to cart/i }).click();

    // go to cart
    await page.goto('/cart');
    await expect(page.getByRole('heading', { name: /cart/i })).toBeVisible();

    // update quantity (supports either input or +/- buttons)
    const qtyInput = page.locator('input[name="quantity"], input[aria-label*="quantity" i]').first();
    if (await qtyInput.count()) {
      await qtyInput.fill('2');
      await qtyInput.blur();
    } else {
      const plus = page.getByRole('button', { name: /\+|increase/i }).first();
      if (await plus.count()) await plus.click();
    }

    await expect(page.getByText(/total/i)).toBeVisible();
  });
});
