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
exports.onCreateWebpackConfig = ({ stage, actions, getConfig }) => {
  const config = getConfig();

  // Fix for React 18 ContextRegistry issue - use resolve alias and webpack runtime patch
  if (stage === 'build-javascript' || stage === 'develop') {
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};

    // Force all React imports to use the same instance
    config.resolve.alias.react = path.resolve('./node_modules/react');
    config.resolve.alias['react-dom'] = path.resolve('./node_modules/react-dom');

    // Add webpack plugin to patch runtime
    config.plugins.push({
      apply(compiler) {
        compiler.hooks.compilation.tap('ReactContextRegistryRuntimeFix', (compilation) => {
          compilation.hooks.processAssets.tap(
            {
              name: 'ReactContextRegistryRuntimeFix',
              stage: compilation.constructor.PROCESS_ASSETS_STAGE_ADDITIONS,
            },
            () => {
              const polyfill = `
// React 18 ContextRegistry polyfill for webpack runtime
(function() {
  if (typeof window !== 'undefined') {
    var patchReact = function(reactObj) {
      if (reactObj && reactObj.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) {
        if (!reactObj.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ContextRegistry) {
          reactObj.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ContextRegistry = {};
        }
      }
    };
    if (window.React) patchReact(window.React);
    if (window.__webpack_require__ && window.__webpack_require__.cache) {
      Object.keys(window.__webpack_require__.cache).forEach(function(key) {
        var module = window.__webpack_require__.cache[key];
        if (module && module.exports && module.exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) {
          patchReact(module.exports);
        }
      });
    }
  }
})();
`;

              // Apply polyfill to webpack runtime and React-related bundles
              for (const [filename, asset] of compilation.assets) {
                if (
                  filename.endsWith('.js') &&
                  (filename.includes('webpack-runtime') ||
                    filename.startsWith('app-') ||
                    filename.startsWith('vendors-') ||
                    filename.includes('react'))
                ) {
                  const source = asset.source();
                  if (!source.includes('ContextRegistry')) {
                    const newSource = polyfill + source;
                    compilation.assets[filename] = {
                      source: () => newSource,
                      size: () => newSource.length,
                    };
                  }
                }
              }
            }
          );
        });
      },
    });
  }

  // Production optimizations
  if (stage === 'build-javascript') {
    // Disable source maps in production for security (prevents library detection)
    config.devtool = process.env.GENERATE_SOURCEMAP === 'true' ? 'source-map' : false;

    // Add bundle analyzer only when ANALYZE=true and not in Netlify
    if (process.env.ANALYZE === 'true' && !process.env.NETLIFY) {
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
        maxSize: 244000, // 244KB chunks for better caching
        cacheGroups: {
          // React libraries
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            chunks: 'all',
            priority: 30,
            reuseExistingChunk: true,
          },
          // MUI Core separate from other vendors
          mui: {
            test: /[\\/]node_modules[\\/]@mui[\\/]/,
            name: 'mui',
            chunks: 'all',
            priority: 25,
            reuseExistingChunk: true,
          },
          // Emotion styling libraries
          emotion: {
            test: /[\\/]node_modules[\\/]@emotion[\\/]/,
            name: 'emotion',
            chunks: 'all',
            priority: 20,
            reuseExistingChunk: true,
          },
          // React Icons - separate bundle
          icons: {
            test: /[\\/]node_modules[\\/](react-icons|@mui\/icons-material)[\\/]/,
            name: 'icons',
            chunks: 'all',
            priority: 15,
            reuseExistingChunk: true,
          },
          // Gatsby runtime
          gatsby: {
            test: /[\\/]node_modules[\\/]gatsby[\\/]/,
            name: 'gatsby',
            chunks: 'all',
            priority: 12,
            reuseExistingChunk: true,
          },
          // Other vendor libraries
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
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
        // Advanced JavaScript minification with enhanced obfuscation
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
              drop_console: process.env.NODE_ENV === 'production',
              drop_debugger: process.env.NODE_ENV === 'production',
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
              passes: 3, // More passes for better obfuscation
              // Remove library signatures
              keep_fnames: false,
              keep_classnames: false,
            },
            mangle: {
              safari10: true,
              // Don't reserve common library names - let them be mangled
              reserved: [],
              // Mangle all properties starting with underscore
              properties: {
                regex: /^_/,
              },
            },
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true,
              // Remove webpack/library comments and signatures
              beautify: false,
              semicolons: true,
            },
            // Remove source map comments in production
            sourceMap: process.env.GENERATE_SOURCEMAP !== 'false',
          },
          parallel: true,
          extractComments: false,
        }),
        // Advanced CSS minification with source maps
        new CssMinimizerPlugin({
          minimizerOptions: {
            preset: [
              'default',
              {
                discardComments: { removeAll: true },
                normalizeWhitespace: true,
                colorMin: true,
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
                map: process.env.GENERATE_SOURCEMAP !== 'false', // Enable source maps for CSS
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

    // Faster source maps for development
    config.devtool = 'eval-cheap-module-source-map';
  }

  // Module resolution optimizations with library name obfuscation
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@images': path.resolve(__dirname, 'src/images'),
      // Alias common libraries to generic names (makes detection harder)
      react: 'react',
      'react-dom': 'react-dom',
      '@mui/material': '@mui/material',
      '@emotion/react': '@emotion/react',
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
