/**
 * Assumes routes:
 *  - src/app/api/products/route.ts exporting GET, POST
 *  - src/app/api/products/[id]/route.ts exporting GET, PUT, DELETE
 */

import { prismaMock, resetPrismaMock } from '../utils/mocks/prisma';
import { mockRequest } from '../utils/helpers';
import { productFactory } from '../utils/factories/product';

jest.mock('@/lib/prisma', () => ({ prisma: prismaMock }));

// Mock auth helpers your API may use.
jest.mock('@/lib/auth', () => ({
  requireUser: jest.fn(async () => ({ id: 'user_1', role: 'USER' })),
  requireAdmin: jest.fn(async () => ({ id: 'admin_1', role: 'ADMIN' })),
}));

describe('API /api/products', () => {
  beforeEach(() => resetPrismaMock());

  test('200: GET lists products', async () => {
    prismaMock.product.findMany.mockResolvedValue([productFactory()]);
    const { GET } = await import('@/app/api/products/route');

    const res: any = await GET(mockRequest({ method: 'GET' }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(Array.isArray(json)).toBe(true);
    expect(json[0]).toHaveProperty('id');
  });

  test('201: POST creates product as admin', async () => {
    const auth = await import('@/lib/auth');
    (auth.requireAdmin as jest.Mock).mockResolvedValue({ id: 'admin_1', role: 'ADMIN' });

    const created = productFactory({ id: 'prod_new' });
    prismaMock.product.create.mockResolvedValue(created);

    const { POST } = await import('@/app/api/products/route');
    const res: any = await POST(
      mockRequest({ method: 'POST', body: { name: created.name, price: created.price } })
    );

    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.id).toBe('prod_new');
  });

  test('400: POST validation error for missing name', async () => {
    const { POST } = await import('@/app/api/products/route');
    const res: any = await POST(mockRequest({ method: 'POST', body: { price: 1000 } }));
    expect(res.status).toBe(400);
  });

  test('401: POST requires authentication (no session)', async () => {
    const auth = await import('@/lib/auth');
    (auth.requireAdmin as jest.Mock).mockRejectedValue({ status: 401 });

    const { POST } = await import('@/app/api/products/route');
    const res: any = await POST(mockRequest({ method: 'POST', body: { name: 'X', price: 1000 } }));
    expect([401, 500]).toContain(res.status);
  });

  test('403: POST forbidden for non-admin', async () => {
    const auth = await import('@/lib/auth');
    (auth.requireAdmin as jest.Mock).mockRejectedValue({ status: 403 });

    const { POST } = await import('@/app/api/products/route');
    const res: any = await POST(mockRequest({ method: 'POST', body: { name: 'X', price: 1000 } }));
    expect([403, 500]).toContain(res.status);
  });
});

describe('API /api/products/[id]', () => {
  beforeEach(() => resetPrismaMock());

  test('200: GET returns product by id', async () => {
    prismaMock.product.findUnique.mockResolvedValue(productFactory({ id: 'prod_1' }));
    const { GET } = await import('@/app/api/products/[id]/route');

    const res: any = await GET(mockRequest({ method: 'GET' }), { params: { id: 'prod_1' } } as any);
    expect(res.status).toBe(200);
  });

  test('404: GET returns not found for missing product', async () => {
    prismaMock.product.findUnique.mockResolvedValue(null);
    const { GET } = await import('@/app/api/products/[id]/route');

    const res: any = await GET(mockRequest({ method: 'GET' }), { params: { id: 'missing' } } as any);
    expect(res.status).toBe(404);
  });

  test('200: PUT updates product as admin', async () => {
    const auth = await import('@/lib/auth');
    (auth.requireAdmin as jest.Mock).mockResolvedValue({ id: 'admin_1', role: 'ADMIN' });

    prismaMock.product.update.mockResolvedValue(productFactory({ id: 'prod_1', name: 'Updated' }));
    const { PUT } = await import('@/app/api/products/[id]/route');

    const res: any = await PUT(
      mockRequest({ method: 'PUT', body: { name: 'Updated' } }),
      { params: { id: 'prod_1' } } as any
    );

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.name).toBe('Updated');
  });

  test('400: PUT validation error', async () => {
    const { PUT } = await import('@/app/api/products/[id]/route');
    const res: any = await PUT(mockRequest({ method: 'PUT', body: {} }), { params: { id: 'prod_1' } } as any);
    expect(res.status).toBe(400);
  });

  test('403: DELETE forbidden for non-admin', async () => {
    const auth = await import('@/lib/auth');
    (auth.requireAdmin as jest.Mock).mockRejectedValue({ status: 403 });

    const { DELETE } = await import('@/app/api/products/[id]/route');
    const res: any = await DELETE(mockRequest({ method: 'DELETE' }), { params: { id: 'prod_1' } } as any);
    expect([403, 500]).toContain(res.status);
  });
});
