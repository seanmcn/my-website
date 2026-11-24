import {execFileSync} from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import matter from 'gray-matter';
import {
  REPO_ROOT,
  SUPPORTED_EXTENSIONS,
  featuredImagePath,
  updateFrontmatterFields,
} from './lib/featured-image-core.mjs';

function git(...args) {
  return execFileSync('git', args, {cwd: REPO_ROOT, encoding: 'utf8'});
}

async function isLocalFile(filename) {
  const relativePath = path.relative(REPO_ROOT, filename);
  if (relativePath.startsWith('../') || path.isAbsolute(relativePath)) {
    return false;
  }
  return (await fs.stat(filename, {throwIfNoEntry: false}))?.isFile() ?? false;
}

const base = process.env.BASE_SHA;
if (!/^[a-f0-9]{40}$/.test(base ?? '')) {
  throw new Error('BASE_SHA must be the PR base commit SHA.');
}

const files = git(
    'diff', '--name-only', '-z', '--no-renames', '--diff-filter=AM',
    `${base}...HEAD`, '--', 'content/blog/',
).split('\0').filter(file => SUPPORTED_EXTENSIONS.has(path.extname(file).toLowerCase()));

for (const file of files) {
  const post = path.join(REPO_ROOT, file);
  const contents = await fs.readFile(post, 'utf8');
  // Require a plain YAML fence before parsing. Gray Matter supports language
  // directives, including executable ones, in the opening fence.
  if (!/^---\r?\n(?:[\s\S]*?\r?\n)?---[ \t]*(?:\r?\n|$)/.test(contents)) {
    throw new Error(`${file} must start with a YAML frontmatter block.`);
  }

  const {data: {type, featured}} = matter(contents);
  if (type !== 'post' && type !== 'note') {
    continue;
  }

  const directory = path.dirname(post);
  if (typeof featured === 'string' && featured &&
      await isLocalFile(path.resolve(directory, featured))) {
    continue;
  }

  const image = featuredImagePath(post);
  if (await isLocalFile(image)) {
    await updateFrontmatterFields(post, [['featured', path.relative(directory, image)]]);
  } else {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('Set the OPENAI_API_KEY GitHub Actions secret to generate missing images.');
    }
    execFileSync('npm', ['run', 'image', '--', file], {cwd: REPO_ROOT, stdio: 'inherit'});
  }

  git('--literal-pathspecs', 'add', '--', file, path.relative(REPO_ROOT, image));
}
