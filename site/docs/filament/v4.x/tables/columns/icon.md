---
title: 图标列
---

## 简介

图标列渲染一个表示列状态的[图标](../../styling/icons)：

```php
use Filament\Tables\Columns\IconColumn;
use Filament\Support\Icons\Heroicon;

IconColumn::make('status')
    ->icon(fn (string $state): Heroicon => match ($state) {
        'draft' => Heroicon::OutlinedPencil,
        'reviewing' => Heroicon::OutlinedClock,
        'published' => Heroicon::OutlinedCheckCircle,
    })
```

`icon()` 方法支持在闭包中注入 Filament 的工具参数。

![图标列](/assets/filament/v4.x/screenshots/images/light/tables/columns/icon/simple.jpg)

## 自定义颜色

你可以使用 `color()` 方法更改图标的[颜色](../../styling/colors)：

```php
use Filament\Tables\Columns\IconColumn;

IconColumn::make('status')
    ->color('success')
```

通过向 `color()` 传递函数，你可以根据列的状态自定义颜色：

```php
use Filament\Tables\Columns\IconColumn;

IconColumn::make('status')
    ->color(fn (string $state): string => match ($state) {
        'draft' => 'info',
        'reviewing' => 'warning',
        'published' => 'success',
        default => 'gray',
    })
```

`color()` 方法支持在闭包中注入 Filament 的工具参数。

![带颜色的图标列](/assets/filament/v4.x/screenshots/images/light/tables/columns/icon/color.jpg)

## 自定义大小

默认图标大小为 `IconSize::Large`，但你可以将大小自定义为 `IconSize::ExtraSmall`、`IconSize::Small`、`IconSize::Medium`、`IconSize::ExtraLarge` 或 `IconSize::TwoExtraLarge`：

```php
use Filament\Tables\Columns\IconColumn;
use Filament\Support\Enums\IconSize;

IconColumn::make('status')
    ->size(IconSize::Medium)
```

除固定值外，`size()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

![中等大小图标列](/assets/filament/v4.x/screenshots/images/light/tables/columns/icon/medium.jpg)

## 处理布尔值

图标列可以使用 `boolean()` 方法根据列的状态（true 或 false）显示勾选或"X"图标：

```php
use Filament\Tables\Columns\IconColumn;

IconColumn::make('is_featured')
    ->boolean()
```

> 如果模型类中的此属性已经被转换为 `bool` 或 `boolean`，Filament 能够检测到，你不需要手动使用 `boolean()`。

![显示布尔值的图标列](/assets/filament/v4.x/screenshots/images/light/tables/columns/icon/boolean.jpg)

你可以选择传递一个布尔值来控制图标是否应为布尔类型：

```php
use Filament\Tables\Columns\IconColumn;

IconColumn::make('is_featured')
    ->boolean(FeatureFlag::active())
```

除固定值外，`boolean()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

### 自定义布尔图标

你可以自定义表示每个状态的[图标](../../styling/icons)：

```php
use Filament\Tables\Columns\IconColumn;
use Filament\Support\Icons\Heroicon;

IconColumn::make('is_featured')
    ->boolean()
    ->trueIcon(Heroicon::OutlinedCheckBadge)
    ->falseIcon(Heroicon::OutlinedXMark)
```

除固定值外，`trueIcon()` 和 `falseIcon()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

![自定义布尔图标的图标列](/assets/filament/v4.x/screenshots/images/light/tables/columns/icon/boolean-icon.jpg)

### 自定义布尔颜色

你可以自定义表示每个状态的图标[颜色](../../styling/colors)：

```php
use Filament\Tables\Columns\IconColumn;

IconColumn::make('is_featured')
    ->boolean()
    ->trueColor('info')
    ->falseColor('warning')
```

除固定值外，`trueColor()` 和 `falseColor()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

![自定义布尔颜色的图标列](/assets/filament/v4.x/screenshots/images/light/tables/columns/icon/boolean-color.jpg)

## 换行多个图标

显示多个图标时，如果它们无法放在一行上，可以使用 `wrap()` 设置换行：

```php
use Filament\Tables\Columns\IconColumn;

IconColumn::make('icon')
    ->wrap()
```

![换行的图标列](/assets/filament/v4.x/screenshots/images/light/tables/columns/icon/wrap.jpg)

:::tip
换行的"宽度"受列标签影响，因此你可能需要使用更短或隐藏的标签来更紧密地换行。
:::
