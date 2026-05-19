---
title: 文本输入列
---

## 简介

文本输入列允许你在表格中渲染一个文本输入框，可用于更新数据库记录，无需打开新页面或模态框：

```php
use Filament\Tables\Columns\TextInputColumn;

TextInputColumn::make('email')
```

![文本输入列](/assets/filament/v4.x/screenshots/images/light/tables/columns/text-input/simple.jpg)

## 验证

你可以通过传递任何 [Laravel 验证规则](https://laravel.com/docs/validation#available-validation-rules)数组来验证输入：

```php
use Filament\Tables\Columns\TextInputColumn;

TextInputColumn::make('name')
    ->rules(['required', 'max:255'])
```

## 自定义 HTML 输入类型

你可以使用 `type()` 方法传递自定义 [HTML input 类型](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types)：

```php
use Filament\Tables\Columns\TextInputColumn;

TextInputColumn::make('background_color')->type('color')
```

## 设置 HTML 输入模式

你可以使用 `inputMode()` 方法设置 [HTML inputmode 属性](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inputmode)，它提示在移动设备上显示的键盘类型。对于数字输入，小数值使用 `inputMode('decimal')`，整数使用 `inputMode('numeric')`：

```php
use Filament\Tables\Columns\TextInputColumn;

TextInputColumn::make('quantity')
    ->type('number')
    ->inputMode('decimal')
```

## 设置数字步长

使用 `type('number')` 时，你可以使用 `step()` 方法设置 [HTML step 属性](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/number#step)。小数值使用 `step('any')`，整数使用 `step('1')`：

```php
use Filament\Tables\Columns\TextInputColumn;

TextInputColumn::make('quantity')
    ->type('number')
    ->inputMode('decimal')
    ->step('1')
```

## 生命周期钩子

钩子可用于在输入生命周期的不同点执行代码：

```php
TextInputColumn::make()
    ->beforeStateUpdated(function ($record, $state) {
        // 在状态保存到数据库之前运行。
    })
    ->afterStateUpdated(function ($record, $state) {
        // 在状态保存到数据库之后运行。
    })
```

## 在字段旁添加前后缀文本

你可以使用 `prefix()` 和 `suffix()` 方法在输入前后放置文本：

```php
use Filament\Tables\Columns\TextInputColumn;

TextInputColumn::make('domain')
    ->prefix('https://')
    ->suffix('.com')
```

除固定值外，`prefix()` 和 `suffix()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

![带前后缀的文本输入列](/assets/filament/v4.x/screenshots/images/light/tables/columns/text-input/affix.jpg)

### 使用图标作为前后缀

你可以使用 `prefixIcon()` 和 `suffixIcon()` 方法在输入前后放置[图标](../../styling/icons)：

```php
use Filament\Tables\Columns\TextInputColumn;
use Filament\Support\Icons\Heroicon;

TextInputColumn::make('domain')
    ->prefixIcon(Heroicon::GlobeAlt)
    ->suffixIcon(Heroicon::CheckCircle)
```

除固定值外，`prefixIcon()` 和 `suffixIcon()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

![带前缀图标的文本输入列](/assets/filament/v4.x/screenshots/images/light/tables/columns/text-input/prefix-icon.jpg)

#### 设置前后缀图标颜色

前后缀图标默认为灰色，但你可以使用 `prefixIconColor()` 和 `suffixIconColor()` 方法设置不同的颜色：

```php
use Filament\Tables\Columns\TextInputColumn;
use Filament\Support\Icons\Heroicon;

TextInputColumn::make('status')
    ->suffixIcon(Heroicon::CheckCircle)
    ->suffixIconColor('success')
```

除固定值外，`prefixIconColor()` 和 `suffixIconColor()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

![带后缀图标颜色的文本输入列](/assets/filament/v4.x/screenshots/images/light/tables/columns/text-input/suffix-icon-color.jpg)

## 安全

### 授权

文本输入列在保存更改之前不会自动检查 Laravel 模型策略。当用户通过文本输入列更新值时，Filament 会检查列是否被 `disabled()`，但不会运行任何 `update` 策略门检查。这意味着，如果用户可以在表格中看到记录且列未被禁用，他们可以更新该列的值，无论你定义了什么 `update` 策略。如果你需要限制谁可以编辑此列，应使用 `disabled()` 方法基于你自己的授权逻辑有条件地阻止编辑，例如 `disabled(fn ($record) => $record->user_id !== auth()->id())`。或者，考虑使用完整的编辑页面或模态框操作，其中 Filament 的资源授权会被强制执行。
