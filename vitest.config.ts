import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';


process.env.NODE_ENV = 'test';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    css: false,
    include: ['src/__tests__/**/*.{test,spec}.{ts,tsx}'],
    testTimeout: 10000, 
    coverage: {
      provider: 'istanbul', 
      reporter: ['text', 'html', 'json', 'lcov'], 
      include: [
        'src/components/**/*.{ts,tsx}',
        'src/pages/**/*.{ts,tsx}'
      ], 
      exclude: [
        'src/**/*.d.ts',
        'src/types/**',
        'src/**/__tests__/**',
        'src/setupTests.ts',
        'src/mocks/**'
      ],
      thresholds: {
        statements: 50,
        branches: 50,
        functions: 50,
        lines: 50
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}); 