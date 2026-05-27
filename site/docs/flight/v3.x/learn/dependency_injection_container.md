---
title: 依赖注入容器
source: https://github.com/flightphp/docs/blob/master/content/v3/en/learn/dependency_injection_container.md
status: 已翻译
---

# 依赖注入容器

## 概述

依赖注入容器 (DIC) 是一个强大的增强功能，允许你管理应用的依赖关系。

## 理解

依赖注入 (DI) 是现代 PHP 框架中的核心概念，用于管理对象的实例化和配置。一些 DIC 库的示例包括：[flightphp/container](https://github.com/flightphp/container)、[Dice](https://r.je/dice)、[Pimple](https://pimple.symfony.com/)、[PHP-DI](http://php-di.org/) 和 [league/container](https://container.thephpleague.com/)。

DIC 是一种允许你在集中位置创建和管理类的优雅方式。当你需要将同一个对象传递给多个类（例如你的控制器或中间件）时，这非常有用。

## 基本用法

旧的做法可能看起来像这样：

```php

require 'vendor/autoload.php';

// 从数据库管理用户的类
class UserController {

	protected PDO $pdo;

	public function __construct(PDO $pdo) {
		$this->pdo = $pdo;
	}

	public function view(int $id) {
		$stmt = $this->pdo->prepare('SELECT * FROM users WHERE id = :id');
		$stmt->execute(['id' => $id]);

		print_r($stmt->fetch());
	}
}

// 在你的 routes.php 文件中

$db = new PDO('mysql:host=localhost;dbname=test', 'user', 'pass');

$UserController = new UserController($db);
Flight::route('/user/@id', [ $UserController, 'view' ]);
// 其他 UserController 路由...

Flight::start();
```

从上面的代码可以看到，我们创建了一个新的 `PDO` 对象并将其传递给了 `UserController` 类。对于小型应用来说，这没问题，但随着应用的增长，你会发现在多个地方创建或传递同一个 `PDO` 对象。这就是 DIC 派上用场的地方。

以下是使用 DIC 的相同示例（使用 Dice）：

```php

require 'vendor/autoload.php';

// 和上面相同的类，没有变化
class UserController {

	protected PDO $pdo;

	public function __construct(PDO $pdo) {
		$this->pdo = $pdo;
	}

	public function view(int $id) {
		$stmt = $this->pdo->prepare('SELECT * FROM users WHERE id = :id');
		$stmt->execute(['id' => $id]);

		print_r($stmt->fetch());
	}
}

// 创建新容器
$container = new \Dice\Dice;

// 添加规则告诉容器如何创建 PDO 对象
// 别忘了像下面这样重新赋值给自己！
$container = $container->addRule('PDO', [
	// shared 意味着每次都会返回同一个对象
	'shared' => true,
	'constructParams' => ['mysql:host=localhost;dbname=test', 'user', 'pass' ]
]);

// 这会注册容器处理器，以便 Flight 知道使用它。
Flight::registerContainerHandler(function($class, $params) use ($container) {
	return $container->create($class, $params);
});

// 现在我们可以使用容器来创建我们的 UserController
Flight::route('/user/@id', [ UserController::class, 'view' ]);

Flight::start();
```

你可能觉得示例中添加了很多额外的代码。魔法在于当你有一个也需要 `PDO` 对象的其他控制器时。

```php

// 如果你的所有控制器都有一个需要 PDO 对象的构造函数
// 以下每个路由都将自动获得注入！！！
Flight::route('/company/@id', [ CompanyController::class, 'view' ]);
Flight::route('/organization/@id', [ OrganizationController::class, 'view' ]);
Flight::route('/category/@id', [ CategoryController::class, 'view' ]);
Flight::route('/settings', [ SettingsController::class, 'view' ]);
```

使用 DIC 的另一个好处是单元测试变得更加容易。你可以创建一个模拟对象并将其传递给类。这是为应用编写测试时的一大优势！

### 创建集中式 DIC 处理器

你可以通过[扩展](../extending)你的应用在 services 文件中创建一个集中式 DIC 处理器。以下是一个示例：

```php
// services.php

// 创建新容器
$container = new \Dice\Dice;
// 别忘了像下面这样重新赋值给自己！
$container = $container->addRule('PDO', [
	// shared 意味着每次都会返回同一个对象
	'shared' => true,
	'constructParams' => ['mysql:host=localhost;dbname=test', 'user', 'pass' ]
]);

// 现在我们可以创建一个可映射方法来创建任何对象。
Flight::map('make', function($class, $params = []) use ($container) {
	return $container->create($class, $params);
});

// 这会注册容器处理器，以便 Flight 知道将其用于控制器/中间件
Flight::registerContainerHandler(function($class, $params) {
	Flight::make($class, $params);
});


// 假设我们有如下构造函数接受 PDO 对象的示例类
class EmailCron {
	protected PDO $pdo;

	public function __construct(PDO $pdo) {
		$this->pdo = $pdo;
	}

	public function send() {
		// 发送邮件的代码
	}
}

// 最后你可以使用依赖注入创建对象
$emailCron = Flight::make(EmailCron::class);
$emailCron->send();
```

### `flightphp/container`

Flight 有一个插件提供了简单的 PSR-11 兼容容器，可以用来处理依赖注入。以下是使用它的快速示例：

```php

// 例如 index.php
require 'vendor/autoload.php';

use flight\Container;

$container = new Container;

$container->set(PDO::class, fn(): PDO => new PDO('sqlite::memory:'));

Flight::registerContainerHandler([$container, 'get']);

class TestController {
  private PDO $pdo;

  function __construct(PDO $pdo) {
    $this->pdo = $pdo;
  }

  function index() {
    var_dump($this->pdo);
	// 这将正确输出！
  }
}

Flight::route('GET /', [TestController::class, 'index']);

Flight::start();
```

#### flightphp/container 高级用法

你还可以递归解析依赖。以下是一个示例：

```php
<?php

require 'vendor/autoload.php';

use flight\Container;

class User {}

interface UserRepository {
  function find(int $id): ?User;
}

class PdoUserRepository implements UserRepository {
  private PDO $pdo;

  function __construct(PDO $pdo) {
    $this->pdo = $pdo;
  }

  function find(int $id): ?User {
    // 实现...
    return null;
  }
}

$container = new Container;

$container->set(PDO::class, static fn(): PDO => new PDO('sqlite::memory:'));
$container->set(UserRepository::class, PdoUserRepository::class);

$userRepository = $container->get(UserRepository::class);
var_dump($userRepository);

/*
object(PdoUserRepository)#4 (1) {
  ["pdo":"PdoUserRepository":private]=>
  object(PDO)#3 (0) {
  }
}
 */
```

### DICE

你也可以创建自己的 DIC 处理器。如果你有一个不兼容 PSR-11（如 Dice）的自定义容器想要使用，这非常有用。有关如何操作，请参见[基本用法](#基本用法)部分。

此外，在使用 Flight 时有一些有用的默认设置会让你的生活更轻松。

#### Engine 实例

如果你在控制器/中间件中使用 `Engine` 实例，以下是配置方法：

```php

// 在你的引导文件中的某处
$engine = Flight::app();

$container = new \Dice\Dice;
$container = $container->addRule('*', [
	'substitutions' => [
		// 在这里传入实例
		Engine::class => $engine
	]
]);

$engine->registerContainerHandler(function($class, $params) use ($container) {
	return $container->create($class, $params);
});

// 现在你可以在控制器/中间件中使用 Engine 实例

class MyController {
	public function __construct(Engine $app) {
		$this->app = $app;
	}

	public function index() {
		$this->app->render('index');
	}
}
```

#### 添加其他类

如果你有其他想要添加到容器中的类，使用 Dice 很容易，因为它们会被容器自动解析。以下是一个示例：

```php

$container = new \Dice\Dice;
// 如果你不需要给类注入任何依赖
// 你不需要定义任何东西！
Flight::registerContainerHandler(function($class, $params) use ($container) {
	return $container->create($class, $params);
});

class MyCustomClass {
	public function parseThing() {
		return 'thing';
	}
}

class UserController {

	protected MyCustomClass $MyCustomClass;

	public function __construct(MyCustomClass $MyCustomClass) {
		$this->MyCustomClass = $MyCustomClass;
	}

	public function index() {
		echo $this->MyCustomClass->parseThing();
	}
}

Flight::route('/user', 'UserController->index');
```

### PSR-11

Flight 也可以使用任何 PSR-11 兼容的容器。这意味着你可以使用任何实现 PSR-11 接口的容器。以下是使用 League PSR-11 容器的示例：

```php

require 'vendor/autoload.php';

// 和上面相同的 UserController 类

$container = new \League\Container\Container();
$container->add(UserController::class)->addArgument(PdoWrapper::class);
$container->add(PdoWrapper::class)
	->addArgument('mysql:host=localhost;dbname=test')
	->addArgument('user')
	->addArgument('pass');
Flight::registerContainerHandler($container);

Flight::route('/user', [ 'UserController', 'view' ]);

Flight::start();
```

这可能比前面的 Dice 示例稍微冗长一些，但仍能完成相同的工作并带来相同的好处！

## 参见

- [扩展 Flight](../extending) - 了解如何通过扩展框架将依赖注入添加到你自己的类中。
- [配置](../configuration) - 了解如何为你的应用配置 Flight。
- [路由](../routing) - 了解如何为应用定义路由以及依赖注入如何与控制器配合工作。
- [中间件](../middleware) - 了解如何为应用创建中间件以及依赖注入如何与中间件配合工作。

## 故障排除

- 如果你的容器有问题，请确保向容器传递了正确的类名。

## 更新日志

- v3.7.0 - 新增向 Flight 注册 DIC 处理器的能力。
