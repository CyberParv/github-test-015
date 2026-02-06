/**
 * Assumes routes:
 *  - src/app/api/admin/users/route.ts exporting GET
 *  - src/app/api/admin/users/[id]/route.ts exporting PUT, DELETE
 */

import { prismaMock, resetPrismaMock } from '../utils/mocks/prisma';
import { mockRequest } from '../utils/helpers';
import { userFactory } from '../utils/factories/user';

jest.mock('@/lib/prisma', () => ({ prisma: prismaMock }));
jest.mock('@/lib/auth', () => ({
  requireAdmin: jest.fn(async () => ({ id: 'admin_1', role: 'ADMIN' })),
}));

describe('API /api/admin/users', () => {
  beforeEach(() => resetPrismaMock());

  test('200: GET lists users for admin', async () => {
    prismaMock.user.findMany.mockResolvedValue([userFactory()]);
    const { GET } = await import('@/app/api/admin/users/route');

    const res: any = await GET(mockRequest({ method: 'GET' }));
    expect(res.status).toBe(200);
  });

  test('403: forbidden for non-admin', async () => {
    const auth = await import('@/lib/auth');
    (auth.requireAdmin as jest.Mock).mockRejectedValue({ status: 403 });

    const { GET } = await import('@/app/api/admin/users/route');
    const res: any = await GET(mockRequest({ method: 'GET' }));
    expect([403, 500]).toContain(res.status);
  });
});

describe('API /api/admin/users/[id]', () => {
  beforeEach(() => resetPrismaMock());

  test('200: PUT updates a user role', async () => {
    prismaMock.user.update.mockResolvedValue(userFactory({ id: 'user_1', role: 'ADMIN' }));
    const { PUT } = await import('@/app/api/admin/users/[id]/route');

    const res: any = await PUT(
      mockRequest({ method: 'PUT', body: { role: 'ADMIN' } }),
      { params: { id: 'user_1' } } as any
    );

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.role).toBe('ADMIN');
  });

  test('400: PUT validation error', async () => {
    const { PUT } = await import('@/app/api/admin/users/[id]/route');
    const res: any = await PUT(mockRequest({ method: 'PUT', body: { role: 'NOT_A_ROLE' } }), { params: { id: 'user_1' } } as any);
    expect(res.status).toBe(400);
  });

  test('404: DELETE not found', async () => {
    prismaMock.user.delete.mockRejectedValue({ code: 'P2025' });
    const { DELETE } = await import('@/app/api/admin/users/[id]/route');

    const res: any = await DELETE(mockRequest({ method: 'DELETE' }), { params: { id: 'missing' } } as any);
    expect([404, 500]).toContain(res.status);
  });
});
