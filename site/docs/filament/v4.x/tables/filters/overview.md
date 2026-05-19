---
title: 过滤器概述
---

## 简介

过滤器允许你定义数据的某些约束，并允许用户筛选以找到他们需要的信息。你将它们放在 `$table->filters()` 方法中。

过滤器可以使用静态 `make()` 方法创建，传入其唯一名称。然后你应该向 `query()` 传递一个回调，应用你的过滤器作用域：

```php
use Filament\Tables\Filters\Filter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

public function table(Table $table): Table
{
    return $table
        ->filters([
            Filter::make('is_featured')
                ->query(fn (Builder $query): Builder => $query->where('is_featured', true))
            // ...
        ]);
}
```

![带过滤器的表格](/assets/filament/v4.x/screenshots/images/light/tables/filters/simple.jpg)

## 可用过滤器

默认情况下，使用 `Filter::make()` 方法会渲染一个复选框表单组件。当复选框打开时，`query()` 将被激活。

- 你也可以[用开关按钮替换复选框](#using-a-toggle-button-instead-of-a-checkbox)。
- 你可以使用[选择过滤器](select)允许用户从选项列表中选择，并使用选择进行筛选。
- 你可以使用[三态过滤器](ternary)将复选框替换为选择字段，允许用户在 3 种状态之间选择——通常是"true"、"false"和"blank"。这对于筛选布尔列很有用。
- [回收站过滤器](ternary#filtering-soft-deletable-records)是一个预构建的三态过滤器，允许你筛选可软删除的记录。
- 使用[查询构建器](query-builder)，用户可以创建复杂的过滤器集合，具有用于组合约束的高级用户界面。
- 你可以使用其他表单字段构建[自定义过滤器](custom)，做任何你想做的事。

## 设置标签

默认情况下，过滤器的标签是从过滤器名称生成的。你可以使用 `label()` 方法来自定义：

```php
use Filament\Tables\Filters\Filter;

Filter::make('is_featured')
    ->label('Featured')
```

除固定值外，`label()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

以这种方式自定义标签在你想使用[翻译字符串进行本地化](https://laravel.com/docs/localization#retrieving-translation-strings)时很有用：

```php
use Filament\Tables\Filters\Filter;

Filter::make('is_featured')
    ->label(__('filters.is_featured'))
```

## 自定义过滤器模式

默认情况下，使用 `Filter` 类创建过滤器会渲染一个[复选框表单组件](../../forms/checkbox)。当复选框被选中时，`query()` 函数将应用于表格的查询，筛选表格中的记录。当复选框取消选中时，`query()` 函数将从表格的查询中移除。

过滤器完全基于 Filament 的表单字段构建。它们可以渲染任何表单字段组合，用户可以与之交互来筛选表格。

### 使用开关按钮代替复选框

管理过滤器使用的表单字段的最简单示例是使用 `toggle()` 方法将[复选框](../../forms/checkbox)替换为[开关按钮](../../forms/toggle)：

```php
use Filament\Tables\Filters\Filter;

Filter::make('is_featured')
    ->toggle()
```

![带开关过滤器的表格](/assets/filament/v4.x/screenshots/images/light/tables/filters/toggle.jpg)

### 自定义内置过滤器表单字段

无论你使用复选框、[开关](#using-a-toggle-button-instead-of-a-checkbox)还是[选择](select)，你都可以使用 `modifyFormFieldUsing()` 方法自定义过滤器使用的内置表单字段。该方法接受一个带有 `$field` 参数的函数，该参数给你访问表单字段对象以进行自定义：

```php
use Filament\Forms\Components\Checkbox;
use Filament\Tables\Filters\Filter;

Filter::make('is_featured')
    ->modifyFormFieldUsing(fn (Checkbox $field) => $field->inline(false))
```

传给 `modifyFormFieldUsing()` 的闭包也支持注入 Filament 的工具参数。

## 默认应用过滤器

你可以使用 `default()` 方法设置过滤器默认启用：

```php
use Filament\Tables\Filters\Filter;

Filter::make('is_featured')
    ->default()
```

如果你使用[选择过滤器](select)，请访问[默认应用选择过滤器章节](select#applying-select-filters-by-default)。

## 在用户会话中持久化过滤器

要在用户会话中持久化表格过滤器，请使用 `persistFiltersInSession()` 方法：

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->filters([
            // ...
        ])
        ->persistFiltersInSession();
}
```

## 实时过滤器

默认情况下，过滤器的更改是延迟的，在用户点击"应用"按钮之前不会影响表格。要禁用此功能并使过滤器"实时"生效，请使用 `deferFilters(false)` 方法：

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->filters([
            // ...
        ])
        ->deferFilters(false);
}
```

### 自定义应用过滤器操作

延迟过滤器时，你可以使用 `filtersApplyAction()` 方法自定义"应用"按钮，传递一个返回操作的闭包。所有可用于[自定义操作触发按钮](../../actions/overview)的方法都可以使用：

```php
use Filament\Actions\Action;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->filters([
            // ...
        ])
        ->filtersApplyAction(
            fn (Action $action) => $action
                ->link()
                ->label('Save filters to table'),
        );
}
```

## 过滤器更改时取消选择记录

默认情况下，当过滤器更改时，所有记录将被取消选择。使用 `deselectAllRecordsWhenFiltered(false)` 方法，你可以禁用此行为：

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->filters([
            // ...
        ])
        ->deselectAllRecordsWhenFiltered(false);
}
```

## 修改基础查询

默认情况下，在 `query()` 方法中对 Eloquent 查询执行的修改将在作用域 `where()` 子句内应用。这是为了确保查询不会与可能应用的任何其他过滤器冲突，特别是那些使用 `orWhere()` 的过滤器。

然而，这样做的缺点是 `query()` 方法不能用于以其他方式修改查询，例如移除全局作用域，因为需要直接修改基础查询，而不是作用域查询。

要直接修改基础查询，你可以使用 `baseQuery()` 方法，传递一个接收基础查询的闭包：

```php
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Tables\Filters\TernaryFilter;

TernaryFilter::make('trashed')
    // ...
    ->baseQuery(fn (Builder $query) => $query->withoutGlobalScopes([
        SoftDeletingScope::class,
    ]))
```

## 解析记录时排除过滤器

当用户与表格记录交互（例如点击操作按钮）时，Filament 从数据库解析该记录。默认情况下，所有活动过滤条件都会被应用，确保用户无法访问过滤器范围之外的记录。

然而，某些过滤器（如 `TrashedFilter`）修改全局作用域而不是限制访问。当用户在表格中看到记录后记录状态发生变化时，你可能仍希望用户与之交互。

你可以使用 `excludeWhenResolvingRecord()` 方法标记在解析记录时应排除的过滤器：

```php
use Filament\Tables\Filters\Filter;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

Filter::make('trashed')
    ->query(fn (Builder $query) => $query->onlyTrashed())
    ->baseQuery(fn (Builder $query) => $query->withoutGlobalScopes([
        SoftDeletingScope::class,
    ]))
    ->excludeWhenResolvingRecord()
```

使用 `excludeWhenResolvingRecord()` 时：
- 解析记录时不应用过滤器的 `query()` 回调
- 解析记录时仍应用过滤器的 `baseQuery()` 回调

:::danger
不要在强制执行授权规则的过滤器上使用 `excludeWhenResolvingRecord()`。例如，如果你有一个按租户或用户所有权限制记录的过滤器，这些过滤器应保持强制执行以防止未授权访问。
:::

## 自定义过滤器触发操作

要自定义过滤器触发按钮，你可以使用 `filtersTriggerAction()` 方法，传递一个返回操作的闭包。所有可用于[自定义操作触发按钮](../../actions/overview)的方法都可以使用：

```php
use Filament\Actions\Action;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->filters([
            // ...
        ])
        ->filtersTriggerAction(
            fn (Action $action) => $action
                ->button()
                ->label('Filter'),
        );
}
```

![自定义过滤器触发操作](/assets/filament/v4.x/screenshots/images/light/tables/filters/custom-trigger-action.jpg)

## 自定义移除所有过滤器操作

要自定义从指示器栏移除所有活动过滤器的操作，你可以使用 `filtersRemoveAllAction()` 方法，传递一个返回操作的闭包。所有可用于[自定义操作触发按钮](../../actions/overview)的方法都可以使用：

```php
use Filament\Actions\Action;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->filters([
            // ...
        ])
        ->filtersRemoveAllAction(
            fn (Action $action) => $action
                ->tooltip('Clear filters'),
        );
}
```

![自定义移除所有过滤器操作](/assets/filament/v4.x/screenshots/images/light/tables/filters/custom-remove-all-action.jpg)

## 过滤器实用工具注入

用于配置过滤器的绝大多数方法都接受函数作为参数，而不是硬编码的值：

```php
use App\Models\Author;
use Filament\Tables\Filters\SelectFilter;

SelectFilter::make('author')
    ->options(fn (): array => Author::query()->pluck('name', 'id')->all())
```

仅此一点就解锁了许多自定义可能性。

该包还能够在这些函数中注入许多实用工具作为参数。所有接受函数作为参数的自定义方法都可以注入实用工具。

这些注入的实用工具需要使用特定的参数名称。否则，Filament 不知道要注入什么。

### 注入当前过滤器实例

如果你想访问当前过滤器实例，请定义 `$filter` 参数：

```php
use Filament\Tables\Filters\BaseFilter;

function (BaseFilter $filter) {
    // ...
}
```

### 注入当前 Livewire 组件实例

如果你想访问表格所属的当前 Livewire 组件实例，请定义 `$livewire` 参数：

```php
use Filament\Tables\Contracts\HasTable;

function (HasTable $livewire) {
    // ...
}
```

### 注入当前表格实例

如果你想访问过滤器所属的当前表格配置实例，请定义 `$table` 参数：

```php
use Filament\Tables\Table;

function (Table $table) {
    // ...
}
```

### 注入多个实用工具

参数使用反射动态注入，因此你可以按任意顺序组合多个参数：

```php
use Filament\Tables\Contracts\HasTable;
use Filament\Tables\Table;

function (HasTable $livewire, Table $table) {
    // ...
}
```

### 从 Laravel 容器注入依赖

你可以像正常一样从 Laravel 容器注入任何内容，与实用工具一起：

```php
use Filament\Tables\Table;
use Illuminate\Http\Request;

function (Request $request, Table $table) {
    // ...
}
```
