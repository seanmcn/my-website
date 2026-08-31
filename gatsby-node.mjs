import path from 'path';
import fs from 'fs';
import {createFilePath} from 'gatsby-source-filesystem';
import {paginate} from 'gatsby-awesome-pagination';

const ITEMS_PER_PAGE = 12;

const ITEM_TYPES = ['post', 'note', 'find'];

const TYPE_ROUTES = {
  post: 'posts',
  note: 'notes',
  find: 'finds',
};

const TECHNICAL_CATEGORIES = new Set([
  'ai',
  'programming',
  'productivity',
  'systems',
]);

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

/*
 * Every /blog/… address the site has ever served now lives under /library/.
 * The permanent redirects below are the whole reason the move is safe, so they
 * cover the item pages, the paginated index, and both taxonomies.
 */
function createRedirectPair(createRedirect, fromPath, toPath) {
  const withoutSlash = fromPath.replace(/\/$/, '');

  [withoutSlash, `${withoutSlash}/`].forEach((candidate) => {
    createRedirect({
      fromPath: candidate,
      toPath,
      isPermanent: true,
      redirectInBrowser: true,
    });
  });
}

function createLegacyBlogRedirects(createRedirect, postNodes) {
  createRedirectPair(createRedirect, '/blog', '/library/');
  createRedirect({
    fromPath: '/blog/page/:page',
    toPath: '/library/page/:page',
    isPermanent: true,
    redirectInBrowser: true,
  });

  postNodes.forEach(({frontmatter}) => {
    createRedirectPair(
        createRedirect,
        `/blog/${frontmatter.slug}`,
        `/library/${frontmatter.slug}/`,
    );
  });
}

function createTaxonomyRedirects(createRedirect, categoryList, tagList) {
  categoryList.forEach((category) => {
    createRedirectPair(
        createRedirect,
        `/blog/categories/${category}`,
        `/library/categories/${category}/`,
    );
    createRedirect({
      fromPath: `/blog/categories/${category}/page/:page`,
      toPath: `/library/categories/${category}/page/:page`,
      isPermanent: true,
      redirectInBrowser: true,
    });
  });

  tagList.forEach((tag) => {
    const tagLower = normaliseValue(tag);

    createRedirectPair(
        createRedirect,
        `/blog/tags/${tagLower}`,
        `/library/tags/${tagLower}/`,
    );
    createRedirect({
      fromPath: `/blog/tags/${tagLower}/page/:page`,
      toPath: `/library/tags/${tagLower}/page/:page`,
      isPermanent: true,
      redirectInBrowser: true,
    });
  });
}

function createCategoryRedirects(createRedirect) {
  Object.entries(CATEGORY_REDIRECTS).forEach(([fromCategory, toCategory]) => {
    if (normaliseValue(fromCategory) === normaliseValue(toCategory)) {
      return;
    }

    [
      `/blog/categories/${fromCategory}`,
      `/library/categories/${fromCategory}`,
    ].forEach((fromPath) => {
      createRedirectPair(
          createRedirect,
          fromPath,
          `/library/categories/${toCategory}/`,
      );
      createRedirect({
        fromPath: `${fromPath}/page/:page`,
        toPath: `/library/categories/${toCategory}/page/:page`,
        isPermanent: true,
        redirectInBrowser: true,
      });
    });
  });
}

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

function stripMarkdown(markdown = '') {
  return markdown
      .replace(/^---[\s\S]*?---/, '')
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
      .replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
      .replace(/^>\s+/gm, '')
      .replace(/[*_~#>-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
}

function extractHeadings(markdown = '') {
  return markdown
      .split('\n')
      .filter(line => /^#{1,6}\s+/.test(line))
      .map(line => line.replace(/^#{1,6}\s+/, '').trim())
      .filter(Boolean);
}

/*
 * Mirrors the ids rehype-slug puts on rendered headings, so the "On this page"
 * links built here land on the right anchor.
 */
function slugifyHeading(text = '') {
  return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\- ]+/g, '')
      .replace(/\s+/g, '-');
}

/* Top-level sections only: the rail's contents list, not every subheading. */
function buildTableOfContents(markdown = '') {
  return markdown
      .split('\n')
      .filter(line => /^##\s+/.test(line))
      .map(line => line.replace(/^##\s+/, '').trim())
      .filter(Boolean)
      .map(text => ({text, href: `#${slugifyHeading(text)}`}));
}

function scoreRelatedPost(currentPost, candidatePost) {
  if (currentPost.id === candidatePost.id) {
    return null;
  }

  const currentSeries = normaliseValue(currentPost.frontmatter.series);
  const candidateSeries = normaliseValue(candidatePost.frontmatter.series);
  const currentTags = new Set(normaliseList(currentPost.frontmatter.tags));
  const candidateTags = normaliseList(candidatePost.frontmatter.tags);
  const currentKeywords = new Set(normaliseList(currentPost.frontmatter.keywords));
  const candidateKeywords = normaliseList(candidatePost.frontmatter.keywords);
  const currentCategory = normaliseValue(currentPost.frontmatter.category);
  const candidateCategory = normaliseValue(candidatePost.frontmatter.category);
  const currentTitleTokens = new Set(
      normaliseValue(currentPost.frontmatter.title).split(/\W+/).filter(Boolean),
  );
  const candidateTitleTokens = normaliseValue(candidatePost.frontmatter.title)
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

  const sharedKeywords = candidateKeywords.filter(keyword => currentKeywords.has(keyword));
  if (sharedKeywords.length > 0) {
    score += sharedKeywords.length * 8;
    if (reason === 'Recent post') {
      reason = 'Shared keywords';
    }
  }

  const sharedTitleTokens = candidateTitleTokens.filter(token =>
    token.length > 2 && currentTitleTokens.has(token),
  );
  score += Math.min(sharedTitleTokens.length, 4) * 2;

  const candidateDate = Date.parse(candidatePost.frontmatter.date);
  if (!Number.isNaN(candidateDate)) {
    const ageInDays = Math.max(0, (Date.now() - candidateDate) / (1000 * 60 * 60 * 24));
    score += Math.max(0, 8 - Math.floor(ageInDays / 365));
  }

  return {
    score,
    reason,
  };
}

function buildRelatedPosts(currentPost, allPostsBySlug) {
  const editorialSlugs = currentPost.frontmatter.related || [];
  const editorialPosts = editorialSlugs
      .map(slug => allPostsBySlug.get(slug))
      .filter(Boolean)
      .map(post => ({
        title: post.frontmatter.title,
        slug: post.frontmatter.slug,
        type: post.fields?.itemType || 'post',
        date: post.frontmatter.dateDisplay,
        category: post.frontmatter.category,
        tags: post.frontmatter.tags || [],
        excerpt: post.excerpt,
        reason: 'Hand-picked',
      }));

  const scoredPosts = Array.from(allPostsBySlug.values())
      .map((candidatePost) => {
        const scoredPost = scoreRelatedPost(currentPost, candidatePost);
        if (!scoredPost || scoredPost.score <= 0) {
          return null;
        }

        return {
          title: candidatePost.frontmatter.title,
          slug: candidatePost.frontmatter.slug,
          type: candidatePost.fields?.itemType || 'post',
          date: candidatePost.frontmatter.dateDisplay,
          category: candidatePost.frontmatter.category,
          tags: candidatePost.frontmatter.tags || [],
          excerpt: candidatePost.excerpt,
          reason: scoredPost.reason,
          score: scoredPost.score,
        };
      })
      .filter(Boolean)
      .filter(candidatePost =>
        !editorialSlugs.includes(candidatePost.slug),
      )
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

  const sameCategoryFallback = Array.from(allPostsBySlug.values())
      .filter(candidatePost =>
        candidatePost.id !== currentPost.id &&
        normaliseValue(candidatePost.frontmatter.category) ===
          normaliseValue(currentPost.frontmatter.category),
      )
      .filter(candidatePost =>
        !editorialSlugs.includes(candidatePost.frontmatter.slug),
      )
      .map(candidatePost => ({
        title: candidatePost.frontmatter.title,
        slug: candidatePost.frontmatter.slug,
        type: candidatePost.fields?.itemType || 'post',
        date: candidatePost.frontmatter.dateDisplay,
        category: candidatePost.frontmatter.category,
        tags: candidatePost.frontmatter.tags || [],
        excerpt: candidatePost.excerpt,
        reason: 'Same category',
      }));

  const recentFallback = Array.from(allPostsBySlug.values())
      .filter(candidatePost => candidatePost.id !== currentPost.id)
      .filter(candidatePost =>
        !editorialSlugs.includes(candidatePost.frontmatter.slug),
      )
      .map(candidatePost => ({
        title: candidatePost.frontmatter.title,
        slug: candidatePost.frontmatter.slug,
        type: candidatePost.fields?.itemType || 'post',
        date: candidatePost.frontmatter.dateDisplay,
        category: candidatePost.frontmatter.category,
        tags: candidatePost.frontmatter.tags || [],
        excerpt: candidatePost.excerpt,
        reason: 'Recent post',
      }));

  const mergedPosts = [];
  const seenSlugs = new Set();
  const candidates = [
    ...editorialPosts,
    ...scoredPosts,
    ...sameCategoryFallback,
    ...recentFallback,
  ];

  candidates.forEach((candidatePost) => {
    if (seenSlugs.has(candidatePost.slug) || mergedPosts.length >= 3) {
      return;
    }

    seenSlugs.add(candidatePost.slug);
    mergedPosts.push(candidatePost);
  });

  return mergedPosts;
}

function sortSeriesPosts(seriesPosts = []) {
  return [...seriesPosts].sort((a, b) => {
    const leftOrder = Number.isFinite(a.frontmatter.seriesOrder) ?
      a.frontmatter.seriesOrder :
      Number.MAX_SAFE_INTEGER;
    const rightOrder = Number.isFinite(b.frontmatter.seriesOrder) ?
      b.frontmatter.seriesOrder :
      Number.MAX_SAFE_INTEGER;

    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }

    const leftDate = Date.parse(a.frontmatter.date);
    const rightDate = Date.parse(b.frontmatter.date);
    const safeLeftDate = Number.isNaN(leftDate) ?
      Number.MAX_SAFE_INTEGER :
      leftDate;
    const safeRightDate = Number.isNaN(rightDate) ?
      Number.MAX_SAFE_INTEGER :
      rightDate;

    if (safeLeftDate !== safeRightDate) {
      return safeLeftDate - safeRightDate;
    }

    return a.frontmatter.slug.localeCompare(b.frontmatter.slug);
  });
}

function buildSeriesContext(currentPost, postsBySeries) {
  const seriesKey = normaliseValue(currentPost.frontmatter.series);

  if (!seriesKey) {
    return {
      previousInSeries: null,
      nextInSeries: null,
      seriesCount: 0,
      seriesIndex: null,
      seriesPosts: [],
      seriesTitle: null,
    };
  }

  const seriesPosts = sortSeriesPosts(postsBySeries.get(seriesKey) || []);
  if (seriesPosts.length < 2) {
    return {
      previousInSeries: null,
      nextInSeries: null,
      seriesCount: seriesPosts.length,
      seriesIndex: null,
      seriesPosts: [],
      seriesTitle: null,
    };
  }

  const currentIndex = seriesPosts.findIndex(
      post => post.id === currentPost.id,
  );
  const previousPost = currentIndex > 0 ? seriesPosts[currentIndex - 1] : null;
  const nextPost = currentIndex >= 0 && currentIndex < seriesPosts.length - 1 ?
    seriesPosts[currentIndex + 1] :
    null;

  return {
    previousInSeries: previousPost ? {
      slug: previousPost.frontmatter.slug,
      title: previousPost.frontmatter.title,
    } : null,
    nextInSeries: nextPost ? {
      slug: nextPost.frontmatter.slug,
      title: nextPost.frontmatter.title,
    } : null,
    seriesCount: seriesPosts.length,
    seriesIndex: currentIndex >= 0 ? currentIndex + 1 : null,
    seriesPosts: seriesPosts.map(post => ({
      date: post.frontmatter.dateDisplay,
      seriesOrder: post.frontmatter.seriesOrder ?? null,
      slug: post.frontmatter.slug,
      title: post.frontmatter.title,
    })),
    seriesTitle: currentPost.frontmatter.series,
  };
}

function validatePostMetadata(posts) {
  const categoryVariants = new Map();
  const tagVariants = new Map();
  const postSlugs = new Set(posts.map(({frontmatter}) => frontmatter.slug));

  posts.forEach((post) => {
    const {frontmatter} = post;
    const rawCategory = frontmatter.category;
    const normalisedCategory = normaliseValue(rawCategory);

    if (!categoryVariants.has(normalisedCategory)) {
      categoryVariants.set(normalisedCategory, new Set());
    }

    categoryVariants.get(normalisedCategory).add(rawCategory);

    (frontmatter.tags || []).forEach((rawTag) => {
      const normalisedTag = normaliseValue(rawTag);

      if (!tagVariants.has(normalisedTag)) {
        tagVariants.set(normalisedTag, new Set());
      }

      tagVariants.get(normalisedTag).add(rawTag);
    });

    if (TECHNICAL_CATEGORIES.has(normalisedCategory) &&
        (!frontmatter.tags || frontmatter.tags.length === 0)) {
      console.warn(
          `[search] "${frontmatter.slug}" is in a technical category but has no tags.`,
      );
    }

    (frontmatter.related || []).forEach((relatedSlug) => {
      if (!postSlugs.has(relatedSlug)) {
        console.warn(
            `[related] "${frontmatter.slug}" references missing post "${relatedSlug}".`,
        );
      }
    });
  });

  categoryVariants.forEach((variants, category) => {
    if (variants.size > 1) {
      console.warn(
          `[search] Category "${category}" has inconsistent casing: ${Array.from(
              variants,
          ).join(', ')}`,
      );
    }
  });

  tagVariants.forEach((variants, tag) => {
    if (variants.size > 1) {
      console.warn(
          `[search] Tag "${tag}" has inconsistent casing: ${Array.from(
              variants,
          ).join(', ')}`,
      );
    }
  });
}

export const createPages = async function({actions, graphql}) {
  const {createPage, createRedirect} = actions;

  /*
   * Projects
   * */
  const projectsResult = await graphql(
      `{
        allFile(
          filter: {sourceInstanceName: {eq: "projects"}, childMdx: {id: {ne: null}}}
          sort: {childMdx: {frontmatter: {date: DESC}}}
        ) {
          nodes {
            childMdx {
              id
              frontmatter {
                slug
              }
              internal {
                contentFilePath
              }
            }
          }
        }
      }`,
  );

  if (projectsResult.errors) {
    throw projectsResult.errors;
  }

  const projectTemplate = path.resolve('./src/templates/project.js');
  const projectNodes = projectsResult.data.allFile.nodes
      .map(({childMdx}) => childMdx)
      .filter(Boolean);

  projectNodes.forEach((project) => {
    createPage({
      path: `/projects/${project.frontmatter.slug}/`,
      component:
        `${projectTemplate}?__contentFilePath=${project.internal.contentFilePath}`,
      context: {
        id: project.id,
      },
    });
  });

  /*
   * Library items: posts, notes and finds share one collection, one set of
   * taxonomy pages and one address space under /library/.
   * */
  const libraryResult = await graphql(
      `{
      allMdx(
        sort: {frontmatter: {date: DESC}}
        limit: 1000
        filter: {
          fields: {sourceInstanceName: {eq: "blog"}, visible: {eq: true}}
        }
      ) {
        edges {
          node {
            id
            fields {
              itemType
              readingTime
            }
            frontmatter {
              title
              slug
              date
              category
              tags
              keywords
              series
              seriesOrder
              related
              source
              summary
            }
            body
            excerpt(pruneLength: 200)
            internal {
              contentFilePath
            }
            frontmatterThumb: frontmatter {
              featured {
                childImageSharp {
                  resize(width: 260, height: 260, cropFocus: NORTH) {
                    src
                  }
                }
              }
            }
          }
        }
      }
    }`,
  );

  if (libraryResult.errors) {
    throw libraryResult.errors;
  }

  const items = libraryResult.data.allMdx.edges;
  const itemNodes = items.map(({node}) => ({
    ...node,
    frontmatter: {
      ...node.frontmatter,
      dateDisplay: new Date(node.frontmatter.date).toLocaleDateString(
          'en-GB',
          {year: 'numeric', month: 'long', day: 'numeric'},
      ),
    },
  }));
  const postNodes = itemNodes.filter(
      node => (node.fields?.itemType || 'post') === 'post',
  );
  const itemsBySlug = new Map(
      itemNodes.map(item => [item.frontmatter.slug, item]),
  );
  const postsBySeries = new Map();

  itemNodes.forEach((item) => {
    const seriesKey = normaliseValue(item.frontmatter.series);
    if (!seriesKey) {
      return;
    }

    const existingPosts = postsBySeries.get(seriesKey) || [];
    existingPosts.push(item);
    postsBySeries.set(seriesKey, existingPosts);
  });

  validatePostMetadata(itemNodes);

  const itemTemplate = path.resolve('./src/templates/item.js');
  itemNodes.forEach((item) => {
    const seriesContext = buildSeriesContext(item, postsBySeries);

    createPage({
      path: `/library/${item.frontmatter.slug}/`,
      // eslint-disable-next-line max-len
      component: `${itemTemplate}?__contentFilePath=${item.internal.contentFilePath}`,
      context: {
        id: item.id,
        slug: item.frontmatter.slug,
        itemType: item.fields?.itemType || 'post',
        headings: buildTableOfContents(item.body),
        relatedPosts: buildRelatedPosts(item, itemsBySlug),
        ...seriesContext,
      },
    });
  });

  createLegacyBlogRedirects(createRedirect, itemNodes);

  /*
   * Library index, plus one paginated view per type.
   * */
  const libraryTemplate = path.resolve('./src/templates/library.js');

  paginate({
    createPage,
    items,
    itemsPerPage: ITEMS_PER_PAGE,
    pathPrefix: ({pageNumber}) => (pageNumber === 0 ?
      '/library' :
      '/library/page'),
    component: libraryTemplate,
    context: {
      activeFilter: 'all',
      itemTypes: ITEM_TYPES,
      paginate_link: '/library',
    },
  });

  ITEM_TYPES.forEach((itemType) => {
    const route = TYPE_ROUTES[itemType];
    const typedItems = items.filter(
        ({node}) => (node.fields?.itemType || 'post') === itemType,
    );

    // A type with nothing in it still gets a page, so the filter bar never
    // links into a 404 while a kind of writing is waiting for its first entry.
    if (typedItems.length === 0) {
      createPage({
        path: `/library/${route}/`,
        component: libraryTemplate,
        context: {
          activeFilter: itemType,
          itemTypes: [itemType],
          isEmpty: true,
          limit: 1,
          skip: 0,
          humanPageNumber: 1,
          numberOfPages: 1,
          paginate_link: `/library/${route}`,
        },
      });

      return;
    }

    paginate({
      createPage,
      items: typedItems,
      itemsPerPage: ITEMS_PER_PAGE,
      pathPrefix: ({pageNumber}) => (pageNumber === 0 ?
        `/library/${route}` :
        `/library/${route}/page`),
      component: libraryTemplate,
      context: {
        activeFilter: itemType,
        itemTypes: [itemType],
        paginate_link: `/library/${route}`,
      },
    });
  });

  /*
   * Tag pages + the tag index
   * */
  const distinctTags = await graphql(
      `{
          allMdx(filter: {
            fields: {sourceInstanceName: {eq: "blog"}, visible: {eq: true}}
          }) {
            distinct(field: {frontmatter: {tags: SELECT}})
          }
        }`,
  );
  const tagList = distinctTags.data.allMdx.distinct.filter(Boolean);
  const tagsTemplate = path.resolve('./src/templates/tag.js');

  tagList.forEach((tag) => {
    const tagLower = normaliseValue(tag);
    const taggedItems = items.filter(
        ({node}) => (node.frontmatter.tags || []).includes(tag),
    );

    paginate({
      createPage,
      items: taggedItems,
      itemsPerPage: ITEMS_PER_PAGE,
      pathPrefix: ({pageNumber}) => (pageNumber === 0 ?
        `/library/tags/${tagLower}` :
        `/library/tags/${tagLower}/page`),
      component: tagsTemplate,
      context: {
        name: tag,
        slug: tagLower,
        paginate_link: `/library/tags/${tagLower}`,
      },
    });
  });

  createPage({
    path: '/library/tags/',
    component: path.resolve('./src/templates/tags.js'),
  });

  /*
   * Category pages + pagination
   * */
  const distinctCategories = await graphql(
      `{
          allMdx(filter: {
            fields: {sourceInstanceName: {eq: "blog"}, visible: {eq: true}}
          }) {
            distinct(field: {frontmatter: {category: SELECT}})
          }
        }`,
  );

  const categoryList = distinctCategories.data.allMdx.distinct.filter(Boolean);
  const categoriesTemplate = path.resolve('./src/templates/category.js');

  categoryList.forEach((category) => {
    const categoryItems = items.filter(
        ({node}) => node.frontmatter.category === category,
    );

    paginate({
      createPage,
      items: categoryItems,
      itemsPerPage: ITEMS_PER_PAGE,
      pathPrefix: ({pageNumber}) => (pageNumber === 0 ?
        `/library/categories/${category}` :
        `/library/categories/${category}/page`),
      component: categoriesTemplate,
      context: {
        name: category,
        slug: category,
        paginate_link: `/library/categories/${category}`,
      },
    });
  });

  createTaxonomyRedirects(createRedirect, categoryList, tagList);
  createCategoryRedirects(createRedirect);

  /*
   * Homepage. Created last so the aggregate counts in its rail can be handed
   * over as context rather than recomputed in the browser.
   * */
  const readMinutes = itemNodes
      .filter(node => (node.fields?.itemType || 'post') !== 'find')
      .reduce((total, node) => total + (node.fields?.readingTime || 0), 0);
  const years = itemNodes
      .map(node => new Date(node.frontmatter.date).getUTCFullYear())
      .filter(year => !Number.isNaN(year))
      .sort((left, right) => left - right);

  createPage({
    path: '/',
    component: path.resolve('./src/templates/index.js'),
    context: {
      counts: {
        all: itemNodes.length,
        post: postNodes.length,
        note: itemNodes.filter(
            node => node.fields?.itemType === 'note',
        ).length,
        find: itemNodes.filter(
            node => node.fields?.itemType === 'find',
        ).length,
      },
      readMinutes,
      yearRange: years.length ?
        `${years[0]}–${years[years.length - 1]}` :
        '',
    },
  });

  /*
   * Search index. Covers the whole library plus the projects, because the
   * search screen faceted by type treats a project as a fourth kind of result.
   * */
  const searchIndex = itemNodes.map(node => ({
    title: node.frontmatter.title,
    normalizedTitle: normaliseValue(node.frontmatter.title),
    kind: node.fields?.itemType || 'post',
    slug: node.frontmatter.slug,
    path: `/library/${node.frontmatter.slug}/`,
    date: node.frontmatter.date,
    dateDisplay: node.frontmatter.dateDisplay,
    readingTime: node.fields?.readingTime || 0,
    source: node.frontmatter.source || '',
    thumb: node.frontmatterThumb?.featured?.childImageSharp?.resize?.src || '',
    category: node.frontmatter.category,
    normalizedCategory: normaliseValue(node.frontmatter.category),
    tags: node.frontmatter.tags || [],
    normalizedTags: normaliseList(node.frontmatter.tags),
    keywords: node.frontmatter.keywords || [],
    normalizedKeywords: normaliseList(node.frontmatter.keywords),
    headings: extractHeadings(node.body),
    bodyPlainText: stripMarkdown(node.body).slice(0, 2000),
    excerpt: node.frontmatter.summary || node.excerpt,
  }));

  const projectSearchResult = await graphql(
      `{
        allFile(
          filter: {sourceInstanceName: {eq: "projects"}, childMdx: {id: {ne: null}}}
          sort: {childMdx: {frontmatter: {date: DESC}}}
        ) {
          nodes {
            childMdx {
              excerpt(pruneLength: 200)
              body
              frontmatter {
                title
                slug
                summary
                language
                techStack
                tags
                date(formatString: "D MMMM YYYY")
                featured {
                  childImageSharp {
                    resize(width: 260, height: 260, cropFocus: NORTH) {
                      src
                    }
                  }
                }
              }
            }
          }
        }
      }`,
  );

  const projectIndex = projectSearchResult.data.allFile.nodes
      .map(({childMdx}) => childMdx)
      .filter(Boolean)
      .map(node => ({
        title: node.frontmatter.title,
        normalizedTitle: normaliseValue(node.frontmatter.title),
        kind: 'project',
        slug: node.frontmatter.slug,
        path: `/projects/${node.frontmatter.slug}/`,
        date: node.frontmatter.date,
        dateDisplay: node.frontmatter.date,
        readingTime: 0,
        source: '',
        thumb:
          node.frontmatter.featured?.childImageSharp?.resize?.src || '',
        category: (node.frontmatter.techStack ||
          [node.frontmatter.language]).filter(Boolean).join(' · '),
        normalizedCategory: '',
        tags: node.frontmatter.tags || [],
        normalizedTags: normaliseList(node.frontmatter.tags),
        keywords: [],
        normalizedKeywords: [],
        headings: [],
        bodyPlainText: stripMarkdown(node.body || '').slice(0, 2000),
        excerpt: node.frontmatter.summary || node.excerpt,
      }));

  fs.mkdirSync(path.resolve('./public'), {recursive: true});
  fs.writeFileSync(
      path.resolve('./public/search-index.json'),
      JSON.stringify(searchIndex.concat(projectIndex)),
  );
};

/*
 * Words per minute for the read-time estimate. Deliberately unhurried: the
 * posts are technical, and an over-confident "3 min" on a thousand-word piece
 * reads as a lie.
 */
const WORDS_PER_MINUTE = 200;

function readingTimeFromFile(contentFilePath) {
  if (!contentFilePath || !fs.existsSync(contentFilePath)) {
    return 1;
  }

  const words = stripMarkdown(fs.readFileSync(contentFilePath, 'utf8'))
      .split(/\s+/)
      .filter(Boolean).length;

  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

function redirectHtml(toPath) {
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

/*
 * Gatsby records redirects but only an adapter emits them, and Amplify's
 * customHttp.yml covers headers only. So write a real page at every old
 * address — canonical tag, meta refresh and a scripted replace that carries
 * the query string and hash across — and drop a rules file next to it that can
 * be pasted into Amplify's console if proper 301s are wanted later.
 */
export const onPostBuild = ({store}) => {
  const {redirects} = store.getState();
  const publicDir = path.resolve('./public');
  const rules = [];
  let written = 0;

  redirects.forEach(({fromPath, toPath}) => {
    rules.push({
      source: fromPath,
      status: '301',
      target: toPath,
    });

    // Wildcards can only be expressed as host rules, not as a file on disk.
    if (fromPath.includes(':') || fromPath.includes('*')) {
      return;
    }

    const target = path.join(
        publicDir,
        fromPath.replace(/^\//, ''),
        'index.html',
    );

    if (fs.existsSync(target)) {
      return;
    }

    fs.mkdirSync(path.dirname(target), {recursive: true});
    fs.writeFileSync(target, redirectHtml(toPath));
    written += 1;
  });

  fs.writeFileSync(
      path.join(publicDir, 'amplify-redirects.json'),
      JSON.stringify(rules, null, 2),
  );

  console.info(
      `[redirects] wrote ${written} redirect pages and ` +
      `${rules.length} rules to public/amplify-redirects.json`,
  );
};

export const onCreateNode = ({node, actions, getNode}) => {
  const {createNodeField} = actions;

  if (node.internal.type === 'Mdx') {
    const value = createFilePath({node, getNode});
    const parentNode = getNode(node.parent);
    const sourceInstanceName = parentNode?.sourceInstanceName || '';
    const rawType = normaliseValue(node.frontmatter?.type);
    const itemType = ITEM_TYPES.includes(rawType) ? rawType : 'post';

    createNodeField({
      name: 'slug',
      node,
      value,
    });
    createNodeField({
      name: 'sourceInstanceName',
      node,
      value: sourceInstanceName,
    });

    if (sourceInstanceName !== 'blog') {
      return;
    }

    createNodeField({
      name: 'itemType',
      node,
      value: itemType,
    });
    createNodeField({
      name: 'itemPath',
      node,
      value: `/library/${node.frontmatter?.slug}/`,
    });
    createNodeField({
      name: 'readingTime',
      node,
      value: readingTimeFromFile(node.internal?.contentFilePath),
    });
    // Drafts stay visible while writing and disappear from the built site, so
    // a half-finished note can sit in the repo without being published.
    createNodeField({
      name: 'visible',
      node,
      value: process.env.NODE_ENV !== 'production' ||
        process.env.GATSBY_SHOW_DRAFTS === 'true' ||
        node.frontmatter?.draft !== true,
    });
  }
};

export const createSchemaCustomization = ({actions, schema}) => {
  const {createTypes} = actions;

  const typeDefs = [
    `type MarkdownRemark implements Node {
            frontmatter: Frontmatter
        }`,
    `type Frontmatter @infer {
            featured: File @fileByRelativePath,
        }`,
    `type MdxFrontmatter @infer {
            category: String
            demo: String
            draft: Boolean
            featured: File @fileByRelativePath,
            gallery: [ProjectGalleryImage!]
            keywords: [String!]
            language: String
            margins: [ItemMargin!]
            related: [String!]
            repo: String
            series: String
            seriesOrder: Int
            source: String
            sourceTitle: String
            summary: String
            tags: [String!]
            techStack: [String!]
            type: String
        }`,
    `type ProjectGalleryImage {
            image: File @fileByRelativePath
            alt: String!
            caption: String
        }`,
    `type ItemMargin {
            label: String!
            text: String!
        }`,
    `type MdxFields {
            itemPath: String
            itemType: String
            readingTime: Int
            slug: String
            sourceInstanceName: String
            visible: Boolean
        }`,
  ];

  createTypes(typeDefs);
};
