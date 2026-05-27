---
title: 扩展 Flight
source: https://github.com/flightphp/docs/blob/master/content/v3/en/learn/extending.md
status: 已翻译
---

# 扩展 Flight

## 概述

Flight 被设计为一个可扩展的框架。框架自带一组默认方法和组件，但允许你映射自己的方法、注册自己的类，甚至覆盖现有的类和方法。

## 理解

有两种扩展 Flight 功能的方式：

1. 映射方法 (Mapping Methods) - 用于创建简单的自定义方法，可以从应用的任何地方调用。通常用于需要在代码中任何地方调用的工具函数。
2. 注册类 (Registering Classes) - 用于向 Flight 注册你自己的类。通常用于有依赖关系或需要配置的类。

你也可以覆盖现有的框架方法，以改变其默认行为来更好地满足项目需求。

> 如果你在寻找 DIC（依赖注入容器），请跳转到[依赖注入容器](../dependency-injection-container)页面。

## 基本用法

### 覆盖框架方法

Flight 允许你覆盖其默认功能以适应自己的需求，无需修改任何代码。你可以在[下文](#可映射框架方法)查看所有可以覆盖的方法。

例如，当 Flight 无法将 URL 匹配到路由时，它会调用 `notFound` 方法发送一个通用的 `HTTP 404` 响应。你可以使用 `map` 方法覆盖此行为：

```php
Flight::map('notFound', function() {
  // 显示自定义 404 页面
  include 'errors/404.html';
});
```

Flight 也允许你替换框架的核心组件。例如，你可以用自定义类替换默认的 Router 类：

```php
// 创建你的自定义 Router 类
class MyRouter extends \flight\net\Router {
	// 在此覆盖方法
	// 例如，为 GET 请求创建一个快捷方式，移除 route pass 功能
	public function get($pattern, $callback, $alias = '') {
		return parent::get($pattern, $callback, false, $alias);
	}
}

// 注册你的自定义类
Flight::register('router', MyRouter::class);

// 当 Flight 加载 Router 实例时，它将加载你的类
$myRouter = Flight::router();
$myRouter->get('/hello', function() {
  echo "Hello World!";
}, 'hello_alias');
```

但是，像 `map` 和 `register` 这样的框架方法是不能被覆盖的。如果你尝试这样做会收到错误（同样，参见[下文](#可映射框架方法)的方法列表）。

### 可映射框架方法

以下是框架的完整方法集。包括核心方法（常规静态方法）和可扩展方法（可以被过滤或覆盖的映射方法）。

#### 核心方法

这些方法是框架的核心，不能被覆盖。

```php
Flight::map(string $name, callable $callback, bool $pass_route = false) // 创建自定义框架方法。
Flight::register(string $name, string $class, array $params = [], ?callable $callback = null) // 向框架方法注册一个类。
Flight::unregister(string $name) // 从框架方法中注销一个类。
Flight::before(string $name, callable $callback) // 在框架方法之前添加过滤器。
Flight::after(string $name, callable $callback) // 在框架方法之后添加过滤器。
Flight::path(string $path) // 添加自动加载类的路径。
Flight::get(string $key) // 获取由 Flight::set() 设置的变量。
Flight::set(string $key, mixed $value) // 在 Flight 引擎中设置变量。
Flight::has(string $key) // 检查变量是否已设置。
Flight::clear(array|string $key = []) // 清除变量。
Flight::init() // 将框架初始化回默认设置。
Flight::app() // 获取应用对象实例
Flight::request() // 获取请求对象实例
Flight::response() // 获取响应对象实例
Flight::router() // 获取路由器对象实例
Flight::view() // 获取视图对象实例
```

#### 可扩展方法

```php
Flight::start() // 启动框架。
Flight::stop() // 停止框架并发送响应。
Flight::halt(int $code = 200, string $message = '') // 停止框架，可选状态码和消息。
Flight::route(string $pattern, callable $callback, bool $pass_route = false, string $alias = '') // 将 URL 模式映射到回调。
Flight::post(string $pattern, callable $callback, bool $pass_route = false, string $alias = '') // 将 POST 请求 URL 模式映射到回调。
Flight::put(string $pattern, callable $callback, bool $pass_route = false, string $alias = '') // 将 PUT 请求 URL 模式映射到回调。
Flight::patch(string $pattern, callable $callback, bool $pass_route = false, string $alias = '') // 将 PATCH 请求 URL 模式映射到回调。
Flight::delete(string $pattern, callable $callback, bool $pass_route = false, string $alias = '') // 将 DELETE 请求 URL 模式映射到回调。
Flight::group(string $pattern, callable $callback) // 创建 URL 分组，pattern 必须是字符串。
Flight::getUrl(string $name, array $params = []) // 基于路由别名生成 URL。
Flight::redirect(string $url, int $code) // 重定向到另一个 URL。
Flight::download(string $filePath) // 下载文件。
Flight::render(string $file, array $data, ?string $key = null) // 渲染模板文件。
Flight::error(Throwable $error) // 发送 HTTP 500 响应。
Flight::notFound() // 发送 HTTP 404 响应。
Flight::etag(string $id, string $type = 'string') // 执行 ETag HTTP 缓存。
Flight::lastModified(int $time) // 执行上次修改 HTTP 缓存。
Flight::json(mixed $data, int $code = 200, bool $encode = true, string $charset = 'utf8', int $option) // 发送 JSON 响应。
Flight::jsonp(mixed $data, string $param = 'jsonp', int $code = 200, bool $encode = true, string $charset = 'utf8', int $option) // 发送 JSONP 响应。
Flight::jsonHalt(mixed $data, int $code = 200, bool $encode = true, string $charset = 'utf8', int $option) // 发送 JSON 响应并停止框架。
Flight::onEvent(string $event, callable $callback) // 注册事件监听器。
Flight::triggerEvent(string $event, ...$args) // 触发事件。
```

任何使用 `map` 和 `register` 添加的自定义方法也可以被过滤。有关如何过滤这些方法的示例，请参见[过滤方法](../filtering)指南。

#### 可扩展框架类

有几个类可以通过扩展它们并注册你自己的类来覆盖功能。这些类包括：

```php
Flight::app() // 应用类 - 扩展 flight\Engine 类
Flight::request() // 请求类 - 扩展 flight\net\Request 类
Flight::response() // 响应类 - 扩展 flight\net\Response 类
Flight::router() // 路由类 - 扩展 flight\net\Router 类
Flight::view() // 视图类 - 扩展 flight\template\View 类
Flight::eventDispatcher() // 事件分发器类 - 扩展 flight\core\Dispatcher 类
```

### 映射自定义方法

要映射你自己的简单自定义方法，使用 `map` 函数：

```php
// 映射你的方法
Flight::map('hello', function (string $name) {
  echo "hello $name!";
});

// 调用你的自定义方法
Flight::hello('Bob');
```

虽然可以创建简单的自定义方法，但建议只在 PHP 中创建标准函数。这在 IDE 中有自动完成功能，且更易于阅读。
上述代码的等效写法是：

```php
function hello(string $name) {
  echo "hello $name!";
}

hello('Bob');
```

这更多用于当需要将变量传递到方法中以获取预期值时。像下面这样使用 `register()` 方法更多是为了传递配置然后调用预配置的类。

### 注册自定义类

要注册自己的类并配置它，使用 `register` 函数。相比于 `map()`，它的好处是可以在调用此函数时复用同一个类（例如 `Flight::db()` 共享同一实例会很有帮助）。

```php
// 注册你的类
Flight::register('user', User::class);

// 获取你的类实例
$user = Flight::user();
```

register 方法还允许你向类的构造函数传递参数。所以当加载自定义类时，它会预先初始化。你可以通过传入一个额外的数组来定义构造函数参数。以下是加载数据库连接的示例：

```php
// 使用构造函数参数注册类
Flight::register('db', PDO::class, ['mysql:host=localhost;dbname=test', 'user', 'pass']);

// 获取你的类实例
// 这将创建一个具有定义参数的对象
//
// new PDO('mysql:host=localhost;dbname=test','user','pass');
//
$db = Flight::db();

// 如果你在后面的代码中需要它，只需再次调用相同的方法
class SomeController {
  public function __construct() {
	$this->db = Flight::db();
  }
}
```

如果你传入额外的回调参数，它将在类构造完成后立即执行。这允许你为新对象执行任何设置过程。回调函数接受一个参数，即新对象的实例。

```php
// 回调将接收被构造的对象
Flight::register(
  'db',
  PDO::class,
  ['mysql:host=localhost;dbname=test', 'user', 'pass'],
  function (PDO $db) {
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  }
);
```

默认情况下，每次加载你的类都会获得一个共享实例。要获取类的新实例，只需传入 `false` 作为参数：

```php
// 类的共享实例
$shared = Flight::db();

// 类的新实例
$new = Flight::db(false);
```

> **注意**：请记住，映射方法的优先级高于注册类。如果你使用相同的名称声明了两者，只有映射方法会被调用。

### 示例

以下是一些如何用核心未内置的功能扩展 Flight 的示例。

#### 日志记录

Flight 没有内置的日志系统，但是将日志库与 Flight 配合使用非常简单。以下是使用 Monolog 库的示例：

```php
// services.php

// 向 Flight 注册日志记录器
Flight::register('log', Monolog\Logger::class, [ 'name' ], function(Monolog\Logger $log) {
    $log->pushHandler(new Monolog\Handler\StreamHandler('path/to/your.log', Monolog\Logger::WARNING));
});
```

现在它已注册，你可以在应用中使用它：

```php
// 在你的控制器或路由中
Flight::log()->warning('This is a warning message');
```

这会将消息记录到你指定的日志文件中。如果你想在发生错误时记录日志怎么办？你可以使用 `error` 方法：

```php
// 在你的控制器或路由中
Flight::map('error', function(Throwable $ex) {
	Flight::log()->error($ex->getMessage());
	// 显示你的自定义错误页面
	include 'errors/500.html';
});
```

你还可以使用 `before` 和 `after` 方法创建一个基本的 APM（应用性能监控）系统：

```php
// 在你的 services.php 文件中

Flight::before('start', function() {
	Flight::set('start_time', microtime(true));
});

Flight::after('start', function() {
	$end = microtime(true);
	$start = Flight::get('start_time');
	Flight::log()->info('Request '.Flight::request()->url.' took ' . round($end - $start, 4) . ' seconds');

	// 你也可以添加请求或响应头记录它们
	// （注意，如果有很多请求，这将是大量数据）
	Flight::log()->info('Request Headers: ' . json_encode(Flight::request()->headers));
	Flight::log()->info('Response Headers: ' . json_encode(Flight::response()->headers));
});
```

#### 缓存

Flight 没有内置的缓存系统，但是将缓存库与 Flight 配合使用非常简单。以下是使用 [PHP File Cache](../../awesome-plugins/php_file_cache) 库的示例：

```php
// services.php

// 向 Flight 注册缓存
Flight::register('cache', \flight\Cache::class, [ __DIR__ . '/../cache/' ], function(\flight\Cache $cache) {
    $cache->setDevMode(ENVIRONMENT === 'development');
});
```

现在它已注册，你可以在应用中使用它：

```php
// 在你的控制器或路由中
$data = Flight::cache()->get('my_cache_key');
if (empty($data)) {
	// 执行一些处理来获取数据
	$data = [ 'some' => 'data' ];
	Flight::cache()->set('my_cache_key', $data, 3600); // 缓存 1 小时
}
```

#### 简单的 DIC 对象实例化

如果你在应用中使用 DIC（依赖注入容器），你可以借助 Flight 来实例化对象。以下是使用 [Dice](https://github.com/level-2/Dice) 库的示例：

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

很炫酷吧？

## 参见

- [依赖注入容器](../dependency-injection-container) - 如何在 Flight 中使用 DIC。
- [文件缓存](../../awesome-plugins/php_file_cache) - 将缓存库与 Flight 配合使用的示例。

## 故障排除

- 记住，映射方法的优先级高于注册类。如果你使用相同的名称声明了两者，只有映射方法会被调用。

## 更新日志

- v2.0 - 初始发布。
