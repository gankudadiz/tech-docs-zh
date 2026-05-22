---
title: 统计概览小部件
---
## 简介

Filament 附带了一个"统计概览"小部件模板，你可以使用它在单个小部件中显示多个不同的统计数据，而无需编写自定义视图。

首先使用命令创建一个小部件：

```bash
php artisan make:filament-widget StatsOverview --stats-overview
```

此命令将创建一个新的 `StatsOverview.php` 文件。打开它，并从 `getStats()` 方法返回 `Stat` 实例：

```php
<?php

namespace App\Filament\Widgets;

use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends BaseWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Unique views', '192.1k'),
            Stat::make('Bounce rate', '21%'),
            Stat::make('Average time on page', '3:12'),
        ];
    }
}
```

现在，在仪表盘中查看你的小部件。

![统计概览](/assets/filament/v4.x/screenshots/images/light/widgets/stats-overview/simple.jpg)

## 为统计数据添加描述和图标

你可以添加 `description()` 来提供额外信息，以及 `descriptionIcon()` 来添加图标：

```php
use Filament\Widgets\StatsOverviewWidget\Stat;

protected function getStats(): array
{
    return [
        Stat::make('Unique views', '192.1k')
            ->description('32k increase')
            ->descriptionIcon('heroicon-m-arrow-trending-up'),
        Stat::make('Bounce rate', '21%')
            ->description('7% decrease')
            ->descriptionIcon('heroicon-m-arrow-trending-down'),
        Stat::make('Average time on page', '3:12')
            ->description('3% increase')
            ->descriptionIcon('heroicon-m-arrow-trending-up'),
    ];
}
```

`descriptionIcon()` 方法还接受第二个参数，用于将图标放在描述之前而不是之后：

```php
use Filament\Support\Enums\IconPosition;
use Filament\Widgets\StatsOverviewWidget\Stat;

Stat::make('Unique views', '192.1k')
    ->description('32k increase')
    ->descriptionIcon('heroicon-m-arrow-trending-up', IconPosition::Before)
```

![带描述的统计概览](/assets/filament/v4.x/screenshots/images/light/widgets/stats-overview/description.jpg)

## 更改统计数据的颜色

你还可以为统计数据设置[颜色](../styling/colors)：

```php
use Filament\Widgets\StatsOverviewWidget\Stat;

protected function getStats(): array
{
    return [
        Stat::make('Unique views', '192.1k')
            ->description('32k increase')
            ->descriptionIcon('heroicon-m-arrow-trending-up')
            ->color('success'),
        Stat::make('Bounce rate', '21%')
            ->description('7% increase')
            ->descriptionIcon('heroicon-m-arrow-trending-down')
            ->color('danger'),
        Stat::make('Average time on page', '3:12')
            ->description('3% increase')
            ->descriptionIcon('heroicon-m-arrow-trending-up')
            ->color('success'),
    ];
}
```

![带颜色的统计概览](/assets/filament/v4.x/screenshots/images/light/widgets/stats-overview/color.jpg)

## 为统计数据添加额外的 HTML 属性

你还可以使用 `extraAttributes()` 向统计数据传递额外的 HTML 属性：

```php
use Filament\Widgets\StatsOverviewWidget\Stat;

protected function getStats(): array
{
    return [
        Stat::make('Processed', '192.1k')
            ->color('success')
            ->extraAttributes([
                'class' => 'cursor-pointer',
                'wire:click' => "\$dispatch('setStatusFilter', { filter: 'processed' })",
            ]),
        // ...
    ];
}
```

在此示例中，我们有意转义了 `$dispatch()` 中的 `$`，因为这需要直接传递给 HTML，它不是 PHP 变量。

## 为统计数据添加图表

你还可以为每个统计数据添加或链式调用 `chart()` 来提供历史数据。`chart()` 方法接受一个数据点数组来绘制：

```php
use Filament\Widgets\StatsOverviewWidget\Stat;

protected function getStats(): array
{
    return [
        Stat::make('Unique views', '192.1k')
            ->description('32k increase')
            ->descriptionIcon('heroicon-m-arrow-trending-up')
            ->chart([7, 2, 10, 3, 15, 4, 17])
            ->color('success'),
        // ...
    ];
}
```

![带图表的统计概览](/assets/filament/v4.x/screenshots/images/light/widgets/stats-overview/chart.jpg)

## 实时更新统计数据（轮询）

默认情况下，统计概览小部件每 5 秒刷新一次数据。

要自定义此行为，你可以覆盖类上的 `$pollingInterval` 属性为新的间隔：

```php
protected ?string $pollingInterval = '10s';
```

或者，你可以完全禁用轮询：

```php
protected ?string $pollingInterval = null;
```

## 禁用懒加载

默认情况下，小部件是懒加载的。这意味着它们只有在页面上可见时才会加载。

要禁用此行为，你可以覆盖小部件类上的 `$isLazy` 属性：

```php
protected static bool $isLazy = false;
```

## 添加标题和描述

你还可以通过覆盖 `$heading` 和 `$description` 属性在小部件上方添加标题和描述文本：

```php
protected ?string $heading = 'Analytics';

protected ?string $description = 'An overview of some analytics.';
```

如果你需要动态生成标题或描述文本，可以覆盖 `getHeading()` 和 `getDescription()` 方法：

```php
protected function getHeading(): ?string
{
    return 'Analytics';
}

protected function getDescription(): ?string
{
    return 'An overview of some analytics.';
}
```

![带标题和描述的统计概览](/assets/filament/v4.x/screenshots/images/light/widgets/stats-overview/heading.jpg)
