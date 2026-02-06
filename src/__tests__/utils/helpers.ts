export function mockJson(body: any) {
  return {
    json: async () => body,
  } as any;
}

export function mockRequest({ method = 'GET', body, headers = {} as Record<string, string>, url = 'http://localhost/api/test' } = {}) {
  return {
    method,
    headers: {
      get: (k: string) => headers[k] ?? headers[k.toLowerCase()],
    },
    json: async () => body,
    url,
  } as any;
}

export function expectJsonResponse(res: any, status: number) {
  expect(res).toBeDefined();
  expect(res.status).toBe(status);
  expect(typeof res.json).toBe('function');
}
