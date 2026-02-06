import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import svgr from 'vite-plugin-svgr';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: [
    '../src/docs/**/*.mdx',
    '../src/components/**/*.stories.@(js|jsx)',
  ],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
  ],
  framework: '@storybook/react-vite',

  // Use the non-Babel react-docgen parser so the react-docgen-plugin
  // never loads babel-preset-gatsby (which requires Gatsby's .cache).
  typescript: {
    reactDocgen: 'react-docgen',
  },

  // Storybook Composition — reference the Applications Showcase
  refs: {
    applications: {
      title: 'Applications Showcase',
      url: 'https://showcase.el-jefe.me',
    },
  },

  async viteFinal(config) {
    // Prevent Vite from copying Gatsby's public/ into the Storybook build.
    // Gatsby uses public/ as its build output, not as a static assets dir,
    // so Storybook must not inherit it as publicDir.
    config.publicDir = false;

    // Alias Gatsby modules to our mock implementations
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      gatsby: resolve(__dirname, '__mocks__/gatsby.js'),
      'gatsby-plugin-image': resolve(__dirname, '__mocks__/gatsby-plugin-image.js'),
    };

    config.plugins = config.plugins || [];

    // Gatsby uses JSX in .js files — teach Vite's esbuild to handle that
    const { transformWithEsbuild } = await import('vite');
    config.plugins.push({
      name: 'treat-js-as-jsx',
      async transform(code, id) {
        if (/node_modules/.test(id) || !id.endsWith('.js')) return null;
        return transformWithEsbuild(code, id, { loader: 'jsx' });
      },
    });

    // Add SVGR plugin so .svg imports become React components
    // (mirrors what gatsby-plugin-react-svg does in Gatsby)
    config.plugins.push(
      svgr({
        svgrOptions: {
          icon: true,
        },
        include: '**/*.svg',
      })
    );

    // Allow .js files to contain JSX for dependency pre-bundling
    config.optimizeDeps = config.optimizeDeps || {};
    config.optimizeDeps.esbuildOptions = config.optimizeDeps.esbuildOptions || {};
    config.optimizeDeps.esbuildOptions.loader = {
      ...config.optimizeDeps.esbuildOptions.loader,
      '.js': 'jsx',
    };

    return config;
  },
};

export default config;
