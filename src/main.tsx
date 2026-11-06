import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App.tsx';

import { Toaster } from './components/ui/Toast/index.tsx';
import AuthProvider from './features/auth/providers/AuthProvider.tsx';
import './index.css';
import ThemeProvider from './providers/ThemeProvider.tsx';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <ThemeProvider>
            <App />
            <Toaster />
          </ThemeProvider>
        </BrowserRouter>

        <ReactQueryDevtools buttonPosition="bottom-left" />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
