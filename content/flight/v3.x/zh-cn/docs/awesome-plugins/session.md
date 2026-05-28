---
title: FlightPHP Session - 轻量级基于文件的会话处理器
source: https://github.com/flightphp/docs/blob/master/content/v3/en/awesome-plugins/session.md
status: 已翻译
---

# FlightPHP Session - 轻量级基于文件的会话处理器

这是用于 [Flight PHP 框架](https://docs.flightphp.com/) 的一个轻量级、基于文件的会话处理器插件。它提供了一种简单但强大的会话管理解决方案，具有非阻塞会话读取、可选的加密、自动提交功能和开发测试模式等特性。会话数据存储在文件中，非常适合不需要数据库的应用。

如果你想使用数据库，请查看具有许多相同特性但基于数据库后端存储的 [ghostff/session](../ghost_session) 插件。

访问 [Github 仓库](https://github.com/flightphp/session) 获取完整的源代码和详细信息。

## 安装

通过 Composer 安装该插件：

```bash
composer require flightphp/session
```

## 基本用法

以下是如何在 Flight 应用中使用 `flightphp/session` 插件的简单示例：

```php
require 'vendor/autoload.php';

use flight\Session;

$app = Flight::app();

// 注册会话服务
$app->register('session', Session::class);

// 使用会话的路由示例
Flight::route('/login', function() {
    $session = Flight::session();
    $session->set('user_id', 123);
    $session->set('username', 'johndoe');
    $session->set('is_admin', false);

    echo $session->get('username'); // 输出: johndoe
    echo $session->get('preferences', 'default_theme'); // 输出: default_theme

    if ($session->get('user_id')) {
        Flight::json(['message' => 'User is logged in!', 'user_id' => $session->get('user_id')]);
    }
});

Flight::route('/logout', function() {
    $session = Flight::session();
    $session->clear(); // 清除所有会话数据
    Flight::json(['message' => 'Logged out successfully']);
});

Flight::start();
```

### 关键特性
- **非阻塞**：默认使用 `read_and_close` 启动会话，防止会话锁定问题。
- **自动提交**：默认启用，更改会在关闭时自动保存，除非禁用。
- **文件存储**：默认情况下，会话存储在 `/flight_sessions` 下的系统临时目录中。

## 配置

你可以在注册时通过传递选项数组来自定义会话处理器：

```php
// 是的，这是一个双重数组 :)
$app->register('session', Session::class, [ [
    'save_path' => '/custom/path/to/sessions',         // 会话文件目录
	'prefix' => 'myapp_',                              // 会话文件前缀
    'encryption_key' => 'a-secure-32-byte-key-here',   // 启用加密（AES-256-CBC 建议 32 字节密钥）
    'auto_commit' => false,                            // 禁用手动控制的自动提交
    'start_session' => true,                           // 自动启动会话（默认：true）
    'test_mode' => false,                              // 启用开发测试模式
    'serialization' => 'json',                         // 序列化方法：'json'（默认）或 'php'（旧版）
] ]);
```

### 配置选项
| 选项               | 描述                                   | 默认值                               |
|-------------------|----------------------------------------|-------------------------------------|
| `save_path`       | 存储会话文件的目录                        | `sys_get_temp_dir() . '/flight_sessions'` |
| `prefix`          | 保存的会话文件前缀                        | `sess_`                             |
| `encryption_key`  | AES-256-CBC 加密密钥（可选）              | `null`（无加密）                      |
| `auto_commit`     | 关闭时自动保存会话数据                     | `true`                              |
| `start_session`   | 自动启动会话                             | `true`                              |
| `test_mode`       | 以测试模式运行，不影响 PHP 会话             | `false`                             |
| `test_session_id` | 测试模式下的自定义会话 ID（可选）            | 如果未设置则随机生成                    |
| `serialization`   | 序列化方法：'json'（默认，安全）或 'php'（旧版，允许对象） | `'json'` |

## 序列化模式

默认情况下，该库使用 **JSON 序列化** 存储会话数据，这是安全的，可以防止 PHP 对象注入漏洞。如果你需要在会话中存储 PHP 对象（不推荐用于大多数应用），你可以选择使用旧版 PHP 序列化：

- `'serialization' => 'json'`（默认）：
  - 只允许在会话数据中使用数组和基本类型。
  - 更安全：免疫 PHP 对象注入。
  - 文件前缀为 `J`（纯 JSON）或 `F`（加密 JSON）。
- `'serialization' => 'php'`：
  - 允许存储 PHP 对象（谨慎使用）。
  - 文件前缀为 `P`（纯 PHP 序列化）或 `E`（加密 PHP 序列化）。

**注意：** 如果你使用 JSON 序列化，尝试存储对象将抛出异常。

## 高级用法

### 手动提交
如果你禁用了自动提交，必须手动提交更改：

```php
$app->register('session', Session::class, ['auto_commit' => false]);

Flight::route('/update', function() {
    $session = Flight::session();
    $session->set('key', 'value');
    $session->commit(); // 显式保存更改
});
```

### 使用加密的会话安全
启用加密以保护敏感数据：

```php
$app->register('session', Session::class, [
    'encryption_key' => 'your-32-byte-secret-key-here'
]);

Flight::route('/secure', function() {
    $session = Flight::session();
    $session->set('credit_card', '4111-1111-1111-1111'); // 自动加密
    echo $session->get('credit_card'); // 检索时解密
});
```

### 会话再生
出于安全考虑（例如登录后），重新生成会话 ID：

```php
Flight::route('/post-login', function() {
    $session = Flight::session();
    $session->regenerate(); // 新 ID，保留数据
    // 或
    $session->regenerate(true); // 新 ID，删除旧数据
});
```

### 中间件示例
使用基于会话的身份验证保护路由：

```php
Flight::route('/admin', function() {
    Flight::json(['message' => 'Welcome to the admin panel']);
})->addMiddleware(function() {
    $session = Flight::session();
    if (!$session->get('is_admin')) {
        Flight::halt(403, 'Access denied');
    }
});
```

这只是一个简单的中间件使用示例。有关更深入的示例，请参见[中间件](../../learn/middleware)文档。

## 方法

`Session` 类提供以下方法：

- `set(string $key, $value)`: 在会话中存储一个值。
- `get(string $key, $default = null)`: 检索一个值，在键不存在时提供可选的默认值。
- `delete(string $key)`: 从会话中移除指定键。
- `clear()`: 删除所有会话数据，但保留该会话的文件名。
- `commit()`: 将当前会话数据保存到文件系统。
- `id()`: 返回当前会话 ID。
- `regenerate(bool $deleteOldFile = false)`: 重新生成会话 ID，包括创建新的会话文件，保留所有旧数据，旧文件保留在系统中。如果 `$deleteOldFile` 为 `true`，则删除旧的会话文件。
- `destroy(string $id)`: 通过 ID 销毁会话并从系统中删除会话文件。这是 `SessionHandlerInterface` 的一部分，`$id` 是必需的。典型用法是 `$session->destroy($session->id())`。
- `getAll()`: 返回当前会话的所有数据。

除了 `get()` 和 `id()` 之外，所有方法都返回 `Session` 实例以支持链式调用。

## 为什么使用此插件？

- **轻量级**：无外部依赖 — 仅使用文件。
- **非阻塞**：默认使用 `read_and_close` 避免会话锁定。
- **安全**：支持 AES-256-CBC 加密来保护敏感数据。
- **灵活**：自动提交、测试模式和手动控制选项。
- **Flight 原生**：专为 Flight 框架构建。

## 技术细节

- **存储格式**：会话文件以 `sess_` 为前缀，存储在配置的 `save_path` 中。文件内容前缀：
  - `J`：纯 JSON（默认，无加密）
  - `F`：加密 JSON（带加密的默认值）
  - `P`：纯 PHP 序列化（旧版，无加密）
  - `E`：加密 PHP 序列化（旧版带加密）
- **加密**：当提供 `encryption_key` 时，使用 AES-256-CBC 配合每次会话写入的随机 IV 进行加密。加密适用于 JSON 和 PHP 序列化模式。
- **序列化**：JSON 是默认且最安全的方法。PHP 序列化适用于旧版/高级用途，但安全性较低。
- **垃圾回收**：实现 PHP 的 `SessionHandlerInterface::gc()` 来清理过期会话。

## 贡献

欢迎贡献！Fork [仓库](https://github.com/flightphp/session)，进行更改并提交 Pull Request。通过 Github issue tracker 报告 bug 或建议功能。

## 许可证

此插件采用 MIT 许可证。详情请见 [Github 仓库](https://github.com/flightphp/session)。
