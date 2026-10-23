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
    // --ignore-lock keeps astro preview in the foreground; without it, it
    // backgrounds itself when run by a coding agent, which Playwright would
    // read as the server exiting.
    command: 'npm run build && ' +
      'npm run preview -- --host 127.0.0.1 --port 8001 --ignore-lock',
    url: 'http://127.0.0.1:8001',
    // Always test a fresh production build.
    reuseExistingServer: false,
    // A cold build spends about 4 minutes encoding images, which ran past
    // the old 5-minute limit on slower CI runners.
    timeout: 900_000,
    stdout: 'pipe',
  },
});
