---
title: 自定义资源页面
---

## 简介

Filament 允许你为资源创建完全自定义的页面。要创建新页面，你可以使用：

```bash
php artisan make:filament-page SortUsers --resource=UserResource --type=custom
```

此命令将创建两个文件 - 一个页面类位于资源目录的 `/Pages` 目录中，一个视图位于资源视图目录的 `/pages` 目录中。

你必须在资源的静态 `getPages()` 方法中将自定义页面注册到路由：

```php
public static function getPages(): array
{
    return [
        // ...
        'sort' => Pages\SortUsers::route('/sort'),
    ];
}
```

:::warning
在此方法中注册的页面顺序很重要 — 带参数的路由（如 `/{record}`）必须放在固定路径（如 `/sort`）之后，否则 Laravel 路由器会优先匹配带参数的路由，导致固定路径失效。
:::

路由路径中定义的任何[参数](https://laravel.com/docs/routing#route-parameters)将以与 [Livewire](https://livewire.laravel.com/docs/components#accessing-route-parameters) 相同的方式提供给页面类。

![带有设置表单的自定义资源页面](../../../raw-assets/docs-assets/screenshots/images/light/panels/resources/custom-page.jpg)

## 使用资源记录

如果你想创建一个类似于[编辑](editing-records)或[查看](viewing-records)页面的页面，可以使用 `InteractsWithRecord` trait：

```php
use Filament\Resources\Pages\Page;
use Filament\Resources\Pages\Concerns\InteractsWithRecord;

class ManageUser extends Page
{
    use InteractsWithRecord;
    
    public function mount(int | string $record): void
    {
        $this->record = $this->resolveRecord($record);
    }

    // ...
}
```

`mount()` 方法应从 URL 解析记录并将其存储在 `$this->record` 中。你可以在类或视图中随时使用 `$this->getRecord()` 访问该记录。

要将记录作为参数添加到路由中，必须在 `getPages()` 中定义 `{record}`：

```php
public static function getPages(): array
{
    return [
        // ...
        'manage' => Pages\ManageUser::route('/{record}/manage'),
    ];
}
```
