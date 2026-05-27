---
title: 了解 Flight
source: https://github.com/flightphp/docs/blob/master/content/v3/en/learn/learn.md
status: 已翻译
---

# 了解 Flight

Flight 是一个快速、简洁、可扩展的 PHP 框架。它非常灵活，可用于构建各种类型的 Web 应用。它专为简洁而设计，代码易于理解和使用。

> **注意**：你会看到一些示例使用 `Flight::` 作为静态变量，另一些使用 `$app->` Engine 对象。两者可以互换使用。Flight 团队推荐在控制器/中间件中使用 `$app` 和 `$this->app`。

## 核心组件

### [路由](/learn/routing)

了解如何管理 Web 应用的路由。包括路由分组、路由参数和中间件。

### [中间件](/learn/middleware)

了解如何使用中间件来过滤应用中的请求和响应。

### [自动加载](/learn/autoloading)

了解如何在应用中自动加载你自己的类。

### [请求](/learn/requests)

了解如何处理应用中的请求。

### [响应](/learn/responses)

了解如何向用户发送响应。

### [HTML 模板](/learn/templates)

了解如何使用内置视图引擎渲染 HTML 模板。

### [安全](/learn/security)

了解如何保护应用免受常见安全威胁。

### [配置](/learn/configuration)

了解如何为应用配置框架。

### [事件管理器](/learn/events)

了解如何使用事件系统向应用添加自定义事件。

### [扩展 Flight](/learn/extending)

了解如何通过添加自己的方法和类来扩展框架。

### [方法钩子与过滤](/learn/filtering)

了解如何为你的方法和内部框架方法添加事件钩子。

### [依赖注入容器 (DIC)](/learn/dependency-injection-container)

了解如何使用依赖注入容器 (DIC) 来管理应用的依赖项。

## 工具类

### [集合](/learn/collections)

集合用于存储数据，可以像数组或对象一样访问，方便使用。

### [JSON 包装器](/learn/json)

提供一些简单的函数，使 JSON 的编码和解码保持一致。

### [SimplePdo](/learn/simple-pdo)

PDO 有时会带来不必要的麻烦。SimplePdo 是一个现代的 PDO 辅助类，提供 `insert()`、`update()`、`delete()` 和 `transaction()` 等便捷方法，使数据库操作更加简单。

### [PdoWrapper](/learn/pdo-wrapper)（已弃用）

原始的 PDO 包装器自 v3.18.0 起已弃用。请改用 [SimplePdo](/learn/simple-pdo)。

### [上传文件处理器](/learn/uploaded-file)

一个简单的类，用于管理上传的文件并将其移动到永久位置。

## 重要概念

### [为什么要用框架？](/learn/why-frameworks)

这是一篇关于为什么应该使用框架的简短文章。在开始使用框架之前，了解使用框架的好处是个好主意。

此外，[@lubiana](https://git.php.fail/lubiana) 创建了一个优秀的教程。虽然它没有详细介绍 Flight，但这个指南将帮助你理解围绕框架的一些主要概念以及为什么它们是有益的。你可以在[这里](https://git.php.fail/lubiana/no-framework-tutorial/src/branch/master/README.md)找到该教程。

### [Flight 与其他框架对比](/learn/flight-vs-another-framework)

如果你正在从 Laravel、Slim、Fat-Free 或 Symfony 等其他框架迁移到 Flight，本页面将帮助你理解两者之间的差异。

## 其他主题

### [单元测试](/learn/unit-testing)

遵循本指南学习如何对 Flight 代码进行单元测试，确保代码坚如磐石。

### [AI 与开发者体验](/learn/ai)

了解 Flight 如何与 AI 工具和现代开发者工作流协同工作，帮助你更快更智能地编写代码。

### [从 v2 迁移到 v3](/learn/migrating-to-v3)

向后兼容性在大部分情况下得到了保持，但从 v2 迁移到 v3 时，仍有一些需要注意的变化。
