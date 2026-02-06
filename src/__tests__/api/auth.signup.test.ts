/**
 * These tests assume an App Router route handler:
 *   src/app/api/auth/signup/route.ts exporting POST(req)
 * and that it uses Prisma and returns NextResponse.json.
 *
 * If your path differs, update the import.
 */

import { prismaMock, resetPrismaMock } from '../utils/mocks/prisma';
import { mockRequest } from '../utils/helpers';
import { userFactory } from '../utils/factories/user';

jest.mock('@/lib/prisma', () => ({
  prisma: prismaMock,
}));

describe('API /api/auth/signup', () => {
  beforeEach(() => resetPrismaMock());

  test('201: creates a new user for valid payload', async () => {
    const user = userFactory({ id: 'user_new' });
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue(user);

    const { POST } = await import('@/app/api/auth/signup/route');

    const req = mockRequest({
      method: 'POST',
      body: { email: user.email, password: 'Password123!', name: user.name },
    });

    const res: any = await POST(req);
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json).toMatchObject({ id: 'user_new', email: user.email });
  });

  test('400: validation error for missing email', async () => {
    const { POST } = await import('@/app/api/auth/signup/route');
    const req = mockRequest({ method: 'POST', body: { password: 'Password123!' } });

    const res: any = await POST(req);
    expect(res.status).toBe(400);
  });

  test('403: forbidden when email already exists', async () => {
    prismaMock.user.findUnique.mockResolvedValue(userFactory());

    const { POST } = await import('@/app/api/auth/signup/route');
    const req = mockRequest({
      method: 'POST',
      body: { email: 'test@example.com', password: 'Password123!', name: 'X' },
    });

    const res: any = await POST(req);
    expect(res.status).toBe(403);
  });
});
