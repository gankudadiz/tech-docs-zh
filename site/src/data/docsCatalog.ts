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
