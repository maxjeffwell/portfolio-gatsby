/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require('path');

// Create schema customization to avoid deprecated createTypes in sourceNodes API
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  
  // Define explicit types to prevent warnings from plugins
  const typeDefs = `
    type SitePage implements Node {
      path: String!
      component: String!
      internalComponentName: String!
      componentChunkName: String!
      matchPath: String
      pageContext: JSON
      pluginCreator: SitePlugin
    }

    type SiteFunction implements Node {
      functionRoute: String!
      pluginName: String!
      originalAbsoluteFilePath: String!
      originalRelativeFilePath: String!
      relativeCompiledFilePath: String!
      absoluteCompiledFilePath: String!
      matchPath: String
    }

    type SiteBuildMetadata implements Node {
      buildTime: Date
    }
  `;

  createTypes(typeDefs);
};

// Simplified webpack config to avoid build errors
exports.onCreateWebpackConfig = ({ stage, actions }) => {
  // Only add essential polyfills for browser compatibility
  if (stage === 'build-html' || stage === 'build-javascript') {
    actions.setWebpackConfig({
      resolve: {
        fallback: {
          fs: false,
          path: false,
          crypto: false,
        }
      }
    });
  }
};