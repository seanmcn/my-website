const {test, expect} = require('@playwright/test');

/*
 * The signup and confirm forms post to the subscribe API in infra/, which is
 * stood in for here: each post is checked, then answered with the redirect
 * the real API would send. infra/test/signup.test.mjs covers the API itself.
 */

const API = 'https://subscribe.seanmcn.com';
const ITEM = '/library/2026/04/what-are-world-models-in-ai/';
const CONFIRM_LINK =
  '/subscribe/confirm/?email=reader%40example.com&token=t0k3n';

// Answers the next post to `path` with a redirect, and hands back its fields.
function standIn(page, path, redirectTo) {
  return new Promise((resolve) => {
    page.route(`${API}${path}`, async (route) => {
      const request = route.request();
      resolve({
        method: request.method(),
        fields: Object.fromEntries(new URLSearchParams(request.postData())),
      });
      await route.fulfill({
        status: 303,
        headers: {location: new URL(redirectTo, page.url()).href},
      });
    });
  });
}

test('an item ends with the signup form', async ({page}) => {
  await page.goto(ITEM);

  const form = page.getByRole('region', {name: 'Get new posts by email'});
  await expect(form).toBeVisible();
  await expect(form.getByRole('link', {name: 'RSS feed'}))
      .toHaveAttribute('href', '/rss.xml');
  // Only bots see the trap.
  await expect(form.locator('input[name="website"]')).not.toBeInViewport();
});

test('signing up posts the address and shows the inbox', async ({page}) => {
  await page.goto(ITEM);
  const posted = standIn(page, '/subscribe', '/subscribe/check-your-inbox/');

  await page.getByLabel('Email address').fill('reader@example.com');
  await page.getByRole('button', {name: 'Subscribe'}).click();

  expect(await posted).toEqual({
    method: 'POST',
    fields: {email: 'reader@example.com', website: ''},
  });
  await expect(page).toHaveURL('/subscribe/check-your-inbox/');
  await expect(page.getByRole('heading', {level: 1}))
      .toHaveText('Check your inbox');
});

test('confirming posts the address and token from the link', async ({page}) => {
  await page.goto(CONFIRM_LINK);
  const posted = standIn(page, '/confirm', '/subscribe/confirmed/');

  await page.getByRole('button', {name: 'Confirm subscription'}).click();

  expect(await posted).toEqual({
    method: 'POST',
    fields: {email: 'reader@example.com', token: 't0k3n'},
  });
  await expect(page).toHaveURL('/subscribe/confirmed/');
  await expect(page.getByRole('heading', {level: 1}))
      .toHaveText('You’re subscribed');
});

test('pages that follow a form post are kept out of search', async ({page}) => {
  for (const step of [
    'check-your-inbox', 'confirm', 'confirmed', 'link-expired', 'problem',
  ]) {
    await page.goto(`/subscribe/${step}/`);
    await expect(page.locator('meta[name="robots"]'))
        .toHaveAttribute('content', 'noindex, nofollow');
  }

  await page.goto('/subscribe/');
  await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
});

test('the footer links to email and RSS', async ({page}) => {
  await page.goto('/');
  const footer = page.locator('.site-footer');

  await expect(footer.getByRole('link', {name: 'email'}))
      .toHaveAttribute('href', '/subscribe/');
  await expect(footer.getByRole('link', {name: 'RSS'}))
      .toHaveAttribute('href', '/rss.xml');
});
