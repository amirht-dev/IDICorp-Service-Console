import AuthProvider from '@/features/auth/providers/AuthProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as module from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router';
// eslint-disable-next-line react-refresh/only-export-components
export * from '@testing-library/react';

export function render(ui: ReactNode, options?: module.RenderOptions) {
  return module.render(ui, {
    ...options,
    wrapper: ({ children }) => (
      <QueryClientProvider
        client={
          new QueryClient({ defaultOptions: { queries: { retry: false } } })
        }
      >
        <AuthProvider>
          <MemoryRouter>{children}</MemoryRouter>
        </AuthProvider>
      </QueryClientProvider>
    ),
  });
}
