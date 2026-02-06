/**
 * Assumes route: src/app/api/auth/login/route.ts exporting POST(req)
 */

import { prismaMock, resetPrismaMock } from '../utils/mocks/prisma';
import { mockRequest } from '../utils/helpers';
import { userFactory } from '../utils/factories/user';

jest.mock('@/lib/prisma', () => ({ prisma: prismaMock }));

// If you verify passwords with bcrypt, mock it for deterministic tests.
jest.mock('bcryptjs', () => ({
  compare: jest.fn(async (plain: string, hash: string) => plain === 'Password123!' && hash === 'hashed'),
}));

describe('API /api/auth/login', () => {
  beforeEach(() => resetPrismaMock());

  test('200: returns session/user for valid credentials', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ ...userFactory(), passwordHash: 'hashed' });

    const { POST } = await import('@/app/api/auth/login/route');
    const req = mockRequest({ method: 'POST', body: { email: 'test@example.com', password: 'Password123!' } });

    const res: any = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toHaveProperty('user');
    expect(json.user.email).toBe('test@example.com');
  });

  test('400: validation error for missing password', async () => {
    const { POST } = await import('@/app/api/auth/login/route');
    const req = mockRequest({ method: 'POST', body: { email: 'test@example.com' } });

    const res: any = await POST(req);
    expect(res.status).toBe(400);
  });

  test('401: authentication required / invalid credentials', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ ...userFactory(), passwordHash: 'hashed' });

    const { POST } = await import('@/app/api/auth/login/route');
    const req = mockRequest({ method: 'POST', body: { email: 'test@example.com', password: 'wrong' } });

    const res: any = await POST(req);
    expect(res.status).toBe(401);
  });

  test('404: not found when user does not exist', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    const { POST } = await import('@/app/api/auth/login/route');
    const req = mockRequest({ method: 'POST', body: { email: 'missing@example.com', password: 'Password123!' } });

    const res: any = await POST(req);
    expect(res.status).toBe(404);
  });
});
