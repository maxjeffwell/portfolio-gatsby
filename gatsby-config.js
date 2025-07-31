const siteMetadata = {
  title: 'Jeff Maxwell Developer Portfolio',
  description: `Jeff Maxwell's developer portfolio made with Gatsby`,
  author: 'Jeff Maxwell',
  createdAt: 2019 - 2025,
  siteUrl: 'https://www.el-jefe.me',
};

module.exports = {
  siteMetadata,
  // Flags for performance improvements
  flags: {
    PRESERVE_WEBPACK_CACHE: true,
    FAST_DEV: true,
  },
  adapter: require('gatsby-adapter-netlify').default({
    excludeDatastoreFromEngineFunction: false,
    imageCDN: false,
  }),
  plugins: [
    // `gatsby-plugin-webpack-bundle-analyser-v2`, // Only enable when needed
    {
      resolve: 'gatsby-plugin-brotli',
      options: {
        extensions: ['css', 'html', 'js', 'svg'],
      },
    },
    {
      resolve: 'gatsby-plugin-zopfli',
      options: {
        extensions: ['css', 'html', 'js', 'svg'],
      },
    },
    `gatsby-plugin-react-helmet-async`,
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`,
        omitGoogleFont: false,
      },
    },
    {
      resolve: `gatsby-plugin-styled-components`,
      options: {
        // Display component names in devtools
        displayName: process.env.NODE_ENV !== 'production',
        // Add babel plugin for SSR optimization
        fileName: true,
        pure: true,
      },
    }, // Switch to styled-components for better SSR support
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
      resolve: `gatsby-transformer-ffmpeg`,
      options: {
        ffmpegPath: `ffmpeg`, // Uses system ffmpeg
      },
    },
    {
      resolve: `gatsby-plugin-sharp`,
      options: {
        defaults: {
          formats: [`auto`, `webp`, `avif`], // Re-enable AVIF for better compression
          placeholder: `blurred`, // Re-enable blur for better UX
          quality: 75, // Reduced quality for better compression
          breakpoints: [480, 768, 1024, 1200], // Optimized breakpoints
          backgroundColor: `transparent`,
          tracedSVGOptions: {},
          blurredOptions: {
            width: 20,
            toFormat: 'jpg',
            jpegOptions: { quality: 20 },
          },
          jpgOptions: { quality: 75, progressive: true },
          pngOptions: { quality: 75, compressionSpeed: 4 },
          webpOptions: { quality: 75 },
          avifOptions: { quality: 60, speed: 8 }, // AVIF with good compression
        },
        stripMetadata: true,
        failOnError: false, // Don't fail build on image processing errors
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
        domains: [
          'https://fonts.googleapis.com',
          'https://fonts.gstatic.com',
          'https://www.google-analytics.com',
          'https://www.googletagmanager.com'
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-react-svg',
      options: {
        rule: {
          include: /(svg-icons.*\.svg$|aspca\.svg$|iapf\.svg$)/,
          omitKeys: [
            'xmlnsDc',
            'xmlnsCc',
            'xmlnsRdf',
            'xmlnsSvg',
            'xmlnsSodipodi',
            'xmlnsInkscape',
          ],
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
    // HTML minification for production optimization
    {
      resolve: `gatsby-plugin-html-minifier`,
      options: {
        caseSensitive: true,
        collapseBooleanAttributes: true,
        collapseInlineTagWhitespace: false, // Keep some whitespace for readability
        collapseWhitespace: true,
        conservativeCollapse: true, // More conservative approach
        continueOnParseError: false,
        decodeEntities: true,
        html5: true,
        minifyCSS: true,
        minifyJS: true,
        minifyURLs: true,
        preserveLineBreaks: false,
        processConditionalComments: true,
        removeComments: true,
        removeEmptyAttributes: true,
        removeEmptyElements: false,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
      },
    },
  ],
};
