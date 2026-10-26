/// <reference types="vitest/config" />

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    tsconfigPaths: true,
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
});
