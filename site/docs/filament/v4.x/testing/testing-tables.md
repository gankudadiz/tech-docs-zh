---
title: 测试表格
---

## 测试表格能否渲染

要确保表格组件能够渲染，请使用 `assertSuccessful()` Livewire 助手：

```php
use function Pest\Livewire\livewire;

it('can render page', function () {
    // 使用 Pest 的 Livewire 测试助手，模拟渲染 ListPosts 组件
    livewire(ListPosts::class)
        // 断言组件能够成功渲染（HTTP 状态码为 200，无异常抛出）
        ->assertSuccessful();
});
```

要测试显示了哪些记录，你可以使用 `assertCanSeeTableRecords()`、`assertCanNotSeeTableRecords()` 和 `assertCountTableRecords()`：

```php
use function Pest\Livewire\livewire;

it('cannot display trashed posts by default', function () {
    // 创建 4 篇正常状态的文章
    $posts = Post::factory()->count(4)->create();
    // 创建 6 篇已软删除（trashed）的文章
    $trashedPosts = Post::factory()->trashed()->count(6)->create();

    livewire(PostResource\Pages\ListPosts::class)
        // 断言表格中能够看到这 4 篇正常文章
        ->assertCanSeeTableRecords($posts)
        // 断言表格中看不到已软删除的 6 篇文章（默认不显示回收站记录）
        ->assertCanNotSeeTableRecords($trashedPosts)
        // 断言表格中总共只显示 4 条记录
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
    // 创建 10 篇文章，确保表格有数据可渲染
    Post::factory()->count(10)->create();

    livewire(PostResource\Pages\ListPosts::class)
        // 断言 'title' 列能够成功渲染（HTML 存在于表格中）
        ->assertCanRenderTableColumn('title');
});
```

此助手将获取该列的 HTML，并检查它是否存在于表格中。

要测试某个列未渲染，你可以使用 `assertCanNotRenderTableColumn()`：

```php
use function Pest\Livewire\livewire;

it('can not render post comments', function () {
    // 创建 10 篇文章作为测试数据
    Post::factory()->count(10)->create()

    livewire(PostResource\Pages\ListPosts::class)
        // 断言 'comments' 列默认不渲染（HTML 不在表格中显示）
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
    // 创建 10 篇文章作为测试数据
    $posts = Post::factory()->count(10)->create();

    // 取第一篇文章的标题作为搜索关键词
    $title = $posts->first()->title;

    livewire(PostResource\Pages\ListPosts::class)
        // 使用全局搜索功能，传入搜索关键词
        ->searchTable($title)
        // 断言搜索后能看到标题匹配的文章
        ->assertCanSeeTableRecords($posts->where('title', $title))
        // 断言搜索后看不到标题不匹配的文章
        ->assertCanNotSeeTableRecords($posts->where('title', '!=', $title));
});
```

要搜索单个列，你可以将搜索数组传递给 `searchTableColumns()`：

```php
use function Pest\Livewire\livewire;

it('can search posts by title column', function () {
    // 创建 10 篇文章作为测试数据
    $posts = Post::factory()->count(10)->create();

    // 取第一篇文章的标题作为搜索关键词
    $title = $posts->first()->title;

    livewire(PostResource\Pages\ListPosts::class)
        // 使用列搜索功能，指定只在 'title' 列中搜索（传入列名 => 搜索值的关联数组）
        ->searchTableColumns(['title' => $title])
        // 断言搜索后能看到标题匹配的文章
        ->assertCanSeeTableRecords($posts->where('title', $title))
        // 断言搜索后看不到标题不匹配的文章
        ->assertCanNotSeeTableRecords($posts->where('title', '!=', $title));
});
```

### 测试列是否可排序

要对表格记录进行排序，你可以调用 `sortTable()`，传入要排序的列名。你可以在 `sortTable()` 的第二个参数中使用 `'desc'` 来反转排序方向。

表格排序后，你可以使用 `assertCanSeeTableRecords()` 配合 `inOrder` 参数来确保表格记录按顺序渲染：

```php
use function Pest\Livewire\livewire;

it('can sort posts by title', function () {
    // 创建 10 篇文章作为测试数据
    Post::factory()->count(10)->create();

    // 使用数据库查询获取按标题升序排列的文章（与 SQL 排序策略一致）
    $sortedPostsAsc = Post::query()->orderBy('title')->get();
    // 使用数据库查询获取按标题降序排列的文章
    $sortedPostsDesc = Post::query()->orderBy('title', 'desc')->get();

    livewire(PostResource\Pages\ListPosts::class)
        // 按 'title' 列升序排序（默认方向）
        ->sortTable('title')
        // 断言表格中的记录按升序排列，inOrder: true 表示严格按顺序检查
        ->assertCanSeeTableRecords($sortedPostsAsc, inOrder: true)
        // 按 'title' 列降序排序
        ->sortTable('title', 'desc')
        // 断言表格中的记录按降序排列
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
    // 创建 10 篇文章作为测试数据
    $posts = Post::factory()->count(10)->create();

    // 取第一篇文章作为测试记录
    $post = $posts->first();

    livewire(PostResource\Pages\ListPosts::class)
        // 断言 'author.name' 列在该记录上的状态值等于实际作者名称
        // 参数说明：列名, 期望值, record: 指定测试哪一行记录
        ->assertTableColumnStateSet('author.name', $post->author->name, record: $post)
        // 断言 'author.name' 列在该记录上的状态值不等于 'Anonymous'
        ->assertTableColumnStateNotSet('author.name', 'Anonymous', record: $post);
});
```

要断言某个列对于某条记录有或没有格式化后的状态，你可以使用 `assertTableColumnFormattedStateSet()` 和 `assertTableColumnFormattedStateNotSet()`：

```php
use function Pest\Livewire\livewire;

it('can get post author names', function () {
    // 创建一篇指定作者名为 'John Smith' 的文章
    $post = Post::factory(['name' => 'John Smith'])->create();

    livewire(PostResource\Pages\ListPosts::class)
        // 断言 'author.name' 列的格式化状态值为 'Smith, John'（经过列的 formatStateUsing 处理后的显示值）
        ->assertTableColumnFormattedStateSet('author.name', 'Smith, John', record: $post)
        // 断言格式化后的状态值不等于原始数据值（因为格式化器将 'John Smith' 转换为 'Smith, John'）
        ->assertTableColumnFormattedStateNotSet('author.name', $post->author->name, record: $post);
});
```

### 测试列的存在性

要确保某个列存在，你可以使用 `assertTableColumnExists()` 方法：

```php
use function Pest\Livewire\livewire;

it('has an author column', function () {
    livewire(PostResource\Pages\ListPosts::class)
        // 断言表格中存在名为 'author' 的列（仅检查列是否存在，不检查配置）
        ->assertTableColumnExists('author');
});
```

你可以传递一个函数作为额外参数，以断言列通过了给定的"真值测试"。这对于断言列具有特定配置非常有用。你还可以传入记录作为第三个参数，如果你的检查依赖于正在渲染的表格行，这将非常有用：

```php
use function Pest\Livewire\livewire;
use Filament\Tables\Columns\TextColumn;

it('has an author column', function () {
    // 创建一篇文章作为测试记录
    $post = Post::factory()->create();

    livewire(PostResource\Pages\ListPosts::class)
        // 断言 'author' 列存在，且通过自定义回调验证列的配置
        // 回调函数接收 TextColumn 实例，返回 bool 表示配置是否符合预期
        ->assertTableColumnExists('author', function (TextColumn $column): bool {
            // 断言该列下方的描述文本等于文章的 subtitle 字段值
            return $column->getDescriptionBelow() === $post->subtitle;
        }, $post); // 传入记录参数，用于基于特定行数据的断言
});
```

### 测试列的可见性

要确保某个用户看不到某个列，你可以使用 `assertTableColumnVisible()` 和 `assertTableColumnHidden()` 方法：

```php
use function Pest\Livewire\livewire;

it('shows the correct columns', function () {
    livewire(PostResource\Pages\ListPosts::class)
        // 断言 'created_at' 列对当前用户可见
        ->assertTableColumnVisible('created_at')
        // 断言 'author' 列对当前用户隐藏（可能因权限或配置导致不可见）
        ->assertTableColumnHidden('author');
});
```

### 测试列的描述

要确保某个列在上方或下方有正确的描述，你可以使用 `assertTableColumnHasDescription()` 和 `assertTableColumnDoesNotHaveDescription()` 方法：

```php
use function Pest\Livewire\livewire;

it('has the correct descriptions above and below author', function () {
    // 创建一篇文章作为测试记录
    $post = Post::factory()->create();

    livewire(PostsTable::class)
        // 断言 'author' 列在指定记录上方有描述文本 'Author! ↓↓↓'
        // 参数：列名, 期望描述, 记录, 位置('above' 或 'below'，默认为 'below')
        ->assertTableColumnHasDescription('author', 'Author! ↓↓↓', $post, 'above')
        // 断言 'author' 列在指定记录下方有描述文本 'Author! ↑↑↑'
        ->assertTableColumnHasDescription('author', 'Author! ↑↑↑', $post)
        // 断言 'author' 列在上方没有 'Author! ↑↑↑' 这个描述
        ->assertTableColumnDoesNotHaveDescription('author', 'Author! ↑↑↑', $post, 'above')
        // 断言 'author' 列在下方没有 'Author! ↓↓↓' 这个描述
        ->assertTableColumnDoesNotHaveDescription('author', 'Author! ↓↓↓', $post);
});
```

### 测试列的额外属性

要确保某个列具有正确的额外属性，你可以使用 `assertTableColumnHasExtraAttributes()` 和 `assertTableColumnDoesNotHaveExtraAttributes()` 方法：

```php
use function Pest\Livewire\livewire;

it('displays author in red', function () {
    // 创建一篇文章作为测试记录
    $post = Post::factory()->create();

    livewire(PostsTable::class)
        // 断言 'author' 列在该记录上具有 CSS 类 'text-danger-500'（红色文字）
        // 参数：列名, 期望的额外属性数组, 记录
        ->assertTableColumnHasExtraAttributes('author', ['class' => 'text-danger-500'], $post)
        // 断言 'author' 列在该记录上没有 CSS 类 'text-primary-500'（主色调）
        ->assertTableColumnDoesNotHaveExtraAttributes('author', ['class' => 'text-primary-500'], $post);
});
```

### 测试 `SelectColumn` 中的选项

如果你有一个选择列，你可以使用 `assertTableSelectColumnHasOptions()` 和 `assertTableSelectColumnDoesNotHaveOptions()` 来确保它具有正确的选项：

```php
use function Pest\Livewire\livewire;

it('has the correct statuses', function () {
    // 创建一篇文章作为测试记录
    $post = Post::factory()->create();

    livewire(PostsTable::class)
        // 断言 'status' 选择列包含指定的选项（键值对格式：值 => 显示文本）
        ->assertTableSelectColumnHasOptions('status', ['unpublished' => 'Unpublished', 'published' => 'Published'], $post)
        // 断言 'status' 选择列不包含 'archived' 选项
        ->assertTableSelectColumnDoesNotHaveOptions('status', ['archived' => 'Archived'], $post);
});
```

## 测试过滤器

要过滤表格记录，你可以使用 `filterTable()` 方法，配合 `assertCanSeeTableRecords()` 和 `assertCanNotSeeTableRecords()`：

```php
use function Pest\Livewire\livewire;

it('can filter posts by `is_published`', function () {
    // 创建 10 篇文章作为测试数据
    $posts = Post::factory()->count(10)->create();

    livewire(PostResource\Pages\ListPosts::class)
        // 首先断言过滤前能看到所有文章
        ->assertCanSeeTableRecords($posts)
        // 启用 'is_published' 过滤器（简单过滤器只需传入名称即可开启）
        ->filterTable('is_published')
        // 断言过滤后只能看到已发布的文章
        ->assertCanSeeTableRecords($posts->where('is_published', true))
        // 断言过滤后看不到未发布的文章
        ->assertCanNotSeeTableRecords($posts->where('is_published', false));
});
```

对于简单过滤器，这只是启用过滤器。

如果你想设置 `SelectFilter` 或 `TernaryFilter` 的值，请将值作为第二个参数传入：

```php
use function Pest\Livewire\livewire;

it('can filter posts by `author_id`', function () {
    // 创建 10 篇文章作为测试数据
    $posts = Post::factory()->count(10)->create();

    // 取第一篇文章的作者 ID 作为过滤值
    $authorId = $posts->first()->author_id;

    livewire(PostResource\Pages\ListPosts::class)
        // 首先断言过滤前能看到所有文章
        ->assertCanSeeTableRecords($posts)
        // 使用 SelectFilter 或 TernaryFilter，传入过滤器名称和要设置的值
        // 第二个参数是过滤器的值，用于选择特定的筛选条件
        ->filterTable('author_id', $authorId)
        // 断言过滤后只能看到该作者的文章
        ->assertCanSeeTableRecords($posts->where('author_id', $authorId))
        // 断言过滤后看不到其他作者的文章
        ->assertCanNotSeeTableRecords($posts->where('author_id', '!=', $authorId));
});
```

### 在测试中重置过滤器

要将所有过滤器重置为原始状态，请调用 `resetTableFilters()`：

```php
use function Pest\Livewire\livewire;

it('can reset table filters', function () {
    // 创建 10 篇文章作为测试数据
    $posts = Post::factory()->count(10)->create();

    livewire(PostResource\Pages\ListPosts::class)
        // 将所有过滤器重置为初始状态（清除所有已应用的过滤条件）
        ->resetTableFilters();
});
```

### 在测试中移除过滤器

要移除单个过滤器，你可以使用 `removeTableFilter()`：

```php
use function Pest\Livewire\livewire;

it('filters list by published', function () {
    // 创建 10 篇文章作为测试数据
    $posts = Post::factory()->count(10)->create();

    // 筛选出未发布的文章集合
    $unpublishedPosts = $posts->where('is_published', false)->get();

    livewire(PostsTable::class)
        // 启用 'is_published' 过滤器
        ->filterTable('is_published')
        // 断言过滤后看不到未发布的文章
        ->assertCanNotSeeTableRecords($unpublishedPosts)
        // 移除单个过滤器 'is_published'（与 resetTableFilters 不同，只移除指定的过滤器）
        ->removeTableFilter('is_published')
        // 断言移除过滤器后能看到所有文章
        ->assertCanSeeTableRecords($posts);
});
```

要移除所有过滤器，你可以使用 `removeTableFilters()`：

```php
use function Pest\Livewire\livewire;

it('can remove all table filters', function () {
    // 创建 10 篇关联作者的文章作为测试数据
    $posts = Post::factory()->count(10)->forAuthor()->create();

    // 筛选出同时满足"未发布"且"属于第一个作者"的文章
    $unpublishedPosts = $posts
        ->where('is_published', false)
        ->where('author_id', $posts->first()->author->getKey());

    livewire(PostsTable::class)
        // 启用 'is_published' 过滤器
        ->filterTable('is_published')
        // 启用 'author' 过滤器，传入作者 ID 作为过滤值
        ->filterTable('author', $author)
        // 断言过滤后看不到未发布且属于该作者的文章
        ->assertCanNotSeeTableRecords($unpublishedPosts)
        // 移除所有已应用的过滤器（一次性清除全部过滤条件）
        ->removeTableFilters()
        // 断言移除所有过滤器后能看到所有文章
        ->assertCanSeeTableRecords($posts);
});
```

### 测试过滤器的可见性

要确保某个用户看不到某个过滤器，你可以使用 `assertTableFilterVisible()` 和 `assertTableFilterHidden()` 方法：

```php
use function Pest\Livewire\livewire;

it('shows the correct filters', function () {
    livewire(PostsTable::class)
        // 断言 'created_at' 过滤器对当前用户可见
        ->assertTableFilterVisible('created_at')
        // 断言 'author' 过滤器对当前用户隐藏（可能因权限或配置导致不可见）
        ->assertTableFilterHidden('author');
});
```

### 测试过滤器的存在性

要确保某个过滤器存在，你可以使用 `assertTableFilterExists()` 方法：

```php
use function Pest\Livewire\livewire;

it('has an author filter', function () {
    livewire(PostResource\Pages\ListPosts::class)
        // 断言表格中存在名为 'author' 的过滤器（仅检查过滤器是否存在，不检查配置）
        ->assertTableFilterExists('author');
});
```

你可以传递一个函数作为额外参数，以断言过滤器通过了给定的"真值测试"。这对于断言过滤器具有特定配置非常有用：

```php
use function Pest\Livewire\livewire;
use Filament\Tables\Filters\SelectFilter;

it('has an author filter', function () {
    livewire(PostResource\Pages\ListPosts::class)
        // 断言 'author' 过滤器存在，且通过自定义回调验证过滤器的配置
        // 回调函数接收 SelectFilter 实例，返回 bool 表示配置是否符合预期
        ->assertTableFilterExists('author', function (SelectFilter $column): bool {
            // 断言该过滤器的标签文本为 'Select author'
            return $column->getLabel() === 'Select author';
        });
});
```

## 测试汇总

要测试汇总计算是否正常工作，你可以使用 `assertTableColumnSummarySet()` 方法：

```php
use function Pest\Livewire\livewire;

it('can average values in a column', function () {
    // 创建 10 篇文章作为测试数据
    $posts = Post::factory()->count(10)->create();

    livewire(PostResource\Pages\ListPosts::class)
        // 首先断言表格能看到所有记录
        ->assertCanSeeTableRecords($posts)
        // 断言 'rating' 列的汇总计算结果正确
        // 参数：列名, 汇总器 ID ('average' 对应 Average 汇总器), 期望值
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
    // 为 'rating' 列添加 Average 汇总器，并设置 ID 为 'average'
    // 该 ID 用于在测试中通过 assertTableColumnSummarySet() 引用此汇总器
    ->summarize(Average::make('average'))
```

该 ID 在该列的汇总器之间应该是唯一的。

### 仅测试单个分页页面的汇总

要仅计算单个分页页面的平均值，请使用 `isCurrentPaginationPageOnly` 参数：

```php
use function Pest\Livewire\livewire;

it('can average values in a column', function () {
    // 创建 20 篇文章，用于测试分页场景
    $posts = Post::factory()->count(20)->create();

    livewire(PostResource\Pages\ListPosts::class)
        // 断言第一页只显示前 10 条记录
        ->assertCanSeeTableRecords($posts->take(10))
        // 断言汇总结果仅基于当前分页页面的记录计算
        // isCurrentPaginationPageOnly: true 表示只计算当前页的数据，而非全部记录
        ->assertTableColumnSummarySet('rating', 'average', $posts->take(10)->avg('rating'), isCurrentPaginationPageOnly: true);
});
```

### 测试范围汇总器

要测试范围，请将最小值和最大值传入元组样式的 `[$minimum, $maximum]` 数组：

```php
use function Pest\Livewire\livewire;

it('can average values in a column', function () {
    // 创建 10 篇文章作为测试数据
    $posts = Post::factory()->count(10)->create();

    livewire(PostResource\Pages\ListPosts::class)
        // 首先断言表格能看到所有记录
        ->assertCanSeeTableRecords($posts)
        // 断言 'rating' 列的范围汇总结果正确
        // 汇总器 ID 为 'range'，期望值为 [最小值, 最大值] 的元组格式数组
        ->assertTableColumnSummarySet('rating', 'range', [$posts->min('rating'), $posts->max('rating')]);
});
```

## 测试可切换列

默认情况下，只有在表格中默认切换为开启的列才会被渲染和可测试。你可以使用 `toggleAllTableColumns()` 开启表格中的所有列：

```php
use function Pest\Livewire\livewire;

it('can toggle all columns', function () {
    livewire(PostResource\Pages\ListPosts::class)
        // 开启表格中的所有列（包括默认隐藏的列也会显示出来）
        // 之后可以通过 assertCanRenderTableColumn() 测试那些默认不显示的列
        ->toggleAllTableColumns();
});
```

你也可以使用 `toggleAllTableColumns(false)` 关闭所有列：

```php
use function Pest\Livewire\livewire;

it('can toggle all columns off', function () {
    livewire(PostResource\Pages\ListPosts::class)
        // 传入 false 关闭表格中的所有列
        // 关闭后可以通过 assertCanNotRenderTableColumn() 验证列确实不可见
        ->toggleAllTableColumns(false);
});
```
