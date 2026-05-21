---
title: 图标条目
---

## 简介

图标条目渲染一个表示条目状态的[图标](../styling/icons)：

```php
use Filament\Infolists\Components\IconEntry;
use Filament\Support\Icons\Heroicon;

IconEntry::make('status')
    ->icon(fn (string $state): Heroicon => match ($state) {
        'draft' => Heroicon::OutlinedPencil,
        'reviewing' => Heroicon::OutlinedClock,
        'published' => Heroicon::OutlinedCheckCircle,
    })
```

`icon()` 方法可以将各种实用工具作为参数注入到函数中。

![图标条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/icon/simple.jpg)

## 自定义颜色

你可以使用 `color()` 方法更改图标的[颜色](../styling/colors)：

```php
use Filament\Infolists\Components\IconEntry;

IconEntry::make('status')
    ->color('success')
```

通过向 `color()` 传递函数，你可以根据条目的状态自定义颜色：

```php
use Filament\Infolists\Components\IconEntry;

IconEntry::make('status')
    ->color(fn (string $state): string => match ($state) {
        'draft' => 'info',
        'reviewing' => 'warning',
        'published' => 'success',
        default => 'gray',
    })
```

`color()` 方法可以将各种实用工具作为参数注入到函数中。

![带有颜色的图标条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/icon/color.jpg)

## 自定义大小

默认图标大小为 `IconSize::Large`，但你可以将大小自定义为 `IconSize::ExtraSmall`、`IconSize::Small`、`IconSize::Medium`、`IconSize::ExtraLarge` 或 `IconSize::TwoExtraLarge`：

```php
use Filament\Infolists\Components\IconEntry;
use Filament\Support\Enums\IconSize;

IconEntry::make('status')
    ->size(IconSize::Medium)
```

除了允许静态值外，`size()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。

![中等大小的图标条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/icon/medium.jpg)

## 处理布尔值

图标条目可以使用 `boolean()` 方法根据条目的状态（true 或 false）显示勾选或"X"图标：

```php
use Filament\Infolists\Components\IconEntry;

IconEntry::make('is_featured')
    ->boolean()
```

> 如果模型类中的此属性已经转换为 `bool` 或 `boolean`，Filament 能够检测到这一点，你不需要手动使用 `boolean()`。

![显示布尔值的图标条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/icon/boolean.jpg)

你可以选择传递一个布尔值来控制图标是否应该是布尔值：

```php
use Filament\Infolists\Components\IconEntry;

IconEntry::make('is_featured')
    ->boolean(FeatureFlag::active())
```

除了允许静态值外，`boolean()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。

### 自定义布尔图标

你可以自定义表示每个状态的[图标](../styling/icons)：

```php
use Filament\Infolists\Components\IconEntry;
use Filament\Support\Icons\Heroicon;

IconEntry::make('is_featured')
    ->boolean()
    ->trueIcon(Heroicon::OutlinedCheckBadge)
    ->falseIcon(Heroicon::OutlinedXMark)
```

除了允许静态值外，`trueIcon()` 和 `falseIcon()` 方法还接受函数来动态计算它们。你可以将各种实用工具作为参数注入到函数中。

![显示带有自定义图标的布尔值的图标条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/icon/boolean-icon.jpg)

### 自定义布尔颜色

你可以自定义表示每个状态的图标[颜色](../styling/colors)：

```php
use Filament\Infolists\Components\IconEntry;

IconEntry::make('is_featured')
    ->boolean()
    ->trueColor('info')
    ->falseColor('warning')
```

除了允许静态值外，`trueColor()` 和 `falseColor()` 方法还接受函数来动态计算它们。你可以将各种实用工具作为参数注入到函数中。

![显示带有自定义颜色的布尔值的图标条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/icon/boolean-color.jpg)
