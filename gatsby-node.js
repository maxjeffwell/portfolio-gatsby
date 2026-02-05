/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require('path');

// Create blog post pages from markdown files
exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;

  const blogPostTemplate = path.resolve('./src/templates/blog-post.js');

  const result = await graphql(`
    query {
      allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
        nodes {
          id
          frontmatter {
            title
            date
          }
          fields {
            slug
          }
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panicOnBuild('Error loading blog posts', result.errors);
    return;
  }

  const posts = result.data.allMarkdownRemark.nodes;

  if (posts.length > 0) {
    posts.forEach((post, index) => {
      const previousPost = index === posts.length - 1 ? null : posts[index + 1];
      const nextPost = index === 0 ? null : posts[index - 1];

      createPage({
        path: `/blog${post.fields.slug}`,
        component: blogPostTemplate,
        context: {
          id: post.id,
          slug: post.fields.slug,
          previousPostId: previousPost?.id,
          nextPostId: nextPost?.id,
        },
      });
    });
  }
};

// Create slug field for markdown posts
exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === 'MarkdownRemark') {
    const fileNode = getNode(node.parent);
    const filename = path.basename(fileNode.relativePath, '.md');
    // Strip date prefix from filename: 2025-12-04-my-post -> my-post
    const slug = '/' + filename.replace(/^\d{4}-\d{2}-\d{2}-/, '') + '/';

    createNodeField({
      node,
      name: 'slug',
      value: slug,
    });
  }
};

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

// Remove test/development pages from production builds
exports.onCreatePage = ({ page, actions }) => {
  const { deletePage } = actions;

  // Delete test pages in production
  if (process.env.NODE_ENV === 'production') {
    const testPagePatterns = ['/test-form', '/test-form-success'];

    if (testPagePatterns.some(pattern => page.path.startsWith(pattern))) {
      deletePage(page);
    }
  }
};