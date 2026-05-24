---
title: 过滤器布局
---

## 将过滤器定位到网格列中

要更改过滤器可占用的列数，你可以使用 `filtersFormColumns()` 方法：

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->filters([
            // ...
        ])
        ->filtersFormColumns(3);
}
```

![带网格列过滤器的表格](/assets/filament/v4.x/screenshots/images/light/tables/filters/grid-columns.jpg)

## 控制过滤器下拉菜单的宽度

要自定义下拉菜单宽度，你可以使用 `filtersFormWidth()` 方法，并指定宽度——`ExtraSmall`、`Small`、`Medium`、`Large`、`ExtraLarge`、`TwoExtraLarge`、`ThreeExtraLarge`、`FourExtraLarge`、`FiveExtraLarge`、`SixExtraLarge` 或 `SevenExtraLarge`。默认宽度为 `ExtraSmall`：

```php
use Filament\Support\Enums\Width;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->filters([
            // ...
        ])
        ->filtersFormWidth(Width::FourExtraLarge);
}
```

## 控制过滤器下拉菜单的最大高度

要为过滤器下拉菜单内容添加最大高度使其可滚动，你可以使用 `filtersFormMaxHeight()` 方法，传递一个 [CSS 长度值](https://developer.mozilla.org/en-US/docs/Web/CSS/length)：

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->filters([
            // ...
        ])
        ->filtersFormMaxHeight('400px');
}
```

## 在模态框中显示过滤器

要在模态框中渲染过滤器而不是在下拉菜单中，你可以使用：

```php
use Filament\Tables\Enums\FiltersLayout;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->filters([
            // ...
        ], layout: FiltersLayout::Modal);
}
```

![带模态框过滤器的表格](/assets/filament/v4.x/screenshots/images/light/tables/filters/modal.jpg)

你可以使用[触发操作 API](overview#自定义过滤器触发操作)来[自定义模态框](../../actions/modals)，包括[使用 `slideOver()`](../../actions/modals#使用滑出式面板代替模态框)。

## 在表格内容上方显示过滤器

要在表格内容上方渲染过滤器而不是在下拉菜单中，你可以使用：

```php
use Filament\Tables\Enums\FiltersLayout;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->filters([
            // ...
        ], layout: FiltersLayout::AboveContent);
}
```

![带上方过滤器的表格](/assets/filament/v4.x/screenshots/images/light/tables/filters/above-content.jpg)

### 允许表格内容上方的过滤器可折叠

要允许表格内容上方的过滤器可折叠，你可以使用：

```php
use Filament\Tables\Enums\FiltersLayout;

public function table(Table $table): Table
{
    return $table
        ->filters([
            // ...
        ], layout: FiltersLayout::AboveContentCollapsible);
}
```

![带可折叠上方过滤器的表格](/assets/filament/v4.x/screenshots/images/light/tables/filters/above-content-collapsible.jpg)

## 在表格内容下方显示过滤器

要在表格内容下方渲染过滤器而不是在下拉菜单中，你可以使用：

```php
use Filament\Tables\Enums\FiltersLayout;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->filters([
            // ...
        ], layout: FiltersLayout::BelowContent);
}
```

![带下方过滤器的表格](/assets/filament/v4.x/screenshots/images/light/tables/filters/below-content.jpg)

## 在表格内容左侧或右侧显示过滤器

要在表格内容左侧（之前）或右侧（之后）渲染过滤器而不是在下拉菜单中，你可以使用：

```php
use Filament\Tables\Enums\FiltersLayout;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->filters([
            // ...
        ], layout: FiltersLayout::BeforeContent); // 或 `FiltersLayout::AfterContent`
}
```

![带左侧过滤器的表格](/assets/filament/v4.x/screenshots/images/light/tables/filters/before-content.jpg)

![带右侧过滤器的表格](/assets/filament/v4.x/screenshots/images/light/tables/filters/after-content.jpg)

### 允许左侧或右侧过滤器可折叠

要允许在表格内容左侧或右侧显示的过滤器可折叠，你可以使用：

```php
use Filament\Tables\Enums\FiltersLayout;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->filters([
            // ...
        ], layout: FiltersLayout::BeforeContentCollapsible); // 或 `FiltersLayout::AfterContentCollapsible`
}
```

## 隐藏过滤器指示器

要隐藏表格上方的活动过滤器指示器，你可以使用 `hiddenFilterIndicators()`：

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->filters([
            // ...
        ])
        ->hiddenFilterIndicators();
}
```

## 自定义过滤器表单模式

你可以一次性自定义整个过滤器表单的[表单模式](../../schemas/layouts)，以便将过滤器重新排列为你想要的布局，并使用表单可用的任何[布局组件](../../schemas/layouts)。为此，请使用 `filterFormSchema()` 方法，传递一个闭包函数，该函数接收你可以插入的已定义 `$filters` 数组：

```php
use Filament\Schemas\Components\Section;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->filters([
            Filter::make('is_featured'),
            Filter::make('published_at'),
            Filter::make('author'),
        ])
        ->filtersFormColumns(2)
        ->filtersFormSchema(fn (array $filters): array => [
            Section::make('Visibility')
                ->description('These filters affect the visibility of the records in the table.')
                ->schema([
                    $filters['is_featured'],
                    $filters['published_at'],
                ])
                    ->columns(2)
                ->columnSpanFull(),
            $filters['author'],
        ]);
}
```

在此示例中，我们将两个过滤器放在一个[分组](../../schemas/sections)组件内，并使用 `columns()` 方法指定该分组应有两列。我们还使用了 `columnSpanFull()` 方法指定该分组应跨越过滤器表单的完整宽度（也是 2 列宽）。我们通过使用过滤器名称作为 `$filters` 数组中的键将每个过滤器插入到表单模式中。

![带自定义过滤器表单模式的表格](/assets/filament/v4.x/screenshots/images/light/tables/filters/custom-form-schema.jpg)

## 在页脚显示重置操作

默认情况下，重置操作出现在过滤器表单的头部。你可以使用 `filtersResetActionPosition()` 方法将其移动到页脚，与应用操作并排：

```php
use Filament\Tables\Enums\FiltersResetActionPosition;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->filters([
            // ...
        ])
        ->filtersResetActionPosition(FiltersResetActionPosition::Footer);
}
```
