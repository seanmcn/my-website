const {test, expect} = require('@playwright/test');
const {visitPage} = require('./helpers');

/*
 * The behaviour posts rely on in the browser: interactive MDX components,
 * code listings, diagrams, galleries, and the old addresses that redirect.
 */

const MACBOOK_GUIDE = '/library/2026/08/opinionated-macbook-guide/';

test('a sticky stack cycles, and a StickyRef flips it', async ({page}) => {
  await visitPage(page, MACBOOK_GUIDE);
  const counter = page.locator('.sticky-stack .sticky-stack__counter');
  await expect(counter).toContainText('1 / 2');
  await page.getByRole('button', {name: 'Next note'}).click();
  await expect(counter).toContainText('2 / 2');
  await page.getByRole('link', {name: 'Jump to note 3'}).click();
  await expect(counter).toContainText('1 / 2');
});

test('code listings copy their source', async ({page, context}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await visitPage(page, MACBOOK_GUIDE);
  const listing = page.locator('.code-wrapper').first();
  await expect(listing.locator('.code-language')).toHaveText('bash');
  await listing.getByRole('button', {name: 'Copy'}).click();
  await expect(listing.getByRole('button', {name: 'Copied'})).toBeVisible();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toBe(await listing.locator('pre code').innerText());
});

test('mermaid diagrams draw and open in the viewer', async ({page}) => {
  await visitPage(page, '/library/2026/04/what-are-world-models-in-ai/');
  const diagram = page.locator('.mermaid-wrapper').first();
  await expect(diagram).toHaveAttribute('data-mermaid-state', 'rendered');
  await expect(diagram.locator('.mermaid-rendered svg')).toBeVisible();
  await diagram.getByRole('button', {name: /fullscreen viewer/}).click();
  const viewer = page.getByRole('dialog', {name: 'Fullscreen Mermaid diagram'});
  await expect(viewer.locator('svg').first()).toBeVisible();
  await viewer.getByRole('button', {name: 'Zoom in Mermaid diagram'}).click();
  await expect(viewer.getByRole('button', {name: /Reset/})).toHaveText('125%');
  await page.keyboard.press('Escape');
  await expect(viewer).toBeHidden();
});

test('the cheat sheet table filters as you type', async ({page}) => {
  await visitPage(page, '/library/cheat-sheets/screen/');
  const rows = page.locator('table tbody tr');
  const before = await rows.count();
  await page.getByPlaceholder(/Search \d+ commands/).fill('detach');
  await expect.poll(() => rows.count()).toBeLessThan(before);
});

test('a project gallery switches shots and opens a lightbox', async ({
  page,
}) => {
  await visitPage(page, '/projects/chinwag/');
  const stage = page.locator('.project-shots__stage');
  await page.getByRole('button', {name: 'Show image 2: Conversation'}).click();
  await expect(page.locator('.project-shots__head')).toContainText('02 / 04');
  await expect(stage.locator('img:not([hidden])')).toHaveAttribute('alt',
      'Conversation');
  await stage.click();
  const lightbox = page.getByRole('dialog', {name: 'Chinwag gallery image'});
  await expect(lightbox).toBeVisible();
  await page.keyboard.press('ArrowRight');
  await expect(lightbox.locator('.lightbox__counter')).toHaveText('03 / 04');
  await page.keyboard.press('Escape');
  await expect(lightbox).toBeHidden();
});

test('the projects stack filter narrows the list', async ({page}) => {
  await visitPage(page, '/projects/');
  const rows = page.locator('.project-row:visible');
  const all = await rows.count();
  await page.locator('.projects-rail__stack', {hasText: 'Go'}).click();
  await expect(page.locator('.projects-bar__results')).toHaveText(/in Go$/);
  expect(await rows.count()).toBeLessThan(all);
  await page.getByRole('button', {name: /Clear filter/}).click();
  await expect(rows).toHaveCount(all);
});

test('a contact link from a post says what it is about', async ({page}) => {
  await visitPage(page, `/contact/?about=2026/08/opinionated-macbook-guide`);
  await expect(page.locator('.contact-reply')).toContainText(
      'My Opinionated MacBook Setup');
  await expect(page.locator('input[name="about"]')).toHaveValue(
      /opinionated-macbook-guide/);
  await page.getByRole('button', {name: 'Remove ✕'}).click();
  await expect(page.locator('.contact-reply')).toBeHidden();
  await expect(page.locator('input[name="about"]')).toBeDisabled();
});

test('search finds a post and links to it', async ({page}) => {
  await visitPage(page, '/search/');
  await page.getByLabel('Search posts, notes, finds and projects')
      .fill('macbook');
  const result = page.locator('.search-page__results .item-row').first();
  await expect(result).toContainText('MacBook');
  await expect(result).toHaveAttribute('href', MACBOOK_GUIDE);
});

for (const [from, to] of [
  ['/blog/2026/08/opinionated-macbook-guide/', MACBOOK_GUIDE],
  ['/blog/', '/library/'],
  ['/blog/page/2/', '/library/'],
  ['/blog/categories/devops/page/2/', '/library/categories/systems/'],
  ['/library/categories/linux/', '/library/categories/systems/'],
  ['/2026/08/opinionated-macbook-guide/', MACBOOK_GUIDE],
  ['/blog/opinionated-macbook-guide/', MACBOOK_GUIDE],
  ['/portfolio/', '/projects/'],
]) {
  test(`${from} redirects to ${to}`, async ({page}) => {
    await page.goto(`${from}?from=test#top`);
    await expect(page).toHaveURL(`${to}?from=test#top`);
  });
}

test('a missing page answers 404 and suggests the closest', async ({page}) => {
  const missing = '/library/2026/08/opinionated-macbok-guide/';
  const response = await page.goto(missing);
  expect(response.status()).toBe(404);
  const terminal = page.locator('[data-not-found]');
  await expect(terminal).toContainText(`'${missing}' is not a page`);
  await expect(terminal.getByRole('link', {name: MACBOOK_GUIDE})).toBeVisible();
});

test('a 404 with nothing close offers search instead', async ({page}) => {
  await page.goto('/zzqx/');
  const terminal = page.locator('[data-not-found]');
  await expect(terminal.getByRole('link', {name: 'seanmcn search'}))
      .toBeVisible();
  await expect(terminal.locator('[data-suggestions]')).toBeHidden();
});
