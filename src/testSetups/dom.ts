import '@testing-library/jest-dom/vitest';

vi.mock(import('react-router'));

beforeAll(() => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn(
      (query) =>
        ({
          matches: false,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }) satisfies MediaQueryList,
    ),
  );
});

afterAll(() => {
  vi.unstubAllGlobals();
});
