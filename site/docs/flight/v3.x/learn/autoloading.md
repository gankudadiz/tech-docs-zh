---
title: 自动加载
source: https://github.com/flightphp/docs/blob/master/content/v3/en/learn/autoloading.md
status: 已翻译
---

# 自动加载

## 概述

自动加载是 PHP 中的一个概念，指指定一个或多个目录来加载类。这比使用 `require` 或 `include` 来加载类更加有利。它也是使用 Composer 包的必要条件。

## 理解

默认情况下，得益于 composer，任何 `Flight` 类都会自动为你加载。但是，如果你想自动加载自己的类，可以使用 `Flight::path()` 方法来指定一个加载类的目录。

使用自动加载器可以显著简化代码。与其在文件开头写一堆 `include` 或 `require` 语句来捕获该文件中使用的所有类，不如动态地调用类，它们会自动被包含进来。

## 基本用法

假设我们有如下目录树：

```text
# 示例路径
/home/user/project/my-flight-project/
├── app
│   ├── cache
│   ├── config
│   ├── controllers - 包含此项目的控制器
│   ├── translations
│   ├── UTILS - 包含此应用专用的类（注意大写，后续示例会用到）
│   └── views
└── public
    └── css
	└── js
	└── index.php
```

你可能已经注意到，这与本文档站的文件结构相同。

你可以像这样指定每个加载目录：

```php

/**
 * public/index.php
 */

// 将路径添加到自动加载器
Flight::path(__DIR__.'/../app/controllers/');
Flight::path(__DIR__.'/../app/utils/');


/**
 * app/controllers/MyController.php
 */

// 不需要命名空间

// 所有自动加载的类建议使用 Pascal Case（每个单词首字母大写，无空格）
class MyController {

	public function index() {
		// 执行某些操作
	}
}
```

## 命名空间

如果你使用了命名空间，实现起来实际上非常简单。你应该使用 `Flight::path()` 方法来指定应用的根目录（不是文档根目录或 `public/` 文件夹）。

```php

/**
 * public/index.php
 */

// 将路径添加到自动加载器
Flight::path(__DIR__.'/../');
```

现在你的控制器可能看起来像这样。查看以下示例，但请注意注释中的重要信息。

```php
/**
 * app/controllers/MyController.php
 */

// 命名空间是必需的
// 命名空间与目录结构相同
// 命名空间的大小写必须与目录结构一致
// 命名空间和目录不能包含下划线（除非设置了 Loader::setV2ClassLoading(false)）
namespace app\controllers;

// 所有自动加载的类建议使用 Pascal Case（每个单词首字母大写，无空格）
// 从 3.7.2 版本开始，你可以通过运行 Loader::setV2ClassLoading(false) 来使用 Pascal_Snake_Case 类名
class MyController {

	public function index() {
		// 执行某些操作
	}
}
```

如果你想自动加载 utils 目录中的类，基本上是一样的做法：

```php

/**
 * app/UTILS/ArrayHelperUtil.php
 */

// 命名空间必须匹配目录结构和大小写（注意 UTILS 目录在
//     上面的文件树中是大写的）
namespace app\UTILS;

class ArrayHelperUtil {

	public function changeArrayCase(array $array) {
		// 执行某些操作
	}
}
```

## 类名中的下划线

从 3.7.2 版本开始，你可以通过运行 `Loader::setV2ClassLoading(false)` 在类名中使用 Pascal_Snake_Case。
这将允许你在类名中使用下划线。
不推荐使用这种方式，但为有需要的人提供了支持。

```php
use flight\core\Loader;

/**
 * public/index.php
 */

// 将路径添加到自动加载器
Flight::path(__DIR__.'/../app/controllers/');
Flight::path(__DIR__.'/../app/utils/');
Loader::setV2ClassLoading(false);

/**
 * app/controllers/My_Controller.php
 */

// 不需要命名空间

class My_Controller {

	public function index() {
		// 执行某些操作
	}
}
```

## 参见

- [路由](../routing) - 如何将路由映射到控制器并渲染视图。
- [为什么使用框架？](../why-frameworks) - 了解使用 Flight 这样的框架的好处。

## 故障排除

- 如果你无法弄清楚为什么命名空间类找不到，请记住使用 `Flight::path()` 指向项目的根目录，而不是你的 `app/` 或 `src/` 目录或等效目录。

### 类未找到（自动加载不工作）

可能有几个原因导致此问题。以下是一些示例，但也请务必查看[自动加载](#类未找到自动加载不工作)部分。

#### 文件名不正确

最常见的原因是类名与文件名不匹配。

如果你有一个名为 `MyClass` 的类，那么文件名应该是 `MyClass.php`。如果你有一个名为 `MyClass` 的类，但文件名是 `myclass.php`，那么自动加载器将无法找到它。

#### 命名空间不正确

如果你使用了命名空间，命名空间必须与目录结构匹配。

```php
// ...代码...

// 如果你的 MyController 在 app/controllers 目录中并且有命名空间
// 这样是不行的。
Flight::route('/hello', 'MyController->hello');

// 你需要选择以下选项之一
Flight::route('/hello', 'app\controllers\MyController->hello');
// 或者如果你在文件顶部有 use 语句

use app\controllers\MyController;

Flight::route('/hello', [ MyController::class, 'hello' ]);
// 也可以写成
Flight::route('/hello', MyController::class.'->hello');
// 还可以...
Flight::route('/hello', [ 'app\controllers\MyController', 'hello' ]);
```

#### `path()` 未定义

在 skeleton 应用中，这在 `config.php` 文件中定义，但为了让你的类被找到，你需要确保在尝试使用之前定义了 `path()` 方法（可能指向项目的根目录）。

```php
// 将路径添加到自动加载器
Flight::path(__DIR__.'/../');
```

## 更新日志

- v3.7.2 - 可以通过运行 `Loader::setV2ClassLoading(false)` 在类名中使用 Pascal_Snake_Case
- v2.0 - 添加自动加载功能。
