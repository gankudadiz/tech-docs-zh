import fs from 'node:fs';
import path from 'node:path';

const siteRoot = 'site/docs/filament/v4.x';
const contentRoot = 'content/filament/v4.x/zh-cn/docs';

const sections = [
  {
    label: '介绍',
    collapsed: false,
    items: [
      ['introduction/overview', '什么是 Filament？'],
      ['introduction/installation', '安装'],
      ['introduction/ai', 'AI 辅助开发'],
      ['introduction/optimizing-local-development', '优化本地开发'],
    ],
  },
  {
    label: '指南',
    collapsed: false,
    items: [
      ['getting-started', '快速入门'],
    ],
  },
  {
    label: '资源',
    collapsed: false,
    items: [
      ['resources/overview', '概述'],
      ['resources/listing-records', '列出记录'],
      ['resources/creating-records', '创建记录'],
      ['resources/editing-records', '编辑记录'],
      ['resources/viewing-records', '查看记录'],
      ['resources/deleting-records', '删除记录'],
      ['resources/managing-relationships', '管理关联关系'],
      ['resources/nesting', '嵌套资源'],
      ['resources/singular', '单数资源'],
      ['resources/global-search', '全局搜索'],
      ['resources/widgets', '在资源页面中使用小部件'],
      ['resources/custom-pages', '自定义资源页面'],
      ['resources/code-quality-tips', '代码质量建议'],
    ],
  },
  {
    label: '表格',
    collapsed: true,
    items: [
      ['tables/overview', '概述'],
      {
        label: '列',
        collapsed: true,
        items: [
          ['tables/columns/overview', '概述'],
          ['tables/columns/text', '文本列'],
          ['tables/columns/icon', '图标列'],
          ['tables/columns/image', '图片列'],
          ['tables/columns/color', '颜色列'],
          ['tables/columns/select', '选择列'],
          ['tables/columns/toggle', '开关列'],
          ['tables/columns/text-input', '文本输入列'],
          ['tables/columns/checkbox', '复选框列'],
          ['tables/columns/custom-columns', '自定义列'],
        ],
      },
      {
        label: '过滤器',
        collapsed: true,
        items: [
          ['tables/filters/overview', '概述'],
          ['tables/filters/select', '选择过滤器'],
          ['tables/filters/ternary', '三态过滤器'],
          ['tables/filters/query-builder', '查询构建器'],
          ['tables/filters/custom', '自定义过滤器'],
          ['tables/filters/layout', '过滤器布局'],
        ],
      },
      ['tables/actions', '操作'],
      ['tables/layout', '布局'],
      ['tables/summaries', '汇总'],
      ['tables/grouping', '分组行'],
      ['tables/empty-state', '空状态'],
      ['tables/custom-data', '自定义数据'],
    ],
  },
  {
    label: '模式',
    collapsed: true,
    items: [
      ['schemas/overview', '概述'],
      ['schemas/layouts', '布局'],
      ['schemas/sections', '区块'],
      ['schemas/tabs', '标签页'],
      ['schemas/wizards', '向导'],
      ['schemas/callouts', '提示框'],
      ['schemas/empty-states', '空状态'],
      ['schemas/primes', '基础组件'],
      ['schemas/custom-components', '自定义组件'],
    ],
  },
  {
    label: '表单',
    collapsed: true,
    items: [
      ['forms/overview', '概述'],
      ['forms/text-input', '文本输入'],
      ['forms/select', '选择器'],
      ['forms/checkbox', '复选框'],
      ['forms/toggle', '开关'],
      ['forms/checkbox-list', '复选框列表'],
      ['forms/radio', '单选框'],
      ['forms/date-time-picker', '日期时间选择器'],
      ['forms/file-upload', '文件上传'],
      ['forms/rich-editor', '富文本编辑器'],
      ['forms/markdown-editor', 'Markdown 编辑器'],
      ['forms/repeater', '重复器'],
      ['forms/builder', '构建器'],
      ['forms/tags-input', '标签输入'],
      ['forms/textarea', '文本域'],
      ['forms/key-value', '键值'],
      ['forms/color-picker', '颜色选择器'],
      ['forms/toggle-buttons', '开关按钮组'],
      ['forms/slider', '滑块'],
      ['forms/code-editor', '代码编辑器'],
      ['forms/hidden', '隐藏字段'],
      ['forms/custom-fields', '自定义字段'],
      ['forms/validation', '验证'],
    ],
  },
  {
    label: '信息列表',
    collapsed: true,
    items: [
      ['infolists/overview', '概述'],
      ['infolists/text-entry', '文本条目'],
      ['infolists/icon-entry', '图标条目'],
      ['infolists/image-entry', '图片条目'],
      ['infolists/color-entry', '颜色条目'],
      ['infolists/code-entry', '代码条目'],
      ['infolists/key-value-entry', '键值条目'],
      ['infolists/repeatable-entry', '可重复条目'],
      ['infolists/custom-entries', '自定义条目'],
    ],
  },
  {
    label: '操作',
    collapsed: true,
    items: [
      ['actions/overview', '概述'],
      ['actions/modals', '模态框'],
      ['actions/grouping-actions', '操作分组'],
      ['actions/create', '创建操作'],
      ['actions/edit', '编辑操作'],
      ['actions/view', '查看操作'],
      ['actions/delete', '删除操作'],
      ['actions/replicate', '复制操作'],
      ['actions/force-delete', '强制删除操作'],
      ['actions/restore', '恢复操作'],
      ['actions/import', '导入操作'],
      ['actions/export', '导出操作'],
    ],
  },
  {
    label: '通知',
    collapsed: true,
    items: [
      ['notifications/overview', '概述'],
      ['notifications/database-notifications', '数据库通知'],
      ['notifications/broadcast-notifications', '广播通知'],
    ],
  },
  {
    label: '小部件',
    collapsed: true,
    items: [
      ['widgets/overview', '概述'],
      ['widgets/stats-overview', '统计概览小部件'],
      ['widgets/charts', '图表小部件'],
    ],
  },
  {
    label: '配置',
    collapsed: true,
    items: [
      ['panel-configuration', '面板配置'],
    ],
  },
  {
    label: '导航',
    collapsed: true,
    items: [
      ['navigation/overview', '概述'],
      ['navigation/custom-pages', '自定义页面'],
      ['navigation/user-menu', '用户菜单'],
      ['navigation/clusters', '集群'],
    ],
  },
  {
    label: '用户',
    collapsed: true,
    items: [
      ['users/overview', '概述'],
      ['users/multi-factor-authentication', '多因素认证'],
      ['users/tenancy', '多租户'],
    ],
  },
  {
    label: '样式',
    collapsed: true,
    items: [
      ['styling/overview', '概述'],
      ['styling/css-hooks', 'CSS 钩子'],
      ['styling/colors', '颜色'],
      ['styling/icons', '图标'],
    ],
  },
  {
    label: '高级',
    collapsed: true,
    items: [
      ['advanced/render-hooks', '渲染钩子'],
      ['advanced/assets', '注册资源'],
      ['advanced/enums', '枚举技巧'],
      ['advanced/file-generation', '文件生成'],
      ['advanced/modular-architecture', '模块化架构（DDD）'],
      ['advanced/security', '安全'],
    ],
  },
  {
    label: '测试',
    collapsed: true,
    items: [
      ['testing/overview', '概述'],
      ['testing/testing-resources', '测试资源'],
      ['testing/testing-tables', '测试表格'],
      ['testing/testing-schemas', '测试模式'],
      ['testing/testing-actions', '测试操作'],
      ['testing/testing-notifications', '测试通知'],
    ],
  },
  {
    label: '插件',
    collapsed: true,
    items: [
      ['plugins/getting-started', '快速入门'],
      ['plugins/panel-plugins', '插件开发'],
      ['plugins/building-a-panel-plugin', '构建面板插件'],
      ['plugins/building-a-standalone-plugin', '构建独立插件'],
      ['plugins/configurable-resources-and-pages', '可配置资源和页面'],
    ],
  },
  {
    label: '组件',
    collapsed: true,
    items: [
      ['components/overview', '概述'],
      ['components/action', '在 Livewire 组件中渲染操作'],
      ['components/form', '在 Blade 视图中渲染表单'],
      ['components/infolist', '在 Blade 视图中渲染信息列表'],
      ['components/notifications', '在面板外渲染通知'],
      ['components/schema', '在 Blade 视图中渲染模式'],
      ['components/table', '在 Blade 视图中渲染表格'],
      ['components/widget', '在 Blade 视图中渲染小部件'],
      ['components/avatar', 'Avatar Blade 组件'],
      ['components/badge', 'Badge Blade 组件'],
      ['components/breadcrumbs', 'Breadcrumbs Blade 组件'],
      ['components/button', 'Button Blade 组件'],
      ['components/callout', 'Callout Blade 组件'],
      ['components/checkbox', 'Checkbox Blade 组件'],
      ['components/dropdown', 'Dropdown Blade 组件'],
      ['components/empty-state', 'Empty State Blade 组件'],
      ['components/fieldset', 'Fieldset Blade 组件'],
      ['components/icon-button', 'Icon Button Blade 组件'],
      ['components/input-wrapper', 'Input Wrapper Blade 组件'],
      ['components/input', 'Input Blade 组件'],
      ['components/link', 'Link Blade 组件'],
      ['components/loading-indicator', 'Loading Indicator Blade 组件'],
      ['components/modal', 'Modal Blade 组件'],
      ['components/pagination', 'Pagination Blade 组件'],
      ['components/section', 'Section Blade 组件'],
      ['components/select', 'Select Blade 组件'],
      ['components/tabs', 'Tabs Blade 组件'],
    ],
  },
  {
    label: '部署',
    collapsed: true,
    items: [
      ['deployment', '部署到生产环境'],
    ],
  },
  {
    label: '升级',
    collapsed: true,
    items: [
      ['upgrade-guide', '升级指南'],
    ],
  },
];

const flattenItems = (items) => items.flatMap((item) => Array.isArray(item) ? [item] : flattenItems(item.items));

const placeholder = (id, title) => `---\ntitle: ${title}\n---\n\n# ${title}\n\n:::info 翻译中\n本文档已按 Filament 4.x 官方侧边栏结构接入，正文尚未完成翻译。\n:::\n\n[查看官方英文文档](https://filamentphp.com/docs/4.x/${id})\n`;

for (const section of sections) {
  for (const [id, title] of flattenItems(section.items)) {
    for (const root of [siteRoot, contentRoot]) {
      const filePath = path.join(root, `${id}.md`);
      if (fs.existsSync(filePath)) {
        continue;
      }

      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, placeholder(id, title));
    }
  }
}

const renderItem = (item, indent = 8) => {
  const spaces = ' '.repeat(indent);

  if (Array.isArray(item)) {
    return `${spaces}'filament/v4.x/${item[0]}',`;
  }

  const childItems = item.items.map((child) => renderItem(child, indent + 4)).join('\n');

  return `${spaces}{\n${spaces}  type: 'category',\n${spaces}  label: '${item.label}',\n${spaces}  collapsed: ${item.collapsed},\n${spaces}  items: [\n${childItems}\n${spaces}  ],\n${spaces}},`;
};

const sidebarSections = sections.map((section) => renderItem(section, 4)).join('\n');

const sidebar = `import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';\n\n// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)\n\n/**\n * Creating a sidebar enables you to:\n - create an ordered group of docs\n - render a sidebar for each doc of that group\n - provide next/previous navigation\n\n The sidebars can be generated from the filesystem, or explicitly defined here.\n\n Create as many sidebars as you want.\n */\nconst sidebars: SidebarsConfig = {\n  filamentV4Sidebar: [\n${sidebarSections}\n  ],\n};\n\nexport default sidebars;\n`;

fs.writeFileSync('site/sidebars.ts', sidebar);

const total = sections.reduce((count, section) => count + flattenItems(section.items).length, 0);
console.log(`Generated Filament v4 sidebar with ${total} docs.`);
