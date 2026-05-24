---
title: 选择器
---

## 简介

选择器组件允许你从预定义的选项列表中进行选择：

```php
use Filament\Forms\Components\Select;

Select::make('status')
    ->options([
        'draft' => 'Draft',
        'reviewing' => 'Reviewing',
        'published' => 'Published',
    ])
```

:::tip
`options()` 方法除了接受静态数组外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

![选择器](/assets/filament/v4.x/screenshots/images/light/forms/fields/select/simple.jpg)

## 启用 JavaScript 选择器

默认情况下，Filament 使用原生的 HTML5 选择器。你可以使用 `native(false)` 方法启用一个更具可定制性的 JavaScript 选择器：

```php
use Filament\Forms\Components\Select;

Select::make('status')
    ->options([
        'draft' => 'Draft',
        'reviewing' => 'Reviewing',
        'published' => 'Published',
    ])
    ->native(false)
```

:::tip
`native()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

![JavaScript 选择器](/assets/filament/v4.x/screenshots/images/light/forms/fields/select/javascript.jpg)

## 搜索选项

你可以使用 `searchable()` 方法启用搜索输入，以便更方便地访问大量选项：

```php
use Filament\Forms\Components\Select;

Select::make('author_id')
    ->label('Author')
    ->options(User::query()->pluck('name', 'id'))
    ->searchable()
```

你也可以传递一个布尔值来控制输入是否应该可搜索：

```php
use Filament\Forms\Components\Select;

Select::make('author_id')
    ->label('Author')
    ->options(User::query()->pluck('name', 'id'))
    ->searchable(FeatureFlag::active())
```

:::tip
`searchable()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

![可搜索的选择器](/assets/filament/v4.x/screenshots/images/light/forms/fields/select/searchable.jpg)

### 返回自定义搜索结果

如果你有大量选项，并且希望根据数据库搜索或其他外部数据源来填充它们，可以使用 `getSearchResultsUsing()` 和 `getOptionLabelUsing()` 方法代替 `options()`。

`getSearchResultsUsing()` 方法接受一个回调函数，该函数以 `$key => $value` 格式返回搜索结果。当前用户的搜索内容可通过 `$search` 获取，你应该使用它来过滤结果。

`getOptionLabelUsing()` 方法接受一个回调函数，将选中的选项 `$value` 转换为标签。这在表单首次加载且用户尚未进行搜索时使用，否则用于显示当前选中选项的标签将不可用。

如果你想提供自定义搜索结果，必须同时使用 `getSearchResultsUsing()` 和 `getOptionLabelUsing()`：

```php
use Filament\Forms\Components\Select;

Select::make('author_id')
    ->searchable()
    ->getSearchResultsUsing(fn (string $search): array => User::query()
        ->where('name', 'like', "%{$search}%")
        ->limit(50)
        ->pluck('name', 'id')
        ->all())
    ->getOptionLabelUsing(fn ($value): ?string => User::find($value)?->name),
```

`getOptionLabelUsing()` 至关重要，因为它为 Filament 提供了选中选项的标签，使其无需执行完整搜索来查找。如果选项无效，应返回 `null`。

:::tip
你可以将各种工具注入到这些函数的参数中。对于 `getOptionLabelUsing()`，参数 `$value` 为选项值；对于 `getOptionLabelsUsing()`，参数 `$values` 为选项值数组；对于 `getSearchResultsUsing()`，参数 `$search` 为当前搜索输入值。
:::

### 设置自定义加载消息

当你使用可搜索的选择器或多选器时，你可能希望在选项加载期间显示自定义消息。你可以使用 `loadingMessage()` 方法来实现：

```php
use Filament\Forms\Components\Select;

Select::make('author_id')
    ->relationship(name: 'author', titleAttribute: 'name')
    ->searchable()
    ->loadingMessage('Loading authors...')
```

:::tip
`loadingMessage()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

### 设置自定义无搜索结果消息

当你使用可搜索的选择器或多选器时，你可能希望在没有找到搜索结果时显示自定义消息。你可以使用 `noSearchResultsMessage()` 方法来实现：

```php
use Filament\Forms\Components\Select;

Select::make('author_id')
    ->relationship(name: 'author', titleAttribute: 'name')
    ->searchable()
    ->noSearchResultsMessage('No authors found.')
```

:::tip
`noSearchResultsMessage()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

### 设置自定义无选项消息

当你使用带有 `preload()` 或通过 `options()` 闭包设置动态选项的选择器或多选器时，你可能希望在没有可用选项时显示自定义消息。你可以使用 `noOptionsMessage()` 方法来实现：

```php
use Filament\Forms\Components\Select;

Select::make('author_id')
    ->relationship(name: 'author', titleAttribute: 'name')
    ->searchable()
    ->preload()
    ->noOptionsMessage('No authors available.')
```

:::tip
`noOptionsMessage()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

### 设置自定义搜索提示

当你使用可搜索的选择器或多选器时，你可能希望在用户尚未输入搜索词时显示自定义消息。你可以使用 `searchPrompt()` 方法来实现：

```php
use Filament\Forms\Components\Select;

Select::make('author_id')
    ->relationship(name: 'author', titleAttribute: 'name')
    ->searchable(['name', 'email'])
    ->searchPrompt('Search authors by their name or email address')
```

:::tip
`searchPrompt()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

### 设置自定义搜索中消息

当你使用可搜索的选择器或多选器时，你可能希望在搜索结果加载期间显示自定义消息。你可以使用 `searchingMessage()` 方法来实现：

```php
use Filament\Forms\Components\Select;

Select::make('author_id')
    ->relationship(name: 'author', titleAttribute: 'name')
    ->searchable()
    ->searchingMessage('Searching authors...')
```

:::tip
`searchingMessage()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

### 调整搜索防抖时间

默认情况下，当用户在可搜索的选择器或多选器中输入时，Filament 会等待 1000 毫秒（1 秒）后再搜索选项。如果用户持续输入搜索内容，搜索之间也会等待 1000 毫秒。你可以使用 `searchDebounce()` 方法来更改此设置：

```php
use Filament\Forms\Components\Select;

Select::make('author_id')
    ->relationship(name: 'author', titleAttribute: 'name')
    ->searchable()
    ->searchDebounce(500)
```

请确保不要将防抖时间设置得太低，否则可能会因为大量网络请求从服务器检索选项而导致选择器变得缓慢和无响应。

:::tip
`searchDebounce()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

## 多选器

`Select` 组件上的 `multiple()` 方法允许你从选项列表中选择多个值：

```php
use Filament\Forms\Components\Select;

Select::make('technologies')
    ->multiple()
    ->options([
        'tailwind' => 'Tailwind CSS',
        'alpine' => 'Alpine.js',
        'laravel' => 'Laravel',
        'livewire' => 'Laravel Livewire',
    ])
```

你也可以传递一个布尔值来控制输入是否应该允许多选：

```php
use Filament\Forms\Components\Select;

Select::make('technologies')
    ->multiple(FeatureFlag::active())
    ->options([
        'tailwind' => 'Tailwind CSS',
        'alpine' => 'Alpine.js',
        'laravel' => 'Laravel',
        'livewire' => 'Laravel Livewire',
    ])
```

:::tip
`multiple()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

![多选器](/assets/filament/v4.x/screenshots/images/light/forms/fields/select/multiple.jpg)

这些选项以 JSON 格式返回。如果你使用 Eloquent 保存它们，请确保在模型属性上添加 `array` [类型转换](https://laravel.com/docs/eloquent-mutators#array-and-json-casting)：

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

如果你正在[返回自定义搜索结果](#返回自定义搜索结果)，应该定义 `getOptionLabelsUsing()` 而非 `getOptionLabelUsing()`。`$values` 将被传入回调而非 `$value`，你应该返回一个 `$key => $value` 格式的标签及其对应值的数组：

```php
Select::make('technologies')
    ->multiple()
    ->searchable()
    ->getSearchResultsUsing(fn (string $search): array => Technology::query()
        ->where('name', 'like', "%{$search}%")
        ->limit(50)
        ->pluck('name', 'id')
        ->all())
    ->getOptionLabelsUsing(fn (array $values): array => Technology::query()
        ->whereIn('id', $values)
        ->pluck('name', 'id')
        ->all()),
```

`getOptionLabelsUsing()` 至关重要，因为它为 Filament 提供了已选中选项的标签，使其无需执行完整搜索来查找。它还用于[验证](#有效选项验证in-规则)用户选择的选项是否有效。如果选项无效，它不应出现在 `getOptionLabelsUsing()` 返回的数组中。

:::tip
`getOptionLabelsUsing()` 方法可以将各种工具注入到函数参数中。参数 `$values` 为要检索标签的选项值数组。
:::

### 重新排列已选选项

`reorderable()` 方法允许你在多选器中重新排列已选选项：

```php
use Filament\Forms\Components\Select;

Select::make('technologies')
    ->multiple()
    ->reorderable()
    ->options([
        'tailwind' => 'Tailwind CSS',
        'alpine' => 'Alpine.js',
        'laravel' => 'Laravel',
        'livewire' => 'Laravel Livewire',
    ])
```

当已选选项的顺序很重要时，这非常有用。

:::tip
`reorderable()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

## 分组选项

你可以将选项分组到一个标签下，以便更好地组织它们。为此，你可以向 `options()` 或通常传递选项数组的地方传递一个分组数组。数组的键用作分组标签，值是该分组中的选项数组：

```php
use Filament\Forms\Components\Select;

Select::make('status')
    ->searchable()
    ->options([
        'In Process' => [
            'draft' => 'Draft',
            'reviewing' => 'Reviewing',
        ],
        'Reviewed' => [
            'published' => 'Published',
            'rejected' => 'Rejected',
        ],
    ])
```

![分组选择器](/assets/filament/v4.x/screenshots/images/light/forms/fields/select/grouped.jpg)

## 与 Eloquent 关联集成

你可以使用 `Select` 的 `relationship()` 方法来配置一个 `BelongsTo` 关联以自动检索选项。`titleAttribute` 是一个列名，用于为每个选项生成标签：

```php
use Filament\Forms\Components\Select;

Select::make('author_id')
    ->relationship(name: 'author', titleAttribute: 'name')
```

`multiple()` 方法可以与 `relationship()` 结合使用来使用 `BelongsToMany` 关联。Filament 将从关联加载选项，并在表单提交时将它们保存回关联的中间表。如果未提供 `name`，Filament 将使用字段名作为关联名：

```php
use Filament\Forms\Components\Select;

Select::make('technologies')
    ->multiple()
    ->relationship(titleAttribute: 'name')
```

:::warning
当将 `disabled()` 与 `multiple()` 和 `relationship()` 一起使用时，请确保在 `relationship()` 之前调用 `disabled()`。这可以确保 `disabled()` 中的 `saved()` 调用不会在 `relationship()` 配置之后应用：

```php
use Filament\Forms\Components\Select;

Select::make('technologies')
    ->multiple()
    ->disabled()
    ->relationship(titleAttribute: 'name')
```
:::

### 跨多列搜索关联选项

默认情况下，如果选择器也是可搜索的，Filament 将根据关联的标题列返回搜索结果。如果你想跨多列搜索，可以向 `searchable()` 方法传递一个列数组：

```php
use Filament\Forms\Components\Select;

Select::make('author_id')
    ->relationship(name: 'author', titleAttribute: 'name')
    ->searchable(['name', 'email'])
```

### 预加载关联选项

如果你想在页面加载时从数据库填充可搜索选项，而不是在用户搜索时才加载，可以使用 `preload()` 方法：

```php
use Filament\Forms\Components\Select;

Select::make('author_id')
    ->relationship(name: 'author', titleAttribute: 'name')
    ->searchable()
    ->preload()
```

你也可以传递一个布尔值来控制是否应该预加载：

```php
use Filament\Forms\Components\Select;

Select::make('author_id')
    ->relationship(name: 'author', titleAttribute: 'name')
    ->searchable()
    ->preload(FeatureFlag::active())
```

:::tip
`preload()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

### 排除当前记录

在处理递归关联时，你可能需要从结果集中移除当前记录。

这可以使用 `ignoreRecord` 参数轻松完成：

```php
use Filament\Forms\Components\Select;

Select::make('parent_id')
    ->relationship(name: 'parent', titleAttribute: 'name', ignoreRecord: true)
```

### 自定义关联查询

你可以使用 `relationship()` 方法的第三个参数自定义检索选项的数据库查询：

```php
use Filament\Forms\Components\Select;
use Illuminate\Database\Eloquent\Builder;

Select::make('author_id')
    ->relationship(
        name: 'author',
        titleAttribute: 'name',
        modifyQueryUsing: fn (Builder $query) => $query->withTrashed(),
    )
```

:::tip
`modifyQueryUsing` 参数可以将各种工具注入到函数参数中。`$query` 为要修改的 Eloquent 查询构建器，`$search` 为当前搜索输入值（如果字段可搜索）。
:::

### 自定义关联选项标签

如果你想自定义每个选项的标签，使其更具描述性，或者拼接名字和姓氏，你可以在数据库迁移中使用虚拟列：

```php
$table->string('full_name')->virtualAs('concat(first_name, \' \', last_name)');
```

```php
use Filament\Forms\Components\Select;

Select::make('author_id')
    ->relationship(name: 'author', titleAttribute: 'full_name')
```

或者，你可以使用 `getOptionLabelFromRecordUsing()` 方法将选项的 Eloquent 模型转换为标签：

```php
use Filament\Forms\Components\Select;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

Select::make('author_id')
    ->relationship(
        name: 'author',
        modifyQueryUsing: fn (Builder $query) => $query->orderBy('first_name')->orderBy('last_name'),
    )
    ->getOptionLabelFromRecordUsing(fn (Model $record) => "{$record->first_name} {$record->last_name}")
    ->searchable(['first_name', 'last_name'])
```

:::tip
`getOptionLabelFromRecordUsing()` 方法可以将各种工具注入到函数参数中。参数 `$record` 为要获取选项标签的 Eloquent 记录。
:::

### 向关联保存中间表数据

如果你使用 `multiple()` 关联，并且你的中间表有额外的列，可以使用 `pivotData()` 方法指定应保存到这些列中的数据：

```php
use Filament\Forms\Components\Select;

Select::make('primaryTechnologies')
    ->relationship(name: 'technologies', titleAttribute: 'name')
    ->multiple()
    ->pivotData([
        'is_primary' => true,
    ])
```

:::tip
`pivotData()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

### 在模态框中创建新选项

你可以定义一个自定义表单，用于创建新记录并将其附加到 `BelongsTo` 关联：

```php
use Filament\Forms\Components\Select;

Select::make('author_id')
    ->relationship(name: 'author', titleAttribute: 'name')
    ->createOptionForm([
        Forms\Components\TextInput::make('name')
            ->required(),
        Forms\Components\TextInput::make('email')
            ->required()
            ->email(),
    ]),
```

:::tip
`createOptionForm()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。参数 `$schema` 为模态框中表单的 schema 对象。
:::

![带创建选项按钮的选择器](/assets/filament/v4.x/screenshots/images/light/forms/fields/select/create-option.jpg)

表单在模态框中打开，用户可以在其中填写数据。表单提交后，该字段将选中新创建的记录。

![带创建选项模态框的选择器](/assets/filament/v4.x/screenshots/images/light/forms/fields/select/create-option-modal.jpg)

#### 自定义新选项创建

你可以使用 `createOptionUsing()` 方法自定义表单中定义的新选项的创建过程，该方法应返回新创建记录的主键：

```php
use Filament\Forms\Components\Select;

Select::make('author_id')
    ->relationship(name: 'author', titleAttribute: 'name')
    ->createOptionForm([
       // ...
    ])
    ->createOptionUsing(function (array $data): int {
        return auth()->user()->team->members()->create($data)->getKey();
    }),
```

:::tip
`createOptionUsing()` 方法可以将各种工具注入到函数参数中。`$data` 为模态框中表单的数据，`$schema` 为模态框中表单的 schema 对象。
:::

### 在模态框中编辑选中的选项

你可以定义一个自定义表单，用于编辑选中的记录并将其保存回 `BelongsTo` 关联：

```php
use Filament\Forms\Components\Select;

Select::make('author_id')
    ->relationship(name: 'author', titleAttribute: 'name')
    ->editOptionForm([
        Forms\Components\TextInput::make('name')
            ->required(),
        Forms\Components\TextInput::make('email')
            ->required()
            ->email(),
    ]),
```

:::tip
`editOptionForm()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。参数 `$schema` 为模态框中表单的 schema 对象。
:::

![带编辑选项按钮的选择器](/assets/filament/v4.x/screenshots/images/light/forms/fields/select/edit-option.jpg)

表单在模态框中打开，用户可以在其中填写数据。表单提交后，表单中的数据将保存回记录。

![带编辑选项模态框的选择器](/assets/filament/v4.x/screenshots/images/light/forms/fields/select/edit-option-modal.jpg)

#### 自定义选项更新

你可以使用 `updateOptionUsing()` 方法自定义表单中定义的选中选项的更新过程。当前正在编辑的 Eloquent 记录可以通过 schema 上的 `getRecord()` 方法获取：

```php
use Filament\Forms\Components\Select;
use Filament\Schemas\Schema;

Select::make('author_id')
    ->relationship(name: 'author', titleAttribute: 'name')
    ->editOptionForm([
       // ...
    ])
    ->updateOptionUsing(function (array $data, Schema $schema) {
        $schema->getRecord()?->update($data);
    }),
```

:::tip
`updateOptionUsing()` 方法可以将各种工具注入到函数参数中。`$data` 为模态框中表单的数据，`$schema` 为模态框中表单的 schema 对象。
:::

### 处理 `MorphTo` 关联

`MorphTo` 关联比较特殊，因为它们允许用户从一系列不同的模型中选择记录。因此，我们提供了一个专用的 `MorphToSelect` 组件，它实际上不是一个选择器字段，而是一个字段集内的 2 个选择器字段。第一个选择器字段允许你选择类型，第二个允许你选择该类型的记录。

要使用 `MorphToSelect`，你必须向组件传入 `types()`，告诉它如何为不同类型渲染选项：

```php
use Filament\Forms\Components\MorphToSelect;

MorphToSelect::make('commentable')
    ->types([
        MorphToSelect\Type::make(Product::class)
            ->titleAttribute('name'),
        MorphToSelect\Type::make(Post::class)
            ->titleAttribute('title'),
    ])
```

:::tip
`types()` 方法可以将各种工具注入到函数参数中。
:::

#### 自定义每个多态类型的选项标签

`titleAttribute()` 用于从每个产品或文章中提取标题。如果你想自定义每个选项的标签，可以使用 `getOptionLabelFromRecordUsing()` 方法将 Eloquent 模型转换为标签：

```php
use Filament\Forms\Components\MorphToSelect;

MorphToSelect::make('commentable')
    ->types([
        MorphToSelect\Type::make(Product::class)
            ->getOptionLabelFromRecordUsing(fn (Product $record): string => "{$record->name} - {$record->slug}"),
        MorphToSelect\Type::make(Post::class)
            ->titleAttribute('title'),
    ])
```

#### 自定义每个多态类型的关联查询

你可以使用 `modifyOptionsQueryUsing()` 方法自定义检索选项的数据库查询：

```php
use Filament\Forms\Components\MorphToSelect;
use Illuminate\Database\Eloquent\Builder;

MorphToSelect::make('commentable')
    ->types([
        MorphToSelect\Type::make(Product::class)
            ->titleAttribute('name')
            ->modifyOptionsQueryUsing(fn (Builder $query) => $query->whereBelongsTo($this->team)),
        MorphToSelect\Type::make(Post::class)
            ->titleAttribute('title')
            ->modifyOptionsQueryUsing(fn (Builder $query) => $query->whereBelongsTo($this->team)),
    ])
```

:::tip
`modifyOptionsQueryUsing()` 方法可以将各种工具注入到函数参数中。参数 `$query` 为要修改的查询构建器。
:::

:::tip
选择器字段中的许多相同选项也适用于 `MorphToSelect`，包括 `searchable()`、`preload()`、`native()`、`allowHtml()` 和 `optionsLimit()`。
:::

#### 自定义形态选择器字段

你可以使用 `modifyKeySelectUsing()` 方法进一步自定义特定形态类型的"键"选择器字段：

```php
use Filament\Forms\Components\MorphToSelect;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;

MorphToSelect::make('commentable')
    ->types([
        MorphToSelect\Type::make(Product::class)
            ->titleAttribute('name')
            ->modifyKeySelectUsing(fn (Select $select): Select => $select
                ->createOptionForm([
                    TextInput::make('title')
                        ->required(),
                ])
                ->createOptionUsing(function (array $data): int {
                    return Product::create($data)->getKey();
                })),
        MorphToSelect\Type::make(Post::class)
            ->titleAttribute('title'),
    ])
```

如果你想单独自定义每个多态类型的"键"选择器字段，这非常有用。如果你想为所有类型自定义键选择器，可以在 `MorphToSelect` 组件本身上使用 `modifyKeySelectUsing()` 方法：

```php
use Filament\Forms\Components\MorphToSelect;
use Filament\Forms\Components\Select;

MorphToSelect::make('commentable')
    ->types([
        MorphToSelect\Type::make(Product::class)
            ->titleAttribute('name'),
        MorphToSelect\Type::make(Post::class)
            ->titleAttribute('title'),
    ])
    ->modifyKeySelectUsing(fn (Select $select): Select => $select->native())
```

你也可以使用 `modifyTypeSelectUsing()` 方法修改"类型"选择器字段：

```php
use Filament\Forms\Components\MorphToSelect;
use Filament\Forms\Components\Select;

MorphToSelect::make('commentable')
    ->types([
        MorphToSelect\Type::make(Product::class)
            ->titleAttribute('name'),
        MorphToSelect\Type::make(Post::class)
            ->titleAttribute('title'),
    ])
    ->modifyTypeSelectUsing(fn (Select $select): Select => $select->native())
```

#### 使用切换按钮作为类型选择器

默认情况下，类型选择器是一个选择器字段。你可以使用 `typeSelectToggleButtons()` 方法将其切换为使用内联[切换按钮](toggle-buttons)：

```php
use Filament\Forms\Components\MorphToSelect;

MorphToSelect::make('commentable')
    ->typeSelectToggleButtons()
    ->types([
        MorphToSelect\Type::make(Product::class)
            ->titleAttribute('name'),
        MorphToSelect\Type::make(Post::class)
            ->titleAttribute('title'),
    ])
```

使用切换按钮时，你可以使用 `modifyTypeSelectUsing()` 方法来自定义它们：

```php
use Filament\Forms\Components\MorphToSelect;
use Filament\Forms\Components\ToggleButtons;

MorphToSelect::make('commentable')
    ->typeSelectToggleButtons()
    ->types([
        MorphToSelect\Type::make(Product::class)
            ->titleAttribute('name'),
        MorphToSelect\Type::make(Post::class)
            ->titleAttribute('title'),
    ])
    ->modifyTypeSelectUsing(fn (ToggleButtons $toggleButtons): ToggleButtons => $toggleButtons->grouped())
```

## 允许选项标签中的 HTML

默认情况下，Filament 会转义选项标签中的任何 HTML。如果你想允许 HTML，可以使用 `allowHtml()` 方法：

```php
use Filament\Forms\Components\Select;

Select::make('technology')
    ->options([
        'tailwind' => '<span class="text-blue-500">Tailwind</span>',
        'alpine' => '<span class="text-green-500">Alpine</span>',
        'laravel' => '<span class="text-red-500">Laravel</span>',
        'livewire' => '<span class="text-pink-500">Livewire</span>',
    ])
    ->searchable()
    ->allowHtml()
```

:::danger
请注意，你需要确保 HTML 是安全的，否则你的应用程序将容易受到 XSS 攻击。
:::

![带 HTML 选项标签的选择器](/assets/filament/v4.x/screenshots/images/light/forms/fields/select/html-labels.jpg)

你也可以传递一个布尔值来控制输入是否应该允许 HTML：

```php
use Filament\Forms\Components\Select;

Select::make('technology')
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
`allowHtml()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

## 换行或截断选项标签

使用 JavaScript 选择器时，超过选择器元素宽度的标签默认会换行到多行。或者，你可以选择截断溢出的标签。

```php
use Filament\Forms\Components\Select;

Select::make('truncate')
    ->wrapOptionLabels(false)
```

![带截断选项标签的选择器](/assets/filament/v4.x/screenshots/images/light/forms/fields/select/truncate-labels.jpg)

:::tip
`wrapOptionLabels()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

## 禁用占位符选择

你可以使用 `selectablePlaceholder(false)` 方法防止占位符（空选项）被选中：

```php
use Filament\Forms\Components\Select;

Select::make('status')
    ->options([
        'draft' => 'Draft',
        'reviewing' => 'Reviewing',
        'published' => 'Published',
    ])
    ->default('draft')
    ->selectablePlaceholder(false)
```

:::tip
`selectablePlaceholder()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

## 禁用特定选项

你可以使用 `disableOptionWhen()` 方法禁用特定选项。它接受一个闭包，你可以在其中检查具有特定 `$value` 的选项是否应该被禁用：

```php
use Filament\Forms\Components\Select;

Select::make('status')
    ->options([
        'draft' => 'Draft',
        'reviewing' => 'Reviewing',
        'published' => 'Published',
    ])
    ->default('draft')
    ->disableOptionWhen(fn (string $value): bool => $value === 'published')
```

:::tip
你可以将各种工具注入到函数参数中。`$value` 为要禁用的选项的值，`$label` 为要禁用的选项的标签。
:::

![带禁用选项的选择器](/assets/filament/v4.x/screenshots/images/light/forms/fields/select/disabled-options.jpg)

## 在字段旁添加前后缀文本

你可以使用 `prefix()` 和 `suffix()` 方法在输入前后放置文本：

```php
use Filament\Forms\Components\Select;

Select::make('domain')
    ->prefix('https://')
    ->suffix('.com')
```

:::tip
`prefix()` 和 `suffix()` 方法除了接受静态值外，还接受函数来动态计算。你可以将各种工具注入到函数参数中。
:::

![带前后缀的选择器](/assets/filament/v4.x/screenshots/images/light/forms/fields/select/affix.jpg)

### 使用图标作为前后缀

你可以使用 `prefixIcon()` 和 `suffixIcon()` 方法在输入前后放置[图标](../styling/icons)：

```php
use Filament\Forms\Components\Select;
use Filament\Support\Icons\Heroicon;

Select::make('domain')
    ->suffixIcon(Heroicon::GlobeAlt)
```

:::tip
`prefixIcon()` 和 `suffixIcon()` 方法除了接受静态值外，还接受函数来动态计算。你可以将各种工具注入到函数参数中。
:::

![带后缀图标的选择器](/assets/filament/v4.x/screenshots/images/light/forms/fields/select/suffix-icon.jpg)

#### 设置前后缀图标颜色

前后缀图标默认为灰色，但你可以使用 `prefixIconColor()` 和 `suffixIconColor()` 方法设置不同的颜色：

```php
use Filament\Forms\Components\Select;
use Filament\Support\Icons\Heroicon;

Select::make('domain')
    ->suffixIcon(Heroicon::CheckCircle)
    ->suffixIconColor('success')
```

:::tip
`prefixIconColor()` 和 `suffixIconColor()` 方法除了接受静态值外，还接受函数来动态计算。你可以将各种工具注入到函数参数中。
:::

![带彩色后缀图标的选择器](/assets/filament/v4.x/screenshots/images/light/forms/fields/select/suffix-icon-color.jpg)

## 限制选项数量

你可以使用 `optionsLimit()` 方法限制可搜索选择器或多选器中显示的选项数量。默认值为 50：

```php
use Filament\Forms\Components\Select;

Select::make('author_id')
    ->relationship(name: 'author', titleAttribute: 'name')
    ->searchable()
    ->optionsLimit(20)
```

请确保不要将限制设置得太高，否则可能会因为浏览器内存占用过高而导致选择器变得缓慢和无响应。

:::tip
`optionsLimit()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

## 布尔选项

如果你想要一个简单的布尔选择器，带有"是"和"否"选项，可以使用 `boolean()` 方法：

```php
use Filament\Forms\Components\Select;

Select::make('feedback')
    ->label('Like this post?')
    ->boolean()
```

![布尔选择器](/assets/filament/v4.x/screenshots/images/light/forms/fields/select/boolean.jpg)

要自定义"是"标签，可以使用 `boolean()` 方法的 `trueLabel` 参数：

```php
use Filament\Forms\Components\Select;

Select::make('feedback')
    ->label('Like this post?')
    ->boolean(trueLabel: 'Absolutely!')
```

要自定义"否"标签，可以使用 `boolean()` 方法的 `falseLabel` 参数：

```php
use Filament\Forms\Components\Select;

Select::make('feedback')
    ->label('Like this post?')
    ->boolean(falseLabel: 'Not at all!')
```

要自定义尚未选择选项时显示的占位符，可以使用 `boolean()` 方法的 `placeholder` 参数：

```php
use Filament\Forms\Components\Select;

Select::make('feedback')
    ->label('Like this post?')
    ->boolean(placeholder: 'Make your mind up...')
```

## 从模态框中的表格选择选项

你可以使用 `ModalTableSelect` 组件在模态框中打开一个 Filament [表格](../tables)，允许用户从中选择记录。当你有一个包含大量记录的[关联](#与-eloquent-关联集成)，并且希望用户能够执行高级过滤和搜索时，这非常有用。

要使用 `ModalTableSelect`，你必须有一个该模型的表格配置类。你可以使用 `make:filament-table` 命令生成此类：

```php
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class CategoriesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->searchable(),
                TextColumn::make('slug')
                    ->searchable(),
            ])
            ->filters([
                SelectFilter::make('parent')
                    ->relationship('parent', 'name')
                    ->searchable()
                    ->preload(),
            ]);
    }
}
```

该类必须有一个 `configure()` 方法，接受 `Table` 对象并返回它。类名需要传递给 `ModalTableSelect` 组件的 `tableConfiguration()` 方法：

```php
use Filament\Forms\Components\ModalTableSelect;

ModalTableSelect::make('category_id')
    ->relationship('category', 'name')
    ->tableConfiguration(CategoriesTable::class)
```

你也可以将 `multiple()` 方法与 `BelongsToMany` 等多对多关联一起使用：

```php
use Filament\Forms\Components\ModalTableSelect;

ModalTableSelect::make('categories')
    ->relationship('categories', 'name')
    ->multiple()
    ->tableConfiguration(CategoriesTable::class)
```

![带已选选项的模态表格选择器](/assets/filament/v4.x/screenshots/images/light/forms/fields/modal-table-select/simple.jpg)

![模态框中打开表格的模态表格选择器](/assets/filament/v4.x/screenshots/images/light/forms/fields/modal-table-select/modal.jpg)

:::tip
`tableConfiguration()` 方法可以将各种工具注入到函数参数中。
:::

### 自定义模态表格选择器的操作

你可以使用[操作](../actions)对象配置方法来自定义"选择"按钮和模态框。向 `selectAction()` 方法传递一个函数允许你修改 `$action` 对象，例如更改按钮标签和模态框标题：

```php
use Filament\Actions\Action;
use Filament\Forms\Components\ModalTableSelect;

ModalTableSelect::make('category_id')
    ->relationship('category', 'name')
    ->tableConfiguration(CategoriesTable::class)
    ->selectAction(
        fn (Action $action) => $action
            ->label('Select a category')
            ->modalHeading('Search categories')
            ->modalSubmitActionLabel('Confirm selection'),
    )
```

:::tip
`selectAction()` 方法可以将各种工具注入到函数参数中。参数 `$action` 为要自定义的操作对象。
:::

### 自定义模态表格选择器中的选项标签

`getOptionLabelFromRecordUsing()` 方法可用于自定义每个已选选项的标签。当你想要显示更具描述性的标签或将两列拼接在一起时，这非常有用：

```php
use Filament\Forms\Components\ModalTableSelect;

ModalTableSelect::make('category_id')
    ->relationship('category', 'name')
    ->tableConfiguration(CategoriesTable::class)
    ->getOptionLabelFromRecordUsing(fn (Category $record): string => "{$record->name} ({$record->slug})")
```

默认情况下，`multiple()` 选项以"徽章"样式显示，单个选项以纯文本显示。`badge()` 方法可用于定义选项标签是否应显示在徽章内：

```php
use Filament\Forms\Components\ModalTableSelect;

ModalTableSelect::make('category_id')
    ->relationship('category', 'name')
    ->tableConfiguration(CategoriesTable::class)
    ->badge()

ModalTableSelect::make('categories')
    ->relationship('categories', 'name')
    ->multiple()
    ->tableConfiguration(CategoriesTable::class)
    ->badge(false)
```

`badgeColor()` 方法可用于设置徽章[颜色](../styling/colors)：

```php
use Filament\Forms\Components\ModalTableSelect;

ModalTableSelect::make('categories')
    ->relationship('categories', 'name')
    ->multiple()
    ->tableConfiguration(CategoriesTable::class)
    ->badgeColor('success')
```

:::tip
`badgeColor()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

### 向模态选择器中的表格传递额外参数

你可以使用 `tableArguments()` 方法将表单中的参数传递给表格配置类。例如，这可用于根据先前填写的表单字段修改表格的查询：

```php
use Filament\Actions\Action;
use Filament\Forms\Components\ModalTableSelect;
use Filament\Schemas\Components\Utilities\Get;

ModalTableSelect::make('products')
    ->relationship('products', 'name')
    ->multiple()
    ->tableConfiguration(ProductsTable::class)
    ->tableArguments(function (Get $get): array {
        return [
            'category_id' => $get('category_id'),
            'budget_limit' => $get('budget'),
        ];
    })
```

:::tip
`tableArguments()` 方法可以将各种工具注入到函数参数中。
:::

在你的表格配置类中，你可以使用 `$table->getArguments()` 方法访问这些参数：

```php
use Filament\Forms\Components\TableSelect\Livewire\TableSelectLivewireComponent;
use Filament\Tables\Columns\TextColumn;
use Illuminate\Database\Eloquent\Builder;
use Filament\Tables\Table;

class ProductsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->modifyQueryUsing(function (Builder $query) use ($table): Builder {
                $arguments = $table->getArguments();
            
                if ($categoryId = $arguments['category_id'] ?? null) {
                    $query->where('category_id', $categoryId);
                }
                
                if ($budgetLimit = $arguments['budget_limit'] ?? null) {
                    $query->where('price', '<=', $budgetLimit);
                }
                
                return $query;
            })
            ->columns([
                TextColumn::make('name'),
                TextColumn::make('price')
                    ->money(),
                TextColumn::make('category.name')
                    ->hidden(filled($table->getArguments()['category_id'])),
            ]);
    }
}
```

## 选择器验证

除了[验证](validation)页面上列出的所有规则外，还有一些特定于选择器的额外规则。

### 有效选项验证（`in()` 规则）

[`in()`](validation#在中) 规则确保用户无法选择不在选项列表中的选项。这是数据完整性的重要规则，因此 Filament 默认将其应用于所有选择器字段。

:::warning
选中选项验证至关重要，因此我们强烈建议你为表单[编写自动化测试](../testing/testing-schemas#测试表单验证)以确保验证按预期工作。
:::

由于选择器字段有多种填充选项的方式，并且在许多情况下选项不会全部加载到选择器中，需要通过搜索来检索，Filament 使用有效的"选项标签"的存在来确定选中的值是否存在。它还会检查该选项是否被[禁用](#禁用特定选项)。

如果你使用自定义搜索查询来检索选项，应确保定义了 `getOptionLabelUsing()` 方法，以便 Filament 可以针对可用选项验证选中的值：

```php
use Filament\Forms\Components\Select;

Select::make('author_id')
    ->searchable()
    ->getSearchResultsUsing(fn (string $search): array => Author::query()
        ->where('name', 'like', "%{$search}%")
        ->limit(50)
        ->pluck('name', 'id')
        ->all())
    ->getOptionLabelUsing(fn (string $value): ?string => Author::find($value)?->name),
```

如果选项无效，`getOptionLabelUsing()` 方法应返回 `null`，以便 Filament 确定选中的值不在选项列表中。如果选项有效，它应返回选项的标签。

如果你使用 `multiple()` 选择器或多选器，应定义 `getOptionLabelsUsing()` 而非 `getOptionLabelUsing()`。`$values` 将被传入回调而非 `$value`，你应该返回一个 `$key => $value` 格式的标签及其对应值的数组：

```php
use Filament\Forms\Components\Select;

Select::make('technologies')
    ->multiple()
    ->searchable()
    ->getSearchResultsUsing(fn (string $search): array => Technology::query()
        ->where('name', 'like', "%{$search}%")
        ->limit(50)
        ->pluck('name', 'id')
        ->all())
    ->getOptionLabelsUsing(fn (array $values): array => Technology::query()
        ->whereIn('id', $values)
        ->pluck('name', 'id')
        ->all()),
```

如果你使用 `relationship()` 方法，`getOptionLabelUsing()` 或 `getOptionLabelsUsing()` 方法将自动为你定义，因此你无需担心它们。

### 已选项目数量验证

你可以通过设置 `minItems()` 和 `maxItems()` 方法来验证[多选器](#多选器)中可以选择的最小和最大项目数量：

```php
use Filament\Forms\Components\Select;

Select::make('technologies')
    ->multiple()
    ->options([
        'tailwind' => 'Tailwind CSS',
        'alpine' => 'Alpine.js',
        'laravel' => 'Laravel',
        'livewire' => 'Laravel Livewire',
    ])
    ->minItems(1)
    ->maxItems(3)
```

:::tip
`minItems()` 和 `maxItems()` 方法除了接受静态值外，还接受函数来动态计算。你可以将各种工具注入到函数参数中。
:::

## 自定义选择器操作对象

此字段使用操作对象以便于自定义其中的按钮。你可以通过向操作注册方法传递函数来自定义这些按钮。该函数可以访问 `$action` 对象，你可以使用它来[自定义操作](../actions/overview)或[自定义其模态框](../actions/modals)。以下方法可用于自定义操作：

- `createOptionAction()`
- `editOptionAction()`
- `manageOptionActions()`（同时自定义创建和编辑选项操作）

以下是自定义操作的示例：

```php
use Filament\Actions\Action;
use Filament\Forms\Components\Select;

Select::make('author_id')
    ->relationship(name: 'author', titleAttribute: 'name')
    ->createOptionAction(
        fn (Action $action) => $action->modalWidth('3xl'),
    )
```

:::tip
操作注册方法可以将各种工具注入到函数参数中。参数 `$action` 为要自定义的操作对象。
:::
