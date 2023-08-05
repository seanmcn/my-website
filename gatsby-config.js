// eslint-disable-next-line max-len
const chatGptTransformer = require('./src/utils/remark-embedder/chatgpt-transformer');

const emoji = require('remark-emoji');

const {gatsbyPluginFeed} = require('./src/utils/rss');
const algoliaQueries = require('./src/utils/algolia');

const isDevelopment = process.env.NODE_ENV === 'development';

// Setup `gatsby-source-filesystem` for blog gatsbySourceFileSystemBlogPosts
// here as for development builds we don't want all the blog images having
// to generate etc.
const gatsbySourceFileSystemBlogPosts = {
  resolve: 'gatsby-source-filesystem',
  options: {
    path: `${__dirname}/content/blog`,
    name: 'blog',
  },
};

if (isDevelopment) {
  gatsbySourceFileSystemBlogPosts.options.ignore = [
    '**/2009/**',
    '**/2010/**',
    '**/2011/**',
    '**/2012/**',
    '**/2013/**',
    '**/2014/**',
    '**/2016/**',
    '**/2017/**',
  ];
}

const gatsbySourceFileSystemAssets = {
  resolve: 'gatsby-source-filesystem',
  options: {
    path: `${__dirname}/content/assets`,
    name: 'assets',
  },
};

module.exports = {
  siteMetadata: {
    title: 'Seán McNamara',
    author: 'Seán McNamara',
    description: 'Seán McNamara\'s personal website, containing ' +
      'articles surrounding programming, technology, games & reviews.',
    siteUrl: 'https://seanmcn.com',
  },
  plugins: [
    'gatsby-plugin-sass',
    'gatsby-plugin-sharp',
    'gatsby-remark-images',
    // 'gatsby-remark-emoji',
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        extensions: ['.mdx', '.md'],
        // a workaround to solve mdx-remark plugin compat issue
        // https://github.com/gatsbyjs/gatsby/issues/15486
        // plugins: ['gatsby-remark-images'],
        gatsbyRemarkPlugins: [
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 850,
              linkImagesToOriginal: true,
            },
          },
          {
            resolve: 'gatsby-remark-embedder',
            options: {
              customTransformers: [
                chatGptTransformer,
              ],
              services: {
                YouTube: {
                  height: '350px',
                },
              },
            },
          },
          {
            resolve: 'gatsby-remark-copy-linked-files',
          },
          {
            resolve: 'gatsby-remark-smartypants',
          },
          {
            resolve: 'gatsby-remark-external-links',
            options: {
              target: '_self',
              rel: 'nofollow',
            },
          },
        ],
        // eslint-disable-next-line global-require
        mdxOptions: {
          remarkPlugins: [emoji],
        },
        // remarkPlugins: [
        // emoji,
        // ],
      },
    },
    'gatsby-transformer-sharp',
    gatsbySourceFileSystemBlogPosts,
    gatsbySourceFileSystemAssets,
    gatsbyPluginFeed,
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'Seán McNamara',
        short_name: 'Sean McN',
        start_url: '/',
        background_color: '#ffffff',
        theme_color: '#663399',
        display: 'minimal-ui',
        icon: 'content/assets/pwa/icon.png',
      },
    },
    {
      resolve: 'gatsby-plugin-algolia',
      options: {
        appId: process.env.GATSBY_ALGOLIA_APP_ID,
        apiKey: process.env.GATSBY_ALGOLIA_ADMIN_KEY,
        indexName: process.env.GATSBY_ALGOLIA_INDEX_NAME,
        queries: algoliaQueries,
        chunkSize: 10000,
      },
    },
    'gatsby-plugin-offline',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-image',
    {
      resolve: 'gatsby-remark-related-posts',
      options: {
        target_node: 'Mdx',
        getMarkdown: node => node.body,
      },
    },
  ],
};
