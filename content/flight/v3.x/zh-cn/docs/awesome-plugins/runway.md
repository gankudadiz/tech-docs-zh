---
title: Runway
source: https://github.com/flightphp/docs/blob/master/content/v3/en/awesome-plugins/runway.md
status: 已翻译
---

# Runway

Runway 是一个帮助你管理 Flight 应用程序的 CLI 应用程序。它可以生成控制器、显示所有路由等。它基于出色的 [adhocore/php-cli](https://github.com/adhocore/php-cli) 库构建。

点击[这里](https://github.com/flightphp/runway)查看代码。

## 安装

通过 composer 安装。

```bash
composer require flightphp/runway
```

## 基本配置

首次运行 Runway 时，它将尝试在 `app/config/config.php` 中通过 `'runway'` 键查找 `runway` 配置。

```php
<?php
// app/config/config.php
return [
    'runway' => [
        'app_root' => 'app/',
		'public_root' => 'public/',
    ],
];
```

> **注意** - 自 **v1.2.0** 起，`.runway-config.json` 已弃用。请将配置迁移到 `app/config/config.php`。你可以使用 `php runway config:migrate` 命令轻松完成。

### 项目根目录检测

Runway 足够智能，可以检测项目的根目录，即使你从子目录运行它。它查找诸如 `composer.json`、`.git` 或 `app/config/config.php` 等指示符来确定项目根目录的位置。这意味着你可以在项目的任何位置运行 Runway 命令！

## 用法

Runway 有许多可用于管理 Flight 应用的命令。有两种简单的方法使用 Runway。

1. 如果你使用 skeleton 项目，可以从项目根目录运行 `php runway [command]`。
2. 如果使用通过 composer 安装的 Runway 作为包，可以从项目根目录运行 `vendor/bin/runway [command]`。

### 命令列表

你可以通过运行 `php runway` 命令查看所有可用命令的列表。

```bash
php runway
```

### 命令帮助

对于任何命令，你可以传入 `--help` 标志来获取更多关于如何使用该命令的信息。

```bash
php runway routes --help
```

以下是几个示例：

### 生成控制器

基于 `runway.app_root` 中的配置，该命令将在 `app/controllers/` 目录中为你生成一个控制器。

```bash
php runway make:controller MyController
```

### 生成 Active Record 模型

首先确保你已经安装了 [Active Record](../active-record) 插件。基于 `runway.app_root` 中的配置，该命令将在 `app/records/` 目录中为你生成一个记录。

```bash
php runway make:record users
```

例如，如果你有一个具有以下结构的 `users` 表：`id`、`name`、`email`、`created_at`、`updated_at`，一个类似以下内容的文件将在 `app/records/UserRecord.php` 文件中创建：

```php
<?php

declare(strict_types=1);

namespace app\records;

/**
 * ActiveRecord class for the users table.
 * @link https://docs.flightphp.com/awesome-plugins/active-record
 * 
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string $created_at
 * @property string $updated_at
 * // 你还可以在这里添加关系，在 $relations 数组中定义它们后
 * @property CompanyRecord $company 关系示例
 */
class UserRecord extends \flight\ActiveRecord
{
    /**
     * @var array $relations 设置模型的关系
     *   https://docs.flightphp.com/awesome-plugins/active-record#relationships
     */
    protected array $relations = [];

    /**
     * 构造函数
     * @param mixed $databaseConnection 数据库连接
     */
    public function __construct($databaseConnection)
    {
        parent::__construct($databaseConnection, 'users');
    }
}
```

### 显示所有路由

这将显示当前向 Flight 注册的所有路由。

```bash
php runway routes
```

如果只想查看特定的路由，可以传入一个标志来过滤路由。

```bash
# 仅显示 GET 路由
php runway routes --get

# 仅显示 POST 路由
php runway routes --post

# 等等。
```

## 添加自定义命令到 Runway

如果你正在为 Flight 创建包，或者想将自定义命令添加到项目中，可以通过创建 `src/commands/`、`flight/commands/`、`app/commands/` 或 `commands/` 目录来实现。如果需要进一步自定义，请参阅下面的配置部分。

要创建命令，只需扩展 `AbstractBaseCommand` 类，并至少实现 `__construct` 方法和 `execute` 方法。

```php
<?php

declare(strict_types=1);

namespace flight\commands;

class ExampleCommand extends AbstractBaseCommand
{
	/**
     * 构造函数
     *
     * @param array<string,mixed> $config 来自 app/config/config.php 的配置
     */
    public function __construct(array $config)
    {
        parent::__construct('make:example', '为文档创建示例', $config);
        $this->argument('<funny-gif>', '有趣 gif 的名称');
    }

	/**
     * 执行函数
     *
     * @return void
     */
    public function execute()
    {
        $io = $this->app()->io();

		$io->info('创建示例中...');

		// 在这里执行某些操作

		$io->ok('示例已创建！');
	}
}
```

更多关于如何构建自定义命令的信息，请参见 [adhocore/php-cli 文档](https://github.com/adhocore/php-cli)！

## 配置管理

由于配置自 `v1.2.0` 起移至 `app/config/config.php`，有一些辅助命令可用于管理配置。

### 迁移旧配置

如果你有旧的 `.runway-config.json` 文件，可以使用以下命令轻松迁移到 `app/config/config.php`：

```bash
php runway config:migrate
```

### 设置配置值

你可以使用 `config:set` 命令设置配置值。这在你想在不打开文件的情况下更新配置值时非常有用。

```bash
php runway config:set app_root "app/"
```

### 获取配置值

你可以使用 `config:get` 命令获取配置值。

```bash
php runway config:get app_root
```

## 所有 Runway 配置

如果你需要自定义 Runway 的配置，可以在 `app/config/config.php` 中设置这些值。以下是一些可以设置的额外配置：

```php
<?php
// app/config/config.php
return [
    // ... 其他配置值 ...

    'runway' => [
        // 应用目录所在位置
        'app_root' => 'app/',

        // 根索引文件所在的目录
        'index_root' => 'public/',

        // 其他项目根目录的路径
        'root_paths' => [
            '/home/user/different-project',
            '/var/www/another-project'
        ],

        // 基本路径通常不需要配置，但如果需要可以设置
        'base_paths' => [
            '/includes/libs/vendor', // 如果你的 vendor 目录路径非常特殊
        ],

        // final_paths 是项目中用于搜索命令文件的位置
        'final_paths' => [
            'src/diff-path/commands',
            'app/module/admin/commands',
        ],

        // 如果你想直接添加完整路径（绝对路径或相对于项目根目录）
        'paths' => [
            '/home/user/different-project/src/diff-path/commands',
            '/var/www/another-project/app/module/admin/commands',
            'app/my-unique-commands'
        ]
    ]
];
```

### 访问配置

如果你需要高效地访问配置值，可以通过 `__construct` 方法或 `app()` 方法访问。还需要注意，如果你有 `app/config/services.php` 文件，这些服务也将可供你的命令使用。

```php
public function execute()
{
    $io = $this->app()->io();
    
    // 访问配置
    $app_root = $this->config['runway']['app_root'];
    
    // 访问服务，比如数据库连接
    $database = $this->config['database']
    
    // ...
}
```

## AI 辅助包装器

Runway 有一些辅助包装器，使 AI 更容易生成命令。你可以以类似 Symfony Console 的方式使用 `addOption` 和 `addArgument`。如果你使用 AI 工具生成命令，这将很有帮助。

```php
public function __construct(array $config)
{
    parent::__construct('make:example', '为文档创建示例', $config);
    
    // mode 参数可以为空，默认为完全可选
    $this->addOption('name', '示例的名称', null);
}
```
