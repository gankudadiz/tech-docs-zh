---
title: 图表小部件
---
## 简介

Filament 附带了许多"图表"小部件模板，你可以使用它们来显示实时、交互式的图表。

首先使用命令创建一个小部件：

```bash
php artisan make:filament-widget BlogPostsChart --chart
```

有一个单一的 `ChartWidget` 类用于所有图表。图表类型由 `getType()` 方法设置。在此示例中，该方法返回字符串 `'line'`。

`protected ?string $heading` 变量用于设置描述图表的标题。如果你需要动态设置标题，可以覆盖 `getHeading()` 方法。

`getData()` 方法用于返回数据集和标签的数组。每个数据集是要在图表上绘制的带标签的点数组，每个标签是一个字符串。此结构与 Filament 用于渲染图表的 [Chart.js](https://www.chartjs.org/docs) 库相同。你可以使用 [Chart.js 文档](https://www.chartjs.org/docs)来充分了解根据图表类型从 `getData()` 返回的可能性。

```php
<?php

namespace App\Filament\Widgets;

use Filament\Widgets\ChartWidget;

class BlogPostsChart extends ChartWidget
{
    protected ?string $heading = 'Blog Posts';

    protected function getData(): array
    {
        return [
            'datasets' => [
                [
                    'label' => 'Blog posts created',
                    'data' => [0, 10, 5, 2, 21, 32, 45, 74, 65, 45, 77, 89],
                ],
            ],
            'labels' => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
```

现在，在仪表盘中查看你的小部件。

![折线图](/assets/filament/v4.x/screenshots/images/light/widgets/chart/line.jpg)

## 可用的图表类型

以下是可用的图表小部件类列表，你可以扩展它们，以及它们对应的 [Chart.js](https://www.chartjs.org/docs) 文档页面，以获取从 `getData()` 返回内容的灵感：

- 柱状图 - [Chart.js 文档](https://www.chartjs.org/docs/latest/charts/bar)
- 气泡图 - [Chart.js 文档](https://www.chartjs.org/docs/latest/charts/bubble)
- 环形图 - [Chart.js 文档](https://www.chartjs.org/docs/latest/charts/doughnut)
- 折线图 - [Chart.js 文档](https://www.chartjs.org/docs/latest/charts/line)
- 饼图 - [Chart.js 文档](https://www.chartjs.org/docs/latest/charts/doughnut.html#pie)
- 极地面积图 - [Chart.js 文档](https://www.chartjs.org/docs/latest/charts/polar)
- 雷达图 - [Chart.js 文档](https://www.chartjs.org/docs/latest/charts/radar)
- 散点图 - [Chart.js 文档](https://www.chartjs.org/docs/latest/charts/scatter)

例如，你可以通过从 `getType()` 方法返回 `'bar'` 来使用柱状图：

![柱状图](/assets/filament/v4.x/screenshots/images/light/widgets/chart/bar.jpg)

以下是其他可用图表类型的示例：

![饼图](/assets/filament/v4.x/screenshots/images/light/widgets/chart/pie.jpg)

![环形图](/assets/filament/v4.x/screenshots/images/light/widgets/chart/doughnut.jpg)

![雷达图](/assets/filament/v4.x/screenshots/images/light/widgets/chart/radar.jpg)

![极地面积图](/assets/filament/v4.x/screenshots/images/light/widgets/chart/polar-area.jpg)

![散点图](/assets/filament/v4.x/screenshots/images/light/widgets/chart/scatter.jpg)

![气泡图](/assets/filament/v4.x/screenshots/images/light/widgets/chart/bubble.jpg)

## 自定义图表颜色

你可以通过设置 `$color` 属性来自定义图表数据的[颜色](../styling/colors)：

```php
protected string $color = 'info';
```

如果你想进一步自定义颜色，或者在多个数据集中使用多种颜色，你仍然可以在数据中使用 Chart.js 的[颜色选项](https://www.chartjs.org/docs/latest/general/colors.html)：

```php
protected function getData(): array
{
    return [
        'datasets' => [
            [
                'label' => 'Blog posts created',
                'data' => [0, 10, 5, 2, 21, 32, 45, 74, 65, 45, 77, 89],
                'backgroundColor' => '#36A2EB',
                'borderColor' => '#9BD0F5',
            ],
        ],
        'labels' => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    ];
}
```

## 从 Eloquent 模型生成图表数据

要从 Eloquent 模型生成图表数据，Filament 建议你安装 `flowframe/laravel-trend` 包。你可以查看[文档](https://github.com/Flowframe/laravel-trend)。

以下是使用 `laravel-trend` 包从模型生成图表数据的示例：

```php
use Flowframe\Trend\Trend;
use Flowframe\Trend\TrendValue;

protected function getData(): array
{
    $data = Trend::model(BlogPost::class)
        ->between(
            start: now()->startOfYear(),
            end: now()->endOfYear(),
        )
        ->perMonth()
        ->count();

    return [
        'datasets' => [
            [
                'label' => 'Blog posts',
                'data' => $data->map(fn (TrendValue $value) => $value->aggregate),
            ],
        ],
        'labels' => $data->map(fn (TrendValue $value) => $value->date),
    ];
}
```

## 过滤图表数据

### 基本选择过滤器

你可以设置图表过滤器来更改显示的数据。通常，这用于更改图表数据渲染的时间段。

要设置默认过滤器值，请设置 `$filter` 属性：

```php
public ?string $filter = 'today';
```

然后，定义 `getFilters()` 方法来返回过滤器的值和标签数组：

```php
protected function getFilters(): ?array
{
    return [
        'today' => 'Today',
        'week' => 'Last week',
        'month' => 'Last month',
        'year' => 'This year',
    ];
}
```

你可以在 `getData()` 方法中使用活动的过滤器值：

```php
protected function getData(): array
{
    $activeFilter = $this->filter;

    // ...
}
```

![带过滤器的图表](/assets/filament/v4.x/screenshots/images/light/widgets/chart/filter.jpg)

### 自定义过滤器

你可以使用[架构组件](../schemas/overview)为图表小部件构建自定义过滤器。这种方法提供了更灵活的方式来定义过滤器。

要开始使用，请使用 `HasFiltersSchema` trait 并实现 `filtersSchema()` 方法：

```php
use Filament\Forms\Components\DatePicker;
use Filament\Schemas\Schema;
use Filament\Widgets\ChartWidget\Concerns\HasFiltersSchema;

class BlogPostsChart extends ChartWidget
{
    use HasFiltersSchema;
    
    // ...
    
    public function filtersSchema(Schema $schema): Schema
    {
        return $schema->components([
            DatePicker::make('startDate')
                ->default(now()->subDays(30)),
            DatePicker::make('endDate')
                ->default(now()),
        ]);
    }
}
```

过滤器值可通过 `$this->filters` 数组访问。你可以在 `getData()` 方法中使用这些值：

```php
protected function getData(): array
{
    $startDate = $this->filters['startDate'] ?? null;
    $endDate = $this->filters['endDate'] ?? null;

    return [
        // ...
    ];
}
```

`$this->filters` 数组将始终反映当前的表单数据。请注意，此数据未经验证，因为它是实时可用的，仅用于查询数据库。你必须在使用前确保数据有效。

![带自定义过滤器的图表](/assets/filament/v4.x/screenshots/images/light/widgets/chart/custom-filters.jpg)

:::info
如果你想添加同时应用于多个小部件的过滤器，请参阅仪表盘中的[过滤小部件数据](overview#过滤小部件数据)。
:::

#### 延迟过滤器更新

默认情况下，使用 `filtersSchema()` 方法的过滤器在更改时会立即更新图表数据。但是，对于复杂查询或更好的用户体验，你可能希望**延迟**过滤器更新，直到用户点击"应用"按钮。

当延迟时，过滤器更改仅在用户点击"应用"按钮时才应用。这确保图表仅在用户完成调整所有过滤器后才重新渲染。

页面首次加载时，图表将使用默认过滤器值显示数据，确保用户无需操作即可立即看到有意义的数据。

要启用延迟过滤器，请将 `$hasDeferredFilters` 属性设置为 `true`：

```php
use Filament\Widgets\ChartWidget\Concerns\HasFiltersSchema;

class BlogPostsChart extends ChartWidget
{
    use HasFiltersSchema;

    protected bool $hasDeferredFilters = true;

    // ...
}
```

如果你需要动态控制过滤器是否延迟，可以覆盖 `hasDeferredFilters()` 方法：

```php
public function hasDeferredFilters(): bool
{
    return auth()->user()->prefersDeferredFilters();
}
```

#### 将过滤器重置为默认值

使用延迟过滤器时，过滤器下拉菜单底部会出现一个"重置"链接，与"应用"按钮并排。点击此链接会将所有过滤器恢复为 `filtersSchema()` 方法中定义的默认值。例如，如果你在 `DatePicker` 上设置了 `->default(now()->subDays(30))`，重置操作将恢复该默认日期，而不是空值。

#### 自定义过滤器操作

你可以自定义使用延迟过滤器时出现的应用和重置操作。所有可用于[自定义操作触发按钮](../actions/overview)的方法都可以使用：

```php
use Filament\Actions\Action;

public function filtersApplyAction(Action $action): Action
{
    return $action
        ->label('Update Chart')
        ->color('success');
}

public function filtersResetAction(Action $action): Action
{
    return $action
        ->label('Clear Filters')
        ->color('danger');
}
```

## 实时更新图表数据（轮询）

默认情况下，图表小部件每 5 秒刷新一次数据。

要自定义此行为，你可以覆盖类上的 `$pollingInterval` 属性为新的间隔：

```php
protected ?string $pollingInterval = '10s';
```

或者，你可以完全禁用轮询：

```php
protected ?string $pollingInterval = null;
```

## 设置图表最大高度

你可以使用 `$maxHeight` 属性为图表设置最大高度，以确保它不会变得太大：

```php
protected ?string $maxHeight = '300px';
```

![带最大高度的图表](/assets/filament/v4.x/screenshots/images/light/widgets/chart/max-height.jpg)

## 设置图表配置选项

你可以在图表类上指定 `$options` 变量来控制 Chart.js 库提供的众多配置选项。例如，你可以关闭折线图的[图例](https://www.chartjs.org/docs/latest/configuration/legend.html)：

```php
protected ?array $options = [
    'plugins' => [
        'legend' => [
            'display' => false,
        ],
    ],
];
```

或者，你可以覆盖 `getOptions()` 方法来返回动态选项数组：

```php
protected function getOptions(): array
{
    return [
        'plugins' => [
            'legend' => [
                'display' => false,
            ],
        ],
    ];
}
```

这些 PHP 数组在图表渲染时将被转换为 JSON 对象。如果你想从此方法返回原始 JavaScript，可以返回一个 `RawJs` 对象。如果你想使用 JavaScript 回调函数，这很有用，例如：

```php
use Filament\Support\RawJs;

protected function getOptions(): RawJs
{
    return RawJs::make(<<<JS
        {
            scales: {
                y: {
                    ticks: {
                        callback: (value) => '€' + value,
                    },
                },
            },
        }
    JS);
}
```

## 添加描述

你可以使用 `getDescription()` 方法在图表标题下方添加描述：

```php
public function getDescription(): ?string
{
    return 'The number of blog posts published per month.';
}
```

![带描述的图表](/assets/filament/v4.x/screenshots/images/light/widgets/chart/description.jpg)

## 禁用懒加载

默认情况下，小部件是懒加载的。这意味着它们只有在页面上可见时才会加载。

要禁用此行为，你可以覆盖小部件类上的 `$isLazy` 属性：

```php
protected static bool $isLazy = false;
```

## 使图表可折叠

你可以通过将小部件类上的 `$isCollapsible` 属性设置为 `true` 来允许图表可折叠：

```php
protected bool $isCollapsible = true;
```

![可折叠的图表](/assets/filament/v4.x/screenshots/images/light/widgets/chart/collapsible.jpg)

## 使用自定义 Chart.js 插件

Chart.js 提供了一个强大的插件系统，允许你扩展其功能并创建自定义图表行为。本指南详细介绍了如何在图表小部件中使用它们。

### 第 1 步：使用 NPM 安装插件

首先，使用 NPM 将插件安装到你的项目中。在本指南中，我们将安装 [`chartjs-plugin-datalabels`](https://chartjs-plugin-datalabels.netlify.app/guide/getting-started.html#installation)：

```bash
npm install chartjs-plugin-datalabels --save-dev
```

### 第 2 步：创建导入插件的 JavaScript 文件

创建一个新的 JavaScript 文件，在其中定义你的自定义插件。在本指南中，我们将其命名为 `filament-chart-js-plugins.js`。导入插件，并将其添加到 `window.filamentChartJsPlugins` 数组中：

```javascript
import ChartDataLabels from 'chartjs-plugin-datalabels'

window.filamentChartJsPlugins ??= []
window.filamentChartJsPlugins.push(ChartDataLabels)
```

这相当于在实例化 Chart.js 图表时通过 `new Chart(..., { plugins: [...] })` "内联"包含插件。

在推送到数组之前初始化数组（如果尚未初始化）很重要。这确保了多个注册 Chart.js 插件的 JavaScript 文件（尤其是来自 Filament 插件的文件）不会相互覆盖，无论它们的启动顺序如何。

你可以向数组推送任意数量的插件，不需要为每个插件使用单独的文件。

此外，你还可以在 `window.filamentChartJsGlobalPlugins` 数组中注册任何"全局插件"，这些插件将使用 `Chart.register([...])`：

```javascript
import ChartDataLabels from 'chartjs-plugin-datalabels'

window.filamentChartJsGlobalPlugins ??= []
window.filamentChartJsGlobalPlugins.push(ChartDataLabels)
```

### 第 3 步：使用 Vite 编译 JavaScript 文件

现在，你需要使用 Vite 或你选择的打包工具来构建 JavaScript 文件。将文件包含在你的 Vite 配置中（通常是 `vite.config.js`）。例如：

```javascript
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.js',
                'resources/css/filament/admin/theme.css',
                'resources/js/filament-chart-js-plugins.js', // 在 `input` 数组中包含新文件以便构建
            ],
        }),
    ],
});
```

使用 `npm run build` 构建文件。

### 第 4 步：在 Filament 中注册 JavaScript 文件

Filament 需要知道在渲染图表小部件时包含此 JavaScript 文件。你可以在服务提供者（如 `AppServiceProvider`）的 `boot()` 方法中执行此操作：

```php
use Filament\Support\Assets\Js;
use Filament\Support\Facades\FilamentAsset;
use Illuminate\Support\Facades\Vite;

FilamentAsset::register([
    Js::make('chart-js-plugins', Vite::asset('resources/js/filament-chart-js-plugins.js'))->module(),
]);
```

你可以了解更多关于[资源注册](../advanced/assets)的信息，甚至可以[为特定面板注册资源](../panel-configuration#为面板注册资源)。
