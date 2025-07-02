const siteMetadata = {
  title: 'Jeff Maxwell Developer Portfolio',
  description: `Jeff Maxwell's developer portfolio made with Gatsby`,
  author: 'Jeff Maxwell',
  createdAt: 2019,
  siteUrl: 'https://www.jeffmaxwell.dev',
};

module.exports = {
  siteMetadata,
  plugins: [
    `gatsby-plugin-react-helmet-async`,
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-plugin-sharp`,
      options: {
        defaults: {
          formats: [`auto`, `webp`, `avif`],
          placeholder: `blurred`,
          quality: 90,
          breakpoints: [480, 768, 1024, 1200, 1920],
          backgroundColor: `transparent`,
          tracedSVGOptions: {},
          blurredOptions: {},
          jpgOptions: {},
          pngOptions: {},
          webpOptions: {
            quality: 85,
          },
          avifOptions: {
            quality: 80,
          },
        },
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-developer-portfolio`,
        short_name: `portfolio`,
        start_url: `/`,
        background_color: `#052f5f`,
        theme_color: `#fc4a1a`,
        display: `minimal-ui`,
        icon: 'src/images/elephant_noun_project.png', // This path is relative to the root of the site.
      },
    },
    {
      resolve: `gatsby-plugin-preconnect`,
      options: {
        domains: [
          'https://fonts.googleapis.com',
          'https://fonts.gstatic.com',
        ],
      },
    },
    // `gatsby-plugin-eslint`, // Temporarily disabled due to dependency conflicts
    `gatsby-plugin-emotion`,
    {
      resolve: `gatsby-plugin-web-font-loader`,
      options: {
        custom: {
          families: [
            'AvenirLTStd-Roman',
            'HelveticaNeueLTStd-Bd',
            'HelveticaNeueLTStd-Roman',
            'SabonLTStd-Roman',
          ],
        },
      },
    },
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        excludes: [],
        query: `
          {
            allSitePage {
              nodes {
                path
              }
            }
          }
        `,
        resolveSiteUrl: () => siteMetadata.siteUrl,
        serialize: ({ path, modifiedGmt }) => {
          return {
            url: path,
            lastmod: modifiedGmt,
          };
        },
      },
    },
  ],
};
