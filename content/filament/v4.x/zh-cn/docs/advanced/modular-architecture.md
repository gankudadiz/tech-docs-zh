---
title: 模块化架构（DDD）
---

## 简介

在使用 Filament 构建大型应用时，你可能希望使用领域驱动设计（DDD）原则来组织代码，将应用拆分为自包含的模块。本指南解释如何将 Filament 与模块化架构包（如 [InterNACHI/Modular](https://github.com/InterNACHI/modular)）集成。

## 模块化方法

在模块化架构中，应用的每个领域都作为一个独立的 Composer 包构建，通常位于 `app-modules/` 目录中。每个模块包含自己的：

- 模型和业务逻辑
- Filament 资源、页面和小部件
- 服务提供者
- 路由、视图和配置
- 测试

这种方法有几个好处：

- 领域之间的关注点清晰分离
- 更容易的团队协作（不同团队可以拥有不同模块）
- 更好的可测试性和可维护性
- 能够在项目之间复用模块

## 设置 InterNACHI/Modular

首先，安装模块化包：

```bash
composer require internachi/modular
```

创建一个新模块：

```bash
php artisan make:module alerts
```

这将搭建一个模块结构：

```
.
+-- app-modules
|   +-- alerts
|   |   +-- composer.json
|   |   +-- src
|   |   |   +-- Providers
|   |   |   |   +-- AlertsServiceProvider.php
|   |   +-- routes
|   |   +-- resources
|   |   +-- database
|   |   +-- tests
```

### 配置模块的 composer.json

每个模块应该 require `filament/filament` 并定义其服务提供者：

```json
{
    "name": "my-app/alerts",
    "type": "library",
    "require": {
        "filament/filament": "^4.0"
    },
    "autoload": {
        "psr-4": {
            "Modules\\Alerts\\": "src/"
        }
    },
    "extra": {
        "laravel": {
            "providers": [
                "Modules\\Alerts\\Providers\\AlertsServiceProvider"
            ]
        }
    }
}
```

## 为模块创建 Filament 插件

每个模块应该定义自己的 Filament 插件来注册其资源、页面和小部件：

```php
namespace Modules\Alerts;

use Filament\Contracts\Plugin;
use Filament\Panel;

class AlertsPlugin implements Plugin
{
    public function getId(): string
    {
        return 'alerts';
    }

    public static function make(): static
    {
        return app(static::class);
    }

    public function register(Panel $panel): void
    {
        $panel
            ->discoverResources(
                in: __DIR__ . '/Filament/Resources',
                for: 'Modules\\Alerts\\Filament\\Resources',
            )
            ->discoverPages(
                in: __DIR__ . '/Filament/Pages',
                for: 'Modules\\Alerts\\Filament\\Pages',
            )
            ->discoverWidgets(
                in: __DIR__ . '/Filament/Widgets',
                for: 'Modules\\Alerts\\Filament\\Widgets',
            );
    }

    public function boot(Panel $panel): void
    {
        //
    }
}
```

## 为特定面板有条件地注册插件

当你有多个面板（例如 `admin`、`app`、`portal`）时，你通常会希望某些模块仅为特定面板注册其插件。在模块的服务提供者中使用 `Panel::configureUsing()` 来有条件地注册插件。

### 基本的条件注册

要为除一个以外的所有面板注册插件：

```php
namespace Modules\Alerts\Providers;

use Filament\Panel;
use Illuminate\Support\ServiceProvider;
use Modules\Alerts\AlertsPlugin;

class AlertsServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        Panel::configureUsing(function (Panel $panel): void {
            if ($panel->getId() !== 'admin') {
                return;
            }

            $panel->plugin(AlertsPlugin::make());
        });
    }
}
```

### 使用 match 语句处理多个面板

当你需要为特定面板注册插件或为每个面板配置不同时，使用 `match` 语句直接调用 `$panel->plugin()`：

```php
namespace Modules\Alerts\Providers;

use Filament\Panel;
use Illuminate\Support\ServiceProvider;
use Modules\Alerts\AlertsPlugin;

class AlertsServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        Panel::configureUsing(function (Panel $panel): void {
            match ($panel->getId()) {
                'admin' => $panel->plugin(
                    AlertsPlugin::make()->enableAdminFeatures(),
                ),
                'staff' => $panel->plugin(
                    AlertsPlugin::make(),
                ),
                default => null,
            };
        });
    }
}
```

这种方法允许你根据面板配置每个插件实例，而语句中未匹配的面板则不会收到该插件。

## 模块目录结构

一个组织良好且集成了 Filament 的模块可能如下所示：

```
.
+-- app-modules
|   +-- alerts
|   |   +-- composer.json
|   |   +-- config
|   |   |   +-- alerts.php
|   |   +-- database
|   |   |   +-- factories
|   |   |   +-- migrations
|   |   |   +-- seeders
|   |   +-- resources
|   |   |   +-- views
|   |   |   |   +-- filament
|   |   |   |   |   +-- pages
|   |   +-- routes
|   |   |   +-- web.php
|   |   +-- src
|   |   |   +-- AlertsPlugin.php
|   |   |   +-- Filament
|   |   |   |   +-- Pages
|   |   |   |   +-- Resources
|   |   |   |   |   +-- Alerts
|   |   |   |   |   |   +-- AlertResource.php
|   |   |   |   |   |   +-- Pages
|   |   |   |   |   |   |   +-- CreateAlert.php
|   |   |   |   |   |   |   +-- EditAlert.php
|   |   |   |   |   |   |   +-- ListAlerts.php
|   |   |   |   +-- Widgets
|   |   |   +-- Models
|   |   |   |   +-- Alert.php
|   |   |   +-- Providers
|   |   |   |   +-- AlertsServiceProvider.php
|   |   +-- tests
```

## 在面板之间共享资源

有时你可能希望一个资源出现在多个面板中，并有不同的配置。你可以通过使用资源发现配合面板特定的自定义来实现：

```php
namespace Modules\Users;

use Filament\Contracts\Plugin;
use Filament\Panel;
use Modules\Users\Filament\Resources\UserResource;

class UsersPlugin implements Plugin
{
    protected bool $canManageRoles = false;

    public function getId(): string
    {
        return 'users';
    }

    public static function make(): static
    {
        return app(static::class);
    }

    public function canManageRoles(bool $condition = true): static
    {
        $this->canManageRoles = $condition;

        return $this;
    }

    public function hasRoleManagement(): bool
    {
        return $this->canManageRoles;
    }

    public function register(Panel $panel): void
    {
        $panel->resources([
            UserResource::class,
        ]);
    }

    public function boot(Panel $panel): void
    {
        //
    }
}
```

然后使用不同的能力进行注册：

```php
Panel::configureUsing(function (Panel $panel): void {
    match ($panel->getId()) {
        'admin' => $panel->plugin(
            UsersPlugin::make()->canManageRoles(),
        ),
        'staff' => $panel->plugin(
            UsersPlugin::make(),
        ),
        default => null,
    };
});
```

:::info
`Panel::configureUsing()` 方法非常强大，因为它允许模块自行配置，而无需修改你的面板提供者文件。当你添加或删除模块时，其 Filament 集成会自动处理。
:::

## 从模块注册 Livewire 组件

如果你的模块包含 Filament 使用的自定义 Livewire 组件（如自定义页面或小部件），你可以在插件的 `boot()` 方法中注册它们：

```php
use Livewire\Livewire;
use Modules\Alerts\Filament\Pages\AlertsDashboard;

public function boot(Panel $panel): void
{
    Livewire::component('alerts-dashboard', AlertsDashboard::class);
}
```
