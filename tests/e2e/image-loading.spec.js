const {test, expect} = require('@playwright/test');
const {visitPage} = require('./helpers');

// The image each page leads with, which should load first and never lazily.
const LEAD_IMAGES = [
  {path: '/', selector: '.home-bio__avatar img'},
  {path: '/about/', selector: '.about-bio__portrait img'},
  {path: '/contact/', selector: '.contact-bio__portrait img'},
  {
    path: '/library/2026/04/what-are-world-models-in-ai/',
    selector: 'img.featured-image',
  },
  {
    path: '/projects/chinwag/',
    selector: '.project-shots__stage img:not([hidden])',
  },
];

for (const {path, selector} of LEAD_IMAGES) {
  test(`${path} loads its lead image first and optimised`, async ({page}) => {
    await visitPage(page, path);
    const image = page.locator(selector);
    await expect(image).not.toHaveAttribute('loading', 'lazy');
    await expect(image).toHaveAttribute('fetchpriority', 'high');
    await expect(image).toHaveJSProperty('complete', true);

    const src = await image.evaluate(element => element.currentSrc);
    expect(src).toMatch(/\.(avif|webp)$/);
    const {encodedBodySize} = await page.evaluate(
        url => performance.getEntriesByName(url)[0].toJSON(), src);
    expect(encodedBodySize).toBeLessThan(100 * 1024);
  });
}
