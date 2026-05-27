---
title: Flight Active Record
source: https://github.com/flightphp/docs/blob/master/content/v3/en/awesome-plugins/active_record.md
status: 已翻译
---

# Flight Active Record

Active Record 将数据库实体映射到 PHP 对象。如果你在数据库中有 users 表，可以将其中的一行"翻译"为 `User` 类和一个 `$user` 对象。

点击 [GitHub](https://github.com/flightphp/active-record) 查看仓库。

## 基本示例

假设你有 users 表（`id`, `name`, `password`）：

```php
/** @property int $id @property string $name @property string $password */
class User extends flight\ActiveRecord {
    public function __construct($database_connection) {
        parent::__construct($database_connection, 'users');
    }
}
```

```php
$user = new User($pdo_connection);
$user->name = 'Bobby Tables';
$user->password = password_hash('some cool password');
$user->insert();  // 或 $user->save();
echo $user->id; // 1

// 查询
$user->find(1);
echo $user->name; // 'Bobby Tables'

// 查找所有
$users = $user->findAll();
// 条件查询
$users = $user->like('name', '%mamma%')->findAll();
```

## 安装

```bash
composer require flightphp/active-record
```

可独立使用或在 Flight 中注册为服务：`Flight::register('user', 'User', [$pdo_connection]);`

## Runway 命令

```bash
php runway make:record users  # 自动生成 UserRecord.php
```

## CRUD 方法

- `find($id)` — 查找一条，支持前置条件：`$user->notNull('password')->orderBy('id DESC')->find();`
- `findAll()` — 查找所有
- `insert()` — 插入（支持 UUID 主键）
- `update()` — 更新
- `save()` — 自动判断插入/更新
- `delete()` — 删除（支持前置条件批量删）
- `dirty(array)` / `copyFrom(array)` — 脏数据管理
- `reset(bool)` — 重置记录状态
- `isHydrated()` / `isDirty()` — 状态检查

## 查询方法

`select()`, `from()`, `join()`, `where()`, `group()`, `order()`, `limit()`  
**注意**：不要在 `where()` 中拼接用户输入，使用 `eq()`, `like()` 等安全方法。

## WHERE 条件

`eq()`, `ne()`, `isNull()`, `notNull()`, `gt()`, `lt()`, `ge()`, `le()`, `like()`, `in()`, `between()`  
支持 OR：`$user->eq('id', 1)->eq('name', 'demo', 'OR')->find();`

## 关系

```php
protected array $relations = [
    'contacts' => [ self::HAS_MANY, Contact::class, 'user_id' ],
    'contact' => [ self::HAS_ONE, Contact::class, 'user_id' ],
];
// 使用: foreach($user->contacts as $contact) { ... }
```

支持 HAS_MANY、HAS_ONE、BELONGS_TO。支持**预加载**（Eager Loading）：`$users = $user->with('contacts')->findAll();` 解决 N+1 问题。

## 事件

`onConstruct`, `beforeFind`, `afterFind`, `beforeFindAll`, `afterFindAll`, `beforeInsert`, `afterInsert`, `beforeUpdate`, `afterUpdate`, `beforeSave`, `afterSave`, `beforeDelete`, `afterDelete`

## 数据库连接管理

三种方式：构造函数传入、`$config['connection']`、`setDatabaseConnection()`。可通过在 Flight 中注册 `db` 服务并利用 `onConstruct` 事件自动连接。

## 许可证

MIT
