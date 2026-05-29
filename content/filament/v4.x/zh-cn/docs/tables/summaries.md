---
title: 汇总
---

## 简介

你可以在表格内容下方渲染一个"汇总"部分。这对于显示计算结果非常有用，例如表格中数据的平均值、总和、计数和范围。

默认情况下，会有一行当前页面数据的汇总行，如果有多页数据，还会有一行所有数据的总计汇总行。你还可以为记录的[分组](grouping)添加汇总，请参阅["汇总行组"](#汇总行组)。

"汇总器"对象可以使用 `summarize()` 方法添加到任何[表格列](../columns/overview)：

```php
use Filament\Tables\Columns\Summarizers\Average;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('rating')
    ->summarize(Average::make())
```

多个"汇总器"可以添加到同一列：

```php
use Filament\Tables\Columns\Summarizers\Average;
use Filament\Tables\Columns\Summarizers\Range;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('rating')
    ->numeric()
    ->summarize([
        Average::make(),
        Range::make(),
    ])
```

> 表格的第一列不能使用汇总器。该列用于渲染汇总部分的标题和副标题。

![带汇总的表格](/assets/filament/v4.x/screenshots/images/light/tables/summaries.jpg)

## 可用汇总器

Filament 附带四种类型的汇总器：

- [平均值](#平均值)
- [计数](#计数)
- [范围](#范围)
- [总和](#总和)

你还可以[创建自己的自定义汇总器](#自定义汇总)以任何你希望的方式显示数据。

## 平均值

平均值可用于计算数据集中所有值的平均值：

```php
use Filament\Tables\Columns\Summarizers\Average;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('rating')
    ->summarize(Average::make())
```

在此示例中，表格中的所有评分将被相加并除以评分数量。

![带平均值汇总的表格](/assets/filament/v4.x/screenshots/images/light/tables/summaries/average.jpg)

## 计数

计数可用于查找数据集中值的总数。除非你只想计算行数，否则你可能还需要[限定数据集范围](#限定数据集范围)：

```php
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\Summarizers\Count;
use Illuminate\Database\Query\Builder;

IconColumn::make('is_published')
    ->boolean()
    ->summarize(
        Count::make()->query(fn (Builder $query) => $query->where('is_published', true)),
    ),
```

在此示例中，表格将计算已发布的文章数量。

### 计数图标的出现次数

在[图标列](columns/icon)上使用计数允许你使用 `icons()` 方法，该方法为用户提供表格中每个图标数量的视觉表示：

```php
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\Summarizers\Count;
use Illuminate\Database\Query\Builder;

IconColumn::make('is_published')
    ->boolean()
    ->summarize(Count::make()->icons()),
```

![带图标计数汇总的表格](/assets/filament/v4.x/screenshots/images/light/tables/summaries/count.jpg)

## 范围

范围可用于计算数据集中的最小值和最大值：

```php
use Filament\Tables\Columns\Summarizers\Range;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('price')
    ->summarize(Range::make())
```

在此示例中，将找到表格中的最低和最高价格。

![带范围汇总的表格](/assets/filament/v4.x/screenshots/images/light/tables/summaries/range.jpg)

### 日期范围

你可以使用 `minimalDateTimeDifference()` 方法将范围格式化为日期：

```php
use Filament\Tables\Columns\Summarizers\Range;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('created_at')
    ->dateTime()
    ->summarize(Range::make()->minimalDateTimeDifference())
```

此方法将呈现最小日期和最大日期之间的最小差异。例如：

- 如果最小日期和最大日期是不同的天，将只显示日期。
- 如果最小日期和最大日期在同一天但不同时间，将同时显示日期和时间。
- 如果最小日期和最大日期及时间完全相同，它们将只出现一次。

### 文本范围

你可以使用 `minimalTextualDifference()` 方法将范围格式化为文本：

```php
use Filament\Tables\Columns\Summarizers\Range;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('sku')
    ->summarize(Range::make()->minimalTextualDifference())
```

此方法将呈现最小值和最大值之间的最小差异。例如：

- 如果最小值和最大值以不同字母开头，将只显示首字母。
- 如果最小值和最大值以相同字母开头，将渲染更多文本直到找到差异。
- 如果最小值和最大值完全相同，它们将只出现一次。

### 在范围中包含空值

默认情况下，我们将从范围中排除空值。如果你想包含它们，可以使用 `excludeNull(false)` 方法：

```php
use Filament\Tables\Columns\Summarizers\Range;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('sku')
    ->summarize(Range::make()->excludeNull(false))
```

## 总和

总和可用于计算数据集中所有值的总和：

```php
use Filament\Tables\Columns\Summarizers\Sum;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('price')
    ->summarize(Sum::make())
```

在此示例中，表格中的所有价格将被相加。

![带总和汇总的表格](/assets/filament/v4.x/screenshots/images/light/tables/summaries/sum.jpg)

## 设置标签

你可以使用 `label()` 方法设置汇总器的标签：

```php
use Filament\Tables\Columns\Summarizers\Sum;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('price')
    ->summarize(Sum::make()->label('Total'))
```

### 隐藏汇总器的标签

将标签设置为空字符串来隐藏它可能很诱人，但不推荐这样做。将标签设置为空字符串不会向屏幕阅读器传达汇总器的目的，即使目的在视觉上是清晰的。相反，你应该使用 `hiddenLabel()` 方法，这样它在视觉上是隐藏的，但对屏幕阅读器仍然可访问：

```php
use Filament\Tables\Columns\Summarizers\Sum;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('price')
    ->summarize(Sum::make()->hiddenLabel())
```

你也可以有条件地隐藏标签：

```php
use Filament\Tables\Columns\Summarizers\Sum;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('price')
    ->summarize(Sum::make()->hiddenLabel(FeatureFlag::active()))
```

## 限定数据集范围

你可以使用 `query()` 方法将数据库查询作用域应用于汇总器的数据集：

```php
use Filament\Tables\Columns\Summarizers\Average;
use Filament\Tables\Columns\TextColumn;
use Illuminate\Database\Query\Builder;

TextColumn::make('rating')
    ->summarize(
        Average::make()->query(fn (Builder $query) => $query->where('is_published', true)),
    ),
```

在此示例中，现在只有 `is_published` 设置为 `true` 的行将用于计算平均值。

此功能对于[计数](#计数)汇总器特别有用，因为它可以计算数据集中有多少记录通过了测试：

```php
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\Summarizers\Count;
use Illuminate\Database\Query\Builder;

IconColumn::make('is_published')
    ->boolean()
    ->summarize(
        Count::make()->query(fn (Builder $query) => $query->where('is_published', true)),
    ),
```

在此示例中，表格将计算已发布的文章数量。

## 格式化

### 数字格式化

`numeric()` 方法允许你将条目格式化为数字：

```php
use Filament\Tables\Columns\Summarizers\Average;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('rating')
    ->summarize(Average::make()->numeric())
```

如果你想自定义用于格式化数字的小数位数，可以使用 `decimalPlaces` 参数：

```php
use Filament\Tables\Columns\Summarizers\Average;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('rating')
    ->summarize(Average::make()->numeric(
        decimalPlaces: 0,
    ))
```

默认情况下，你的应用程序的语言环境将用于适当地格式化数字。如果你想自定义使用的语言环境，可以将其传递给 `locale` 参数：

```php
use Filament\Tables\Columns\Summarizers\Average;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('rating')
    ->summarize(Average::make()->numeric(
        locale: 'nl',
    ))
```

### 货币格式化

`money()` 方法允许你轻松格式化任何货币的货币值：

```php
use Filament\Tables\Columns\Summarizers\Sum;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('price')
    ->summarize(Sum::make()->money('EUR'))
```

`money()` 还有一个 `divideBy` 参数，允许你在格式化之前将原始值除以某个数字。如果你的数据库以分为单位存储价格，这可能很有用：

```php
use Filament\Tables\Columns\Summarizers\Sum;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('price')
    ->summarize(Sum::make()->money('EUR', divideBy: 100))
```

默认情况下，你的应用程序的语言环境将用于适当地格式化货币。如果你想自定义使用的语言环境，可以将其传递给 `locale` 参数：

```php
use Filament\Tables\Columns\Summarizers\Average;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('price')
    ->summarize(Sum::make()->money('EUR', locale: 'nl'))
```

如果你想自定义用于格式化数字的小数位数，可以使用 `decimalPlaces` 参数：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('price')
    ->summarize(Sum::make()->money('EUR', decimalPlaces: 3))
```

### 限制文本长度

你可以使用 `limit()` 限制汇总值的长度：

```php
use Filament\Tables\Columns\Summarizers\Range;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('sku')
    ->summarize(Range::make()->limit(5))
```

### 添加前缀或后缀

你可以为汇总值添加前缀或后缀：

```php
use Filament\Tables\Columns\Summarizers\Sum;
use Filament\Tables\Columns\TextColumn;
use Illuminate\Support\HtmlString;

TextColumn::make('volume')
    ->summarize(Sum::make()
        ->prefix('Total volume: ')
        ->suffix(new HtmlString(' m&sup3;'))
    )
```

## 自定义汇总

你可以通过从 `using()` 方法返回值来创建自定义汇总：

```php
use Filament\Tables\Columns\Summarizers\Summarizer;
use Filament\Tables\Columns\TextColumn;
use Illuminate\Database\Query\Builder;

TextColumn::make('name')
    ->summarize(Summarizer::make()
        ->label('First last name')
        ->using(fn (Builder $query): string => $query->min('last_name')))
```

回调可以访问数据库 `$query` 构建器实例来执行计算。它应该返回要在表格中显示的值。

## 有条件地隐藏汇总

要隐藏汇总，你可以向 `hidden()` 方法传递一个布尔值或返回布尔值的函数。如果需要，你可以通过函数的 `$query` 参数访问该汇总器的 Eloquent 查询构建器实例：

```php
use Filament\Tables\Columns\Summarizers\Summarizer;
use Filament\Tables\Columns\TextColumn;
use Illuminate\Database\Eloquent\Builder;

TextColumn::make('sku')
    ->summarize(Summarizer::make()
        ->hidden(fn (Builder $query): bool => ! $query->exists()))
```

或者，你可以使用 `visible()` 方法来实现相反的效果：

```php
use Filament\Tables\Columns\Summarizers\Summarizer;
use Filament\Tables\Columns\TextColumn;
use Illuminate\Database\Eloquent\Builder;

TextColumn::make('sku')
    ->summarize(Summarizer::make()
        ->visible(fn (Builder $query): bool => $query->exists()))
```

## 汇总行组

你可以将汇总与[分组](grouping)一起使用，以显示组内记录的汇总。如果你选择在分组表格的列中添加汇总器，这将自动工作。

### 隐藏分组行并仅显示汇总

你可以使用 `groupsOnly()` 方法隐藏组内的行，只显示每个组的汇总。这在许多报告场景中非常有用。

```php
use Filament\Tables\Columns\Summarizers\Sum;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->columns([
            TextColumn::make('views_count')
                ->summarize(Sum::make()),
            TextColumn::make('likes_count')
                ->summarize(Sum::make()),
        ])
        ->defaultGroup('category')
        ->groupsOnly();
}
```

## 隐藏汇总行

默认情况下，当列有汇总器时，页面汇总行和总计汇总行都会显示。你可以使用表格上的 `summaries()` 方法控制显示哪些汇总行：

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->summaries(
            pageCondition: false,
            allTableCondition: false
        );
}
```

`pageCondition` 控制是否显示"本页"汇总行，`allTableCondition` 控制是否显示整个表格的总计汇总行。

当你使用[分组汇总](#汇总行组)且只想显示每组的汇总，或者页面汇总是多余的而你只需要所有记录的总计时，这很有用。
