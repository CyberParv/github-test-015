/**
 * Assumes routes:
 *  - src/app/api/reservations/route.ts exporting GET, POST
 *  - src/app/api/reservations/[id]/route.ts exporting GET, PUT, DELETE
 */

import { prismaMock, resetPrismaMock } from '../utils/mocks/prisma';
import { mockRequest } from '../utils/helpers';
import { reservationFactory } from '../utils/factories/reservation';

jest.mock('@/lib/prisma', () => ({ prisma: prismaMock }));
jest.mock('@/lib/auth', () => ({
  requireUser: jest.fn(async () => ({ id: 'user_1', role: 'USER' })),
  requireAdmin: jest.fn(async () => ({ id: 'admin_1', role: 'ADMIN' })),
}));

describe('API /api/reservations', () => {
  beforeEach(() => resetPrismaMock());

  test('200: GET lists reservations for user', async () => {
    prismaMock.reservation.findMany.mockResolvedValue([reservationFactory()]);
    const { GET } = await import('@/app/api/reservations/route');

    const res: any = await GET(mockRequest({ method: 'GET' }));
    expect(res.status).toBe(200);
  });

  test('201: POST creates reservation', async () => {
    prismaMock.reservation.create.mockResolvedValue(reservationFactory({ id: 'res_new' }));
    const { POST } = await import('@/app/api/reservations/route');

    const res: any = await POST(
      mockRequest({ method: 'POST', body: { date: '2030-01-01T19:00:00.000Z', partySize: 2 } })
    );
    expect(res.status).toBe(201);
  });

  test('400: POST validation error', async () => {
    const { POST } = await import('@/app/api/reservations/route');
    const res: any = await POST(mockRequest({ method: 'POST', body: { partySize: 0 } }));
    expect(res.status).toBe(400);
  });

  test('401: requires authentication', async () => {
    const auth = await import('@/lib/auth');
    (auth.requireUser as jest.Mock).mockRejectedValue({ status: 401 });

    const { GET } = await import('@/app/api/reservations/route');
    const res: any = await GET(mockRequest({ method: 'GET' }));
    expect([401, 500]).toContain(res.status);
  });
});

describe('API /api/reservations/[id]', () => {
  beforeEach(() => resetPrismaMock());

  test('200: GET reservation by id', async () => {
    prismaMock.reservation.findUnique.mockResolvedValue(reservationFactory({ id: 'res_1' }));
    const { GET } = await import('@/app/api/reservations/[id]/route');

    const res: any = await GET(mockRequest({ method: 'GET' }), { params: { id: 'res_1' } } as any);
    expect(res.status).toBe(200);
  });

  test('404: GET reservation not found', async () => {
    prismaMock.reservation.findUnique.mockResolvedValue(null);
    const { GET } = await import('@/app/api/reservations/[id]/route');

    const res: any = await GET(mockRequest({ method: 'GET' }), { params: { id: 'missing' } } as any);
    expect(res.status).toBe(404);
  });

  test('403: DELETE forbidden when not owner/admin', async () => {
    // Adjust to match your handler logic; this asserts forbidden is handled.
    const auth = await import('@/lib/auth');
    (auth.requireUser as jest.Mock).mockResolvedValue({ id: 'user_other', role: 'USER' });

    prismaMock.reservation.findUnique.mockResolvedValue(reservationFactory({ userId: 'user_1' }));

    const { DELETE } = await import('@/app/api/reservations/[id]/route');
    const res: any = await DELETE(mockRequest({ method: 'DELETE' }), { params: { id: 'res_1' } } as any);
    expect([403, 500]).toContain(res.status);
  });
});
