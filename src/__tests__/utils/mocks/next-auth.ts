export function mockUseSession(session: any, status: 'authenticated' | 'unauthenticated' | 'loading' = 'authenticated') {
  const mod = require('next-auth/react');
  jest.spyOn(mod, 'useSession').mockReturnValue({ data: session, status });
}

export function mockSignIn() {
  const mod = require('next-auth/react');
  const fn = jest.fn();
  jest.spyOn(mod, 'signIn').mockImplementation(fn);
  return fn;
}

export function mockSignOut() {
  const mod = require('next-auth/react');
  const fn = jest.fn();
  jest.spyOn(mod, 'signOut').mockImplementation(fn);
  return fn;
}
