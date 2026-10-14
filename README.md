# My Website

[![Website](https://img.shields.io/website?url=https%3A%2F%2Fseanmcn.com&style=for-the-badge&label=seanmcn.com)](https://seanmcn.com)
[![GitHub last commit](https://img.shields.io/github/last-commit/Seanmcn/my-website?style=for-the-badge)](https://github.com/Seanmcn/my-website/commits/main)
[![Node.js](https://img.shields.io/badge/node-24.x-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Playwright](https://github.com/Seanmcn/my-website/actions/workflows/playwright.yml/badge.svg)](https://github.com/Seanmcn/my-website/actions/workflows/playwright.yml)

The codebase for [seanmcn.com](https://seanmcn.com), a personal site and blog built with Astro, Markdown and MDX.

## Overview

- Library content (posts, notes and finds) is Markdown and MDX in `content/blog`,
  projects are Markdown in `content/projects`; both are Astro content collections
  with their frontmatter validated in `src/content.config.js`.
- Pages are statically generated with Astro and deployed via AWS Amplify. They
  ship no framework JavaScript; the only React islands are search and the
  cheat sheet table.
- Search runs client-side with Fuse.js over `/search-index.json`, built with the
  site.
- End-to-end coverage is handled with Playwright and axe.

## Live Environments

- Production: [seanmcn.com](https://seanmcn.com)
- Development: [develop.seanmcn.com](https://develop.seanmcn.com)

## Tech Stack

- Astro 7, with Sätteri (its default Markdown processor) and Shiki
- MDX
- React 18, for the two islands
- Sass
- AWS Amplify
- Playwright

## Getting Started

### Requirements

- Node.js 24
- npm 10+

### Install

```bash
fnm use   # or nvm use; both read .nvmrc
npm ci
```

### Run Locally

```bash
npm run dev
```

The site starts on port `4321`, or the next free port. The components posts can
use (Kbd, Steps, Note, sticky notes, code listings, diagrams) are laid out at
`/dev/components/`, which only exists under the dev server; edit
`src/dev/components.mdx` to try things out.

Drafts (`draft: true` in frontmatter) show under the dev server and are left out
of builds, unless the build runs with `SHOW_DRAFTS=true`.

## Useful Scripts

```bash
npm run dev         # Start the Astro dev server
npm run build       # Create a production build in dist/
npm run preview     # Serve the production build locally
npm run clean       # Remove the build output and Astro's caches
npm run lint        # Run ESLint and Stylelint
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
and stops it when finished. Keep that port free. Use Node.js 24 for both
installation and tests.

The initial Chromium suite in `tests/e2e/` covers:

- Responsive navigation, mobile menus, collapsible filters, and horizontal
  overflow across phone, tablet, and desktop widths, including the 760px breakpoint.
- Full-page axe accessibility scans on ten representative routes in light and
  dark themes at mobile and desktop widths, plus open menus and filters.
- System appearance, manual theme changes, keyboard activation, persistence
  across navigation/reloads, and saved preferences left untouched on load.
- Content behaviour in `content.spec.js`: sticky note stacks, code copy
  buttons, Mermaid diagrams and their viewer, the cheat sheet filter, project
  galleries and filters, contact replies, search, the old-address redirects
  and the 404 page.

Automated axe checks complement manual keyboard and screen-reader testing.
YouTube players are excluded from axe because their content is controlled by
YouTube; the site's iframe titles are checked separately.

`npm run test:e2e` and `npm run test:e2e:ci` also run the headless suite.
To run one area, use `npm run test:e2e -- tests/e2e/theme.spec.js`.
Failures retain screenshots and Playwright traces; axe results are attached to
the HTML report. Generated reports and results are ignored by Git.

## VS Code Image Generation

Add `OPENAI_API_KEY=...` to a repo-root `.env` file, open a post under
`content/blog`, then run one of the two VS Code tasks.

`Generate Featured Image (Auto)` asks nothing. It:

- has `gpt-5` read the post and write a one-sentence concept around one cute
  character: a person for posts about people, otherwise the scene's main
  object brought to life with a face and limbs
- uses `chibi-cartoon` for a person and `mascot-cartoon` for an object
- alternates the palette (`balanced`, `bright`) against the most recently
  generated image, and avoids repeating recent concepts

`Generate Featured Image (Manual)` asks for an illustration style
(`basic-cartoon`, `mascot-cartoon`, `chibi-cartoon`, or
`cozy-cartoon-scene`), the concept prompt, and a palette mode (`pastel`,
`balanced`, or `bright`).

Both then:

- generate a square OpenAI image using the built-in cartoon editorial style prompt, with automatic variation in palette emphasis, character treatment, and finish
- save the PNG into the post's sibling `images/` directory
- update the post's `featured`, `featuredStyle`, `featuredPalette` and
  `featuredPrompt` frontmatter automatically

To see the concept and full image prompt without generating anything, run
`node scripts/auto-featured-image.mjs --file <post> --dry-run`.

For example, running it from
`content/blog/2026/04/world-models-(trying-to-understand-them).md` writes the
image into `content/blog/2026/04/images/`.

## Project Structure

```text
content/blog/        Library items (Markdown and MDX)
content/projects/    Project pages
public/              Files served as-is (favicons, robots.txt, sw.js)
src/pages/           Routes
src/components/      Astro components, plus the two React islands
src/lib/             Content queries: listings, related posts, search index
src/plugins/         The Markdown plugins and code listing theme
src/integrations/    Build hooks: legacy redirects, dev-only pages
src/scripts/         Browser scripts (theme, header, prose, diagrams)
astro.config.mjs     Astro config
amplify.yml          AWS Amplify build configuration
```

## Deployment

AWS Amplify builds and deploys the site from this repository using the default Amplify build image and the configuration in `amplify.yml`.

Branch mapping:

- `main` -> production
- `develop` -> development

Cache and security headers live in `customHttp.yml`. Redirects live in the
Amplify console (Hosting → Rewrites and redirects), in this order:

| Source                    | Target                | Type          |
| ------------------------- | --------------------- | ------------- |
| `/sw.js`                  | `/sw.js`              | 200 (rewrite) |
| `https://www.seanmcn.com` | `https://seanmcn.com` | 301           |
| `/feed/`                  | `/rss.xml`            | 301           |
| `/<*>`                    | `/404.html`           | 404 (rewrite) |

Amplify applies the first rule that matches. The `/sw.js` rule has to stay
above the `www` redirect: browsers won't follow a redirect when they check a
service worker for updates, so without it the Gatsby service worker on `www`
would never be replaced.

## CI

GitHub Actions runs `npm run lint`, then installs Chromium and runs Playwright
on pushes to `main` and `develop`, and on pull requests. Reports and failure artifacts are retained for
seven days. No test-dashboard account or recording secret is required.

## Notes

- Every address the site has used since its WordPress days (`/YYYY/MM/slug/`,
  `/blog/…`, paged lists, merged categories) is redirected by
  `src/integrations/redirects.mjs`, which writes a redirect page at each old
  address. Anything else gets the 404 page, which suggests the closest pages.
- `public/sw.js` replaces the Gatsby site's offline service worker: returning
  visitors who still have that installed pick this one up, and it clears its
  caches and unregisters itself. The `/sw.js` rule under Deployment keeps it
  reachable on `www`.
- Astro caches rendered Markdown. After changing a plugin in `src/plugins/`,
  run `npm run clean` so every post is rendered again.
- Playwright browsers are installed explicitly for testing, not during Amplify deployment.
