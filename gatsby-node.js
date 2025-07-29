/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const TerserPlugin = require('terser-webpack-plugin');

// Minimal webpack configuration
exports.onCreateWebpackConfig = ({ stage, actions, getConfig }) => {
  const config = getConfig();

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