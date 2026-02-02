import path from 'path';
import { defineConfig, devices } from '@playwright/experimental-ct-react';
import react from '@vitejs/plugin-react';

export default defineConfig({
  testDir: './tests/components',
  testMatch: /.*\.ct\.spec\.tsx/,
  use: {
    ctViteConfig: {
      plugins: [react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
          'next/navigation': path.resolve(
            __dirname,
            'tests/components/mocks/next-navigation.ts',
          ),
          'next/link': path.resolve(
            __dirname,
            'tests/components/mocks/next-link.tsx',
          ),
          'next-auth/react': path.resolve(
            __dirname,
            'tests/components/mocks/next-auth-react.ts',
          ),
        },
      },
    },
    video: 'on',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
