/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

// Simplified webpack configuration for better stability
exports.onCreateWebpackConfig = ({ stage, actions, getConfig }) => {
  const config = getConfig();
  
  // Handle SSR issues with MUI components
  if (stage === 'build-html') {
    actions.setWebpackConfig({
      resolve: {
        alias: {
          '@mui/material/Grid': require.resolve('./src/utils/grid-fallback.js'),
          '@mui/material/Chip': require.resolve('./src/utils/chip-fallback.js'),
          '@mui/material/styles': require.resolve('./src/utils/mui-styles-fallback.js'),
          '@mui/material/CssBaseline': require.resolve('./src/utils/mui-cssbaseline-fallback.js'),
          '@mui/material/utils': require.resolve('./src/utils/mui-utils-fallback.js'),
          'react-icons/di': require.resolve('./src/utils/react-icons-di-fallback.js'),
          'react-icons/fa': require.resolve('./src/utils/react-icons-fa-fallback.js'),
        },
      },
    });
  }
  
  actions.setWebpackConfig({
    resolve: {
      fallback: {
        "os": require.resolve("os-browserify/browser"),
        "crypto": require.resolve("crypto-browserify"),
        "path": require.resolve("path-browserify"),
        "stream": require.resolve("stream-browserify"),
        "url": require.resolve("url"),
        "util": require.resolve("util"),
        "querystring": require.resolve("querystring-es3"),
        "buffer": require.resolve("buffer"),
        "assert": require.resolve("assert"),
        "events": require.resolve("events"),
        "vm": require.resolve("vm-browserify"),
        "fs": false,
        "net": false,
        "tls": false,
        "child_process": false,
        "module": false
      }
    },
    module: {
      rules: [
        {
          test: /scripts\//,
          use: 'ignore-loader'
        }
      ]
    }
  });

  if (stage === 'build-javascript') {
    actions.setWebpackConfig({
      // Disable source maps in production
      devtool: false,

      optimization: {
        minimize: true,
        minimizer: [
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
          }),
          new CssMinimizerPlugin(),
        ],
        // Simple chunk splitting
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            vendor: {
              name: 'vendor',
              test: /node_modules/,
              priority: 20,
            },
            common: {
              name: 'common',
              minChunks: 2,
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },
          },
        },
      },
    });
  }

  if (stage === 'develop') {
    actions.setWebpackConfig({
      devtool: 'eval-cheap-module-source-map',
    });
  }
};
