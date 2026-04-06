import path from 'path';
import fs from 'fs';
import {createFilePath} from 'gatsby-source-filesystem';
import {paginate} from 'gatsby-awesome-pagination';

const TECHNICAL_CATEGORIES = new Set([
  'ai',
  'programming',
  'productivity',
  'systems',
]);

const CATEGORY_REDIRECTS = {
  AI: 'ai',
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

function createCategoryRedirects(createRedirect) {
  Object.entries(CATEGORY_REDIRECTS).forEach(([fromCategory, toCategory]) => {
    if (normaliseValue(fromCategory) === normaliseValue(toCategory)) {
      return;
    }

    createRedirect({
      fromPath: `/blog/categories/${fromCategory}`,
      toPath: `/blog/categories/${toCategory}/`,
      isPermanent: true,
      redirectInBrowser: true,
    });
    createRedirect({
      fromPath: `/blog/categories/${fromCategory}/`,
      toPath: `/blog/categories/${toCategory}/`,
      isPermanent: true,
      redirectInBrowser: true,
    });
    createRedirect({
      fromPath: `/blog/categories/${fromCategory}/page/:page`,
      toPath: `/blog/categories/${toCategory}/page/:page`,
      isPermanent: true,
      redirectInBrowser: true,
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
  return values
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
        date: post.frontmatter.dateDisplay,
        category: post.frontmatter.category,
        tags: post.frontmatter.tags || [],
        excerpt: post.excerpt,
        reason: 'Hand-picked',
      }));

  const scoredPosts = Array.from(allPostsBySlug.values())
      .map(candidatePost => {
        const scoredPost = scoreRelatedPost(currentPost, candidatePost);
        if (!scoredPost || scoredPost.score <= 0) {
          return null;
        }

        return {
          title: candidatePost.frontmatter.title,
          slug: candidatePost.frontmatter.slug,
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

  candidates.forEach(candidatePost => {
    if (seenSlugs.has(candidatePost.slug) || mergedPosts.length >= 3) {
      return;
    }

    seenSlugs.add(candidatePost.slug);
    mergedPosts.push(candidatePost);
  });

  return mergedPosts;
}

function validatePostMetadata(posts) {
  const categoryVariants = new Map();
  const tagVariants = new Map();
  const postSlugs = new Set(posts.map(({frontmatter}) => frontmatter.slug));

  posts.forEach(post => {
    const {frontmatter} = post;
    const rawCategory = frontmatter.category;
    const normalisedCategory = normaliseValue(rawCategory);

    if (!categoryVariants.has(normalisedCategory)) {
      categoryVariants.set(normalisedCategory, new Set());
    }

    categoryVariants.get(normalisedCategory).add(rawCategory);

    (frontmatter.tags || []).forEach(rawTag => {
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

    (frontmatter.related || []).forEach(relatedSlug => {
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
  const itemsPerPage = 9;

  createCategoryRedirects(createRedirect);

  /**
   * Homepage
   * */
  const indexTemplate = path.resolve('./src/templates/index.js');
  createPage({
    path: '/',
    component: indexTemplate,
  });

  /**
   * Blog
   * */
  const blogPosts = await graphql(
      `{
      allMdx(sort: {frontmatter: {date: DESC}}, limit: 1000) {
        edges {
          node {
            id
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
            }
            body
            excerpt(pruneLength: 140)
            internal {
              contentFilePath
            }
          }
        }
      }
    }`,
  );

  const posts = blogPosts.data.allMdx.edges;
  const postNodes = posts.map(({node}) => ({
    ...node,
    frontmatter: {
      ...node.frontmatter,
      dateDisplay: new Date(node.frontmatter.date).toLocaleDateString(
          'en-GB',
          {year: 'numeric', month: 'long', day: 'numeric'},
      ),
    },
  }));
  const postsBySlug = new Map(postNodes.map(post => [post.frontmatter.slug, post]));
  validatePostMetadata(postNodes);
  const postTemplate = path.resolve('./src/templates/post.js');
  const blogPostPromises = postNodes.map(async (post, index) => {
    const previous = index === postNodes.length - 1 ? null : postNodes[index + 1];
    const next = index === 0 ? null : postNodes[index - 1];
    createPage({
      path: `/blog/${post.frontmatter.slug}/`,
      // eslint-disable-next-line max-len
      component: `${postTemplate}?__contentFilePath=${post.internal.contentFilePath}`,
      context: {
        id: post.id,
        slug: post.frontmatter.slug,
        previous,
        next,
        relatedPosts: buildRelatedPosts(post, postsBySlug),
      },
    });
  });

  await Promise.all(blogPostPromises);

  // Create a paginated blog, e.g., /, /page/2, /page/3
  const blogTemplate = path.resolve('./src/templates/blog.js');
  paginate({
    createPage,
    items: posts,
    itemsPerPage,
    pathPrefix: ({pageNumber}) => (pageNumber === 0 ?
      '/blog' :
      '/blog/page'),
    component: blogTemplate,
    context: {
      paginate_link: '/blog',
    },
  });

  /**
   * Tag pages + pagination
   * */
  const distinctTags = await graphql(
      `{
          allMdx {
            distinct(field: {frontmatter: {tags: SELECT}})
          }
        }`,
  );
  const tagList = distinctTags.data.allMdx.distinct;
  const tagsTemplate = path.resolve('./src/templates/tag.js');
  const tagPromises = tagList.map(async (tag) => {
    await graphql(
        `
        {
          allMdx(filter: {frontmatter: {tags: {in: "${tag}"}}}) {
            edges {
              node {
                id
                frontmatter {
                  title
                  slug
                }
                body
              }
            }
          }
        }
        `,
    ).then((tagPosts) => {
      if (tagPosts.errors) {
        throw tagPosts.errors;
      }
      const tagLower = tag.toLowerCase();
      paginate({
        createPage,
        items: tagPosts.data.allMdx.edges,
        itemsPerPage,
        pathPrefix: ({pageNumber}) => (pageNumber === 0 ?
          `/blog/tags/${tagLower}` :
          `/blog/tags/${tagLower}/page`),
        component: tagsTemplate,
        context: {
          name: tag,
          slug: tagLower,
          paginate_link: `/blog/tags/${tagLower}`,
        },
      });
    });
  });

  await Promise.all(tagPromises);

  /**
   * Category pages + pagination
   * */
  const distinctCategories = await graphql(
      `{
          allMdx {
            distinct(field: {frontmatter: {category: SELECT}})
          }
        }`,
  );

  const categoryList = distinctCategories.data.allMdx.distinct;
  const categoriesTemplate = path.resolve('./src/templates/category.js');
  const categoryPromises = categoryList.map(async (category) => {
    await graphql(
        `
        {
          allMdx(filter: {frontmatter: {category: {eq: "${category}"}}}) {
            edges {
              node {
                id
                frontmatter {
                  title
                  slug
                }
                body
              }
            }
          }
        }
        `,
    ).then((categoryPosts) => {
      if (categoryPosts.errors) {
        throw categoryPosts.errors;
      }
      paginate({
        createPage,
        items: categoryPosts.data.allMdx.edges,
        itemsPerPage,
        pathPrefix: ({pageNumber}) => (pageNumber === 0 ?
          `/blog/categories/${category}` :
          `/blog/categories/${category}/page`),
        component: categoriesTemplate,
        context: {
          name: category,
          slug: category,
          paginate_link: `/blog/categories/${category}`,
        },
      });
    });
  });

  await Promise.all(categoryPromises);

  /**
   * Search index
   * */
  const searchData = await graphql(`
    {
      allMdx(sort: {frontmatter: {date: DESC}}) {
        nodes {
          frontmatter {
            title
            slug
            date(formatString: "MMMM DD, YYYY")
            category
            tags
            keywords
          }
          body
          excerpt(pruneLength: 200)
        }
      }
    }
  `);

  const searchIndex = searchData.data.allMdx.nodes.map(node => ({
    title: node.frontmatter.title,
    normalizedTitle: normaliseValue(node.frontmatter.title),
    slug: node.frontmatter.slug,
    path: `/blog/${node.frontmatter.slug}/`,
    date: node.frontmatter.date,
    category: node.frontmatter.category,
    normalizedCategory: normaliseValue(node.frontmatter.category),
    tags: node.frontmatter.tags || [],
    normalizedTags: normaliseList(node.frontmatter.tags),
    keywords: node.frontmatter.keywords || [],
    normalizedKeywords: normaliseList(node.frontmatter.keywords),
    headings: extractHeadings(node.body),
    bodyPlainText: stripMarkdown(node.body).slice(0, 2000),
    excerpt: node.excerpt,
  }));

  fs.mkdirSync(path.resolve('./public'), {recursive: true});
  fs.writeFileSync(
      path.resolve('./public/search-index.json'),
      JSON.stringify(searchIndex),
  );
};

export const onCreateNode = ({node, actions, getNode}) => {
  const {createNodeField} = actions;

  if (node.internal.type === 'Mdx') {
    const value = createFilePath({node, getNode});
    createNodeField({
      name: 'slug',
      node,
      value,
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
            featured: File @fileByRelativePath,
            keywords: [String!]
            related: [String!]
            series: String
            seriesOrder: Int
            tags: [String!]
        }`,
  ];

  createTypes(typeDefs);
};
