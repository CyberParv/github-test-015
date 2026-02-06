export function productFactory(overrides: Partial<any> = {}) {
  return {
    id: overrides.id ?? 'prod_1',
    name: overrides.name ?? 'Margherita Pizza',
    description: overrides.description ?? 'Classic pizza',
    price: overrides.price ?? 1299,
    imageUrl: overrides.imageUrl ?? '/pizza.jpg',
    ...overrides,
  };
}
