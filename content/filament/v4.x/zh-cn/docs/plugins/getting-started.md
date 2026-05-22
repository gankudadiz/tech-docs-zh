---
title: 快速入门
---

## 简介

虽然 Filament 几乎提供了构建出色应用所需的所有工具，但有时你需要添加自己的功能，无论是仅用于你的应用还是作为其他开发者可以在自己的应用中使用的可分发包。这就是为什么 Filament 提供了一个插件系统，允许你扩展其功能。

在深入之前，了解插件可以使用的不同上下文非常重要。有两个主要上下文：

1. **面板插件**：这些是与[面板构建器](../introduction/installation)一起使用的插件。它们通常仅用于在面板内使用时添加功能，或作为完整的面板本身。例如：
   1. 以 Widget 形式向仪表板添加特定功能的插件。
   2. 向应用添加一组资源/功能的插件，如博客或用户管理功能。
2. **独立插件**：这些是在面板构建器之外的任何上下文中使用的插件。例如：
   1. 向[表单构建器](../forms/overview)添加自定义字段的插件。
   2. 向[表格构建器](../tables/overview)添加自定义列或过滤器的插件。

虽然在构建插件时需要记住这两种不同的思维上下文，但它们可以在同一个插件中一起使用。它们不必互斥。

## 重要概念

在深入构建插件的具体细节之前，有几个概念需要理解。在构建插件之前，你应该熟悉以下内容：

1. [Laravel 包开发](https://laravel.com/docs/packages)
2. [Spatie 包工具](https://github.com/spatie/laravel-package-tools)
3. [Filament 资源管理](../advanced/assets)

### Plugin 对象

Filament 引入了 Plugin 对象的概念，用于配置插件。此对象是一个简单的 PHP 类，实现了 `Filament\Contracts\Plugin` 接口。此类用于配置插件，是插件的主要入口点。它还用于注册插件可能使用的资源和图标。

虽然 Plugin 对象非常有帮助，但它不是构建插件所必需的。你仍然可以在不使用 Plugin 对象的情况下构建插件，如[构建面板插件](building-a-panel-plugin)教程中所示。

:::info
Plugin 对象仅用于面板提供者。独立插件不使用此对象。独立插件的所有配置都应在插件的服务提供者中处理。
:::

### 注册资源

所有[资源注册](../advanced/assets)，包括 CSS、JS 和 Alpine 组件，都应通过插件服务提供者的 `packageBooted()` 方法完成。这允许 Filament 向资源管理器注册资源，并在需要时加载它们。

## 创建插件

虽然你当然可以从头开始构建插件，但我们建议使用 [Filament 插件骨架](https://github.com/filamentphp/plugin-skeleton)来快速入门。此骨架包含所有必要的样板代码，可让你快速上手。

### 用法

要使用骨架，只需访问 GitHub 仓库并点击"Use this template"按钮。这将在你的账户中创建一个包含骨架代码的新仓库。之后，你可以将仓库克隆到你的机器上。将代码下载到机器后，导航到项目根目录并运行以下命令：

```bash
php ./configure.php
```

这将询问你一系列问题来配置插件。回答所有问题后，脚本将为你生成一个新的插件，你可以开始为 Filament 构建你的精彩扩展。

## 升级现有插件

由于每个插件的使用范围和功能差异很大，没有一种万能的方法来升级现有插件。然而，需要注意的一点是，所有插件都一致弃用了 `PluginServiceProvider`。

在你的插件服务提供者中，你需要将其改为扩展 PackageServiceProvider。你还需要向服务提供者添加一个静态 `$name` 属性。此属性用于向 Filament 注册插件。以下是你的服务提供者可能的样子示例：

```php
class MyPluginServiceProvider extends PackageServiceProvider
{
    public static string $name = 'my-plugin';

    public function configurePackage(Package $package): void
    {
        $package->name(static::$name);
    }
}
```

### 有用的链接

在升级插件之前，请完整阅读本指南。它将帮助你理解概念以及如何构建插件。

1. [Filament 资源管理](../advanced/assets)
2. [面板插件开发](../plugins)
3. [图标管理](../styling/icons)
4. [颜色管理](../styling/colors)
5. [CSS 钩子](../styling/css-hooks)
