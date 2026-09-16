import fs from 'fs/promises';
import path from 'path';

const CONTENT_DIRS = ['content/blog', 'content/projects'];
const SUPPORTED_EXTENSIONS = new Set(['.md', '.mdx']);
const FAVICON_DIR = path.resolve('static/favicons');
const SITE_HOSTNAME = 'seanmcn.com';
const CONCURRENCY = 8;

const LINK_RE = /\]\(https?:\/\/[^)\s]+\)/g;

async function collectFiles(dir) {
  let entries;
  try {
    entries = await fs.readdir(dir, {withFileTypes: true});
  } catch {
    return [];
  }
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(fullPath)));
    } else if (SUPPORTED_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }
  return files;
}

function hostnameFromLink(match) {
  const url = match.slice(2, -1);
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

async function collectHostnames() {
  const hostnames = new Set();
  for (const dir of CONTENT_DIRS) {
    const files = await collectFiles(path.resolve(dir));
    for (const file of files) {
      const raw = await fs.readFile(file, 'utf8');
      const matches = raw.match(LINK_RE) ?? [];
      for (const match of matches) {
        const hostname = hostnameFromLink(match);
        if (hostname && hostname !== SITE_HOSTNAME) {
          hostnames.add(hostname);
        }
      }
    }
  }
  return [...hostnames].sort();
}

async function alreadyCached(hostname) {
  try {
    await fs.access(path.join(FAVICON_DIR, `${hostname}.png`));
    return true;
  } catch {
    return false;
  }
}

async function fetchFavicon(hostname) {
  const res = await fetch(
    `https://www.google.com/s2/favicons?sz=64&domain=${encodeURIComponent(hostname)}`,
  );
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  const buffer = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(path.join(FAVICON_DIR, `${hostname}.png`), buffer);
}

async function runPool(items, worker) {
  let index = 0;
  async function next() {
    while (index < items.length) {
      const item = items[index];
      index += 1;
      await worker(item);
    }
  }
  await Promise.all(Array.from({length: CONCURRENCY}, next));
}

async function main() {
  await fs.mkdir(FAVICON_DIR, {recursive: true});

  const hostnames = await collectHostnames();
  const toFetch = [];
  let cached = 0;

  for (const hostname of hostnames) {
    if (await alreadyCached(hostname)) {
      cached += 1;
    } else {
      toFetch.push(hostname);
    }
  }

  const failed = [];
  let fetched = 0;

  await runPool(toFetch, async (hostname) => {
    try {
      await fetchFavicon(hostname);
      fetched += 1;
    } catch (error) {
      failed.push(`${hostname} (${error.message})`);
    }
  });

  console.log(`\n${hostnames.length} external domains found in content.`);
  console.log(`  ${cached} already cached`);
  console.log(`  ${fetched} fetched`);
  if (failed.length) {
    console.log(`  ${failed.length} failed:`);
    for (const entry of failed) {
      console.log(`    - ${entry}`);
    }
  }
}

main();
