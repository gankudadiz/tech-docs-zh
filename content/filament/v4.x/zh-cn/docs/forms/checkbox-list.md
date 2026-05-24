---
title: 复选框列表
---

## 简介

复选框列表组件允许你从预定义的选项列表中选择多个值：

```php
use Filament\Forms\Components\CheckboxList;

CheckboxList::make('technologies')
    ->options([
        'tailwind' => 'Tailwind CSS',
        'alpine' => 'Alpine.js',
        'laravel' => 'Laravel',
        'livewire' => 'Laravel Livewire',
    ])
```

:::tip
除了静态数组，`options()` 方法还接受一个函数来动态计算。你可以向该函数注入各种实用工具作为参数。
:::

![复选框列表](/assets/filament/v4.x/screenshots/images/light/forms/fields/checkbox-list/simple.jpg)

这些选项以 JSON 格式返回。如果你使用 Eloquent 保存它们，应确保为模型属性添加 `array` [转换器](https://laravel.com/docs/eloquent-mutators#array-and-json-casting)：

```php
use Illuminate\Database\Eloquent\Model;

class App extends Model
{
    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'technologies' => 'array',
        ];
    }

    // ...
}
```

## 设置选项描述

你可以使用 `descriptions()` 方法为每个选项提供描述。该方法接受一个纯文本字符串数组，或 `Illuminate\Support\HtmlString` 或 `Illuminate\Contracts\Support\Htmlable` 的实例。这允许你在描述中渲染 HTML 甚至 Markdown：

```php
use Filament\Forms\Components\CheckboxList;
use Illuminate\Support\HtmlString;

CheckboxList::make('technologies')
    ->options([
        'tailwind' => 'Tailwind CSS',
        'alpine' => 'Alpine.js',
        'laravel' => 'Laravel',
        'livewire' => 'Laravel Livewire',
    ])
    ->descriptions([
        'tailwind' => 'A utility-first CSS framework for rapidly building modern websites without ever leaving your HTML.',
        'alpine' => new HtmlString('A rugged, minimal tool for composing behavior <strong>directly in your markup</strong>.'),
        'laravel' => str('A **web application** framework with expressive, elegant syntax.')->inlineMarkdown()->toHtmlString(),
        'livewire' => 'A full-stack framework for Laravel building dynamic interfaces simple, without leaving the comfort of Laravel.',
    ])
```

:::tip
除了静态数组，`descriptions()` 方法还接受一个函数来动态计算。你可以向该函数注入各种实用工具作为参数。
:::

![带选项描述的复选框列表](/assets/filament/v4.x/screenshots/images/light/forms/fields/checkbox-list/option-descriptions.jpg)

:::info
请确保描述数组中的 `key` 与选项数组中的 `key` 一致，以便正确的描述匹配到正确的选项。
:::

## 将选项拆分为多列

你可以使用 `columns()` 方法将选项拆分为多列：

```php
use Filament\Forms\Components\CheckboxList;

CheckboxList::make('technologies')
    ->options([
        // ...
    ])
    ->columns(2)
```

:::tip
除了静态值，`columns()` 方法还接受一个函数来动态计算。你可以向该函数注入各种实用工具作为参数。
:::

![两列的复选框列表](/assets/filament/v4.x/screenshots/images/light/forms/fields/checkbox-list/columns.jpg)

该方法接受与[网格](../schemas/layouts#网格系统)的 `columns()` 方法相同的选项。这允许你根据不同的响应式断点自定义列数。

### 设置网格方向

默认情况下，当你将复选框排列为多列时，它们会按垂直顺序排列。如果你想按水平顺序排列，可以使用 `gridDirection(GridDirection::Row)` 方法：

```php
use Filament\Forms\Components\CheckboxList;
use Filament\Support\Enums\GridDirection;

CheckboxList::make('technologies')
    ->options([
        // ...
    ])
    ->columns(2)
    ->gridDirection(GridDirection::Row)
```

:::tip
除了静态值，`gridDirection()` 方法还接受一个函数来动态计算。你可以向该函数注入各种实用工具作为参数。
:::

![两行的复选框列表](/assets/filament/v4.x/screenshots/images/light/forms/fields/checkbox-list/rows.jpg)

## 搜索选项

你可以使用 `searchable()` 方法启用搜索输入框，以便在选项较多时更方便地查找：

```php
use Filament\Forms\Components\CheckboxList;

CheckboxList::make('technologies')
    ->options([
        // ...
    ])
    ->searchable()
```

![可搜索的复选框列表](/assets/filament/v4.x/screenshots/images/light/forms/fields/checkbox-list/searchable.jpg)

你也可以传入一个布尔值来控制选项是否可搜索：

```php
use Filament\Forms\Components\CheckboxList;

CheckboxList::make('technologies')
    ->options([
        // ...
    ])
    ->searchable(FeatureFlag::active())
```

:::tip
除了静态值，`searchable()` 方法还接受一个函数来动态计算。你可以向该函数注入各种实用工具作为参数。
:::

## 批量切换复选框

你可以使用 `bulkToggleable()` 方法允许用户一次性切换所有复选框：

```php
use Filament\Forms\Components\CheckboxList;

CheckboxList::make('technologies')
    ->options([
        // ...
    ])
    ->bulkToggleable()
```

![可批量切换的复选框列表](/assets/filament/v4.x/screenshots/images/light/forms/fields/checkbox-list/bulk-toggleable.jpg)

你也可以传入一个布尔值来控制复选框是否可批量切换：

```php
use Filament\Forms\Components\CheckboxList;

CheckboxList::make('technologies')
    ->options([
        // ...
    ])
    ->bulkToggleable(FeatureFlag::active())
```

:::tip
除了静态值，`bulkToggleable()` 方法还接受一个函数来动态计算。你可以向该函数注入各种实用工具作为参数。
:::

## 禁用特定选项

你可以使用 `disableOptionWhen()` 方法禁用特定选项。它接受一个闭包，你可以在其中检查具有特定 `$value` 的选项是否应被禁用：

```php
use Filament\Forms\Components\CheckboxList;

CheckboxList::make('technologies')
    ->options([
        'tailwind' => 'Tailwind CSS',
        'alpine' => 'Alpine.js',
        'laravel' => 'Laravel',
        'livewire' => 'Laravel Livewire',
    ])
    ->disableOptionWhen(fn (string $value): bool => $value === 'livewire')
```

![带禁用选项的复选框列表](/assets/filament/v4.x/screenshots/images/light/forms/fields/checkbox-list/disabled-options.jpg)

:::tip
你可以向 `disableOptionWhen()` 函数注入各种实用工具作为参数，包括 `$value`（选项的值）和 `$label`（选项的标签）。
:::

如果你想获取未被禁用的选项（例如用于验证），可以使用 `getEnabledOptions()`：

```php
use Filament\Forms\Components\CheckboxList;

CheckboxList::make('technologies')
    ->options([
        'tailwind' => 'Tailwind CSS',
        'alpine' => 'Alpine.js',
        'laravel' => 'Laravel',
        'livewire' => 'Laravel Livewire',
        'heroicons' => 'SVG icons',
    ])
    ->disableOptionWhen(fn (string $value): bool => $value === 'heroicons')
    ->in(fn (CheckboxList $component): array => array_keys($component->getEnabledOptions()))
```

有关 `in()` 函数的更多信息，请参阅[验证文档](validation#在中)。

## 允许选项标签中的 HTML

默认情况下，Filament 会转义选项标签中的任何 HTML。如果你想允许 HTML，可以使用 `allowHtml()` 方法：

```php
use Filament\Forms\Components\CheckboxList;

CheckboxList::make('technology')
    ->options([
        'tailwind' => '<span class="text-blue-500">Tailwind</span>',
        'alpine' => '<span class="text-green-500">Alpine</span>',
        'laravel' => '<span class="text-red-500">Laravel</span>',
        'livewire' => '<span class="text-pink-500">Livewire</span>',
    ])
    ->searchable()
    ->allowHtml()
```

![带 HTML 标签的复选框列表](/assets/filament/v4.x/screenshots/images/light/forms/fields/checkbox-list/html-labels.jpg)

:::danger
请注意，你需要确保要渲染的 HTML 是安全的，否则你的应用程序将面临 XSS 攻击风险。
:::

你也可以传入一个布尔值来控制选项是否允许 HTML：

```php
use Filament\Forms\Components\CheckboxList;

CheckboxList::make('technology')
    ->options([
        'tailwind' => '<span class="text-blue-500">Tailwind</span>',
        'alpine' => '<span class="text-green-500">Alpine</span>',
        'laravel' => '<span class="text-red-500">Laravel</span>',
        'livewire' => '<span class="text-pink-500">Livewire</span>',
    ])
    ->searchable()
    ->allowHtml(FeatureFlag::active())
```

:::tip
除了静态值，`allowHtml()` 方法还接受一个函数来动态计算。你可以向该函数注入各种实用工具作为参数。
:::

## 与 Eloquent 关联集成

> 如果你在 Livewire 组件中构建表单，请确保已设置[表单的模型](../components/form#设置表单模型)。否则，Filament 不知道使用哪个模型来检索关联。

你可以使用 `CheckboxList` 的 `relationship()` 方法指向一个 `BelongsToMany` 关联。Filament 将从关联中加载选项，并在表单提交时将它们保存回关联的中间表。`titleAttribute` 是用于为每个选项生成标签的列名：

```php
use Filament\Forms\Components\CheckboxList;

CheckboxList::make('technologies')
    ->relationship(titleAttribute: 'name')
```

:::warning
当同时使用 `disabled()` 和 `relationship()` 时，请确保 `disabled()` 在 `relationship()` 之前调用。这可以确保 `disabled()` 中的 `saved()` 调用不会在 `relationship()` 配置之后应用：

```php
use Filament\Forms\Components\CheckboxList;

CheckboxList::make('technologies')
    ->disabled()
    ->relationship(titleAttribute: 'name')
```
:::

### 自定义关联查询

你可以使用 `relationship()` 方法的 `modifyQueryUsing` 参数自定义检索选项的数据库查询：

```php
use Filament\Forms\Components\CheckboxList;
use Illuminate\Database\Eloquent\Builder;

CheckboxList::make('technologies')
    ->relationship(
        titleAttribute: 'name',
        modifyQueryUsing: fn (Builder $query) => $query->withTrashed(),
    )
```

:::tip
`modifyQueryUsing` 参数可以向函数注入各种实用工具作为参数，包括 `$query`（Eloquent 查询构建器）。
:::

### 自定义关联选项标签

如果你想自定义每个选项的标签（例如更具描述性，或拼接名和姓），可以在数据库迁移中使用虚拟列：

```php
$table->string('full_name')->virtualAs('concat(first_name, \' \', last_name)');
```

```php
use Filament\Forms\Components\CheckboxList;

CheckboxList::make('authors')
    ->relationship(titleAttribute: 'full_name')
```

或者，你可以使用 `getOptionLabelFromRecordUsing()` 方法将选项的 Eloquent 模型转换为标签：

```php
use Filament\Forms\Components\CheckboxList;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

CheckboxList::make('authors')
    ->relationship(
        modifyQueryUsing: fn (Builder $query) => $query->orderBy('first_name')->orderBy('last_name'),
    )
    ->getOptionLabelFromRecordUsing(fn (Model $record) => "{$record->first_name} {$record->last_name}")
```

:::tip
`getOptionLabelFromRecordUsing()` 方法可以向函数注入各种实用工具作为参数，包括 `$record`（Eloquent 记录）。
:::

### 自定义关联选项描述

如果你想自定义每个选项的描述，可以使用 `getOptionDescriptionFromRecordUsing()` 方法将选项的 Eloquent 模型转换为描述：

```php
use Filament\Forms\Components\CheckboxList;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

CheckboxList::make('authors')
    ->relationship(
        modifyQueryUsing: fn (Builder $query) => $query->orderBy('first_name')->orderBy('last_name'),
    )
    ->getOptionDescriptionFromRecordUsing(fn (Model $record) => $record->notes)
```

:::tip
`getOptionDescriptionFromRecordUsing()` 方法可以向函数注入各种实用工具作为参数，包括 `$record`（Eloquent 记录）。
:::

### 保存中间表数据到关联

如果你的中间表有额外的列，可以使用 `pivotData()` 方法指定应保存到其中的数据：

```php
use Filament\Forms\Components\CheckboxList;

CheckboxList::make('primaryTechnologies')
    ->relationship(name: 'technologies', titleAttribute: 'name')
    ->pivotData([
        'is_primary' => true,
    ])
```

:::tip
除了静态值，`pivotData()` 方法还接受一个函数来动态计算。你可以向该函数注入各种实用工具作为参数。
:::

## 设置自定义无搜索结果消息

当你使用可搜索的复选框列表时，你可能希望在没有搜索结果时显示自定义消息。你可以使用 `noSearchResultsMessage()` 方法：

```php
use Filament\Forms\Components\CheckboxList;

CheckboxList::make('technologies')
    ->options([
        // ...
    ])
    ->searchable()
    ->noSearchResultsMessage('No technologies found.')
```

:::tip
除了静态值，`noSearchResultsMessage()` 方法还接受一个函数来动态计算。你可以向该函数注入各种实用工具作为参数。
:::

## 设置自定义搜索提示

当你使用可搜索的复选框列表时，你可能想调整用户尚未输入搜索词时搜索输入框的占位符。你可以使用 `searchPrompt()` 方法：

```php
use Filament\Forms\Components\CheckboxList;

CheckboxList::make('technologies')
    ->options([
        // ...
    ])
    ->searchable()
    ->searchPrompt('Search for a technology')
```

:::tip
除了静态值，`searchPrompt()` 方法还接受一个函数来动态计算。你可以向该函数注入各种实用工具作为参数。
:::

## 调整搜索防抖时间

默认情况下，当用户在可搜索的复选框列表中输入时，Filament 会等待 1000 毫秒（1 秒）后再搜索选项。如果用户持续输入，搜索之间的间隔也是 1000 毫秒。你可以使用 `searchDebounce()` 方法来更改此设置：

```php
use Filament\Forms\Components\CheckboxList;

CheckboxList::make('technologies')
    ->options([
        // ...
    ])
    ->searchable()
    ->searchDebounce(500)
```

:::tip
除了静态值，`searchDebounce()` 方法还接受一个函数来动态计算。你可以向该函数注入各种实用工具作为参数。
:::

## 自定义复选框列表操作对象

此字段使用操作对象来方便地自定义其中的按钮。你可以通过向操作注册方法传递函数来自定义这些按钮。该函数可以访问 `$action` 对象，你可以用它来[自定义操作](../actions/overview)。以下方法可用于自定义操作：

- `selectAllAction()`
- `deselectAllAction()`

以下是自定义操作的示例：

```php
use Filament\Actions\Action;
use Filament\Forms\Components\CheckboxList;

CheckboxList::make('technologies')
    ->options([
        // ...
    ])
    ->selectAllAction(
        fn (Action $action) => $action->label('Select all technologies'),
    )
```

:::tip
操作注册方法可以向函数注入各种实用工具作为参数，包括 `$action`（操作对象）。
:::
