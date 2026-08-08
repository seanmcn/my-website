import fs from 'fs/promises';
import path from 'path';
import process from 'process';
import matter from 'gray-matter';

const BLOG_DIR = path.resolve('content/blog');
const SUPPORTED_EXTENSIONS = new Set(['.md', '.mdx']);

async function collectPostFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectPostFiles(fullPath)));
    } else if (SUPPORTED_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }
  return files;
}

function tally(map, value) {
  if (value === undefined || value === null || value === '') return;
  map.set(value, (map.get(value) ?? 0) + 1);
}

function formatCounts(map) {
  const sorted = [...map.entries()].sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
  );
  const width = sorted.reduce((max, [, count]) => Math.max(max, String(count).length), 0);
  return sorted
    .map(([name, count]) => `  ${String(count).padStart(width)}  ${name}`)
    .join('\n');
}

async function main() {
  const files = await collectPostFiles(BLOG_DIR);
  const categories = new Map();
  const tags = new Map();

  for (const file of files) {
    const raw = await fs.readFile(file, 'utf8');
    const { data } = matter(raw);
    tally(categories, data.category);
    for (const tag of data.tags ?? []) tally(tags, tag);
  }

  const asJson = process.argv.includes('--json');
  if (asJson) {
    const toObject = (map) =>
      Object.fromEntries([...map.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])));
    console.log(JSON.stringify({ categories: toObject(categories), tags: toObject(tags) }, null, 2));
    return;
  }

  console.log(`\nCategories (${categories.size}) across ${files.length} posts:\n`);
  console.log(formatCounts(categories));
  console.log(`\nTags (${tags.size}):\n`);
  console.log(formatCounts(tags));
  console.log('');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
