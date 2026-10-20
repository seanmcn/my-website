# My Website

[![Website](https://img.shields.io/website?url=https%3A%2F%2Fseanmcn.com&style=for-the-badge&label=seanmcn.com)](https://seanmcn.com)
[![GitHub last commit](https://img.shields.io/github/last-commit/Seanmcn/my-website?style=for-the-badge)](https://github.com/Seanmcn/my-website/commits/main)
[![Node.js](https://img.shields.io/badge/node-24.x-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Playwright](https://img.shields.io/github/actions/workflow/status/Seanmcn/my-website/playwright.yml?branch=main&style=for-the-badge&label=playwright)](https://github.com/Seanmcn/my-website/actions/workflows/playwright.yml)

The codebase for [seanmcn.com](https://seanmcn.com), a personal site built
with Astro. The library (posts, notes and finds) is Markdown and MDX in
`content/blog`. Projects are Markdown in `content/projects`. Pages are static
and ship no framework JavaScript, apart from two React islands: search and the
cheat sheet table.

- Production: [seanmcn.com](https://seanmcn.com), from `main`
- Development: [develop.seanmcn.com](https://develop.seanmcn.com), from `develop`

Built with Astro 7 (Sätteri for Markdown, Shiki for code), MDX, Sass, React 18
and Playwright. Search runs in the browser with Fuse.js over
`/search-index.json`, which is built with the site. Hosted on AWS Amplify.

## Quick start

```bash
fnm use   # or nvm use; both read .nvmrc
npm ci
npm run dev
```

```bash
npx playwright install chromium   # once
npm test
```

## Docs

- [Writing library items](docs/content.md): frontmatter rules, conventions and
  a starter template
- [Featured images](docs/featured-images.md): generating an item's image
- [Development](docs/development.md): running locally, scripts, link favicons
  and project structure
- [Testing](docs/testing.md): unit tests, Playwright, accessibility checks and
  CI
- [Deployment](docs/deployment.md): Amplify, branches, redirects and old
  addresses
- [Glossary](GLOSSARY.md): what the site's terms mean
