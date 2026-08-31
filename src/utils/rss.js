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

// The feed carries the whole library, not just the posts: a note or a find is
// exactly the kind of short item a reader subscribes for.
const rssFeeds = [
  {
    serialize: ({query: {site, allMdx}}) => {
      return allMdx.nodes.map((node) => {
        const itemUrl =
          `${site.siteMetadata.siteUrl}/library/${node.frontmatter.slug}/`;

        return Object.assign({}, node.frontmatter, {
          title: node.frontmatter.title,
          slug: node.frontmatter.slug,
          date: node.frontmatter.date,
          description: node.frontmatter.summary || (
            node.body.length > 3000 ?
              node.body.substring(0, 3000) :
              node.body
          ),
          categories: [node.fields?.itemType || 'post'],
          url: itemUrl,
          guid: itemUrl,
          custom_elements: [{'content:encoded': node.html}],
        });
      });
    },
    query: `{
                allMdx(
                  sort: {frontmatter: {date: DESC}}
                  filter: {
                    fields: {
                      sourceInstanceName: {eq: "blog"}
                      visible: {eq: true}
                    }
                  }
                ) {
                  nodes {
                    fields {
                      itemType
                    }
                    frontmatter {
                      title
                      date
                      slug
                      summary
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
