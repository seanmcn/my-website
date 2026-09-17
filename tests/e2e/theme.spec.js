const {test, expect} = require('@playwright/test');
const {visitPage, expectTheme, THEME_STORAGE_KEY} = require('./helpers');

for (const colorScheme of ['light', 'dark']) {
  test(`defaults to the ${colorScheme} system theme`, async ({page}) => {
    await page.emulateMedia({colorScheme});
    await visitPage(page, '/');
    await expectTheme(page, colorScheme, 'system');
    expect(await page.evaluate(
        key => localStorage.getItem(key), THEME_STORAGE_KEY))
        .toBeNull();
  });
}

test('persists theme changes across navigation and reload', async ({page}) => {
  await visitPage(page, '/');
  await expectTheme(page, 'light', 'system');
  const lightBackground = await page.locator('body').evaluate((element) => {
    return getComputedStyle(element).backgroundColor;
  });

  for (const theme of ['dark', 'light']) {
    await page.getByRole('button', {name: `Switch to ${theme} mode`}).click();
    await expectTheme(page, theme);
    expect(await page.evaluate(
        key => localStorage.getItem(key), THEME_STORAGE_KEY))
        .toBe(theme);
    if (theme === 'dark') {
      await expect(page.locator('body'))
          .not.toHaveCSS('background-color', lightBackground);
    } else {
      await expect(page.locator('body'))
          .toHaveCSS('background-color', lightBackground);
    }
    await page.getByRole('navigation', {name: 'Primary'})
        .getByRole('link', {name: 'Library', exact: true}).click();
    await expect(page).toHaveURL('/library/');
    await expectTheme(page, theme);
    await page.reload();
    await expectTheme(page, theme);
  }
});

test('follows system changes until a theme is chosen', async ({page}) => {
  await visitPage(page, '/');
  await expectTheme(page, 'light', 'system');
  await page.emulateMedia({colorScheme: 'dark'});
  await expectTheme(page, 'dark', 'system');
  await page.getByRole('button', {name: 'Switch to light mode'}).click();
  await expectTheme(page, 'light');
  await page.emulateMedia({colorScheme: 'light'});
  await expectTheme(page, 'light');
  await page.emulateMedia({colorScheme: 'dark'});
  await expectTheme(page, 'light');
  expect(await page.evaluate(
      key => localStorage.getItem(key), THEME_STORAGE_KEY))
      .toBe('light');
});

test('never erases a saved preference during hydration', async ({page}) => {
  await page.addInitScript((key) => {
    localStorage.setItem(key, 'dark');
    window.themeStorageWrites = [];
    for (const method of ['setItem', 'removeItem', 'clear']) {
      const original = Storage.prototype[method];
      Storage.prototype[method] = function(...args) {
        if (this === localStorage && (method === 'clear' || args[0] === key)) {
          window.themeStorageWrites.push({method, args});
        }
        return original.apply(this, args);
      };
    }
  }, THEME_STORAGE_KEY);
  await visitPage(page, '/');
  await expectTheme(page, 'dark');
  // Wait for the provider's persistence effect, not just the SSR boot script.
  await expect.poll(() => page.evaluate(() => window.themeStorageWrites.length))
      .toBeGreaterThan(0);
  const writes = await page.evaluate(() => window.themeStorageWrites);
  for (const {method, args} of writes) {
    expect(method).toBe('setItem');
    expect(args).toEqual([THEME_STORAGE_KEY, 'dark']);
  }
  expect(await page.evaluate(
      key => localStorage.getItem(key), THEME_STORAGE_KEY))
      .toBe('dark');
});

test('theme can be changed from the mobile menu', async ({page}) => {
  await page.setViewportSize({width: 375, height: 812});
  await visitPage(page, '/');
  await page.getByRole('button', {name: 'Menu', exact: true}).click();
  const menu = page.getByRole('dialog', {name: 'Menu'});
  await menu.getByRole('button', {name: 'Dark', exact: true}).click();
  await expectTheme(page, 'dark');
  await menu.getByRole('button', {name: 'Light', exact: true}).click();
  await expectTheme(page, 'light');
  await menu.getByRole('button', {name: 'Close menu'}).click();
  await page.reload();
  await expectTheme(page, 'light');
});

test('theme toggle supports keyboard activation', async ({page}) => {
  await visitPage(page, '/');
  const toggle = page.getByRole('button', {name: 'Switch to dark mode'});
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expectTheme(page, 'dark');
  await page.keyboard.press('Space');
  await expectTheme(page, 'light');
});
