/// <reference types="vitest/config" />

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const loadedEnv = loadEnv(mode, process.cwd(), '');

  const VITE_HTTP_API_BASE_URL = loadedEnv.VITE_HTTP_API_BASE_URL;

  if (!VITE_HTTP_API_BASE_URL) throw new Error('no api url');

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      tsconfigPaths: true,
    },
    server: {
      proxy: {
        '/api': {
          target: VITE_HTTP_API_BASE_URL,
          changeOrigin: true,
          secure: true,
          cookieDomainRewrite: '',
        },
      },
    },
    test: {
      dir: './src',
      globals: true,
      projects: [
        {
          test: {
            name: 'node',
            environment: 'node',
            include: ['**/*.test.{ts,js}'],
            exclude: ['**/*.dom.test.{tsx,jsx}'],
          },
        },
        {
          test: {
            name: 'dom',
            environment: 'jsdom',
            include: ['**/*.dom.test.{tsx,jsx}'],
            setupFiles: ['./src/testSetups/dom.ts'],
          },
        },
      ],
    },
  };
});
