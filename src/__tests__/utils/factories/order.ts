export function orderFactory(overrides: Partial<any> = {}) {
  return {
    id: overrides.id ?? 'order_1',
    userId: overrides.userId ?? 'user_1',
    status: overrides.status ?? 'PENDING',
    total: overrides.total ?? 2598,
    items: overrides.items ?? [{ productId: 'prod_1', quantity: 2, price: 1299 }],
    ...overrides,
  };
}
