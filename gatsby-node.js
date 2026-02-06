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

    type ClusterMetrics implements Node {
      totalNodes: Int
      totalPods: Int
      cpuUsage: Float
      memoryUsage: Float
    }

    type ArgocdApplication implements Node {
      appName: String!
      healthStatus: String
      syncStatus: String
      namespace: String
    }

    type GitHubDeployment implements Node {
      runId: String!
      name: String
      repoDisplayName: String
      conclusion: String
      htmlUrl: String
      createdAt: Date @dateformat
    }
  `;

  createTypes(typeDefs);
};

// Source live K8s cluster data from the devops-portfolio-manager API
const CLUSTER_API = 'https://podrick.el-jefe.me/devops-api';

exports.sourceNodes = async ({ actions, createNodeId, createContentDigest, reporter }) => {
  const { createNode } = actions;

  // Fetch cluster metrics from Prometheus
  try {
    const cluster = await fetch(`${CLUSTER_API}/api/prometheus/cluster/overview`).then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    });
    createNode({
      totalNodes: parseInt(cluster.totalNodes, 10) || 0,
      totalPods: parseInt(cluster.totalPods, 10) || 0,
      cpuUsage: parseFloat(cluster.cpuUsage) || 0,
      memoryUsage: parseFloat(cluster.memoryUsage) || 0,
      id: createNodeId('cluster-metrics'),
      internal: {
        type: 'ClusterMetrics',
        contentDigest: createContentDigest(cluster),
      },
    });
    reporter.info(`Sourced cluster metrics: ${cluster.totalNodes} nodes, ${cluster.totalPods} pods`);
  } catch (e) {
    reporter.warn(`[cluster] Failed to fetch cluster metrics: ${e.message}`);
  }

  // Fetch ArgoCD application status
  try {
    const data = await fetch(`${CLUSTER_API}/api/argocd/applications`).then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    });
    const apps = Array.isArray(data) ? data : data.items || [];
    apps.forEach((app) => {
      const name = app.metadata?.name || 'unknown';
      createNode({
        appName: name,
        healthStatus: app.status?.health?.status || 'Unknown',
        syncStatus: app.status?.sync?.status || 'Unknown',
        namespace: app.metadata?.namespace || 'default',
        id: createNodeId(`argocd-app-${name}`),
        internal: {
          type: 'ArgocdApplication',
          contentDigest: createContentDigest(app),
        },
      });
    });
    reporter.info(`Sourced ${apps.length} ArgoCD applications`);
  } catch (e) {
    reporter.warn(`[cluster] Failed to fetch ArgoCD applications: ${e.message}`);
  }

  // Fetch recent GitHub Actions deployments
  try {
    const data = await fetch(`${CLUSTER_API}/api/github/runs/recent`).then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    });
    const runs = data.workflow_runs || [];
    runs.forEach((run) => {
      createNode({
        runId: String(run.id),
        name: run.name,
        repoDisplayName: run.repo_display_name || run.repository?.name || '',
        conclusion: run.conclusion || 'pending',
        htmlUrl: run.html_url || '',
        createdAt: run.created_at,
        id: createNodeId(`github-deployment-${run.id}`),
        internal: {
          type: 'GitHubDeployment',
          contentDigest: createContentDigest(run),
        },
      });
    });
    reporter.info(`Sourced ${runs.length} recent deployments`);
  } catch (e) {
    reporter.warn(`[cluster] Failed to fetch GitHub deployments: ${e.message}`);
  }
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
    // Match both with and without trailing slashes
    const testPagePaths = [
      '/test-form/',
      '/test-form',
      '/test-form-success/',
      '/test-form-success',
    ];

    if (testPagePaths.includes(page.path)) {
      deletePage(page);
    }
  }
};