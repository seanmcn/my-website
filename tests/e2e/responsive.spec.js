const {test, expect} = require('@playwright/test');
const {
  pages, visitPage, expectNoHorizontalOverflow,
} = require('./helpers');

// Exercise phones, tablet/desktop layouts, and both sides of the 760px cutoff.
// The three widest cover the root font size's three regimes, since every rem
// length in the design system grows with it: still interpolating at 1440,
// exactly at the 1920 ceiling, and held flat beyond it at 2560.
for (const width of [320, 375, 414, 759, 760, 1024, 1440, 1920, 2560]) {
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

// One narrow, one mid, and the two wide widths where the scaled root pushes
// the shell, the rails and the gutters out with it.
for (const width of [375, 1024, 1440, 1920, 2560]) {
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

// A framed block (quote, code, table, image) never sits beside a post's
// featured image, whether a short intro comes first or the post opens with
// one: beside it, a quote squeezes into a column and a code listing's frame
// runs under the image.
const FEATURED_BESIDE_BLOCK = [
  '/library/2009/11/programmer-personality/',
  '/library/2010/12/installing-pear-in-wamp/',
  '/library/2009/09/ubuntu-cheat-sheets/',
  '/library/2015/02/perfect-web-server/',
];

for (const width of [375, 1024, 1440]) {
  test.describe(`featured image at ${width}px`, () => {
    test.use({viewport: {width, height: 900}});
    for (const path of FEATURED_BESIDE_BLOCK) {
      test(`${path} starts its framed blocks below the image`, async ({
        page,
      }) => {
        await visitPage(page, path);
        const image = await page.locator('.prose__float-figure').boundingBox();
        const blocks = page.locator(
            '.prose :is(blockquote, table, .code-wrapper, .mermaid-wrapper, ' +
            '.video-embed, .prose-image-link), .prose > img',
        );
        expect(await blocks.count()).toBeGreaterThan(0);
        for (const block of await blocks.all()) {
          const box = await block.boundingBox();
          expect(box.y).toBeGreaterThanOrEqual(image.y + image.height);
        }
      });
    }

    // The series box is navigation, not part of the post, so it sits above
    // the image rather than having its frame run under it.
    test('a series box comes before the featured image', async ({page}) => {
      await visitPage(
          page, '/library/2016/11/making-simple-rts-game-week-three/',
      );
      const image = await page.locator('.prose__float-figure').boundingBox();
      const series = await page.locator('.series').boundingBox();
      expect(series.y + series.height).toBeLessThanOrEqual(image.y);
    });
  });
}
