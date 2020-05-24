module.exports = {
  siteMetadata: {
    title: 'Sean McNamara | Programming Stuff',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sass',
    {
      resolve: 'gatsby-source-wordpress',
      options: {
        // The base url to your WP site.
        baseUrl: 'seanmcn.com',
        // WP.com sites set to true, WP.org set to false
        hostingWPCOM: false,
        // The protocol. This can be http or https.
        protocol: 'https',
        // Use 'Advanced Custom Fields' Wordpress plugin
        useACF: false,
        auth: {
          jwt_user: process.env.JWT_USER,
          jwt_pass: process.env.JWT_PASSWORD,
          jwt_base_path: '/jwt-auth/v1/token',
        },
        // Set to true to debug endpoints on 'gatsby build'
        verboseOutput: false,
        // Number of posts per page request
        perPage: 100,
        // Number of concurrent requests
        concurrentRequests: 10,
        // Routes to include in cache
        includedRoutes: [
          '**/categories',
          '**/posts',
          '**/media',
          '**/tags',
          '**/taxonomies',
          '**/users',
        ],
      },
    },
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    {
      // Removes unused css rules
      resolve: 'gatsby-plugin-purgecss',
      options: {
        // Activates purging in gatsby develop
        // develop: true,
        // Purge only the main css file
        // purgeOnly: ['/all.sass'],
      },
    }, // must be after other CSS plugins
    'gatsby-plugin-netlify', // make sure to keep it last in the array
  ],
}
