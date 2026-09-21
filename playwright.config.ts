import { defineConfig, devices } from '@playwright/test';

/**
 * BASE_URL set  → run against an already-running server (docker compose, staging, prod).
 * BASE_URL unset → build the site and serve dist/ automatically.
 */
const baseURL = process.env.BASE_URL ?? 'http://127.0.0.1:4321';
const external = Boolean(process.env.BASE_URL);

/**
 * PLAYWRIGHT_CHROMIUM_PATH lets a locked-down environment (no access to
 * cdn.playwright.dev, so `playwright install` cannot run) point the suite at a
 * Chromium that is already on the machine. Unset everywhere else.
 */
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH;
const browser = executablePath
  ? { channel: undefined, launchOptions: { executablePath } }
  : { channel: 'chromium' as const };

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
      use: { ...devices['Desktop Chrome'], ...browser },
    },
    {
      name: 'mobile',
      testMatch: /tests\/e2e\/.*\.spec\.ts/,
      use: { ...devices['Pixel 5'], ...browser },
    },
  ],

  webServer: external
    ? undefined
    : {
        command: 'bun run build && bun run serve:dist',
        url: 'http://127.0.0.1:4321',
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
