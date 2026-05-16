---
title: 在资源页面使用小部件
---

## 介绍

Filament 允许你在页面内显示小部件，位于页头下方和页脚上方。

![带页头小部件的资源页面](/assets/filament/v4.x/screenshots/images/light/panels/resources/widgets.jpg)

你可以使用现有的[仪表盘小部件](../widgets)，也可以专门为资源创建一个。

## 创建资源小部件

要开始构建资源小部件：

```bash
php artisan make:filament-widget CustomerOverview --resource=CustomerResource
```

此命令将创建两个文件——一个位于 `app/Filament/Resources/Customers/Widgets` 目录下的小部件类，以及一个位于 `resources/views/filament/resources/customers/widgets` 目录下的视图。

你必须在资源的 `getWidgets()` 方法中注册新小部件：

```php
use App\Filament\Resources\Customers\Widgets\CustomerOverview;

public static function getWidgets(): array
{
    return [
        CustomerOverview::class,
    ];
}
```

如果你想了解如何构建和自定义小部件，请查阅[仪表盘](../widgets)文档部分。

## 在资源页面上显示小部件

要在资源页面上显示小部件，请使用该页面的 `getHeaderWidgets()` 或 `getFooterWidgets()` 方法：

```php
<?php

namespace App\Filament\Resources\Customers\Pages;

use App\Filament\Resources\Customers\CustomerResource;

class ListCustomers extends ListRecords
{
    public static string $resource = CustomerResource::class;

    protected function getHeaderWidgets(): array
    {
        return [
            CustomerResource\Widgets\CustomerOverview::class,
        ];
    }
}
```

`getHeaderWidgets()` 返回在页面内容上方显示的小部件数组，而 `getFooterWidgets()` 则在页面内容下方显示。

如果你想自定义用于排列小部件的网格列数，请查阅[页面文档](../navigation/custom-pages#customizing-the-widgets-grid)。

## 在小部件中访问当前记录

如果你在[编辑](editing-records)或[查看](viewing-records)页面上使用小部件，可以通过在小部件类上定义 `$record` 属性来访问当前记录：

```php
use Illuminate\Database\Eloquent\Model;

public ?Model $record = null;
```

## 在小部件中访问页面表格数据

如果你在[列表](listing-records)页面上使用小部件，可以先在页面类上添加 `ExposesTableToWidgets` trait，然后访问表格数据：

```php
use Filament\Pages\Concerns\ExposesTableToWidgets;
use Filament\Resources\Pages\ListRecords;

class ListProducts extends ListRecords
{
    use ExposesTableToWidgets;

    // ...
}
```

接下来，在小部件类上添加 `InteractsWithPageTable` trait，并从 `getTablePage()` 方法返回页面类的名称：

```php
use App\Filament\Resources\Products\Pages\ListProducts;
use Filament\Widgets\Concerns\InteractsWithPageTable;
use Filament\Widgets\Widget;

class ProductStats extends Widget
{
    use InteractsWithPageTable;

    protected function getTablePage(): string
    {
        return ListProducts::class;
    }

    // ...
}
```

现在在小部件类中，你可以通过 `$this->getPageTableQuery()` 方法访问表格数据的 Eloquent 查询构建器实例：

```php
use Filament\Widgets\StatsOverviewWidget\Stat;

Stat::make('Total Products', $this->getPageTableQuery()->count()),
```

或者，你可以通过 `$this->getPageTableRecords()` 方法访问当前页面上的记录集合：

```php
use Filament\Widgets\StatsOverviewWidget\Stat;

Stat::make('Total Products', $this->getPageTableRecords()->count()),
```

## 获取表格记录总数

如果你需要获取表格查询的所有记录总数，而不想执行额外的 count 查询，可以使用 `$tableRecordsCount` 属性：

```php
use Filament\Widgets\StatsOverviewWidget\Stat;

Stat::make('Total Products', $this->tableRecordsCount),
```

## 向资源页面上的小部件传递属性

在资源页面上注册小部件时，你可以使用 `make()` 方法向其传递一个[Livewire 属性](https://livewire.laravel.com/docs/properties)数组：

```php
protected function getHeaderWidgets(): array
{
    return [
        CustomerResource\Widgets\CustomerOverview::make([
            'status' => 'active',
        ]),
    ];
}
```

此属性数组将被映射到小部件类上的[Livewire 公共属性](https://livewire.laravel.com/docs/properties)：

```php
use Filament\Widgets\Widget;

class CustomerOverview extends Widget
{
    public string $status;

    // ...
}
```

现在，你可以在小部件类中通过 `$this->status` 访问 `status`。
