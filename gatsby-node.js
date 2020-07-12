const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)
const { paginate } = require('gatsby-awesome-pagination')

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  const indexTemplate = path.resolve(`./src/templates/index.js`)
  createPage({
    path: `/`,
    component: indexTemplate,
  })
  return graphql(
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
    `
  ).then(result => {
    if (result.errors) {
      throw result.errors
    }

    // Create blog posts pages.
    const posts = result.data.allMdx.edges

    const postTemplate = path.resolve(`./src/templates/post.js`)
    const blogTemplate = path.resolve(`./src/templates/blog.js`)

    posts.forEach((post, index) => {
      const previous = index === posts.length - 1 ? null : posts[index + 1].node
      const next = index === 0 ? null : posts[index - 1].node

      createPage({
        path: `/blog/${post.node.frontmatter.slug}/`,
        component: postTemplate,
        context: {
          slug: post.node.frontmatter.slug,
          previous,
          next,
        },
      })
    })

    // Create a paginated blog, e.g., /, /page/2, /page/3
    paginate({
      createPage,
      items: posts,
      itemsPerPage: 10,
      pathPrefix: ({ pageNumber }) =>
        pageNumber === 0 ? `/blog` : `/blog/page`,
      component: blogTemplate,
    })
  })
  .then(() => {
    return graphql(
      `
      {
         allMdx {
            distinct(field: frontmatter___tags)
         }
      }
    `)
  })
  .then(result => {
    if (result.errors) {
      throw result.errors
    }

    const tagsTemplate = path.resolve(`./src/templates/tag.js`)

    // Create blog tag pages.
    const tags = result.data.allMdx.distinct

    tags.forEach((tag) => {
      createPage({
        path: `/blog/tags/${tag}/`,
        component: tagsTemplate,
        context: {
          name: tag,
          slug: tag.toLowerCase(),
        },
      })
    })
  })
  .then(() => {
    return graphql(
      `
      {
         allMdx {
            distinct(field: frontmatter___category)
         }
      }
    `)
  })
  .then(result => {
    if (result.errors) {
      throw result.errors
    }

    const categoriesTemplate = path.resolve(`./src/templates/category.js`)

    // Create blog category pages.
    const categories = result.data.allMdx.distinct


    categories.forEach((category) => {
      createPage({
        path: `/blog/categories/${category}/`,
        component: categoriesTemplate,
        context: {
          name: category,
          slug: category,
        },
      })
    })
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `Mdx`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}
