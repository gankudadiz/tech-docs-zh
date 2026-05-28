---
title: EasyQuery
source: https://github.com/flightphp/docs/blob/master/content/v3/en/awesome-plugins/easy_query.md
status: 已翻译
---

# EasyQuery

[knifelemon/easy-query](https://github.com/knifelemon/EasyQueryBuilder) 是一个轻量级、流式 SQL 查询构建器，生成 SQL 和参数用于预处理语句。与 [SimplePdo](../learn/simple_pdo) 配合使用。

## 特性

- 🔗 **流式 API** - 链式方法构建可读的查询
- 🛡️ **SQL 注入保护** - 使用预处理语句自动绑定参数
- 🔧 **原始 SQL 支持** - 使用 `raw()` 插入原始 SQL 表达式
- 📝 **多种查询类型** - SELECT、INSERT、UPDATE、DELETE、COUNT
- 🔀 **JOIN 支持** - INNER、LEFT、RIGHT 连接及别名
- 🎯 **高级条件** - LIKE、IN、NOT IN、BETWEEN、比较运算符
- 🪶 **轻量级** - 零依赖

## 安装

```bash
composer require knifelemon/easy-query
```

## 快速开始

```php
use KnifeLemon\EasyQuery\Builder;

$q = Builder::table('users')
    ->select(['id', 'name', 'email'])
    ->where(['status' => 'active'])
    ->orderBy('created_at DESC')
    ->limit(10)
    ->build();

// 配合 Flight 的 SimplePdo 使用
$users = Flight::db()->fetchAll($q['sql'], $q['params']);
```

`build()` 返回 `['sql' => ..., 'params' => ...]` 数组，通过预处理语句保证安全。

## 查询类型

支持 SELECT、INSERT、UPDATE、DELETE、COUNT。支持 WHERE 条件（`=`、`>=`、`<`、`!=`、LIKE、IN、NOT IN、BETWEEN）、OR 条件、JOIN（INNER/LEFT/RIGHT）、ORDER BY、GROUP BY、LIMIT/OFFSET。支持 `raw()` 原始 SQL 表达式和 `safeIdentifier()` 安全标识符。支持 `clearWhere()` 等方法实现查询构建器复用。

完整文档见 [GitHub 仓库](https://github.com/knifelemon/EasyQueryBuilder)。
