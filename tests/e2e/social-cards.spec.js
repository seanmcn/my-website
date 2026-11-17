const {test, expect} = require('@playwright/test');

/*
 * Each page names its social card in og:image, and the card is built as a
 * 1200x630 PNG. See docs/social-cards.md.
 */

const cards = [
  {path: '/', card: 'home'},
  {path: '/search/', card: 'home'},
  {path: '/library/', card: 'library'},
  {path: '/library/posts/', card: 'library'},
  {path: '/library/tags/', card: 'library'},
  {
    path: '/library/2026/04/what-are-world-models-in-ai/',
    card: 'library/2026/04/what-are-world-models-in-ai',
  },
  {path: '/projects/', card: 'projects'},
  {path: '/projects/chinwag/', card: 'projects/chinwag'},
  {path: '/about/', card: 'about'},
  {path: '/contact/', card: 'contact'},
  {path: '/subscribe/', card: 'subscribe'},
  {path: '/subscribe/confirmed/', card: 'subscribe'},
  {path: '/404.html', card: 'not-found'},
];

/* A PNG's width and height, from its IHDR chunk. */
function pngSize(buffer) {
  return {width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20)};
}

for (const {path, card} of cards) {
  test(`${path} shares the ${card} card`, async ({page, request}) => {
    await page.goto(path);

    const meta = name => page
        .locator(`meta[property="${name}"], meta[name="${name}"]`)
        .getAttribute('content');
    const image = await meta('og:image');
    expect(image).toBe(`https://seanmcn.com/og/${card}.png`);
    expect(await meta('twitter:image')).toBe(image);
    expect(await meta('twitter:card')).toBe('summary_large_image');

    const response = await request.get(new URL(image).pathname);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toBe('image/png');
    const body = await response.body();
    expect(pngSize(body)).toEqual({width: 1200, height: 630});
    // WhatsApp drops previews whose image is much over 300 KB.
    expect(body.length).toBeLessThan(300 * 1024);
  });
}
