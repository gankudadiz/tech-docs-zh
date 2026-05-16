import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: '中文技术文档站',
  tagline: '本地优先的中文技术文档阅读站',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'http://127.0.0.1:48763',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'local',
  projectName: 'tech-docs-zh',

  onBrokenLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: '中文技术文档站',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: '文档',
        },
        {
          type: 'dropdown',
          label: '源文档',
          position: 'right',
          items: [
            {
              label: 'Filament v4.x',
              href: 'https://github.com/filamentphp/filament/tree/4.x/docs',
            },
          ],
        },
      ],
    },
    footer: {
      style: 'light',
      links: [
        {
          title: '已收录产品',
          items: [
            {
              label: 'Filament v4.x',
              to: '/docs/filament/v4.x/introduction/overview',
            },
          ],
        },
        {
          title: '项目',
          items: [
            {
              label: '项目文档',
              href: '/docs/',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} 中文技术文档站。非官方翻译项目，保留原文来源信息。`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
