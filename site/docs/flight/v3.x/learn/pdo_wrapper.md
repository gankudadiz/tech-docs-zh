---
title: PdoWrapper PDO 辅助类（已弃用）
source: https://github.com/flightphp/docs/blob/master/content/v3/en/learn/pdo_wrapper.md
status: 已翻译
---

# PdoWrapper PDO 辅助类

> **警告**  
>  
> **已弃用：** `PdoWrapper` 自 Flight v3.18.0 起已弃用。它不会在未来的版本中被移除，但将为向后兼容而保留。请改用 [SimplePdo](../simple-pdo)，它提供了相同的功能以及常见数据库操作的额外辅助方法。

## 概述

Flight 中的 `PdoWrapper` 类是一个使用 PDO 操作数据库的友好助手。它简化了常见的数据库任务，添加了一些获取结果的便捷方法，并将结果返回为[集合](../collections)以便于访问。它还支持查询日志记录和应用性能监控 (APM) 等高级用例。

## 理解

在 PHP 中使用数据库可能有些冗长，尤其是直接使用 PDO 时。`PdoWrapper` 扩展了 PDO 并添加了使查询、获取和处理结果更加容易的方法。无需处理预处理语句和获取模式，你将获得常见任务的简单方法，并且每行数据以 Collection 形式返回，因此可以使用数组或对象表示法。

你可以在 Flight 中将 `PdoWrapper` 注册为共享服务，然后在应用的任何地方通过 `Flight::db()` 使用。

## 基本用法

### 注册 PDO 助手

首先，向 Flight 注册 `PdoWrapper` 类：

```php
Flight::register('db', \flight\database\PdoWrapper::class, [
    'mysql:host=localhost;dbname=cool_db_name', 'user', 'pass', [
        PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES \'utf8mb4\'',
        PDO::ATTR_EMULATE_PREPARES => false,
        PDO::ATTR_STRINGIFY_FETCHES => false,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]
]);
```

现在你可以在任何地方使用 `Flight::db()` 来获取数据库连接。

### 运行查询

#### `runQuery()`

`function runQuery(string $sql, array $params = []): PDOStatement`

用于 INSERT、UPDATE 或需要手动获取结果时：

```php
$db = Flight::db();
$statement = $db->runQuery("SELECT * FROM users WHERE status = ?", ['active']);
while ($row = $statement->fetch()) {
    // $row 是一个数组
}
```

你也可以用于写入操作：

```php
$db->runQuery("INSERT INTO users (name) VALUES (?)", ['Alice']);
$db->runQuery("UPDATE users SET name = ? WHERE id = ?", ['Bob', 1]);
```

#### `fetchField()`

`function fetchField(string $sql, array $params = []): mixed`

从数据库中获取单个值：

```php
$count = Flight::db()->fetchField("SELECT COUNT(*) FROM users WHERE status = ?", ['active']);
```

#### `fetchRow()`

`function fetchRow(string $sql, array $params = []): Collection`

获取单行数据作为 Collection（支持数组/对象访问）：

```php
$user = Flight::db()->fetchRow("SELECT * FROM users WHERE id = ?", [123]);
echo $user['name'];
// 或
echo $user->name;
```

#### `fetchAll()`

`function fetchAll(string $sql, array $params = []): array<Collection>`

获取所有行作为 Collection 数组：

```php
$users = Flight::db()->fetchAll("SELECT * FROM users WHERE status = ?", ['active']);
foreach ($users as $user) {
    echo $user['name'];
    // 或
    echo $user->name;
}
```

### 使用 `IN()` 占位符

你可以在 `IN()` 子句中使用单个 `?` 并传入数组或逗号分隔的字符串：

```php
$ids = [1, 2, 3];
$users = Flight::db()->fetchAll("SELECT * FROM users WHERE id IN (?)", [$ids]);
// 或
$users = Flight::db()->fetchAll("SELECT * FROM users WHERE id IN (?)", ['1,2,3']);
```

## 高级用法

### 查询日志与 APM

如果你想追踪查询性能，在注册时启用 APM 追踪：

```php
Flight::register('db', \flight\database\PdoWrapper::class, [
    'mysql:host=localhost;dbname=cool_db_name', 'user', 'pass', [/* 选项 */], true // 最后一个参数启用 APM
]);
```

运行查询后，你可以手动记录它们，但如果启用了 APM，它会自动记录：

```php
Flight::db()->logQueries();
```

这将触发一个事件 (`flight.db.queries`)，包含连接和查询指标，你可以使用 Flight 的事件系统来监听。

### 完整示例

```php
Flight::route('/users', function () {
    // 获取所有用户
    $users = Flight::db()->fetchAll('SELECT * FROM users');

    // 流式获取所有用户
    $statement = Flight::db()->runQuery('SELECT * FROM users');
    while ($user = $statement->fetch()) {
        echo $user['name'];
    }

    // 获取单个用户
    $user = Flight::db()->fetchRow('SELECT * FROM users WHERE id = ?', [123]);

    // 获取单个值
    $count = Flight::db()->fetchField('SELECT COUNT(*) FROM users');

    // 特殊的 IN() 语法
    $users = Flight::db()->fetchAll('SELECT * FROM users WHERE id IN (?)', [[1,2,3,4,5]]);
    $users = Flight::db()->fetchAll('SELECT * FROM users WHERE id IN (?)', ['1,2,3,4,5']);

    // 插入新用户
    Flight::db()->runQuery("INSERT INTO users (name, email) VALUES (?, ?)", ['Bob', 'bob@example.com']);
    $insert_id = Flight::db()->lastInsertId();

    // 更新用户
    Flight::db()->runQuery("UPDATE users SET name = ? WHERE id = ?", ['Bob', 123]);

    // 删除用户
    Flight::db()->runQuery("DELETE FROM users WHERE id = ?", [123]);

    // 获取受影响的行数
    $statement = Flight::db()->runQuery("UPDATE users SET name = ? WHERE name = ?", ['Bob', 'Sally']);
    $affected_rows = $statement->rowCount();
});
```

## 参见

- [集合](../collections) - 了解如何使用 Collection 类轻松访问数据。

## 故障排除

- 如果遇到数据库连接错误，请检查 DSN、用户名、密码和选项。
- 所有行以 Collections 形式返回——如果需要普通数组，使用 `$collection->getData()`。
- 对于 `IN (?)` 查询，确保传入数组或逗号分隔的字符串。

## 更新日志

- v3.2.0 - PdoWrapper 初始发布，包含基本的查询和获取方法。
