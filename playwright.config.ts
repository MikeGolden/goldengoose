import { defineConfig, devices } from '@playwright/test';

/**
 * BASE_URL set  → run against an already-running server (docker compose, staging, prod).
 * BASE_URL unset → build the site and boot `astro preview` automatically.
 */
const baseURL = process.env.BASE_URL ?? 'http://127.0.0.1:4321';
const external = Boolean(process.env.BASE_URL);

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],

  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    { name: 'data', testMatch: /tests\/unit\/.*\.spec\.ts/ },
    {
      name: 'chromium',
      testMatch: /tests\/e2e\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], channel: 'chromium' },
    },
    {
      name: 'mobile',
      testMatch: /tests\/e2e\/.*\.spec\.ts/,
      use: { ...devices['Pixel 5'], channel: 'chromium' },
    },
  ],

  webServer: external
    ? undefined
    : {
        command: 'npm run build && npm run serve:dist',
        url: 'http://127.0.0.1:4321',
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
