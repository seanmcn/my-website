const {expect} = require('@playwright/test');

const THEME_STORAGE_KEY = 'site-theme-preference';
const pages = [
  {label: 'home', path: '/'},
  {label: 'library', path: '/library/'},
  {label: 'library posts filter', path: '/library/posts/'},
  {label: 'tag index', path: '/library/tags/'},
  {
    label: 'world models post',
    path: '/library/2026/04/what-are-world-models-in-ai/',
  },
  {label: 'projects', path: '/projects/'},
  {label: 'chinwag project', path: '/projects/chinwag/'},
  {label: 'about', path: '/about/'},
  {label: 'contact', path: '/contact/'},
  {label: 'search', path: '/search/'},
];

async function visitPage(page, path) {
  const response = await page.goto(path);
  expect(response.status(), `${path} should load successfully`).toBe(200);
  await expect(page.getByRole('main')).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  // Scan rendered content, including asynchronously generated diagrams.
  for (const diagram of await page.locator('.mermaidWrapper').all()) {
    await expect(diagram).toHaveAttribute('data-mermaid-state', 'rendered');
  }
}

async function expectTheme(page, theme, preference = theme) {
  await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
  await expect(page.locator('html'))
      .toHaveAttribute('data-theme-preference', preference);
  await expect(page.locator('html')).toHaveCSS('color-scheme', theme);
  // The header toggle is hidden on mobile, where the menu has its own control.
  await expect(page.locator('.themeToggle')).toHaveAttribute(
      'aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
}

async function expectNoHorizontalOverflow(page) {
  await expect.poll(() => page.evaluate(() => {
    return document.documentElement.scrollWidth -
      document.documentElement.clientWidth;
  }), {message: 'The page should fit without horizontal scrolling'})
      .toBeLessThanOrEqual(1);
}

module.exports = {
  THEME_STORAGE_KEY,
  pages,
  visitPage,
  expectTheme,
  expectNoHorizontalOverflow,
};
