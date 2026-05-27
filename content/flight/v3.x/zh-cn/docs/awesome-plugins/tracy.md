---
title: Tracy
source: https://github.com/flightphp/docs/blob/master/content/v3/en/awesome-plugins/tracy.md
status: 已翻译
---

# Tracy

Tracy 是一个可以与 Flight 一起使用的出色错误处理器。它有许多面板可以帮助你调试应用。它也非常容易扩展并添加你自己的面板。Flight 团队已经通过 [flightphp/tracy-extensions](https://github.com/flightphp/tracy-extensions) 插件为 Flight 项目专门创建了一些面板。

## 安装

通过 composer 安装。并且你实际上可以不使用 dev 版本安装，因为 Tracy 自带生产环境错误处理组件。

```bash
composer require tracy/tracy
```

## 基本配置

有一些基本的配置选项可以帮助你入门。你可以在 [Tracy 文档](https://tracy.nette.org/en/configuring) 中了解更多。

```php

require 'vendor/autoload.php';

use Tracy\Debugger;

// 启用 Tracy
Debugger::enable();
// Debugger::enable(Debugger::DEVELOPMENT) // 有时你必须明确指定（也可以使用 Debugger::PRODUCTION）
// Debugger::enable('23.75.345.200'); // 你也可以提供 IP 地址数组

// 错误和异常将记录在此处。确保此目录存在且可写。
Debugger::$logDirectory = __DIR__ . '/../log/';
Debugger::$strictMode = true; // 显示所有错误
// Debugger::$strictMode = E_ALL & ~E_DEPRECATED & ~E_USER_DEPRECATED; // 除了弃用通知外的所有错误
if (Debugger::$showBar) {
    $app->set('flight.content_length', false); // 如果 Debugger 栏可见，则 Flight 不能设置 content-length

	// 这仅适用于包含 Flight Tracy 扩展的情况
	// 否则请注释掉此行。
	new TracyExtensionLoader($app);
}
```

## 实用提示

在调试代码时，有一些非常有用的函数可以帮助你输出数据。

- `bdump($var)` - 这将在 Tracy 栏中单独的面板中输出变量。
- `dumpe($var)` - 这将输出变量并立即终止执行。
