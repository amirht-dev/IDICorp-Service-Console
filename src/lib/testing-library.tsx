import AuthProvider from '@/features/auth/providers/AuthProvider';
import TanstackQueryProvider from '@/providers/TanstackQueryProvider';
import * as module from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router';
// eslint-disable-next-line react-refresh/only-export-components
export * from '@testing-library/react';

export function render(ui: ReactNode, options?: module.RenderOptions) {
  module.render(ui, {
    ...options,
    wrapper: ({ children }) => (
      <TanstackQueryProvider>
        <AuthProvider>
          <MemoryRouter>{children}</MemoryRouter>
        </AuthProvider>
      </TanstackQueryProvider>
    ),
  });
}
