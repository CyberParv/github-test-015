import { test, expect } from '@playwright/test';

test.describe('Checkout flow', () => {
  test('user can complete checkout', async ({ page }) => {
    // Ensure cart has at least one item
    await page.goto('/menu');
    const card = page.locator('[data-testid="product-card"]').first();
    if (await card.count()) await card.click();

    const add = page.getByRole('button', { name: /add to cart/i });
    if (await add.count()) await add.click();

    await page.goto('/checkout');
    await expect(page.getByRole('heading', { name: /checkout/i })).toBeVisible();

    // Fill minimal checkout form if present
    const name = page.locator('input[name="name"], input[aria-label*="name" i]').first();
    if (await name.count()) await name.fill('E2E User');

    const address = page.locator('input[name="address"], textarea[name="address"], input[aria-label*="address" i]').first();
    if (await address.count()) await address.fill('123 Test St');

    const placeOrder = page.getByRole('button', { name: /place order|pay|complete/i });
    await placeOrder.click();

    await expect(page).toHaveURL(/\/(orders|order-success|thank-you)/);
    await expect(page.getByText(/order/i)).toBeVisible();
  });
});
