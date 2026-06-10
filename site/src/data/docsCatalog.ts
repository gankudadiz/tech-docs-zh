export type DocsVersion = {
  label: string;
  slug: string;
  status: string;
  pages: string;
  stage: string;
  docsPath: string;
  docsBasePath: string;
  sourceHref: string;
  sourceLabel: string;
  sidebarId: string;
  docsHref?: string;
};

export type DocsProduct = {
  id: string;
  name: string;
  description: string;
  defaultVersionSlug: string;
  versions: DocsVersion[];
};

export const docsProducts: DocsProduct[] = [
  {
    id: 'livewire',
    name: 'Livewire',
    description:
      'Laravel 生态中用于构建动态界面的基础全栈组件框架。',
    defaultVersionSlug: 'v3.x',
    versions: [
      {
        label: 'v3.x',
        slug: 'v3.x',
        status: '已完成',
        pages: '53 个站点页面',
        stage: '翻译完成',
        docsPath: '/docs/livewire/v3.x/quickstart',
        docsBasePath: '/docs/livewire/v3.x',
        sourceHref: 'https://github.com/livewire/livewire/tree/v3.8.0/docs',
        sourceLabel: 'Livewire v3.x',
        sidebarId: 'livewireV3Sidebar',
        docsHref: 'https://livewire.laravel.com/docs/3.x/quickstart',
      },
    ],
  },
  {
    id: 'alpine',
    name: 'Alpine.js',
    description:
      '轻量级声明式 JavaScript 框架，直接在 HTML 中实现响应式交互。',
    defaultVersionSlug: 'v3.x',
    versions: [
      {
        label: 'v3.x',
        slug: 'v3.x',
        status: '翻译完成',
        pages: '50 个站点页面',
        stage: '翻译完成',
        docsPath: '/docs/alpine/v3.x/start-here',
        docsBasePath: '/docs/alpine/v3.x',
        sourceHref: 'https://github.com/alpinejs/alpine/tree/main/packages/docs/src/en',
        sourceLabel: 'Alpine.js v3.x',
        sidebarId: 'alpineV3Sidebar',
        docsHref: 'https://alpinejs.dev/start-here',
      },
    ],
  },
  {
    id: 'filament',
    name: 'Filament',
    description:
      'Laravel 生态的 Server-Driven UI 框架文档。',
    defaultVersionSlug: 'v4.x',
    versions: [
      {
        label: 'v4.x',
        slug: 'v4.x',
        status: '翻译完成',
        pages: '32 个站点页面',
        stage: '锚点修复完成',
        docsPath: '/docs/filament/v4.x/introduction/overview',
        docsBasePath: '/docs/filament/v4.x',
        sourceHref: 'https://github.com/filamentphp/filament/tree/4.x/docs',
        sourceLabel: 'Filament v4.x',
        sidebarId: 'filamentV4Sidebar',
        docsHref: 'https://filamentphp.com/docs/4.x/getting-started',
      },
    ],
  },
  {
    id: 'flight',
    name: 'Flight',
    description:
      '轻量级、可扩展的 PHP 微框架文档。',
    defaultVersionSlug: 'v3.x',
    versions: [
      {
        label: 'v3.x',
        slug: 'v3.x',
        status: '翻译完成',
        pages: '57 个站点页面',
        stage: '翻译完成',
        docsPath: '/docs/flight/v3.x/learn/',
        docsBasePath: '/docs/flight/v3.x',
        sourceHref: 'https://github.com/flightphp/docs/tree/master/content/v3/en',
        sourceLabel: 'Flight v3.x',
        sidebarId: 'flightV3Sidebar',
        docsHref: 'https://docs.flightphp.com/en/v3',
      },
    ],
  },
  {
    id: 'marktext',
    name: 'MarkText',
    description:
      '免费开源的 Markdown 编辑器，支持实时预览、多种编辑模式和主题。',
    defaultVersionSlug: 'v1.x',
    versions: [
      {
        label: 'v1.x',
        slug: 'v1.x',
        status: '翻译中',
        pages: '35 个站点页面',
        stage: '接入中',
        docsPath: '/docs/marktext/v1.x/end-user/BASICS',
        docsBasePath: '/docs/marktext/v1.x',
        sourceHref: 'https://github.com/marktext/marktext/tree/develop/packages/website/content/docs',
        sourceLabel: 'MarkText v1.x',
        sidebarId: 'marktextV1Sidebar',
        docsHref: 'https://marktext.github.io/marktext/',
      },
    ],
  },
];

export function getProductDefaultVersion(product: DocsProduct): DocsVersion {
  return (
    product.versions.find((version) => version.slug === product.defaultVersionSlug) ??
    product.versions[0]
  );
}

export function getProductById(productId: string): DocsProduct | undefined {
  return docsProducts.find((product) => product.id === productId);
}

export function getVersionBySlug(
  product: DocsProduct,
  versionSlug: string,
): DocsVersion | undefined {
  return product.versions.find((version) => version.slug === versionSlug);
}

export function getVersionForPath(
  product: DocsProduct,
  pathname: string,
): DocsVersion | undefined {
  return product.versions.find((version) =>
    pathname === version.docsBasePath || pathname.startsWith(`${version.docsBasePath}/`),
  );
}

export function buildVersionPath(
  product: DocsProduct,
  targetVersion: DocsVersion,
  pathname: string,
): string {
  const activeVersion = getVersionForPath(product, pathname);

  if (!activeVersion) {
    return targetVersion.docsPath;
  }

  const suffix = pathname.slice(activeVersion.docsBasePath.length);

  if (!suffix || suffix === '/') {
    return targetVersion.docsPath;
  }

  return `${targetVersion.docsBasePath}${suffix}`;
}
