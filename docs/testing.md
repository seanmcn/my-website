# Testing

```bash
npm test   # the unit tests, then the Playwright suite
```

## Unit tests

`npm run test:unit` runs `tests/unit/` with Node's test runner. It checks
every library item's frontmatter against the rules in
`src/lib/frontmatter.mjs`. It also fails if
`content/blog/frontmatter.schema.json` is out of date. See
[content.md](content.md).

## End-to-end tests

Install the test browser once:

```bash
npx playwright install chromium
```

Playwright builds the site, serves the build at `http://127.0.0.1:8001` and
stops the server when it's done, so keep that port free. Use Node.js 24 both to
install the browser and to run the tests.

The specs are in `tests/e2e/`, one per area: responsive layout and navigation,
accessibility, theme, content behaviour, fonts, images and so on. The
accessibility spec runs full-page axe scans on representative routes. It
covers light and dark themes at mobile and desktop widths, with menus and
filters open as well as closed. Automated axe checks complement manual
keyboard and screen-reader testing, not replace it. YouTube players are
excluded from axe because YouTube controls their content. The site's own
iframe titles are checked separately.

```bash
npm run test:e2e                              # the suite, headless
npm run test:e2e -- tests/e2e/theme.spec.js   # one spec
npm run test:e2e:ui                           # the interactive runner
npm run test:e2e:report                       # the last HTML report
```

Failures keep screenshots and Playwright traces, and axe results are attached
to the HTML report. Reports and results are ignored by Git.

## CI

`.github/workflows/playwright.yml` runs on pushes to `main` and `develop`, and
on pull requests. It runs `npm run lint`, then the unit tests, then installs
Chromium and runs the Playwright suite. Reports and failure artifacts are kept
for seven days.

Playwright browsers are installed only for testing, never during the Amplify
build.
