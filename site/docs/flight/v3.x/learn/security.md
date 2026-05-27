---
title: 安全
source: https://github.com/flightphp/docs/blob/master/content/v3/en/learn/security.md
status: 已翻译
---

# 安全

## 概述

对于 Web 应用程序，安全性至关重要。你需要确保你的应用安全且用户数据受到保护。Flight 提供了许多功能来帮助你保护 Web 应用程序。

## 理解

在构建 Web 应用程序时，你应该注意一些常见的安全威胁。一些最常见的威胁包括：

- 跨站请求伪造 (CSRF)
- 跨站脚本攻击 (XSS)
- SQL 注入
- 跨源资源共享 (CORS)

[模板](../templates)通过默认转义输出来帮助防御 XSS，这样你就不需要记住去做了。[会话](../../awesome-plugins/session)可以通过在用户会话中存储 CSRF 令牌来帮助防御 CSRF，如下文所述。在 PDO 中使用预处理语句可以帮助防止 SQL 注入攻击（或使用 [PdoWrapper](../pdo-wrapper) 类中的便捷方法）。CORS 可以在 `Flight::start()` 被调用之前用一个简单的钩子来处理。

所有这些方法协同工作，帮助确保你的 Web 应用安全。学习和理解安全最佳实践应始终是你关注的重点。

## 基本用法

### 响应头

HTTP 响应头是保护 Web 应用最简单的方法之一。你可以使用响应头来防止点击劫持、XSS 和其他攻击。有几种方法可以将这些响应头添加到应用中。

有两个很棒的网站可以检查你响应头的安全性：[securityheaders.com](https://securityheaders.com/) 和 [observatory.mozilla.org](https://observatory.mozilla.org/)。设置好下面的代码后，你可以轻松地用这两个网站验证你的响应头是否正常工作。

#### 手动添加

你可以通过在 `Flight\Response` 对象上使用 `header` 方法手动添加这些响应头。

```php
// 设置 X-Frame-Options 响应头以防止点击劫持
Flight::response()->header('X-Frame-Options', 'SAMEORIGIN');

// 设置 Content-Security-Policy 响应头以防止 XSS
// 注意：这个响应头可能变得非常复杂，所以你需要
//  在互联网上查阅适用于你的应用的示例
Flight::response()->header("Content-Security-Policy", "default-src 'self'");

// 设置 X-XSS-Protection 响应头以防止 XSS
Flight::response()->header('X-XSS-Protection', '1; mode=block');

// 设置 X-Content-Type-Options 响应头以防止 MIME 嗅探
Flight::response()->header('X-Content-Type-Options', 'nosniff');

// 设置 Referrer-Policy 响应头来控制发送多少引用信息
Flight::response()->header('Referrer-Policy', 'no-referrer-when-downgrade');

// 设置 Strict-Transport-Security 响应头以强制使用 HTTPS
Flight::response()->header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

// 设置 Permissions-Policy 响应头来控制可以使用哪些功能和 API
Flight::response()->header('Permissions-Policy', 'geolocation=()');
```

这些可以添加到 `routes.php` 或 `index.php` 文件的顶部。

#### 作为过滤器/钩子添加

你也可以像下面这样将它们添加到过滤器/钩子中：

```php
// 在过滤器中添加响应头
Flight::before('start', function() {
	Flight::response()->header('X-Frame-Options', 'SAMEORIGIN');
	Flight::response()->header("Content-Security-Policy", "default-src 'self'");
	Flight::response()->header('X-XSS-Protection', '1; mode=block');
	Flight::response()->header('X-Content-Type-Options', 'nosniff');
	Flight::response()->header('Referrer-Policy', 'no-referrer-when-downgrade');
	Flight::response()->header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
	Flight::response()->header('Permissions-Policy', 'geolocation=()');
});
```

#### 作为中间件添加

你也可以将它们添加为中间件类，这对于应用到哪些路由提供了最大的灵活性。一般来说，这些响应头应该应用于所有 HTML 和 API 响应。

```php
// app/middlewares/SecurityHeadersMiddleware.php

namespace app\middlewares;

use flight\Engine;

class SecurityHeadersMiddleware
{
	protected Engine $app;

	public function __construct(Engine $app)
	{
		$this->app = $app;
	}

	public function before(array $params): void
	{
		$response = $this->app->response();
		$response->header('X-Frame-Options', 'SAMEORIGIN');
		$response->header("Content-Security-Policy", "default-src 'self'");
		$response->header('X-XSS-Protection', '1; mode=block');
		$response->header('X-Content-Type-Options', 'nosniff');
		$response->header('Referrer-Policy', 'no-referrer-when-downgrade');
		$response->header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
		$response->header('Permissions-Policy', 'geolocation=()');
	}
}

// index.php 或设置路由的地方
// 说明，这个空字符串组作为所有路由的全局中间件。
// 当然你也可以只添加到特定路由。
Flight::group('', function(Router $router) {
	$router->get('/users', [ 'UserController', 'getUsers' ]);
	// 更多路由
}, [ SecurityHeadersMiddleware::class ]);
```

### 跨站请求伪造 (CSRF)

跨站请求伪造 (CSRF) 是一种攻击类型，恶意网站可以让用户的浏览器向你的网站发送请求。这可用于在用户不知情的情况下在你的网站上执行操作。Flight 不提供内置的 CSRF 保护机制，但你可以通过中间件轻松实现自己的。

#### 设置

首先，你需要生成一个 CSRF 令牌并将其存储在用户会话中。然后你可以在表单中使用此令牌，并在提交表单时进行检查。我们将使用 [flightphp/session](../../awesome-plugins/session) 插件来管理会话。

```php
// 生成 CSRF 令牌并将其存储在用户的会话中
// (假设你已经创建了一个会话对象并将其附加到 Flight)
// 更多信息请参见会话文档
Flight::register('session', flight\Session::class);

// 每个会话只需要生成一个令牌（这样可以在
// 同一用户的多个标签页和请求中生效）
if(Flight::session()->get('csrf_token') === null) {
	Flight::session()->set('csrf_token', bin2hex(random_bytes(32)) );
}
```

##### 使用默认的 PHP Flight 模板

```html
<!-- 在你的表单中使用 CSRF 令牌 -->
<form method="post">
	<input type="hidden" name="csrf_token" value="<?= Flight::session()->get('csrf_token') ?>">
	<!-- 其他表单字段 -->
</form>
```

##### 使用 Latte

你也可以设置自定义函数在 Latte 模板中输出 CSRF 令牌。

```php

Flight::map('render', function(string $template, array $data, ?string $block): void {
	$latte = new Latte\Engine;

	// 其他配置...

	// 设置自定义函数输出 CSRF 令牌
	$latte->addFunction('csrf', function() {
		$csrfToken = Flight::session()->get('csrf_token');
		return new \Latte\Runtime\Html('<input type="hidden" name="csrf_token" value="' . $csrfToken . '">');
	});

	$latte->render($finalPath, $data, $block);
});
```

现在在你的 Latte 模板中，你可以使用 `csrf()` 函数输出 CSRF 令牌。

```html
<form method="post">
	{csrf()}
	<!-- 其他表单字段 -->
</form>
```

#### 检查 CSRF 令牌

你可以使用几种方法来检查 CSRF 令牌。

##### 中间件

```php
// app/middlewares/CsrfMiddleware.php

namespace app\middleware;

use flight\Engine;

class CsrfMiddleware
{
	protected Engine $app;

	public function __construct(Engine $app)
	{
		$this->app = $app;
	}

	public function before(array $params): void
	{
		if($this->app->request()->method == 'POST') {
			$token = $this->app->request()->data->csrf_token;
			if($token !== $this->app->session()->get('csrf_token')) {
				$this->app->halt(403, 'Invalid CSRF token');
			}
		}
	}
}

// index.php 或设置路由的地方
use app\middlewares\CsrfMiddleware;

Flight::group('', function(Router $router) {
	$router->get('/users', [ 'UserController', 'getUsers' ]);
	// 更多路由
}, [ CsrfMiddleware::class ]);
```

##### 事件过滤器

```php
// 此中间件检查请求是否为 POST 请求，如果是，则检查 CSRF 令牌是否有效
Flight::before('start', function() {
	if(Flight::request()->method == 'POST') {

		// 从表单值中捕获 csrf 令牌
		$token = Flight::request()->data->csrf_token;
		if($token !== Flight::session()->get('csrf_token')) {
			Flight::halt(403, 'Invalid CSRF token');
			// 或者 JSON 响应
			Flight::jsonHalt(['error' => 'Invalid CSRF token'], 403);
		}
	}
});
```

### 跨站脚本攻击 (XSS)

跨站脚本攻击 (XSS) 是一种攻击类型，恶意表单输入可以向你的网站注入代码。大多数此类攻击机会来自最终用户填写的表单值。你**永远不应该**信任用户的输出！始终假设他们都是世界上最好的黑客。他们可以向你的页面注入恶意 JavaScript 或 HTML。这些代码可用于窃取用户信息或在你的网站上执行操作。使用 Flight 的视图类或其他模板引擎如 [Latte](../../awesome-plugins/latte)，你可以轻松转义输出来防止 XSS 攻击。

```php
// 假设用户很聪明，尝试将以下内容作为他们的名字
$name = '<script>alert("XSS")</script>';

// 这将转义输出
Flight::view()->set('name', $name);
// 这将输出: &lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;

// 如果你使用类似 Latte 注册为视图类，它也会自动转义。
Flight::view()->render('template', ['name' => $name]);
```

### SQL 注入

SQL 注入是一种攻击类型，恶意用户可以向你的数据库注入 SQL 代码。这可用于从你的数据库中窃取信息或在你的数据库上执行操作。同样，你**永远不应该**信任用户的输入！始终假设他们都是满怀恶意的。在 `PDO` 对象中使用预处理语句将防止 SQL 注入。

```php
// 假设你已将 Flight::db() 注册为你的 PDO 对象
$statement = Flight::db()->prepare('SELECT * FROM users WHERE username = :username');
$statement->execute([':username' => $username]);
$users = $statement->fetchAll();

// 如果你使用 PdoWrapper 类，这可以在一行内轻松完成
$users = Flight::db()->fetchAll('SELECT * FROM users WHERE username = :username', [ 'username' => $username ]);

// 你也可以使用带有 ? 占位符的 PDO 对象
$statement = Flight::db()->fetchAll('SELECT * FROM users WHERE username = ?', [ $username ]);
```

#### 不安全示例

以下是我们为什么使用 SQL 预处理语句来防御类似下面的简单示例：

```php
// 最终用户填写了一个 Web 表单。
// 对于表单的值，黑客输入了类似以下的内容：
$username = "' OR 1=1; -- ";

$sql = "SELECT * FROM users WHERE username = '$username' LIMIT 5";
$users = Flight::db()->fetchAll($sql);
// 构建查询后，它看起来像这样
// SELECT * FROM users WHERE username = '' OR 1=1; -- LIMIT 5

// 看起来很奇怪，但它是一个有效的查询。实际上，
// 这是一个非常常见的 SQL 注入攻击，将返回所有用户。

var_dump($users); // 这将输出数据库中的所有用户，而不仅仅是单个用户名
```

### JSONP 回调验证

如果你使用 Flight 的 `Flight::jsonp()` 方法，请注意 Flight 会根据严格的白名单正则表达式 (`/^[A-Za-z_$][\w$.]{0,127}$/`) 验证 JSONP 回调参数名称。任何不匹配此模式的回调名称都将导致 Flight 抛出异常，防止通过恶意回调值注入任意 JavaScript。

此验证是内置的，无需额外配置，但在调试 JSONP 端点的意外错误时值得了解。

### CORS

跨源资源共享 (CORS) 是一种机制，允许网页上的许多资源（如字体、JavaScript 等）从资源来源域之外的另一个域请求。Flight 没有内置功能，但这可以通过在 `Flight::start()` 方法调用之前运行的钩子轻松处理。

```php
// app/utils/CorsUtil.php

namespace app\utils;

class CorsUtil
{
	public function set(array $params): void
	{
		$request = Flight::request();
		$response = Flight::response();
		if ($request->getVar('HTTP_ORIGIN') !== '') {
			$this->allowOrigins();
			$response->header('Access-Control-Allow-Credentials', 'true');
			$response->header('Access-Control-Max-Age', '86400');
		}

		if ($request->method === 'OPTIONS') {
			if ($request->getVar('HTTP_ACCESS_CONTROL_REQUEST_METHOD') !== '') {
				$response->header(
					'Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD'
				);
			}
			if ($request->getVar('HTTP_ACCESS_CONTROL_REQUEST_HEADERS') !== '') {
				$response->header(
					"Access-Control-Allow-Headers",
					$request->getVar('HTTP_ACCESS_CONTROL_REQUEST_HEADERS')
				);
			}

			$response->status(200);
			$response->send();
			exit;
		}
	}

	private function allowOrigins(): void
	{
		// 在这里自定义你允许的主机。
		$allowed = [
			'capacitor://localhost',
			'ionic://localhost',
			'http://localhost',
			'http://localhost:4200',
			'http://localhost:8080',
			'http://localhost:8100',
		];

		$request = Flight::request();

		if (in_array($request->getVar('HTTP_ORIGIN'), $allowed, true) === true) {
			$response = Flight::response();
			$response->header("Access-Control-Allow-Origin", $request->getVar('HTTP_ORIGIN'));
		}
	}
}

// index.php 或设置路由的地方
$CorsUtil = new CorsUtil();

// 这需要在 start 运行之前执行。
Flight::before('start', [ $CorsUtil, 'setupCors' ]);
```

### Flight 配置加固

Flight 暴露了几个具有直接安全影响的引擎设置。正确设置这些是加固应用的最简单方法之一。

#### `flight.allow_method_override`

默认情况下，Flight 允许客户端使用 `X-HTTP-Method-Override` 请求头或 POST 体中的 `_method` 字段覆盖请求的 HTTP 方法。虽然这对只能发送 `GET`/`POST` 的 HTML 表单很方便，但如果你不期望这样，它可能是危险的——攻击者可以通过常规表单伪造 `DELETE` 或 `PUT` 请求。

如果你的应用不依赖此行为（例如，你在构建由现代客户端或可以发送任何 HTTP 动词的 JavaScript 前端消费的 API），你应该禁用它：

```php
// 在你的 index.php 或引导文件中，在 Flight::start() 之前
Flight::set('flight.allow_method_override', false);
```

默认值为 `true` 是为了向后兼容，但对于任何不显式需要覆盖功能的应用，**强烈建议将其设置为 `false`**。

#### `flight.debug`

Flight 有一个 `flight.debug` 设置，控制当发生未处理的异常时，是否在浏览器中呈现详细的错误信息（异常消息、代码和完整堆栈跟踪）。默认值为 `false`，这意味着只显示通用的 `500 Internal Server Error` 消息——不会向客户端泄露内部细节。

切勿在生产服务器上启用此功能。仅在本地或测试环境中使用：

```php
// 仅适用于本地开发——切勿在生产环境中使用
Flight::set('flight.debug', true);
```

当 `flight.debug` 为 `false`（默认值）时，你仍然可以通过启用 `flight.log_errors` 来捕获错误：

```php
// 在服务器端记录错误，而不向客户端暴露
Flight::set('flight.debug', false);
Flight::set('flight.log_errors', true);
```

#### 推荐的生产配置

```php
// index.php 或 app/config/config.php
Flight::set('flight.allow_method_override', false);
Flight::set('flight.debug', false);
Flight::set('flight.log_errors', true);
```

### 错误处理

在生产环境中隐藏敏感的错误细节，以避免向攻击者泄露信息。在生产环境中，记录错误而不是显示它们，将 `display_errors` 设为 `0`。

```php
// 在你的 bootstrap.php 或 index.php 中

// 将此添加到你的 app/config/config.php
$environment = ENVIRONMENT;
if ($environment === 'production') {
    ini_set('display_errors', 0); // 禁用错误显示
    ini_set('log_errors', 1);     // 改为记录错误
    ini_set('error_log', '/path/to/error.log');
}

// 在你的路由或控制器中
// 使用 Flight::halt() 进行受控的错误响应
Flight::halt(403, 'Access denied');
```

### 输入清理

永远不要信任用户输入。在处理之前使用 [filter_var](https://www.php.net/manual/en/function.filter-var.php) 进行清理，以防止恶意数据潜入。

```php

// 假设一个 $_POST 请求带有 $_POST['input'] 和 $_POST['email']

// 清理字符串输入
$clean_input = filter_var(Flight::request()->data->input, FILTER_SANITIZE_STRING);
// 清理电子邮件
$clean_email = filter_var(Flight::request()->data->email, FILTER_SANITIZE_EMAIL);
```

### 密码哈希

使用 PHP 内置函数如 [password_hash](https://www.php.net/manual/en/function.password-hash.php) 和 [password_verify](https://www.php.net/manual/en/function.password-verify.php) 安全存储密码并进行安全验证。密码永远不应以明文存储，也不应使用可逆方法加密。哈希可以确保即使你的数据库被攻破，实际密码仍然受到保护。

```php
$password = Flight::request()->data->password;
// 存储时（例如注册期间）对密码进行哈希
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// 验证密码（例如登录期间）
if (password_verify($password, $stored_hash)) {
    // 密码匹配
}
```

### 速率限制

通过使用缓存限制请求速率来防御暴力攻击或拒绝服务攻击。

```php
// 假设你已安装并注册 flightphp/cache
// 在过滤器中使用 flightphp/cache
Flight::before('start', function() {
    $cache = Flight::cache();
    $ip = Flight::request()->ip;
    $key = "rate_limit_{$ip}";
    $attempts = (int) $cache->retrieve($key);
    
    if ($attempts >= 10) {
        Flight::halt(429, 'Too many requests');
    }
    
    $cache->set($key, $attempts + 1, 60); // 60 秒后重置
});
```

## 参见

- [会话](../../awesome-plugins/session) - 如何安全管理用户会话。
- [模板](../templates) - 使用模板自动转义输出以防止 XSS。
- [PDO 包装器](../pdo-wrapper) - 使用预处理语句简化数据库交互。
- [中间件](../middleware) - 如何使用中间件简化安全响应头的添加过程。
- [响应](../responses) - 如何使用安全响应头自定义 HTTP 响应。
- [请求](../requests) - 如何处理和清理用户输入。
- [filter_var](https://www.php.net/manual/en/function.filter-var.php) - 用于输入清理的 PHP 函数。
- [password_hash](https://www.php.net/manual/en/function.password-hash.php) - 用于安全密码哈希的 PHP 函数。
- [password_verify](https://www.php.net/manual/en/function.password-verify.php) - 用于验证哈希密码的 PHP 函数。

## 故障排除

- 有关 Flight 框架组件问题的故障排除信息，请参考上面的"参见"部分。

## 更新日志

- v3.18.1 - 新增 Flight 配置加固部分，涵盖 `flight.allow_method_override`、`flight.debug` 和 JSONP 回调验证。
- v3.1.0 - 新增 CORS、错误处理、输入清理、密码哈希和速率限制部分。
- v2.0 - 为默认视图添加输出转义以防止 XSS。
