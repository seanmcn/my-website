const {test, expect} = require('@playwright/test');
const {visitPage} = require('./helpers');

/*
 * The fonts are served from the site itself, configured in astro.config.mjs.
 */

test('every font loads from the site, not a third party', async ({page}) => {
  const fontHosts = new Set();
  page.on('request', (request) => {
    if (request.resourceType() === 'font') {
      fontHosts.add(new URL(request.url()).host);
    }
  });

  // The MacBook guide uses all three: prose, code and the sticky notes.
  await visitPage(page, '/library/2026/08/opinionated-macbook-guide/');

  const loaded = await page.evaluate(() => [...document.fonts]
      .filter(font => font.status === 'loaded')
      .map(font => font.family.replace(/^"|"$/g, '')));
  for (const family of ['Source Serif 4', 'IBM Plex Mono', 'Kalam']) {
    expect(loaded.some(name => name.startsWith(family)), family).toBe(true);
  }
  expect([...fontHosts]).toEqual([new URL(page.url()).host]);
});
