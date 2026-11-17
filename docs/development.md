# Development

## Requirements

- Node.js 24, pinned in `.nvmrc`
- npm 10+

```bash
fnm use   # or nvm use; both read .nvmrc
npm ci
```

## Running locally

```bash
npm run dev       # http://localhost:4321, or the next free port
npm run dev:lan   # the same, reachable from other devices on the network
```

The components items can use (Kbd, Steps, Note, sticky notes, code listings,
diagrams) are laid out at `/dev/components/`, which only exists under the dev
server. Edit `src/dev/components.mdx` to try things out.

Drafts (`draft: true` in frontmatter) show under the dev server and are left
out of builds, unless the build runs with `SHOW_DRAFTS=true`.

Astro caches rendered Markdown. After changing a plugin in `src/plugins/`, run
`npm run clean` so every item is rendered again.

## Scripts

```bash
npm run dev             # Start the Astro dev server
npm run dev:lan         # Start it on 0.0.0.0
npm run build           # Create a production build in dist/
npm run preview         # Serve the production build locally
npm run clean           # Remove the build output and Astro's caches
npm run lint            # Run ESLint and Stylelint
npm run format          # Fix what ESLint can in src/
npm test                # Run the unit tests, then Playwright
npm run schema          # Regenerate content/blog/frontmatter.schema.json
npm run taxonomy        # List categories and tags with their counts
npm run favicons        # Fetch icons for any new external link hosts
npm run image           # Generate a featured image for an item
npm run image:manual    # The same, with the concept and style given
```

The test scripts are covered in [testing.md](testing.md), and the image
scripts in [featured-images.md](featured-images.md).

## Link favicons

External links in items, projects and pages show the linked site's favicon.
`npm run favicons` finds every external host linked from `content/blog`,
`content/projects` and `src/pages`. It saves a PNG to
`public/favicons/<host>.png` for each host that doesn't have one yet. Run it
after adding links to new sites, and commit the icons it fetches.

## Project structure

```text
content/blog/        Library items (Markdown and MDX)
content/projects/    Project pages
docs/                These docs
infra/               The email subscriptions stack (CDK, its own package)
public/              Files served as-is (favicons, robots.txt, sw.js)
scripts/             Featured images, favicons, schema and taxonomy
src/pages/           Routes
src/components/      Astro components
src/lib/             Content queries: listings, related items, search index
src/plugins/         The Markdown plugins and code listing theme
src/integrations/    Build hooks: legacy redirects, dev-only pages
src/scripts/         Browser scripts (theme, header, prose, diagrams, search)
tests/               Unit tests and the Playwright suite
astro.config.mjs     Astro config
amplify.yml          AWS Amplify build configuration
customHttp.yml       Cache and security headers
```
