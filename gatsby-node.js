/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

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
      // Advanced minimization
      minimize: true,
      usedExports: true,
      sideEffects: false,
    };
  }

  // Replace react-icons with a dummy module during SSR
  if (stage === 'build-html') {
    const webpack = require('webpack');
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(/react-icons/, path.resolve(__dirname, 'src/utils/dummy-react-icons.js'))
    );
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
exports.onPostBuild = () => {
  console.log('🚀 Build completed with optimizations');
  
  if (process.env.ANALYZE === 'true') {
    console.log('📊 Bundle analysis report generated at ./public/bundle-analyzer-report.html');
  }
};
