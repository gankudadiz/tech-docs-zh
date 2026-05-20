---
title: 标签输入
---

## 简介

标签输入组件允许你与标签列表进行交互。

默认情况下，标签以 JSON 格式存储：

```php
use Filament\Forms\Components\TagsInput;

TagsInput::make('tags')
```

![标签输入](/assets/filament/v4.x/screenshots/images/light/forms/fields/tags-input/simple.jpg)

如果你使用 Eloquent 保存 JSON 标签，请确保为模型属性添加 `array` [类型转换](https://laravel.com/docs/eloquent-mutators#array-and-json-casting)：

```php
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'tags' => 'array',
        ];
    }

    // ...
}
```

:::tip
Filament 也支持 [`spatie/laravel-tags`](https://github.com/spatie/laravel-tags)。请参阅我们的[插件文档](https://filamentphp.com/plugins/filament-spatie-tags)了解更多信息。
:::

## 逗号分隔的标签

你可以允许标签以分隔字符串而非 JSON 格式存储。要设置此功能，请将分隔字符传递给 `separator()` 方法：

```php
use Filament\Forms\Components\TagsInput;

TagsInput::make('tags')
    ->separator(',')
```

:::tip
`separator()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

## 自动完成标签建议

标签输入可以有自动完成建议。要启用此功能，请将建议数组传递给 `suggestions()` 方法：

```php
use Filament\Forms\Components\TagsInput;

TagsInput::make('tags')
    ->suggestions([
        'tailwindcss',
        'alpinejs',
        'laravel',
        'livewire',
    ])
```

:::tip
`suggestions()` 方法除了接受静态数组外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

## 定义分割键

分割键允许你将用户键盘上的特定按键映射为创建新标签。默认情况下，当用户按下 "Enter" 时会在输入中创建新标签。你也可以定义其他按键来创建新标签，如 "Tab" 或空格。要实现此功能，请将按键数组传递给 `splitKeys()` 方法：

```php
use Filament\Forms\Components\TagsInput;

TagsInput::make('tags')
    ->splitKeys(['Tab', ' '])
```

你可以[阅读更多关于按键的可选值](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key)。

:::tip
`splitKeys()` 方法除了接受静态数组外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

## 为单个标签添加前缀和后缀

你可以在不修改字段实际状态的情况下为标签添加前缀和后缀。如果你需要向用户展示演示格式而不保存它，这很有用。使用 `tagPrefix()` 或 `tagSuffix()` 方法：

```php
use Filament\Forms\Components\TagsInput;

TagsInput::make('percentages')
    ->tagSuffix('%')
```

![带有标签后缀的标签输入](/assets/filament/v4.x/screenshots/images/light/forms/fields/tags-input/tag-prefix.jpg)

:::tip
`tagPrefix()` 和 `tagSuffix()` 方法除了接受静态值外，还接受函数来动态计算。你可以将各种工具注入到函数参数中。
:::

## 重新排序标签

你可以使用 `reorderable()` 方法允许用户在字段内重新排序标签：

```php
use Filament\Forms\Components\TagsInput;

TagsInput::make('tags')
    ->reorderable()
```

你也可以传递一个布尔值来控制标签是否应该可重新排序：

```php
use Filament\Forms\Components\TagsInput;

TagsInput::make('tags')
    ->reorderable(FeatureFlag::active())
```

:::tip
`reorderable()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

## 更改标签颜色

你可以通过向 `color()` 方法传递[颜色](../styling/colors)来更改标签的颜色：

```php
use Filament\Forms\Components\TagsInput;

TagsInput::make('tags')
    ->color('danger')
```

![带有彩色标签的标签输入](/assets/filament/v4.x/screenshots/images/light/forms/fields/tags-input/color.jpg)

:::tip
`color()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

## 修剪空白字符

你可以使用 `trim()` 方法自动修剪每个标签开头和结尾的空白字符：

```php
use Filament\Forms\Components\TagsInput;

TagsInput::make('tags')
    ->trim()
```

你可能希望全局启用所有标签输入的修剪功能，类似于 Laravel 的 `TrimStrings` 中间件。你可以在服务提供者中使用 `configureUsing()` 方法：

```php
use Filament\Forms\Components\TagsInput;

TagsInput::configureUsing(function (TagsInput $component): void {
    $component->trim();
});
```

## 标签验证

你可以通过向 `nestedRecursiveRules()` 方法传递规则数组来为每个标签添加验证规则：

```php
use Filament\Forms\Components\TagsInput;

TagsInput::make('tags')
    ->nestedRecursiveRules([
        'min:3',
        'max:255',
    ])
```
