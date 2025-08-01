/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require('path');

// onCreateWebpackConfig still works in Gatsby 5, just used differently
exports.onCreateWebpackConfig = ({ stage, actions }) => {
  const config = {
    resolve: {
      fallback: {
        "stream": require.resolve("stream-browserify"),
        "path": require.resolve("path-browserify"),
        "fs": false,
        "http": require.resolve("stream-http"),
        "url": require.resolve("url/"),
        "https": require.resolve("https-browserify"),
        "zlib": require.resolve("browserify-zlib"),
        "crypto": require.resolve("crypto-browserify"),
        "buffer": require.resolve("buffer/"),
        "process": require.resolve("process/browser"),
        "util": require.resolve("util/"),
        "assert": require.resolve("assert/"),
        "os": require.resolve("os-browserify/browser"),
        "querystring": require.resolve("querystring-es3"),
        "object.assign/polyfill": require.resolve("object.assign/polyfill"),
      },
      alias: {
        "object.assign/polyfill": require.resolve("object.assign/polyfill"),
      }
    },
    plugins: [
      new (require('webpack')).ProvidePlugin({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer'],
        TextEncoder: [require.resolve('./src/polyfills/textencoder-inline.js'), 'TextEncoder'],
        TextDecoder: [require.resolve('./src/polyfills/textencoder-inline.js'), 'TextDecoder'],
      }),
    ],
  };

  // Add DefinePlugin to ensure TextEncoder is available as a global
  // Only define for browser environment, avoid SSR issues
  if (stage === 'build-javascript' || stage === 'develop') {
    config.plugins.push(
      new (require('webpack')).DefinePlugin({
        'global.TextEncoder': 'typeof window !== "undefined" ? window.TextEncoder : undefined',
        'global.TextDecoder': 'typeof window !== "undefined" ? window.TextDecoder : undefined',
      })
    );
  }

  // Ensure proper optimization and minification for production builds
  if (stage === 'build-javascript') {
    config.optimization = {
      minimize: true,
      minimizer: [
        new (require('terser-webpack-plugin'))({
          terserOptions: {
            parse: {
              ecma: 8,
            },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2,
              drop_console: true, // Remove console.logs in production
              drop_debugger: true,
              pure_funcs: ['console.log', 'console.info', 'console.debug'],
            },
            mangle: {
              safari10: true,
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
      ],
    };
  }

  actions.setWebpackConfig(config);
};