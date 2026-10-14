const {test, expect} = require('@playwright/test');
const {visitPage} = require('./helpers');

const AVATAR_NAMES = ['beer', 'cheer', 'thumbs-up', 'santa'];

async function visibleAvatar(page) {
  const visible = page.locator('.site-header__avatar img:visible');
  await expect(visible).toHaveCount(1);
  await expect(visible).toHaveJSProperty('complete', true);
  const src = await visible.getAttribute('src');
  return AVATAR_NAMES.find(name => src.includes(`/${name}.`));
}

test('header avatar changes on every page and loads them all up front',
    async ({page}) => {
      const requested = new Set();
      page.on('request', (request) => {
        for (const name of AVATAR_NAMES) {
          if (request.url().includes(`/_astro/${name}.`)) requested.add(name);
        }
      });

      const seen = [];
      for (const path of ['/library/', '/about/', '/projects/', '/contact/']) {
        await visitPage(page, path);
        seen.push(await visibleAvatar(page));
        if (seen.length === 1) {
          expect([...requested].sort()).toEqual([...AVATAR_NAMES].sort());
        }
      }

      expect(seen).not.toContain(undefined);
      for (let i = 1; i < seen.length; i++) {
        expect(seen[i], `page ${i} repeats the last avatar`)
            .not.toBe(seen[i - 1]);
      }
    });

test('home bio avatar stays the wave', async ({page}) => {
  await visitPage(page, '/');
  await expect(page.locator('.home-bio__avatar img'))
      .toHaveAttribute('src', /\/wave\./);
  await visibleAvatar(page);
});

for (const [date, expected] of [
  ['2026-12-14T12:00:00', 'thumbs-up'],
  ['2026-12-15T00:30:00', 'santa'],
  ['2026-12-25T23:30:00', 'santa'],
  ['2026-12-26T12:00:00', 'thumbs-up'],
]) {
  test(`header avatar on ${date} can be ${expected}`, async ({page}) => {
    await page.clock.setFixedTime(new Date(date));
    // The top of the range is the last avatar in play: Santa when he's in.
    await page.addInitScript(() => {
      Math.random = () => 0.999;
    });
    await visitPage(page, '/about/');
    expect(await visibleAvatar(page)).toBe(expected);
  });
}
