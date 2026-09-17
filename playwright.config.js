const {defineConfig} = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: 2,
  timeout: 60_000,
  expect: {timeout: 10_000},
  reporter: [['list'], ['html', {open: 'never'}]],
  use: {
    baseURL: 'http://127.0.0.1:8001',
    viewport: {width: 1440, height: 900},
    colorScheme: 'light',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{name: 'chromium', use: {browserName: 'chromium'}}],
  webServer: {
    command: 'npm run build && npm run serve -- --host 127.0.0.1 --port 8001',
    url: 'http://127.0.0.1:8001',
    // Always test a fresh production build, including SSR and hydration.
    reuseExistingServer: false,
    timeout: 300_000,
    stdout: 'pipe',
    env: {E2E_TESTING: 'true'},
  },
});
