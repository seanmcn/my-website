const path = require('path');
const {createFilePath} = require('gatsby-source-filesystem');
const {paginate} = require('gatsby-awesome-pagination');

exports.createPages = async function({actions, graphql}) {
  const {createPage} = actions;
  const itemsPerPage = 9;

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
      `
     {
        allMdx(
          sort: { fields: [frontmatter___date], order: DESC } 
          limit: 1000
        ) {
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
  );

  const posts = blogPosts.data.allMdx.edges;
  const postTemplate = path.resolve('./src/templates/post.js');
  const blogPostPromises = posts.map(async (edge, index) => {
    const previous = index === posts.length - 1 ? null : posts[index +
    1].node;
    const next = index === 0 ? null : posts[index - 1].node;
    createPage({
      path: `/blog/${edge.node.frontmatter.slug}/`,
      component: postTemplate,
      context: {
        id: edge.node.id,
        slug: edge.node.frontmatter.slug,
        previous,
        next,
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
      `
          {
            allMdx {
              distinct(field: frontmatter___tags)
            }
          }
        `,
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
      `
          {
            allMdx {
              distinct(field: frontmatter___category)
            }
          }
        `,
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
};

exports.onCreateNode = ({node, actions, getNode}) => {
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

exports.createSchemaCustomization = ({actions, schema}) => {
  const {createTypes} = actions;

  const typeDefs = [
    `type MarkdownRemark implements Node {
            frontmatter: Frontmatter
        }`,
    `type Frontmatter @infer {
            featured: [File!]! @fileByRelativePath,
        }`,
  ];

  createTypes(typeDefs);
};
