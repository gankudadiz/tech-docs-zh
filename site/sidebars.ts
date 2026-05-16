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
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Filament v4.x',
      collapsed: false,
      items: [
        {
          type: 'category',
          label: '介绍',
          collapsed: false,
          items: [
            'filament/v4.x/introduction/overview',
            'filament/v4.x/introduction/installation',
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
          ],
        },
      ],
    },
  ],
};

export default sidebars;
