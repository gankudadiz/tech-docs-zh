---
title: 选择列
---

## 简介

选择列允许你在表格中渲染一个选择字段，可用于更新数据库记录，无需打开新页面或模态框。

你必须向列传递选项：

```php
use Filament\Tables\Columns\SelectColumn;

SelectColumn::make('status')
    ->options([
        'draft' => 'Draft',
        'reviewing' => 'Reviewing',
        'published' => 'Published',
    ])
```

![选择列](/assets/filament/v4.x/screenshots/images/light/tables/columns/select/simple.jpg)

## 启用 JavaScript 选择

默认情况下，Filament 使用原生 HTML5 选择。你可以使用 `native(false)` 方法启用更可自定义的 JavaScript 选择：

```php
use Filament\Tables\Columns\SelectColumn;

SelectColumn::make('status')
    ->options([
        'draft' => 'Draft',
        'reviewing' => 'Reviewing',
        'published' => 'Published',
    ])
    ->native(false)
```

除固定值外，`native()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

![JavaScript 选择列](/assets/filament/v4.x/screenshots/images/light/tables/columns/select/javascript.jpg)

## 搜索选项

你可以使用 `searchableOptions()` 方法启用搜索输入，以便更轻松地访问大量选项：

```php
use Filament\Tables\Columns\SelectColumn;

SelectColumn::make('author_id')
    ->label('Author')
    ->options(User::query()->pluck('name', 'id'))
    ->searchableOptions()
```

你可以选择传递一个布尔值来控制输入是否应可搜索：

```php
use Filament\Tables\Columns\SelectColumn;

SelectColumn::make('author_id')
    ->label('Author')
    ->options(User::query()->pluck('name', 'id'))
    ->searchableOptions(FeatureFlag::active())
```

除固定值外，`searchableOptions()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

### 返回自定义搜索结果

如果你有大量选项并希望根据数据库搜索或其他外部数据源来填充它们，可以使用 `getOptionsSearchResultsUsing()` 和 `getOptionLabelUsing()` 方法代替 `options()`。

`getOptionsSearchResultsUsing()` 方法接受一个以 `$key => $value` 格式返回搜索结果的回调。当前用户的搜索作为 `$search` 可用，你应该使用它来筛选结果。

`getOptionLabelUsing()` 方法接受一个将选中的选项 `$value` 转换为标签的回调。这在表单首次加载且用户尚未进行搜索时使用。否则，用于显示当前选中选项的标签将不可用。

如果你想提供自定义搜索结果，`getOptionsSearchResultsUsing()` 和 `getOptionLabelUsing()` 必须同时在选择列上使用：

```php
use Filament\Tables\Columns\SelectColumn;

SelectColumn::make('author_id')
    ->searchableOptions()
    ->getOptionsSearchResultsUsing(fn (string $search): array => User::query()
        ->where('name', 'like', "%{$search}%")
        ->limit(50)
        ->pluck('name', 'id')
        ->all())
    ->getOptionLabelUsing(fn ($value): ?string => User::find($value)?->name),
```

`getOptionLabelUsing()` 至关重要，因为它为 Filament 提供了选中选项的标签，使其无需执行完整搜索来查找它。如果选项无效，应返回 `null`。

这些闭包也支持注入 Filament 的工具参数。

### 设置自定义加载消息

使用可搜索的选择或多选时，你可能希望在选项加载时显示自定义消息。你可以使用 `optionsLoadingMessage()` 方法：

```php
use Filament\Tables\Columns\SelectColumn;

SelectColumn::make('author_id')
    ->optionsRelationship(name: 'author', titleAttribute: 'name')
    ->searchableOptions()
    ->optionsLoadingMessage('Loading authors...')
```

除固定值外，`optionsLoadingMessage()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

### 设置自定义无搜索结果消息

使用可搜索的选择或多选时，你可能希望在未找到搜索结果时显示自定义消息。你可以使用 `noOptionsSearchResultsMessage()` 方法：

```php
use Filament\Tables\Columns\SelectColumn;

SelectColumn::make('author_id')
    ->optionsRelationship(name: 'author', titleAttribute: 'name')
    ->searchableOptions()
    ->noOptionsSearchResultsMessage('No authors found.')
```

除固定值外，`noOptionsSearchResultsMessage()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

### 设置自定义搜索提示

使用可搜索的选择或多选时，你可能希望在用户尚未输入搜索词时显示自定义消息。你可以使用 `optionsSearchPrompt()` 方法：

```php
use Filament\Tables\Columns\SelectColumn;

SelectColumn::make('author_id')
    ->optionsRelationship(name: 'author', titleAttribute: 'name')
    ->searchableOptions(['name', 'email'])
    ->optionsSearchPrompt('Search authors by their name or email address')
```

除固定值外，`optionsSearchPrompt()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

### 设置自定义搜索中消息

使用可搜索的选择或多选时，你可能希望在搜索结果加载时显示自定义消息。你可以使用 `optionsSearchingMessage()` 方法：

```php
use Filament\Tables\Columns\SelectColumn;

SelectColumn::make('author_id')
    ->optionsRelationship(name: 'author', titleAttribute: 'name')
    ->searchableOptions()
    ->optionsSearchingMessage('Searching authors...')
```

除固定值外，`optionsSearchingMessage()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

### 调整搜索防抖

默认情况下，当用户在可搜索的选择或多选中输入时，Filament 会等待 1000 毫秒（1 秒）才搜索选项。如果用户持续输入搜索内容，搜索之间也会等待 1000 毫秒。你可以使用 `optionsSearchDebounce()` 方法更改此设置：

```php
use Filament\Tables\Columns\SelectColumn;

SelectColumn::make('author_id')
    ->optionsRelationship(name: 'author', titleAttribute: 'name')
    ->searchableOptions()
    ->optionsSearchDebounce(500)
```

确保不要将防抖降得太低，因为这可能导致选择变得缓慢和无响应，因为需要大量网络请求从服务器检索选项。

除固定值外，`optionsSearchDebounce()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

## 集成 Eloquent 关联关系

你可以使用 `SelectColumn` 的 `optionsRelationship()` 方法配置 `BelongsTo` 关联关系以自动检索选项。`titleAttribute` 是用于为每个选项生成标签的列名：

```php
use Filament\Tables\Columns\SelectColumn;

SelectColumn::make('author_id')
    ->optionsRelationship(name: 'author', titleAttribute: 'name')
```

### 跨多列搜索关联关系选项

默认情况下，如果选择列也是可搜索的，Filament 将根据关联关系的标题列返回搜索结果。如果你想跨多列搜索，可以向 `searchableOptions()` 方法传递列数组：

```php
use Filament\Tables\Columns\SelectColumn;

SelectColumn::make('author_id')
    ->optionsRelationship(name: 'author', titleAttribute: 'name')
    ->searchableOptions(['name', 'email'])
```

### 预加载关联关系选项

如果你想在页面加载时从数据库填充可搜索选项（而不是在用户搜索时），可以使用 `preloadOptions()` 方法：

```php
use Filament\Tables\Columns\SelectColumn;

SelectColumn::make('author_id')
    ->optionsRelationship(name: 'author', titleAttribute: 'name')
    ->searchableOptions()
    ->preloadOptions()
```

你可以选择传递一个布尔值来控制输入是否应预加载：

```php
use Filament\Tables\Columns\SelectColumn;

SelectColumn::make('author_id')
    ->optionsRelationship(name: 'author', titleAttribute: 'name')
    ->searchableOptions()
    ->preload(FeatureFlag::active())
```

除固定值外，`preload()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

### 排除当前记录

处理递归关联关系时，你可能希望从结果集中移除当前记录。

这可以使用 `ignoreRecord` 参数轻松完成：

```php
use Filament\Tables\Columns\SelectColumn;

SelectColumn::make('parent_id')
    ->optionsRelationship(name: 'parent', titleAttribute: 'name', ignoreRecord: true)
```

### 自定义关联关系查询

你可以使用 `optionsRelationship()` 方法的第三个参数自定义检索选项的数据库查询：

```php
use Filament\Tables\Columns\SelectColumn;
use Illuminate\Database\Eloquent\Builder;

SelectColumn::make('author_id')
    ->optionsRelationship(
        name: 'author',
        titleAttribute: 'name',
        modifyQueryUsing: fn (Builder $query) => $query->withTrashed(),
    )
```

`modifyQueryUsing` 参数中的闭包也支持注入 Filament 的工具参数。

### 自定义关联关系选项标签

如果你想自定义每个选项的标签，可以更详细，或者连接名字和姓氏，你可以在数据库迁移中使用虚拟列：

```php
$table->string('full_name')->virtualAs('concat(first_name, \' \', last_name)');
```

```php
use Filament\Tables\Columns\SelectColumn;

SelectColumn::make('author_id')
    ->optionsRelationship(name: 'author', titleAttribute: 'full_name')
```

或者，你可以使用 `getOptionLabelFromRecordUsing()` 方法将选项的 Eloquent 模型转换为标签：

```php
use Filament\Tables\Columns\SelectColumn;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

SelectColumn::make('author_id')
    ->optionsRelationship(
        name: 'author',
        modifyQueryUsing: fn (Builder $query) => $query->orderBy('first_name')->orderBy('last_name'),
    )
    ->getOptionLabelFromRecordUsing(fn (Model $record) => "{$record->first_name} {$record->last_name}")
    ->searchableOptions(['first_name', 'last_name'])
```

`getOptionLabelFromRecordUsing()` 方法支持在闭包中注入 Filament 的工具参数。

### 记住选项

默认情况下，使用 `optionsRelationship()` 时，Filament 会在表格页面期间记住选项以提高性能。这意味着选项函数每个表格页面只运行一次，而不是每个单元格一次。你可以使用 `rememberOptions(false)` 方法禁用此行为：

```php
use Filament\Tables\Columns\SelectColumn;

SelectColumn::make('author_id')
    ->optionsRelationship(name: 'author', titleAttribute: 'name')
    ->rememberOptions(false)
```

:::warning
当选项被记住时，任何特定于记录的选项或禁用的选项将无法正常工作，因为相同的选项将用于表格中的所有记录。如果你需要特定于记录的选项或禁用的选项，应禁用选项记住。
:::

除固定值外，`rememberOptions()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

## 允许选项标签中的 HTML

默认情况下，Filament 会转义选项标签中的任何 HTML。如果你想允许 HTML，可以使用 `allowOptionsHtml()` 方法：

```php
use Filament\Tables\Columns\SelectColumn;

SelectColumn::make('technology')
    ->options([
        'tailwind' => '<span class="text-blue-500">Tailwind</span>',
        'alpine' => '<span class="text-green-500">Alpine</span>',
        'laravel' => '<span class="text-red-500">Laravel</span>',
        'livewire' => '<span class="text-pink-500">Livewire</span>',
    ])
    ->searchableOptions()
    ->allowOptionsHtml()
```

:::danger
请注意，你需要确保 HTML 可以安全渲染，否则你的应用将容易受到 XSS 攻击。
:::

你可以选择传递一个布尔值来控制输入是否应允许 HTML：

```php
use Filament\Tables\Columns\SelectColumn;

SelectColumn::make('technology')
    ->options([
        'tailwind' => '<span class="text-blue-500">Tailwind</span>',
        'alpine' => '<span class="text-green-500">Alpine</span>',
        'laravel' => '<span class="text-red-500">Laravel</span>',
        'livewire' => '<span class="text-pink-500">Livewire</span>',
    ])
    ->searchableOptions()
    ->allowOptionsHtml(FeatureFlag::active())
```

除固定值外，`allowOptionsHtml()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

## 换行或截断选项标签

使用 JavaScript 选择时，超过选择元素宽度的标签默认会换行到多行。或者，你可以选择截断溢出的标签。

```php
use Filament\Tables\Columns\SelectColumn;

SelectColumn::make('truncate')
    ->wrapOptionLabels(false)
```

除固定值外，`wrapOptionLabels()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

## 禁用占位符选择

你可以使用 `selectablePlaceholder(false)` 方法防止选择占位符（null 选项）：

```php
use Filament\Tables\Columns\SelectColumn;

SelectColumn::make('status')
    ->options([
        'draft' => 'Draft',
        'reviewing' => 'Reviewing',
        'published' => 'Published',
    ])
    ->selectablePlaceholder(false)
```

除固定值外，`selectablePlaceholder()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

## 禁用特定选项

你可以使用 `disableOptionWhen()` 方法禁用特定选项。它接受一个闭包，你可以在其中检查具有特定 `$value` 的选项是否应被禁用：

```php
use Filament\Tables\Columns\SelectColumn;

SelectColumn::make('status')
    ->options([
        'draft' => 'Draft',
        'reviewing' => 'Reviewing',
        'published' => 'Published',
    ])
    ->default('draft')
    ->disableOptionWhen(fn (string $value): bool => $value === 'published')
```

这个闭包也支持注入 Filament 的工具参数。

## 限制选项数量

你可以使用 `optionsLimit()` 方法限制可搜索选择或多选中显示的选项数量。默认为 50：

```php
use Filament\Tables\Columns\SelectColumn;

SelectColumn::make('author_id')
    ->optionsRelationship(name: 'author', titleAttribute: 'name')
    ->searchableOptions()
    ->optionsLimit(20)
```

确保不要将限制提得太高，因为这可能导致选择变得缓慢和无响应，因为浏览器内存使用过高。

除固定值外，`optionsLimit()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

## 验证

你可以通过传递任何 [Laravel 验证规则](https://laravel.com/docs/validation#available-validation-rules)数组来验证输入：

```php
use Filament\Tables\Columns\SelectColumn;

SelectColumn::make('status')
    ->options([
        'draft' => 'Draft',
        'reviewing' => 'Reviewing',
        'published' => 'Published',
    ])
    ->rules(['required'])
```

### 有效选项验证（`in` 规则）

`in` 规则确保用户无法选择不在选项列表中的选项。这是数据完整性的重要规则，因此 Filament 默认将其应用于所有选择字段。

由于选择字段填充选项的方式有很多，并且在许多情况下选项默认不会全部加载到选择中，需要搜索才能检索它们，Filament 使用有效"选项标签"的存在来确定选中的值是否存在。它还会检查该选项是否被[禁用](#disabling-specific-options)。

如果你使用自定义搜索查询来检索选项，应确保定义了 `getOptionLabelUsing()` 方法，以便 Filament 可以针对可用选项验证选中的值：

```php
use Filament\Tables\Columns\SelectColumn;

SelectColumn::make('author_id')
    ->searchableOptions()
    ->getOptionsSearchResultsUsing(fn (string $search): array => Author::query()
        ->where('name', 'like', "%{$search}%")
        ->limit(50)
        ->pluck('name', 'id')
        ->all())
    ->getOptionLabelUsing(fn (string $value): ?string => Author::find($value)?->name),
```

如果选项无效，`getOptionLabelUsing()` 方法应返回 `null`，以允许 Filament 确定选中的值不在选项列表中。如果选项有效，应返回选项的标签。

如果你使用 `optionsRelationship()` 方法，`getOptionLabelUsing()` 方法将自动为你定义，因此你不需要担心。

## 生命周期钩子

钩子可用于在选择生命周期的不同点执行代码：

```php
SelectColumn::make()
    ->beforeStateUpdated(function ($record, $state) {
        // 在状态保存到数据库之前运行。
    })
    ->afterStateUpdated(function ($record, $state) {
        // 在状态保存到数据库之后运行。
    })
```

## 安全

### 授权

选择列在保存更改之前不会自动检查 Laravel 模型策略。当用户通过选择列更新值时，Filament 会检查列是否被 `disabled()`，但不会运行任何 `update` 策略门检查。这意味着，如果用户可以在表格中看到记录且列未被禁用，他们可以更新该列的值，无论你定义了什么 `update` 策略。如果你需要限制谁可以编辑此列，应使用 `disabled()` 方法基于你自己的授权逻辑有条件地阻止编辑，例如 `disabled(fn ($record) => $record->user_id !== auth()->id())`。或者，考虑使用完整的编辑页面或模态框操作，其中 Filament 的资源授权会被强制执行。
