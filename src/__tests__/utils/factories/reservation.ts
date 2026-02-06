export function reservationFactory(overrides: Partial<any> = {}) {
  return {
    id: overrides.id ?? 'res_1',
    userId: overrides.userId ?? 'user_1',
    date: overrides.date ?? new Date('2030-01-01T19:00:00.000Z').toISOString(),
    partySize: overrides.partySize ?? 2,
    notes: overrides.notes ?? null,
    ...overrides,
  };
}
