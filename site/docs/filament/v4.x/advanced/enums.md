---
title: 枚举技巧
---

## 简介

枚举是表示固定常量集的特殊 PHP 类。它们对于建模只有有限数量可能值的概念非常有用，例如星期几、一年中的月份或一副扑克牌的花色。

由于枚举"案例"是枚举类的实例，向枚举添加接口被证明是非常有用的。Filament 提供了一组可以添加到枚举的接口，增强了你使用枚举的体验。

:::warning
在 Eloquent 模型上使用带属性的枚举时，请[确保正确进行了类型转换](https://laravel.com/docs/eloquent-mutators#enum-casting)。
:::

## 枚举标签

`HasLabel` 接口将枚举实例转换为文本标签。这对于在 UI 中显示人类可读的枚举值非常有用。

```php
use Filament\Support\Contracts\HasLabel;
use Illuminate\Contracts\Support\Htmlable;

enum Status: string implements HasLabel
{
    case Draft = 'draft';
    case Reviewing = 'reviewing';
    case Published = 'published';
    case Rejected = 'rejected';
    
    public function getLabel(): string | Htmlable | null
    {
        return $this->name;
        
        // 或
    
        return match ($this) {
            self::Draft => 'Draft',
            self::Reviewing => 'Reviewing',
            self::Published => 'Published',
            self::Rejected => 'Rejected',
        };
    }
}
```

### 在表单字段选项中使用枚举标签

`HasLabel` 接口可用于从枚举生成选项数组，其中枚举的值是键，枚举的标签是值。这适用于表单字段，如 [`Select`](../forms/select) 和 [`CheckboxList`](../forms/checkbox-list)，以及 Table Builder 的 [`SelectColumn`](../tables/columns/select) 和 [`SelectFilter`](../tables/filters/select)：

```php
use Filament\Forms\Components\CheckboxList;
use Filament\Forms\Components\Radio;
use Filament\Forms\Components\Select;
use Filament\Tables\Columns\SelectColumn;
use Filament\Tables\Filters\SelectFilter;

Select::make('status')
    ->options(Status::class)

CheckboxList::make('status')
    ->options(Status::class)

Radio::make('status')
    ->options(Status::class)

SelectColumn::make('status')
    ->options(Status::class)

SelectFilter::make('status')
    ->options(Status::class)
```

在这些示例中，`Status::class` 是实现了 `HasLabel` 的枚举类，选项由此生成：

```php
[
    'draft' => 'Draft',
    'reviewing' => 'Reviewing',
    'published' => 'Published',
    'rejected' => 'Rejected',
]
```

### 在表格的文本列中使用枚举标签

如果你在 Table Builder 中使用 [`TextColumn`](../tables/columns/text)，并且它在 Eloquent 模型中被转换为枚举，Filament 将自动使用 `HasLabel` 接口显示枚举的标签而不是其原始值。

### 在表格的分组标题中使用枚举标签

如果你在 Table Builder 中使用[分组](../tables/grouping)，并且它在 Eloquent 模型中被转换为枚举，Filament 将自动使用 `HasLabel` 接口显示枚举的标签而不是其原始值。标签将显示为[每个组的标题](../tables/grouping#setting-a-group-title)。

### 在信息列表的文本条目中使用枚举标签

如果你在信息列表中使用 [`TextEntry`](../infolists/text-entry)，并且它在 Eloquent 模型中被转换为枚举，Filament 将自动使用 `HasLabel` 接口显示枚举的标签而不是其原始值。

## 枚举颜色

`HasColor` 接口将枚举实例转换为[颜色](../styling/colors)。这对于在 UI 中显示彩色枚举值非常有用。

```php
use Filament\Support\Contracts\HasColor;

enum Status: string implements HasColor
{
    case Draft = 'draft';
    case Reviewing = 'reviewing';
    case Published = 'published';
    case Rejected = 'rejected';
    
    public function getColor(): string | array | null
    {
        return match ($this) {
            self::Draft => 'gray',
            self::Reviewing => 'warning',
            self::Published => 'success',
            self::Rejected => 'danger',
        };
    }
}
```

### 在表格的文本列中使用枚举颜色

如果你在 Table Builder 中使用 [`TextColumn`](../tables/columns/text)，并且它在 Eloquent 模型中被转换为枚举，Filament 将自动使用 `HasColor` 接口以其颜色显示枚举标签。如果在列上使用 [`badge()`](../tables/columns/text#displaying-as-a-badge) 方法，效果最佳。

### 在信息列表的文本条目中使用枚举颜色

如果你在信息列表中使用 [`TextEntry`](../infolists/text-entry)，并且它在 Eloquent 模型中被转换为枚举，Filament 将自动使用 `HasColor` 接口以其颜色显示枚举标签。如果在条目上使用 [`badge()`](../infolists/text-entry#displaying-as-a-badge) 方法，效果最佳。

### 在表单的切换按钮字段中使用枚举颜色

如果你使用 [`ToggleButtons`](../forms/toggle-buttons) 表单字段，并且设置为使用枚举作为其选项，Filament 将自动使用 `HasColor` 接口以其颜色显示枚举标签。

## 枚举图标

`HasIcon` 接口将枚举实例转换为[图标](../styling/icons)。这对于在 UI 中在枚举值旁边显示图标非常有用。

```php
use BackedEnum;
use Filament\Support\Contracts\HasIcon;
use Filament\Support\Icons\Heroicon;
use Illuminate\Contracts\Support\Htmlable;

enum Status: string implements HasIcon
{
    case Draft = 'draft';
    case Reviewing = 'reviewing';
    case Published = 'published';
    case Rejected = 'rejected';

    public function getIcon(): string | BackedEnum | Htmlable | null
    {
        return match ($this) {
            self::Draft => Heroicon::Pencil,
            self::Reviewing => Heroicon::Eye,
            self::Published => Heroicon::Check,
            self::Rejected => Heroicon::XMark,
        };
    }
}
```

### 在表格的文本列中使用枚举图标

如果你在 Table Builder 中使用 [`TextColumn`](../tables/columns/text)，并且它在 Eloquent 模型中被转换为枚举，Filament 将自动使用 `HasIcon` 接口在枚举标签旁边显示枚举的图标。如果在列上使用 [`badge()`](../tables/columns/text#displaying-as-a-badge) 方法，效果最佳。

### 在信息列表的文本条目中使用枚举图标

如果你在信息列表中使用 [`TextEntry`](../infolists/text-entry)，并且它在 Eloquent 模型中被转换为枚举，Filament 将自动使用 `HasIcon` 接口在枚举标签旁边显示枚举的图标。如果在条目上使用 [`badge()`](../infolists/text-entry#displaying-as-a-badge) 方法，效果最佳。

### 在表单的切换按钮字段中使用枚举图标

如果你使用 [`ToggleButtons`](../forms/toggle-buttons) 表单字段，并且设置为使用枚举作为其选项，Filament 将自动使用 `HasIcon` 接口在枚举标签旁边显示枚举的图标。

## 枚举描述

`HasDescription` 接口将枚举实例转换为文本描述，通常显示在其[标签](#枚举标签)下方。这对于在 UI 中显示人类友好的描述非常有用。

```php
use Filament\Support\Contracts\HasDescription;
use Filament\Support\Contracts\HasLabel;
use Illuminate\Contracts\Support\Htmlable;

enum Status: string implements HasLabel, HasDescription
{
    case Draft = 'draft';
    case Reviewing = 'reviewing';
    case Published = 'published';
    case Rejected = 'rejected';
    
    public function getLabel(): string | Htmlable | null
    {
        return $this->name;
    }
    
    public function getDescription(): string | Htmlable | null
    {
        return match ($this) {
            self::Draft => 'This has not finished being written yet.',
            self::Reviewing => 'This is ready for a staff member to read.',
            self::Published => 'This has been approved by a staff member and is public on the website.',
            self::Rejected => 'A staff member has decided this is not appropriate for the website.',
        };
    }
}
```

### 在表单字段描述中使用枚举描述

`HasDescription` 接口可用于从枚举生成描述数组，其中枚举的值是键，枚举的描述是值。这适用于表单字段，如 [`Radio`](../forms/radio#setting-option-descriptions) 和 [`CheckboxList`](../forms/checkbox-list#setting-option-descriptions)：

```php
use Filament\Forms\Components\CheckboxList;
use Filament\Forms\Components\Radio;

Radio::make('status')
    ->options(Status::class)

CheckboxList::make('status')
    ->options(Status::class)
```
