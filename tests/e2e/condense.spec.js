const {test, expect} = require('@playwright/test');
const {visitPage} = require('./helpers');

// On a wide screen the chinwag post's title wraps to two lines, so condensing
// the sticky bar takes about 80px out of the page. Chrome's scroll anchoring
// pulls the scroll position back by the same amount, which once carried it
// back over the release line and set the bar flipping every frame.
test.use({viewport: {width: 2560, height: 1140}});

async function countFlips(page, ms) {
  return page.evaluate(ms => new Promise((resolve) => {
    let flips = 0;
    const observer = new MutationObserver(() => flips++);
    observer.observe(document.querySelector('.item-bar'),
        {attributes: true, attributeFilter: ['class']});
    setTimeout(() => {
      observer.disconnect();
      resolve(flips);
    }, ms);
  }), ms);
}

test('item bar settles after a scroll that condenses it', async ({page}) => {
  await visitPage(page, '/library/2026/04/chinwag/');
  const bar = page.locator('.item-bar');

  for (const delta of [60, 120]) {
    await page.mouse.wheel(0, delta);
    // Let the scroll and the 0.2s shrink finish before watching.
    await page.waitForTimeout(500);
    expect(await countFlips(page, 1000), `after scrolling ${delta}px`)
        .toBe(0);
  }
  await expect(bar).toHaveClass(/is-condensed/);

  await page.mouse.wheel(0, -1000);
  await expect(bar).not.toHaveClass(/is-condensed/);
  expect(await countFlips(page, 1000)).toBe(0);
});
