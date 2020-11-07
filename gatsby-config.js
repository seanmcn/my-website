const emoji = require(`remark-emoji`)
const { gatsbyPluginFeed } = require('./src/utils/rss')

const isDevelopment = process.env.NODE_ENV === 'development'

// Setup `gatsby-source-filesystem` for blog gatsbySourceFileSystemBlogPosts here as for development
// builds we don't want all the blog images having to generate etc.
const gatsbySourceFileSystemBlogPosts = {
  resolve: `gatsby-source-filesystem`,
  options: {
    path: `${__dirname}/content/blog`,
    name: `blog`,
  },
}

if (isDevelopment) {
  gatsbySourceFileSystemBlogPosts.options.ignore = [
    '**/2009/**',
    '**/2010/**',
    '**/2011/**',
    '**/2012/**',
    '**/2013/**',
    '**/2014/**',
    '**/2015/**',
    '**/2016/**',
    '**/2017/**',
    '**/learn/**',
  ]
}

const gatsbySourceFileSystemAssets = {
  resolve: `gatsby-source-filesystem`,
  options: {
    path: `${__dirname}/content/assets`,
    name: `assets`,
  },
}

module.exports = {
  siteMetadata: {
    title: `Sean McNamara`,
    author: `Sean McNamara`,
    description: `Sean McNamara's personal website, mainly contains articles surrounding programming, technology, games & reviews.`,
    siteUrl: `https://seanmcn.com`,
  },
  plugins: [
    'gatsby-plugin-sass',
    gatsbySourceFileSystemBlogPosts,
    gatsbySourceFileSystemAssets,
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: ['.mdx', '.md'],
        // a workaround to solve mdx-remark plugin compat issue
        // https://github.com/gatsbyjs/gatsby/issues/15486
        plugins: [
          `gatsby-remark-images`,
        ],
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 850,
              linkImagesToOriginal: true,
              showCaptions: true,
            },
          },
          {
            resolve: `gatsby-remark-embedder`,
            options: {
              services: {
                YouTube: {
                  height: "350px",
                }
              },
            },
          },
          {
            resolve: `gatsby-remark-copy-linked-files`,
          },

          {
            resolve: `gatsby-remark-smartypants`,
          },
          {
            resolve: "gatsby-remark-external-links",
            options: {
              target: "_self",
              rel: "nofollow"
            }
          }
        ],
        remarkPlugins: [emoji]
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    gatsbyPluginFeed,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Sean McNamara`,
        short_name: `Sean McN`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `content/assets/pwa/icon.png`,
      },
    },
    `gatsby-plugin-offline`,
    `gatsby-plugin-react-helmet`,
  ],
}
