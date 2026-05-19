---
title: 三态过滤器
---

## 简介

三态过滤器允许你轻松创建一个具有三种状态的选择过滤器——通常是 true、false 和 blank。要将名为 `is_admin` 的列筛选为 `true` 或 `false`，你可以使用三态过滤器：

```php
use Filament\Tables\Filters\TernaryFilter;

TernaryFilter::make('is_admin')
```

![三态过滤器](/assets/filament/v4.x/screenshots/images/light/tables/filters/ternary.jpg)

## 将三态过滤器用于可空列

另一个常见模式是使用可空列。例如，当使用 `email_verified_at` 列筛选已验证和未验证的用户时，未验证的用户在该列中具有空时间戳。要应用该逻辑，你可以使用 `nullable()` 方法：

```php
use Filament\Tables\Filters\TernaryFilter;

TernaryFilter::make('email_verified_at')
    ->nullable()
```

## 自定义三态过滤器使用的列

用于限定查询范围的列名就是过滤器的名称。要自定义此行为，你可以使用 `attribute()` 方法：

```php
use Filament\Tables\Filters\TernaryFilter;

TernaryFilter::make('verified')
    ->nullable()
    ->attribute('status_id')
```

## 自定义三态过滤器选项标签

你可以自定义三态过滤器每个状态使用的标签。true 选项标签可以使用 `trueLabel()` 方法自定义。false 选项标签可以使用 `falseLabel()` 方法自定义。blank（默认）选项标签可以使用 `placeholder()` 方法自定义：

```php
use Illuminate\Database\Eloquent\Builder;
use Filament\Tables\Filters\TernaryFilter;

TernaryFilter::make('email_verified_at')
    ->label('Email verification')
    ->nullable()
    ->placeholder('All users')
    ->trueLabel('Verified users')
    ->falseLabel('Not verified users')
```

## 自定义三态过滤器修改查询的方式

你可以使用 `queries()` 方法自定义三态过滤器每个状态的查询变化方式：

```php
use Illuminate\Database\Eloquent\Builder;
use Filament\Tables\Filters\TernaryFilter;

TernaryFilter::make('email_verified_at')
    ->label('Email verification')
    ->placeholder('All users')
    ->trueLabel('Verified users')
    ->falseLabel('Not verified users')
    ->queries(
        true: fn (Builder $query) => $query->whereNotNull('email_verified_at'),
        false: fn (Builder $query) => $query->whereNull('email_verified_at'),
        blank: fn (Builder $query) => $query, // 在此示例中，当为空时不希望筛选查询。
    )
```

## 筛选可软删除的记录

`TrashedFilter` 可用于筛选软删除的记录。它是 Filament 内置的一种三态过滤器。你可以这样使用它：

```php
use Filament\Tables\Filters\TrashedFilter;

TrashedFilter::make()
```
