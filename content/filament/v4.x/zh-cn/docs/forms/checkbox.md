---
title: 复选框
---

## 简介

复选框组件类似于 [切换开关](toggle)，允许你与布尔值进行交互。

```php
use Filament\Forms\Components\Checkbox;

Checkbox::make('is_admin')
```

![复选框](/assets/filament/v4.x/screenshots/images/light/forms/fields/checkbox/simple.jpg)

如果你使用 Eloquent 保存布尔值，应确保在模型属性上添加 `boolean` [类型转换](https://laravel.com/docs/eloquent-mutators#attribute-casting)：

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

## 将标签置于上方

复选框字段有两种布局模式：行内（inline）和堆叠（stacked）。默认为行内模式。

当复选框为行内模式时，标签显示在其旁边：

```php
use Filament\Forms\Components\Checkbox;

Checkbox::make('is_admin')
    ->inline()
```

![复选框行内标签](/assets/filament/v4.x/screenshots/images/light/forms/fields/checkbox/inline.jpg)

当复选框为堆叠模式时，标签显示在其上方：

```php
use Filament\Forms\Components\Checkbox;

Checkbox::make('is_admin')
    ->inline(false)
```

:::tip
`inline()` 方法除了接受静态值外，还接受一个函数来动态计算值。你可以在函数中注入各种工具作为参数。
:::

![复选框标签在上方](/assets/filament/v4.x/screenshots/images/light/forms/fields/checkbox/not-inline.jpg)

## 复选框验证

除了 [验证](validation) 页面上列出的所有规则外，还有一些针对复选框的额外规则。

### 已接受验证

你可以使用 `accepted()` 方法确保复选框被勾选：

```php
use Filament\Forms\Components\Checkbox;

Checkbox::make('terms_of_service')
    ->accepted()
```

你也可以传递一个布尔值来控制是否应用该验证规则：

```php
use Filament\Forms\Components\Checkbox;

Checkbox::make('terms_of_service')
    ->accepted(FeatureFlag::active())
```

:::tip
`accepted()` 方法除了接受静态值外，还接受一个函数来动态计算值。你可以在函数中注入各种工具作为参数。
:::

### 已拒绝验证

你可以使用 `declined()` 方法确保复选框未被勾选：

```php
use Filament\Forms\Components\Checkbox;

Checkbox::make('is_under_18')
    ->declined()
```

你也可以传递一个布尔值来控制是否应用该验证规则：

```php
use Filament\Forms\Components\Checkbox;

Checkbox::make('is_under_18')
    ->declined(FeatureFlag::active())
```

:::tip
`declined()` 方法除了接受静态值外，还接受一个函数来动态计算值。你可以在函数中注入各种工具作为参数。
:::
