---
title: 路由
source: https://github.com/flightphp/docs/blob/master/content/v3/en/learn/routing.md
status: 已翻译
---

# 路由

## 概述

Flight PHP 中的路由将 URL 模式映射到回调函数或类方法，能够快速、简单地处理请求。它设计为开销极低、对初学者友好，且可扩展且无需外部依赖。

## 理解

路由是将 HTTP 请求连接到 Flight 应用逻辑的核心机制。通过定义路由，你可以指定不同的 URL 如何触发不同的代码，无论是函数、类方法还是控制器操作。Flight 的路由系统非常灵活，支持基本模式、命名参数、正则表达式，以及依赖注入和资源路由等高级功能。这种方式使代码组织良好、易于维护，同时对初学者来说保持快速简单，对高级用户又可扩展。

> **注意**：想了解更多关于路由的内容？查看["为什么使用框架？"](../why_frameworks)页面获取更深入的解释。

## 基本用法

### 定义简单路由

Flight 中的基本路由通过将 URL 模式与回调函数或包含类和方法的数组进行匹配来完成。

```php
Flight::route('/', function(){
    echo 'hello world!';
});
```

> 路由按照定义的顺序进行匹配。第一个匹配到请求的路由将被调用。

### 使用函数作为回调

回调可以是任何可调用的对象。所以你可以使用普通函数：

```php
function hello() {
    echo 'hello world!';
}

Flight::route('/', 'hello');
```

### 使用类和方法作为控制器

你也可以使用类的方法（静态或非静态）：

```php
class GreetingController {
    public function hello() {
        echo 'hello world!';
    }
}

Flight::route('/', [ 'GreetingController','hello' ]);
// 或
Flight::route('/', [ GreetingController::class, 'hello' ]); // 推荐方式
// 或
Flight::route('/', [ 'GreetingController::hello' ]);
// 或 
Flight::route('/', [ 'GreetingController->hello' ]);
```

或者先创建对象再调用方法：

```php
use flight\Engine;

// GreetingController.php
class GreetingController
{
	protected Engine $app
    public function __construct(Engine $app) {
		$this->app = $app;
        $this->name = 'John Doe';
    }

    public function hello() {
        echo "Hello, {$this->name}!";
    }
}

// index.php
$app = Flight::app();
$greeting = new GreetingController($app);

Flight::route('/', [ $greeting, 'hello' ]);
```

> **注意**：默认情况下，当控制器在框架内被调用时，`flight\Engine` 类总是会被注入，除非你通过[依赖注入容器](../dependency_injection_container)进行指定。

### 指定请求方法的路由

默认情况下，路由模式会匹配所有请求方法。你可以通过在 URL 前放置标识符来响应特定的方法。

```php
Flight::route('GET /', function () {
  echo 'I received a GET request.';
});

Flight::route('POST /', function () {
  echo 'I received a POST request.';
});

// 你不能使用 Flight::get() 来定义路由，因为那是用于
//    获取变量的方法，而不是创建路由。
Flight::post('/', function() { /* code */ });
Flight::patch('/', function() { /* code */ });
Flight::put('/', function() { /* code */ });
Flight::delete('/', function() { /* code */ });
```

你还可以使用 `|` 分隔符将多个方法映射到单个回调：

```php
Flight::route('GET|POST /', function () {
  echo 'I received either a GET or a POST request.';
});
```

### HEAD 和 OPTIONS 请求的特殊处理

Flight 为 `HEAD` 和 `OPTIONS` HTTP 请求提供了内置处理：

#### HEAD 请求

- **HEAD 请求**的处理方式与 `GET` 请求相同，但 Flight 会在发送给客户端之前自动移除响应正文。
- 这意味着你可以为 `GET` 定义路由，而对该 URL 的 HEAD 请求将只返回响应头（无内容），符合 HTTP 标准。

```php
Flight::route('GET /info', function() {
    echo 'This is some info!';
});
// 对 /info 的 HEAD 请求将返回相同的响应头，但不返回正文。
```

#### OPTIONS 请求

对于任何已定义的路由，`OPTIONS` 请求由 Flight 自动处理。
- 当收到 OPTIONS 请求时，Flight 会响应 `204 No Content` 状态码和一个 `Allow` 响应头，列出该路由支持的所有 HTTP 方法。
- 你不需要为 OPTIONS 单独定义路由。

```php
// 对于如下定义的路由：
Flight::route('GET|POST /users', function() { /* ... */ });

// 对 /users 的 OPTIONS 请求将响应：
//
// Status: 204 No Content
// Allow: GET, POST, HEAD, OPTIONS
```

### 使用路由器对象

另外，你可以获取 Router 对象，它有一些辅助方法供你使用：

```php

$router = Flight::router();

// 映射所有方法，就像 Flight::route() 一样
$router->map('/', function() {
	echo 'hello world!';
});

// GET 请求
$router->get('/users', function() {
	echo 'users';
});
$router->post('/users', 			function() { /* code */});
$router->put('/users/update/@id', 	function() { /* code */});
$router->delete('/users/@id', 		function() { /* code */});
$router->patch('/users/@id', 		function() { /* code */});
```

### 正则表达式 (Regex)

你可以在路由中使用正则表达式：

```php
Flight::route('/user/[0-9]+', function () {
  // 这将匹配 /user/1234
});
```

虽然这种方法可用，但建议使用命名参数或带正则表达式的命名参数，因为它们更易读且更易于维护。

### 命名参数

你可以在路由中指定命名参数，这些参数将被传递给你的回调函数。**这更多是为了路由的可读性。请参见下面关于重要警告的部分。**

```php
Flight::route('/@name/@id', function (string $name, string $id) {
  echo "hello, $name ($id)!";
});
```

你还可以通过使用 `:` 分隔符在命名参数中包含正则表达式：

```php
Flight::route('/@name/@id:[0-9]{3}', function (string $name, string $id) {
  // 这将匹配 /bob/123
  // 但不匹配 /bob/12345
});
```

> **注意**：不支持使用带位置参数的匹配正则分组 `()`。例如：`:'\(`

#### 重要警告

虽然在上面的示例中，`@name` 似乎直接关联到变量 `$name`，但事实并非如此。回调函数中参数的**顺序**决定了传递给它的内容。如果你调换回调函数中参数的顺序，变量也会相应调换。以下是一个示例：

```php
Flight::route('/@name/@id', function (string $id, string $name) {
  echo "hello, $name ($id)!";
});
```

如果你访问以下 URL：`/bob/123`，输出将是 `hello, 123 (bob)!`。
设置路由和回调函数时_请务必小心_！

### 可选参数

你可以通过将路径段用括号括起来来指定可选的命名参数。

```php
Flight::route(
  '/blog(/@year(/@month(/@day)))',
  function(?string $year, ?string $month, ?string $day) {
    // 这将匹配以下 URL：
    // /blog/2012/12/10
    // /blog/2012/12
    // /blog/2012
    // /blog
  }
);
```

任何未匹配的可选参数将作为 `NULL` 传入。

### 通配符路由

匹配仅针对单个 URL 段进行。如果你想匹配多个段，可以使用 `*` 通配符。

```php
Flight::route('/blog/*', function () {
  // 这将匹配 /blog/2000/02/01
});
```

要将所有请求路由到单个回调，你可以这样做：

```php
Flight::route('*', function () {
  // 做点什么
});
```

### 404 未找到处理器

默认情况下，如果找不到 URL，Flight 将发送一个非常简单朴素的 `HTTP 404 Not Found` 响应。
如果你想要更自定义的 404 响应，可以[映射](../extending)你自己的 `notFound` 方法：

```php
Flight::map('notFound', function() {
	$url = Flight::request()->url;

	// 你也可以使用 Flight::render() 配合自定义模板。
    $output = <<<HTML
		<h1>我的自定义 404 未找到页面</h1>
		<h3>你请求的页面 {$url} 找不到。</h3>
		HTML;

	$this->response()
		->clearBody()
		->status(404)
		->write($output)
		->send();
});
```

### 方法不允许处理器

默认情况下，如果找到了 URL 但请求方法不被允许，Flight 将发送一个非常简单朴素的 `HTTP 405 Method Not Allowed` 响应（例如：Method Not Allowed. Allowed Methods are: GET, POST）。同时还会包含一个 `Allow` 响应头，列出该 URL 的允许方法。

如果你想要更自定义的 405 响应，可以[映射](../extending)你自己的 `methodNotFound` 方法：

```php
use flight\net\Route;

Flight::map('methodNotFound', function(Route $route) {
	$url = Flight::request()->url;
	$methods = implode(', ', $route->methods);

	// 你也可以使用 Flight::render() 配合自定义模板。
	$output = <<<HTML
		<h1>我的自定义 405 方法不允许</h1>
		<h3>你请求 {$url} 的方法不被允许。</h3>
		<p>允许的方法有：{$methods}</p>
		HTML;

	$this->response()
		->clearBody()
		->status(405)
		->setHeader('Allow', $methods)
		->write($output)
		->send();
});
```

## 高级用法

### 路由中的依赖注入

如果你想通过容器（PSR-11、PHP-DI、Dice 等）使用依赖注入，只有以下类型的路由支持：直接自己创建对象并使用容器来创建对象，或者使用字符串来定义要调用的类和方法。你可以查看[依赖注入](../dependency_injection_container)页面获取更多信息。

以下是一个快速示例：

```php

use flight\database\PdoWrapper;

// Greeting.php
class Greeting
{
	protected PdoWrapper $pdoWrapper;
	public function __construct(PdoWrapper $pdoWrapper) {
		$this->pdoWrapper = $pdoWrapper;
	}

	public function hello(int $id) {
		// 使用 $this->pdoWrapper 做些什么
		$name = $this->pdoWrapper->fetchField("SELECT name FROM users WHERE id = ?", [ $id ]);
		echo "Hello, world! My name is {$name}!";
	}
}

// index.php

// 使用所需的参数设置容器
// 有关 PSR-11 的更多信息，请参见依赖注入页面
$dice = new \Dice\Dice();

// 别忘了使用 '$dice = ' 重新赋值!!!!!
$dice = $dice->addRule('flight\database\PdoWrapper', [
	'shared' => true,
	'constructParams' => [ 
		'mysql:host=localhost;dbname=test', 
		'root',
		'password'
	]
]);

// 注册容器处理器
Flight::registerContainerHandler(function($class, $params) use ($dice) {
	return $dice->create($class, $params);
});

// 正常定义路由
Flight::route('/hello/@id', [ 'Greeting', 'hello' ]);
// 或
Flight::route('/hello/@id', 'Greeting->hello');
// 或
Flight::route('/hello/@id', 'Greeting::hello');

Flight::start();
```

### 将执行传递给下一个路由

<span class="badge bg-warning">已弃用</span>
你可以通过从回调函数返回 `true` 将执行传递给下一个匹配的路由。

```php
Flight::route('/user/@name', function (string $name) {
  // 检查某些条件
  if ($name !== "Bob") {
    // 继续下一个路由
    return true;
  }
});

Flight::route('/user/*', function () {
  // 这个将被调用
});
```

现在推荐使用[中间件](../middleware)来处理此类复杂用例。

### 路由别名

通过为路由分配别名，你可以在应用代码中动态调用该别名来生成 URL（例如：HTML 模板中的链接，或生成重定向 URL）。

```php
Flight::route('/users/@id', function($id) { echo 'user:'.$id; }, false, 'user_view');
// 或 
Flight::route('/users/@id', function($id) { echo 'user:'.$id; })->setAlias('user_view');

// 稍后在代码中的某个地方
class UserController {
	public function update() {

		// 保存用户的代码...
		$id = $user['id']; // 例如 5

		$redirectUrl = Flight::getUrl('user_view', [ 'id' => $id ]); // 将返回 '/users/5'
		Flight::redirect($redirectUrl);
	}
}

```

这在 URL 发生变更时特别有用。在上面的示例中，假设用户被移到了 `/admin/users/@id`。
有了路由别名，你不再需要找到代码中所有的旧 URL 并进行修改，因为别名现在会像上面的示例一样返回 `/admin/users/5`。

路由别名在分组中同样有效：

```php
Flight::group('/users', function() {
    Flight::route('/@id', function($id) { echo 'user:'.$id; }, false, 'user_view');
	// 或
	Flight::route('/@id', function($id) { echo 'user:'.$id; })->setAlias('user_view');
});
```

### 检查路由信息

如果你想检查匹配的路由信息，有两种方法：

1. 使用 `Flight::router()` 对象上的 `executedRoute` 属性。
2. 在路由方法的第三个参数中传入 `true`，请求将路由对象传递给你的回调。路由对象将始终作为最后一个参数传递给你的回调函数。

#### `executedRoute`

```php
Flight::route('/', function() {
  $route = Flight::router()->executedRoute;
  // 用 $route 做点什么
  // 匹配的 HTTP 方法数组
  $route->methods;

  // 命名参数数组
  $route->params;

  // 匹配的正则表达式
  $route->regex;

  // 包含 URL 模式中使用的任何 '*' 的内容
  $route->splat;

  // 显示 URL 路径...如果你确实需要的话
  $route->pattern;

  // 显示分配给此路由的中间件
  $route->middleware;

  // 显示分配给此路由的别名
  $route->alias;
});
```

> **注意**：`executedRoute` 属性只有在路由执行后才会被设置。如果你在路由执行之前尝试访问它，它将是 `NULL`。你也可以在[中间件](../middleware)中使用 `executedRoute`！

#### 在路由定义中传入 `true`

```php
Flight::route('/', function(\flight\net\Route $route) {
  // 匹配的 HTTP 方法数组
  $route->methods;

  // 命名参数数组
  $route->params;

  // 匹配的正则表达式
  $route->regex;

  // 包含 URL 模式中使用的任何 '*' 的内容
  $route->splat;

  // 显示 URL 路径...如果你确实需要的话
  $route->pattern;

  // 显示分配给此路由的中间件
  $route->middleware;

  // 显示分配给此路由的别名
  $route->alias;
}, true);// <-- 这个 true 参数是实现此功能的关键
```

### 路由分组和中间件

有时你可能想将相关路由（如 `/api/v1`）分组在一起。
你可以使用 `group` 方法来实现：

```php
Flight::group('/api/v1', function () {
  Flight::route('/users', function () {
	// 匹配 /api/v1/users
  });

  Flight::route('/posts', function () {
	// 匹配 /api/v1/posts
  });
});
```

你甚至可以嵌套分组：

```php
Flight::group('/api', function () {
  Flight::group('/v1', function () {
	// Flight::get() 用于获取变量，不能设置路由！参见下面的对象上下文
	Flight::route('GET /users', function () {
	  // 匹配 GET /api/v1/users
	});

	Flight::post('/posts', function () {
	  // 匹配 POST /api/v1/posts
	});

	Flight::put('/posts/1', function () {
	  // 匹配 PUT /api/v1/posts
	});
  });
  Flight::group('/v2', function () {

	// Flight::get() 用于获取变量，不能设置路由！参见下面的对象上下文
	Flight::route('GET /users', function () {
	  // 匹配 GET /api/v2/users
	});
  });
});
```

#### 使用对象上下文进行分组

你还可以通过以下方式使用 `Engine` 对象进行路由分组：

```php
$app = Flight::app();

$app->group('/api/v1', function (Router $router) {

  // 使用 $router 变量
  $router->get('/users', function () {
	// 匹配 GET /api/v1/users
  });

  $router->post('/posts', function () {
	// 匹配 POST /api/v1/posts
  });
});
```

> **注意**：这是使用 `$router` 对象定义路由和分组的推荐方式。

#### 带中间件的分组

你还可以为路由组分配中间件：

```php
Flight::group('/api/v1', function () {
  Flight::route('/users', function () {
	// 匹配 /api/v1/users
  });
}, [ MyAuthMiddleware::class ]); // 或 [ new MyAuthMiddleware() ] 如果你想使用实例
```

更多详情见[分组中间件](../middleware#分组路由与中间件)页面。

### 资源路由

你可以使用 `resource` 方法为资源创建一组路由。这将创建一组遵循 RESTful 惯例的资源路由。

要创建资源，请执行以下操作：

```php
Flight::resource('/users', UsersController::class);
```

后台实际发生的是，它将创建以下路由：

```php
[
      'index' => 'GET /users',
      'create' => 'GET /users/create',
      'store' => 'POST /users',
      'show' => 'GET /users/@id',
      'edit' => 'GET /users/@id/edit',
      'update' => 'PUT /users/@id',
      'destroy' => 'DELETE /users/@id'
]
```

你的控制器将使用以下方法：

```php
class UsersController
{
    public function index(): void
    {
    }

    public function show(string $id): void
    {
    }

    public function create(): void
    {
    }

    public function store(): void
    {
    }

    public function edit(string $id): void
    {
    }

    public function update(string $id): void
    {
    }

    public function destroy(string $id): void
    {
    }
}
```

> **注意**：你可以通过运行 `php runway routes` 使用 `runway` 查看新增的路由。

#### 自定义资源路由

有几个选项可以配置资源路由。

##### 别名基础

你可以配置 `aliasBase`。默认情况下，别名是所指定 URL 的最后一部分。
例如，`/users/` 将产生 `users` 的 `aliasBase`。当创建这些路由时，
别名是 `users.index`、`users.create` 等。如果你想更改别名，请将 `aliasBase`
设置为你想要的值。

```php
Flight::resource('/users', UsersController::class, [ 'aliasBase' => 'user' ]);
```

##### Only 和 Except

你还可以使用 `only` 和 `except` 选项指定要创建哪些路由。

```php
// 仅白名单包含这些方法，黑名单排除其余方法
Flight::resource('/users', UsersController::class, [ 'only' => [ 'index', 'show' ] ]);
```

```php
// 仅黑名单排除这些方法，白名单包含其余方法
Flight::resource('/users', UsersController::class, [ 'except' => [ 'create', 'store', 'edit', 'update', 'destroy' ] ]);
```

这些基本上是白名单和黑名单选项，你可以指定想要创建哪些路由。

##### 中间件

你还可以指定在 `resource` 方法创建的每条路由上运行的中间件。

```php
Flight::resource('/users', UsersController::class, [ 'middleware' => [ MyAuthMiddleware::class ] ]);
```

### 流式响应

你现在可以使用 `stream()` 或 `streamWithHeaders()` 向客户端流式传输响应。
这对于发送大文件、长时间运行的进程或生成大量响应非常有用。
流式路由的处理方式与普通路由略有不同。

> **注意**：流式响应仅在 [`flight.v2.output_buffering`](../migrating_to_v3#输出缓冲行为) 设置为 `false` 时可用。

#### 手动设置响应头的流式传输

你可以通过在路由上使用 `stream()` 方法向客户端流式传输响应。如果
你这样做，必须在向客户端输出任何内容之前手动设置所有响应头。
这通过 PHP 的 `header()` 函数或 `Flight::response()->setRealHeader()` 方法完成。

```php
Flight::route('/@filename', function($filename) {

	$response = Flight::response();

	// 显然你需要对路径进行清理等操作。
	$fileNameSafe = basename($filename);

	// 如果你需要在路由执行后设置额外的响应头
	// 你必须在任何内容被输出之前定义它们。
	// 它们必须都是对 header() 函数的原始调用或
	// 对 Flight::response()->setRealHeader() 的调用
	header('Content-Disposition: attachment; filename="'.$fileNameSafe.'"');
	// 或
	$response->setRealHeader('Content-Disposition: attachment; filename="'.$fileNameSafe.'"');

	$filePath = '/some/path/to/files/'.$fileNameSafe;

	if (!is_readable($filePath)) {
		Flight::halt(404, 'File not found');
	}

	// 如果需要可以手动设置内容长度
	header('Content-Length: '.filesize($filePath));
	// 或
	$response->setRealHeader('Content-Length: '.filesize($filePath));

	// 边读取边将文件流式传输到客户端
	readfile($filePath);

// 这是关键的一行
})->stream();
```

#### 带响应头的流式传输

你还可以使用 `streamWithHeaders()` 方法在开始流式传输之前设置响应头。

```php
Flight::route('/stream-users', function() {

	// 你可以在这里添加任何额外的响应头
	// 你必须使用 header() 或 Flight::response()->setRealHeader()

	// 无论你如何获取数据，仅作为示例...
	$users_stmt = Flight::db()->query("SELECT id, first_name, last_name FROM users");

	echo '{';
	$user_count = count($users);
	while($user = $users_stmt->fetch(PDO::FETCH_ASSOC)) {
		echo json_encode($user);
		if(--$user_count > 0) {
			echo ',';
		}

		// 这是将数据发送到客户端所必需的
		ob_flush();
	}
	echo '}';

// 这是你在开始流式传输之前设置响应头的方式。
})->streamWithHeaders([
	'Content-Type' => 'application/json',
	'Content-Disposition' => 'attachment; filename="users.json"',
	// 可选的状态码，默认为 200
	'status' => 200
]);
```

## 参见

- [中间件](../middleware) - 对路由使用中间件进行身份验证、日志记录等。
- [依赖注入](../dependency_injection_container) - 简化路由中对象的创建和管理。
- [为什么使用框架？](../why_frameworks) - 了解使用 Flight 这样的框架的好处。
- [扩展](../extending) - 如何使用你自己的功能扩展 Flight，包括 `notFound` 方法。
- [php.net: preg_match](https://www.php.net/manual/en/function.preg-match.php) - 正则表达式匹配的 PHP 函数。

## 故障排除

- 路由参数按顺序匹配，而非按名称匹配。确保回调参数顺序与路由定义匹配。
- 使用 `Flight::get()` 不会定义路由；请使用 `Flight::route('GET /...')` 进行路由定义，或在分组中使用 Router 对象上下文（例如 `$router->get(...)`）。
- `executedRoute` 属性只有在路由执行后才会设置；执行之前为 NULL。
- 流式传输需要禁用旧版 Flight 输出缓冲功能（`flight.v2.output_buffering = false`）。
- 对于依赖注入，只有特定的路由定义方式支持基于容器的实例化。

### 404 未找到或意外的路由行为

如果你看到 404 Not Found 错误（但你确信它确实存在，并且不是拼写错误），这实际上可能是因为
你在路由端点中返回了一个值，而不是仅仅输出它。这是有意为之，但可能会让一些开发者措手不及。

```php
Flight::route('/hello', function(){
	// 这可能会导致 404 Not Found 错误
	return 'Hello World';
});

// 你可能想要这样
Flight::route('/hello', function(){
	echo 'Hello World';
});
```

原因是因为路由器中内置了一个特殊机制，将返回值作为"跳转到下一个路由"的信号。
你可以在[路由](#将执行传递给下一个路由)部分查看相关行为文档。

## 更新日志

- v3：新增资源路由、路由别名、流式支持、路由分组和中间件支持。
- v1：大部分基本功能可用。
