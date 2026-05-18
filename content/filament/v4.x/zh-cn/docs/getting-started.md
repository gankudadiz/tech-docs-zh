---
title: 快速入门
---

[安装 Filament](introduction/installation#installing-the-panel-builder) 后，你就可以开始构建应用了。

:::info
    本指南适用于 Filament 面板构建器。如果你想在面板之外使用 Filament UI 组件，请访问[组件](components/overview)文档。
:::

首先，访问 `/admin` 并使用用户账户登录。你将被重定向到面板的默认仪表盘。

![Filament 默认仪表盘](/assets/filament/v4.x/screenshots/images/light/panels/dashboard.jpg)

## 资源（Resources）

资源是 Filament 应用的核心。它们是为模型构建的 CRUD 界面，让你可以在面板中管理数据。

开箱即用，Filament 会为每个资源生成三个页面：
- **列表页**：展示 Eloquent 模型中所有记录的分页表格。
- **创建页**：用于创建新记录的表单。
- **编辑页**：用于编辑已有记录的表单。

你还可以选择生成**查看页**，用于只读展示记录详情。

每个资源通常在侧边栏中有一个菜单项，创建资源后会自动注册。

要开始创建资源，请访问[资源文档](resources/overview)。

![资源列表页](/assets/filament/v4.x/screenshots/images/light/panels/resources/listing.jpg)

## 小部件（Widgets）

小部件是常用于构建仪表盘的组件，通常用于展示统计数据。支持图表、数字、表格以及完全自定义的小部件。

每个小部件包含一个 PHP 类和一个 Blade 视图。PHP 类本质上是一个 [Livewire 组件](https://livewire.laravel.com/docs/components)。因此，每个小部件都可以利用 Livewire 的全部能力来构建交互式的服务端渲染 UI。

Filament 的仪表盘默认包含两个小部件：一个用于向用户打招呼并提供退出登录功能，另一个用于展示 Filament 的相关信息。

要开始向仪表盘添加自定义小部件，请访问[小部件文档](widgets/overview)。

## 自定义页面

自定义页面是一块空白画布，你可以在面板中构建任何想要的内容。它们常用于设置页面、文档页面或其他任何你能想到的用途。

每个自定义页面包含一个 PHP 类和一个 Blade 视图。PHP 类本质上是一个[全页 Livewire 组件](https://livewire.laravel.com/docs/components)（实际上，Filament 面板中的每个页面类都是 Livewire 组件）。因此，每个页面都可以利用 Livewire 的全部能力来构建交互式的服务端渲染 UI。

要开始创建自定义页面，请访问[自定义页面文档](navigation/custom-pages)。
