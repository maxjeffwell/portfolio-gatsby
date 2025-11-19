const siteMetadata = {
  title: 'Jeff Maxwell Developer Portfolio',
  description: `Full Stack Developer specializing in React & Node.js. Orlando, Central Florida, Tampa Bay Area.`,
  author: 'Jeff Maxwell',
  createdAt: 2019 - 2025,
  siteUrl: 'https://el-jefe.me',
};

module.exports = {
  siteMetadata,
  // Flags for performance improvements
  flags: {
    PRESERVE_WEBPACK_CACHE: true,
    FAST_DEV: true,
    DEV_SSR: false, // Disable SSR in development to avoid document errors
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
    // Typography plugin disabled - using styled-components for all styling
    // {
    //   resolve: `gatsby-plugin-typography`,
    //   options: {
    //     pathToConfigModule: `src/utils/typography`,
    //     omitGoogleFont: false,
    //   },
    // },
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
          formats: [`auto`, `webp`, `avif`], // AVIF for better compression
          placeholder: `dominantColor`, // Use dominant color instead of blurred placeholders
          quality: 65, // Further reduced quality for mobile performance
          breakpoints: [375, 480, 768, 1024], // Mobile-first breakpoints
          backgroundColor: `transparent`,
          tracedSVGOptions: {},
          blurredOptions: {
            width: 16,
            toFormat: 'jpg',
            jpegOptions: { quality: 15 },
          },
          jpgOptions: { quality: 65, progressive: true, mozjpeg: true },
          pngOptions: { quality: 65, compressionSpeed: 6 },
          webpOptions: { quality: 65, lossless: false },
          avifOptions: { quality: 50, speed: 9 }, // Aggressive AVIF compression
        },
        stripMetadata: true,
        failOn: `none`, // Don't fail build on image processing errors (updated from deprecated failOnError)
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
        crossOrigin: true,
      },
    },
    {
      resolve: 'gatsby-plugin-react-svg',
      options: {
        rule: {
          include: /(svg-icons.*\.svg$|aspca\.svg$|iapf\.svg$|elephant_logo\.svg$)/,
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
        timeout: 3000, // 3 second timeout for mobile
        display: 'swap', // Use font-display: swap for faster rendering
      },
    },
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        trackingIds: ['G-NL37L9SVQ0'],
        gtagConfig: {
          optimize_id: 'GTM-N8HJBQM7',
          cookie_expires: 0,
          send_page_view: false, // Manual page view tracking for better control
          anonymize_ip: true,
          allow_google_signals: false,
          custom_map: {},
        },
        pluginConfig: {
          head: false, // Load in body for non-blocking
          respectDNT: true,
          exclude: ['/dev-404-page', '/404', '/404.html'],
          delayOnRouteUpdate: 300, // Delay to reduce impact on navigation
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
          // Use current date for more accurate freshness signals
          const currentDate = new Date().toISOString();
          const buildTime = site?.buildTime || currentDate.split('T')[0];

          const pageMetadata = {
            '/': {
              priority: 1.0,
              changefreq: 'weekly',
              lastmod: currentDate,
            },
            '/about/': {
              priority: 0.8,
              changefreq: 'monthly',
              lastmod: currentDate,
            },
            '/projects/': {
              priority: 0.9,
              changefreq: 'weekly',
              lastmod: currentDate,
            },
            '/contact/': {
              priority: 0.7,
              changefreq: 'monthly',
              lastmod: currentDate,
            },
          };

          const meta = pageMetadata[path] || {
            priority: 0.5,
            changefreq: 'monthly',
            lastmod: modifiedGmt || currentDate,
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
    // Service worker for offline functionality and performance
    {
      resolve: `gatsby-plugin-offline`,
      options: {
        precachePages: [`/`, `/about/`, `/projects/`, `/contact/`],
        workboxConfig: {
          globPatterns: ['**/*.{js,css,html,png,jpg,jpeg,gif,svg,webp,avif}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com/,
              handler: 'StaleWhileRevalidate',
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com/,
              handler: 'CacheFirst',
            },
          ],
        },
      },
    },
  ],
};
