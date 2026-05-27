---
title: Latte
source: https://github.com/flightphp/docs/blob/master/content/v3/en/awesome-plugins/latte.md
status: 已翻译
---

# Latte

[Latte](https://latte.nette.org/en/guide) 是一个功能齐全的模板引擎，非常易于使用，感觉比 Twig 或 Smarty 更接近 PHP 语法。它也非常容易扩展并添加你自己的过滤器和函数。

## 安装

通过 composer 安装。

```bash
composer require latte/latte
```

## 基本配置

有一些基本的配置选项可以帮助你入门。你可以在 [Latte 文档](https://latte.nette.org/en/guide) 中了解更多。

```php

require 'vendor/autoload.php';

$app = Flight::app();

$app->map('render', function(string $template, array $data, ?string $block): void {
	$latte = new Latte\Engine;

	// Latte 用于存储缓存的位置
	$latte->setTempDirectory(__DIR__ . '/../cache/');
	
	$finalPath = Flight::get('flight.views.path') . $template;

	$latte->render($finalPath, $data, $block);
});
```

## 简单布局示例

以下是一个布局文件的简单示例。这个文件将用于包装你的所有其他视图。

```html
<!-- app/views/layout.latte -->
<!doctype html>
<html lang="en">
	<head>
		<title>{$title ? $title . ' - '}My App</title>
		<link rel="stylesheet" href="style.css">
	</head>
	<body>
		<header>
			<nav>
				<!-- 你的导航元素 -->
			</nav>
		</header>
		<div id="content">
			<!-- 这里是魔法所在 -->
			{block content}{/block}
		</div>
		<div id="footer">
			&copy; Copyright
		</div>
	</body>
</html>
```

现在我们有将在该内容块中渲染的文件：

```html
<!-- app/views/home.latte -->
<!-- 这告诉 Latte 此文件在 layout.latte 文件的"内部" -->
{extends layout.latte}

<!-- 这是将在布局的内容块中渲染的内容 -->
{block content}
	<h1>Home Page</h1>
	<p>Welcome to my app!</p>
{/block}
```

然后，当你在函数或控制器中渲染时，你会做类似以下的操作：

```php
// 简单路由
Flight::route('/', function () {
	Flight::render('home.latte', [
		'title' => 'Home Page'
	]);
});

// 或者如果你使用控制器
Flight::route('/', [HomeController::class, 'index']);

// HomeController.php
class HomeController
{
	public function index()
	{
		Flight::render('home.latte', [
			'title' => 'Home Page'
		]);
	}
}
```

更多关于如何充分利用 Latte 的信息，请参见 [Latte 文档](https://latte.nette.org/en/guide)！

## 使用 Tracy 调试

_此部分需要 PHP 8.1+。_

你也可以使用 [Tracy](https://tracy.nette.org/en/) 直接调试 Latte 模板文件！如果你已经安装了 Tracy，你需要将 Latte 扩展添加到 Tracy。

```php
// services.php
use Tracy\Debugger;

$app->map('render', function(string $template, array $data, ?string $block): void {
	$latte = new Latte\Engine;

	// Latte 用于存储缓存的位置
	$latte->setTempDirectory(__DIR__ . '/../cache/');
	
	$finalPath = Flight::get('flight.views.path') . $template;

	// 仅当 Tracy Debug 栏启用时才添加扩展
	if (Debugger::$showBar === true) {
		// 在这里将 Latte 面板添加到 Tracy
		$latte->addExtension(new Latte\Bridges\Tracy\TracyExtension);
	}
	$latte->render($finalPath, $data, $block);
});
```
