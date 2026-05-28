---
title: 集合
source: https://github.com/flightphp/docs/blob/master/content/v3/en/learn/collections.md
status: 已翻译
---

# 集合

## 概述

Flight 中的 `Collection` 类是一个用于管理数据集的便捷工具。它允许你使用数组和对象两种表示法来访问和操作数据，使代码更简洁、更灵活。

## 理解

`Collection` 本质上是数组的包装，但具有一些额外的能力。你可以像使用数组一样使用它，循环遍历、计数，甚至像访问对象属性一样访问数据项。当你想在应用中传递结构化数据，或想让代码更易读时，这特别有用。

集合实现了多个 PHP 接口：
- `ArrayAccess`（可使用数组语法）
- `Iterator`（可使用 `foreach` 循环）
- `Countable`（可使用 `count()`）
- `JsonSerializable`（可轻松转换为 JSON）

## 基本用法

### 创建集合

你可以简单地将一个数组传递给构造函数来创建集合：

```php
use flight\util\Collection;

$data = [
  'name' => 'Flight',
  'version' => 3,
  'features' => ['routing', 'views', 'extending']
];

$collection = new Collection($data);
```

### 访问数据项

你可以使用数组或对象表示法来访问数据项：

```php
// 数组表示法
echo $collection['name']; // 输出: Flight

// 对象表示法
echo $collection->version; // 输出: 3
```

如果你尝试访问不存在的键，会得到 `null` 而不是错误。

### 设置数据项

你也可以使用两种表示法来设置数据项：

```php
// 数组表示法
$collection['author'] = 'Mike Cao';

// 对象表示法
$collection->license = 'MIT';
```

### 检查与删除数据项

检查数据项是否存在：

```php
if (isset($collection['name'])) {
  // 执行某些操作
}

if (isset($collection->version)) {
  // 执行某些操作
}
```

删除数据项：

```php
unset($collection['author']);
unset($collection->license);
```

### 遍历集合

集合是可迭代的，因此可以在 `foreach` 循环中使用：

```php
foreach ($collection as $key => $value) {
  echo "$key: $value\n";
}
```

### 计数

你可以统计集合中的数据项数量：

```php
echo count($collection); // 输出: 4
```

### 获取所有键或数据

获取所有键：

```php
$keys = $collection->keys(); // ['name', 'version', 'features', 'license']
```

以数组形式获取所有数据：

```php
$data = $collection->getData();
```

### 清空集合

移除所有数据项：

```php
$collection->clear();
```

### JSON 序列化

集合可以轻松转换为 JSON：

```php
echo json_encode($collection);
// 输出: {"name":"Flight","version":3,"features":["routing","views","extending"],"license":"MIT"}
```

## 高级用法

如果需要，你可以完全替换内部的数据数组：

```php
$collection->setData(['foo' => 'bar']);
```

当你需要在组件之间传递结构化数据，或想为数组数据提供更面向对象的接口时，集合特别有用。

## 参见

- [请求](requests) - 了解如何处理 HTTP 请求以及如何使用集合管理请求数据。
- [PDO 包装器](pdo_wrapper) - 了解如何使用 Flight 中的 PDO 包装器以及如何使用集合管理数据库结果。

## 故障排除

- 如果尝试访问不存在的键，会得到 `null` 而不是错误。
- 请记住，集合不是递归的：嵌套数组不会自动转换为集合。
- 如果需要重置集合，使用 `$collection->clear()` 或 `$collection->setData([])`。

## 更新日志

- v3.0 - 改进类型提示和 PHP 8+ 支持。
- v1.0 - Collection 类初始发布。
