/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const path = require('path');

// Simplified webpack configuration for better stability
exports.onCreateWebpackConfig = ({ stage, actions, getConfig, rules }) => {
  const config = getConfig();
  
  // Ensure proper CSS handling to prevent JS being processed as CSS
  if (stage === 'build-javascript' || stage === 'build-html') {
    // Get the existing CSS rule
    const cssRule = config.module.rules.find(
      rule => rule.test && rule.test.toString().includes('css')
    );
    
    if (cssRule) {
      // Exclude Emotion-generated styles from CSS processing
      cssRule.exclude = [/emotion/, /styled-components/];
    }
  }
  
  // Handle SSR issues with MUI components - apply aliases to all stages
  const muiAliases = {
    '@mui/material/Grid': path.join(__dirname, 'src/utils/grid-fallback.js'),
    '@mui/material/Chip': path.join(__dirname, 'src/utils/chip-fallback.js'),
    '@mui/material/Paper': path.join(__dirname, 'src/utils/mui-fallback.js'),
    '@mui/material/styles': path.join(__dirname, 'src/utils/mui-styles-fallback.js'),
    '@mui/material/CssBaseline': path.join(__dirname, 'src/utils/mui-cssbaseline-fallback.js'),
    '@mui/material/utils': path.join(__dirname, 'src/utils/mui-utils-fallback.js'),
    '@mui/system': path.join(__dirname, 'src/utils/mui-system-fallback.js'),
    '@mui/system/colorManipulator': path.join(__dirname, 'src/utils/color-manipulator-fallback.js'),
    '@mui/system/styleFunctionSx': path.join(__dirname, 'src/utils/style-function-sx-fallback.js'),
    '@mui/system/createTheme': path.join(__dirname, 'src/utils/create-theme-fallback.js'),
    '@mui/system/createStyled': path.join(__dirname, 'src/utils/create-styled-fallback.js'),
    '@mui/system/useThemeProps': path.join(__dirname, 'src/utils/use-theme-props-fallback.js'),
    '@mui/system/useMediaQuery': path.join(__dirname, 'src/utils/use-media-query-fallback.js'),
    '@mui/system/Unstable_Grid': path.join(__dirname, 'src/utils/unstable-grid-fallback.js'),
    '@mui/system/DefaultPropsProvider': path.join(__dirname, 'src/utils/default-props-provider-fallback.js'),
    '@mui/system/RtlProvider': path.join(__dirname, 'src/utils/rtl-provider-fallback.js'),
    '@mui/system/InitColorSchemeScript': path.join(__dirname, 'src/utils/init-color-scheme-script-fallback.js'),
    '@mui/system/useThemeWithoutDefault': path.join(__dirname, 'src/utils/use-theme-without-default-fallback.js'),
    '@mui/system/styled': path.join(__dirname, 'src/utils/styled-fallback.js'),
    'react-icons/di': path.join(__dirname, 'src/utils/react-icons-di-fallback.js'),
    'react-icons/fa': path.join(__dirname, 'src/utils/react-icons-fa-fallback.js'),
  };

  if (stage === 'build-html') {
    const webpack = require('webpack');
    
    actions.setWebpackConfig({
      resolve: {
        alias: muiAliases,
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
          "http": false,
          "https": false,
          "zlib": false,
          "fs": false,
          "net": false,
          "tls": false,
          "child_process": false,
          "module": false
        }
      },
      plugins: [
        new webpack.NormalModuleReplacementPlugin(
          /@mui\/system\/colorManipulator/,
          path.join(__dirname, 'src/utils/color-manipulator-fallback.js')
        ),
        new webpack.NormalModuleReplacementPlugin(
          /@mui\/system\/styleFunctionSx/,
          path.join(__dirname, 'src/utils/style-function-sx-fallback.js')
        ),
        new webpack.NormalModuleReplacementPlugin(
          /@mui\/system\/createTheme/,
          path.join(__dirname, 'src/utils/create-theme-fallback.js')
        ),
        new webpack.NormalModuleReplacementPlugin(
          /@mui\/system\/createStyled/,
          path.join(__dirname, 'src/utils/create-styled-fallback.js')
        ),
        new webpack.NormalModuleReplacementPlugin(
          /@mui\/system\/useThemeProps/,
          path.join(__dirname, 'src/utils/use-theme-props-fallback.js')
        ),
        new webpack.NormalModuleReplacementPlugin(
          /@mui\/system\/useMediaQuery/,
          path.join(__dirname, 'src/utils/use-media-query-fallback.js')
        ),
        new webpack.NormalModuleReplacementPlugin(
          /@mui\/system\/Unstable_Grid/,
          path.join(__dirname, 'src/utils/unstable-grid-fallback.js')
        ),
        new webpack.NormalModuleReplacementPlugin(
          /@mui\/system\/DefaultPropsProvider/,
          path.join(__dirname, 'src/utils/default-props-provider-fallback.js')
        ),
        new webpack.NormalModuleReplacementPlugin(
          /@mui\/system\/RtlProvider/,
          path.join(__dirname, 'src/utils/rtl-provider-fallback.js')
        ),
        new webpack.NormalModuleReplacementPlugin(
          /@mui\/system\/InitColorSchemeScript/,
          path.join(__dirname, 'src/utils/init-color-scheme-script-fallback.js')
        ),
        new webpack.NormalModuleReplacementPlugin(
          /@mui\/system\/useThemeWithoutDefault/,
          path.join(__dirname, 'src/utils/use-theme-without-default-fallback.js')
        ),
        new webpack.NormalModuleReplacementPlugin(
          /@mui\/system\/styled/,
          path.join(__dirname, 'src/utils/styled-fallback.js')
        ),
      ],
    });
  }
  
  actions.setWebpackConfig({
    resolve: {
      alias: muiAliases,
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
        "http": false,
        "https": false,
        "zlib": false,
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
