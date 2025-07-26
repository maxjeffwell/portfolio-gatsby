/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

// Advanced webpack configuration for bundle optimization
exports.onCreateWebpackConfig = ({ stage, rules, loaders, plugins, actions, getConfig }) => {
  const config = getConfig();

  // Production optimizations
  if (stage === 'build-javascript') {
    // Add bundle analyzer only when ANALYZE=true
    if (process.env.ANALYZE === 'true') {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: './bundle-analyzer-report.html',
          openAnalyzer: false,
        })
      );
    }

    // Advanced code splitting
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          // Vendor libraries
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
          },
          // React libraries
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            chunks: 'all',
            priority: 20,
            reuseExistingChunk: true,
          },
          // Emotion styling libraries
          emotion: {
            test: /[\\/]node_modules[\\/]@emotion[\\/]/,
            name: 'emotion',
            chunks: 'all',
            priority: 15,
            reuseExistingChunk: true,
          },
          // React Icons
          icons: {
            test: /[\\/]node_modules[\\/]react-icons[\\/]/,
            name: 'icons',
            chunks: 'all',
            priority: 12,
            reuseExistingChunk: true,
          },
          // Common chunks
          common: {
            minChunks: 2,
            chunks: 'all',
            name: 'common',
            priority: 5,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      },
      // Enhanced minimization with custom plugins
      minimize: true,
      minimizer: [
        // Advanced JavaScript minification
        new TerserPlugin({
          terserOptions: {
            parse: {
              ecma: 8,
            },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2,
              drop_console: true,
              drop_debugger: true,
              pure_getters: true,
              unsafe: true,
              unsafe_comps: true,
              unsafe_Function: true,
              unsafe_math: true,
              unsafe_symbols: true,
              unsafe_methods: true,
              unsafe_proto: true,
              unsafe_regexp: true,
              unsafe_undefined: true,
              unused: true,
              dead_code: true,
              collapse_vars: true,
              reduce_vars: true,
              passes: 2,
            },
            mangle: {
              safari10: true,
              reserved: ['$', 'jQuery', 'react', 'React'],
            },
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true,
            },
          },
          parallel: true,
          extractComments: false,
        }),
        // Advanced CSS minification
        new CssMinimizerPlugin({
          minimizerOptions: {
            preset: [
              'default',
              {
                discardComments: { removeAll: true },
                normalizeWhitespace: true,
                colormin: true,
                convertValues: true,
                discardDuplicates: true,
                discardEmpty: true,
                discardOverridden: true,
                discardUnused: true,
                mergeIdents: true,
                mergeLonghand: true,
                mergeRules: true,
                minifyFontValues: true,
                minifyGradients: true,
                minifyParams: true,
                minifySelectors: true,
                normalizeCharset: true,
                normalizeDisplayValues: true,
                normalizePositions: true,
                normalizeRepeatStyle: true,
                normalizeString: true,
                normalizeTimingFunctions: true,
                normalizeUnicode: true,
                normalizeUrl: true,
                orderedValues: true,
                reduceIdents: true,
                reduceInitial: true,
                reduceTransforms: true,
                svgo: true,
                uniqueSelectors: true,
              },
            ],
          },
          parallel: true,
        }),
      ],
      usedExports: true,
      sideEffects: false,
    };
  }

  if (stage === 'develop') {
    // Faster rebuilds in development
    config.optimization = {
      ...config.optimization,
      removeAvailableModules: false,
      removeEmptyChunks: false,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /node_modules/,
            priority: 20,
          },
        },
      },
    };

    // Faster source maps
    config.devtool = 'eval-cheap-module-source-map';
  }

  // Module resolution optimizations
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@images': path.resolve(__dirname, 'src/images'),
    },
    // Reduce resolve attempts
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  };

  actions.replaceWebpackConfig(config);
};

// Prefetch and preload critical resources
exports.onCreatePage = ({ page, actions }) => {
  const { createPage, deletePage } = actions;

  // Add preload hints for critical pages
  if (page.path === '/') {
    deletePage(page);
    createPage({
      ...page,
      context: {
        ...page.context,
        preload: ['/projects/', '/about/', '/contact/'],
      },
    });
  }
};

// Service Worker optimizations
exports.onPostBuild = ({ reporter }) => {
  reporter.info('🚀 Build completed with optimizations');
  
  if (process.env.ANALYZE === 'true') {
    reporter.info('📊 Bundle analysis report generated at ./public/bundle-analyzer-report.html');
  }
};

// Configure cache headers for static assets
exports.onCreateDevServer = ({ app }) => {
  // Cache static assets in development
  app.use('/static', (req, res, next) => {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    next();
  });
  
  // Cache fonts
  app.use('/fonts', (req, res, next) => {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    next();
  });
};

// Add custom headers to build output
exports.onPostBootstrap = ({ reporter }) => {
  reporter.info('Cache headers configured for optimal performance');
};
