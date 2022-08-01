const rssQuery = `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl,
                site_url: siteUrl
              }
            }
          }
        `;

const rssFeeds = [
  {
    serialize: ({query: {site, allMdx}}) => allMdx.edges.map(edge => ({
      ...edge.node.frontmatter,
      // description: edge.node.excerpt,
      date: edge.node.frontmatter.date,
      url: `${site.siteMetadata.siteUrl}/blog/${edge.node.frontmatter.slug}`,
      guid: `${site.siteMetadata.siteUrl}/blog/${edge.node.frontmatter.slug}`,
      custom_elements: [{'content:encoded': edge.node.html}],
    })),
    query: `
            {
              allMdx(
                limit: 1000,
                sort: { order: DESC, fields: [frontmatter___date] },
              ) {
                edges {
                  node {
                    frontmatter {
                      title
                      date
                      slug
                    }
                    html
                  }
                }
              }
            }
            `,
    output: '/rss.xml',
    title: 'Seanmcn.com RSS feed',
  },
];

const gatsbyPluginFeed = {
  resolve: 'gatsby-plugin-feed',
  options: {
    query: rssQuery,
    feeds: rssFeeds,
  },
};

module.exports = {gatsbyPluginFeed};
