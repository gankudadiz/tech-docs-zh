---
title: 列概述
---

## 简介

列类位于 `Filament\Tables\Columns` 命名空间中。它们存放在 `$table->columns()` 方法中。Filament 内置了多种列类型：

- [文本列](text)
- [图标列](icon)
- [图片列](image)
- [颜色列](color)

可编辑列允许用户在不离开表格的情况下更新数据库中的数据：

- [选择列](select)
- [开关列](toggle)
- [文本输入列](text-input)
- [复选框列](checkbox)

你还可以[创建自定义列类型](custom-columns)，以任何你希望的方式展示数据。

列可以使用静态 `make()` 方法创建，传入其唯一名称。通常，列的名称对应于 Eloquent 模型上的属性名称。你可以使用"点表示法"来访问关联关系中的属性：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('title')

TextColumn::make('author.name')
```

## 列内容（状态）

列一开始可能感觉有点魔法，但它们的设计目标是简单易用，并针对显示 Eloquent 记录中的数据进行了优化。尽管如此，它们是灵活的，你可以显示来自任何来源的数据，而不仅仅是 Eloquent 记录属性。

列显示的数据称为其"状态"。使用[面板资源](../../resources/overview)时，表格知道它正在显示的记录。这意味着列的状态是根据记录上属性的值设置的。例如，如果列用于 `PostResource` 的表格中，则将显示当前文章的 `title` 属性值。

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('title')
```

如果你想访问存储在关联关系中的值，可以使用"点表示法"。首先是你要访问数据的关联关系名称，然后是一个点，接着是属性名称：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('author.name')
```

你还可以使用"点表示法"访问 Eloquent 模型上 JSON / 数组列中的值。首先是属性名称，然后是一个点，接着是你想读取的 JSON 对象的键：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('meta.title')
```

### 设置列的状态

你可以使用 `state()` 方法将自己的状态传递给列：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('title')
    ->state('Hello, world!')
```

`state()` 方法也接受一个函数来动态计算状态。这个闭包也支持注入 Filament 的工具参数。

### 设置列的默认状态

当列为空（其状态为 `null`）时，你可以使用 `default()` 方法定义要使用的替代状态。此方法会将默认状态视为真实状态，因此像[图片](image)或[颜色](color)这样的列会显示默认图片或颜色。

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('title')
    ->default('Untitled')
```

#### 为空列添加占位文本

有时你可能想为空状态的列显示占位文本，其样式为较浅的灰色文本。这与[默认值](#setting-the-default-state-of-an-column)不同，因为占位符始终是文本，不会被视为真实状态。

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('title')
    ->placeholder('Untitled')
```

![带空状态占位符的列](/assets/filament/v4.x/screenshots/images/light/tables/columns/placeholder.jpg)

### 显示关联关系中的数据

你可以使用"点表示法"来访问关联关系中的列。首先是关联关系名称，然后是一个点，接着是要显示的列名称：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('author.name')
```

#### 统计关联关系

如果你想在列中统计相关记录的数量，可以使用 `counts()` 方法：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('users_count')->counts('users')
```

在此示例中，`users` 是要统计的关联关系名称。列的名称必须是 `users_count`，因为这是 [Laravel 使用的](https://laravel.com/docs/eloquent-relationships#counting-related-models)存储结果的约定。

如果你想在统计之前对关联关系进行筛选，可以传递一个数组给该方法，其中键是关联关系名称，值是用于筛选 Eloquent 查询的函数：

```php
use Filament\Tables\Columns\TextColumn;
use Illuminate\Database\Eloquent\Builder;

TextColumn::make('users_count')->counts([
    'users' => fn (Builder $query) => $query->where('is_active', true),
])
```

#### 判断关联关系是否存在

如果你只想在列中指示相关记录是否存在，可以使用 `exists()` 方法：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('users_exists')->exists('users')
```

在此示例中，`users` 是要检查存在性的关联关系名称。列的名称必须是 `users_exists`，因为这是 [Laravel 使用的](https://laravel.com/docs/eloquent-relationships#other-aggregate-functions)存储结果的约定。

如果你想在检查存在性之前对关联关系进行筛选，可以传递一个数组给该方法，其中键是关联关系名称，值是用于筛选 Eloquent 查询的函数：

```php
use Filament\Tables\Columns\TextColumn;
use Illuminate\Database\Eloquent\Builder;

TextColumn::make('users_exists')->exists([
    'users' => fn (Builder $query) => $query->where('is_active', true),
])
```

#### 聚合关联关系

Filament 提供了几种聚合关联字段的方法，包括 `avg()`、`max()`、`min()` 和 `sum()`。例如，如果你想在列中显示所有相关记录某个字段的平均值，可以使用 `avg()` 方法：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('users_avg_age')->avg('users', 'age')
```

在此示例中，`users` 是关联关系名称，`age` 是正在求平均值的字段。列的名称必须是 `users_avg_age`，因为这是 [Laravel 使用的](https://laravel.com/docs/eloquent-relationships#other-aggregate-functions)存储结果的约定。

如果你想在聚合之前对关联关系进行筛选，可以传递一个数组给该方法，其中键是关联关系名称，值是用于筛选 Eloquent 查询的函数：

```php
use Filament\Tables\Columns\TextColumn;
use Illuminate\Database\Eloquent\Builder;

TextColumn::make('users_avg_age')->avg([
    'users' => fn (Builder $query) => $query->where('is_active', true),
], 'age')
```

## 设置列的标签

默认情况下，列的标签（显示在表格标题中）是根据列名生成的。你可以使用 `label()` 方法来自定义：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('name')
    ->label('Full name')
```

除固定值外，`label()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

以这种方式自定义标签在你想使用[翻译字符串进行本地化](https://laravel.com/docs/localization#retrieving-translation-strings)时很有用：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('name')
    ->label(__('columns.name'))
```

## 排序

列可以通过点击列标签来排序。要使列可排序，必须使用 `sortable()` 方法：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('name')
    ->sortable()
```

![带可排序列的表格](/assets/filament/v4.x/screenshots/images/light/tables/columns/sortable.jpg)

使用列名，Filament 将对 Eloquent 查询应用 `orderBy()` 子句。这对于列名与数据库列名匹配的简单情况很有用。它也可以处理[关联关系](#displaying-data-from-relationships)。

然而，许多列并不那么简单。列的[状态](#column-content-state)可能是自定义的，或者使用了 [Eloquent 访问器](https://laravel.com/docs/eloquent-mutators#accessors-and-mutators)。在这种情况下，你可能需要自定义排序行为。

你可以传递一个表中真实数据库列的数组来排序该列：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('full_name')
    ->sortable(['first_name', 'last_name'])
```

在这种情况下，`full_name` 列不是数据库中的真实列，但 `first_name` 和 `last_name` 列是。当 `full_name` 列被排序时，Filament 将按 `first_name` 和 `last_name` 列对表格排序。传递两个列的原因是，如果两条记录具有相同的 `first_name`，将使用 `last_name` 来排序。如果你的用例不需要此功能，你可以只传递一个列。

你也可以直接与 Eloquent 查询交互来自定义该列的排序方式：

```php
use Filament\Tables\Columns\TextColumn;
use Illuminate\Database\Eloquent\Builder;

TextColumn::make('full_name')
    ->sortable(query: function (Builder $query, string $direction): Builder {
        return $query
            ->orderBy('last_name', $direction)
            ->orderBy('first_name', $direction);
    })
```

`query` 参数中的闭包也支持注入 Filament 的工具参数。

### 默认排序

你可以选择在没有其他排序应用时默认对表格排序。可以使用 `defaultSort()` 方法：

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->columns([
            // ...
        ])
        ->defaultSort('stock', direction: 'desc');
}
```

第二个参数是可选的，默认为 `'asc'`。

如果你将表格列的名称作为第一个参数传递，Filament 将使用该列的排序行为（自定义排序列或查询函数）。但是，如果你需要按表格或数据库中不存在的列排序，应改为传递查询函数：

```php
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

public function table(Table $table): Table
{
    return $table
        ->columns([
            // ...
        ])
        ->defaultSort(function (Builder $query): Builder {
            return $query->orderBy('stock');
        });
}
```

### 在用户会话中持久化排序

要在用户会话中持久化排序，请使用 `persistSortInSession()` 方法：

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->columns([
            // ...
        ])
        ->persistSortInSession();
}
```

### 设置默认排序选项标签

要设置默认排序选项标签，请使用 `defaultSortOptionLabel()` 方法：

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->columns([
            // ...
        ])
        ->defaultSortOptionLabel('Date');
}
```

## 禁用默认主键排序

默认情况下，Filament 会自动向表格查询添加主键排序，以确保记录顺序一致。主键将与其他排序列按相同方向排序。如果你的表格没有主键，或者你想禁用此行为，可以使用 `defaultKeySort(false)` 方法：

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->columns([
            // ...
        ])
        ->defaultKeySort(false);
}
```

## 搜索

列可以使用表格右上角的文本输入字段进行搜索。要使列可搜索，必须使用 `searchable()` 方法：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('name')
    ->searchable()
```

![带可搜索列的表格](/assets/filament/v4.x/screenshots/images/light/tables/columns/searchable.jpg)

默认情况下，Filament 将对 Eloquent 查询应用 `where` 子句，搜索列名。这对于列名与数据库列名匹配的简单情况很有用。它也可以处理[关联关系](#displaying-data-from-relationships)。

然而，许多列并不那么简单。列的[状态](#column-content-state)可能是自定义的，或者使用了 [Eloquent 访问器](https://laravel.com/docs/eloquent-mutators#accessors-and-mutators)。在这种情况下，你可能需要自定义搜索行为。

你可以传递一个表中真实数据库列的数组来搜索该列：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('full_name')
    ->searchable(['first_name', 'last_name'])
```

在这种情况下，`full_name` 列不是数据库中的真实列，但 `first_name` 和 `last_name` 列是。当 `full_name` 列被搜索时，Filament 将按 `first_name` 和 `last_name` 列搜索表格。

你也可以直接与 Eloquent 查询交互来自定义该列的搜索方式：

```php
use Filament\Tables\Columns\TextColumn;
use Illuminate\Database\Eloquent\Builder;

TextColumn::make('full_name')
    ->searchable(query: function (Builder $query, string $search): Builder {
        return $query
            ->where('first_name', 'like', "%{$search}%")
            ->orWhere('last_name', 'like', "%{$search}%");
    })
```

`query` 参数中的闭包也支持注入 Filament 的工具参数。

### 向表格添加额外的可搜索列

你可以允许表格搜索不在表格中显示的额外列，通过向 `searchable()` 方法传递列名数组：

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->columns([
            // ...
        ])
        ->searchable(['id']);
}
```

你可以使用点表示法在关联关系中搜索：

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->columns([
            // ...
        ])
        ->searchable(['id', 'author.id']);
}
```

你也可以传递自定义函数来进行搜索：

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->columns([
            // ...
        ])
        ->searchable([
            'id',
            'author.id',
            function (Builder $query, string $search): Builder {
                if (! is_numeric($search)) {
                    return $query;
                }

                return $query->whereYear('published_at', $search);
            },
        ]);
}
```

### 自定义表格搜索字段占位符

你可以使用 `$table` 上的 `searchPlaceholder()` 方法自定义搜索字段中的占位符：

```php
use Filament\Tables\Table;

public static function table(Table $table): Table
{
    return $table
        ->columns([
            // ...
        ])
        ->searchPlaceholder('Search (ID, Name)');
}
```

### 单独搜索

你可以使用 `isIndividual` 参数启用每列的单独搜索输入字段：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('name')
    ->searchable(isIndividual: true)
```

![带单独可搜索列的表格](/assets/filament/v4.x/screenshots/images/light/tables/columns/individually-searchable.jpg)

如果你使用 `isIndividual` 参数，你仍然可以使用表格的主"全局"搜索输入字段来搜索该列。

要禁用此功能同时保留单独搜索功能，你需要 `isGlobal` 参数：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('title')
    ->searchable(isIndividual: true, isGlobal: false)
```

### 自定义表格搜索防抖

你可以使用 `$table` 上的 `searchDebounce()` 方法自定义所有表格搜索字段的防抖时间。默认设置为 `500ms`：

```php
use Filament\Tables\Table;

public static function table(Table $table): Table
{
    return $table
        ->columns([
            // ...
        ])
        ->searchDebounce('750ms');
}
```

### 在输入框失焦时搜索

你可以在用户输入搜索内容时不自动重新加载表格内容（受搜索字段的[防抖](#customizing-the-table-search-debounce)影响），而是改为仅在用户失焦（切换标签或点击外部）时才搜索表格，使用 `searchOnBlur()` 方法：

```php
use Filament\Tables\Table;

public static function table(Table $table): Table
{
    return $table
        ->columns([
            // ...
        ])
        ->searchOnBlur();
}
```

### 在用户会话中持久化搜索

要在用户会话中持久化表格或单独列搜索，请使用 `persistSearchInSession()` 或 `persistColumnSearchInSession()` 方法：

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->columns([
            // ...
        ])
        ->persistSearchInSession()
        ->persistColumnSearchesInSession();
}
```

### 禁用搜索词拆分

默认情况下，表格搜索会将搜索词拆分为单独的单词，并分别搜索每个单词。这允许更灵活的搜索查询。但是，当涉及大型数据集时，可能会对性能产生负面影响。你可以使用表格上的 `splitSearchTerms(false)` 方法禁用此行为：

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->columns([
            // ...
        ])
        ->splitSearchTerms(false);
}
```

## 可点击的单元格内容

当单元格被点击时，你可以打开 URL 或触发"操作"。

### 打开 URL

要打开 URL，你可以使用 `url()` 方法：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('title')
    ->url(fn (Post $record): string => route('posts.edit', ['post' => $record]))
```

`url()` 方法也接受一个函数来动态计算值。这个闭包也支持注入 Filament 的工具参数。

:::tip
你也可以为整行选择要打开的 URL，而不仅仅是单个列。请参阅[记录 URL 章节](../overview#record-urls-clickable-rows)。

当同时使用记录 URL 和列 URL 时，列 URL 将仅覆盖那些单元格的记录 URL。
:::

你也可以选择在新标签页中打开 URL：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('title')
    ->url(fn (Post $record): string => route('posts.edit', ['post' => $record]))
    ->openUrlInNewTab()
```

:::danger
如果你将用户控制的数据传递给 `url()` 方法，应验证该 URL 是否使用了危险的 scheme，如 `javascript:` 或 `data:`。否则可能会使你的应用暴露于 XSS 攻击。
:::

### 触发操作

要在单元格被点击时运行函数，你可以使用 `action()` 方法。每个方法都接受一个 `$record` 参数，你可以用它来自定义操作的行为：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('title')
    ->action(function (Post $record): void {
        $this->dispatch('open-post-edit-modal', post: $record->getKey());
    })
```

#### 操作模态框

你可以通过将 `Action` 对象传递给 `action()` 方法来打开[操作模态框](../../actions#modals)：

```php
use Filament\Actions\Action;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('title')
    ->action(
        Action::make('select')
            ->requiresConfirmation()
            ->action(function (Post $record): void {
                $this->dispatch('select-post', post: $record->getKey());
            }),
    )
```

传递给 `action()` 方法的操作对象必须具有唯一名称，以区别于表格中的其他操作。

#### 防止单元格被点击

你可以使用 `disabledClick()` 方法防止单元格被点击：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('title')
    ->disabledClick()
```

如果启用了[行 URL](../overview#record-urls-clickable-rows)，该单元格将不可点击。

## 为列添加工具提示

你可以指定悬停在单元格上时显示的工具提示：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('title')
    ->tooltip('Title')
```

除固定值外，`tooltip()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

![带列工具提示的表格](/assets/filament/v4.x/screenshots/images/light/tables/columns/tooltips.jpg)

## 为列添加标题工具提示

你可以指定悬停在列标题上时显示的工具提示：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('sku')
    ->headerTooltip('Stock Keeping Unit')
```

除固定值外，`headerTooltip()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

![带标题工具提示的表格](/assets/filament/v4.x/screenshots/images/light/tables/columns/header-tooltips.jpg)

## 对齐列内容

### 水平对齐列内容

你可以使用 `alignStart()`、`alignCenter()` 或 `alignEnd()` 方法将列的内容对齐到起始位置（从左到右界面中为左侧，从右到左界面中为右侧）、居中或结束位置（从左到右界面中为右侧，从右到左界面中为左侧）：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('email')
    ->alignStart() // 这是默认对齐方式。

TextColumn::make('email')
    ->alignCenter()

TextColumn::make('email')
    ->alignEnd()
```

或者，你可以将 `Alignment` 枚举传递给 `alignment()` 方法：

```php
use Filament\Support\Enums\Alignment;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('email')
    ->label('Email address')
    ->alignment(Alignment::End)
```

除固定值外，`alignment()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

![列对齐到末尾的表格](/assets/filament/v4.x/screenshots/images/light/tables/columns/alignment.jpg)

### 垂直对齐列内容

你可以使用 `verticallyAlignStart()`、`verticallyAlignCenter()` 或 `verticallyAlignEnd()` 方法将列的内容垂直对齐到起始位置、居中或结束位置：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('name')
    ->verticallyAlignStart()

TextColumn::make('name')
    ->verticallyAlignCenter() // 这是默认对齐方式。

TextColumn::make('name')
    ->verticallyAlignEnd()
```

或者，你可以将 `VerticalAlignment` 枚举传递给 `verticalAlignment()` 方法：

```php
use Filament\Support\Enums\VerticalAlignment;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('name')
    ->verticalAlignment(VerticalAlignment::Start)
```

除固定值外，`verticalAlignment()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

![列垂直对齐到起始位置的表格](/assets/filament/v4.x/screenshots/images/light/tables/columns/vertical-alignment.jpg)

## 允许列标题换行

默认情况下，如果列标题需要更多空间，它们不会换行到多行。你可以使用 `wrapHeader()` 方法允许它们换行：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('name')
    ->wrapHeader()
```

你可以选择传递一个布尔值来控制标题是否应换行：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('name')
    ->wrapHeader(FeatureFlag::active())
```

`wrapHeader()` 方法也接受一个函数来动态计算值。这个闭包也支持注入 Filament 的工具参数。

![带换行列标题的表格](/assets/filament/v4.x/screenshots/images/light/tables/columns/wrap-header.jpg)

## 控制列宽

默认情况下，列将占用它们需要的空间。你可以使用 `grow()` 方法允许某些列比其他列占用更多空间：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('name')
    ->grow()
```

或者，你可以为列定义宽度，该宽度通过 `style` 属性传递给标题单元格，因此你可以使用任何有效的 CSS 值：

```php
use Filament\Tables\Columns\IconColumn;

IconColumn::make('is_paid')
    ->label('Paid')
    ->boolean()
    ->width('1%')
```

`width()` 方法也接受一个函数来动态计算值。这个闭包也支持注入 Filament 的工具参数。

![带列宽控制的表格](/assets/filament/v4.x/screenshots/images/light/tables/columns/width.jpg)

## 分组列

你可以使用 `ColumnGroup` 对象将多个列分组在单个标题下：

```php
use Filament\Tables\Columns\ColumnGroup;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->columns([
            TextColumn::make('title'),
            TextColumn::make('slug'),
            ColumnGroup::make('Visibility', [
                TextColumn::make('status'),
                IconColumn::make('is_featured'),
            ]),
            TextColumn::make('author.name'),
        ]);
}
```

第一个参数是组的标签，第二个参数是属于该组的列对象数组。

![带分组列的表格](/assets/filament/v4.x/screenshots/images/light/tables/columns/grouping.jpg)

你还可以在 `ColumnGroup` 对象上控制组标题的[对齐](#horizontally-aligning-column-content)和[换行](#allowing-column-headers-to-wrap)。为了提高 API 的多行流畅性，你可以将 `columns()` 链式调用到对象上，而不是将其作为第二个参数传递：

```php
use Filament\Support\Enums\Alignment;
use Filament\Tables\Columns\ColumnGroup;

ColumnGroup::make('Website visibility')
    ->columns([
        // ...
    ])
    ->alignCenter()
    ->wrapHeader()
```

## 隐藏列

你可以使用 `hidden()` 或 `visible()` 方法隐藏列：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('email')
    ->hidden()

TextColumn::make('email')
    ->visible()
```

要有条件地隐藏列，你可以向任一方法传递布尔值：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('role')
    ->hidden(FeatureFlag::active())

TextColumn::make('role')
    ->visible(FeatureFlag::active())
```

### 允许用户管理列

#### 切换列可见性

用户可以在表格中自行隐藏或显示列。要使列可切换，请使用 `toggleable()` 方法：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('email')
    ->toggleable()
```

![带列管理器的表格](/assets/filament/v4.x/screenshots/images/light/tables/columns/column-manager.jpg)

##### 使可切换列默认隐藏

默认情况下，可切换列是可见的。要使其默认隐藏：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('id')
    ->toggleable(isToggledHiddenByDefault: true)
```

#### 重新排序列

你可以使用 `reorderableColumns()` 方法允许在表格中重新排序列：

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->columns([
            // ...
        ])
        ->reorderableColumns();
}
```

![带可重新排序列管理器的表格](/assets/filament/v4.x/screenshots/images/light/tables/columns/column-manager-reorderable.jpg)

#### 实时列管理器

默认情况下，列管理器的更改（切换和重新排序列）是延迟的，在用户点击"应用"按钮之前不会影响表格。要禁用此延迟行为并让列管理器的更改立即生效，请使用 `deferColumnManager(false)` 方法：

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->columns([
            // ...
        ])
        ->reorderableColumns()
        ->deferColumnManager(false);
}
```

#### 在模态框中显示列管理器

要在模态框中（而不是在下拉菜单中）渲染列管理器，你可以使用 `columnManagerLayout()` 方法：

```php
use Filament\Tables\Enums\ColumnManagerLayout;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->columns([
            // ...
        ])
        ->columnManagerLayout(ColumnManagerLayout::Modal);
}
```

![模态框中的列管理器](/assets/filament/v4.x/screenshots/images/light/tables/columns/column-manager-modal.jpg)

你可以使用[触发操作 API](#customizing-the-column-manager-trigger-action)来[自定义模态框](../../actions/modals)，包括[使用 `slideOver()`](../../actions/modals#using-a-slide-over-instead-of-a-modal)。

#### 自定义列管理器触发操作

要自定义列管理器触发按钮，你可以使用 `columnManagerTriggerAction()` 方法，传递一个返回操作的闭包。所有可用于[自定义操作触发按钮](../../actions/overview)的方法都可以使用：

```php
use Filament\Actions\Action;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->columns([
            // ...
        ])
        ->columnManagerTriggerAction(
            fn (Action $action) => $action
                ->button()
                ->label('Column Manager'),
        );
}
```

#### 在页脚中显示重置操作

默认情况下，重置操作出现在列管理器的标题中。你可以使用 `columnManagerResetActionPosition()` 方法将其移动到页脚，与应用操作并排：

```php
use Filament\Tables\Enums\ColumnManagerResetActionPosition;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->columns([
            // ...
        ])
        ->columnManagerResetActionPosition(ColumnManagerResetActionPosition::Footer);
}
```

#### 禁用用户会话中的列持久化

默认情况下，Filament 通过将表格列存储在用户会话中来持久化它们。要防止在用户会话中持久化列，请使用 `persistColumnsInSession(false)` 方法：

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->columns([
            // ...
        ])
        ->persistColumnsInSession(false);
}
```

#### 更改列管理器中的显示列数

默认情况下，列管理器以单列显示其选项。你可以使用 `columnManagerColumns()` 方法将其增加到多列：

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->columns([
            // ...
        ])
        ->columnManagerColumns(2);
}
```

![两列列管理器](/assets/filament/v4.x/screenshots/images/light/tables/columns/column-manager-columns.jpg)

## 为列内容添加额外 HTML 属性

你可以通过 `extraAttributes()` 方法向列内容传递额外的 HTML 属性，这些属性将合并到其外部 HTML 元素上。属性应以数组表示，其中键是属性名，值是属性值：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('slug')
    ->extraAttributes(['class' => 'slug-column'])
```

除固定值外，`extraAttributes()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

默认情况下，多次调用 `extraAttributes()` 将覆盖先前的属性。如果你希望合并属性，可以向方法传递 `merge: true`。

### 为单元格添加额外 HTML 属性

你也可以向包围列内容的表格单元格传递额外的 HTML 属性：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('slug')
    ->extraCellAttributes(['class' => 'slug-cell'])
```

除固定值外，`extraCellAttributes()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

默认情况下，多次调用 `extraCellAttributes()` 将覆盖先前的属性。如果你希望合并属性，可以向方法传递 `merge: true`。

### 为标题单元格添加额外属性

你可以向包围列内容的表格标题单元格传递额外的 HTML 属性：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('slug')
    ->extraHeaderAttributes(['class' => 'slug-header-cell'])
```

除固定值外，`extraHeaderAttributes()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

默认情况下，多次调用 `extraHeaderAttributes()` 将覆盖先前的属性。如果你希望合并属性，可以向方法传递 `merge: true`。

## 列实用工具注入

用于配置列的绝大多数方法都接受函数作为参数，而不是硬编码的值：

```php
use App\Models\User;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('email')
    ->placeholder(fn (User $record): string => "No email for {$record->name}")

TextColumn::make('role')
    ->badge(fn (User $record): bool => $record->role === 'admin')

TextColumn::make('name')
    ->extraAttributes(fn (User $record): array => ['class' => "{$record->getKey()}-name-column"])
```

仅此一点就解锁了许多自定义可能性。

该包还能够在这些函数中注入许多实用工具作为参数。所有接受函数作为参数的自定义方法都可以注入实用工具。

这些注入的实用工具需要使用特定的参数名称。否则，Filament 不知道要注入什么。

### 注入列的当前状态

如果你想访问列的当前[值（状态）](#column-content-state)，请定义 `$state` 参数：

```php
function ($state) {
    // ...
}
```

### 注入当前 Eloquent 记录

你可以使用 `$record` 参数检索当前模式的 Eloquent 记录：

```php
use Illuminate\Database\Eloquent\Model;

function (?Model $record) {
    // ...
}
```

### 注入行循环

要访问当前表格行的[行循环](https://laravel.com/docs/blade#the-loop-variable)对象，请定义 `$rowLoop` 参数：

```php
function (stdClass $rowLoop) {
    // ...
}
```

### 注入当前 Livewire 组件实例

如果你想访问当前 Livewire 组件实例，请定义 `$livewire` 参数：

```php
use Livewire\Component;

function (Component $livewire) {
    // ...
}
```

### 注入当前列实例

如果你想访问当前组件实例，请定义 `$component` 参数：

```php
use Filament\Tables\Columns\Column;

function (Column $component) {
    // ...
}
```

### 注入当前表格实例

如果你想访问当前表格实例，请定义 `$table` 参数：

```php
use Filament\Tables\Table;

function (Table $table) {
    // ...
}
```

### 注入多个实用工具

参数使用反射动态注入，因此你可以按任意顺序组合多个参数：

```php
use App\Models\User;
use Livewire\Component as Livewire;

function (Livewire $livewire, mixed $state, User $record) {
    // ...
}
```

### 从 Laravel 容器注入依赖

你可以像正常一样从 Laravel 容器注入任何内容，与实用工具一起：

```php
use App\Models\User;
use Illuminate\Http\Request;

function (Request $request, User $record) {
    // ...
}
```

## 全局设置

如果你想全局更改所有列的默认行为，可以在服务提供者的 `boot()` 方法中调用静态 `configureUsing()`方法，传递一个闭包来修改列。例如，如果你想使所有 `TextColumn` 列都可 [`toggleable()`](#toggling-column-visibility)，可以这样做：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::configureUsing(function (TextColumn $column): void {
    $column->toggleable();
});
```

当然，你仍然可以在每列上单独覆盖：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('name')
    ->toggleable(false)
```
