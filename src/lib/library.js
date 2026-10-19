import {getCollection} from 'astro:content';
import readingTime from 'reading-time';

/*
 * Everything gatsby-node.mjs computed per item and passed through page
 * context: read time, related posts, series navigation and the metadata
 * warnings. The logic is the same; it now reads collection entries (`data` is
 * the validated frontmatter) instead of GraphQL nodes.
 */

const TECHNICAL_CATEGORIES = new Set([
  'ai',
  'programming',
  'productivity',
  'systems',
]);

const WORDS_PER_MINUTE = 200;

function normaliseValue(value) {
  return (value || '')
      .toString()
      .trim()
      .toLowerCase();
}

function normaliseList(values = []) {
  return (values || [])
      .map(normaliseValue)
      .filter(Boolean);
}

export function readingTimeMinutes(body) {
  const stats = readingTime(body || '', {wordsPerMinute: WORDS_PER_MINUTE});

  return Math.max(1, Math.round(stats.minutes));
}

const ENTITIES = {amp: '&', lt: '<', gt: '>', quot: '"', apos: '\'', nbsp: ' '};

/* Rendered HTML to plain text, minus the code listings' chrome. */
function htmlText(html) {
  return html
      .replace(/<div class="code-header">[\s\S]*?<\/div>/g, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&(#x?[0-9a-f]+|\w+);/gi, (entity, code) => {
        if (code[0] === '#') {
          return String.fromCodePoint(code[1] === 'x' ?
            parseInt(code.slice(2), 16) :
            Number(code.slice(1)));
        }

        return ENTITIES[code] ?? entity;
      });
}

/* Markdown source to plain text, for entries with no stored HTML (MDX). */
function markdownText(markdown) {
  return markdown
      .replace(/^(import|export) .*$/gm, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
      .replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
      .replace(/^\s*(>|[-*+]|\d+\.)\s+/gm, '')
      .replace(/[*_~#]/g, ' ');
}

/*
 * The first `length` characters of an entry's text, cut at a word, standing
 * in for Gatsby's excerpt(pruneLength). Read from the rendered HTML where
 * there is one, so emoji, smart quotes and list items come out as a reader
 * sees them.
 */
export function excerpt(entry, length = 190) {
  const text = (entry.rendered?.html ?
    htmlText(entry.rendered.html) :
    markdownText(entry.body || ''))
      .replace(/\s+/g, ' ')
      .trim();

  if (text.length <= length) {
    return text;
  }

  return `${text.slice(0, text.lastIndexOf(' ', length))}…`;
}

function scoreRelatedPost(current, candidate) {
  if (current.id === candidate.id) {
    return null;
  }

  const currentSeries = normaliseValue(current.data.series);
  const candidateSeries = normaliseValue(candidate.data.series);
  const currentTags = new Set(normaliseList(current.data.tags));
  const candidateTags = normaliseList(candidate.data.tags);
  const currentCategory = normaliseValue(current.data.category);
  const candidateCategory = normaliseValue(candidate.data.category);
  const currentTitleTokens = new Set(
      normaliseValue(current.data.title).split(/\W+/).filter(Boolean),
  );
  const candidateTitleTokens = normaliseValue(candidate.data.title)
      .split(/\W+/)
      .filter(Boolean);

  let score = 0;
  let reason = 'Recent post';

  if (currentSeries && currentSeries === candidateSeries) {
    score += 100;
    reason = 'Same series';
  }

  const sharedTags = candidateTags.filter(tag => currentTags.has(tag));
  if (sharedTags.length > 0) {
    score += sharedTags.length * 24;
    if (reason !== 'Same series') {
      reason = 'Shared tags';
    }
  }

  if (currentCategory && currentCategory === candidateCategory) {
    score += 14;
    if (reason === 'Recent post') {
      reason = 'Same category';
    }
  }

  const sharedTitleTokens = candidateTitleTokens.filter(token =>
    token.length > 2 && currentTitleTokens.has(token),
  );
  score += Math.min(sharedTitleTokens.length, 4) * 2;

  const ageInDays = Math.max(
      0,
      (Date.now() - candidate.data.date.getTime()) / (1000 * 60 * 60 * 24),
  );
  score += Math.max(0, 8 - Math.floor(ageInDays / 365));

  return {score, reason};
}

function toRelated(entry, reason) {
  return {
    title: entry.data.title,
    slug: entry.data.slug,
    type: entry.data.type,
    featured: entry.data.featured,
    reason,
  };
}

function buildRelatedPosts(current, items) {
  const bySlug = new Map(items.map(item => [item.data.slug, item]));
  const editorialSlugs = current.data.related;
  const notEditorial = item => !editorialSlugs.includes(item.data.slug);
  const others = items.filter(item => item.id !== current.id);

  const editorial = editorialSlugs
      .map(slug => bySlug.get(slug))
      .filter(Boolean)
      .map(item => toRelated(item, 'Hand-picked'));

  const scored = others
      .map(item => ({item, scored: scoreRelatedPost(current, item)}))
      .filter(({scored}) => scored && scored.score > 0)
      .filter(({item}) => notEditorial(item))
      .sort((a, b) => b.scored.score - a.scored.score)
      .slice(0, 6)
      .map(({item, scored}) => toRelated(item, scored.reason));

  const sameCategory = others
      .filter(item => normaliseValue(item.data.category) ===
        normaliseValue(current.data.category))
      .filter(notEditorial)
      .map(item => toRelated(item, 'Same category'));

  const recent = others
      .filter(notEditorial)
      .map(item => toRelated(item, 'Recent post'));

  const merged = [];
  const seen = new Set();

  [...editorial, ...scored, ...sameCategory, ...recent].forEach((related) => {
    if (seen.has(related.slug) || merged.length >= 3) {
      return;
    }

    seen.add(related.slug);
    merged.push(related);
  });

  return merged;
}

function sortSeriesPosts(seriesPosts = []) {
  const order = item => Number.isFinite(item.data.seriesOrder) ?
    item.data.seriesOrder :
    Number.MAX_SAFE_INTEGER;

  return [...seriesPosts].sort((a, b) =>
    order(a) - order(b) ||
    a.data.date - b.data.date ||
    a.data.slug.localeCompare(b.data.slug),
  );
}

const NO_SERIES = {
  previousInSeries: null,
  nextInSeries: null,
  seriesCount: 0,
  seriesIndex: null,
  seriesPosts: [],
  seriesTitle: null,
};

function buildSeriesContext(current, items) {
  const seriesKey = normaliseValue(current.data.series);

  if (!seriesKey) {
    return NO_SERIES;
  }

  const seriesPosts = sortSeriesPosts(
      items.filter(item => normaliseValue(item.data.series) === seriesKey),
  );

  if (seriesPosts.length < 2) {
    return {...NO_SERIES, seriesCount: seriesPosts.length};
  }

  const index = seriesPosts.findIndex(item => item.id === current.id);
  const link = item => item ?
    {slug: item.data.slug, title: item.data.title} :
    null;

  return {
    previousInSeries: link(index > 0 ? seriesPosts[index - 1] : null),
    nextInSeries: link(seriesPosts[index + 1]),
    seriesCount: seriesPosts.length,
    seriesIndex: index + 1,
    seriesPosts: seriesPosts.map(item => ({
      date: item.data.date,
      seriesOrder: item.data.seriesOrder ?? null,
      slug: item.data.slug,
      title: item.data.title,
    })),
    seriesTitle: current.data.series,
  };
}

/*
 * The schema already rejects malformed frontmatter; these are the softer
 * editorial checks that only warn.
 */
function validateItems(items) {
  const variants = {category: new Map(), tag: new Map()};
  const slugs = new Set(items.map(item => item.data.slug));
  const note = (kind, raw) => {
    const key = normaliseValue(raw);
    if (!variants[kind].has(key)) {
      variants[kind].set(key, new Set());
    }
    variants[kind].get(key).add(raw);
  };

  items.forEach(({data}) => {
    note('category', data.category);
    data.tags.forEach(tag => note('tag', tag));

    if (TECHNICAL_CATEGORIES.has(normaliseValue(data.category)) &&
        data.tags.length === 0) {
      console.warn(
          `[search] "${data.slug}" is in a technical category but has no tags.`,
      );
    }

    data.related.forEach((slug) => {
      if (!slugs.has(slug)) {
        console.warn(
            `[related] "${data.slug}" references missing post "${slug}".`,
        );
      }
    });
  });

  Object.entries(variants).forEach(([kind, map]) => {
    map.forEach((spellings, key) => {
      if (spellings.size > 1) {
        console.warn(`[search] ${kind} "${key}" has inconsistent casing: ` +
          Array.from(spellings).join(', '));
      }
    });
  });
}

export const ITEMS_PER_PAGE = 12;

export const TYPE_ROUTES = {post: 'posts', note: 'notes', find: 'finds'};

/*
 * gatsby-awesome-pagination's page context, for the listing templates: page
 * `number` (1-based) of `items` under `base`, e.g. /library/posts.
 */
export function paginate(items, base) {
  const total = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE));
  const pagePath = number =>
    (number === 1 ? `${base}/` : `${base}/page/${number}/`);

  return Array.from({length: total}, (_, index) => {
    const number = index + 1;

    return {
      number,
      total,
      base,
      items: items.slice(index * ITEMS_PER_PAGE, number * ITEMS_PER_PAGE),
      totalCount: items.length,
      previousPath: number > 1 ? pagePath(number - 1) : null,
      nextPath: number < total ? pagePath(number + 1) : null,
    };
  });
}

let itemsPromise;

/*
 * Published items, newest first. Drafts stay visible under `astro dev` and
 * drop out of the build, as they did under Gatsby.
 */
export function getLibraryItems() {
  itemsPromise ??= getCollection('library', ({data}) =>
    import.meta.env.DEV || process.env.SHOW_DRAFTS === 'true' ||
      !data.draft,
  ).then((items) => {
    // Dates are days, so same-day items fall back to their slugs.
    const sorted = items.sort((a, b) => b.data.date - a.data.date ||
      a.data.slug.localeCompare(b.data.slug));
    validateItems(sorted);
    return sorted;
  });

  return itemsPromise;
}

/*
 * Site-wide facts the chrome needs: counts per type, categories and tags with
 * their counts, total read time and the span of years. What useLibraryMeta did
 * with a static query.
 */
export async function getLibraryMeta() {
  const items = await getLibraryItems();
  const counts = {all: items.length, post: 0, note: 0, find: 0};
  const categoryCounts = new Map();
  const tagCounts = new Map();
  let readMinutes = 0;

  items.forEach(({body, data}) => {
    counts[data.type] += 1;

    if (data.type !== 'find') {
      readMinutes += readingTimeMinutes(body);
    }

    if (data.category) {
      categoryCounts.set(data.category,
          (categoryCounts.get(data.category) || 0) + 1);
    }

    data.tags.forEach((tag) => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });

  const years = items.map(item => item.data.date.getUTCFullYear());
  const byCount = (left, right) =>
    right.count - left.count || left.name.localeCompare(right.name);

  return {
    categories: Array.from(categoryCounts, ([name, count]) => ({name, count}))
        .sort((left, right) => left.name.localeCompare(right.name)),
    counts,
    readMinutes,
    tags: Array.from(tagCounts, ([name, count]) => ({name, count}))
        .sort(byCount),
    yearRange: years.length ?
      `${Math.min(...years)}–${Math.max(...years)}` :
      '',
  };
}

let projectsPromise;

/* Projects, newest first. */
export function getProjects() {
  projectsPromise ??= getCollection('projects')
      .then(projects => projects.sort((a, b) => b.data.date - a.data.date));

  return projectsPromise;
}

/* Published items whose `project` names this project, newest first. */
export async function getItemsAboutProject(projectId) {
  const items = await getLibraryItems();

  return items.filter(item => item.data.project?.id === projectId);
}

function extractHeadings(markdown = '') {
  return markdown
      .split('\n')
      .filter(line => /^#{1,6}\s+/.test(line))
      .map(line => line.replace(/^#{1,6}\s+/, '').trim())
      .filter(Boolean);
}

/* Markdown to plain text for the search index. */
function stripMarkdown(markdown = '') {
  return markdown
      .replace(/^(import|export) .*$/gm, ' ')
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
      .replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
      .replace(/^>\s+/gm, '')
      .replace(/[*_~#>-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
}

const dateDisplay = date => date.toLocaleDateString('en-GB', {
  year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
});

/*
 * The client-side search index: the whole library plus the projects, which
 * the search screen treats as a fourth kind of result. `thumb` is filled in
 * by the endpoint, which can process images.
 */
export async function searchIndexEntries() {
  const items = await getLibraryItems();
  const projects = await getProjects();

  return [
    ...items.map(({body, data, ...entry}) => ({
      title: data.title,
      normalizedTitle: normaliseValue(data.title),
      kind: data.type,
      slug: data.slug,
      path: `/library/${data.slug}/`,
      date: data.date.toISOString(),
      dateDisplay: dateDisplay(data.date),
      readingTime: readingTimeMinutes(body),
      source: data.source || '',
      featured: data.featured,
      category: data.category || '',
      normalizedCategory: normaliseValue(data.category),
      tags: data.tags,
      normalizedTags: normaliseList(data.tags),
      headings: extractHeadings(body),
      bodyPlainText: stripMarkdown(body).slice(0, 2000),
      excerpt: data.summary || excerpt({body, ...entry}, 200),
    })),
    ...projects.map(({body, data, ...entry}) => ({
      title: data.title,
      normalizedTitle: normaliseValue(data.title),
      kind: 'project',
      slug: data.slug,
      path: `/projects/${data.slug}/`,
      date: data.date.toISOString(),
      dateDisplay: dateDisplay(data.date),
      readingTime: 0,
      source: '',
      featured: data.featured,
      category: (data.techStack.length ? data.techStack : [data.language])
          .filter(Boolean).join(' · '),
      normalizedCategory: '',
      tags: data.tags,
      normalizedTags: normaliseList(data.tags),
      headings: [],
      bodyPlainText: stripMarkdown(body).slice(0, 2000),
      excerpt: data.summary || excerpt({body, ...entry}, 200),
    })),
  ];
}

export function itemContext(item, items) {
  return {
    readingTime: readingTimeMinutes(item.body),
    relatedPosts: buildRelatedPosts(item, items),
    ...buildSeriesContext(item, items),
  };
}
