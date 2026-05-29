---
title: 重复器
---

## 简介

重复器组件允许你输出一个由重复表单组件组成的 JSON 数组。

```php
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;

Repeater::make('members')
    ->schema([
        TextInput::make('name')->required(),
        Select::make('role')
            ->options([
                'member' => 'Member',
                'administrator' => 'Administrator',
                'owner' => 'Owner',
            ])
            ->required(),
    ])
    ->columns(2)
```

![重复器](/assets/filament/v4.x/screenshots/images/light/forms/fields/repeater/simple.jpg)

我们建议你在数据库中使用 `JSON` 列来存储重复器数据。此外，如果你使用 Eloquent，请确保该列具有 `array` 类型转换。

如上例所示，组件的 schema 可以在组件的 `schema()` 方法中定义：

```php
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\TextInput;

Repeater::make('members')
    ->schema([
        TextInput::make('name')->required(),
        // ...
    ])
```

如果你希望定义一个包含多个 schema 块且可以按任意顺序重复的重复器，请使用[构建器](builder)。

## 设置空的默认项

重复器可以默认创建一定数量的空项。默认值仅在 schema 加载时没有数据的情况下使用。在标准的[面板资源](../resources/overview)中，默认值用于创建页面，而非编辑页面。要使用默认项，请将项的数量传递给 `defaultItems()` 方法：

```php
use Filament\Forms\Components\Repeater;

Repeater::make('members')
    ->schema([
        // ...
    ])
    ->defaultItems(3)
```

:::tip
`defaultItems()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

## 添加项

重复器下方会显示一个操作按钮，允许用户添加新项。

## 设置添加操作按钮的标签

你可以使用 `addActionLabel()` 方法来自定义添加重复器项按钮中显示的文本：

```php
use Filament\Forms\Components\Repeater;

Repeater::make('members')
    ->schema([
        // ...
    ])
    ->addActionLabel('Add member')
```

:::tip
`addActionLabel()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

### 对齐添加操作按钮

默认情况下，添加操作按钮居中对齐。你可以使用 `addActionAlignment()` 方法进行调整，传入 `Alignment::Start` 或 `Alignment::End` 作为 `Alignment` 选项：

```php
use Filament\Forms\Components\Repeater;
use Filament\Support\Enums\Alignment;

Repeater::make('members')
    ->schema([
        // ...
    ])
    ->addActionAlignment(Alignment::Start)
```

:::tip
`addActionAlignment()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

![添加操作按钮左对齐的重复器](/assets/filament/v4.x/screenshots/images/light/forms/fields/repeater/add-action-alignment.jpg)

### 阻止用户添加项

你可以使用 `addable(false)` 方法阻止用户向重复器添加项：

```php
use Filament\Forms\Components\Repeater;

Repeater::make('members')
    ->schema([
        // ...
    ])
    ->addable(false)
```

:::tip
`addable()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

## 删除项

每个项上会显示一个操作按钮，允许用户删除该项。

### 阻止用户删除项

你可以使用 `deletable(false)` 方法阻止用户从重复器中删除项：

```php
use Filament\Forms\Components\Repeater;

Repeater::make('members')
    ->schema([
        // ...
    ])
    ->deletable(false)
```

:::tip
`deletable()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

## 重新排序项

每个项上会显示一个按钮，允许用户通过拖放在列表中重新排序。

### 阻止用户重新排序项

你可以使用 `reorderable(false)` 方法阻止用户重新排序重复器中的项：

```php
use Filament\Forms\Components\Repeater;

Repeater::make('members')
    ->schema([
        // ...
    ])
    ->reorderable(false)
```

:::tip
`reorderable()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

### 使用按钮重新排序项

你可以使用 `reorderableWithButtons()` 方法启用通过按钮上下移动来重新排序项的功能：

```php
use Filament\Forms\Components\Repeater;

Repeater::make('members')
    ->schema([
        // ...
    ])
    ->reorderableWithButtons()
```

![可通过按钮重新排序的重复器](/assets/filament/v4.x/screenshots/images/light/forms/fields/repeater/reorderable-with-buttons.jpg)

你也可以传递一个布尔值来控制是否应该使用按钮排序：

```php
use Filament\Forms\Components\Repeater;

Repeater::make('members')
    ->schema([
        // ...
    ])
    ->reorderableWithButtons(FeatureFlag::active())
```

:::tip
`reorderableWithButtons()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

### 阻止通过拖放重新排序

你可以使用 `reorderableWithDragAndDrop(false)` 方法阻止通过拖放来排序项：

```php
use Filament\Forms\Components\Repeater;

Repeater::make('members')
    ->schema([
        // ...
    ])
    ->reorderableWithDragAndDrop(false)
```

:::tip
`reorderableWithDragAndDrop()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

## 折叠项

重复器可以设置为 `collapsible()` 以在长表单中可选地隐藏内容：

```php
use Filament\Forms\Components\Repeater;

Repeater::make('qualifications')
    ->schema([
        // ...
    ])
    ->collapsible()
```

![可折叠的重复器](/assets/filament/v4.x/screenshots/images/light/forms/fields/repeater/collapsible.jpg)

你也可以默认折叠所有项：

```php
use Filament\Forms\Components\Repeater;

Repeater::make('qualifications')
    ->schema([
        // ...
    ])
    ->collapsed()
```

![已折叠的重复器](/assets/filament/v4.x/screenshots/images/light/forms/fields/repeater/collapsed.jpg)

`collapsible()` 和 `collapsed()` 方法也接受布尔值来控制是否可折叠和是否折叠：

```php
use Filament\Forms\Components\Repeater;

Repeater::make('qualifications')
    ->schema([
        // ...
    ])
    ->collapsible(FeatureFlag::active())
    ->collapsed(FeatureFlag::active())
```

:::tip
`collapsible()` 和 `collapsed()` 方法除了接受静态值外，还接受函数来动态计算。你可以将各种工具注入到函数参数中。
:::

## 克隆项

你可以使用 `cloneable()` 方法允许重复器项被复制：

```php
use Filament\Forms\Components\Repeater;

Repeater::make('qualifications')
    ->schema([
        // ...
    ])
    ->cloneable()
```

![可克隆的重复器](/assets/filament/v4.x/screenshots/images/light/forms/fields/repeater/cloneable.jpg)

`cloneable()` 方法也接受布尔值来控制是否可克隆：

```php
use Filament\Forms\Components\Repeater;

Repeater::make('qualifications')
    ->schema([
        // ...
    ])
    ->cloneable(FeatureFlag::active())
```

:::tip
`cloneable()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

## 与 Eloquent 关联集成

你可以使用 `Repeater` 的 `relationship()` 方法来配置 `HasMany` 关联。Filament 会从关联中加载项数据，并在表单提交时将其保存回关联。如果没有向 `relationship()` 传递自定义关联名称，Filament 将使用字段名称作为关联名称：

```php
use Filament\Forms\Components\Repeater;

Repeater::make('qualifications')
    ->relationship()
    ->schema([
        // ...
    ])
```

### 在关联中重新排序项

默认情况下，关联重复器项的[重新排序](#重新排序项)是禁用的。这是因为你的关联模型需要一个 `sort` 列来存储关联记录的顺序。要启用重新排序，你可以使用 `orderColumn()` 方法，传入关联模型中用于存储顺序的列名：

```php
use Filament\Forms\Components\Repeater;

Repeater::make('qualifications')
    ->relationship()
    ->schema([
        // ...
    ])
    ->orderColumn('sort')
```

如果你使用类似 [`spatie/eloquent-sortable`](https://github.com/spatie/eloquent-sortable) 的包，其排序列名为 `order_column`，你可以将其传入 `orderColumn()`：

```php
use Filament\Forms\Components\Repeater;

Repeater::make('qualifications')
    ->relationship()
    ->schema([
        // ...
    ])
    ->orderColumn('order_column')
```

:::tip
`orderColumn()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

### 与 `BelongsToMany` Eloquent 关联集成

一个常见的误解是，将 `BelongsToMany` 关联与重复器一起使用与 `HasMany` 关联一样简单。事实并非如此，因为 `BelongsToMany` 关联需要一个中间表来存储关联数据。重复器将数据保存到关联模型，而不是中间表。因此，如果你想将每个重复器项映射到中间表中的一行，你必须使用带有中间模型的 `HasMany` 关联来配合 `BelongsToMany` 关联使用重复器。

假设你有一个创建新 `Order` 模型的表单。每个订单属于多个 `Product` 模型，每个产品也属于多个订单。你有一个 `order_product` 中间表来存储关联数据。你不应该在重复器中使用 `products` 关联，而应该在 `Order` 模型上创建一个名为 `orderProducts` 的新关联，并在重复器中使用它：

```php
use Illuminate\Database\Eloquent\Relations\HasMany;

public function orderProducts(): HasMany
{
    return $this->hasMany(OrderProduct::class);
}
```

如果你还没有 `OrderProduct` 中间模型，你应该创建一个，并建立到 `Order` 和 `Product` 的反向关联：

```php
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

class OrderProduct extends Pivot
{
    public $incrementing = true;

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
```

:::info
请确保你的中间模型有一个主键列（如 `id`），以便 Filament 能够跟踪哪些重复器项已被创建、更新和删除。为确保 Filament 能跟踪主键，中间模型需要将 `$incrementing` 属性设置为 `true`。
:::

现在你可以将 `orderProducts` 关联与重复器一起使用，它会将数据保存到 `order_product` 中间表：

```php
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;

Repeater::make('orderProducts')
    ->relationship()
    ->schema([
        Select::make('product_id')
            ->relationship('product', 'name')
            ->required(),
        // ...
    ])
```

### 在填充字段前修改关联项数据

你可以使用 `mutateRelationshipDataBeforeFillUsing()` 方法在关联项数据填充到字段之前对其进行修改。该方法接受一个闭包，闭包通过 `$data` 变量接收当前项的数据。你必须返回修改后的数据数组：

```php
use Filament\Forms\Components\Repeater;

Repeater::make('qualifications')
    ->relationship()
    ->schema([
        // ...
    ])
    ->mutateRelationshipDataBeforeFillUsing(function (array $data): array {
        $data['user_id'] = auth()->id();

        return $data;
    })
```

:::tip
你可以将各种工具注入到传递给 `mutateRelationshipDataBeforeFillUsing()` 的函数参数中。
:::

### 在创建前修改关联项数据

你可以使用 `mutateRelationshipDataBeforeCreateUsing()` 方法在新关联项创建到数据库之前修改其数据。该方法接受一个闭包，闭包通过 `$data` 变量接收当前项的数据。你可以选择返回修改后的数据数组，或返回 `null` 以阻止创建该项：

```php
use Filament\Forms\Components\Repeater;

Repeater::make('qualifications')
    ->relationship()
    ->schema([
        // ...
    ])
    ->mutateRelationshipDataBeforeCreateUsing(function (array $data): array {
        $data['user_id'] = auth()->id();

        return $data;
    })
```

:::tip
你可以将各种工具注入到传递给 `mutateRelationshipDataBeforeCreateUsing()` 的函数参数中。
:::

### 在保存前修改关联项数据

你可以使用 `mutateRelationshipDataBeforeSaveUsing()` 方法在现有关联项保存到数据库之前修改其数据。该方法接受一个闭包，闭包通过 `$data` 变量接收当前项的数据。你可以选择返回修改后的数据数组，或返回 `null` 以阻止保存该项：

```php
use Filament\Forms\Components\Repeater;

Repeater::make('qualifications')
    ->relationship()
    ->schema([
        // ...
    ])
    ->mutateRelationshipDataBeforeSaveUsing(function (array $data): array {
        $data['user_id'] = auth()->id();

        return $data;
    })
```

:::tip
你可以将各种工具注入到传递给 `mutateRelationshipDataBeforeSaveUsing()` 的函数参数中。
:::

### 在创建关联项后执行代码

你可以使用 `afterCreate()` 方法在新关联项创建到数据库后执行代码。该方法接受一个闭包，闭包通过 `$data` 变量接收当前项的数据，通过 `$record` 变量接收新创建的记录。当你需要记录的 ID 来执行额外操作（如附加中间表数据）时，这很有用：

```php
use Filament\Forms\Components\Repeater;
use Illuminate\Database\Eloquent\Model;

Repeater::make('variants')
    ->relationship()
    ->schema([
        // ...
    ])
    ->afterCreate(function (array $data, Model $record): void {
        if (isset($data['attributes'])) {
            $record->attributes()->attach($data['attributes']);
        }
    })
```

:::tip
你可以将各种工具注入到传递给 `afterCreate()` 的函数参数中。
:::

### 在更新关联项后执行代码

你可以使用 `afterUpdate()` 方法在现有关联项更新到数据库后执行代码。该方法接受一个闭包，闭包通过 `$data` 变量接收当前项的数据，通过 `$record` 变量接收更新后的记录：

```php
use Filament\Forms\Components\Repeater;
use Illuminate\Database\Eloquent\Model;

Repeater::make('variants')
    ->relationship()
    ->schema([
        // ...
    ])
    ->afterUpdate(function (array $data, Model $record): void {
        if (isset($data['attributes'])) {
            $record->attributes()->sync($data['attributes']);
        }
    })
```

:::tip
你可以将各种工具注入到传递给 `afterUpdate()` 的函数参数中。
:::

### 在删除关联项后执行代码

你可以使用 `afterDelete()` 方法在关联项从数据库删除后执行代码。该方法接受一个闭包，闭包通过 `$record` 变量接收刚被删除的记录。此时该记录已不存在于数据库中，但你仍然可以访问其属性，如 ID：

```php
use Filament\Forms\Components\Repeater;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

Repeater::make('attachments')
    ->relationship()
    ->schema([
        // ...
    ])
    ->afterDelete(function (Model $record): void {
        Storage::delete($record->file_path);
    })
```

:::tip
你可以将各种工具注入到传递给 `afterDelete()` 的函数参数中。
:::

### 在检索后修改关联记录

你可以使用 `modifyRecordsUsing` 参数在关联记录从数据库检索后对其进行过滤或修改。该方法接受一个函数，函数接收一个关联记录的 `Collection`。你应该返回修改后的集合。

当你需要将记录限制为特定组或类别，而又不想在数据库查询中这样做（如果记录已经被预加载，这会触发额外的查询）时，这尤其有用：

```php
use Filament\Forms\Components\Repeater;
use Illuminate\Database\Eloquent\Collection;

Repeater::make('startItems')
    ->relationship(name: 'items', modifyRecordsUsing: fn (Collection $records): Collection => $records->where('group', 'start')),
Repeater::make('endItems')
    ->relationship(name: 'items', modifyRecordsUsing: fn (Collection $records): Collection => $records->where('group', 'end')),
```

:::tip
你可以将各种工具注入到传递给 `modifyRecordsUsing` 的函数参数中。
:::

## 网格布局

你可以使用 `grid()` 方法将重复器项组织成列：

```php
use Filament\Forms\Components\Repeater;

Repeater::make('qualifications')
    ->schema([
        // ...
    ])
    ->grid(2)
```

![具有 2 列网格布局的重复器](/assets/filament/v4.x/screenshots/images/light/forms/fields/repeater/grid.jpg)

该方法接受与[网格](../schemas/layouts#网格系统)的 `columns()` 方法相同的选项。这允许你在不同断点处响应式地自定义网格列数。

:::tip
`grid()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

## 根据内容为重复器项添加标签

你可以使用 `itemLabel()` 方法为重复器项添加标签。该方法接受一个闭包，闭包通过 `$state` 变量接收当前项的数据。你必须返回一个字符串作为项标签：

```php
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Select;

Repeater::make('members')
    ->schema([
        TextInput::make('name')
            ->required()
            ->live(onBlur: true),
        Select::make('role')
            ->options([
                'member' => 'Member',
                'administrator' => 'Administrator',
                'owner' => 'Owner',
            ])
            ->required(),
    ])
    ->columns(2)
    ->itemLabel(fn (array $state): ?string => $state['name'] ?? null),
```

:::tip
如果你希望在使用表单时实时看到项标签更新，你从 `$state` 中使用的任何字段都应该是 `live()` 的。
:::

:::tip
你可以将各种工具注入到传递给 `itemLabel()` 的函数参数中。
:::

![带有项标签的重复器](/assets/filament/v4.x/screenshots/images/light/forms/fields/repeater/labelled.jpg)

## 为重复器项编号

你可以使用 `itemNumbers()` 方法在标签旁边添加重复器项的编号：

```php
use Filament\Forms\Components\Repeater;

Repeater::make('members')
    ->schema([
        // ...
    ])
    ->itemNumbers()
```

![带有编号的重复器](/assets/filament/v4.x/screenshots/images/light/forms/fields/repeater/numbered.jpg)

## 单字段的简单重复器

你可以使用 `simple()` 方法创建一个单字段的简单重复器，使用简洁的设计：

```php
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\TextInput;

Repeater::make('invitations')
    ->simple(
        TextInput::make('email')
            ->email()
            ->required(),
    )
```

:::tip
`simple()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

![只有单字段的简单重复器设计](/assets/filament/v4.x/screenshots/images/light/forms/fields/repeater/simple-one-field.jpg)

简单重复器使用扁平的值数组而不是嵌套数组来存储数据。这意味着上面示例的数据结构可能如下：

```php
[
    'invitations' => [
        'dan@filamentphp.com',
        'ryan@filamentphp.com',
    ],
],
```

## 使用 `$get()` 访问父字段值

所有表单组件都可以[使用 `$get()` 和 `$set()`](overview#注入另一个字段的状态)来访问另一个字段的值。但是，在重复器的 schema 内部使用时，你可能会遇到意外行为。

这是因为 `$get()` 和 `$set()` 默认限定在当前重复器项的范围内。这意味着你可以轻松地与该重复器项中的另一个字段交互，而无需知道当前表单组件属于哪个重复器项。

这样做的结果是，当你无法与重复器外部的字段交互时可能会感到困惑。我们使用 `../` 语法来解决这个问题 - `$get('../parent_field_name')`。

假设你的表单有以下数据结构：

```php
[
    'client_id' => 1,

    'repeater' => [
        'item1' => [
            'service_id' => 2,
        ],
    ],
]
```

你试图从重复器项内部获取 `client_id` 的值。

`$get()` 是相对于当前重复器项的，所以 `$get('client_id')` 查找的是 `$get('repeater.item1.client_id')`。

你可以使用 `../` 在数据结构中上升一级，所以 `$get('../client_id')` 等于 `$get('repeater.client_id')`，而 `$get('../../client_id')` 等于 `$get('client_id')`。

特殊情况：`$get()` 不传参数，或 `$get('')` 或 `$get('./')`，将始终返回当前重复器项的完整数据数组。

## 表格重复器

你可以使用 `table()` 方法将重复器项以表格形式呈现，该方法接受一个 `TableColumn` 对象数组。这些对象代表表格的列，对应于重复器 schema 中的任何组件：

```php
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Repeater\TableColumn;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;

Repeater::make('members')
    ->table([
        TableColumn::make('Name'),
        TableColumn::make('Role'),
    ])
    ->schema([
        TextInput::make('name')
            ->required(),
        Select::make('role')
            ->options([
                'member' => 'Member',
                'administrator' => 'Administrator',
                'owner' => 'Owner',
            ])
            ->required(),
    ])
```

![表格布局的重复器](/assets/filament/v4.x/screenshots/images/light/forms/fields/repeater/table.jpg)

表格头部显示的标签通过 `TableColumn::make()` 方法传入。如果你想为列提供无障碍标签但不想显示它，可以使用 `hiddenHeaderLabel()` 方法：

```php
use Filament\Forms\Components\Repeater\TableColumn;

TableColumn::make('Name')
    ->hiddenHeaderLabel()
```

如果你想用红色星号将列标记为"必填"，可以使用 `markAsRequired()` 方法：

```php
use Filament\Forms\Components\Repeater\TableColumn;

TableColumn::make('Name')
    ->markAsRequired()
```

你可以使用 `wrapHeader()` 方法启用列标题换行：

```php
use Filament\Forms\Components\Repeater\TableColumn;

TableColumn::make('Name')
    ->wrapHeader()
```

你也可以使用 `alignment()` 方法调整列标题的对齐方式，传入 `Alignment::Start`、`Alignment::Center` 或 `Alignment::End` 作为 `Alignment` 选项：

```php
use Filament\Forms\Components\Repeater\TableColumn;
use Filament\Support\Enums\Alignment;

TableColumn::make('Name')
    ->alignment(Alignment::Start)
```

你可以使用 `width()` 方法设置固定的列宽，传入一个表示列宽的字符串值。该值直接传递给列标题的 `style` 属性：

```php
use Filament\Forms\Components\Repeater\TableColumn;

TableColumn::make('Name')
    ->width('200px')
```

### 紧凑表格重复器

你可以使用 `compact()` 方法使表格重复器更紧凑，以便在更小的空间中容纳更多数据：

```php
use Filament\Forms\Components\Repeater;

Repeater::make('members')
    ->table([
        // ...
    ])
    ->compact()
    ->schema([
        // ...
    ])
```

你也可以传递一个布尔值来控制表格重复器是否紧凑：

```php
use Filament\Forms\Components\Repeater;

Repeater::make('members')
    ->table([
        // ...
    ])
    ->compact(FeatureFlag::active())
    ->schema([
        // ...
    ])
```

:::tip
`compact()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

![紧凑表格布局的重复器](/assets/filament/v4.x/screenshots/images/light/forms/fields/repeater/table-compact.jpg)

## 重复器验证

除了[验证](validation)页面上列出的所有规则外，还有一些特定于重复器的额外规则。

### 项数验证

你可以通过设置 `minItems()` 和 `maxItems()` 方法来验证重复器中可以拥有的最小和最大项数：

```php
use Filament\Forms\Components\Repeater;

Repeater::make('members')
    ->schema([
        // ...
    ])
    ->minItems(2)
    ->maxItems(5)
```

:::tip
`minItems()` 和 `maxItems()` 方法除了接受静态值外，还接受函数来动态计算。你可以将各种工具注入到函数参数中。
:::

### 不同状态验证

在许多情况下，你需要确保重复器项之间具有某种唯一性。一些常见的例子可能是：

- 确保重复器中一次只有一个[复选框](checkbox)或[开关](toggle)被激活。
- 确保重复器中的[选择器](select)、[单选按钮](radio)、[复选框列表](checkbox-list)或[开关按钮](toggle-buttons)字段中的某个选项只能被选择一次。

你可以使用 `distinct()` 方法来验证字段的状态在重复器所有项中是唯一的：

```php
use Filament\Forms\Components\Checkbox;
use Filament\Forms\Components\Repeater;

Repeater::make('answers')
    ->schema([
        // ...
        Checkbox::make('is_correct')
            ->distinct(),
    ])
```

`distinct()` 验证的行为取决于字段处理的数据类型：

- 如果字段返回布尔值，如[复选框](checkbox)或[开关](toggle)，验证将确保只有一个项的值为 `true`。重复器中可以有多个字段的值为 `false`。
- 否则，对于[选择器](select)、[单选按钮](radio)、[复选框列表](checkbox-list)或[开关按钮](toggle-buttons)等字段，验证将确保每个选项在重复器所有项中只能被选择一次。

你也可以传递一个布尔值给 `distinct()` 方法来控制字段是否应该是唯一的：

```php
use Filament\Forms\Components\Checkbox;

Checkbox::make('is_correct')
    ->distinct(FeatureFlag::active())
```

:::tip
`distinct()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

#### 自动修复非唯一状态

如果你想自动修复非唯一状态，可以使用 `fixIndistinctState()` 方法：

```php
use Filament\Forms\Components\Checkbox;
use Filament\Forms\Components\Repeater;

Repeater::make('answers')
    ->schema([
        // ...
        Checkbox::make('is_correct')
            ->fixIndistinctState(),
    ])
```

此方法会自动在字段上启用 `distinct()` 和 `live()` 方法。

根据字段处理的数据类型，`fixIndistinctState()` 的行为会有所不同：

- 如果字段返回布尔值，如[复选框](checkbox)或[开关](toggle)，并且其中一个字段已启用，Filament 将自动代表用户禁用所有其他已启用的字段。
- 否则，对于[选择器](select)、[单选按钮](radio)、[复选框列表](checkbox-list)或[开关按钮](toggle-buttons)等字段，当用户选择一个选项时，Filament 将自动代表用户取消选择该选项的所有其他使用。

你也可以传递一个布尔值给 `fixIndistinctState()` 方法来控制是否修复非唯一状态：

```php
use Filament\Forms\Components\Checkbox;

Checkbox::make('is_correct')
    ->fixIndistinctState(FeatureFlag::active())
```

:::tip
`fixIndistinctState()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

#### 当选项已在其他项中选中时禁用

如果你想在[选择器](select)、[单选按钮](radio)、[复选框列表](checkbox-list)或[开关按钮](toggle-buttons)中的选项已被其他项选中时禁用它们，可以使用 `disableOptionsWhenSelectedInSiblingRepeaterItems()` 方法：

```php
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;

Repeater::make('members')
    ->schema([
        Select::make('role')
            ->options([
                // ...
            ])
            ->disableOptionsWhenSelectedInSiblingRepeaterItems(),
    ])
```

此方法会自动在字段上启用 `distinct()` 和 `live()` 方法。

:::warning
如果你想添加另一个[禁用选项](select#禁用特定选项)的条件，可以使用 `merge: true` 参数链式调用 `disableOptionWhen()`：

```php
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;

Repeater::make('members')
    ->schema([
        Select::make('role')
            ->options([
                // ...
            ])
            ->disableOptionsWhenSelectedInSiblingRepeaterItems()
            ->disableOptionWhen(fn (string $value): bool => $value === 'super_admin', merge: true),
    ])
```
:::

## 自定义重复器项操作

此字段使用操作对象来自定义其中的按钮。你可以通过向操作注册方法传递函数来自定义这些按钮。该函数可以访问 `$action` 对象，你可以使用它来[自定义操作](../actions/overview)。以下方法可用于自定义操作：

- `addAction()`
- `cloneAction()`
- `collapseAction()`
- `collapseAllAction()`
- `deleteAction()`
- `expandAction()`
- `expandAllAction()`
- `moveDownAction()`
- `moveUpAction()`
- `reorderAction()`

以下是自定义操作的示例：

```php
use Filament\Actions\Action;
use Filament\Forms\Components\Repeater;

Repeater::make('members')
    ->schema([
        // ...
    ])
    ->collapseAllAction(
        fn (Action $action) => $action->label('Collapse all members'),
    )
```

:::tip
操作注册方法可以将各种工具注入到函数参数中。
:::

### 使用模态框确认重复器操作

你可以使用操作对象上的 `requiresConfirmation()` 方法通过模态框确认操作。你可以使用任何[模态框自定义方法](../actions/modals)来更改其内容和行为：

```php
use Filament\Actions\Action;
use Filament\Forms\Components\Repeater;

Repeater::make('members')
    ->schema([
        // ...
    ])
    ->deleteAction(
        fn (Action $action) => $action->requiresConfirmation(),
    )
```

:::info
`collapseAction()`、`collapseAllAction()`、`expandAction()`、`expandAllAction()` 和 `reorderAction()` 方法不支持确认模态框，因为点击它们的按钮不会发起显示模态框所需的网络请求。
:::

### 向重复器添加额外的项操作

你可以通过将 `Action` 对象传递给 `extraItemActions()` 来向每个重复器项的头部添加新的[操作按钮](../actions/overview)：

```php
use Filament\Actions\Action;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\TextInput;
use Filament\Support\Icons\Heroicon;
use Illuminate\Support\Facades\Mail;

Repeater::make('members')
    ->schema([
        TextInput::make('email')
            ->label('Email address')
            ->email(),
        // ...
    ])
    ->extraItemActions([
        Action::make('sendEmail')
            ->icon(Heroicon::Envelope)
            ->action(function (array $arguments, Repeater $component): void {
                $itemData = $component->getItemState($arguments['item']);

                Mail::to($itemData['email'])
                    ->send(
                        // ...
                    );
            }),
    ])
```

在此示例中，`$arguments['item']` 给出当前重复器项的 ID。你可以使用重复器组件上的 `getItemState()` 方法验证该重复器项中的数据。此方法返回该项的已验证数据。如果该项无效，它将取消操作并在表单中显示该项目的错误消息。

如果你想在不验证的情况下获取当前项的原始数据，可以改用 `$component->getRawItemState($arguments['item'])`。

如果你想操作整个重复器的原始数据，例如添加、删除或修改项，可以使用 `$component->getState()` 获取数据，使用 `$component->state($state)` 再次设置：

```php
use Illuminate\Support\Str;

// 获取整个重复器的原始数据
$state = $component->getState();

// 添加一个项，使用随机 UUID 作为键
$state[Str::uuid()] = [
    'email' => auth()->user()->email,
];

// 设置重复器的新数据
$component->state($state);
```
