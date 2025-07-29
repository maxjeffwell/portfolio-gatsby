/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require('path');

// onCreateWebpackConfig still works in Gatsby 5, just used differently
exports.onCreateWebpackConfig = ({ stage, actions }) => {
  actions.setWebpackConfig({
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
        TextEncoder: ['fastestsmallesttextencoderdecoder', 'TextEncoder'],
        TextDecoder: ['fastestsmallesttextencoderdecoder', 'TextDecoder'],
      }),
    ],
  });
};