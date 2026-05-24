---
title: 单选框
---

## 简介

单选框提供了一组单选按钮，用于从预定义的选项列表中选择单个值：

```php
use Filament\Forms\Components\Radio;

Radio::make('status')
    ->options([
        'draft' => 'Draft',
        'scheduled' => 'Scheduled',
        'published' => 'Published'
    ])
```

:::tip
`options()` 方法除了接受静态数组外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

![单选框](/assets/filament/v4.x/screenshots/images/light/forms/fields/radio/simple.jpg)

## 设置选项描述

你可以使用 `descriptions()` 方法为每个选项提供描述信息：

```php
use Filament\Forms\Components\Radio;

Radio::make('status')
    ->options([
        'draft' => 'Draft',
        'scheduled' => 'Scheduled',
        'published' => 'Published'
    ])
    ->descriptions([
        'draft' => 'Is not visible.',
        'scheduled' => 'Will be visible.',
        'published' => 'Is visible.'
    ])
```

:::tip
`descriptions()` 方法除了接受静态数组外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

![带选项描述的单选框](/assets/filament/v4.x/screenshots/images/light/forms/fields/radio/option-descriptions.jpg)

:::info
请确保描述数组中使用的 `key` 与选项数组中的 `key` 一致，以便正确的描述匹配到正确的选项。
:::

## 使选项内联显示

你可能希望将选项 `inline()` 内联显示：

```php
use Filament\Forms\Components\Radio;

Radio::make('feedback')
    ->label('Like this post?')
    ->boolean()
    ->inline()
```

![内联单选按钮](/assets/filament/v4.x/screenshots/images/light/forms/fields/radio/inline.jpg)

你也可以传递一个布尔值来控制选项是否内联显示：

```php
use Filament\Forms\Components\Radio;

Radio::make('feedback')
    ->label('Like this post?')
    ->boolean()
    ->inline(FeatureFlag::active())
```

:::tip
`inline()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

## 禁用特定选项

你可以使用 `disableOptionWhen()` 方法禁用特定选项。它接受一个闭包，你可以在其中检查具有特定 `$value` 的选项是否应该被禁用：

```php
use Filament\Forms\Components\Radio;

Radio::make('status')
    ->options([
        'draft' => 'Draft',
        'scheduled' => 'Scheduled',
        'published' => 'Published',
    ])
    ->disableOptionWhen(fn (string $value): bool => $value === 'published')
```

:::tip
你可以将各种工具注入到函数参数中。可注入的参数包括：`$value`（选项的值，`mixed` 类型）和 `$label`（选项的标签，`string | Illuminate\Contracts\Support\Htmlable` 类型）。
:::

![带禁用选项的单选框](/assets/filament/v4.x/screenshots/images/light/forms/fields/radio/disabled-option.jpg)

如果你想获取未被禁用的选项（例如用于验证），可以使用 `getEnabledOptions()` 方法：

```php
use Filament\Forms\Components\Radio;

Radio::make('status')
    ->options([
        'draft' => 'Draft',
        'scheduled' => 'Scheduled',
        'published' => 'Published',
    ])
    ->disableOptionWhen(fn (string $value): bool => $value === 'published')
    ->in(fn (Radio $component): array => array_keys($component->getEnabledOptions()))
```

有关 `in()` 函数的更多信息，请参阅[验证文档](validation#在中)。

## 布尔选项

如果你需要一个简单的布尔单选按钮组，包含"是"和"否"选项，可以使用 `boolean()` 方法：

```php
use Filament\Forms\Components\Radio;

Radio::make('feedback')
    ->label('Like this post?')
    ->boolean()
```

![布尔单选框](/assets/filament/v4.x/screenshots/images/light/forms/fields/radio/boolean.jpg)

要自定义"是"的标签，可以使用 `boolean()` 方法的 `trueLabel` 参数：

```php
use Filament\Forms\Components\Radio;

Radio::make('feedback')
    ->label('Like this post?')
    ->boolean(trueLabel: 'Absolutely!')
```

要自定义"否"的标签，可以使用 `boolean()` 方法的 `falseLabel` 参数：

```php
use Filament\Forms\Components\Radio;

Radio::make('feedback')
    ->label('Like this post?')
    ->boolean(falseLabel: 'Not at all!')
```

![带自定义标签的布尔单选框](/assets/filament/v4.x/screenshots/images/light/forms/fields/radio/boolean-custom-labels.jpg)
