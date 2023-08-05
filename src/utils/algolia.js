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
        body
      }
    }
  }
}
`;

// Bring frontmatter up to the top level of the node
const unnestFrontmatter = (node) => {
  const {frontmatter, ...rest} = node;

  return {
    ...frontmatter,
    ...rest,
  };
};

// Split body into multiple records
const splitBody = (node) => {
  const {body, ...rest} = node;

  // create a record for each paragraph
  const sections = body.split('\n\n');

  // add the frontmatter content onto each record
  return sections.map(section => ({
    ...rest,
    content: section,
  }));
};

const queries = [
  {
    query: mdxQuery,
    transformer: ({data}) => data.allMdx.edges
        .map(edge => edge.node)
        .map(unnestFrontmatter)
    // get the raw body and split it into multiple records
        .map(splitBody)
    // flatten above records into a single array
        .reduce((acc, cur) => [...acc, ...cur], []),
    settings: {
      attributeForDistinct: 'slug',
      distinct: true,
    },
  },
];

module.exports = queries;
