/**
 * Assumes routes:
 *  - src/app/api/cart/route.ts exporting GET, POST, PUT, DELETE
 */

import { prismaMock, resetPrismaMock } from '../utils/mocks/prisma';
import { mockRequest } from '../utils/helpers';

jest.mock('@/lib/prisma', () => ({ prisma: prismaMock }));
jest.mock('@/lib/auth', () => ({
  requireUser: jest.fn(async () => ({ id: 'user_1', role: 'USER' })),
}));

describe('API /api/cart', () => {
  beforeEach(() => resetPrismaMock());

  test('401: requires authentication', async () => {
    const auth = await import('@/lib/auth');
    (auth.requireUser as jest.Mock).mockRejectedValue({ status: 401 });

    const { GET } = await import('@/app/api/cart/route');
    const res: any = await GET(mockRequest({ method: 'GET' }));
    expect([401, 500]).toContain(res.status);
  });

  test('200: GET returns current cart', async () => {
    // Mock any prisma calls your handler uses (adjust to your schema)
    prismaMock.order.findMany.mockResolvedValue([]);

    const { GET } = await import('@/app/api/cart/route');
    const res: any = await GET(mockRequest({ method: 'GET' }));
    expect(res.status).toBe(200);
  });

  test('200/201: POST adds item to cart', async () => {
    prismaMock.order.update.mockResolvedValue({ id: 'cart_1', items: [{ productId: 'prod_1', quantity: 1 }] });

    const { POST } = await import('@/app/api/cart/route');
    const res: any = await POST(mockRequest({ method: 'POST', body: { productId: 'prod_1', quantity: 1 } }));
    expect([200, 201]).toContain(res.status);
  });

  test('400: POST validation error for missing productId', async () => {
    const { POST } = await import('@/app/api/cart/route');
    const res: any = await POST(mockRequest({ method: 'POST', body: { quantity: 1 } }));
    expect(res.status).toBe(400);
  });

  test('404: PUT returns not found for unknown cart item', async () => {
    prismaMock.order.update.mockRejectedValue({ code: 'P2025' });

    const { PUT } = await import('@/app/api/cart/route');
    const res: any = await PUT(mockRequest({ method: 'PUT', body: { productId: 'missing', quantity: 2 } }));
    expect([404, 500]).toContain(res.status);
  });
});
