---
title: 查询构建器
---

## 简介

查询构建器允许你定义一组复杂的条件来筛选表格中的数据。它能够处理无限嵌套的条件，你可以使用"and"和"or"操作将它们组合在一起。

![查询构建器过滤器](/assets/filament/v4.x/screenshots/images/light/tables/filters/query-builder.jpg)

要使用它，你需要定义一组"约束"来筛选数据。Filament 包含一些内置约束，遵循常见的数据类型，但你也可以定义自己的自定义约束。

你可以使用 `QueryBuilder` 过滤器向任何表格添加查询构建器：

```php
use Filament\Tables\Filters\QueryBuilder;
use Filament\QueryBuilder\Constraints\BooleanConstraint;
use Filament\QueryBuilder\Constraints\DateConstraint;
use Filament\QueryBuilder\Constraints\NumberConstraint;
use Filament\QueryBuilder\Constraints\RelationshipConstraint;
use Filament\QueryBuilder\Constraints\RelationshipConstraint\Operators\IsRelatedToOperator;
use Filament\QueryBuilder\Constraints\SelectConstraint;
use Filament\QueryBuilder\Constraints\TextConstraint;

QueryBuilder::make()
    ->constraints([
        TextConstraint::make('name'),
        BooleanConstraint::make('is_visible'),
        NumberConstraint::make('stock'),
        SelectConstraint::make('status')
            ->options([
                'draft' => 'Draft',
                'reviewing' => 'Reviewing',
                'published' => 'Published',
            ])
            ->multiple(),
        DateConstraint::make('created_at'),
        RelationshipConstraint::make('categories')
            ->multiple()
            ->selectable(
                IsRelatedToOperator::make()
                    ->titleAttribute('name')
                    ->searchable()
                    ->multiple(),
            ),
        NumberConstraint::make('reviews.rating')
            ->integer(),
    ])
```

当深度嵌套查询构建器时，你可能需要增加过滤器可占用的空间。一种方法是[将过滤器定位在表格内容上方](layout#displaying-filters-above-the-table-content)：

```php
use Filament\Tables\Enums\FiltersLayout;
use Filament\Tables\Filters\QueryBuilder;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->filters([
            QueryBuilder::make()
                ->constraints([
                    // ...
                ]),
        ], layout: FiltersLayout::AboveContent);
}
```

## 可用约束

Filament 附带了许多不同的约束，你可以开箱即用。你也可以[创建自己的自定义约束](#creating-custom-constraints)：

- [文本约束](#text-constraints)
- [布尔约束](#boolean-constraints)
- [数字约束](#number-constraints)
- [日期约束](#date-constraints)
- [选择约束](#select-constraints)
- [关联关系约束](#relationship-constraints)

### 文本约束

文本约束允许你筛选文本字段。它们可用于筛选任何文本字段，包括通过关联关系。

```php
use Filament\QueryBuilder\Constraints\TextConstraint;

TextConstraint::make('name') // 筛选 `name` 列

TextConstraint::make('creator.name') // 使用点语法筛选 `creator` 关联关系上的 `name` 列
```

默认情况下，以下操作符可用：

- 包含 - 筛选列包含搜索词
- 不包含 - 筛选列不包含搜索词
- 开头为 - 筛选列以搜索词开头
- 开头不为 - 筛选列不以搜索词开头
- 结尾为 - 筛选列以搜索词结尾
- 结尾不为 - 筛选列不以搜索词结尾
- 等于 - 筛选列等于搜索词
- 不等于 - 筛选列不等于搜索词
- 已填充 - 筛选列不为空
- 为空 - 筛选列为空

### 布尔约束

布尔约束允许你筛选布尔字段。它们可用于筛选任何布尔字段，包括通过关联关系。

```php
use Filament\QueryBuilder\Constraints\BooleanConstraint;

BooleanConstraint::make('is_visible') // 筛选 `is_visible` 列

BooleanConstraint::make('creator.is_admin') // 使用点语法筛选 `creator` 关联关系上的 `is_admin` 列
```

默认情况下，以下操作符可用：

- 为真 - 筛选列为 `true`
- 为假 - 筛选列为 `false`

### 数字约束

数字约束允许你筛选数字字段。它们可用于筛选任何数字字段，包括通过关联关系。

```php
use Filament\QueryBuilder\Constraints\NumberConstraint;

NumberConstraint::make('stock') // 筛选 `stock` 列

NumberConstraint::make('orders.item_count') // 使用点语法筛选 `orders` 关联关系上的 `item_count` 列
```

默认情况下，以下操作符可用：

- 最小值 - 筛选列大于或等于搜索数字
- 小于 - 筛选列小于搜索数字
- 最大值 - 筛选列小于或等于搜索数字
- 大于 - 筛选列大于搜索数字
- 等于 - 筛选列等于搜索数字
- 不等于 - 筛选列不等于搜索数字
- 已填充 - 筛选列不为空
- 为空 - 筛选列为空

当使用关联关系列配合数字约束时，用户还可以"聚合"相关记录。这意味着他们可以一次筛选列是所有相关记录的总和、平均值、最小值或最大值。

#### 整数约束

默认情况下，数字约束允许小数值。如果你只想允许整数值，可以使用 `integer()` 方法：

```php
use Filament\QueryBuilder\Constraints\NumberConstraint;

NumberConstraint::make('stock')
    ->integer()
```

### 日期约束

日期约束允许你筛选日期字段。它们可用于筛选任何日期字段，包括通过关联关系。

```php
use Filament\QueryBuilder\Constraints\DateConstraint;

DateConstraint::make('created_at') // 筛选 `created_at` 列

DateConstraint::make('creator.created_at') // 使用点语法筛选 `creator` 关联关系上的 `created_at` 列
```

默认情况下，以下操作符可用：

- 晚于 - 筛选列晚于搜索日期
- 不晚于 - 筛选列不晚于搜索日期，或为同一天
- 早于 - 筛选列早于搜索日期
- 不早于 - 筛选列不早于搜索日期，或为同一天
- 日期为 - 筛选列与搜索日期相同
- 日期不为 - 筛选列与搜索日期不同
- 月份为 - 筛选列与所选月份相同
- 月份不为 - 筛选列与所选月份不同
- 年份为 - 筛选列与搜索年份相同
- 年份不为 - 筛选列与搜索年份不同

#### 日期时间约束

默认情况下，日期约束仅按日期筛选。如果你有日期时间列并希望启用基于时间的筛选，可以使用 `time()` 方法：

```php
use Filament\QueryBuilder\Constraints\DateConstraint;

DateConstraint::make('published_at')
    ->time()
```

### 选择约束

选择约束允许你使用选择字段筛选字段。它们可用于筛选任何字段，包括通过关联关系。

```php
use Filament\QueryBuilder\Constraints\SelectConstraint;

SelectConstraint::make('status') // 筛选 `status` 列
    ->options([
        'draft' => 'Draft',
        'reviewing' => 'Reviewing',
        'published' => 'Published',
    ])

SelectConstraint::make('creator.department') // 使用点语法筛选 `creator` 关联关系上的 `department` 列
    ->options([
        'sales' => 'Sales',
        'marketing' => 'Marketing',
        'engineering' => 'Engineering',
        'purchasing' => 'Purchasing',
    ])
```

#### 可搜索的选择约束

默认情况下，选择约束不允许用户搜索选项。如果你想允许用户搜索选项，可以使用 `searchable()` 方法：

```php
use Filament\QueryBuilder\Constraints\SelectConstraint;

SelectConstraint::make('status')
    ->searchable()
    ->options([
        'draft' => 'Draft',
        'reviewing' => 'Reviewing',
        'published' => 'Published',
    ])
```

#### 多选约束

默认情况下，选择约束只允许用户选择单个选项。如果你想允许用户选择多个选项，可以使用 `multiple()` 方法：

```php
use Filament\QueryBuilder\Constraints\SelectConstraint;

SelectConstraint::make('status')
    ->multiple()
    ->options([
        'draft' => 'Draft',
        'reviewing' => 'Reviewing',
        'published' => 'Published',
    ])
```

当用户选择多个选项时，表格将筛选显示与任何选定选项匹配的记录。

### 关联关系约束

关联关系约束允许你使用关联关系数据筛选字段：

```php
use Filament\QueryBuilder\Constraints\RelationshipConstraint;
use Filament\QueryBuilder\Constraints\RelationshipConstraint\Operators\IsRelatedToOperator;

RelationshipConstraint::make('creator') // 筛选 `creator` 关联关系
    ->selectable(
        IsRelatedToOperator::make()
            ->titleAttribute('name')
            ->searchable()
            ->multiple(),
    )
```

`IsRelatedToOperator` 用于配置"是/包含"和"不是/不包含"操作符。它提供一个选择字段，允许用户通过关联的记录来筛选关联关系。`titleAttribute()` 方法用于指定应使用哪个属性来标识列表中的每个相关记录。`searchable()` 方法使列表可搜索。`multiple()` 方法允许用户选择多个相关记录，如果他们选择多个，表格将筛选显示与任何选定相关记录匹配的记录。

#### 多关联关系

默认情况下，关联关系约束仅包含适用于筛选单数关联关系（如 `BelongsTo`）的操作符。如果你有 `HasMany` 或 `BelongsToMany` 等关联关系，你可能希望将约束标记为 `multiple()`：

```php
use Filament\QueryBuilder\Constraints\RelationshipConstraint;

RelationshipConstraint::make('categories')
    ->multiple()
```

这将向约束添加以下操作符：

- 最少有 - 筛选列至少具有指定数量的相关记录
- 少于 - 筛选列少于指定数量的相关记录
- 最多有 - 筛选列最多具有指定数量的相关记录
- 多于 - 筛选列多于指定数量的相关记录
- 有 - 筛选列具有指定数量的相关记录
- 没有 - 筛选列没有指定数量的相关记录

#### 空关联关系约束

`RelationshipConstraint` 不像其他约束那样支持 [`nullable()`](#nullable-constraints)。

如果关联关系是 `multiple()`，那么约束将显示一个选项来筛选"空"关联关系。这意味着关联关系没有相关记录。如果你的关联关系是单数的，那么你可以使用 `emptyable()` 方法来显示一个筛选"空"关联关系的选项：

```php
use Filament\QueryBuilder\Constraints\RelationshipConstraint;

RelationshipConstraint::make('creator')
    ->emptyable()
```

如果你有一个 `multiple()` 关联关系必须始终至少有 1 个相关记录，那么你可以使用 `emptyable(false)` 方法来隐藏筛选"空"关联关系的选项：

```php
use Filament\QueryBuilder\Constraints\RelationshipConstraint;

RelationshipConstraint::make('categories')
    ->emptyable(false)
```

#### 可空约束

默认情况下，约束不会显示筛选 `null` 值的选项。如果你想显示筛选 `null` 值的选项，可以使用 `nullable()` 方法：

```php
use Filament\QueryBuilder\Constraints\TextConstraint;

TextConstraint::make('name')
    ->nullable()
```

现在，以下操作符也可用：

- 已填充 - 筛选列不为空
- 为空 - 筛选列为空

## 限定关联关系范围

当你使用关联关系约束时，你可以使用 `modifyRelationshipQueryUsing()` 方法限定关联关系的范围来筛选相关记录：

```php
use Filament\QueryBuilder\Constraints\TextConstraint;
use Illuminate\Database\Eloquent\Builder;

TextConstraint::make('creator.name')
    ->label('Admin creator name')
    ->modifyRelationshipQueryUsing(fn (Builder $query) => $query->where('is_admin', true))
```

## 自定义约束图标

每种约束类型都有一个默认[图标](../../styling/icons)，显示在选择器中标签旁边。你可以通过将图标名称传递给 `icon()` 方法来自定义约束的图标：

```php
use Filament\QueryBuilder\Constraints\TextConstraint;

TextConstraint::make('author.name')
    ->icon('heroicon-m-user')
```

## 覆盖默认操作符

每种约束类型都有一组默认操作符，你可以使用 `operators()` 方法来自定义它们：

```php
use Filament\QueryBuilder\Constraints\Operators\IsFilledOperator;
use Filament\QueryBuilder\Constraints\TextConstraint;

TextConstraint::make('author.name')
    ->operators([
        IsFilledOperator::make(),
    ])
```

这将移除所有默认操作符，并只注册 `IsFilledOperator`。

如果你想在列表末尾添加操作符，请使用 `pushOperators()`：

```php
use Filament\QueryBuilder\Constraints\Operators\IsFilledOperator;
use Filament\QueryBuilder\Constraints\TextConstraint;

TextConstraint::make('author.name')
    ->pushOperators([
        IsFilledOperator::class,
    ])
```

如果你想在列表开头添加操作符，请使用 `unshiftOperators()`：

```php
use Filament\QueryBuilder\Constraints\Operators\IsFilledOperator;
use Filament\QueryBuilder\Constraints\TextConstraint;

TextConstraint::make('author.name')
    ->unshiftOperators([
        IsFilledOperator::class,
    ])
```

## 创建自定义约束

自定义约束可以使用 `Constraint::make()` 方法与其他约束"内联"创建。你还应该通过 `icon()` 方法传递一个[图标](#customizing-the-constraint-icon)：

```php
use Filament\QueryBuilder\Constraints\Constraint;

Constraint::make('subscribed')
    ->icon('heroicon-m-bell')
    ->operators([
        // ...
    ]),
```

如果你想自定义约束的标签，可以使用 `label()` 方法：

```php
use Filament\QueryBuilder\Constraints\Constraint;

Constraint::make('subscribed')
    ->label('Subscribed to updates')
    ->icon('heroicon-m-bell')
    ->operators([
        // ...
    ]),
```

现在，你必须为约束[定义操作符](#creating-custom-operators)。这些是你可以选择用来筛选列的选项。如果列是[可空的](#nullable-constraints)，你也可以为自定义约束注册该内置操作符：

```php
use Filament\QueryBuilder\Constraints\Constraint;
use Filament\QueryBuilder\Constraints\Operators\IsFilledOperator;

Constraint::make('subscribed')
    ->label('Subscribed to updates')
    ->icon('heroicon-m-bell')
    ->operators([
        // ...
        IsFilledOperator::class,
    ]),
```

### 创建自定义操作符

自定义操作符可以使用 `Operator::make()` 方法创建：

```php
use Filament\QueryBuilder\Constraints\Operators\Operator;

Operator::make('subscribed')
    ->label(fn (bool $isInverse): string => $isInverse ? 'Not subscribed' : 'Subscribed')
    ->summary(fn (bool $isInverse): string => $isInverse ? 'You are not subscribed' : 'You are subscribed')
    ->baseQuery(fn (Builder $query, bool $isInverse) => $query->{$isInverse ? 'whereDoesntHave' : 'whereHas'}(
        'subscriptions.user',
        fn (Builder $query) => $query->whereKey(auth()->user()),
    )),
```

在此示例中，操作符能够根据认证用户是否订阅了记录来筛选记录。订阅记录在表格的 `subscriptions` 关联关系中。

`baseQuery()` 方法用于定义将用于筛选记录的查询。当选中"已订阅"选项时，`$isInverse` 参数为 `false`，当选中"未订阅"选项时为 `true`。该函数应用于表格的基础查询，可以使用 `whereHas()`。如果你的函数不需要应用于表格的基础查询，例如当你使用简单的 `where()` 或 `whereIn()` 时，你可以改用 `query()` 方法，它的额外好处是可以在嵌套的"OR"组中使用。

`label()` 方法用于在操作符选择中渲染选项。每个操作符注册两个选项，一个用于操作符未反转时，一个用于操作符反转时。

`summary()` 方法在约束应用于查询时用于约束的头部，提供活动约束的概述。

## 自定义约束选择器

### 更改约束选择器中的列数

约束选择器只有 1 列。你可以通过向 `constraintPickerColumns()` 传递列数来自定义它：

```php
use Filament\Tables\Filters\QueryBuilder;

QueryBuilder::make()
    ->constraintPickerColumns(2)
    ->constraints([
        // ...
    ])
```

此方法可以以几种不同的方式使用：

- 你可以传递一个整数，如 `constraintPickerColumns(2)`。此整数是 `lg` 断点及更高断点上使用的列数。所有较小的设备将只有 1 列。
- 你可以传递一个数组，其中键是断点，值是列数。例如，`constraintPickerColumns(['md' => 2, 'xl' => 4])` 将在中等设备上创建 2 列布局，在超大设备上创建 4 列布局。较小设备的默认断点使用 1 列，除非你使用 `default` 数组键。

断点（`sm`、`md`、`lg`、`xl`、`2xl`）由 Tailwind 定义，可以在 [Tailwind 文档](https://tailwindcss.com/docs/responsive-design#overview)中找到。

### 增加约束选择器的宽度

当你[增加列数](#changing-the-number-of-columns-in-the-constraint-picker)时，下拉菜单的宽度应逐渐增加以处理额外的列。如果你想更多控制，可以使用 `constraintPickerWidth()` 方法手动设置下拉菜单的最大宽度。选项对应于 [Tailwind 的最大宽度比例](https://tailwindcss.com/docs/max-width)。选项有 `xs`、`sm`、`md`、`lg`、`xl`、`2xl`、`3xl`、`4xl`、`5xl`、`6xl`、`7xl`：

```php
use Filament\Tables\Filters\QueryBuilder;

QueryBuilder::make()
    ->constraintPickerColumns(3)
    ->constraintPickerWidth('2xl')
    ->constraints([
        // ...
    ])
```
