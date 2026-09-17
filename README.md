# My Website

[![Website](https://img.shields.io/website?url=https%3A%2F%2Fseanmcn.com&style=for-the-badge&label=seanmcn.com)](https://seanmcn.com)
[![GitHub last commit](https://img.shields.io/github/last-commit/Seanmcn/my-website?style=for-the-badge)](https://github.com/Seanmcn/my-website/commits/main)
[![Node.js](https://img.shields.io/badge/node-22.x-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Playwright](https://github.com/Seanmcn/my-website/actions/workflows/playwright.yml/badge.svg)](https://github.com/Seanmcn/my-website/actions/workflows/playwright.yml)

The codebase for [seanmcn.com](https://seanmcn.com), a Gatsby-powered personal site and blog built with React, MDX, and Bulma.

## Overview

- Blog content is sourced from Markdown and MDX files in `content/blog`.
- Pages are statically generated with Gatsby and deployed via AWS Amplify.
- Search is powered client-side with Fuse.js and `match-sorter`.
- End-to-end coverage is handled with Playwright and axe.

## Live Environments

- Production: [seanmcn.com](https://seanmcn.com)
- Development: [develop.seanmcn.com](https://develop.seanmcn.com)

## Tech Stack

- Gatsby 5
- React 18
- MDX
- Bulma + Sass
- AWS Amplify
- Playwright

## Getting Started

### Requirements

- Node.js 22
- npm 10+

### Install

```bash
nvm use
npm ci
```

### Run Locally

```bash
npm run develop
```

The site will start on port `8000`, or the next available port if `8000` is already in use.

## Useful Scripts

```bash
npm run develop     # Start the Gatsby dev server
npm run build       # Create a production build
npm run serve       # Serve the production build locally
npm run clean       # Remove Gatsby caches and build output
npm run post:create # Scaffold a new post
npm test            # Run Playwright headlessly
npm run test:e2e:ui  # Open the interactive Playwright runner
npm run test:e2e:report # View the last HTML test report
```

## End-to-End Tests

After installing dependencies, install the test browser once:

```bash
npx playwright install chromium
npm test
```

Playwright builds the site, starts a production server at `http://127.0.0.1:8001`,
and stops it when finished. Keep that port free and stop any Gatsby development
server before running tests, since Gatsby shares its build output and cache.
Use Node.js 22 (`nvm use`) for both installation and tests.

The initial Chromium suite in `tests/e2e/` covers:

- Responsive navigation, mobile menus, collapsible filters, and horizontal
  overflow across phone, tablet, and desktop widths, including the 760px breakpoint.
- Full-page axe accessibility scans on ten representative routes in light and
  dark themes at mobile and desktop widths, plus open menus and filters.
- System appearance, manual theme changes, keyboard activation, persistence
  across navigation/reloads, and saved preferences during hydration.

Automated axe checks complement manual keyboard and screen-reader testing.
YouTube players are excluded from axe because their content is controlled by
YouTube; the site's iframe titles are checked separately.
The broader content-feature tests are outside this initial suite.

`npm run test:e2e` and `npm run test:e2e:ci` also run the headless suite.
To run one area, use `npm run test:e2e -- tests/e2e/theme.spec.js`.
Failures retain screenshots and Playwright traces; axe results are attached to
the HTML report. Generated reports and results are ignored by Git.

## VS Code Image Generation

Add `OPENAI_API_KEY=...` to a repo-root `.env` file, open a post under
`content/blog`, then run the `Generate Featured Image` VS Code task.

The task will:

- ask for an internal illustration style (`basic-cartoon`, `mascot-cartoon`, `chibi-cartoon`, or `cozy-cartoon-scene`)
- ask for the image concept prompt
- ask for a palette mode (`pastel`, `balanced`, or `bright`)
- generate a square OpenAI image using the built-in cartoon editorial style prompt, with automatic variation in palette emphasis, character treatment, and finish
- save the PNG into the post's sibling `images/` directory
- update the post's `featured:` frontmatter automatically

For example, running it from
`content/blog/2026/04/world-models-(trying-to-understand-them).md` writes the
image into `content/blog/2026/04/images/`.

## Project Structure

```text
content/blog/   Blog posts and MDX content
src/components/ Reusable UI components
src/pages/      Route-level pages
src/templates/  Gatsby page templates
gatsby-*.mjs    Gatsby config and build hooks
amplify.yml     AWS Amplify build configuration
```

## Deployment

AWS Amplify builds and deploys the site from this repository using the default Amplify build image and the configuration in `amplify.yml`.

Branch mapping:

- `main` -> production
- `develop` -> development

## CI

GitHub Actions installs Chromium and runs Playwright on pushes to `main` and
`develop`, and on pull requests. Reports and failure artifacts are retained for
seven days. No test-dashboard account or recording secret is required.

## Notes

- The test server sets `E2E_TESTING=true` so archive content remains available
  if the development-only archive shortcut is enabled in Gatsby's config.
- Playwright browsers are installed explicitly for testing, not during Amplify deployment.
