import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'K8s Platform Architecture',
  tagline: 'Kubernetes cluster architecture, GitOps pipelines, and infrastructure documentation',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://el-jefe.me',
  baseUrl: '/docs/',

  organizationName: 'maxjeffwell',
  projectName: 'portfolio-gatsby',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],

  plugins: [
    'docusaurus-plugin-sass',
    'docusaurus-plugin-image-zoom',
    [
      require.resolve('@cmfcmf/docusaurus-search-local'),
      {
        indexDocs: true,
        indexBlog: false,
      },
    ],
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.scss',
        },
      }),
    ],
  ],

  /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
  themeConfig: {
    zoom: {
      selector: '.markdown :not(em) > img',
      background: {
        light: 'rgb(255, 255, 255)',
        dark: 'rgb(50, 50, 50)'
      },
      config: {}
    },
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'K8s Platform Docs',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://el-jefe.me',
          label: 'Portfolio',
          position: 'right',
        },
        {
          href: 'https://el-jefe.me/storybook',
          label: 'Storybook',
          position: 'right',
        },
        {
          href: 'https://showcase.el-jefe.me',
          label: 'App Showcase',
          position: 'right',
        },
        {
          href: 'https://github.com/maxjeffwell',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            { label: 'Architecture Overview', to: '/' },
            { label: 'Kubernetes', to: '/kubernetes/cluster-topology' },
            { label: 'CI/CD', to: '/ci-cd/github-actions' },
          ],
        },
        {
          title: 'Platform',
          items: [
            { label: 'Portfolio', href: 'https://el-jefe.me' },
            { label: 'Storybook', href: 'https://el-jefe.me/storybook' },
            { label: 'App Showcase', href: 'https://showcase.el-jefe.me' },
          ],
        },
        {
          title: 'Source',
          items: [
            { label: 'GitHub', href: 'https://github.com/maxjeffwell' },
            { label: 'Docker Hub', href: 'https://hub.docker.com/u/maxjeffwell' },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Jeff Maxwell. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'yaml', 'json', 'docker'],
    },
    mermaid: {
      theme: { light: 'default', dark: 'dark' },
    },
  },
};

export default config;
