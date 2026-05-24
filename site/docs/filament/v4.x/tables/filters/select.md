---
title: 选择过滤器
---

## 简介

通常，你会希望使用[选择字段](../../forms/select)而不是复选框。当你想根据一组预定义选项筛选列时，这尤其有用。为此，你可以使用 `SelectFilter` 类创建过滤器：

```php
use Filament\Tables\Filters\SelectFilter;

SelectFilter::make('status')
    ->options([
        'draft' => 'Draft',
        'reviewing' => 'Reviewing',
        'published' => 'Published',
    ])
```

传递给过滤器的 `options()` 与传递给[选择字段](../../forms/select)的选项相同。

![带选择过滤器的表格](/assets/filament/v4.x/screenshots/images/light/tables/filters/select.jpg)

除固定值外，`options()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

## 自定义选择过滤器使用的列

选择过滤器不需要自定义 `query()` 方法。用于限定查询范围的列名就是过滤器的名称。要自定义此行为，你可以使用 `attribute()` 方法：

```php
use Filament\Tables\Filters\SelectFilter;

SelectFilter::make('status')
    ->options([
        'draft' => 'Draft',
        'reviewing' => 'Reviewing',
        'published' => 'Published',
    ])
    ->attribute('status_id')
```

除固定值外，`attribute()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

## 多选过滤器

多选过滤器允许用户[选择多个选项](../../forms/select#多选器)来筛选表格。例如，状态过滤器可以向用户提供几个状态选项供选择，并使用这些选项筛选表格。当用户选择多个选项时，表格将筛选显示与任何选定选项匹配的记录。你可以使用 `multiple()` 方法启用此行为：

```php
use Filament\Tables\Filters\SelectFilter;

SelectFilter::make('status')
    ->multiple()
    ->options([
        'draft' => 'Draft',
        'reviewing' => 'Reviewing',
        'published' => 'Published',
    ])
```

![带多选过滤器的表格](/assets/filament/v4.x/screenshots/images/light/tables/filters/multi-select.jpg)

## 关联关系选择过滤器

选择过滤器还能够根据关联关系自动填充选项。例如，如果你的表格有一个 `author` 关联关系，其中包含 `name` 列，你可以使用 `relationship()` 来筛选属于某个作者的记录：

```php
use Filament\Tables\Filters\SelectFilter;

SelectFilter::make('author')
    ->relationship('author', 'name')
```

### 预加载关联关系选项

如果你想在页面加载时从数据库填充可搜索选项（而不是在用户搜索时），可以使用 `preload()` 方法：

```php
use Filament\Tables\Filters\SelectFilter;

SelectFilter::make('author')
    ->relationship('author', 'name')
    ->searchable()
    ->preload()
```

### 筛选空关联关系

默认情况下，选择一个选项后，所有关联关系为空的记录将被排除在结果之外。如果你想引入一个额外的"无"选项供用户选择，以包含所有没有关联关系的记录，你可以使用 `relationship()` 方法的 `hasEmptyOption()` 参数：

```php
use Filament\Tables\Filters\SelectFilter;

SelectFilter::make('author')
    ->relationship('author', 'name', hasEmptyOption: true)
```

你可以使用 `emptyRelationshipOptionLabel()` 方法重命名"无"选项：

```php
use Filament\Tables\Filters\SelectFilter;

SelectFilter::make('author')
    ->relationship('author', 'name', hasEmptyOption: true)
    ->emptyRelationshipOptionLabel('No author')
```

### 自定义关联关系查询

你可以使用 `relationship()` 方法的第三个参数自定义检索选项的数据库查询：

```php
use Filament\Tables\Filters\SelectFilter;
use Illuminate\Database\Eloquent\Builder;

SelectFilter::make('author')
    ->relationship('author', 'name', fn (Builder $query) => $query->withTrashed())
```

### 搜索选择过滤器选项

你可以使用 `searchable()` 方法启用搜索输入，以便更轻松地访问大量选项：

```php
use Filament\Tables\Filters\SelectFilter;

SelectFilter::make('author')
    ->relationship('author', 'name')
    ->searchable()
```

## 禁用占位符选择

你可以使用 `selectablePlaceholder()` 方法移除占位符（null 选项），该占位符会禁用过滤器从而使所有选项都被应用：

```php
use Filament\Tables\Filters\SelectFilter;

SelectFilter::make('status')
    ->options([
        'draft' => 'Draft',
        'reviewing' => 'Reviewing',
        'published' => 'Published',
    ])
    ->default('draft')
    ->selectablePlaceholder(false)
```

## 默认应用选择过滤器

你可以使用 `default()` 方法设置选择过滤器默认启用。如果使用单选过滤器，`default()` 方法接受单个选项值。如果使用 `multiple()` 多选过滤器，`default()` 方法接受一个选项值数组：

```php
use Filament\Tables\Filters\SelectFilter;

SelectFilter::make('status')
    ->options([
        'draft' => 'Draft',
        'reviewing' => 'Reviewing',
        'published' => 'Published',
    ])
    ->default('draft')

SelectFilter::make('status')
    ->options([
        'draft' => 'Draft',
        'reviewing' => 'Reviewing',
        'published' => 'Published',
    ])
    ->multiple()
    ->default(['draft', 'reviewing'])
```

除固定值外，`default()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。
