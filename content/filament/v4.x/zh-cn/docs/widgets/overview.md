---
title: 小部件概览
---
## 简介

Filament 允许你构建由"小部件"组成的动态仪表盘。每个小部件是仪表盘上的一个元素，以特定方式显示数据。例如，你可以显示[统计概览](stats-overview)、[图表](charts)或[表格](#表格小部件)。

![带小部件的仪表盘](/assets/filament/v4.x/screenshots/images/light/panels/dashboard.jpg)

## 创建小部件

要创建小部件，可以使用 `make:filament-widget` 命令：

```bash
php artisan make:filament-widget MyWidget
```

此命令会询问你想要创建哪种类型的小部件。你可以从以下选项中选择：

- **自定义**：可以从头开始构建的自定义小部件。
- **图表**：显示[图表](charts)的小部件。
- **统计概览**：显示[统计数据](stats-overview)的小部件。
- **表格**：显示[表格](#表格小部件)的小部件。

## 小部件排序

每个小部件类都包含一个 `$sort` 属性，可用于更改其在页面上相对于其他小部件的顺序：

```php
protected static ?int $sort = 2;
```

## 自定义仪表盘页面

如果你想自定义仪表盘类，例如[更改小部件列数](#自定义小部件网格)，可以在 `app/Filament/Pages/Dashboard.php` 创建一个新文件：

```php
<?php

namespace App\Filament\Pages;

use Filament\Pages\Dashboard as BaseDashboard;

class Dashboard extends BaseDashboard
{
    // ...
}
```

最后，从[配置文件](../panel-configuration)中移除原始的 `Dashboard` 类：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->discoverPages(in: app_path('Filament/Pages'), for: 'App\\Filament\\Pages')
        ->pages([]);
}
```

如果你没有在创建新仪表盘类的目录中使用 `discoverPages()` 发现页面，你应该在 `pages()` 方法中手动注册该类：

```php
use App\Filament\Pages\Dashboard;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->pages([
            Dashboard::class,
        ]);
}
```

### 创建多个仪表盘

如果你想创建多个仪表盘，可以通过重复[上述过程](#自定义仪表盘页面)来实现。创建扩展 `Dashboard` 类的新页面将允许你创建任意数量的仪表盘。

你还需要定义额外仪表盘的 URL 路径，否则它将位于 `/`：

```php
protected static string $routePath = 'finance';
```

你还可以通过覆盖 `$title` 属性来自定义仪表盘的标题：

```php
protected static ?string $title = 'Finance dashboard';
```

显示给用户的主要仪表盘是他们有权访问的第一个仪表盘（由 [`canAccess()` 方法](../navigation/custom-pages#授权)控制），按照定义的导航排序顺序。

仪表盘的默认排序顺序是 `-2`。你可以使用 `$navigationSort` 控制自定义仪表盘的排序顺序：

```php
protected static ?int $navigationSort = 15;
```

### 自定义小部件网格

你可以更改用于显示小部件的网格列数。

首先，你必须[替换原始的仪表盘页面](#自定义仪表盘页面)。

现在，在你新的 `app/Filament/Pages/Dashboard.php` 文件中，你可以覆盖 `getColumns()` 方法来返回要使用的网格列数：

```php
public function getColumns(): int | array
{
    return 2;
}
```

#### 响应式小部件网格

你可能希望根据浏览器的响应式[断点](https://tailwindcss.com/docs/responsive-design#overview)来更改小部件网格列数。你可以使用一个数组来实现，该数组包含每个断点应使用的列数：

```php
public function getColumns(): int | array
{
    return [
        'md' => 4,
        'xl' => 5,
    ];
}
```

这与[响应式小部件宽度](#响应式小部件宽度)配合得很好。

#### 自定义小部件宽度

你可以使用 `$columnSpan` 属性自定义小部件的宽度。你可以使用 1 到 12 之间的数字来表示小部件应跨越多少列，或使用 `full` 使其占据页面的全部宽度：

```php
protected int | string | array $columnSpan = 'full';
```

##### 响应式小部件宽度

你可能希望根据浏览器的响应式[断点](https://tailwindcss.com/docs/responsive-design#overview)来更改小部件宽度。你可以使用一个数组来实现，该数组包含小部件在每个断点应占据的列数：

```php
protected int | string | array $columnSpan = [
    'md' => 2,
    'xl' => 3,
];
```

在使用[响应式小部件网格](#响应式小部件网格)时，这尤其有用。

![带自定义小部件列跨度的仪表盘](/assets/filament/v4.x/screenshots/images/light/panels/dashboard-column-spans.jpg)

## 条件隐藏小部件

你可以覆盖小部件上的静态 `canView()` 方法来有条件地隐藏它们：

```php
public static function canView(): bool
{
    return auth()->user()->isAdmin();
}
```

## 表格小部件

你可以轻松地将表格添加到仪表盘中。首先使用命令创建一个小部件：

```bash
php artisan make:filament-widget LatestOrders --table
```

你现在可以通过编辑小部件文件来[自定义表格](../tables/overview)。

## 自定义小部件

要开始构建 `BlogPostsOverview` 小部件：

```bash
php artisan make:filament-widget BlogPostsOverview
```

此命令将创建两个文件 - Filament 目录的 `/Widgets` 目录中的小部件类，以及 Filament 视图目录的 `/widgets` 目录中的视图。

该类是一个 [Livewire 组件](https://livewire.laravel.com/docs/components)，因此你可以使用任何 Livewire 功能。Blade 视图可以包含任何你喜欢的 HTML，你可以在视图中访问任何公共 Livewire 属性。你还可以在视图中使用 `$this` 访问 Livewire 组件实例。

## 过滤小部件数据

你可以向仪表盘添加一个表单，允许用户过滤所有小部件显示的数据。当过滤器更新时，小部件将使用新数据重新加载。

首先，你必须[替换原始的仪表盘页面](#自定义仪表盘页面)。

现在，在你新的 `app/Filament/Pages/Dashboard.php` 文件中，你可以添加 `HasFiltersForm` trait，并添加 `filtersForm()` 方法来返回表单组件：

```php
use Filament\Forms\Components\DatePicker;
use Filament\Pages\Dashboard as BaseDashboard;
use Filament\Pages\Dashboard\Concerns\HasFiltersForm;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class Dashboard extends BaseDashboard
{
    use HasFiltersForm;

    public function filtersForm(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make()
                    ->schema([
                        DatePicker::make('startDate'),
                        DatePicker::make('endDate'),
                        // ...
                    ])
                    ->columns(3),
            ]);
    }
}
```

![带过滤表单的仪表盘](/assets/filament/v4.x/screenshots/images/light/panels/dashboard-filters.jpg)

在需要过滤器数据的小部件类中，你需要添加 `InteractsWithPageFilters` trait，这将允许你使用 `$this->pageFilters` 属性访问过滤表单的原始数据：

```php
use App\Models\BlogPost;
use Carbon\CarbonImmutable;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\Concerns\InteractsWithPageFilters;
use Illuminate\Database\Eloquent\Builder;

class BlogPostsOverview extends StatsOverviewWidget
{
    use InteractsWithPageFilters;

    public function getStats(): array
    {
        $startDate = $this->pageFilters['startDate'] ?? null;
        $endDate = $this->pageFilters['endDate'] ?? null;

        return [
            StatsOverviewWidget\Stat::make(
                label: 'Total posts',
                value: BlogPost::query()
                    ->when($startDate, fn (Builder $query) => $query->whereDate('created_at', '>=', $startDate))
                    ->when($endDate, fn (Builder $query) => $query->whereDate('created_at', '<=', $endDate))
                    ->count(),
            ),
            // ...
        ];
    }
}
```

`$this->pageFilters` 数组将始终反映当前的表单数据。请注意，此数据未经验证，因为它是实时可用的，仅用于查询数据库。你必须在使用前确保数据有效。在此示例中，我们在查询中使用开始日期之前检查其是否已设置。

### 使用操作模态框过滤小部件数据

或者，你可以将过滤表单替换为操作模态框，通过点击页面标题中的按钮来打开。使用此方法有很多好处：

- 过滤表单并不总是可见的，这允许你使用页面的全部高度来显示小部件。
- 过滤器在用户点击"应用"按钮之前不会更新小部件，这意味着小部件在用户准备好之前不会重新加载。如果小部件加载成本很高，这可以提高性能。
- 可以对过滤表单执行验证，这意味着小部件可以依赖数据有效的事实 - 用户在验证通过之前无法提交表单。取消模态框将丢弃用户的更改。

要使用操作模态框而不是过滤表单，你可以使用 `HasFiltersAction` trait 代替 `HasFiltersForm`。然后，在 `getHeaderActions()` 中注册 `FilterAction` 类作为操作：

```php
use Filament\Forms\Components\DatePicker;
use Filament\Pages\Dashboard as BaseDashboard;
use Filament\Pages\Dashboard\Actions\FilterAction;
use Filament\Pages\Dashboard\Concerns\HasFiltersAction;

class Dashboard extends BaseDashboard
{
    use HasFiltersAction;
    
    protected function getHeaderActions(): array
    {
        return [
            FilterAction::make()
                ->schema([
                    DatePicker::make('startDate'),
                    DatePicker::make('endDate'),
                    // ...
                ]),
        ];
    }
}
```

处理来自过滤操作的数据与处理来自过滤标题表单的数据相同，只是数据在传递给小部件之前会经过验证。`InteractsWithPageFilters` trait 仍然适用。

![带过滤操作模态框的仪表盘](/assets/filament/v4.x/screenshots/images/light/panels/dashboard-filter-action.jpg)

### 在用户会话中持久化小部件过滤器

默认情况下，应用的仪表盘过滤器将在页面加载之间的用户会话中持久化。要禁用此功能，请在仪表盘页面类中覆盖 `$persistsFiltersInSession` 属性：

```php
use Filament\Pages\Dashboard as BaseDashboard;
use Filament\Pages\Dashboard\Concerns\HasFiltersForm;

class Dashboard extends BaseDashboard
{
    use HasFiltersForm;

    protected bool $persistsFiltersInSession = false;
}
```

或者，在仪表盘页面类中覆盖 `persistsFiltersInSession()` 方法：

```php
use Filament\Pages\Dashboard as BaseDashboard;
use Filament\Pages\Dashboard\Concerns\HasFiltersForm;

class Dashboard extends BaseDashboard
{
    use HasFiltersForm;

    public function persistsFiltersInSession(): bool
    {
        return false;
    }
}
```

## 禁用默认小部件

默认情况下，仪表盘上会显示两个小部件。可以通过更新[配置](../panel-configuration)的 `widgets()` 数组来禁用这些小部件：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->widgets([]);
}
```
