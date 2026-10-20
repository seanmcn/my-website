const {test, expect} = require('@playwright/test');

/*
 * Each image slot's `sizes` hint (src/lib/image-sizes.js) has to follow the
 * layout CSS. On a range of screens, the file the browser picks from each
 * srcset must be sharp (at least as wide as the image shows, in device
 * pixels) and not oversized (no more than one width step above that).
 */
const SLOTS = [
  {
    name: 'post body',
    path: '/library/2016/07/first-month-at-kobas/',
    selector: '.prose img[srcset]',
  },
  {
    name: 'post featured',
    path: '/library/2026/04/chinwag/',
    selector: 'img.featured-image',
  },
  {
    name: 'project card',
    path: '/library/2026/04/chinwag/',
    selector: '.item-rail__project-thumb img',
  },
  {
    name: 'related',
    path: '/library/2026/04/chinwag/',
    selector: '.item-rail__related-thumb img',
  },
  {
    name: 'header avatar',
    path: '/',
    selector: '.site-header__avatar img:visible',
  },
  {name: 'home avatar', path: '/', selector: '.home-bio__avatar img'},
  {name: 'home lead', path: '/', selector: '.home-lead__image img'},
  {name: 'home project', path: '/', selector: '.home-projects__thumb img'},
  {name: 'library row', path: '/library/', selector: '.item-row__thumb img'},
  {
    name: 'project row',
    path: '/projects/',
    selector: '.project-row__thumb img',
  },
  {
    name: 'project stage',
    path: '/projects/chinwag/',
    selector: '.project-shots__stage img:not([hidden])',
  },
  {
    name: 'portrait project stage',
    path: '/projects/steady-days/',
    selector: '.project-shots__stage img:not([hidden])',
  },
  {
    name: 'project strip',
    path: '/projects/chinwag/',
    selector: '.project-shots__thumb img',
  },
];

const SCREENS = [
  {width: 360, height: 780, dpr: 3},
  {width: 390, height: 844, dpr: 2},
  {width: 430, height: 932, dpr: 3},
  {width: 844, height: 390, dpr: 3},
  {width: 600, height: 900, dpr: 2},
  {width: 900, height: 900, dpr: 2},
  {width: 1024, height: 768, dpr: 1},
  {width: 1440, height: 900, dpr: 1},
  {width: 1440, height: 900, dpr: 2},
  {width: 1920, height: 1200, dpr: 2},
];

for (const {width, height, dpr} of SCREENS) {
  test.describe(`at ${width}x${height}, ${dpr}x`, () => {
    test.use({viewport: {width, height}, deviceScaleFactor: dpr});

    for (const {name, path, selector} of SLOTS) {
      test(`${name} picks a sharp, right-sized file`, async ({page}) => {
        await page.goto(path);
        const image = page.locator(selector).first();
        await image.evaluate(element => element.scrollIntoView());
        // Hidden at this width (the related rail on wide screens).
        test.skip(!await image.isVisible(), `${name} isn't shown here`);
        await expect(image).toHaveJSProperty('complete', true);

        const result = await image.evaluate((element) => {
          // The width it shows at in CSS pixels, allowing for
          // object-fit: contain inside a box of another shape.
          const box = element.getBoundingClientRect();
          const aspect = element.naturalWidth / element.naturalHeight;
          const shown = getComputedStyle(element).objectFit === 'contain' ?
            Math.min(box.width, box.height * aspect) :
            box.width;
          const chosen = element.currentSrc;
          const sets = [element, ...(element.closest('picture')
              ?.querySelectorAll('source') || [])];
          const candidates = sets
              .map(set => set.srcset.split(',').map((entry) => {
                const [url, descriptor] = entry.trim().split(/\s+/);
                return {url: new URL(url, location.href).href,
                  width: parseInt(descriptor, 10)};
              }))
              .find(list => list.some(entry => entry.url === chosen)) || [];
          return {
            shown,
            chosen: candidates.find(entry => entry.url === chosen)?.width,
            widths: candidates.map(entry => entry.width).sort((a, b) => a - b),
          };
        });

        const needed = Math.round(result.shown * dpr);
        const largest = result.widths.at(-1);
        const ideal = result.widths.find(w => w >= needed) ?? largest;
        const stepAbove = result.widths[result.widths.indexOf(ideal) + 1] ??
          ideal;
        const detail = `${name} shows at ${needed}px of ${result.widths}, ` +
          `picked ${result.chosen}`;

        expect(result.chosen, detail).toBeDefined();
        expect(result.chosen, `${detail}: blurry`)
            .toBeGreaterThanOrEqual(Math.min(needed, largest) * 0.9);
        expect(result.chosen, `${detail}: oversized`)
            .toBeLessThanOrEqual(stepAbove);
      });
    }
  });
}
