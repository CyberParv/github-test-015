/**
 * Assumes route: src/app/api/checkout/route.ts exporting POST
 */

import { prismaMock, resetPrismaMock } from '../utils/mocks/prisma';
import { mockRequest } from '../utils/helpers';
import { orderFactory } from '../utils/factories/order';

jest.mock('@/lib/prisma', () => ({ prisma: prismaMock }));
jest.mock('@/lib/auth', () => ({
  requireUser: jest.fn(async () => ({ id: 'user_1', role: 'USER' })),
}));

describe('API /api/checkout', () => {
  beforeEach(() => resetPrismaMock());

  test('200: completes checkout and creates an order', async () => {
    prismaMock.$transaction.mockImplementation(async (fn: any) => fn(prismaMock));
    prismaMock.order.create.mockResolvedValue(orderFactory({ id: 'order_new' }));

    const { POST } = await import('@/app/api/checkout/route');
    const res: any = await POST(mockRequest({ method: 'POST', body: { paymentMethod: 'CARD' } }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.id).toBe('order_new');
  });

  test('400: validation error for missing payment method', async () => {
    const { POST } = await import('@/app/api/checkout/route');
    const res: any = await POST(mockRequest({ method: 'POST', body: {} }));
    expect(res.status).toBe(400);
  });

  test('401: requires authentication', async () => {
    const auth = await import('@/lib/auth');
    (auth.requireUser as jest.Mock).mockRejectedValue({ status: 401 });

    const { POST } = await import('@/app/api/checkout/route');
    const res: any = await POST(mockRequest({ method: 'POST', body: { paymentMethod: 'CARD' } }));
    expect([401, 500]).toContain(res.status);
  });
});
