const {test, expect} = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const {pages, visitPage, expectTheme, THEME_STORAGE_KEY} = require('./helpers');

const YOUTUBE_FRAME = 'iframe[src^="https://www.youtube.com/embed/"]';

async function audit(page, testInfo) {
  // Prevent axe from measuring intermediate colours during theme transitions.
  await page.addStyleTag({content: `
    *, *::before, *::after {
      transition: none !important;
      animation: none !important;
    }
  `});
  // YouTube controls the player DOM. Check our iframe's accessible name here
  // and exclude the third-party player from axe, keeping every site rule on.
  for (const frame of await page.locator(YOUTUBE_FRAME).all()) {
    await expect(frame).toHaveAttribute('title', /\S/);
  }
  const results = await new AxeBuilder({page})
      .exclude(YOUTUBE_FRAME)
      .analyze();
  await testInfo.attach('accessibility-results', {
    body: JSON.stringify(results, null, 2),
    contentType: 'application/json',
  });
  expect(results.violations).toEqual([]);
}

for (const width of [375, 1440]) {
  for (const theme of ['light', 'dark']) {
    test.describe(`${width}px / ${theme}`, () => {
      test.use({viewport: {width, height: 900}});
      test.beforeEach(async ({page}) => {
        await page.addInitScript(({key, value}) => {
          window.localStorage.setItem(key, value);
        }, {key: THEME_STORAGE_KEY, value: theme});
      });

      for (const {label, path} of pages) {
        test(`${label} has no axe violations`, async ({page}, testInfo) => {
          await visitPage(page, path);
          await expectTheme(page, theme);
          await audit(page, testInfo);
        });
      }

      if (width < 760) {
        test('open menu has no axe violations', async ({page}, testInfo) => {
          await visitPage(page, '/');
          await expectTheme(page, theme);
          await page.getByRole('button', {name: 'Menu', exact: true}).click();
          await expect(page.getByRole('dialog', {name: 'Menu'})).toBeVisible();
          await audit(page, testInfo);
        });

        test('expanded filters pass axe', async ({page}, testInfo) => {
          await visitPage(page, '/library/');
          await expectTheme(page, theme);
          await page.getByRole('button', {name: /filters/i}).click();
          await expect(page.locator('.rail--collapsible')).toBeVisible();
          await audit(page, testInfo);
        });
      }
    });
  }
}
