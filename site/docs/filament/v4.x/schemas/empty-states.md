---
title: 空状态
---

## 简介

你可以在 schema 中显示空状态，以传达尚无内容可显示，并引导用户进行下一步操作。空状态需要一个标题，但也可以有 `description()`、[`icon()`](#向空状态添加图标)和 [`footer()`](#在空状态页脚中插入操作和其他组件)：

```php
use Filament\Actions\Action;
use Filament\Schemas\Components\EmptyState;
use Filament\Support\Icons\Heroicon;

EmptyState::make('暂无用户')
    ->description('通过创建新用户开始。')
    ->icon(Heroicon::OutlinedUser)
    ->footer([
        Action::make('createUser')
            ->icon(Heroicon::Plus),
    ])
```

:::tip
除了允许静态值外，`make()` 和 `description()` 方法还接受函数来动态计算它们。你可以将各种实用工具作为参数注入到函数中。
:::

![空状态](/assets/filament/v4.x/screenshots/images/light/schemas/layout/empty-state/simple.jpg)

## 向空状态添加图标

你可以使用 `icon()` 方法向空状态添加[图标](../styling/icons)：

```php
use Filament\Schemas\Components\EmptyState;
use Filament\Support\Icons\Heroicon;

EmptyState::make('暂无用户')
    ->description('通过创建新用户开始。')
    ->icon(Heroicon::OutlinedUser)
```

:::tip
除了允许静态值外，`icon()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。
:::

## 在空状态页脚中插入操作和其他组件

你可以通过将组件数组传递给 `footer()` 方法，在空状态页脚中插入[操作](../actions/overview)和任何其他 schema 组件（通常是[基础组件](primes)）：

```php
use Filament\Actions\Action;
use Filament\Schemas\Components\EmptyState;

EmptyState::make('暂无用户')
    ->description('通过创建新用户开始。')
    ->footer([
        Action::make('createUser')
            ->icon(Heroicon::Plus),
    ])
```

:::tip
除了允许静态值外，`footer()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。
:::

## 移除空状态容器

默认情况下，空状态有背景颜色、阴影和边框。你可以使用 `contained(false)` 移除这些样式，只渲染没有容器的空状态内容：

```php
use Filament\Schemas\Components\EmptyState;

EmptyState::make('暂无用户')
    ->description('通过创建新用户开始。')
    ->contained(false)
```

:::tip
除了允许静态值外，`contained()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。
:::

![没有容器的空状态](/assets/filament/v4.x/screenshots/images/light/schemas/layout/empty-state/contained-false.jpg)
