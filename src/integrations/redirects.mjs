import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

/*
 * Every /blog/… address the site has ever served now lives under /library/,
 * and a few categories were merged. Amplify's customHttp.yml covers headers
 * only, so the build writes a real page at every old address (canonical tag,
 * meta refresh, and a scripted replace that carries the query string and hash
 * across) plus a rules file next to it that can be pasted into Amplify's
 * console if proper 301s are wanted later. The dev server answers the same
 * addresses (with their trailing slash) with the same page.
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

/* [fromPath, toPath] pairs; ":page" marks a host-rule-only wildcard. */
export function buildRedirects(items) {
  const rules = [];
  const pair = (from, to) => {
    const bare = from.replace(/\/$/, '');
    rules.push([bare, to], [`${bare}/`, to]);
  };

  pair('/blog', '/library/');
  rules.push(['/blog/page/:page', '/library/page/:page']);

  items.forEach(({slug}) => pair(`/blog/${slug}`, `/library/${slug}/`));

  const categories = [...new Set(items.map(item => item.category))]
      .filter(Boolean);
  const tags = [...new Set(items.flatMap(item => item.tags || []))]
      .filter(Boolean);

  categories.forEach((category) => {
    pair(`/blog/categories/${category}`, `/library/categories/${category}/`);
    rules.push([
      `/blog/categories/${category}/page/:page`,
      `/library/categories/${category}/page/:page`,
    ]);
  });

  tags.forEach((tag) => {
    const lower = normalise(tag);
    pair(`/blog/tags/${lower}`, `/library/tags/${lower}/`);
    rules.push([
      `/blog/tags/${lower}/page/:page`,
      `/library/tags/${lower}/page/:page`,
    ]);
  });

  Object.entries(CATEGORY_REDIRECTS).forEach(([from, to]) => {
    if (normalise(from) === normalise(to)) {
      return;
    }

    [`/blog/categories/${from}`, `/library/categories/${from}`]
        .forEach((fromPath) => {
          pair(fromPath, `/library/categories/${to}/`);
          rules.push([
            `${fromPath}/page/:page`,
            `/library/categories/${to}/page/:page`,
          ]);
        });
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

const isWildcard = from => from.includes(':') || from.includes('*');

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
            const table = new Map(
                buildRedirects(publishedItems(root, true))
                    .filter(([from]) => !isWildcard(from)),
            );

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
          // Wildcards can only be expressed as host rules, not as a file.
          if (isWildcard(from) || from.endsWith('/')) {
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

        fs.writeFileSync(
            path.join(outDir, 'amplify-redirects.json'),
            JSON.stringify(rules.map(([source, target]) => ({
              source,
              status: '301',
              target,
            })), null, 2),
        );

        logger.info(`wrote ${written} redirect pages and ${rules.length} ` +
          'rules to amplify-redirects.json');
      },
    },
  };
}
