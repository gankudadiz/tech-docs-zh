---
title: Filament 是什么？
contents: false
---

## 简介

**Filament 是一个面向 Laravel 的服务端驱动 UI（SDUI）框架。** 它允许你完全使用 PHP 来定义用户界面，通过结构化的配置对象来实现，而无需依赖传统的模板引擎。Filament 基于 Livewire、Alpine.js 和 Tailwind CSS 构建，可以帮助你快速搭建功能完备的界面，比如后台管理面板、数据仪表盘、表单应用等——整个过程无需编写自定义 JavaScript 或前端代码。

:::info[什么是服务端驱动 UI？]
SDUI 是一种经过验证的架构模式，Meta、Airbnb、Shopify 等公司都在使用。它将 UI 的控制权交给服务端，从而实现更快的迭代速度、更好的一致性和集中化的逻辑管理。Filament 将这一模式引入 Web 开发领域，让你可以用 PHP 类来声明式地定义界面，由服务端负责渲染成 HTML。

需要注意的是，服务端驱动 UI（SDUI）和服务端渲染 UI 是两个不同的概念。虽然两者都涉及在服务端渲染内容，但服务端渲染 UI 依赖静态模板（比如传统的 Blade 视图），UI 的结构和行为在 HTML 或 PHP 文件中预先定义好。而 SDUI 赋予了服务端根据实时配置和业务逻辑动态生成 UI 的能力，提供更高的灵活性和响应性，无需直接修改前端模板。
:::

数以千计的开发者使用 Filament 为 Laravel 应用添加后台管理面板，但它的能力远不止于此。你可以用 Filament 构建自定义仪表盘、用户门户、CRM 系统，甚至是包含多个面板的完整应用。它可以与任何前端技术栈无缝协作，尤其适合与 Inertia.js、Livewire 和 Blade 等工具配合使用。

如果你已经在 Laravel 应用中使用 Blade 视图，Filament 组件同样可以增强它们的功能。你可以将基于 Filament 的 Livewire 组件嵌入到任何 Blade 视图或路由中，使用相同的 Schema 构建器来创建表单、数据表格等——完全无需切换整个技术栈。

## 核心包

Filament 的核心由以下几个包组成：

- `filament/filament` - 构建面板（如后台管理面板）的核心包。由于面板通常会用到其他包的功能，因此它依赖所有其他包。
- `filament/tables` - 数据表格构建器，支持渲染带有筛选、排序、分页等功能的交互式表格。
- `filament/schemas` - 一个使用 PHP 对象数组作为配置来构建 UI 的包。Filament 的许多功能都依赖它来渲染界面。该包提供了一组基础组件，用于渲染各类内容。
- `filament/forms` - 基于 `filament/schemas` 的表单组件集，提供丰富的表单输入字段，并内置验证功能。
- `filament/infolists` - 基于 `filament/schemas` 的描述列表组件集。信息列表由"条目"组成，这些键值对形式的 UI 元素可以展示文本、图标、图片等只读信息。信息列表的数据可以来自任何地方，但通常来自单条 Eloquent 记录。
- `filament/actions` - Action 对象封装了按钮的 UI、按钮打开的交互式模态窗口，以及模态窗口提交时执行的逻辑。它们可以在 UI 中的任何位置使用，常用于执行一次性操作，比如删除记录、发送邮件或根据模态表单输入更新数据库。
- `filament/notifications` - 在应用 UI 中向用户发送通知的便捷方式。你可以发送"闪现"通知（请求后立即显示）、"数据库"通知（存储在数据库中，用户可随时在侧滑模态窗口中查看）或"广播"通知（通过 WebSocket 连接实时推送给用户）。
- `filament/widgets` - 一组仪表盘"小部件"，可以渲染各种内容，通常用于展示统计数据。使用这个包可以在仪表盘中渲染图表、数字、表格以及完全自定义的小部件。
- `filament/support` - 这个包包含所有其他包共享的 UI 组件和工具函数。用户通常不需要直接安装它，因为它是所有其他包的依赖项。

## 插件

Filament 的设计具有高度可扩展性，允许你向框架添加自定义 UI 组件和功能。如果这些扩展只适用于你的应用，可以直接放在项目代码库中；如果是通用功能，则可以打包成 Composer 包进行分发。在 Filament 生态中，这些 Composer 包被称为"插件"，社区已经提供了数百个可用的插件。Filament 团队也官方维护了几个插件，用于集成 Laravel 生态中流行的第三方包。

生态中的绝大多数插件都是开源且免费使用的。部分高级插件需要付费购买，通常会提供更完善的技术支持和更高的质量保障。

:::warning
    非 Filament 团队维护的插件由独立作者创建和管理。虽然这些插件可以增强你的开发体验，但 Filament 无法保证其质量、安全性、兼容性或维护状态。建议在安装前仔细审查插件的代码、文档和用户反馈。
:::

你可以在 [Filament 官网](https://filamentphp.com/plugins) 浏览丰富的官方和社区插件列表。

## 自定义外观

Tailwind CSS 是一个基于工具类的 CSS 框架，Filament 将其用作基于令牌的设计系统。虽然 Filament 不直接在组件渲染的 HTML 中使用 Tailwind CSS 工具类，但它会将 Tailwind 工具类编译为语义化的 CSS 类。Filament 用户可以通过自定义 CSS 来覆盖这些语义类，从而修改组件的外观，在默认设计之上形成一层薄薄的定制层。

一个简单的例子可以展示这个系统的强大之处：修改 Filament 中所有按钮组件的圆角。默认情况下，Filament 代码库中使用以下 CSS 代码配合 Tailwind 工具类来设置按钮样式：

```css
.fi-btn {
    @apply rounded-lg px-3 py-2 text-sm font-medium outline-none;
}
```

要减小 [Tailwind CSS 中的圆角](https://tailwindcss.com/docs/border-radius)，你可以在自己的 CSS 文件中为 `.fi-btn` 应用 `rounded-sm`（小圆角）工具类：

```css
.fi-btn {
    @apply rounded-sm;
}
```

这会将 Filament 中所有按钮的默认 `rounded-lg` 类覆盖为 `rounded-sm`，同时保留按钮的其他样式属性。这个系统提供了极高的灵活性，让你可以自定义 Filament 组件的外观，而无需编写完整的自定义样式表或为每个组件维护 HTML 副本。

更多关于自定义 Filament 外观的信息，请访问[自定义样式文档](../styling/overview)。

## 测试

Filament 的核心包经过单元测试，确保各版本之间的稳定性。作为 Filament 用户，你可以为使用该框架构建的应用编写测试。Filament 提供了用于测试功能和 UI 组件的工具，兼容 Pest 或 PHPUnit 测试套件。在自定义框架或实现自定义功能时，测试尤为重要，当然对于验证基本功能的正确性也同样有价值。

更多关于测试 Filament 应用的信息，请访问[测试文档](../testing/overview)。

## Filament 的替代方案

如果你读到这里觉得 Filament 可能不适合你的项目，没关系！Laravel 生态中还有很多优秀的项目可能更适合你的需求。以下几个是我们认为值得推荐的：

### Filament 听起来太复杂了

[Laravel Nova](https://nova.laravel.com) 是为 Laravel 应用构建后台管理面板的简便方式。它是 Laravel 团队维护的官方项目，购买它也是对 Laravel 框架开发的支持。

### 我不想使用 Livewire 来定制任何东西

Filament 的很多功能都不需要你接触 Livewire，但构建自定义组件可能需要。

[Laravel Nova](https://nova.laravel.com) 基于 Vue.js 和 Inertia.js 构建，如果你的项目需要大量定制且你有这些工具的使用经验，它可能更适合你。

### 我需要一个开箱即用的 CMS

[Statamic](https://statamic.com) 是一个基于 Laravel 构建的 CMS。如果你需要一个易于设置和使用的 CMS，且不需要构建自定义后台管理面板，它是一个很好的选择。

### 我只想写 Blade 视图并自己处理后端逻辑

[Flux](https://fluxui.dev) 是 Livewire 官方 UI 套件，提供了一套预制且预样式的 Blade 组件。它由维护 Livewire 和 Alpine.js 的同一团队负责维护，购买它也是对这些项目开发的支持。
