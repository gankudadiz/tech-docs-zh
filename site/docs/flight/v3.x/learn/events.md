---
title: 事件管理器
source: https://github.com/flightphp/docs/blob/master/content/v3/en/learn/events.md
status: 已翻译
---

# 事件管理器

_自 v3.15.0 起_

## 概述

事件允许你在应用中注册和触发自定义行为。通过新增的 `Flight::onEvent()` 和 `Flight::triggerEvent()`，你现在可以钩入应用生命周期的关键时刻，或定义自己的事件（如通知和邮件），使代码更加模块化且可扩展。这些方法是 Flight [可映射方法](../extending)的一部分，意味着你可以覆盖它们的行为以满足你的需求。

## 理解

事件允许你将应用的不同部分分开，使它们不会过于依赖彼此。这种分离——通常被称为**解耦**——使你的代码更容易更新、扩展或调试。与其把所有内容写在一个大块中，你可以将逻辑拆分为更小、独立的部分，分别响应特定的动作（事件）。

想象你在构建一个博客应用：
- 当用户发表评论时，你可能想要：
  - 将评论保存到数据库。
  - 向博客所有者发送邮件。
  - 记录操作日志以确保安全。

没有事件，你会把所有这些塞进一个函数中。有了事件，你可以将它们分开：一部分保存评论，另一部分触发类似 `'comment.posted'` 的事件，然后独立的监听器处理邮件和日志记录。这使你的代码更简洁，并且使你能够在不触及核心逻辑的情况下添加或移除功能（如通知）。

### 常见用例

大多数情况下，事件适用于可选项，而非系统的绝对核心部分。例如，以下内容可以拥有，但如果由于某种原因失败，你的应用仍应正常工作：

- **日志记录**：记录登录或错误等操作，而不会污染你的主代码。
- **通知**：在事件发生时发送邮件或提醒。
- **缓存更新**：刷新缓存或通知其他系统有关更改。

然而，假设你有一个忘记密码的功能。这应该是你的核心功能的一部分，而不是一个事件，因为如果那封邮件没有发出，用户就无法重置密码并使用你的应用。

## 基本用法

Flight 的事件系统围绕两个主要方法构建：`Flight::onEvent()` 用于注册事件监听器，`Flight::triggerEvent()` 用于触发事件。以下是使用方法：

### 注册事件监听器

要监听事件，请使用 `Flight::onEvent()`。此方法让你定义事件发生时应执行的操作。

```php
Flight::onEvent(string $event, callable $callback): void
```

- `$event`：事件的名称（例如 `'user.login'`）。
- `$callback`：事件触发时要运行的函数。

你通过告诉 Flight 在事件发生时做什么来"订阅"事件。回调可以接受从事件触发器传递的参数。

Flight 的事件系统是同步的，这意味着每个事件监听器按顺序一个接一个地执行。当你触发一个事件时，该事件的所有已注册监听器将在你的代码继续之前运行完成。理解这一点很重要，因为它不同于异步事件系统（监听器可能并行或稍后运行）。

#### 简单示例

```php
Flight::onEvent('user.login', function ($username) {
    echo "Welcome back, $username!";

	// 如果登录来自新位置，你可以发送邮件
});
```

这里，当触发 `'user.login'` 事件时，它将按名称问候用户，如果需要还可以包含发送邮件的逻辑。

> **注意**：回调可以是函数、匿名函数或类的方法。

### 触发事件

要触发一个事件，请使用 `Flight::triggerEvent()`。这会告诉 Flight 运行该事件的所有已注册监听器，并传递你提供的任何数据。

```php
Flight::triggerEvent(string $event, ...$args): void
```

- `$event`：你要触发的事件名称（必须匹配已注册的事件）。
- `...$args`：发送给监听器的可选参数（可以是任意数量的参数）。

#### 简单示例

```php
$username = 'alice';
Flight::triggerEvent('user.login', $username);
```

这将触发 `'user.login'` 事件，并将 `'alice'` 发送到我们之前定义的监听器，输出：`Welcome back, alice!`。

- 如果没有注册监听器，什么都不会发生——你的应用不会崩溃。
- 使用展开运算符（`...`）灵活传递多个参数。

### 停止事件

如果某个监听器返回 `false`，该事件的其他监听器将不会被执行。这允许你根据特定条件停止事件链。记住，监听器的顺序很重要，因为第一个返回 `false` 的将阻止其余的运行。

**示例**：

```php
Flight::onEvent('user.login', function ($username) {
    if (isBanned($username)) {
        logoutUser($username);
        return false; // 停止后续监听器
    }
});
Flight::onEvent('user.login', function ($username) {
    sendWelcomeEmail($username); // 这个永远不会被执行
});
```

### 覆盖事件方法

`Flight::onEvent()` 和 `Flight::triggerEvent()` 可以被[扩展](../extending)，这意味着你可以重新定义它们的工作方式。这对于想要自定义事件系统的高级用户来说非常有用，例如添加日志记录或更改事件的分发方式。

#### 示例：自定义 `onEvent`

```php
Flight::map('onEvent', function (string $event, callable $callback) {
    // 记录每个事件的注册
    error_log("New event listener added for: $event");
    // 调用默认行为（假设有一个内部事件系统）
    Flight::_onEvent($event, $callback);
});
```

现在，每次注册事件时，它都会在继续之前记录日志。

#### 为什么要覆盖？

- 添加调试或监控。
- 在某些环境中限制事件（例如在测试中禁用）。
- 与不同的事件库集成。

### 事件放在哪里

如果你是项目中事件概念的新手，你可能会疑惑：*我在应用哪里注册所有这些事件？* Flight 的简洁性意味着没有严格的规则——你可以将它们放在对项目有意义的任何地方。然而，将它们组织好有助于你在应用增长时维护代码。以下是一些实用选项和最佳实践，针对 Flight 的轻量级特性定制：

#### 选项 1：在主 `index.php` 中

对于小型应用或快速原型，你可以直接在 `index.php` 文件中与路由一起注册事件。当简单性是优先考虑时，把所有内容放在一个地方是可以的。

```php
require 'vendor/autoload.php';

// 注册事件
Flight::onEvent('user.login', function ($username) {
    error_log("$username logged in at " . date('Y-m-d H:i:s'));
});

// 定义路由
Flight::route('/login', function () {
    $username = 'bob';
    Flight::triggerEvent('user.login', $username);
    echo "Logged in!";
});

Flight::start();
```

- **优点**：简单，没有额外文件，适合小型项目。
- **缺点**：当应用增长，事件和路由增多时可能会变得混乱。

#### 选项 2：单独的 `events.php` 文件

对于稍大型的应用，可以考虑将事件注册移到专用文件如 `app/config/events.php`。在你的 `index.php` 中，在路由之前包含此文件。这模仿了 Flight 项目中路由通常的组织方式。

```php
// app/config/events.php
Flight::onEvent('user.login', function ($username) {
    error_log("$username logged in at " . date('Y-m-d H:i:s'));
});

Flight::onEvent('user.registered', function ($email, $name) {
    echo "Email sent to $email: Welcome, $name!";
});
```

```php
// index.php
require 'vendor/autoload.php';
require 'app/config/events.php';

Flight::route('/login', function () {
    $username = 'bob';
    Flight::triggerEvent('user.login', $username);
    echo "Logged in!";
});

Flight::start();
```

- **优点**：使 `index.php` 专注于路由，逻辑上组织事件，易于查找和编辑。
- **缺点**：增加了一点结构，对于非常小的应用可能感觉过度。

#### 选项 3：靠近触发位置

另一种方法是在靠近触发位置注册事件，比如在控制器或路由定义内部。如果某个事件特定于应用的一部分，这很适用。

```php
Flight::route('/signup', function () {
    // 在这里注册事件
    Flight::onEvent('user.registered', function ($email) {
        echo "Welcome email sent to $email!";
    });

    $email = 'jane@example.com';
    Flight::triggerEvent('user.registered', $email);
    echo "Signed up!";
});
```

- **优点**：将相关代码放在一起，适合隔离的功能。
- **缺点**：分散事件注册，难以一次性查看所有事件；如果不小心可能导致重复注册。

#### Flight 的最佳实践

- **从简单开始**：对于微型应用，将事件放在 `index.php`。这很快，符合 Flight 的极简主义。
- **智能增长**：随着应用扩展（例如超过 5-10 个事件），使用 `app/config/events.php` 文件。这是一个自然的升级步骤，就像组织路由一样，在不添复杂框架的情况下保持代码整洁。
- **避免过度工程化**：不要创建完整的"事件管理器"类或目录，除非你的应用变得非常大——Flight 以简单见长，所以保持轻量级。

#### 提示：按目的分组

在 `events.php` 中，将相关事件分组（例如所有用户相关事件放在一起），并加上注释以便清晰：

```php
// app/config/events.php
// 用户事件
Flight::onEvent('user.login', function ($username) {
    error_log("$username logged in");
});
Flight::onEvent('user.registered', function ($email) {
    echo "Welcome to $email!";
});

// 页面事件
Flight::onEvent('page.updated', function ($pageId) {
    Flight::cache()->delete("page_$pageId");
});
```

这种结构扩展性好，且对初学者友好。

### 真实世界示例

让我们通过一些真实场景来演示事件如何工作以及为什么它们有用。

#### 示例 1：记录用户登录

```php
// 步骤 1：注册监听器
Flight::onEvent('user.login', function ($username) {
    $time = date('Y-m-d H:i:s');
    error_log("$username logged in at $time");
});

// 步骤 2：在应用中触发它
Flight::route('/login', function () {
    $username = 'bob'; // 假设这来自表单
    Flight::triggerEvent('user.login', $username);
    echo "Hi, $username!";
});
```

**为什么有用**：登录代码不需要知道日志记录——它只是触发事件。你可以稍后添加更多监听器（例如发送欢迎邮件），而无需更改路由。

#### 示例 2：通知新用户注册

```php
// 新注册监听器
Flight::onEvent('user.registered', function ($email, $name) {
    // 模拟发送邮件
    echo "Email sent to $email: Welcome, $name!";
});

// 当有人注册时触发它
Flight::route('/signup', function () {
    $email = 'jane@example.com';
    $name = 'Jane';
    Flight::triggerEvent('user.registered', $email, $name);
    echo "Thanks for signing up!";
});
```

**为什么有用**：注册逻辑专注于创建用户，而事件处理通知。你可以稍后添加更多监听器（例如记录注册日志）。

#### 示例 3：清除缓存

```php
// 清除缓存监听器
Flight::onEvent('page.updated', function ($pageId) {
	// 如果使用 flightphp/cache 插件
    Flight::cache()->delete("page_$pageId");
    echo "Cache cleared for page $pageId.";
});

// 当页面被编辑时触发
Flight::route('/edit-page/(@id)', function ($pageId) {
    // 假设我们更新了页面
    Flight::triggerEvent('page.updated', $pageId);
    echo "Page $pageId updated.";
});
```

**为什么有用**：编辑代码不关心缓存——它只是发出更新信号。应用的其他部分可以根据需要做出反应。

### 最佳实践

- **事件命名清晰**：使用具体的名称，如 `'user.login'` 或 `'page.updated'`，使其功能显而易见。
- **保持监听器简单**：不要在监听器中放入慢速或复杂的任务——保持应用快速。
- **测试你的事件**：手动触发它们以确保监听器按预期工作。
- **明智使用事件**：它们在解耦方面很棒，但太多会使代码难以追踪——在合理的场景下使用。

Flight PHP 的事件系统，通过 `Flight::onEvent()` 和 `Flight::triggerEvent()`，为你提供了一种简单但强大的方法来构建灵活的应用程序。通过让应用的不同部分通过事件进行通信，你可以保持代码组织良好、可重用且易于扩展。无论你是在记录操作、发送通知，还是管理更新，事件都能帮助你做到而不纠缠逻辑。此外，有能力覆盖这些方法，让你可以自由地根据需求定制系统。从单个事件开始，观察它如何转变你的应用结构！

### 内置事件

Flight PHP 附带了一些内置事件，你可以使用它们来钩入框架的生命周期。这些事件在请求/响应周期的特定时间点触发，允许你在某些动作发生时执行自定义逻辑。

#### 内置事件列表

- **flight.request.received**：`function(Request $request)` 当请求被接收、解析和处理后触发。
- **flight.error**：`function(Throwable $exception)` 当请求生命周期中发生错误时触发。
- **flight.redirect**：`function(string $url, int $status_code)` 当重定向被发起时触发。
- **flight.cache.checked**：`function(string $cache_key, bool $hit, float $executionTime)` 当检查特定键的缓存时触发，以及缓存命中或未命中的情况。
- **flight.middleware.before**：`function(Route $route)` 在 before 中间件执行后触发。
- **flight.middleware.after**：`function(Route $route)` 在 after 中间件执行后触发。
- **flight.middleware.executed**：`function(Route $route, $middleware, string $method, float $executionTime)` 在任何中间件执行后触发。
- **flight.route.matched**：`function(Route $route)` 当路由匹配但尚未运行时触发。
- **flight.route.executed**：`function(Route $route, float $executionTime)` 当路由执行并处理后触发。`$executionTime` 是执行路由所花费的时间（调用控制器等）。
- **flight.view.rendered**：`function(string $template_file_path, float $executionTime)` 当视图渲染后触发。`$executionTime` 是渲染模板所花费的时间。**注意：如果你覆盖了 `render` 方法，你需要重新触发此事件。**
- **flight.response.sent**：`function(Response $response, float $executionTime)` 当响应发送给客户端后触发。`$executionTime` 是构建响应所花费的时间。

## 参见

- [扩展 Flight](../extending) - 如何扩展和自定义 Flight 的核心功能。
- [缓存](../../awesome-plugins/php_file_cache) - 使用事件在页面更新时清除缓存的示例。

## 故障排除

- 如果你发现事件监听器没有被调用，请确保在触发事件之前注册它们。注册顺序很重要。

## 更新日志

- v3.15.0 - 为 Flight 添加了事件功能。
