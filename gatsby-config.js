const siteMetadata = {
  title: 'Jeff Maxwell Developer Portfolio',
  description: `Jeff Maxwell's developer portfolio made with Gatsby`,
  author: 'Jeff Maxwell',
  createdAt: 2019 - 2025,
  siteUrl: 'https://www.el-jefe.me',
};

module.exports = {
  siteMetadata,
  adapter: require('gatsby-adapter-netlify').default({
    excludeDatastoreFromEngineFunction: false,
    imageCDN: false,
  }),
  plugins: [
    // `gatsby-plugin-webpack-bundle-analyser-v2`, // Only enable when needed
    `gatsby-plugin-react-helmet-async`,
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        host: 'https://www.el-jefe.me',
        sitemap: 'https://www.el-jefe.me/sitemap.xml',
        policy: [{ userAgent: '*', allow: '/' }],
      },
    },
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-plugin-sharp`,
      options: {
        defaults: {
          formats: [`auto`, `webp`], // Removed avif for faster builds
          placeholder: `none`, // Disable blur for faster builds
          quality: 80,
          breakpoints: [750, 1080], // Reduced breakpoints
          backgroundColor: `transparent`,
          tracedSVGOptions: {},
          blurredOptions: {},
          jpgOptions: {},
          pngOptions: {},
          webpOptions: {
            quality: 85,
          },
        },
        stripMetadata: true,
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
        icon_options: {
          purpose: `any maskable`,
        },
        include_favicon: true,
        legacy: true,
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
        domains: ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
      },
    },
    {
      resolve: `gatsby-plugin-emotion`,
    },
    {
      resolve: 'gatsby-plugin-react-svg',
      options: {
        rule: {
          include: /svg-icons.*\.svg$/,
        },
      },
    },
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
          urls: ['/fonts/fonts.css'],
        },
      },
    },
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        trackingIds: ['G-NL37L9SVQ0'],
        gtagConfig: {
          optimize_id: 'GTM-N8HJBQM7',
          cookie_expires: 0,
        },
        pluginConfig: {
          head: true,
          // Delays processing pageview events on route update (in milliseconds)
          delayOnRouteUpdate: 0,
        },
      },
    },
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        excludes: [`/dev-404-page`, `/404`, `/404.html`, `/offline-plugin-app-shell-fallback`],
        query: `
          {
            allSitePage {
              nodes {
                path
              }
            }
            site {
              buildTime(formatString: "YYYY-MM-DD")
            }
          }
        `,
        resolveSiteUrl: () => siteMetadata.siteUrl,
        serialize: ({ path, modifiedGmt }, { site }) => {
          // Define page priorities and change frequencies
          const buildTime = site?.buildTime || new Date().toISOString().split('T')[0];

          const pageMetadata = {
            '/': {
              priority: 1.0,
              changefreq: 'weekly',
              lastmod: buildTime,
            },
            '/about/': {
              priority: 0.8,
              changefreq: 'monthly',
              lastmod: buildTime,
            },
            '/projects/': {
              priority: 0.9,
              changefreq: 'weekly',
              lastmod: buildTime,
            },
            '/contact/': {
              priority: 0.7,
              changefreq: 'monthly',
              lastmod: buildTime,
            },
          };

          const meta = pageMetadata[path] || {
            priority: 0.5,
            changefreq: 'monthly',
            lastmod: modifiedGmt || buildTime,
          };

          return {
            url: path,
            lastmod: meta.lastmod,
            priority: meta.priority,
            changefreq: meta.changefreq,
          };
        },
        createLinkInHead: true,
      },
    },
    // Disable HTML minification to speed up builds
    // {
    //   resolve: `gatsby-plugin-html-minifier`,
    //   options: {
    //     caseSensitive: true,
    //     collapseBooleanAttributes: true,
    //     collapseInlineTagWhitespace: true,
    //     collapseWhitespace: true,
    //     conservativeCollapse: false,
    //     continueOnParseError: false,
    //     customAttrAssign: [],
    //     customAttrCollapse: '',
    //     customAttrSurround: [],
    //     customEventAttributes: [],
    //     decodeEntities: true,
    //     html5: true,
    //     ignoreCustomComments: [],
    //     ignoreCustomFragments: [],
    //     includeAutoGeneratedTags: false,
    //     keepClosingSlash: false,
    //     maxLineLength: 0,
    //     minifyCSS: true,
    //     minifyJS: true,
    //     minifyURLs: true,
    //     preserveLineBreaks: false,
    //     preventAttributesEscaping: false,
    //     processConditionalComments: true,
    //     processScripts: ['text/html'],
    //     quoteCharacter: '"',
    //     removeAttributeQuotes: true,
    //     removeComments: true,
    //     removeEmptyAttributes: true,
    //     removeEmptyElements: false,
    //     removeOptionalTags: false,
    //     removeRedundantAttributes: true,
    //     removeScriptTypeAttributes: true,
    //     removeStyleLinkTypeAttributes: true,
    //     removeTagWhitespace: true,
    //     sortAttributes: true,
    //     sortClassName: true,
    //     trimCustomFragments: true,
    //     useShortDoctype: true,
    //   },
    // },
  ],
};
