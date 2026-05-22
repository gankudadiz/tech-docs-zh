---
title: 测试表格
---

## 测试表格能否渲染

要确保表格组件能够渲染，请使用 `assertSuccessful()` Livewire 助手：

```php
use function Pest\Livewire\livewire;

it('can render page', function () {
    livewire(ListPosts::class)
        ->assertSuccessful();
});
```

要测试显示了哪些记录，你可以使用 `assertCanSeeTableRecords()`、`assertCanNotSeeTableRecords()` 和 `assertCountTableRecords()`：

```php
use function Pest\Livewire\livewire;

it('cannot display trashed posts by default', function () {
    $posts = Post::factory()->count(4)->create();
    $trashedPosts = Post::factory()->trashed()->count(6)->create();

    livewire(PostResource\Pages\ListPosts::class)
        ->assertCanSeeTableRecords($posts)
        ->assertCanNotSeeTableRecords($trashedPosts)
        ->assertCountTableRecords(4);
});
```

> 如果你的表格使用了分页，`assertCanSeeTableRecords()` 将只检查第一页的记录。要切换页面，请调用 `call('gotoPage', 2)`。

> 如果你的表格使用了 `deferLoading()`，你应该在 `assertCanSeeTableRecords()` 之前调用 `loadTable()`。

## 测试列

要确保某个列已渲染，请将列名传递给 `assertCanRenderTableColumn()`：

```php
use function Pest\Livewire\livewire;

it('can render post titles', function () {
    Post::factory()->count(10)->create();

    livewire(PostResource\Pages\ListPosts::class)
        ->assertCanRenderTableColumn('title');
});
```

此助手将获取该列的 HTML，并检查它是否存在于表格中。

要测试某个列未渲染，你可以使用 `assertCanNotRenderTableColumn()`：

```php
use function Pest\Livewire\livewire;

it('can not render post comments', function () {
    Post::factory()->count(10)->create()

    livewire(PostResource\Pages\ListPosts::class)
        ->assertCanNotRenderTableColumn('comments');
});
```

此助手将断言该列的 HTML 默认不在当前表格中显示。

### 测试列是否可搜索

要搜索表格，请使用搜索查询调用 `searchTable()` 方法。

然后你可以使用 `assertCanSeeTableRecords()` 检查过滤后的表格记录，并使用 `assertCanNotSeeTableRecords()` 断言某些记录不再显示在表格中：

```php
use function Pest\Livewire\livewire;

it('can search posts by title', function () {
    $posts = Post::factory()->count(10)->create();

    $title = $posts->first()->title;

    livewire(PostResource\Pages\ListPosts::class)
        ->searchTable($title)
        ->assertCanSeeTableRecords($posts->where('title', $title))
        ->assertCanNotSeeTableRecords($posts->where('title', '!=', $title));
});
```

要搜索单个列，你可以将搜索数组传递给 `searchTableColumns()`：

```php
use function Pest\Livewire\livewire;

it('can search posts by title column', function () {
    $posts = Post::factory()->count(10)->create();

    $title = $posts->first()->title;

    livewire(PostResource\Pages\ListPosts::class)
        ->searchTableColumns(['title' => $title])
        ->assertCanSeeTableRecords($posts->where('title', $title))
        ->assertCanNotSeeTableRecords($posts->where('title', '!=', $title));
});
```

### 测试列是否可排序

要对表格记录进行排序，你可以调用 `sortTable()`，传入要排序的列名。你可以在 `sortTable()` 的第二个参数中使用 `'desc'` 来反转排序方向。

表格排序后，你可以使用 `assertCanSeeTableRecords()` 配合 `inOrder` 参数来确保表格记录按顺序渲染：

```php
use function Pest\Livewire\livewire;

it('can sort posts by title', function () {
    Post::factory()->count(10)->create();

    $sortedPostsAsc = Post::query()->orderBy('title')->get();
    $sortedPostsDesc = Post::query()->orderBy('title', 'desc')->get();

    livewire(PostResource\Pages\ListPosts::class)
        ->sortTable('title')
        ->assertCanSeeTableRecords($sortedPostsAsc, inOrder: true)
        ->sortTable('title', 'desc')
        ->assertCanSeeTableRecords($sortedPostsDesc, inOrder: true);
});
```

:::info
Filament 表格使用 SQL `order` 语句在输出之前对记录进行排序。不同的数据库驱动可能使用不同的排序策略，它们可能与 PHP 自身的排序策略不同，因此你应该确保测试记录使用数据库查询的 `orderBy()` 进行排序，而不是使用模型集合的 `sortBy()`。
:::

### 测试列的状态

要断言某个列对于某条记录有或没有某个状态，你可以使用 `assertTableColumnStateSet()` 和 `assertTableColumnStateNotSet()`：

```php
use function Pest\Livewire\livewire;

it('can get post author names', function () {
    $posts = Post::factory()->count(10)->create();

    $post = $posts->first();

    livewire(PostResource\Pages\ListPosts::class)
        ->assertTableColumnStateSet('author.name', $post->author->name, record: $post)
        ->assertTableColumnStateNotSet('author.name', 'Anonymous', record: $post);
});
```

要断言某个列对于某条记录有或没有格式化后的状态，你可以使用 `assertTableColumnFormattedStateSet()` 和 `assertTableColumnFormattedStateNotSet()`：

```php
use function Pest\Livewire\livewire;

it('can get post author names', function () {
    $post = Post::factory(['name' => 'John Smith'])->create();

    livewire(PostResource\Pages\ListPosts::class)
        ->assertTableColumnFormattedStateSet('author.name', 'Smith, John', record: $post)
        ->assertTableColumnFormattedStateNotSet('author.name', $post->author->name, record: $post);
});
```

### 测试列的存在性

要确保某个列存在，你可以使用 `assertTableColumnExists()` 方法：

```php
use function Pest\Livewire\livewire;

it('has an author column', function () {
    livewire(PostResource\Pages\ListPosts::class)
        ->assertTableColumnExists('author');
});
```

你可以传递一个函数作为额外参数，以断言列通过了给定的"真值测试"。这对于断言列具有特定配置非常有用。你还可以传入记录作为第三个参数，如果你的检查依赖于正在渲染的表格行，这将非常有用：

```php
use function Pest\Livewire\livewire;
use Filament\Tables\Columns\TextColumn;

it('has an author column', function () {
    $post = Post::factory()->create();
    
    livewire(PostResource\Pages\ListPosts::class)
        ->assertTableColumnExists('author', function (TextColumn $column): bool {
            return $column->getDescriptionBelow() === $post->subtitle;
        }, $post);
});
```

### 测试列的可见性

要确保某个用户看不到某个列，你可以使用 `assertTableColumnVisible()` 和 `assertTableColumnHidden()` 方法：

```php
use function Pest\Livewire\livewire;

it('shows the correct columns', function () {
    livewire(PostResource\Pages\ListPosts::class)
        ->assertTableColumnVisible('created_at')
        ->assertTableColumnHidden('author');
});
```

### 测试列的描述

要确保某个列在上方或下方有正确的描述，你可以使用 `assertTableColumnHasDescription()` 和 `assertTableColumnDoesNotHaveDescription()` 方法：

```php
use function Pest\Livewire\livewire;

it('has the correct descriptions above and below author', function () {
    $post = Post::factory()->create();

    livewire(PostsTable::class)
        ->assertTableColumnHasDescription('author', 'Author! ↓↓↓', $post, 'above')
        ->assertTableColumnHasDescription('author', 'Author! ↑↑↑', $post)
        ->assertTableColumnDoesNotHaveDescription('author', 'Author! ↑↑↑', $post, 'above')
        ->assertTableColumnDoesNotHaveDescription('author', 'Author! ↓↓↓', $post);
});
```

### 测试列的额外属性

要确保某个列具有正确的额外属性，你可以使用 `assertTableColumnHasExtraAttributes()` 和 `assertTableColumnDoesNotHaveExtraAttributes()` 方法：

```php
use function Pest\Livewire\livewire;

it('displays author in red', function () {
    $post = Post::factory()->create();

    livewire(PostsTable::class)
        ->assertTableColumnHasExtraAttributes('author', ['class' => 'text-danger-500'], $post)
        ->assertTableColumnDoesNotHaveExtraAttributes('author', ['class' => 'text-primary-500'], $post);
});
```

### 测试 `SelectColumn` 中的选项

如果你有一个选择列，你可以使用 `assertTableSelectColumnHasOptions()` 和 `assertTableSelectColumnDoesNotHaveOptions()` 来确保它具有正确的选项：

```php
use function Pest\Livewire\livewire;

it('has the correct statuses', function () {
    $post = Post::factory()->create();

    livewire(PostsTable::class)
        ->assertTableSelectColumnHasOptions('status', ['unpublished' => 'Unpublished', 'published' => 'Published'], $post)
        ->assertTableSelectColumnDoesNotHaveOptions('status', ['archived' => 'Archived'], $post);
});
```

## 测试过滤器

要过滤表格记录，你可以使用 `filterTable()` 方法，配合 `assertCanSeeTableRecords()` 和 `assertCanNotSeeTableRecords()`：

```php
use function Pest\Livewire\livewire;

it('can filter posts by `is_published`', function () {
    $posts = Post::factory()->count(10)->create();

    livewire(PostResource\Pages\ListPosts::class)
        ->assertCanSeeTableRecords($posts)
        ->filterTable('is_published')
        ->assertCanSeeTableRecords($posts->where('is_published', true))
        ->assertCanNotSeeTableRecords($posts->where('is_published', false));
});
```

对于简单过滤器，这只是启用过滤器。

如果你想设置 `SelectFilter` 或 `TernaryFilter` 的值，请将值作为第二个参数传入：

```php
use function Pest\Livewire\livewire;

it('can filter posts by `author_id`', function () {
    $posts = Post::factory()->count(10)->create();

    $authorId = $posts->first()->author_id;

    livewire(PostResource\Pages\ListPosts::class)
        ->assertCanSeeTableRecords($posts)
        ->filterTable('author_id', $authorId)
        ->assertCanSeeTableRecords($posts->where('author_id', $authorId))
        ->assertCanNotSeeTableRecords($posts->where('author_id', '!=', $authorId));
});
```

### 在测试中重置过滤器

要将所有过滤器重置为原始状态，请调用 `resetTableFilters()`：

```php
use function Pest\Livewire\livewire;

it('can reset table filters', function () {
    $posts = Post::factory()->count(10)->create();

    livewire(PostResource\Pages\ListPosts::class)
        ->resetTableFilters();
});
```

### 在测试中移除过滤器

要移除单个过滤器，你可以使用 `removeTableFilter()`：

```php
use function Pest\Livewire\livewire;

it('filters list by published', function () {
    $posts = Post::factory()->count(10)->create();

    $unpublishedPosts = $posts->where('is_published', false)->get();

    livewire(PostsTable::class)
        ->filterTable('is_published')
        ->assertCanNotSeeTableRecords($unpublishedPosts)
        ->removeTableFilter('is_published')
        ->assertCanSeeTableRecords($posts);
});
```

要移除所有过滤器，你可以使用 `removeTableFilters()`：

```php
use function Pest\Livewire\livewire;

it('can remove all table filters', function () {
    $posts = Post::factory()->count(10)->forAuthor()->create();

    $unpublishedPosts = $posts
        ->where('is_published', false)
        ->where('author_id', $posts->first()->author->getKey());

    livewire(PostsTable::class)
        ->filterTable('is_published')
        ->filterTable('author', $author)
        ->assertCanNotSeeTableRecords($unpublishedPosts)
        ->removeTableFilters()
        ->assertCanSeeTableRecords($posts);
});
```

### 测试过滤器的可见性

要确保某个用户看不到某个过滤器，你可以使用 `assertTableFilterVisible()` 和 `assertTableFilterHidden()` 方法：

```php
use function Pest\Livewire\livewire;

it('shows the correct filters', function () {
    livewire(PostsTable::class)
        ->assertTableFilterVisible('created_at')
        ->assertTableFilterHidden('author');
});
```

### 测试过滤器的存在性

要确保某个过滤器存在，你可以使用 `assertTableFilterExists()` 方法：

```php
use function Pest\Livewire\livewire;

it('has an author filter', function () {
    livewire(PostResource\Pages\ListPosts::class)
        ->assertTableFilterExists('author');
});
```

你可以传递一个函数作为额外参数，以断言过滤器通过了给定的"真值测试"。这对于断言过滤器具有特定配置非常有用：

```php
use function Pest\Livewire\livewire;
use Filament\Tables\Filters\SelectFilter;

it('has an author filter', function () {
    livewire(PostResource\Pages\ListPosts::class)
        ->assertTableFilterExists('author', function (SelectFilter $column): bool {
            return $column->getLabel() === 'Select author';
        });
});
```

## 测试汇总

要测试汇总计算是否正常工作，你可以使用 `assertTableColumnSummarySet()` 方法：

```php
use function Pest\Livewire\livewire;

it('can average values in a column', function () {
    $posts = Post::factory()->count(10)->create();

    livewire(PostResource\Pages\ListPosts::class)
        ->assertCanSeeTableRecords($posts)
        ->assertTableColumnSummarySet('rating', 'average', $posts->avg('rating'));
});
```

第一个参数是列名，第二个是汇总器 ID，第三个是期望值。

请注意，期望值和实际值会被规范化，因此 `123.12` 被视为与 `"123.12"` 相同，`['Fred', 'Jim']` 与 `['Jim', 'Fred']` 相同。

你可以通过将其传递给 `make()` 方法来设置汇总器 ID：

```php
use Filament\Tables\Columns\Summarizers\Average;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('rating')
    ->summarize(Average::make('average'))
```

该 ID 在该列的汇总器之间应该是唯一的。

### 仅测试单个分页页面的汇总

要仅计算单个分页页面的平均值，请使用 `isCurrentPaginationPageOnly` 参数：

```php
use function Pest\Livewire\livewire;

it('can average values in a column', function () {
    $posts = Post::factory()->count(20)->create();

    livewire(PostResource\Pages\ListPosts::class)
        ->assertCanSeeTableRecords($posts->take(10))
        ->assertTableColumnSummarySet('rating', 'average', $posts->take(10)->avg('rating'), isCurrentPaginationPageOnly: true);
});
```

### 测试范围汇总器

要测试范围，请将最小值和最大值传入元组样式的 `[$minimum, $maximum]` 数组：

```php
use function Pest\Livewire\livewire;

it('can average values in a column', function () {
    $posts = Post::factory()->count(10)->create();

    livewire(PostResource\Pages\ListPosts::class)
        ->assertCanSeeTableRecords($posts)
        ->assertTableColumnSummarySet('rating', 'range', [$posts->min('rating'), $posts->max('rating')]);
});
```

## 测试可切换列

默认情况下，只有在表格中默认切换为开启的列才会被渲染和可测试。你可以使用 `toggleAllTableColumns()` 开启表格中的所有列：

```php
use function Pest\Livewire\livewire;

it('can toggle all columns', function () {
    livewire(PostResource\Pages\ListPosts::class)
        ->toggleAllTableColumns();
});
```

你也可以使用 `toggleAllTableColumns(false)` 关闭所有列：

```php
use function Pest\Livewire\livewire;

it('can toggle all columns off', function () {
    livewire(PostResource\Pages\ListPosts::class)
        ->toggleAllTableColumns(false);
});
```
