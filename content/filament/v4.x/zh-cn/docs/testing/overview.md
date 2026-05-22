---
title: 概述
---

## 简介

本指南中的所有示例都将使用 [Pest](https://pestphp.com) 编写。要使用 Pest 的 Livewire 插件进行测试，可以按照 Pest 文档中关于插件的安装说明进行操作：[Livewire plugin for Pest](https://pestphp.com/docs/plugins#livewire)。但是，你也可以轻松地将其适配到 PHPUnit，主要是将 Pest 中的 `livewire()` 函数替换为 PHPUnit 中的 `Livewire::test()` 方法。

由于所有 Filament 组件都挂载在 Livewire 组件上，我们到处都在使用 Livewire 测试助手。如果你从未测试过 Livewire 组件，请阅读 Livewire 文档中的[本指南](https://livewire.laravel.com/docs/testing)。

## 测试指南

想要查看如何测试面板资源的完整示例？请查看[测试资源](testing-resources)部分。

如果你想了解测试表格的不同方法，请查看[测试表格](testing-tables)部分。

如果你需要测试 schema（包括表单和信息列表），请查看[测试 schema](testing-schemas)部分。

如果你想测试操作，包括表格或 schema 中的操作，请查看[测试操作](testing-actions)部分。

如果你想测试已发送的通知，请查看[测试通知](testing-notifications)部分。

如果你想测试面板中的自定义页面，它们是 Livewire 组件，没有特殊行为，因此你应该访问 Livewire 文档的[测试](https://livewire.laravel.com/docs/testing)部分。

## 使用 Filament 时的 Livewire 组件

在测试 Filament 时，了解哪些组件是 Livewire 组件、哪些不是非常有用。有了这些信息，你就知道该将哪些类传递给 Pest 中的 `livewire()` 函数或 PHPUnit 中的 `Livewire::test()` 方法。

Livewire 组件的一些示例：

- 面板中的页面，包括资源的 `Pages` 目录中的页面类
- 资源中的关联管理器
- Widget

不是 Livewire 组件的一些类示例：

- 资源类
- Schema 组件
- 操作

这些类都与 Livewire 交互，但它们本身不是 Livewire 组件。你仍然可以测试它们，例如通过调用各种方法并使用 [Pest 期望 API](https://pestphp.com/docs/expectations) 来断言预期行为。然而，最有用的测试将涉及 Livewire 组件，因为它们为用户提供了最佳的端到端测试覆盖。
