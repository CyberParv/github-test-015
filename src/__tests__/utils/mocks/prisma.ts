// A lightweight Prisma client mock shape used by API route tests.
// Update model names to match your schema as needed.

type MockFn = jest.Mock<any, any>;

export const prismaMock = {
  user: {
    findUnique: jest.fn() as MockFn,
    findMany: jest.fn() as MockFn,
    create: jest.fn() as MockFn,
    update: jest.fn() as MockFn,
    delete: jest.fn() as MockFn,
  },
  product: {
    findUnique: jest.fn() as MockFn,
    findMany: jest.fn() as MockFn,
    create: jest.fn() as MockFn,
    update: jest.fn() as MockFn,
    delete: jest.fn() as MockFn,
  },
  order: {
    findUnique: jest.fn() as MockFn,
    findMany: jest.fn() as MockFn,
    create: jest.fn() as MockFn,
    update: jest.fn() as MockFn,
    delete: jest.fn() as MockFn,
  },
  reservation: {
    findUnique: jest.fn() as MockFn,
    findMany: jest.fn() as MockFn,
    create: jest.fn() as MockFn,
    update: jest.fn() as MockFn,
    delete: jest.fn() as MockFn,
  },
  $transaction: jest.fn(async (fn: any) => fn(prismaMock)) as MockFn,
};

export function resetPrismaMock() {
  for (const model of Object.values(prismaMock)) {
    if (typeof model !== 'object' || model === null) continue;
    for (const v of Object.values(model)) {
      if (typeof v === 'function' && 'mockReset' in v) {
        (v as any).mockReset();
      }
    }
  }
  prismaMock.$transaction.mockReset();
}
