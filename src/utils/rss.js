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
    serialize: ({query: {site, allMdx}}) => {
      return allMdx.nodes.map((node) => {
        return Object.assign({}, node.frontmatter, {
          title: node.frontmatter.title,
          slug: node.frontmatter.slug,
          date: node.frontmatter.date,
          description: node.body.length > 3000 ?
            node.body.substring(0, 3000) :
            node.body,
          url: `${site.siteMetadata.siteUrl}/blog/${node.frontmatter.slug}`,
          guid: `${site.siteMetadata.siteUrl}/blog/${node.frontmatter.slug}`,
          custom_elements: [{'content:encoded': node.html}],
        });
      });
    },
    query: `{
                allMdx(sort: {frontmatter: {date: DESC}}) {
                  nodes {
                    frontmatter {
                      title
                      date
                      slug
                    }
                    body
                  }
                }
              }`,
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
