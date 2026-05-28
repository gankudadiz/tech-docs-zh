---
title: 响应
source: https://github.com/flightphp/docs/blob/master/content/v3/en/learn/responses.md
status: 已翻译
---

# 响应

## 概述

Flight 帮助你生成部分响应头，但你对发送回用户的内容拥有大部分控制权。大多数时候你会直接访问 `response()` 对象，但 Flight 也提供了一些辅助方法来帮助你设置一些响应头。

## 理解

用户向你应用发送[请求](requests)后，你需要为他们生成适当的响应。他们向你发送了诸如他们偏好的语言、他们是否能处理某些类型的压缩、他们的用户代理等信息，处理完这一切后，是时候向他们发回适当的响应了。这可以是设置响应头、输出 HTML 或 JSON 格式的正文，或者将他们重定向到某个页面。

## 基本用法

### 发送响应正文

Flight 使用 `ob_start()` 来缓冲输出。这意味着你可以使用 `echo` 或 `print` 向用户发送响应，Flight 会捕获它并用适当的响应头发送回给用户。

```php

// 这将向用户浏览器发送 "Hello, World!"
Flight::route('/', function() {
	echo "Hello, World!";
});

// HTTP/1.1 200 OK
// Content-Type: text/html
//
// Hello, World!
```

作为替代方案，你也可以调用 `write()` 方法来添加到正文。

```php

// 这将向用户浏览器发送 "Hello, World!"
Flight::route('/', function() {
	// 有点冗长，但有时能胜任工作
	Flight::response()->write("Hello, World!");

	// 如果你想在此时获取已设置的正文内容
	// 可以这样操作
	$body = Flight::response()->getBody();
});
```

### JSON

Flight 提供了对发送 JSON 和 JSONP 响应的支持。要发送 JSON 响应，你需要传递一些要编码为 JSON 的数据：

```php
Flight::route('/@companyId/users', function(int $companyId) {
	// 例如，从数据库中拉取用户数据
	$users = Flight::db()->fetchAll("SELECT id, first_name, last_name FROM users WHERE company_id = ?", [ $companyId ]);

	Flight::json($users);
});
// [{"id":1,"first_name":"Bob","last_name":"Jones"}, /* 更多用户 */ ]
```

> **注意**：默认情况下，Flight 将发送 `Content-Type: application/json` 响应头。它还将使用 `JSON_THROW_ON_ERROR` 和 `JSON_UNESCAPED_SLASHES` 标志来编码 JSON。

#### 带状态码的 JSON

你还可以传入状态码作为第二个参数：

```php
Flight::json(['id' => 123], 201);
```

#### 带美化输出的 JSON

你也可以在最后一个位置传入参数来启用美化输出：

```php
Flight::json(['id' => 123], 200, true, 'utf-8', JSON_PRETTY_PRINT);
```

#### 更改 JSON 参数顺序

`Flight::json()` 是一个历史遗留方法，但 Flight 的目标是为项目保持向后兼容性。
如果你想要重新定义参数顺序以使用更简单的语法，其实很简单，你可以像[任何其他 Flight 方法](extending)一样重新映射 JSON 方法：

```php
Flight::map('json', function($data, $code = 200, $options = 0) {

	// 现在使用 json() 方法时不需要 `true, 'utf-8'` 了！
	Flight::_json($data, $code, true, 'utf-8', $options);
}

// 现在可以这样使用
Flight::json(['id' => 123], 200, JSON_PRETTY_PRINT);
```

#### JSON 并停止执行

_v3.10.0_

如果你想发送 JSON 响应并停止执行，可以使用 `jsonHalt()` 方法。
这对于检查某种类型的授权很有用，如果用户未经授权，你可以立即发送 JSON 响应，清除现有的正文内容并停止执行。

```php
Flight::route('/users', function() {
	$authorized = someAuthorizationCheck();
	// 检查用户是否已授权
	if($authorized === false) {
		Flight::jsonHalt(['error' => 'Unauthorized'], 401);
		// 这里不需要 exit;
	}

	// 继续执行路由的其余部分
});
```

在 v3.10.0 之前，你需要这样做：

```php
Flight::route('/users', function() {
	$authorized = someAuthorizationCheck();
	// 检查用户是否已授权
	if($authorized === false) {
		Flight::halt(401, json_encode(['error' => 'Unauthorized']));
	}

	// 继续执行路由的其余部分
});
```

### 清除响应正文

如果你想清除响应正文，可以使用 `clearBody` 方法：

```php
Flight::route('/', function() {
	if($someCondition) {
		Flight::response()->write("Hello, World!");
	} else {
		Flight::response()->clearBody();
	}
});
```

上述用例可能不常见，但如果在[中间件](middleware)中使用可能更常见。

### 对响应正文运行回调

你可以使用 `addResponseBodyCallback` 方法对响应正文运行回调：

```php
Flight::route('/users', function() {
	$db = Flight::db();
	$users = $db->fetchAll("SELECT * FROM users");
	Flight::render('users_table', ['users' => $users]);
});

// 这将为所有路由的响应进行 gzip 压缩
Flight::response()->addResponseBodyCallback(function($body) {
	return gzencode($body, 9);
});
```

你可以添加多个回调，它们将按照添加的顺序运行。由于这可以接受任何[可调用对象](https://www.php.net/manual/en/language.types.callable.php)，它可以接受一个类数组 `[ $class, 'method' ]`、一个闭包 `$strReplace = function($body) { str_replace('hi', 'there', $body); };`，或者一个函数名 `'minify'`（如果你有一个用于压缩 HTML 代码的函数）。

**注意**：如果你使用 `flight.v2.output_buffering` 配置选项，路由回调将无法工作。

#### 特定路由回调

如果你只希望将其应用于特定路由，可以在路由本身中添加回调：

```php
Flight::route('/users', function() {
	$db = Flight::db();
	$users = $db->fetchAll("SELECT * FROM users");
	Flight::render('users_table', ['users' => $users]);

	// 这将仅对该路由的响应进行 gzip 压缩
	Flight::response()->addResponseBodyCallback(function($body) {
		return gzencode($body, 9);
	});
});
```

#### 中间件选项

你还可以使用[中间件](middleware)通过中间件将回调应用于所有路由：

```php
// MinifyMiddleware.php
class MinifyMiddleware {
	public function before() {
		// 在这里对 response() 对象应用回调。
		Flight::response()->addResponseBodyCallback(function($body) {
			return $this->minify($body);
		});
	}

	protected function minify(string $body): string {
		// 以某种方式压缩正文
		return $body;
	}
}

// index.php
Flight::group('/users', function() {
	Flight::route('', function() { /* ... */ });
	Flight::route('/@id', function($id) { /* ... */ });
}, [ new MinifyMiddleware() ]);
```

### 状态码

你可以使用 `status` 方法设置响应的状态码：

```php
Flight::route('/@id', function($id) {
	if($id == 123) {
		Flight::response()->status(200);
		echo "Hello, World!";
	} else {
		Flight::response()->status(403);
		echo "Forbidden";
	}
});
```

如果你想获取当前的状态码，可以不带参数调用 `status` 方法：

```php
Flight::response()->status(); // 200
```

### 设置响应头

你可以使用 `header` 方法设置响应头，例如响应的内容类型：

```php
// 这将向用户浏览器发送纯文本形式的 "Hello, World!"
Flight::route('/', function() {
	Flight::response()->header('Content-Type', 'text/plain');
	// 或
	Flight::response()->setHeader('Content-Type', 'text/plain');
	echo "Hello, World!";
});
```

### 重定向

你可以使用 `redirect()` 方法并传入一个新 URL 来重定向当前请求：

```php
Flight::route('/login', function() {
	$username = Flight::request()->data->username;
	$password = Flight::request()->data->password;
	$passwordConfirm = Flight::request()->data->password_confirm;

	if($password !== $passwordConfirm) {
		Flight::redirect('/new/location');
		return; // 这是必要的，确保下面的功能不执行
	}

	// 添加新用户...
	Flight::db()->runQuery("INSERT INTO users ....");
	Flight::redirect('/admin/dashboard');
});
```

> **注意**：默认情况下，Flight 发送 HTTP 303（"See Other"）状态码。你可以选择设置自定义状态码：

```php
Flight::redirect('/new/location', 301); // 永久重定向
```

### 停止路由执行

你可以在任何位置通过调用 `halt` 方法立即停止框架执行：

```php
Flight::halt();
```

你还可以指定可选的 `HTTP` 状态码和消息：

```php
Flight::halt(200, 'Be right back...');
```

调用 `halt` 将丢弃之前的任何响应内容并停止所有执行。
如果你想停止框架但输出当前响应，可以使用 `stop` 方法：

```php
Flight::stop($httpStatusCode = null);
```

> **注意**：`Flight::stop()` 有一些奇怪的行为，例如它会输出响应但继续执行你的脚本，这可能不是你想要的结果。你可以在调用 `Flight::stop()` 后使用 `exit` 或 `return` 来防止进一步执行，但通常建议使用 `Flight::halt()`。

这将保存响应头键值对到响应对象中。在请求生命周期结束时，它将构建响应头并发送响应。

## 高级用法

### 立即发送响应头

有时你可能需要对响应头进行一些自定义处理，并且需要在你正在操作的代码行上立即发送响应头。如果你正在设置[流式路由](routing)，这可能是你需要的。这可以通过 `response()->setRealHeader()` 实现。

```php
Flight::route('/', function() {
	Flight::response()->setRealHeader('Content-Type: text/plain');
	echo 'Streaming response...';
	sleep(5);
	echo 'Done!';
})->stream();
```

### JSONP

对于 JSONP 请求，你可以选择传入你用于定义回调函数的查询参数名称：

```php
Flight::jsonp(['id' => 123], 'q');
```

这样，当使用 `?q=my_func` 发起 GET 请求时，你应该收到以下输出：

```javascript
my_func({"id":123});
```

如果你不传入查询参数名称，它将默认为 `jsonp`。

> **注意**：如果你在 2025 年及以后仍在使用 JSONP 请求，请跳进聊天室告诉我们为什么！我们喜欢听一些好的实战/恐怖故事！

### 清除响应数据

你可以使用 `clear()` 方法清除响应正文和响应头。这将清除分配给响应的所有响应头，清除响应正文，并将状态码设置为 `200`。

```php
Flight::response()->clear();
```

#### 仅清除响应正文

如果你只想清除响应正文，可以使用 `clearBody()` 方法：

```php
// 这将仍然保留 response() 对象上设置的所有响应头。
Flight::response()->clearBody();
```

### HTTP 缓存

Flight 为 HTTP 级别的缓存提供了内置支持。如果缓存条件满足，Flight 将返回 HTTP `304 Not Modified` 响应。下次客户端请求相同资源时，它们将被提示使用本地缓存的版本。

#### 路由级别缓存

如果你想缓存整个响应，可以使用 `cache()` 方法并传入缓存时间。

```php

// 这将缓存响应 5 分钟
Flight::route('/news', function () {
  Flight::response()->cache(time() + 300);
  echo 'This content will be cached.';
});

// 或者，你可以使用一个会被传递给 strtotime() 方法的字符串
Flight::route('/news', function () {
  Flight::response()->cache('+5 minutes');
  echo 'This content will be cached.';
});
```

### Last-Modified

你可以使用 `lastModified` 方法并传入 UNIX 时间戳来设置页面上次修改的日期和时间。客户端将继续使用其缓存，直到 last modified 值发生变化。

```php
Flight::route('/news', function () {
  Flight::lastModified(1234567890);
  echo 'This content will be cached.';
});
```

### ETag

`ETag` 缓存类似于 `Last-Modified`，只是你可以为资源指定任何你想要的 ID：

```php
Flight::route('/news', function () {
  Flight::etag('my-unique-id');
  echo 'This content will be cached.';
});
```

请记住，调用 `lastModified` 或 `etag` 都会设置并检查缓存值。如果请求之间的缓存值相同，Flight 将立即发送 `HTTP 304` 响应并停止处理。

### 下载文件

_v3.12.0_

有一个辅助方法用于将文件流式传输给最终用户。你可以使用 `download` 方法并传入文件路径。

```php
Flight::route('/download', function () {
  Flight::download('/path/to/file.txt');
  // 从 v3.17.1 起，你可以为下载指定自定义文件名
  Flight::download('/path/to/file.txt', 'custom_name.txt');
});
```

## 参见

- [路由](routing) - 如何将路由映射到控制器并渲染视图。
- [请求](requests) - 了解如何处理传入的请求。
- [中间件](middleware) - 对路由使用中间件进行身份验证、日志记录等。
- [为什么使用框架？](why_frameworks) - 了解使用 Flight 这样的框架的好处。
- [扩展](extending) - 如何使用你自己的功能扩展 Flight。

## 故障排除

- 如果你遇到重定向不工作的问题，请确保在方法中添加 `return;`。
- `stop()` 和 `halt()` 不同。`halt()` 会立即停止执行，而 `stop()` 会允许执行继续。

## 更新日志

- v3.17.1 - 为 `downloadFile()` 方法添加 `$fileName` 参数。
- v3.12.0 - 新增 downloadFile 辅助方法。
- v3.10.0 - 新增 `jsonHalt`。
- v1.0 - 初始发布。
