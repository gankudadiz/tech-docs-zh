---
title: 表格
---

## 简介

表格是 Web 应用中用于展示记录列表的常见 UI 模式。Filament 提供了一套基于 PHP 的 API 来定义表格，支持丰富的功能，同时具有极高的可定制性。

![表格示例](/assets/filament/v4.x/screenshots/images/light/tables/example.jpg)

### 定义表格列

任何表格的基础都是行和列。Filament 使用 Eloquent 来获取表格中各行的数据，而你负责定义该行中使用的列。

Filament 内置了许多预设的列类型，你可以在[这里查看完整列表](../columns/overview)。你甚至可以[创建自定义列类型](columns/custom-columns)，以任何你需要的方式展示数据。

列以数组形式存储在 `$table->columns()` 方法中：

```php
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->columns([
            TextColumn::make('title'),
            TextColumn::make('slug'),
            IconColumn::make('is_featured')
                ->boolean(),
        ]);
}
```

![带列的表格](/assets/filament/v4.x/screenshots/images/light/tables/overview/columns.jpg)

在这个示例中，表格有 3 列。前两列展示[文本](columns/text)——每行的标题和 slug。第三列展示一个[图标](columns/icon)，根据该行是否为精选内容显示绿色勾选或红色叉号。

#### 使列可排序和可搜索

你可以通过链式调用方法来轻松修改列。例如，你可以使用 `searchable()` 方法使列[可搜索](columns/overview#搜索)。现在，表格中将出现一个搜索字段，你可以通过该列的值来筛选行：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('title')
    ->searchable()
```

![带可搜索列的表格](/assets/filament/v4.x/screenshots/images/light/tables/overview/searchable-columns.jpg)

你可以让多列可搜索，Filament 将能够同时在所有可搜索列中进行匹配搜索。

你还可以使用 `sortable()` 方法使列[可排序](columns/overview#排序)。这将在列标题上添加一个排序按钮，点击它将按该列对表格进行排序：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('title')
    ->sortable()
```

![带可排序列的表格](/assets/filament/v4.x/screenshots/images/light/tables/overview/sortable-columns.jpg)

#### 从列中访问关联数据

你还可以在列中展示属于关联关系的数据。例如，如果你有一个 `Post` 模型属于一个 `User` 模型（文章的作者），你可以在表格中显示该用户的名称：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('author.name')
```

![带关联列的表格](/assets/filament/v4.x/screenshots/images/light/tables/overview/relationship-columns.jpg)

在这种情况下，Filament 会在 `Post` 模型上查找 `author` 关联，然后显示该关联的 `name` 属性。我们称之为"点表示法"，你可以用它来显示任何关联的任何属性，甚至嵌套关联。Filament 使用这种点表示法来为你预加载该关联的结果。

有关列关联的更多信息，请访问[关联关系章节](columns/overview#显示关联关系中的数据)。

#### 在现有列旁边添加新列

虽然 `columns()` 方法会重新定义表格的所有列，但有时你可能想在不完全覆盖的情况下向现有配置添加列。当你有需要在多个表格中出现的全局列配置时，这尤其有用。

Filament 提供了 `pushColumns()` 方法来实现这一目的。与替换整个列配置的 `columns()` 不同，`pushColumns()` 会将新列追加到任何现有列之后。

当与服务提供者（如 `AppServiceProvider`）的 `boot()` 方法中的[全局表格设置](#全局设置)结合使用时，这尤其强大：

```php
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

Table::configureUsing(function (Table $table) {
    $table
        ->pushColumns([
            TextColumn::make('created_at')
                ->label('Created')
                ->sortable()
                ->toggleable(isToggledHiddenByDefault: true),

            TextColumn::make('updated_at')
                ->label('Updated')
                ->sortable()
                ->toggleable(isToggledHiddenByDefault: true),
        ]);
});
```

### 定义表格过滤器

除了使列可 `searchable()`（允许用户通过搜索列内容来筛选表格）之外，你还可以允许用户以其他方式筛选表格中的行。[过滤器](../filters/overview)可以在 `$table->filters()` 方法中定义：

```php
use Filament\Tables\Filters\Filter;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

public function table(Table $table): Table
{
    return $table
        ->columns([
            // ...
        ])
        ->filters([
            Filter::make('is_featured')
                ->query(fn (Builder $query) => $query->where('is_featured', true)),
            SelectFilter::make('status')
                ->options([
                    'draft' => 'Draft',
                    'reviewing' => 'Reviewing',
                    'published' => 'Published',
                ]),
        ]);
}
```

![带过滤器的表格](/assets/filament/v4.x/screenshots/images/light/tables/overview/filters.jpg)

在这个示例中，我们定义了 2 个表格过滤器。在表格上，现在角落有一个"过滤器"图标按钮。点击它将打开一个下拉菜单，显示我们定义的 2 个过滤器。

第一个过滤器渲染为复选框。勾选时，表格中只显示精选行。取消勾选时，将显示所有行。

第二个过滤器渲染为选择下拉框。当用户选择一个选项时，只显示具有该状态的行。未选择任何选项时，将显示所有行。

你可以使用任何[模式组件](../schemas/overview)来构建过滤器的 UI。例如，你可以创建[自定义日期范围过滤器](filters/custom)。

### 定义表格操作

Filament 的表格可以使用[操作](../actions/overview)。它们是可以添加到[任何表格行末尾](actions/overview#记录操作)的按钮，甚至可以放在表格的[标题](actions/overview#头部操作)中。例如，你可能希望在标题中有一个"创建"新记录的操作，然后在每一行上有"编辑"和"删除"操作。[批量操作](actions/overview#批量操作)可以在选中表格中的记录时执行代码。

```php
use App\Models\Post;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;

public function table(Table $table): Table
{
    return $table
        ->columns([
            // ...
        ])
        ->recordActions([
            Action::make('feature')
                ->action(function (Post $record) {
                    $record->is_featured = true;
                    $record->save();
                })
                ->hidden(fn (Post $record): bool => $record->is_featured),
            Action::make('unfeature')
                ->action(function (Post $record) {
                    $record->is_featured = false;
                    $record->save();
                })
                ->visible(fn (Post $record): bool => $record->is_featured),
        ])
        ->toolbarActions([
            BulkActionGroup::make([
                DeleteBulkAction::make(),
            ]),
        ]);
}
```

![带操作的表格](/assets/filament/v4.x/screenshots/images/light/tables/overview/actions.jpg)

在这个示例中，我们为表格行定义了 2 个操作。第一个是"精选"操作。点击时，它会将记录的 `is_featured` 属性设置为 `true`——这写在 `action()` 方法中。使用 `hidden()` 方法，如果记录已经是精选的，该操作将被隐藏。第二个是"取消精选"操作。点击时，它会将记录的 `is_featured` 属性设置为 `false`。使用 `visible()` 方法，如果记录不是精选的，该操作将被隐藏。

我们还定义了一个批量操作。定义批量操作时，表格中的每一行都会有一个复选框。这个批量操作是 [Filament 内置的](../actions/delete#提高批量删除操作的性能)，它将删除所有选中的记录。不过，你也可以轻松地[编写自定义批量操作](actions/overview#批量操作)。

![打开操作模态框的表格](/assets/filament/v4.x/screenshots/images/light/tables/overview/actions-modal.jpg)

操作还可以打开模态框来请求用户确认，以及在其中渲染表单来收集额外数据。建议阅读[操作文档](../actions/overview)以了解它们在 Filament 中的广泛功能。

## 分页

默认情况下，Filament 表格会进行分页。用户可以选择每页显示 5、10、25 和 50 条记录。如果记录数超过所选数量，用户可以使用分页按钮在页面之间导航。

![默认分页的表格](/assets/filament/v4.x/screenshots/images/light/tables/pagination/default.jpg)

### 自定义分页选项

你可以通过将选项传递给 `paginated()` 方法来自定义每页显示记录数的选项：

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->paginated([10, 25, 50, 100, 'all']);
}
```

:::warning
使用非常大的数字和 `all` 时要注意，因为大量记录可能会导致性能问题。
:::

### 自定义默认分页页面选项

要自定义默认显示的记录数，请使用 `defaultPaginationPageOption()` 方法：

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->defaultPaginationPageOption(25);
}
```

:::info
确保默认分页页面选项包含在[分页选项](#自定义分页选项)中。
:::

### 显示首页和末页的分页链接

要添加指向首页和末页的分页链接，可以使用 `extremePaginationLinks()` 方法：

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->extremePaginationLinks();
}
```

![带首尾分页链接的表格](/assets/filament/v4.x/screenshots/images/light/tables/pagination/extreme.jpg)

### 使用简单分页

你可以使用 `paginationMode(PaginationMode::Simple)` 方法来使用简单分页：

```php
use Filament\Tables\Enums\PaginationMode;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->paginationMode(PaginationMode::Simple);
}
```

![简单分页的表格](/assets/filament/v4.x/screenshots/images/light/tables/pagination/simple.jpg)

### 使用游标分页

你可以使用 `paginationMode(PaginationMode::Cursor)` 方法来使用游标分页：

```php
use Filament\Tables\Enums\PaginationMode;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->paginationMode(PaginationMode::Cursor);
}
```

![游标分页的表格](/assets/filament/v4.x/screenshots/images/light/tables/pagination/cursor.jpg)

### 防止分页页面的查询字符串冲突

默认情况下，Livewire 将分页状态存储在 URL 查询字符串的 `page` 参数中。如果同一页面上有多个表格，这意味着一个表格的分页状态可能会被另一个表格的状态覆盖。

要解决此问题，你可以定义 `$table->queryStringIdentifier()`，为该表格返回一个唯一的查询字符串标识符：

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->queryStringIdentifier('users');
}
```

### 禁用分页

默认情况下，表格会进行分页。要禁用此功能，应使用 `$table->paginated(false)` 方法：

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->paginated(false);
}
```

## 记录 URL（可点击行）

你可以使用 `$table->recordUrl()` 方法使表格行完全可点击：

```php
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Model;

public function table(Table $table): Table
{
    return $table
        ->recordUrl(
            fn (Model $record): string => route('posts.edit', ['record' => $record]),
        );
}
```

使用[资源](../resources/overview)表格时，每行的 URL 通常已经为你设置好了，但可以调用此方法来覆盖每行的默认 URL。

:::tip
你还可以为特定列[覆盖 URL](columns/overview#打开-url)，或在点击列时[触发操作](columns/overview#触发操作)。
:::

你也可以在新标签页中打开 URL：

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->openRecordUrlInNewTab();
}
```

## 重新排序记录

要允许用户在表格中使用拖放来重新排序记录，你可以使用 `$table->reorderable()` 方法：

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->reorderable('sort');
}
```

此示例中的 `sort` 数据库列将用于存储表格中记录的顺序。每当使用该列对数据库查询进行排序时，记录将按定义的顺序返回。如果你在模型上使用了批量赋值保护，还需要将 `sort` 属性添加到 `$fillable` 数组中。

使表格可重新排序时，表格上将出现一个新按钮来切换重新排序功能。

![可重新排序行的表格](/assets/filament/v4.x/screenshots/images/light/tables/reordering.jpg)

`reorderable()` 方法接受一个列名作为参数，用于存储记录顺序。如果你使用类似 [`spatie/eloquent-sortable`](https://github.com/spatie/eloquent-sortable) 的包并使用 `order_column` 等排序列，可以改为使用：

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->reorderable('order_column');
}
```

`reorderable()` 方法还接受一个布尔条件作为第二个参数，允许你有条件地启用重新排序：

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->reorderable('sort', auth()->user()->isAdmin());
}
```

你可以传递 `direction` 参数为 `desc` 来按降序而非升序重新排序记录：

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->reorderable('sort', direction: 'desc');
}
```

### 在重新排序时启用分页

在重新排序模式下，分页将被禁用，以便你可以在页面之间移动记录。在重新排序时使用分页通常是不好的体验，但如果你想覆盖此行为，请使用 `$table->paginatedWhileReordering()`：

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->paginatedWhileReordering();
}
```

### 自定义重新排序触发操作

要自定义重新排序触发按钮，你可以使用 `reorderRecordsTriggerAction()` 方法，传递一个返回操作的闭包。所有可用于[自定义操作触发按钮](../actions/overview)的方法都可以使用：

```php
use Filament\Actions\Action;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->reorderRecordsTriggerAction(
            fn (Action $action, bool $isReordering) => $action
                ->button()
                ->label($isReordering ? 'Disable reordering' : 'Enable reordering'),
        );
}
```

![带可重新排序行和自定义触发操作的表格](/assets/filament/v4.x/screenshots/images/light/tables/reordering/custom-trigger-action.jpg)

### 在重新排序前后运行代码

你可以使用 `beforeReordering()` 和 `afterReordering()` 方法在记录重新排序前后运行代码。这两个方法都接受一个接收新 `$order` 记录键数组的函数：

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->reorderable('sort')
        ->beforeReordering(function (array $order): void {
            // 在数据库中重新排序记录之前运行。
        })
        ->afterReordering(function (array $order): void {
            // 在数据库中重新排序记录之后运行。
        });
}
```

## 自定义表格标题

你可以使用 `$table->heading()` 方法为表格添加标题：

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->heading('Clients')
        ->columns([
            // ...
        ]);
```

你还可以使用 `$table->description()` 方法在标题下方添加描述：

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->heading('Clients')
        ->description('Manage your clients here.')
        ->columns([
            // ...
        ]);
```

![带标题和描述的表格](/assets/filament/v4.x/screenshots/images/light/tables/heading.jpg)

你可以将视图传递给 `$table->header()` 方法来自定义整个标题 HTML：

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->header(view('tables.header', [
            'heading' => 'Clients',
        ]))
        ->columns([
            // ...
        ]);
```

## 轮询表格内容

你可以使用 `$table->poll()` 方法轮询表格内容，使其按设定的时间间隔刷新：

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->poll('10s');
}
```

## 延迟加载

包含大量数据的表格可能需要一段时间才能加载，在这种情况下，你可以使用 `deferLoading()` 方法异步加载表格数据：

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->deferLoading();
}
```

## 使用 Laravel Scout 搜索记录

虽然 Filament 不直接集成 [Laravel Scout](https://laravel.com/docs/scout)，但你可以使用 `searchUsing()` 方法配合 `whereKey()` 子句来筛选 Scout 结果的查询：

```php
use App\Models\Post;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

public function table(Table $table): Table
{
    return $table
        ->searchUsing(fn (Builder $query, string $search) => $query->whereKey(Post::search($search)->keys()));
```

在正常情况下，Scout 内部使用 `whereKey()`（`whereIn()`）方法来检索结果，因此使用它不会带来性能损失。

要显示全局搜索输入框，表格中至少需要有一列是 `searchable()` 的。或者，如果你已经在使用 Scout 来控制哪些列可搜索，你可以简单地将 `searchable()` 传递给整个表格：

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->searchable();
}
```

## 设置表格行样式

### 条纹表格行

要启用条纹表格行，你可以使用 `striped()` 方法：

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->striped();
}
```

![带条纹行的表格](/assets/filament/v4.x/screenshots/images/light/tables/striped.jpg)

### 自定义行类

你可能想根据记录数据有条件地设置行样式。这可以通过使用 `$table->recordClasses()` 方法指定要应用于行的字符串或 CSS 类数组来实现：

```php
use App\Models\Post;
use Closure;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Model;

public function table(Table $table): Table
{
    return $table
        ->recordClasses(fn (Post $record) => match ($record->status) {
            'draft' => 'draft-post-table-row',
            'reviewing' => 'reviewing-post-table-row',
            'published' => 'published-post-table-row',
            default => null,
        });
}
```

![带自定义行类的表格](/assets/filament/v4.x/screenshots/images/light/tables/custom-row-classes.jpg)

## 全局设置

要自定义所有表格使用的默认配置，你可以在服务提供者的 `boot()` 方法中调用静态 `configureUsing()` 方法。该函数将为每个创建的表格运行：

```php
use Filament\Tables\Enums\FiltersLayout;
use Filament\Tables\Table;

Table::configureUsing(function (Table $table): void {
    $table
        ->reorderableColumns()
        ->filtersLayout(FiltersLayout::AboveContentCollapsible)
        ->paginationPageOptions([10, 25, 50]);
});
```
