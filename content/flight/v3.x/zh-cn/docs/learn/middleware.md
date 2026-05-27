---
title: 中间件
source: https://github.com/flightphp/docs/blob/master/content/v3/en/learn/middleware.md
status: 已翻译
---

# 中间件

## 概述

Flight 支持路由和路由组的中间件。中间件是应用中在路由回调之前（或之后）执行代码的部分。这是向代码中添加 API 身份验证检查或验证用户是否有权限访问路由的好方法。

## 理解

中间件可以大大简化你的应用。无需复杂的抽象类继承或方法重写，中间件允许你通过将自定义应用逻辑分配给路由来控制它们。你可以把中间件想象成一个三明治。外面是面包，然后是生菜、番茄、肉类和奶酪等分层的内容。然后想象每个请求就像是咬一口三明治，你先吃掉外层，然后逐步到达核心。

以下是中间件的抽象执行流程（三明治模型）：

```
📥 用户请求  ──→  🔵 before()  ──→  🟡 路由处理器  ──→  🔵 after()  ──→  📤 响应
```

以下是一个登录验证中间件的实际执行示例：

```
📥 GET /dashboard
    │
    ▼
┌───────────────────────────────────────────┐
│ 🔵 LoggedInMiddleware::before()           │
│    检查用户是否有有效的登录会话              │
└──────────────────┬────────────────────────┘
                   │
         ┌─────────┴─────────┐
         ▼                   ▼
   ✅ 已登录              ❌ 未登录
   继续执行              重定向到 /login
         │                  (流程终止)
         ▼
┌───────────────────────────────────────────┐
│ 🟡 路由处理器执行                         │
│    渲染 Dashboard 页面，生成 HTML 响应      │
└──────────────────┬────────────────────────┘
                   │
                   ▼
┌───────────────────────────────────────────┐
│ 🔵 LoggedInMiddleware::after()  (无操作)   │
│    该中间件未定义 after()，直接跳过         │
└──────────────────┬────────────────────────┘
                   │
                   ▼
            📤 返回 Dashboard HTML
```

### 执行顺序

中间件函数按照添加到路由的顺序执行。执行方式类似于 [Slim Framework 的处理方式](https://www.slimframework.com/docs/v4/concepts/middleware.html#how-does-middleware-work)。

`before()` 方法按添加顺序执行，`after()` 方法按相反顺序执行。

例如：Middleware1->before(), Middleware2->before(), Middleware2->after(), Middleware1->after()。

## 基本用法

你可以使用任何可调用的方法作为中间件，包括匿名函数或类（推荐）。

### 匿名函数

以下是一个简单示例：

```php
Flight::route('/path', function() { echo ' Here I am!'; })->addMiddleware(function() {
	echo 'Middleware first!';
});

Flight::start();

// 这将输出 "Middleware first! Here I am!"
```

> **注意**：使用匿名函数时，唯一被解释的方法是 `before()` 方法。你**不能**通过匿名函数定义 `after()` 行为。

### 使用类

中间件可以（且应该）注册为类。如果你需要 `after` 功能，你**必须**使用类。

```php
class MyMiddleware {
	public function before($params) {
		echo 'Middleware first!';
	}

	public function after($params) {
		echo 'Middleware last!';
	}
}

$MyMiddleware = new MyMiddleware();
Flight::route('/path', function() { echo ' Here I am! '; })->addMiddleware($MyMiddleware); 
// 也可以 ->addMiddleware([ $MyMiddleware, $MyMiddleware2 ]);

Flight::start();

// 这将显示 "Middleware first! Here I am! Middleware last!"
```

你也可以只定义中间件类名，它会实例化该类。

```php
Flight::route('/path', function() { echo ' Here I am! '; })->addMiddleware(MyMiddleware::class); 
```

> **注意**：如果你只传入中间件的名称，它将自动由[依赖注入容器](../dependency-injection-container)执行，中间件将通过其所需的参数执行。如果你没有注册依赖注入容器，它将默认把 `flight\Engine` 实例传入 `__construct(Engine $app)`。

### 在路由中使用参数

如果你需要从路由中获取参数，它们将以单个数组的形式传递给中间件函数（`function($params) { ... }` 或 `public function before($params) { ... }`）。
这样做的原因是你可以将参数结构化为组，在某些组中，参数可能以不同的顺序出现，这会导致中间件函数引用错误的参数。
通过这种方式，你可以按名称而不是位置来访问它们。

```php
use flight\Engine;

class RouteSecurityMiddleware {

	protected Engine $app;

	public function __construct(Engine $app) {
		$this->app = $app;
	}

	public function before(array $params) {
		$clientId = $params['clientId'];

		// jobId 可能会传入也可能不会
		$jobId = $params['jobId'] ?? 0;

		// 如果没有 jobId，你可能不需要检查任何内容。
		if($jobId === 0) {
			return;
		}

		// 在数据库中进行某种查询
		$isValid = !!$this->app->db()->fetchField("SELECT 1 FROM client_jobs WHERE client_id = ? AND job_id = ?", [ $clientId, $jobId ]);

		if($isValid !== true) {
			$this->app->halt(400, '你被阻止了，哈哈！');
		}
	}
}

// routes.php
$router->group('/client/@clientId/job/@jobId', function(Router $router) {

	// 下面的分组仍然获得父级中间件
	// 但参数以单个数组的形式传递给中间件。
	$router->group('/job/@jobId', function(Router $router) {
		$router->get('', [ JobController::class, 'view' ]);
		$router->put('', [ JobController::class, 'update' ]);
		$router->delete('', [ JobController::class, 'delete' ]);
		// 更多路由...
	});
}, [ RouteSecurityMiddleware::class ]);
```

### 分组路由与中间件

你可以添加一个路由组，然后该组中的每条路由都会拥有相同的中间件。这在你需要将一堆路由按例如 Auth 中间件分组以检查请求头中 API Key 的情况下非常有用。

```php

// 添加在 group 方法的末尾
Flight::group('/api', function() {

	// 这个看似"空"的路由实际上会匹配 /api
	Flight::route('', function() { echo 'api'; }, false, 'api');
	// 这将匹配 /api/users
    Flight::route('/users', function() { echo 'users'; }, false, 'users');
	// 这将匹配 /api/users/1234
	Flight::route('/users/@id', function($id) { echo 'user:'.$id; }, false, 'user_view');
}, [ new ApiAuthMiddleware() ]);
```

如果你想对所有路由应用全局中间件，可以添加一个"空"分组：

```php

// 添加在 group 方法的末尾
Flight::group('', function() {

	// 这仍然是 /users
	Flight::route('/users', function() { echo 'users'; }, false, 'users');
	// 这仍然是 /users/1234
	Flight::route('/users/@id', function($id) { echo 'user:'.$id; }, false, 'user_view');
}, [ ApiAuthMiddleware::class ]); // 或 [ new ApiAuthMiddleware() ]，效果相同
```

### 常见用例

#### API Key 验证

如果你想通过验证 API Key 是否正确来保护你的 `/api` 路由，你可以轻松地用中间件处理。

```php
use flight\Engine;

class ApiMiddleware {

	protected Engine $app;

	public function __construct(Engine $app) {
		$this->app = $app;
	}
	
	public function before(array $params) {
		$authorizationHeader = $this->app->request()->getHeader('Authorization');
		$apiKey = str_replace('Bearer ', '', $authorizationHeader);

		// 在数据库中查找 api key
		$apiKeyHash = hash('sha256', $apiKey);
		$hasValidApiKey = !!$this->db()->fetchField("SELECT 1 FROM api_keys WHERE hash = ? AND valid_date >= NOW()", [ $apiKeyHash ]);

		if($hasValidApiKey !== true) {
			$this->app->jsonHalt(['error' => 'Invalid API Key']);
		}
	}
}

// routes.php
$router->group('/api', function(Router $router) {
	$router->get('/users', [ ApiController::class, 'getUsers' ]);
	$router->get('/companies', [ ApiController::class, 'getCompanies' ]);
	// 更多路由...
}, [ ApiMiddleware::class ]);
```

现在你所有的 API 路由都受此 API Key 验证中间件的保护！如果你向路由器组中添加更多路由，它们将立即获得相同的保护！

#### 登录验证

你是否想保护一些路由只允许已登录用户访问？这可以通过中间件轻松实现！

```php
use flight\Engine;

class LoggedInMiddleware {

	protected Engine $app;

	public function __construct(Engine $app) {
		$this->app = $app;
	}

	public function before(array $params) {
		$session = $this->app->session();
		if($session->get('logged_in') !== true) {
			$this->app->redirect('/login');
			exit;
		}
	}
}

// routes.php
$router->group('/admin', function(Router $router) {
	$router->get('/dashboard', [ DashboardController::class, 'index' ]);
	$router->get('/clients', [ ClientController::class, 'index' ]);
	// 更多路由...
}, [ LoggedInMiddleware::class ]);
```

#### 路由参数验证

你是否想防止用户修改 URL 中的值以访问他们不应访问的数据？这可以通过中间件解决！

```php
use flight\Engine;

class RouteSecurityMiddleware {

	protected Engine $app;

	public function __construct(Engine $app) {
		$this->app = $app;
	}

	public function before(array $params) {
		$clientId = $params['clientId'];
		$jobId = $params['jobId'];

		// 在数据库中进行某种查询
		$isValid = !!$this->app->db()->fetchField("SELECT 1 FROM client_jobs WHERE client_id = ? AND job_id = ?", [ $clientId, $jobId ]);

		if($isValid !== true) {
			$this->app->halt(400, '你被阻止了，哈哈！');
		}
	}
}

// routes.php
$router->group('/client/@clientId/job/@jobId', function(Router $router) {
	$router->get('', [ JobController::class, 'view' ]);
	$router->put('', [ JobController::class, 'update' ]);
	$router->delete('', [ JobController::class, 'delete' ]);
	// 更多路由...
}, [ RouteSecurityMiddleware::class ]);
```

## 处理中间件执行

假设你有一个 auth 中间件，你想在用户未认证时将用户重定向到登录页面。你有几个选择：

1. 你可以从中间件函数返回 `false`，Flight 将自动返回 403 Forbidden 错误，但没有自定义内容。
1. 你可以使用 `Flight::redirect()` 将用户重定向到登录页面。
1. 你可以在中间件中创建自定义错误并停止路由执行。

### 简单直接

以下是一个简单的 `return false;` 示例：

```php
class MyMiddleware {
	public function before($params) {
		$hasUserKey = Flight::session()->exists('user');
		if ($hasUserKey === false) {
			return false;
		}

		// 因为结果为 true，一切继续执行
	}
}
```

### 重定向示例

以下是将用户重定向到登录页面的示例：

```php
class MyMiddleware {
	public function before($params) {
		$hasUserKey = Flight::session()->exists('user');
		if ($hasUserKey === false) {
			Flight::redirect('/login');
			exit;
		}
	}
}
```

### 自定义错误示例

假设你需要抛出一个 JSON 错误，因为你正在构建一个 API。你可以这样做：

```php
class MyMiddleware {
	public function before($params) {
		$authorization = Flight::request()->getHeader('Authorization');
		if(empty($authorization)) {
			Flight::jsonHalt(['error' => '你必须登录才能访问此页面。'], 403);
			// 或
			Flight::json(['error' => '你必须登录才能访问此页面。'], 403);
			exit;
			// 或
			Flight::halt(403, json_encode(['error' => '你必须登录才能访问此页面。']);
		}
	}
}
```

## 参见

- [路由](../routing) - 如何将路由映射到控制器并渲染视图。
- [请求](../requests) - 了解如何处理传入的请求。
- [响应](../responses) - 如何自定义 HTTP 响应。
- [依赖注入](../dependency-injection-container) - 简化路由中对象的创建和管理。
- [为什么使用框架？](../why-frameworks) - 了解使用 Flight 这样的框架的好处。
- [中间件执行策略示例](https://www.slimframework.com/docs/v4/concepts/middleware.html#how-does-middleware-work)

## 故障排除

- 如果你在中间件中有重定向，但你的应用似乎没有重定向，请确保在中间件中添加 `exit;` 语句。

## 更新日志

- v3.1：新增中间件支持。
