---
title: 开关
---

## 简介

开关组件类似于[复选框](checkbox)，允许你操作一个布尔值。

```php
use Filament\Forms\Components\Toggle;

Toggle::make('is_admin')
```

![开关](/assets/filament/v4.x/screenshots/images/light/forms/fields/toggle/simple.jpg)

如果你使用 Eloquent 保存布尔值，应该确保在模型属性上添加 `boolean` [类型转换](https://laravel.com/docs/eloquent-mutators#attribute-casting)：

```php
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_admin' => 'boolean',
        ];
    }

    // ...
}
```

## 为开关按钮添加图标

开关也可以使用[图标](../styling/icons)来表示按钮的"开"和"关"状态。要为"开"状态添加图标，使用 `onIcon()` 方法。要为"关"状态添加图标，使用 `offIcon()` 方法：

```php
use Filament\Forms\Components\Toggle;
use Filament\Support\Icons\Heroicon;

Toggle::make('is_admin')
    ->onIcon(Heroicon::Bolt)
    ->offIcon(Heroicon::User)
```

:::tip
`onIcon()` 和 `offIcon()` 方法除了接受静态值外，还接受函数来动态计算。你可以将各种工具注入到函数参数中。
:::

![开关图标](/assets/filament/v4.x/screenshots/images/light/forms/fields/toggle/icons.jpg)

## 自定义开关按钮的颜色

你也可以自定义表示开关"开"或"关"状态的[颜色](../styling/colors)。要为"开"状态添加颜色，使用 `onColor()` 方法。要为"关"状态添加颜色，使用 `offColor()` 方法：

```php
use Filament\Forms\Components\Toggle;

Toggle::make('is_admin')
    ->onColor('success')
    ->offColor('danger')
```

:::tip
`onColor()` 和 `offColor()` 方法除了接受静态值外，还接受函数来动态计算。你可以将各种工具注入到函数参数中。
:::

![开关关闭颜色](/assets/filament/v4.x/screenshots/images/light/forms/fields/toggle/off-color.jpg)

![开关开启颜色](/assets/filament/v4.x/screenshots/images/light/forms/fields/toggle/on-color.jpg)

## 将标签置于上方

开关字段有两种布局模式：内联和堆叠。默认情况下为内联模式。

当开关为内联模式时，标签位于其旁边：

```php
use Filament\Forms\Components\Toggle;

Toggle::make('is_admin')
    ->inline()
```

![标签内联的开关](/assets/filament/v4.x/screenshots/images/light/forms/fields/toggle/inline.jpg)

当开关为堆叠模式时，标签位于其上方：

```php
use Filament\Forms\Components\Toggle;

Toggle::make('is_admin')
    ->inline(false)
```

:::tip
`inline()` 方法除了接受静态值外，还接受函数来动态计算。你可以将各种工具注入到函数参数中。
:::

![标签在上方的开关](/assets/filament/v4.x/screenshots/images/light/forms/fields/toggle/not-inline.jpg)

## 开关验证

除了[验证](validation)页面上列出的所有规则外，还有一些特定于开关的额外规则。

### 接受验证

你可以使用 `accepted()` 方法确保开关处于"开"状态：

```php
use Filament\Forms\Components\Toggle;

Toggle::make('terms_of_service')
    ->accepted()
```

你可以传递一个布尔值来控制是否应用该验证规则：

```php
use Filament\Forms\Components\Toggle;

Toggle::make('terms_of_service')
    ->accepted(FeatureFlag::active())
```

:::tip
`accepted()` 方法除了接受静态值外，还接受函数来动态计算。你可以将各种工具注入到函数参数中。
:::

### 拒绝验证

你可以使用 `declined()` 方法确保开关处于"关"状态：

```php
use Filament\Forms\Components\Toggle;

Toggle::make('is_under_18')
    ->declined()
```

你可以传递一个布尔值来控制是否应用该验证规则：

```php
use Filament\Forms\Components\Toggle;

Toggle::make('is_under_18')
    ->declined(FeatureFlag::active())
```

:::tip
`declined()` 方法除了接受静态值外，还接受函数来动态计算。你可以将各种工具注入到函数参数中。
:::
