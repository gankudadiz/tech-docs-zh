---
title: 开关按钮组
---

## 简介

开关按钮输入提供了一组按钮，用于从预定义选项列表中选择单个值或多个值：

```php
use Filament\Forms\Components\ToggleButtons;

ToggleButtons::make('status')
    ->options([
        'draft' => 'Draft',
        'scheduled' => 'Scheduled',
        'published' => 'Published'
    ])
```

:::tip
`options()` 方法除了接受静态数组外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

![开关按钮组](/assets/filament/v4.x/screenshots/images/light/forms/fields/toggle-buttons/simple.jpg)

## 更改选项按钮的颜色

你可以使用 `colors()` 方法更改选项按钮的[颜色](../styling/colors)。数组中的每个键应对应一个选项值：

```php
use Filament\Forms\Components\ToggleButtons;

ToggleButtons::make('status')
    ->options([
        'draft' => 'Draft',
        'scheduled' => 'Scheduled',
        'published' => 'Published'
    ])
    ->colors([
        'draft' => 'info',
        'scheduled' => 'warning',
        'published' => 'success',
    ])
```

如果你使用枚举作为选项，可以使用 [`HasColor` 接口](../advanced/enums#枚举颜色)来定义颜色。

:::tip
`colors()` 方法除了接受静态数组外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

![不同颜色的开关按钮组](/assets/filament/v4.x/screenshots/images/light/forms/fields/toggle-buttons/colors.jpg)

## 为选项按钮添加图标

你可以使用 `icons()` 方法为选项按钮添加[图标](../styling/icons)。数组中的每个键应对应一个选项值，值可以是任何有效的[图标](../styling/icons)：

```php
use Filament\Forms\Components\ToggleButtons;
use Filament\Support\Icons\Heroicon;

ToggleButtons::make('status')
    ->options([
        'draft' => 'Draft',
        'scheduled' => 'Scheduled',
        'published' => 'Published'
    ])
    ->icons([
        'draft' => Heroicon::OutlinedPencil,
        'scheduled' => Heroicon::OutlinedClock,
        'published' => Heroicon::OutlinedCheckCircle,
    ])
```

:::tip
`icons()` 方法除了接受静态数组外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

如果你使用枚举作为选项，可以使用 [`HasIcon` 接口](../advanced/enums#枚举图标)来定义图标。

![带有图标的开关按钮组](/assets/filament/v4.x/screenshots/images/light/forms/fields/toggle-buttons/icons.jpg)

如果你想只显示图标，可以使用 `hiddenButtonLabels()` 隐藏选项标签。

![隐藏标签的开关按钮组](/assets/filament/v4.x/screenshots/images/light/forms/fields/toggle-buttons/hidden-labels.jpg)

## 为选项按钮添加工具提示

你可以使用 `tooltips()` 方法为每个选项按钮添加不同的工具提示。

```php
use Filament\Forms\Components\ToggleButtons;

ToggleButtons::make('status')
    ->options([
        'draft' => 'Draft',
        'scheduled' => 'Scheduled',
        'published' => 'Published',
    ])
    ->tooltips([
        'draft' => 'Set as a draft before publishing.',
        'scheduled' => 'Schedule publishing on a specific date.',
        'published' => 'Publish now',
    ])
```

:::tip
`tooltips()` 方法除了接受静态数组外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

![带有工具提示的开关按钮组](/assets/filament/v4.x/screenshots/images/light/forms/fields/toggle-buttons/tooltips.jpg)

## 布尔选项

如果你想要一个简单的布尔开关按钮组，带有"是"和"否"选项，可以使用 `boolean()` 方法：

```php
use Filament\Forms\Components\ToggleButtons;

ToggleButtons::make('feedback')
    ->label('Like this post?')
    ->boolean()
```

选项会自动设置[颜色](#更改选项按钮的颜色)和[图标](#为选项按钮添加图标)，但你可以使用 `colors()` 或 `icons()` 覆盖它们。

![布尔开关按钮组](/assets/filament/v4.x/screenshots/images/light/forms/fields/toggle-buttons/boolean.jpg)

要自定义"是"标签，可以使用 `boolean()` 方法的 `trueLabel` 参数：

```php
use Filament\Forms\Components\ToggleButtons;

ToggleButtons::make('feedback')
    ->label('Like this post?')
    ->boolean(trueLabel: 'Absolutely!')
```

要自定义"否"标签，可以使用 `boolean()` 方法的 `falseLabel` 参数：

```php
use Filament\Forms\Components\ToggleButtons;

ToggleButtons::make('feedback')
    ->label('Like this post?')
    ->boolean(falseLabel: 'Not at all!')
```

## 将选项内联排列

你可能希望将按钮 `inline()` 内联显示：

```php
use Filament\Forms\Components\ToggleButtons;

ToggleButtons::make('feedback')
    ->label('Like this post?')
    ->boolean()
    ->inline()
```

![内联开关按钮组](/assets/filament/v4.x/screenshots/images/light/forms/fields/toggle-buttons/inline.jpg)

你也可以传递一个布尔值来控制按钮是否应该内联：

```php
use Filament\Forms\Components\ToggleButtons;

ToggleButtons::make('feedback')
    ->label('Like this post?')
    ->boolean()
    ->inline(FeatureFlag::active())
```

:::tip
`inline()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

## 分组选项按钮

你可能希望使用 `grouped()` 方法将选项按钮分组在一起，使它们更紧凑。这也使它们水平内联显示：

```php
use Filament\Forms\Components\ToggleButtons;

ToggleButtons::make('feedback')
    ->label('Like this post?')
    ->boolean()
    ->grouped()
```

![分组开关按钮组](/assets/filament/v4.x/screenshots/images/light/forms/fields/toggle-buttons/grouped.jpg)

你也可以传递一个布尔值来控制按钮是否应该分组：

```php
use Filament\Forms\Components\ToggleButtons;

ToggleButtons::make('feedback')
    ->label('Like this post?')
    ->boolean()
    ->grouped(FeatureFlag::active())
```

:::tip
`grouped()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

## 选择多个按钮

`ToggleButtons` 组件上的 `multiple()` 方法允许你从选项列表中选择多个值：

```php
use Filament\Forms\Components\ToggleButtons;

ToggleButtons::make('technologies')
    ->multiple()
    ->options([
        'tailwind' => 'Tailwind CSS',
        'alpine' => 'Alpine.js',
        'laravel' => 'Laravel',
        'livewire' => 'Laravel Livewire',
    ])
```

![选中多个开关按钮](/assets/filament/v4.x/screenshots/images/light/forms/fields/toggle-buttons/multiple.jpg)

这些选项以 JSON 格式返回。如果你使用 Eloquent 保存它们，请确保为模型属性添加 `array` [类型转换](https://laravel.com/docs/eloquent-mutators#array-and-json-casting)：

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

你也可以传递一个布尔值来控制按钮是否应该允许多选：

```php
use Filament\Forms\Components\ToggleButtons;

ToggleButtons::make('technologies')
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

## 将选项拆分为列

你可以使用 `columns()` 方法将选项拆分为列：

```php
use Filament\Forms\Components\ToggleButtons;

ToggleButtons::make('technologies')
    ->options([
        // ...
    ])
    ->columns(2)
```

:::tip
`columns()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

![2 列开关按钮组](/assets/filament/v4.x/screenshots/images/light/forms/fields/toggle-buttons/columns.jpg)

该方法接受与[网格](../schemas/layouts#网格系统)的 `columns()` 方法相同的选项。这允许你在不同断点处响应式地自定义列数。

### 设置网格方向

默认情况下，当你将按钮排列成列时，它们会按垂直顺序列出。如果你想水平排列，可以使用 `gridDirection(GridDirection::Row)` 方法：

```php
use Filament\Forms\Components\ToggleButtons;
use Filament\Support\Enums\GridDirection;

ToggleButtons::make('technologies')
    ->options([
        // ...
    ])
    ->columns(2)
    ->gridDirection(GridDirection::Row)
```

:::tip
`gridDirection()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

![2 行开关按钮组](/assets/filament/v4.x/screenshots/images/light/forms/fields/toggle-buttons/rows.jpg)

## 禁用特定选项

你可以使用 `disableOptionWhen()` 方法禁用特定选项。它接受一个闭包，你可以在其中检查具有特定 `$value` 的选项是否应该被禁用：

```php
use Filament\Forms\Components\ToggleButtons;

ToggleButtons::make('status')
    ->options([
        'draft' => 'Draft',
        'scheduled' => 'Scheduled',
        'published' => 'Published',
    ])
    ->disableOptionWhen(fn (string $value): bool => $value === 'published')
```

:::tip
你可以将各种工具注入到函数参数中。
:::

![禁用选项的开关按钮组](/assets/filament/v4.x/screenshots/images/light/forms/fields/toggle-buttons/disabled-option.jpg)

如果你想获取未被禁用的选项（例如用于验证），可以使用 `getEnabledOptions()`：

```php
use Filament\Forms\Components\ToggleButtons;

ToggleButtons::make('status')
    ->options([
        'draft' => 'Draft',
        'scheduled' => 'Scheduled',
        'published' => 'Published',
    ])
    ->disableOptionWhen(fn (string $value): bool => $value === 'published')
    ->in(fn (ToggleButtons $component): array => array_keys($component->getEnabledOptions()))
```

有关 `in()` 函数的更多信息，请参阅[验证文档](validation#在中)。
