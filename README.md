# My Website

[![Website](https://img.shields.io/website?url=https%3A%2F%2Fseanmcn.com&style=for-the-badge&label=seanmcn.com)](https://seanmcn.com)
[![GitHub last commit](https://img.shields.io/github/last-commit/Seanmcn/my-website?style=for-the-badge)](https://github.com/Seanmcn/my-website/commits/main)
[![Node.js](https://img.shields.io/badge/node-22.x-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Cypress Test Runs](https://img.shields.io/endpoint?url=https://dashboard.cypress.io/badge/simple/m1uz2r&style=for-the-badge&logo=cypress)](https://dashboard.cypress.io/projects/m1uz2r/runs)

The codebase for [seanmcn.com](https://seanmcn.com), a Gatsby-powered personal site and blog built with React, MDX, and Bulma.

## Overview

- Blog content is sourced from Markdown and MDX files in `content/blog`.
- Pages are statically generated with Gatsby and deployed via AWS Amplify.
- Search is powered client-side with Fuse.js and `match-sorter`.
- End-to-end coverage is handled with Cypress.

## Live Environments

- Production: [seanmcn.com](https://seanmcn.com)
- Development: [develop.seanmcn.com](https://develop.seanmcn.com)

## Tech Stack

- Gatsby 5
- React 18
- MDX
- Bulma + Sass
- AWS Amplify
- Cypress

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
npm run test:e2e    # Open Cypress against a local Gatsby instance
npm run test:e2e:ci # Run Cypress headlessly
npm run test:e2e:record # Run Cypress headlessly and record to the dashboard
```

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

GitHub Actions runs Cypress on pushes to `main` and `develop`, and on pull requests.

To keep the Cypress Dashboard badge accurate, add `CYPRESS_RECORD_KEY` as a GitHub Actions repository secret.

## Notes

- Some Gatsby config changes depend on environment variables used in CI and E2E runs.
- Cypress is included for test runs, but its binary download is skipped during Amplify deployment.
