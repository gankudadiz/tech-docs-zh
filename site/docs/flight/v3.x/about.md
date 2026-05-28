---
title: Flight PHP 框架
source: https://github.com/flightphp/docs/blob/master/content/v3/en/about.md
status: 已翻译
---

# Flight PHP 框架

Flight 是一个快速、简单、可扩展的 PHP 框架——专为想要零烦恼快速完成工作的开发者打造。无论你是在构建经典的 Web 应用、高速 API，还是在尝试最新的 AI 工具，Flight 的小巧体积和直观设计都能完美胜任。

## 为什么选择 Flight？

- **初学者友好**：Flight 是 PHP 新手的绝佳起点。清晰的结构和简洁的语法帮助你在不被样板代码淹没的情况下学习 Web 开发。
- **专业认可**：经验丰富的开发者喜爱 Flight 的灵活性和控制力。从小型原型到全功能应用都能在一个框架内完成。
- **向后兼容**：我们重视你的时间。Flight v3 是 v2 的增强版，保持了几乎相同的 API。我们相信进化而非革命——不会每年大版本都"天翻地覆"。
- **零依赖**：Flight 核心完全无依赖——无 polyfill、无外部包。意味着更少的攻击面、更小的体积、更少的意外 breaking changes。
- **AI 聚焦**：Flight 的最小开销和清晰架构使其成为集成 AI 工具和 API 的理想选择。[了解更多关于 AI 与 Flight](learn/ai)

## 快速开始

```bash
composer require flightphp/core
```

```php
<?php
require 'vendor/autoload.php';
Flight::route('/', function() { echo 'hello world!'; });
Flight::route('/json', function() { Flight::json(['hello' => 'world']); });
Flight::start();
```

## Skeleton 应用

```bash
composer create-project flightphp/skeleton my-project/
cd my-project/
composer start
```

## 高性能

Flight 是最快的 PHP 框架之一。基于 [TechEmpower 基准测试](https://www.techempower.com/benchmarks/)：

| 框架 | Plaintext Reqs/sec | JSON Reqs/sec |
| ---- | ------------ | ------------ |
| Flight | 190,421 | 182,491 |
| Slim | 89,588 | 87,348 |
| Symfony | 65,053 | 63,237 |
| Laravel | 26,657 | 26,901 |

## 社区

Matrix Chat + Discord。欢迎贡献：[核心仓库](https://github.com/flightphp/core) / [文档仓库](https://github.com/flightphp/docs)。

## 系统要求

PHP 7.4 或更高版本。

## 许可证

[MIT](https://github.com/flightphp/core/blob/master/LICENSE)
