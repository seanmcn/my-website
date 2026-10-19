import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {describe, test} from 'node:test';
import matter from 'gray-matter';
import {z} from 'astro/zod';
import {libraryFrontmatter} from '../../src/lib/frontmatter.mjs';
import {SCHEMA_PATH, renderSchema} from '../../scripts/frontmatter-schema.mjs';

/*
 * The library's frontmatter rules (docs/content.md). Astro applies the same
 * schema at build time; these run in a second and name the broken rule.
 */
const schema = libraryFrontmatter({image: () => z.string()});
const BLOG_DIR = path.resolve('content/blog');

function contentFiles(dir = BLOG_DIR) {
  return fs.readdirSync(dir, {withFileTypes: true}).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return contentFiles(full);
    return /\.mdx?$/.test(entry.name) ? [full] : [];
  });
}

const entries = contentFiles().map(file => ({
  file: path.relative(BLOG_DIR, file),
  dir: path.dirname(file),
  data: matter(fs.readFileSync(file, 'utf8')).data,
}));

const post = {
  title: 'A post',
  type: 'post',
  date: '2026-10-19',
  slug: '2026/10/a-post',
  category: 'programming',
  tags: ['php'],
  summary: 'What the post says, in one line.',
  featured: 'images/featured-a-post.png',
};
const find = {
  title: 'A find',
  type: 'find',
  date: '2026-10-19',
  slug: '2026/10/a-find',
  category: 'ai',
  source: 'https://example.com/',
};

function without(data, key) {
  const copy = {...data};
  delete copy[key];
  return copy;
}

// The paths of the fields that failed, e.g. ['summary'].
function failures(data) {
  const result = schema.safeParse(data);
  return result.success ? [] : result.error.issues.map(i => i.path.join('.'));
}

describe('every library entry', () => {
  for (const {file, data} of entries) {
    test(`${file} matches the frontmatter rules`, () => {
      const result = schema.safeParse(data);
      assert.ok(result.success,
          result.success ? '' : z.prettifyError(result.error));
    });
  }

  test('slugs are unique', () => {
    const seen = new Map();
    for (const {file, data} of entries) {
      assert.ok(!seen.has(data.slug),
          `${file} and ${seen.get(data.slug)} share slug ${data.slug}`);
      seen.set(data.slug, file);
    }
  });

  test('featured images exist', () => {
    const missing = entries
        .filter(({dir, data}) => data.featured &&
          !fs.existsSync(path.resolve(dir, data.featured)))
        .map(({file, data}) => `${file}: ${data.featured}`);
    assert.deepEqual(missing, []);
  });
});

describe('posts and notes', () => {
  for (const type of ['post', 'note']) {
    const item = {...post, type};

    test(`a ${type} with every field passes`, () => {
      assert.deepEqual(failures(item), []);
    });

    test(`a ${type} needs a summary`, () => {
      assert.deepEqual(failures(without(item, 'summary')), ['summary']);
      assert.deepEqual(failures({...item, summary: ''}), ['summary']);
    });

    test(`a ${type} needs a featured image`, () => {
      assert.deepEqual(failures(without(item, 'featured')), ['featured']);
    });

    test(`a ${type} needs a category`, () => {
      assert.deepEqual(failures(without(item, 'category')), ['category']);
    });

    test(`a ${type} needs at least one tag`, () => {
      assert.deepEqual(failures({...item, tags: []}), ['tags']);
      assert.deepEqual(failures(without(item, 'tags')), ['tags']);
    });

    test(`a ${type} can't have a source`, () => {
      assert.deepEqual(failures({...item, source: 'https://example.com/'}), ['']);
    });
  }
});

describe('finds', () => {
  test('a find needs only a source on top of the basics', () => {
    assert.deepEqual(failures(find), []);
  });

  test('a find needs a source URL', () => {
    assert.deepEqual(failures(without(find, 'source')), ['source']);
    assert.deepEqual(failures({...find, source: 'example.com'}), ['source']);
  });

  test('a find needs a category', () => {
    assert.deepEqual(failures(without(find, 'category')), ['category']);
  });

  test('a find may have tags, a summary and an image', () => {
    assert.deepEqual(failures({
      ...find,
      tags: ['ai'],
      summary: 'What it is.',
      featured: 'images/featured-a-find.png',
      sourceTitle: 'example.com',
    }), []);
  });
});

describe('every type', () => {
  test('type must be post, note or find', () => {
    assert.deepEqual(failures({...post, type: 'article'}), ['type']);
    assert.deepEqual(failures(without(post, 'type')), ['type']);
  });

  test('unknown fields fail, so typos and retired fields are caught', () => {
    assert.deepEqual(failures({...post, keywords: ['php']}), ['']);
    assert.deepEqual(failures({...post, sumary: 'Typo.'}), ['']);
  });

  test('date is a day, with no time', () => {
    assert.deepEqual(failures({...post, date: new Date('2026-10-19')}), []);
    assert.deepEqual(
        failures({...post, date: '2026-10-19T09:00:00.000Z'}), ['date']);
    assert.deepEqual(failures({...post, date: 'yesterday'}), ['date']);
  });

  for (const key of ['title', 'slug', 'date']) {
    test(`${key} is required`, () => {
      assert.deepEqual(failures(without(post, key)), [key]);
    });
  }

  test('margins need a label and some text', () => {
    assert.deepEqual(
        failures({...post, margins: [{label: 'In one line', text: ''}]}),
        ['margins.0.text']);
  });
});

test('content/blog/frontmatter.schema.json is up to date', () => {
  assert.equal(fs.readFileSync(SCHEMA_PATH, 'utf8'), renderSchema(),
      'Run `npm run schema` to regenerate it.');
});
