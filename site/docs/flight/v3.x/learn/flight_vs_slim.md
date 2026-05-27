---
title: Flight 与 Slim 对比
source: https://github.com/flightphp/docs/blob/master/content/v3/en/learn/flight_vs_slim.md
status: 已翻译
---

# Flight 与 Slim 对比

## 什么是 Slim？
[Slim](https://slimframework.com) 是一个 PHP 微框架，帮助你快速编写简单但强大的 Web 应用程序和 API。

Flight v3 的一些功能的灵感实际上来自 Slim。路由分组和按特定顺序执行中间件这两个特性受到了 Slim 的启发。Slim v3 面世时以简洁为导向，但关于 v4 的[评价褒贬不一](https://github.com/slimphp/Slim/issues/2770)。

## 与 Flight 相比的优势

- Slim 拥有更大的开发者社区，他们制作了方便的模块来帮助你避免重复造轮子。
- Slim 遵循许多 PHP 社区通用的接口和标准，提高了互操作性。
- Slim 有不错的文档和教程可用于学习框架（尽管与 Laravel 或 Symfony 相比还差得远）。
- Slim 有各种资源如 YouTube 教程和在线文章可用于学习框架。
- Slim 是 PSR-7 兼容的，允许你使用任何组件来处理核心路由功能。

## 与 Flight 相比的劣势

- 令人惊讶的是，Slim 作为一个微框架并没有你想象的那么快。更多信息请参见 [TechEmpower 基准测试](https://www.techempower.com/benchmarks/#hw=ph&test=fortune&section=data-r22&l=zik073-cn3)。
- Flight 面向希望构建轻量、快速、易于使用的 Web 应用程序的开发者。
- Flight 没有依赖，而 [Slim 有一些依赖](https://github.com/slimphp/Slim/blob/4.x/composer.json)需要安装。
- Flight 专注于简洁和易用性。
- Flight 的核心特性之一是尽力保持向后兼容性。Slim v3 到 v4 是破坏性变更。
- Flight 适合首次接触框架的开发者。
- Flight 也可以用于企业级应用，但没有 Slim 那么多的示例和教程。这也要求开发者更自律。
- Flight 给开发者更大的控制权，而 Slim 背后可能会有一些"魔法"。
- Flight 有一个简单的 [PdoWrapper](../../pdo-wrapper) 可用于与数据库交互。Slim 需要使用第三方库。
- Flight 有一个[权限插件](../../awesome-plugins/permissions)可用于保护应用安全。Slim 需要使用第三方库。
- Flight 有一个称为 [active-record](../../awesome-plugins/active-record) 的 ORM 可用于与数据库交互。Slim 需要使用第三方库。
- Flight 有一个称为 [runway](../../awesome-plugins/runway) 的 CLI 应用程序可用于命令行运行应用。Slim 没有。
