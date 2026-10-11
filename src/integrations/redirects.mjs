import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

/*
 * Every address the site has served since 2009 that has since moved gets a
 * real page at the old address: canonical tag, meta refresh, and a scripted
 * replace that carries the query string and hash across. Amplify's
 * customHttp.yml covers headers only, so this needs nothing set up in the
 * console. Posts that were deleted are left to the 404 page. The dev server
 * answers the same addresses (with their trailing slash) with the same page.
 *
 * The addresses, oldest first:
 * - WordPress, until 2020: posts at /YYYY/MM/slug/, which is where the slugs'
 *   date prefix comes from, with lists at /category/… and /tag/…
 * - Gatsby reading WordPress, 2020: posts at /blog/slug/ without the date,
 *   and the projects page at /portfolio/.
 * - Gatsby reading Markdown, 2020 to 2026: everything under /blog/, with list
 *   pages at …/page/N/.
 */

const CATEGORY_REDIRECTS = {
  'AI': 'ai',
  'devops': 'systems',
  'game-development': 'programming',
  'linux': 'systems',
  'memes': 'personal',
  'meta': 'personal',
  'research': 'explainers',
  'review': 'reviews',
  'windows': 'systems',
  'work': 'personal',
  'workflow': 'productivity',
};

const normalise = value => (value || '').toString().trim().toLowerCase();

function contentFiles(dir) {
  return fs.readdirSync(dir, {withFileTypes: true}).flatMap((entry) => {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return contentFiles(full);
    }

    return /\.mdx?$/.test(entry.name) ? [full] : [];
  });
}

function publishedItems(root, includeDrafts) {
  return contentFiles(path.join(root, 'content/blog'))
      .map(file => matter(fs.readFileSync(file, 'utf8')).data)
      .filter(data => includeDrafts || data.draft !== true);
}

// List pages have been cut into pages of 5, 9 and 10 items over the years,
// so no list ever ran past ceil(items / 5) pages.
const SMALLEST_PAGE_SIZE = 5;

const laterPages = count => Array.from(
    {length: Math.max(0, Math.ceil(count / SMALLEST_PAGE_SIZE) - 1)},
    (_, index) => index + 2,
);

const countBy = values => values.reduce(
    (counts, value) => counts.set(value, (counts.get(value) || 0) + 1),
    new Map(),
);

/* [fromPath, toPath] pairs, each in its bare and trailing-slash form. */
export function buildRedirects(items) {
  const rules = [];
  const pair = (from, to) => {
    const bare = from.replace(/\/$/, '');
    rules.push([bare, to], [`${bare}/`, to]);
  };
  // Page numbers don't line up across page sizes, so every page of an old
  // list goes to the start of its new one.
  const list = (from, to, count) => {
    pair(from, to);
    laterPages(count).forEach(page => pair(`${from}/page/${page}`, to));
  };

  const categoryCounts = countBy(items.map(item => item.category)
      .filter(Boolean));
  const tagCounts = countBy(items.flatMap(item => item.tags || [])
      .map(normalise).filter(Boolean));

  list('/blog', '/library/', items.length);
  pair('/portfolio', '/projects/');

  items.forEach(({slug}) => {
    pair(`/blog/${slug}`, `/library/${slug}/`);

    if (/^\d{4}\/\d{2}\//.test(slug)) {
      pair(`/${slug}`, `/library/${slug}/`);
    }
  });

  // Undated /blog/slug/ addresses, where the name is unambiguous and can't
  // be mistaken for one of /blog/'s own sections.
  const reserved = new Set(['categories', 'tags', 'page']);
  const names = countBy(items.map(({slug}) => slug.split('/').pop()));
  items.forEach(({slug}) => {
    const name = slug.split('/').pop();

    if (name !== slug && names.get(name) === 1 && !reserved.has(name)) {
      pair(`/blog/${name}`, `/library/${slug}/`);
    }
  });

  categoryCounts.forEach((count, category) => {
    const to = `/library/categories/${category}/`;
    list(`/blog/categories/${category}`, to, count);
    pair(`/category/${category}`, to);
  });

  tagCounts.forEach((count, tag) => {
    const to = `/library/tags/${tag}/`;
    list(`/blog/tags/${tag}`, to, count);
    pair(`/tag/${tag}`, to);
  });

  Object.entries(CATEGORY_REDIRECTS).forEach(([from, to]) => {
    if (normalise(from) === normalise(to)) {
      return;
    }

    const target = `/library/categories/${to}/`;
    const count = categoryCounts.get(to) || 0;
    list(`/blog/categories/${from}`, target, count);
    list(`/library/categories/${from}`, target, count);
    pair(`/category/${from}`, target);
  });

  return rules;
}

export function redirectHtml(toPath) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Redirecting…</title>
<link rel="canonical" href="${toPath}">
<meta http-equiv="refresh" content="0; url=${toPath}">
<meta name="robots" content="noindex">
<script>window.location.replace(${JSON.stringify(toPath)}
 + window.location.search + window.location.hash);</script>
</head>
<body><p>This page has moved to <a href="${toPath}">${toPath}</a>.</p></body>
</html>
`;
}

export default function redirects() {
  let root;

  return {
    name: 'site-redirects',
    hooks: {
      // The dev server answers the old addresses in their trailing-slash
      // form; Astro settles slashes before any middleware sees a request.
      'astro:config:setup': ({command, config, updateConfig, logger}) => {
        root = new URL(config.root).pathname;

        if (command !== 'dev') {
          return;
        }

        updateConfig({vite: {plugins: [{
          name: 'site-redirects-dev',
          configureServer(server) {
            const table = new Map(buildRedirects(publishedItems(root, true)));

            server.middlewares.use((request, response, next) => {
              const pathname = decodeURI(request.url.split('?')[0]);
              const to = table.get(pathname);

              if (!to) {
                next();
                return;
              }

              response.setHeader('Content-Type', 'text/html; charset=utf-8');
              response.end(redirectHtml(to));
            });

            logger.info(`serving ${table.size} redirect pages`);
          },
        }]}});
      },

      'astro:build:done': ({dir, logger}) => {
        const outDir = dir.pathname;
        const rules = buildRedirects(publishedItems(root, false));
        let written = 0;

        rules.forEach(([from, to]) => {
          if (from.endsWith('/')) {
            return;
          }

          const target = path.join(outDir, from, 'index.html');

          // A real page always outranks a redirect.
          if (fs.existsSync(target)) {
            return;
          }

          fs.mkdirSync(path.dirname(target), {recursive: true});
          fs.writeFileSync(target, redirectHtml(to));
          written += 1;
        });

        // Gatsby's first sitemap plugin wrote /sitemap.xml, and search
        // engines may still ask for it.
        const sitemapIndex = path.join(outDir, 'sitemap-index.xml');

        if (fs.existsSync(sitemapIndex)) {
          fs.copyFileSync(sitemapIndex, path.join(outDir, 'sitemap.xml'));
        }

        logger.info(`wrote ${written} redirect pages`);
      },
    },
  };
}
