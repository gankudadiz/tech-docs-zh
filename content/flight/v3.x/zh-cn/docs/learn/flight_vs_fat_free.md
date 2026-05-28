---
title: Flight 与 Fat-Free 对比
source: https://github.com/flightphp/docs/blob/master/content/v3/en/learn/flight_vs_fat_free.md
status: 已翻译
---

# Flight 与 Fat-Free 对比

## 什么是 Fat-Free？
[Fat-Free](https://fatfreeframework.com)（俗称 **F3**）是一个强大但易于使用的 PHP 微框架，设计用于帮助你快速构建动态和健壮的 Web 应用程序！

Flight 与 Fat-Free 在许多方面相似，在功能和简洁性方面可能是最接近的同类框架。Fat-Free 有许多 Flight 没有的特性，但它也有许多 Flight 也有的特性。Fat-Free 开始显得过时，不再像以前那样受欢迎。

更新频率越来越低，社区也不如从前活跃。代码足够简单，但有时缺乏语法规则，可能导致难以阅读和理解。它确实支持 PHP 8.3，但代码本身看起来仍然像属于 PHP 5.3。

## 与 Flight 相比的优势

- Fat-Free 在 GitHub 上的 star 数比 Flight 多几个。
- Fat-Free 有一些不错的文档，但在某些方面缺乏清晰度。
- Fat-Free 有一些零散的资源，如 YouTube 教程和在线文章，可用于学习框架。
- Fat-Free 内置[一些有用的插件](https://fatfreeframework.com/3.8/api-reference)，有时很有帮助。
- Fat-Free 有一个称为 Mapper 的内置 ORM，可用于与数据库交互。Flight 有 [active-record](../../awesome-plugins/active_record)。
- Fat-Free 内置了 Session、缓存和本地化功能。Flight 需要使用第三方库，但在[文档](../../awesome-plugins)中有相关说明。
- Fat-Free 有一小部分[社区创建的插件](https://fatfreeframework.com/3.8/development#Community)可用于扩展框架。Flight 在[文档](../../awesome-plugins)和[示例](../../examples)页面中涵盖了一些。
- Fat-Free 和 Flight 一样没有依赖。
- Fat-Free 和 Flight 一样致力于给开发者对应用的控制权和简单的开发体验。
- Fat-Free 与 Flight 一样保持向后兼容性（部分是因为更新[越来越不频繁](https://github.com/bcosca/fatfree/releases)）。
- Fat-Free 和 Flight 一样适合首次接触框架的开发者。
- Fat-Free 有一个比 Flight 模板引擎更强大的内置模板引擎。Flight 推荐使用 [Latte](../../awesome-plugins/latte) 来实现类似功能。
- Fat-Free 有一个独特的 CLI 类型"路由"命令，你可以在 Fat-Free 内部构建 CLI 应用，并将其视为 `GET` 请求一样处理。Flight 通过 [runway](../../awesome-plugins/runway) 实现类似功能。

## 与 Flight 相比的劣势

- Fat-Free 有一些实现测试，甚至有自己的[测试](https://fatfreeframework.com/3.8/test)类，非常基础。然而，它不如 Flight 那样经过 100% 的单元测试覆盖。
- 你必须使用搜索引擎如 Google 来实际搜索文档网站。
- Flight 的文档网站有暗色模式。（重点）
- Fat-Free 有一些模块严重缺乏维护。
- Flight 有一个简单的 [PdoWrapper](../../pdo_wrapper)，比 Fat-Free 内置的 `DB\SQL` 类稍微更简单。
- Flight 有一个[权限插件](../../awesome-plugins/permissions)可用于保护应用安全。Fat-Free 需要使用第三方库。
- Flight 有一个称为 [active-record](../../awesome-plugins/active_record) 的 ORM，比 Fat-Free 的 Mapper 更像 ORM。`active-record` 的额外好处是你可以定义记录间的关系以实现自动连接，而 Fat-Free 的 Mapper 需要你创建 [SQL 视图](https://fatfreeframework.com/3.8/databases#ProsandCons)。
- 令人惊讶的是，Fat-Free 没有根命名空间。Flight 全局使用命名空间，以避免与你的代码冲突。`Cache` 类是最大的问题点。
- Fat-Free 没有中间件。取而代之的是 `beforeroute` 和 `afterroute` 钩子，可用于过滤控制器中的请求和响应。
- Fat-Free 不能分组路由。
- Fat-Free 有依赖注入容器处理器，但关于如何使用它的文档非常少。
- 调试可能会有些棘手，因为基本上所有东西都存储在一个称为 [`HIVE`](https://fatfreeframework.com/3.8/quick-reference) 的容器中。
