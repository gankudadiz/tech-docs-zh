---
title: HTML 视图与模板
source: https://github.com/flightphp/docs/blob/master/content/v3/en/learn/templates.md
status: 已翻译
---

# HTML 视图与模板

## 概述

Flight 默认提供一些基本的 HTML 模板功能。模板是将你的应用逻辑与展示层分离的非常有效的方式。

## 理解

在构建应用程序时，你可能会有想要返回给最终用户的 HTML。PHP 本身是一种模板语言，但将数据库调用、API 调用等业务逻辑与 HTML 文件混在一起会_非常_容易，使测试和解耦变得非常困难。通过将数据推送到模板中并让模板自己渲染，代码的解耦和单元测试变得更加容易。如果你使用模板，你会感谢我们的！

## 基本用法

Flight 允许你只需注册自己的视图类就可以替换默认视图引擎。向下滚动查看使用 Smarty、Latte、Blade 等的示例！

### Latte

<span class="badge bg-info">推荐</span>

以下是如何在视图中使用 [Latte](https://latte.nette.org/) 模板引擎。

#### 安装

```bash
composer require latte/latte
```

#### 基本配置

主要思路是覆盖 `render` 方法以使用 Latte 而不是默认的 PHP 渲染器。

```php
// 覆盖 render 方法以使用 latte 而不是默认的 PHP 渲染器
Flight::map('render', function(string $template, array $data, ?string $block): void {
	$latte = new Latte\Engine;

	// Latte 专门存储缓存的位置
	$latte->setTempDirectory(__DIR__ . '/../cache/');
	
	$finalPath = Flight::get('flight.views.path') . $template;

	$latte->render($finalPath, $data, $block);
});
```

#### 在 Flight 中使用 Latte

现在你可以用 Latte 进行渲染，可以像这样操作：

```html
<!-- app/views/home.latte -->
<html>
  <head>
	<title>{$title ? $title . ' - '}My App</title>
	<link rel="stylesheet" href="style.css">
  </head>
  <body>
	<h1>Hello, {$name}!</h1>
  </body>
</html>
```

```php
// routes.php
Flight::route('/@name', function ($name) {
	Flight::render('home.latte', [
		'title' => 'Home Page',
		'name' => $name
	]);
});
```

当你在浏览器中访问 `/Bob` 时，输出将是：

```html
<html>
  <head>
	<title>Home Page - My App</title>
	<link rel="stylesheet" href="style.css">
  </head>
  <body>
	<h1>Hello, Bob!</h1>
  </body>
</html>
```

#### 进一步阅读

使用 Latte 布局的更复杂示例见本文档的[插件](../../awesome-plugins/latte)部分。

你可以通过阅读[官方文档](https://latte.nette.org/en/)了解 Latte 的全部功能，包括翻译和语言功能。

### 内置视图引擎

<span class="badge bg-warning">已弃用</span>

> **注意**：虽然这仍然是默认功能，技术上仍可使用。

要显示视图模板，调用 `render` 方法并传入模板文件名和可选的模板数据：

```php
Flight::render('hello.php', ['name' => 'Bob']);
```

你传入的模板数据会自动注入到模板中，可以像本地变量一样引用。模板文件就是普通的 PHP 文件。如果 `hello.php` 模板文件的内容是：

```php
Hello, <?= $name ?>!
```

输出将是：

```text
Hello, Bob!
```

你也可以使用 set 方法手动设置视图变量：

```php
Flight::view()->set('name', 'Bob');
```

变量 `name` 现在在所有视图中都可用。所以你只需：

```php
Flight::render('hello');
```

注意，在 render 方法中指定模板名称时，可以省略 `.php` 扩展名。

默认情况下，Flight 会在 `views` 目录中查找模板文件。你可以通过设置以下配置来设置模板的备用路径：

```php
Flight::set('flight.views.path', '/path/to/views');
```

#### 布局

网站通常有一个单一的布局模板文件，内容可以互换。要将内容渲染到布局中使用，可以向 `render` 方法传入一个可选参数。

```php
Flight::render('header', ['heading' => 'Hello'], 'headerContent');
Flight::render('body', ['body' => 'World'], 'bodyContent');
```

你的视图将保存名为 `headerContent` 和 `bodyContent` 的变量。然后你可以渲染布局：

```php
Flight::render('layout', ['title' => 'Home Page']);
```

如果模板文件如下：

`header.php`：

```php
<h1><?= $heading ?></h1>
```

`body.php`：

```php
<div><?= $body ?></div>
```

`layout.php`：

```php
<html>
  <head>
    <title><?= $title ?></title>
  </head>
  <body>
    <?= $headerContent ?>
    <?= $bodyContent ?>
  </body>
</html>
```

输出将是：

```html
<html>
  <head>
    <title>Home Page</title>
  </head>
  <body>
    <h1>Hello</h1>
    <div>World</div>
  </body>
</html>
```

### Smarty

以下是如何在视图中使用 [Smarty](http://www.smarty.net/) 模板引擎：

```php
// 加载 Smarty 库
require './Smarty/libs/Smarty.class.php';

// 注册 Smarty 为视图类
// 同时传入回调函数在加载时配置 Smarty
Flight::register('view', Smarty::class, [], function (Smarty $smarty) {
  $smarty->setTemplateDir('./templates/');
  $smarty->setCompileDir('./templates_c/');
  $smarty->setConfigDir('./config/');
  $smarty->setCacheDir('./cache/');
});

// 分配模板数据
Flight::view()->assign('name', 'Bob');

// 显示模板
Flight::view()->display('hello.tpl');
```

为了完整性，你还应该覆盖 Flight 的默认 render 方法：

```php
Flight::map('render', function(string $template, array $data): void {
  Flight::view()->assign($data);
  Flight::view()->display($template);
});
```

### Blade

以下是如何在视图中使用 [Blade](https://laravel.com/docs/8.x/blade) 模板引擎：

首先，通过 Composer 安装 BladeOne 库：

```bash
composer require eftec/bladeone
```

然后，你可以在 Flight 中将 BladeOne 配置为视图类：

```php
<?php
// 加载 BladeOne 库
use eftec\bladeone\BladeOne;

// 注册 BladeOne 为视图类
// 同时传入回调函数在加载时配置 BladeOne
Flight::register('view', BladeOne::class, [], function (BladeOne $blade) {
  $views = __DIR__ . '/../views';
  $cache = __DIR__ . '/../cache';

  $blade->setPath($views);
  $blade->setCompiledPath($cache);
});

// 分配模板数据
Flight::view()->share('name', 'Bob');

// 显示模板
echo Flight::view()->run('hello', []);
```

为了完整性，你还应该覆盖 Flight 的默认 render 方法：

```php
<?php
Flight::map('render', function(string $template, array $data): void {
  echo Flight::view()->run($template, $data);
});
```

在这个例子中，hello.blade.php 模板文件可能如下：

```php
<?php
Hello, {{ $name }}!
```

输出将是：

```
Hello, Bob!
```

## 参见

- [扩展](../extending) - 如何覆盖 `render` 方法以使用不同的模板引擎。
- [路由](../routing) - 如何将路由映射到控制器并渲染视图。
- [响应](../responses) - 如何自定义 HTTP 响应。
- [为什么使用框架？](../why-frameworks) - 模板在整个框架中的位置。

## 故障排除

- 如果你在中间件中有重定向，但你的应用似乎没有重定向，请确保在中间件中添加 `exit;` 语句。

## 更新日志

- v2.0 - 初始发布。
