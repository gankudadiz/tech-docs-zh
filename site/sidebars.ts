import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  filamentV4Sidebar: [
    {
      type: 'category',
      label: '介绍',
      collapsed: false,
      items: [
        'filament/v4.x/introduction/overview',
        'filament/v4.x/introduction/installation',
        'filament/v4.x/introduction/ai',
        'filament/v4.x/introduction/optimizing-local-development',
        'filament/v4.x/getting-started',
      ],
    },
    {
      type: 'category',
      label: '资源',
      collapsed: false,
      items: [
        'filament/v4.x/resources/overview',
        'filament/v4.x/resources/listing-records',
        'filament/v4.x/resources/creating-records',
        'filament/v4.x/resources/editing-records',
        'filament/v4.x/resources/viewing-records',
        'filament/v4.x/resources/deleting-records',
        'filament/v4.x/resources/managing-relationships',
        'filament/v4.x/resources/nesting',
        'filament/v4.x/resources/singular',
        'filament/v4.x/resources/global-search',
        'filament/v4.x/resources/widgets',
        'filament/v4.x/resources/custom-pages',
        'filament/v4.x/resources/code-quality-tips',
      ],
    },
    {
      type: 'category',
      label: '组件',
      collapsed: true,
      items: [
        'filament/v4.x/components/overview',
      ],
    },
    {
      type: 'category',
      label: '表单',
      collapsed: true,
      items: [
        'filament/v4.x/forms/overview',
      ],
    },
    {
      type: 'category',
      label: '表格',
      collapsed: true,
      items: [
        'filament/v4.x/tables/overview',
      ],
    },
    {
      type: 'category',
      label: '操作',
      collapsed: true,
      items: [
        'filament/v4.x/actions/overview',
      ],
    },
    {
      type: 'category',
      label: '通知',
      collapsed: true,
      items: [
        'filament/v4.x/notifications/overview',
      ],
    },
    {
      type: 'category',
      label: '小部件',
      collapsed: true,
      items: [
        'filament/v4.x/widgets/overview',
      ],
    },
    {
      type: 'category',
      label: '导航',
      collapsed: true,
      items: [
        'filament/v4.x/navigation/overview',
        'filament/v4.x/navigation/custom-pages',
        'filament/v4.x/navigation/clusters',
      ],
    },
    {
      type: 'category',
      label: '样式',
      collapsed: true,
      items: [
        'filament/v4.x/styling/overview',
        'filament/v4.x/styling/icons',
      ],
    },
    {
      type: 'category',
      label: '测试',
      collapsed: true,
      items: [
        'filament/v4.x/testing/overview',
      ],
    },
    {
      type: 'category',
      label: '其他',
      collapsed: true,
      items: [
        'filament/v4.x/infolists/overview',
        'filament/v4.x/schemas/overview',
      ],
    },
  ],
};

export default sidebars;
