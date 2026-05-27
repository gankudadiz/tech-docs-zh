---
title: 插件
source: https://github.com/flightphp/docs/blob/master/content/v3/en/awesome-plugins/awesome_plugins.md
status: 已翻译
---

# 插件

Flight 的可扩展性极强。有许多插件可以用来为你的 Flight 应用添加功能。一些由 Flight 团队官方支持，其他是一些微/轻量级库，帮助你快速入门。

## AI 工具

使用 AI 驱动的插件可以让 Flight 更强大。

- [Flight MCP](../mcp) - 一个将 MCP（模型控制协议）与 Flight 集成的插件，实现无缝的 AI 驱动功能。主要专注于文档页面，通过提供关于 Flight 项目的最新信息来帮助降低 token 成本。

## API 文档

API 文档对任何 API 都至关重要。它帮助开发者了解如何与你的 API 交互以及期望的返回值。有几个工具可以帮助你为 Flight 项目生成 API 文档。

- [FlightPHP OpenAPI Generator](https://dev.to/danielsc/define-generate-and-implement-an-api-first-approach-with-openapi-generator-and-flightphp-1fb3) - Daniel Schreiber 撰写的博客文章，讲述如何使用 OpenAPI 规范与 FlightPHP 通过 API 优先的方式构建 API。
- [SwaggerUI](https://github.com/zircote/swagger-php) - Swagger UI 是一个很好的工具，可以帮助你为 Flight 项目生成 API 文档。它非常易于使用，可以根据需求进行定制。这是一个帮助你生成 Swagger 文档的 PHP 库。

## 应用性能监控 (APM)

应用性能监控 (APM) 对任何应用都至关重要。它帮助你了解应用的性能表现以及瓶颈所在。有许多 APM 工具可以与 Flight 一起使用。

- <span class="badge bg-primary">官方</span> [flightphp/apm](../apm) - Flight APM 是一个简单的 APM 库，可用于监控你的 Flight 应用。它可用于监控应用性能并帮助识别瓶颈。

## 异步

Flight 已经是一个快速的框架，但给它加上一个涡轮引擎会让一切更有趣（也更有挑战性）！

- [flightphp/async](../async) - 官方 Flight Async 库。这个库提供了一个简单的方式为你的应用添加异步处理。它底层使用 Swoole/Openswoole 来提供简单有效的异步任务运行方式。

## 授权/权限

授权和权限对于任何需要控制谁可以访问什么内容的应用来说至关重要。

- <span class="badge bg-primary">官方</span> [flightphp/permissions](../permissions) - 官方 Flight Permissions 库。这个库提供了一种简单的方式为你的应用添加用户级和应用级权限。

## 身份验证

身份验证对于需要验证用户身份和保护 API 端点的应用来说至关重要。

- [firebase/php-jwt](../jwt) - 用于 PHP 的 JSON Web Token (JWT) 库。一种简单安全的方式，在你的 Flight 应用中实现基于令牌的身份验证。非常适合无状态 API 身份验证、用中间件保护路由以及实现 OAuth 风格的授权流程。

## 缓存

缓存是加速应用的好方法。有许多可以与 Flight 一起使用的缓存库。

- <span class="badge bg-primary">官方</span> [flightphp/cache](../php-file-cache) - 轻量、简单且独立的 PHP 文件内缓存类

## CLI

CLI 应用是与你的应用交互的好方式。你可以使用它们来生成控制器、显示所有路由等。

- <span class="badge bg-primary">官方</span> [flightphp/runway](../runway) - Runway 是一个帮助你管理 Flight 应用的 CLI 应用程序。

## Cookie

Cookie 是在客户端存储小量数据的好方法。它们可用于存储用户偏好、应用设置等。

- [overclokk/cookie](../php-cookie) - PHP Cookie 是一个提供简单有效的 Cookie 管理方式的 PHP 库。

## 调试

在本地开发环境中调试至关重要。有一些插件可以提升你的调试体验。

- [tracy/tracy](../tracy) - 这是一个功能齐全的错误处理器，可以与 Flight 一起使用。它有许多面板可以帮助你调试应用。它也非常容易扩展并添加你自己的面板。
- <span class="badge bg-primary">官方</span> [flightphp/tracy-extensions](../tracy-extensions) - 与 [Tracy](../tracy) 错误处理器配合使用，这个插件添加了一些额外的面板，专门用于 Flight 项目的调试。

## 数据库

数据库是大多数应用的核心。这是你存储和检索数据的方式。一些数据库库只是编写查询的包装器，一些则是完整的 ORM。

- <span class="badge bg-primary">官方</span> [flightphp/core SimplePdo](../../learn/simple-pdo) - 核心内置的官方 Flight PDO 助手。这是一个现代化的包装器，带有便捷的辅助方法如 `insert()`、`update()`、`delete()` 和 `transaction()`，用于简化数据库操作。所有结果以 Collection 形式返回，支持灵活的数组/对象访问。不是一个 ORM，只是一种更好的 PDO 使用方式。
- <span class="badge bg-warning">已弃用</span> [flightphp/core PdoWrapper](../../learn/pdo-wrapper) - 核心内置的官方 Flight PDO 包装器（自 v3.18.0 起已弃用）。请使用 SimplePdo 代替。
- <span class="badge bg-primary">官方</span> [flightphp/active-record](../active-record) - 官方 Flight ActiveRecord ORM/Mapper。一个很棒的小库，可以轻松地从数据库中检索和存储数据。
- [byjg/php-migration](../migrations) - 跟踪项目所有数据库变更的插件。
- [knifelemon/easy-query](../easy-query) - 轻量级的流式 SQL 查询构建器，生成 SQL 和参数用于预处理语句。与 [SimplePdo](../../learn/simple-pdo) 配合完美。

## 加密

加密对任何存储敏感数据的应用来说至关重要。加密和解密数据并非特别困难，但安全存储加密密钥[可能](https://stackoverflow.com/questions/6767839/where-should-i-store-an-encryption-key-for-php#:~:text=Write%20a%20php%20config%20file%20and%20store%20it,folder%20is%20not%20accessible%20to%20the%20end%20user.) [非常](https://www.reddit.com/r/PHP/comments/luqsn/the_encryption_key_where_do_you_store_it/) [困难](https://security.stackexchange.com/questions/48047/location-to-store-an-encryption-key)。最重要的事情是永远不要将加密密钥存储在公共目录中或提交到代码仓库。

- [defuse/php-encryption](../php-encryption) - 这是一个可用于加密和解密数据的库。开始加密和解密数据相当简单。

## 任务队列

任务队列对于异步处理任务非常有帮助。这可以是发送邮件、处理图片，或任何不需要实时完成的事情。

- [n0nag0n/simple-job-queue](../simple-job-queue) - Simple Job Queue 是一个可用于异步处理任务的库。它可以与 beanstalkd、MySQL/MariaDB、SQLite 和 PostgreSQL 一起使用。

## 会话

会话对 API 来说不太有用，但对于构建 Web 应用来说，会话对于维护状态和登录信息至关重要。

- <span class="badge bg-primary">官方</span> [flightphp/session](../session) - 官方 Flight Session 库。这是一个简单的会话库，可用于存储和检索会话数据。它使用 PHP 内置的会话处理。
- [Ghostff/Session](../ghost-session) - PHP Session Manager（非阻塞、flash、分段、会话加密）。使用 PHP open_ssl 进行会话数据的可选加密/解密。

## 模板

模板是任何有 UI 的 Web 应用的核心。有许多模板引擎可以与 Flight 配合使用。

- <span class="badge bg-warning">已弃用</span> [flightphp/core View](../../learn/templates) - 这是核心内置的一个非常基础的模板引擎。如果你的项目超过几页，不推荐使用。
- [latte/latte](../latte) - Latte 是一个功能齐全的模板引擎，非常易于使用，感觉比 Twig 或 Smarty 更接近 PHP 语法。它也非常容易扩展并添加你自己的过滤器和函数。
- [knifelemon/comment-template](../comment-template) - CommentTemplate 是一个强大的 PHP 模板引擎，具有资源编译、模板继承和变量处理功能。支持自动 CSS/JS 压缩、缓存、Base64 编码，以及可选的 Flight PHP 框架集成。

## WordPress 集成

想在 WordPress 项目中使用 Flight？有一个方便的插件可以实现！

- [n0nag0n/wordpress-integration-for-flight-framework](../n0nag0n-wordpress) - 这个 WordPress 插件让你可以在 WordPress 旁边运行 Flight。非常适合向你的 WordPress 站点添加自定义 API、微服务甚至完整应用。如果你想要两全其美，这个插件超级有用！

## 贡献

有想要分享的插件吗？提交一个 Pull Request 将其添加到列表中！
