const mdxQuery = `
{
  allMdx {
    edges {
      node {
        id
        excerpt
        frontmatter {
          slug
          tags
          title
          keywords
        }
        rawBody
      }
    }
  }
}
`
const unnestFrontmatter = (node) => {
  const { frontmatter, ...rest } = node

  return {
    ...frontmatter,
    ...rest,
  }
}

const queries = [
  {
    query: mdxQuery,
    transformer: ({ data }) =>
      data.allMdx.edges.map((edge) => edge.node).map(unnestFrontmatter),
    settings: {
      attributeForDistinct: 'slug',
      distinct: true,
    },
  },
]

module.exports = queries
