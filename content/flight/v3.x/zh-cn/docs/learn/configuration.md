---
title: 配置
source: https://github.com/flightphp/docs/blob/master/content/v3/en/learn/configuration.md
status: 已翻译
---

# 配置

## 概述

Flight 提供了一种简单的方式来配置框架的各个方面，以适应你的应用需求。部分配置有默认值，你可以根据需要覆盖它们。你还可以设置自己的变量，以便在整个应用中使用。

## 理解

你可以通过 `set` 方法设置配置值来自定义 Flight 的某些行为。

```php
Flight::set('flight.log_errors', true);
```

在 `app/config/config.php` 文件中，你可以看到所有可用的默认配置变量。

## 基本用法

### Flight 配置选项

以下是所有可用的配置设置列表：

- **flight.base_url** `?string` - 如果 Flight 运行在子目录中，覆盖请求的基础 URL。（默认：null）
- **flight.case_sensitive** `bool` - URL 大小写敏感匹配。（默认：false）
- **flight.handle_errors** `bool` - 允许 Flight 内部处理所有错误。（默认：true）
  - 如果你希望 Flight 处理错误而不是默认的 PHP 行为，此项需设为 true。
  - 如果你安装了 [Tracy](../../awesome-plugins/tracy)，请将此设为 false，以便 Tracy 处理错误。
  - 如果你安装了 [APM](../../awesome-plugins/apm) 插件，请将此设为 true，以便 APM 记录错误。
- **flight.log_errors** `bool` - 将错误记录到 Web 服务器的错误日志文件中。（默认：false）
  - 如果你安装了 [Tracy](../../awesome-plugins/tracy)，Tracy 将根据 Tracy 的配置记录错误，而非此配置。
- **flight.debug** `bool` - 当发生错误时，在浏览器中输出详细的错误信息（异常消息、代码和堆栈跟踪）。（默认：false）
  - **切勿在生产环境中启用** — 这会泄露内部应用细节。仅用于本地开发或测试环境。
  - 当设为 `false` 时，会显示通用的 `500 Internal Server Error`。配合 `flight.log_errors` 使用可以在服务器端捕获错误。
- **flight.allow_method_override** `bool` - 允许通过 `X-HTTP-Method-Override` 请求头或 POST 体中的 `_method` 字段覆盖 HTTP 方法。（默认：true）
  - 对于不需要基于 HTML 表单的方法伪装的应用程序，**建议设置为 `false`**，因为这可以防止客户端通过标准 POST 表单伪造 `DELETE` 或 `PUT` 请求。
  - 更多信息见[安全](../security#flight-配置加固)。
- **flight.views.path** `string` - 包含视图模板文件的目录。（默认：./views）
- **flight.views.extension** `string` - 视图模板文件扩展名。（默认：.php）
- **flight.content_length** `bool` - 设置 `Content-Length` 响应头。（默认：true）
  - 如果你使用了 [Tracy](../../awesome-plugins/tracy)，需要将此设为 false，以便 Tracy 能够正确渲染。
- **flight.v2.output_buffering** `bool` - 使用旧版输出缓冲。参见[迁移到 v3](../migrating_to_v3)。（默认：false）

### 加载器配置

此外还有一个用于加载器的配置设置。这允许你自动加载类名中包含 `_` 的类。

```php
// 启用带下划线的类加载
// 默认为 true
Loader::$v2ClassLoading = false;
```

### 变量

Flight 允许你保存变量，以便在应用的任何地方使用。

```php
// 保存你的变量
Flight::set('id', 123);

// 在应用的其他地方
$id = Flight::get('id');
```

要查看某个变量是否已设置：

```php
if (Flight::has('id')) {
  // 做点什么
}
```

你可以通过以下方式清除变量：

```php
// 清除 id 变量
Flight::clear('id');

// 清除所有变量
Flight::clear();
```

> **注意**：仅仅因为你可以设置变量并不意味着你应该这样做。请谨慎使用此功能。原因是存储在其中的任何内容都会成为全局变量。全局变量不好，因为它们可以从应用的任何地方被修改，这使得追踪 bug 变得困难。此外，这还会使[单元测试](../../guides/unit_testing)等操作变得复杂。

### 错误和异常

如果 `flight.handle_errors` 设为 true，所有错误和异常都会被 Flight 捕获并传递给 `error` 方法。

默认行为是发送一个带有部分错误信息的通用 `HTTP 500 Internal Server Error` 响应。

你可以根据自己的需要[覆盖](../extending)此行为：

```php
Flight::map('error', function (Throwable $error) {
  // 处理错误
  echo $error->getTraceAsString();
});
```

默认情况下，错误不会被记录到 Web 服务器。你可以通过修改配置来启用：

```php
Flight::set('flight.log_errors', true);
```

#### 404 未找到

当 URL 找不到时，Flight 会调用 `notFound` 方法。默认行为是发送一条简单消息的 `HTTP 404 Not Found` 响应。

你可以根据自己的需要[覆盖](../extending)此行为：

```php
Flight::map('notFound', function () {
  // 处理未找到
});
```

## 参见

- [扩展 Flight](../extending) - 如何扩展和自定义 Flight 的核心功能。
- [单元测试](../../guides/unit_testing) - 如何为你的 Flight 应用编写单元测试。
- [Tracy](../../awesome-plugins/tracy) - 用于高级错误处理和调试的插件。
- [Tracy 扩展](../../awesome-plugins/tracy_extensions) - 将 Tracy 与 Flight 集成的扩展。
- [APM](../../awesome-plugins/apm) - 用于应用性能监控和错误跟踪的插件。

## 故障排除

- 如果你在查找所有配置值时遇到问题，可以使用 `var_dump(Flight::get());`

## 更新日志

- v3.18.1 - 新增 `flight.debug` 和 `flight.allow_method_override` 配置选项。
- v3.5.0 - 新增 `flight.v2.output_buffering` 配置以支持旧版输出缓冲行为。
- v2.0 - 核心配置项添加。
