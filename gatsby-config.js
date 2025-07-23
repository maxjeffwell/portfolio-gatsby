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
        name: `Jeff Maxwell - Full Stack Developer Portfolio`,
        short_name: `Jeff Maxwell`,
        description: `Jeff Maxwell's professional developer portfolio showcasing React, Node.js, and modern web development projects`,
        start_url: `/`,
        background_color: `#052f5f`,
        theme_color: `#fc4a1a`,
        display: `standalone`,
        orientation: `portrait-primary`,
        icon: 'src/images/elephant_noun_project.png',
        icons: [
          {
            src: 'src/images/elephant_noun_project.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: 'src/images/elephant_noun_project.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
        categories: ['developer-tools', 'portfolio', 'productivity'],
        lang: 'en',
        dir: 'ltr',
        prefer_related_applications: false,
        crossOrigin: 'use-credentials',
        cache_busting_mode: 'none',
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
    // Temporarily removed gatsby-plugin-offline due to security vulnerabilities in workbox-build
    // {
    //   resolve: `gatsby-plugin-offline`,
    //   options: {
    //     precachePages: [`/`, `/about/`, `/projects/`],
    //     workboxConfig: {
    //       globPatterns: ['**/*'],
    //       runtimeCaching: [
    //         {
    //           urlPattern: /(\.js$|\.css$|static\/)/,
    //           handler: `CacheFirst`,
    //         },
    //         {
    //           urlPattern: /^https:\/\/fonts\.googleapis\.com/,
    //           handler: `StaleWhileRevalidate`,
    //         },
    //         {
    //           urlPattern: /^https:\/\/fonts\.gstatic\.com/,
    //           handler: `CacheFirst`,
    //         },
    //       ],
    //     },
    //   },
    // },
  ],
};
