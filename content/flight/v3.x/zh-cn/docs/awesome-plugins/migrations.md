---
title: 数据库迁移
source: https://github.com/flightphp/docs/blob/master/content/v3/en/awesome-plugins/migrations.md
status: 已翻译
---

# 数据库迁移

[byjg/php-migration](https://github.com/byjg/php-migration) 是一个帮助你跟踪项目中所有数据库变更的核心库。

## 安装

```bash
composer require "byjg/migration"
# 或 CLI 版本
composer require "byjg/migration-cli"
```

## 支持的数据库

支持 Sqlite、MySQL/MariaDB、Postgres、Sql Server（Linux/Windows）。

## 工作原理

使用纯 SQL 管理数据库版本。需要创建 SQL 脚本（BASE/UP/DOWN），目录结构如下：

```text
<root dir>/
  ├── base.sql          # 基础脚本
  └── /migrations/
       ├── /up/         # 升级脚本（00001.sql, 00002.sql...）
       └── /down/       # 降级脚本（00001.sql...）
```

支持多开发者协作（`-dev` 后缀机制）。

## PHP API 集成

```php
$connectionUri = new \ByJG\Util\Uri('mysql://user:pass@localhost/db');
\ByJG\DbMigration\Migration::registerDatabase(\ByJG\DbMigration\Database\MySqlDatabase::class);
$migration = new \ByJG\DbMigration\Migration($connectionUri, '.');
$migration->reset();  // 从 base.sql 恢复并运行所有迁移
$migration->update(); // 迁移到最新版本
```

支持版本控制（`createVersion()`）、进度回调、事务上下文（避免部分迁移，MySQL 不支持）。完整文档见 [GitHub](https://github.com/byjg/php-migration)。
