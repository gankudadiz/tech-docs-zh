---
title: Tracy Flight 面板扩展
source: https://github.com/flightphp/docs/blob/master/content/v3/en/awesome-plugins/tracy_extensions.md
status: 已翻译
---

# Tracy Flight 面板扩展

这是一组扩展，使 Flight 的开发体验更加丰富。

- Flight - 分析所有 Flight 变量。
- Database - 分析页面上运行的所有查询（如果你正确初始化了数据库连接）
- Request - 分析所有 `$_SERVER` 变量并检查所有全局负载（`$_GET`、`$_POST`、`$_FILES`）
- Session - 分析所有 `$_SESSION` 变量（如果会话处于活动状态）。

这是面板的截图：

![Flight Bar](https://raw.githubusercontent.com/flightphp/tracy-extensions/master/flight-tracy-bar.png)

每个面板都显示关于你的应用的非常有用的信息！

![Flight Data](https://raw.githubusercontent.com/flightphp/tracy-extensions/master/flight-var-data.png)
![Flight Database](https://raw.githubusercontent.com/flightphp/tracy-extensions/master/flight-db.png)
![Flight Request](https://raw.githubusercontent.com/flightphp/tracy-extensions/master/flight-request.png)

点击[这里](https://github.com/flightphp/tracy-extensions)查看代码。

## 安装

运行 `composer require flightphp/tracy-extensions --dev` 就可以开始了！

## 配置

开始使用只需非常少的配置。在此之前你需要初始化 Tracy 调试器 [https://tracy.nette.org/en/guide](https://tracy.nette.org/en/guide)：

```php
<?php

use Tracy\Debugger;
use flight\debug\tracy\TracyExtensionLoader;

// 引导代码
require __DIR__ . '/vendor/autoload.php';

Debugger::enable();
// 你可能需要使用 Debugger::enable(Debugger::DEVELOPMENT) 指定环境

// 如果你在应用中使用数据库连接，有一个必需的
// PDO 包装器仅供开发环境使用（请不要用于生产！）
// 它具有与常规 PDO 连接相同的参数
$pdo = new PdoQueryCapture('sqlite:test.db', 'user', 'pass');
// 或者将其附加到 Flight 框架
Flight::register('db', PdoQueryCapture::class, ['sqlite:test.db', 'user', 'pass']);
// 现在每当你进行查询时，它将捕获时间、查询和参数

// 这是连接各个部分的关键
if(Debugger::$showBar === true) {
	// 此项必须设为 false，否则 Tracy 无法正确渲染 :(
	Flight::set('flight.content_length', false);
	new TracyExtensionLoader(Flight::app());
}

// 更多代码

Flight::start();
```

## 额外配置

### 会话数据
如果你有自定义的会话处理器（如 ghostff/session），你可以将任何会话数据数组传递给 Tracy，它将自动为你输出。你通过 `TracyExtensionLoader` 构造函数第二个参数的 `session_data` 键来传递。

```php

use Ghostff\Session\Session;
// 或使用 flight\Session;

require 'vendor/autoload.php';

$app = Flight::app();

$app->register('session', Session::class);

if(Debugger::$showBar === true) {
	// 此项必须设为 false，否则 Tracy 无法正确渲染 :(
	Flight::set('flight.content_length', false);
	new TracyExtensionLoader(Flight::app(), [ 'session_data' => Flight::session()->getAll() ]);
}

// 路由和其他内容...

Flight::start();
```

### Latte

_此部分需要 PHP 8.1+。_

如果你的项目中安装了 Latte，Tracy 具有与 Latte 的原生集成来分析你的模板。你只需向你的 Latte 实例注册扩展。

```php

require 'vendor/autoload.php';

$app = Flight::app();

$app->map('render', function($template, $data, $block = null) {
	$latte = new Latte\Engine;

	// 其他配置...

	// 仅当 Tracy Debug 栏启用时才添加扩展
	if(Debugger::$showBar === true) {
		// 在这里将 Latte 面板添加到 Tracy
		$latte->addExtension(new Latte\Bridges\Tracy\TracyExtension);
	}

	$latte->render($template, $data, $block);
});
```
