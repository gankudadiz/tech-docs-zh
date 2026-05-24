---
title: 插件开发
---

## 简介

Filament 插件的基础是 Laravel 包。它们通过 Composer 安装到你的 Filament 项目中，并遵循所有标准技术，例如使用服务提供者注册路由、视图和翻译。如果你是 Laravel 包开发新手，以下资源可以帮助你掌握核心概念：

- [Laravel 文档中的包开发部分](https://laravel.com/docs/packages)是一个很好的参考指南。
- [Spatie 的包培训课程](https://spatie.be/products/laravel-package-training)是一个很好的教学视频系列，逐步教你整个过程。
- [Spatie 的包工具](https://github.com/spatie/laravel-package-tools)允许你使用流畅的配置对象简化服务提供者类。

Filament 插件建立在 Laravel 包的概念之上，允许你为任何 Filament 面板发布和使用可重用的功能。它们可以一次一个地添加到每个面板，并且每个面板的配置也可以不同。

## 使用插件类配置面板

插件类用于允许你的包与面板[配置](../panel-configuration)文件进行交互。它是一个简单的 PHP 类，实现了 `Plugin` 接口。需要 3 个方法：

- `getId()` 方法返回插件在其他插件中的唯一标识符。请确保它足够具体，不会与可能在同一项目中使用的其他插件冲突。
- `register()` 方法允许你使用面板可用的任何[配置](../panel-configuration)选项。这包括注册[资源](../resources/overview)、[自定义页面](../navigation/custom-pages)、[主题](../styling/overview#创建自定义主题)、[渲染钩子](../panel-configuration#渲染钩子)等。
- `boot()` 方法仅在插件注册到的面板实际使用时才运行。它由中间件类执行。

```php
<?php

namespace DanHarrin\FilamentBlog;

use DanHarrin\FilamentBlog\Pages\Settings;
use DanHarrin\FilamentBlog\Resources\CategoryResource;
use DanHarrin\FilamentBlog\Resources\PostResource;
use Filament\Contracts\Plugin;
use Filament\Panel;

class BlogPlugin implements Plugin
{
    public function getId(): string
    {
        return 'blog';
    }

    public function register(Panel $panel): void
    {
        $panel
            ->resources([
                PostResource::class,
                CategoryResource::class,
            ])
            ->pages([
                Settings::class,
            ]);
    }

    public function boot(Panel $panel): void
    {
        //
    }
}
```

你的插件用户可以通过实例化插件类并将其传递给[配置](../panel-configuration)的 `plugin()` 方法来将其添加到面板：

```php
use DanHarrin\FilamentBlog\BlogPlugin;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->plugin(new BlogPlugin());
}
```

### 流畅地实例化插件类

你可能想向插件类添加一个 `make()` 方法，为用户提供流畅的接口来实例化它。此外，通过使用容器（`app()`）来实例化插件对象，它可以在运行时被替换为不同的实现：

```php
use Filament\Contracts\Plugin;

class BlogPlugin implements Plugin
{
    public static function make(): static
    {
        return app(static::class);
    }
    
    // ...
}
```

现在，你的用户可以使用 `make()` 方法：

```php
use DanHarrin\FilamentBlog\BlogPlugin;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->plugin(BlogPlugin::make());
}
```

### 每个面板配置插件

你可以向插件类添加其他方法，允许用户配置它。我们建议你为提供的每个选项添加 setter 和 getter 方法。你应该使用属性在 setter 中存储偏好，并在 getter 中再次检索它：

```php
use DanHarrin\FilamentBlog\Resources\AuthorResource;
use Filament\Contracts\Plugin;
use Filament\Panel;

class BlogPlugin implements Plugin
{
    protected bool $hasAuthorResource = false;
    
    public function authorResource(bool $condition = true): static
    {
        // 这是 setter 方法，用户的偏好存储在
        // 插件对象的属性中。
        $this->hasAuthorResource = $condition;
    
        // 从 setter 方法返回插件对象以
        // 允许流畅地链接配置选项。
        return $this;
    }
    
    public function hasAuthorResource(): bool
    {
        // 这是 getter 方法，用户的偏好
        // 从插件属性中检索。
        return $this->hasAuthorResource;
    }
    
    public function register(Panel $panel): void
    {
        // 由于 `register()` 方法在用户
        // 配置插件之后执行，你可以在其中
        // 访问他们的任何偏好。
        if ($this->hasAuthorResource()) {
            // 在这里，我们仅在用户请求时
            // 在面板上注册作者资源。
            $panel->resources([
                AuthorResource::class,
            ]);
        }
    }
    
    // ...
}
```

此外，你可以使用插件的唯一 ID 从插件类外部访问其任何配置选项。为此，请将 ID 传递给 `filament()` 方法：

```php
filament('blog')->hasAuthorResource()
```

你可能希望在访问配置时获得更好的类型安全性和 IDE 自动完成。如何实现这一点完全取决于你，但一个想法可以是在插件类中添加一个静态方法来检索它：

```php
use Filament\Contracts\Plugin;

class BlogPlugin implements Plugin
{
    public static function get(): static
    {
        return filament(app(static::class)->getId());
    }
    
    // ...
}
```

现在，你可以使用新的静态方法访问插件配置：

```php
BlogPlugin::get()->hasAuthorResource()
```

## 在插件中分发面板

在 Laravel 包中分发整个面板非常容易。这样，用户只需安装你的插件，就可以拥有一个完全预构建的应用新部分。

在[配置](../panel-configuration)面板时，配置类扩展了 `PanelProvider` 类，这是一个标准的 Laravel 服务提供者。你可以在包中将其用作服务提供者：

```php
<?php

namespace DanHarrin\FilamentBlog;

use Filament\Panel;
use Filament\PanelProvider;

class BlogPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->id('blog')
            ->path('blog')
            ->resources([
                // ...
            ])
            ->pages([
                // ...
            ])
            ->widgets([
                // ...
            ])
            ->middleware([
                // ...
            ])
            ->authMiddleware([
                // ...
            ]);
    }
}
```

然后你应该在包的 `composer.json` 中将其注册为服务提供者：

```json
"extra": {
    "laravel": {
        "providers": [
            "DanHarrin\\FilamentBlog\\BlogPanelProvider"
        ]
    }
}
```
