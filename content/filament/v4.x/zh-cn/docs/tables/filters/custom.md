---
title: 自定义过滤器
---

## 自定义过滤器模式

你可以使用[模式组件](../../schemas/overview)创建自定义过滤器。自定义过滤器模式中的数据可在 `query()` 回调的 `$data` 数组中使用：

```php
use Filament\Forms\Components\DatePicker;
use Filament\Tables\Filters\Filter;
use Illuminate\Database\Eloquent\Builder;

Filter::make('created_at')
    ->schema([
        DatePicker::make('created_from'),
        DatePicker::make('created_until'),
    ])
    ->query(function (Builder $query, array $data): Builder {
        return $query
            ->when(
                $data['created_from'],
                fn (Builder $query, $date): Builder => $query->whereDate('created_at', '>=', $date),
            )
            ->when(
                $data['created_until'],
                fn (Builder $query, $date): Builder => $query->whereDate('created_at', '<=', $date),
            );
    })
```

`query()` 闭包支持注入 Filament 的工具参数，包括 `$query`（要修改的 Eloquent 查询构建器）和 `$data`（过滤器表单字段的数据）。

![带自定义过滤器模式的表格](/assets/filament/v4.x/screenshots/images/light/tables/filters/custom-form.jpg)

### 为自定义过滤器字段设置默认值

要自定义自定义过滤器模式中字段的默认值，你可以使用 `default()` 方法：

```php
use Filament\Forms\Components\DatePicker;
use Filament\Tables\Filters\Filter;

Filter::make('created_at')
    ->schema([
        DatePicker::make('created_from'),
        DatePicker::make('created_until')
            ->default(now()),
    ])
```

## 活动指示器

当过滤器处于活动状态时，会在表格内容上方显示一个指示器，表明表格查询已被限定范围。

![带过滤器指示器的表格](/assets/filament/v4.x/screenshots/images/light/tables/filters/indicators.jpg)

默认情况下，过滤器的标签用作指示器。你可以使用 `indicator()` 方法覆盖此行为：

```php
use Filament\Tables\Filters\Filter;

Filter::make('is_admin')
    ->label('Administrators only?')
    ->indicator('Administrators')
```

如果你使用的是[自定义过滤器模式](#自定义过滤器模式)，你应该使用 [`indicateUsing()`](#自定义活动指示器) 来显示活动指示器。

请注意：如果你的过滤器没有指示器，那么表格中活动过滤器数量的徽章将不会包含该过滤器。

### 自定义活动指示器

并非所有指示器都很简单，因此你可能需要使用 `indicateUsing()` 来自定义在任何时间应显示哪些指示器。

例如，如果你有一个自定义日期过滤器，你可以创建一个自定义指示器来格式化所选日期：

```php
use Carbon\Carbon;
use Filament\Forms\Components\DatePicker;
use Filament\Tables\Filters\Filter;

Filter::make('created_at')
    ->schema([DatePicker::make('date')])
    // ...
    ->indicateUsing(function (array $data): ?string {
        if (! $data['date']) {
            return null;
        }

        return 'Created at ' . Carbon::parse($data['date'])->toFormattedDateString();
    })
```

### 多个活动指示器

你甚至可以一次渲染多个指示器，通过返回一个 `Indicator` 对象数组。如果你有不同的字段关联到不同的指示器，你应该在 `Indicator` 对象上使用 `removeField()` 方法设置字段，以确保在移除过滤器时重置正确的字段：

```php
use Carbon\Carbon;
use Filament\Forms\Components\DatePicker;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Filters\Indicator;

Filter::make('created_at')
    ->schema([
        DatePicker::make('from'),
        DatePicker::make('until'),
    ])
    // ...
    ->indicateUsing(function (array $data): array {
        $indicators = [];

        if ($data['from'] ?? null) {
            $indicators[] = Indicator::make('Created from ' . Carbon::parse($data['from'])->toFormattedDateString())
                ->removeField('from');
        }

        if ($data['until'] ?? null) {
            $indicators[] = Indicator::make('Created until ' . Carbon::parse($data['until'])->toFormattedDateString())
                ->removeField('until');
        }

        return $indicators;
    })
```

### 防止指示器被移除

你可以使用 `Indicator` 对象上的 `removable(false)` 来防止用户移除指示器：

```php
use Carbon\Carbon;
use Filament\Tables\Filters\Indicator;

Indicator::make('Created from ' . Carbon::parse($data['from'])->toFormattedDateString())
    ->removable(false)
```
