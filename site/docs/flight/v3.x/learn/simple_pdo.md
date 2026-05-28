---
title: SimplePdo PDO 辅助类
source: https://github.com/flightphp/docs/blob/master/content/v3/en/learn/simple_pdo.md
status: 已翻译
---

# SimplePdo PDO 辅助类

## 概述

Flight 中的 `SimplePdo` 类是一个现代化、功能丰富的数据库操作助手，基于 PDO。它扩展了 `PdoWrapper`，并添加了常见数据库操作的便捷辅助方法，如 `insert()`、`update()`、`delete()` 和事务处理。它简化了数据库任务，将结果返回为[集合](../collections)以便于访问，并支持查询日志记录和应用性能监控 (APM) 等高级用例。

## 理解

`SimplePdo` 类旨在让 PHP 中的数据库操作变得更简单。无需处理预处理语句、获取模式和冗长的 SQL 操作，你将获得干净、简单的常见任务方法。每行数据以 Collection 形式返回，因此你可以使用数组表示法（`$row['name']`）和对象表示法（`$row->name`）。

此类是 `PdoWrapper` 的超集，意味着它包含 `PdoWrapper` 的所有功能，加上额外的辅助方法，使代码更干净、更易维护。如果你当前正在使用 `PdoWrapper`，升级到 `SimplePdo` 非常简单，因为它扩展了 `PdoWrapper`。

你可以在 Flight 中将 `SimplePdo` 注册为共享服务，然后在应用的任何地方通过 `Flight::db()` 使用。

## 基本用法

### 注册 SimplePdo

首先，向 Flight 注册 `SimplePdo` 类：

```php
Flight::register('db', \flight\database\SimplePdo::class, [
    'mysql:host=localhost;dbname=cool_db_name', 'user', 'pass', [
        PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES \'utf8mb4\'',
        PDO::ATTR_EMULATE_PREPARES => false,
        PDO::ATTR_STRINGIFY_FETCHES => false,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]
]);
```

> **注意**  
>  
> 如果你不指定 `PDO::ATTR_DEFAULT_FETCH_MODE`，`SimplePdo` 会自动将其设置为 `PDO::FETCH_ASSOC`。

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

`function fetchRow(string $sql, array $params = []): ?Collection`

获取单行数据作为 Collection（支持数组/对象访问）：

```php
$user = Flight::db()->fetchRow("SELECT * FROM users WHERE id = ?", [123]);
echo $user['name'];
// 或
echo $user->name;
```

> **提示**  
>  
> `SimplePdo` 会自动在没有 `LIMIT 1` 的 `fetchRow()` 查询中加上，使查询更高效。

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

#### `fetchColumn()`

`function fetchColumn(string $sql, array $params = []): array`

获取单列作为数组：

```php
$ids = Flight::db()->fetchColumn("SELECT id FROM users WHERE active = ?", [1]);
// 返回: [1, 2, 3, 4, 5]
```

#### `fetchPairs()`

`function fetchPairs(string $sql, array $params = []): array`

获取结果作为键值对（第一列作为键，第二列作为值）：

```php
$userNames = Flight::db()->fetchPairs("SELECT id, name FROM users");
// 返回: [1 => 'John', 2 => 'Jane', 3 => 'Bob']
```

### 使用 `IN()` 占位符

你可以在 `IN()` 子句中使用单个 `?` 并传入数组：

```php
$ids = [1, 2, 3];
$users = Flight::db()->fetchAll("SELECT * FROM users WHERE id IN (?)", [$ids]);
```

## 辅助方法

`SimplePdo` 相对于 `PdoWrapper` 的主要优势之一是新增了常见数据库操作的便捷辅助方法。

### `insert()`

`function insert(string $table, array $data): string`

插入一行或多行并返回最后的插入 ID。

**单行插入：**

```php
$id = Flight::db()->insert('users', [
    'name' => 'John',
    'email' => 'john@example.com'
]);
```

**批量插入：**

```php
$id = Flight::db()->insert('users', [
    ['name' => 'John', 'email' => 'john@example.com'],
    ['name' => 'Jane', 'email' => 'jane@example.com'],
]);
```

### `update()`

`function update(string $table, array $data, string $where, array $whereParams = []): int`

更新行并返回受影响的行数：

```php
$affected = Flight::db()->update(
    'users',
    ['name' => 'Jane', 'email' => 'jane@example.com'],
    'id = ?',
    [1]
);
```

> **注意**  
>  
> SQLite 的 `rowCount()` 返回数据实际发生变化的行数。如果你用相同的值更新行，`rowCount()` 将返回 0。这与 MySQL 使用 `PDO::MYSQL_ATTR_FOUND_ROWS` 时的行为不同。

### `delete()`

`function delete(string $table, string $where, array $whereParams = []): int`

删除行并返回删除的行数：

```php
$deleted = Flight::db()->delete('users', 'id = ?', [1]);
```

### `transaction()`

`function transaction(callable $callback): mixed`

在事务中执行回调。事务自动在成功时提交或错误时回滚：

```php
$result = Flight::db()->transaction(function($db) {
    $db->insert('users', ['name' => 'John']);
    $db->insert('logs', ['action' => 'user_created']);
    return $db->lastInsertId();
});
```

如果回调内部抛出任何异常，事务将自动回滚，异常会被重新抛出。

## 高级用法

### 查询日志与 APM

如果你想追踪查询性能，在注册时启用 APM 追踪：

```php
Flight::register('db', \flight\database\SimplePdo::class, [
    'mysql:host=localhost;dbname=cool_db_name',
    'user',
    'pass',
    [/* PDO 选项 */],
    [
        'trackApmQueries' => true,
        'maxQueryMetrics' => 1000
    ]
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

    // 获取单列
    $ids = Flight::db()->fetchColumn('SELECT id FROM users');

    // 获取键值对
    $userNames = Flight::db()->fetchPairs('SELECT id, name FROM users');

    // 特殊的 IN() 语法
    $users = Flight::db()->fetchAll('SELECT * FROM users WHERE id IN (?)', [[1,2,3,4,5]]);

    // 插入新用户
    $id = Flight::db()->insert('users', [
        'name' => 'Bob',
        'email' => 'bob@example.com'
    ]);

    // 批量插入用户
    Flight::db()->insert('users', [
        ['name' => 'Bob', 'email' => 'bob@example.com'],
        ['name' => 'Jane', 'email' => 'jane@example.com']
    ]);

    // 更新用户
    $affected = Flight::db()->update('users', ['name' => 'Bob'], 'id = ?', [123]);

    // 删除用户
    $deleted = Flight::db()->delete('users', 'id = ?', [123]);

    // 使用事务
    $result = Flight::db()->transaction(function($db) {
        $db->insert('users', ['name' => 'John', 'email' => 'john@example.com']);
        $db->insert('audit_log', ['action' => 'user_created']);
        return $db->lastInsertId();
    });
});
```

## 从 PdoWrapper 迁移

如果你目前正在使用 `PdoWrapper`，迁移到 `SimplePdo` 非常简单：

1. **更新注册代码：**

   ```php
   // 旧的
   Flight::register('db', \flight\database\PdoWrapper::class, [ /* ... */ ]);
   
   // 新的
   Flight::register('db', \flight\database\SimplePdo::class, [ /* ... */ ]);
   ```

2. **所有现有的 `PdoWrapper` 方法在 `SimplePdo` 中都能使用** — 没有破坏性更改。你现有的代码将继续正常工作。

3. **根据需要选用新的辅助方法** — 开始使用 `insert()`、`update()`、`delete()` 和 `transaction()` 来简化代码。

## 参见

- [集合](../collections) - 了解如何使用 Collection 类轻松访问数据。
- [PdoWrapper](../pdo_wrapper) - 旧版 PDO 辅助类（已弃用）。

## 故障排除

- 如果遇到数据库连接错误，请检查 DSN、用户名、密码和选项。
- 所有行以 Collections 形式返回——如果需要普通数组，使用 `$collection->getData()`。
- 对于 `IN (?)` 查询，确保传入数组。
- 如果在长时间运行的进程中遇到查询日志的内存问题，调整 `maxQueryMetrics` 选项。

## 更新日志

- v3.18.0 - SimplePdo 初始发布，包含插入、更新、删除和事务的辅助方法。
