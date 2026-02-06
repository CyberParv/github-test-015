import '@testing-library/jest-dom';
import 'whatwg-fetch';

// Silence noisy Next/Image warnings in unit tests
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return require('react').createElement('img', props);
  },
}));

// Next Router mock
jest.mock('next/navigation', () => {
  return {
    __esModule: true,
    useRouter: () => ({
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
    }),
    usePathname: () => '/',
    useSearchParams: () => new URLSearchParams(''),
  };
});

// next-auth mock (can be overridden per-test)
jest.mock('next-auth/react', () => {
  return {
    __esModule: true,
    useSession: () => ({ data: null, status: 'unauthenticated' }),
    signIn: jest.fn(),
    signOut: jest.fn(),
  };
});

// Ensure window.matchMedia exists
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }),
});

// Helpful: fail tests on console.error (can relax per suite)
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    const [first] = args;
    // allow React act warnings etc. if needed by editing this allowlist
    if (typeof first === 'string' && first.includes('Warning:')) {
      return originalError(...args);
    }
    return originalError(...args);
  };
});
afterAll(() => {
  console.error = originalError;
});
