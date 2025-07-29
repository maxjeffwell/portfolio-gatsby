/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const TerserPlugin = require('terser-webpack-plugin');

// Configure webpack to completely exclude MUI from processing and add Node.js polyfills
exports.onCreateWebpackConfig = ({ stage, actions, getConfig }) => {
  const config = getConfig();
  const webpack = require('webpack');

  // Node.js polyfills for webpack 5 compatibility
  const nodePolyfills = {
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
      // Provide global process and Buffer
      new webpack.ProvidePlugin({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer'],
        TextEncoder: ['fastestsmallesttextencoderdecoder', 'TextEncoder'],
        TextDecoder: ['fastestsmallesttextencoderdecoder', 'TextDecoder'],
      }),
    ],
  };

  // Comprehensive MUI exclusion configuration
  const muiExclusionConfig = {
    externals: {
      // Mark all MUI packages as external - they won't be bundled at all
      '@mui/material': 'commonjs @mui/material',
      '@mui/icons-material': 'commonjs @mui/icons-material',
      '@mui/system': 'commonjs @mui/system',
      '@mui/styled-engine': 'commonjs @mui/styled-engine',
      '@mui/styled-engine-sc': 'commonjs @mui/styled-engine-sc',
      '@mui/lab': 'commonjs @mui/lab',
      '@mui/x-data-grid': 'commonjs @mui/x-data-grid',
      '@mui/x-date-pickers': 'commonjs @mui/x-date-pickers',
    },
    plugins: [
      // Completely ignore any MUI imports during module resolution
      new webpack.IgnorePlugin({
        resourceRegExp: /^@mui/,
      }),
      // Replace any MUI imports that somehow get through
      new webpack.NormalModuleReplacementPlugin(
        /^@mui/,
        require.resolve('./src/utils/empty-module.js')
      ),
      ...nodePolyfills.plugins,
    ],
    resolve: {
      ...nodePolyfills.resolve,
    },
  };

  // Apply configuration to all stages
  actions.setWebpackConfig(muiExclusionConfig);

  // Disable problematic optimizations for SSR stages
  if (stage === 'build-html') {
    actions.setWebpackConfig({
      optimization: {
        minimize: false,
      },
      plugins: [
        // Define TextEncoder as a mock for SSR bundle
        new webpack.DefinePlugin({
          'typeof TextEncoder': '"undefined"',
          'typeof TextDecoder': '"undefined"',
          'global.TextEncoder': 'undefined',
          'global.TextDecoder': 'undefined',
        }),
      ],
    });
  }

  if (stage === 'build-javascript') {
    // Override the entire optimization to prevent CSS processing issues
    config.optimization.minimizer = [
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
    ];
    
    // Replace the webpack config entirely
    actions.replaceWebpackConfig(config);
  }

  if (stage === 'develop') {
    actions.setWebpackConfig({
      devtool: 'eval-cheap-module-source-map',
    });
  }
};