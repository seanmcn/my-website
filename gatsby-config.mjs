// eslint-disable-next-line max-len
import {gatsbyPluginFeed} from './src/utils/rss.js';
import algoliaQueries from './src/utils/algolia.js';
import {dirname} from "path"
import {fileURLToPath} from "url"
import remarkEmoji from 'remark-emoji';

const isDevelopment = process.env.NODE_ENV === 'development';
const __dirname = dirname(fileURLToPath(import.meta.url))

// Setup `gatsby-source-filesystem` for blog gatsbySourceFileSystemBlogPosts
// here as for development builds we don't want all the blog images having
// to generate etc.
const gatsbySourceFileSystemBlogPosts = {
    resolve: 'gatsby-source-filesystem',
    options: {
        name: 'blog',
        path: `${__dirname}/content/blog`,
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
        '**/2018/**',
        '**/2019/**',
        '**/2020/**',
    ];
}

const gatsbySourceFileSystemAssets = {
    resolve: 'gatsby-source-filesystem',
    options: {
        path: `${__dirname}/content/assets`,
        name: 'assets',
    },
};

const config = {
    flags: {
        DEV_SSR: true
    },
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
        {
            resolve: 'gatsby-plugin-mdx',
            options: {
                extensions: ['.mdx', '.md'],
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
                mdxOptions: {
                    remarkPlugins: [
                            remarkEmoji
                    ],
                },
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
        'gatsby-plugin-sitemap',
        {
            resolve: 'gatsby-plugin-robots-txt',
            options: {
                host: 'https://www.seanmcn.com',
                sitemap: 'https://www.seanmcn.com/sitemap-index.xml',
                policy: [{userAgent: '*', allow: '/'}],
            },
        },
    ],
};

export default config
