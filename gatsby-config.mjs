// eslint-disable-next-line max-len
import {gatsbyPluginFeed} from './src/utils/rss.js';
import {dirname} from "path"
import {fileURLToPath} from "url"
import remarkEmoji from 'remark-emoji';
import remarkGfm from 'remark-gfm';
import remarkYouTubeEmbed from './src/utils/remark-youtube-embed.mjs';

const isDevelopment = process.env.NODE_ENV === 'development';
const isTesting = process.env.CYPRESS_TESTING === 'true';
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

if (isDevelopment && !isTesting) {
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
    siteMetadata: {
        title: 'Seán McNamara',
        author: 'Seán McNamara',
        description: 'Seán McNamara\'s personal website, containing ' +
                'articles surrounding programming, technology, games & reviews.',
        siteUrl: 'https://seanmcn.com',
    },
    plugins: [
        {
            resolve: 'gatsby-plugin-sass',
            options: {
                sassOptions: {
                    quietDeps: true,
                },
            },
        },
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
                            remarkGfm,
                            remarkYouTubeEmbed,
                            remarkEmoji,
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
        'gatsby-plugin-offline',
        'gatsby-plugin-image',
        'gatsby-plugin-sitemap',
    ],
};

export default config
