import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
    globalSetup: ['./tests/globalSetup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}', 'tests/**/*.test.ts'],
    hookTimeout: 120000, // 120 seconds for MongoDB setup (includes download time)
    testTimeout: 30000, // 30 seconds per test
    coverage: {
      reporter: ['text', 'json', 'html'],
      threshold: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
      include: ['src/**/*.ts'],
      exclude: ['src/index.ts', 'tests/**'],
    },
  },
});
