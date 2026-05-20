---
title: 文本域
---

## 简介

文本域允许你与多行字符串进行交互：

```php
use Filament\Forms\Components\Textarea;

Textarea::make('description')
```

![文本域](/assets/filament/v4.x/screenshots/images/light/forms/fields/textarea/simple.jpg)

## 调整文本域大小

你可以通过定义 `rows()` 和 `cols()` 方法来更改文本域的大小：

```php
use Filament\Forms\Components\Textarea;

Textarea::make('description')
    ->rows(10)
    ->cols(20)
```

![自定义行大小的文本域](/assets/filament/v4.x/screenshots/images/light/forms/fields/textarea/rows.jpg)

:::tip
`rows()` 和 `cols()` 方法除了接受静态值外，还接受函数来动态计算。你可以将各种工具注入到函数参数中。
:::

### 自动调整文本域大小

你可以通过设置 `autosize()` 方法允许文本域自动调整大小以适应其内容：

```php
use Filament\Forms\Components\Textarea;

Textarea::make('description')
    ->autosize()
```

你也可以传递一个布尔值来控制文本域是否应该自动调整大小：

```php
use Filament\Forms\Components\Textarea;

Textarea::make('description')
    ->autosize(FeatureFlag::active())
```

:::tip
`autosize()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

![自动调整大小的文本域](/assets/filament/v4.x/screenshots/images/light/forms/fields/textarea/autosize.jpg)

## 将字段设为只读

不要与[禁用字段](overview#禁用字段)混淆，你可以使用 `readOnly()` 方法将字段设为"只读"：

```php
use Filament\Forms\Components\Textarea;

Textarea::make('description')
    ->readOnly()
```

与 [`disabled()`](overview#禁用字段) 相比，有一些区别：

- 使用 `readOnly()` 时，字段在表单提交时仍会发送到服务器。它可以通过浏览器控制台或 JavaScript 进行修改。你可以使用 [`saved(false)`](overview#阻止字段被保存) 来阻止此行为。
- 使用 `readOnly()` 时没有样式变化，如降低不透明度。
- 使用 `readOnly()` 时字段仍可获得焦点。

你也可以传递一个布尔值来控制字段是否应该只读：

```php
use Filament\Forms\Components\Textarea;

Textarea::make('description')
    ->readOnly(FeatureFlag::active())
```

:::tip
`readOnly()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

## 禁用 Grammarly 检查

如果用户安装了 Grammarly 并且你想阻止它分析文本域的内容，可以使用 `disableGrammarly()` 方法：

```php
use Filament\Forms\Components\Textarea;

Textarea::make('description')
    ->disableGrammarly()
```

你也可以传递一个布尔值来控制是否禁用 Grammarly 检查：

```php
use Filament\Forms\Components\Textarea;

Textarea::make('description')
    ->disableGrammarly(FeatureFlag::active())
```

:::tip
`disableGrammarly()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

## 修剪空白字符

你可以使用 `trim()` 方法自动修剪文本域值开头和结尾的空白字符：

```php
use Filament\Forms\Components\Textarea;

Textarea::make('description')
    ->trim()
```

你可能希望全局启用所有文本域的修剪功能，类似于 Laravel 的 `TrimStrings` 中间件。你可以在服务提供者中使用 `configureUsing()` 方法：

```php
use Filament\Forms\Components\Textarea;

Textarea::configureUsing(function (Textarea $component): void {
    $component->trim();
});
```

## 文本域验证

除了[验证](validation)页面上列出的所有规则外，还有一些特定于文本域的额外规则。

### 长度验证

你可以通过设置 `minLength()` 和 `maxLength()` 方法来限制文本域的长度。这些方法同时添加前端和后端验证：

```php
use Filament\Forms\Components\Textarea;

Textarea::make('description')
    ->minLength(2)
    ->maxLength(1024)
```

你也可以通过设置 `length()` 来指定文本域的确切长度。此方法同时添加前端和后端验证：

```php
use Filament\Forms\Components\Textarea;

Textarea::make('question')
    ->length(100)
```

:::tip
`minLength()`、`maxLength()` 和 `length()` 方法除了接受静态值外，还接受函数来动态计算。你可以将各种工具注入到函数参数中。
:::
