import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

import {docsProducts, getProductDefaultVersion} from './src/data/docsCatalog';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const productNavItems = docsProducts.map((product) => {
  const defaultVersion = getProductDefaultVersion(product);

  return {
    type: 'docSidebar' as const,
    sidebarId: defaultVersion.sidebarId,
    position: 'left' as const,
    label: product.name,
  };
});

const versionItems = docsProducts.flatMap((product) =>
  product.versions.map((version) => ({
    label: `${product.name} ${version.label}`,
    to: version.docsPath,
    activeBasePath: version.docsBasePath,
  })),
);

const sourceItems = docsProducts.map((product) => {
  const defaultVersion = getProductDefaultVersion(product);

  return {
    label: defaultVersion.sourceLabel,
    href: defaultVersion.docsHref ?? defaultVersion.sourceHref,
  };
});

const footerProductItems = docsProducts.map((product) => {
  const defaultVersion = getProductDefaultVersion(product);

  return {
    label: product.name,
    to: defaultVersion.docsPath,
  };
});

const config: Config = {
  title: '中文技术文档站',
  tagline: '本地优先的中文技术文档阅读站',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // GitHub Pages 部署配置，本地开发时使用 localhost
  url: process.env.CI ? 'https://gankudadiz.github.io' : 'http://127.0.0.1:48763',
  // GitHub Pages 需要 /repo-name/ 前缀，本地开发使用 /
  baseUrl: process.env.CI ? '/tech-docs-zh/' : '/',

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

  plugins: [
    function prismBladeLanguagePlugin() {
      return {
        name: 'prism-blade-language',
        getClientModules() {
          return ['./src/prism/blade'];
        },
      };
    },
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
        ...productNavItems,
        {
          type: 'dropdown',
          label: '版本',
          position: 'left',
          items: versionItems,
        },
        {
          type: 'dropdown',
          label: '源文档',
          position: 'right',
          items: sourceItems,
        },
      ],
    },
    footer: {
      style: 'light',
      links: [
        {
          title: '已收录产品',
          items: footerProductItems,
        },
        {
          title: '项目',
          items: [
            {
              label: '项目文档',
              href: '/',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} 中文技术文档站。非官方翻译项目，保留原文来源信息。`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['php'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
