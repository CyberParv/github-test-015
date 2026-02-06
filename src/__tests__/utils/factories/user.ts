export function userFactory(overrides: Partial<any> = {}) {
  return {
    id: overrides.id ?? 'user_1',
    email: overrides.email ?? 'test@example.com',
    name: overrides.name ?? 'Test User',
    role: overrides.role ?? 'USER',
    ...overrides,
  };
}
