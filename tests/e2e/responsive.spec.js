const {test, expect} = require('@playwright/test');
const {
  pages, visitPage, expectNoHorizontalOverflow,
} = require('./helpers');

// Exercise phones, tablet/desktop layouts, and both sides of the 760px cutoff.
for (const width of [320, 375, 414, 759, 760, 1024, 1440]) {
  test.describe(`${width}px viewport`, () => {
    test.use({viewport: {width, height: 900}});

    test('navigation and filters adapt to the viewport', async ({page}) => {
      await visitPage(page, '/');
      const menuButton = page.getByRole('button', {name: 'Menu', exact: true});
      const navigation = page.getByRole('navigation', {name: 'Primary'});

      if (width < 760) {
        await expect(menuButton).toBeVisible();
        await expect(navigation).toBeHidden();
        await menuButton.click();
        const menu = page.getByRole('dialog', {name: 'Menu'});
        await expect(menu).toBeVisible();
        await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
        await expect(menu.getByRole('navigation').getByRole('link'))
            .toHaveCount(5);
        await expect(menu.getByRole('button', {name: 'Close menu'}))
            .toBeFocused();
        await expectNoHorizontalOverflow(page);
        await menu.getByRole('button', {name: 'Close menu'}).click();
        await expect(menu).toBeHidden();
        await expect(menuButton).toHaveAttribute('aria-expanded', 'false');

        await menuButton.click();
        await page.keyboard.press('Escape');
        await expect(menu).toBeHidden();

        await menuButton.click();
        await menu.getByRole('link', {name: 'Library', exact: true}).click();
        await expect(page).toHaveURL('/library/');
        await expect(menu).toBeHidden();
      } else {
        await expect(menuButton).toBeHidden();
        await expect(navigation).toBeVisible();
        await navigation.getByRole('link', {name: 'Library', exact: true})
            .click();
        await expect(page).toHaveURL('/library/');
      }

      const rail = page.locator('.rail--collapsible');
      const filters = page.getByRole('button', {name: /filters/i});
      if (width < 760) {
        await expect(rail).toBeHidden();
        await expect(filters).toHaveAttribute('aria-expanded', 'false');
        await filters.click();
        await expect(filters).toHaveAttribute('aria-expanded', 'true');
        await expect(rail).toBeVisible();
        await expectNoHorizontalOverflow(page);
        await filters.click();
        await expect(rail).toBeHidden();
      } else {
        await expect(filters).toBeHidden();
        await expect(rail).toBeVisible();
      }
      await expectNoHorizontalOverflow(page);
    });
  });
}

for (const width of [375, 1024, 1440]) {
  test.describe(`page layout at ${width}px`, () => {
    test.use({viewport: {width, height: 900}});
    for (const {label, path} of pages) {
      test(`${label} fits the viewport`, async ({page}) => {
        await visitPage(page, path);
        await expectNoHorizontalOverflow(page);
        await expect(page.getByRole('contentinfo')).toBeVisible();
      });
    }
  });
}
