---
title: 迁移到 v3
source: https://github.com/flightphp/docs/blob/master/content/v3/en/learn/migrating_to_v3.md
status: 已翻译
---

# 迁移到 v3

向后兼容性在大部分情况下得到了保持，但从 v2 迁移到 v3 时，有一些变化需要注意。有些变化与设计模式冲突太严重，因此不得不做调整。

## 输出缓冲行为

_v3.5.0_

[输出缓冲](https://stackoverflow.com/questions/2832010/what-is-output-buffering-in-php)是 PHP 脚本生成的输出在发送到客户端之前存储在缓冲区（PHP 内部）中的过程。这允许你在发送给客户端之前修改输出。

在 MVC 应用中，Controller 是"管理者"，它管理视图的操作。在控制器之外生成输出（或在 Flight 中有时是匿名函数）会破坏 MVC 模式。此更改是为了更符合 MVC 模式，使框架更可预测、更容易使用。

在 v2 中，输出缓冲的处理方式不一致，无法一致地关闭自己的输出缓冲区，使得[单元测试](https://github.com/flightphp/core/pull/545/files#diff-eb93da0a3473574fba94c3c4160ce68e20028e30b267875ab0792ade0b0539a0R42)和[流式传输](https://github.com/flightphp/core/issues/413)更加困难。对于大多数用户来说，此更改可能实际上并不会影响你。然而，如果你在可调用对象和控制器之外（例如在钩子中）echo 内容，你可能会遇到问题。在钩子中以及在框架实际执行之前 echo 内容在过去可能有效，但今后将不再工作。

### 你可能遇到问题的地方

```php
// index.php
require 'vendor/autoload.php';

// 仅作示例
define('START_TIME', microtime(true));

function hello() {
	echo 'Hello World';
}

Flight::map('hello', 'hello');
Flight::after('hello', function(){
	// 这实际上是可以的
	echo '<p>This Hello World phrase was brought to you by the letter "H"</p>';
});

Flight::before('start', function(){
	// 像这样的事情会导致错误
	echo '<html><head><title>My Page</title></head><body>';
});

Flight::route('/', function(){
	// 这实际上是可以的
	echo 'Hello World';

	// 这也应该没问题
	Flight::hello();
});

Flight::after('start', function(){
	// 这将导致错误
	echo '<div>Your page loaded in '.(microtime(true) - START_TIME).' seconds</div></body></html>';
});
```

### 启用 v2 渲染行为

你能保持旧代码不变而不重写使其在 v3 中工作吗？是的，你可以！你可以通过将 `flight.v2.output_buffering` 配置选项设置为 `true` 来启用 v2 渲染行为。这将允许你继续使用旧的渲染行为，但建议逐步修复。在 v4 中，这将不再支持。

```php
// index.php
require 'vendor/autoload.php';

Flight::set('flight.v2.output_buffering', true);

Flight::before('start', function(){
	// 现在这就可以了
	echo '<html><head><title>My Page</title></head><body>';
});

// 更多代码
```

## Dispatcher 变更

_v3.7.0_

如果你一直在直接调用 `Dispatcher` 的静态方法，如 `Dispatcher::invokeMethod()`、`Dispatcher::execute()` 等，你将需要更新代码，不再直接调用这些方法。`Dispatcher` 已转换为更面向对象的方式，以便更容易使用依赖注入容器。如果你需要以类似 Dispatcher 的方式调用方法，可以手动使用类似 `$result = $class->$method(...$params);` 或 `call_user_func_array()` 的方式。

## `halt()` `stop()` `redirect()` 和 `error()` 变更

_v3.10.0_

3.10.0 之前的默认行为是清除响应头和响应体。这已更改为仅清除响应体。如果你还需要清除响应头，可以使用 `Flight::response()->clear()`。
