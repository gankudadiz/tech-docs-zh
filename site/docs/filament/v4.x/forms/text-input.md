---
title: 文本输入
---

## 简介

文本输入允许你与字符串进行交互：

```php
use Filament\Forms\Components\TextInput;

TextInput::make('name')
```

![文本输入](/assets/filament/v4.x/screenshots/images/light/forms/fields/text-input/simple.jpg)

## 设置 HTML 输入类型

你可以使用一组方法设置字符串类型。某些方法（如 `email()`）还提供验证：

```php
use Filament\Forms\Components\TextInput;

TextInput::make('text')
    ->email() // 或
    ->numeric() // 或
    ->integer() // 或
    ->password() // 或
    ->tel() // 或
    ->url()
```

你也可以使用 `type()` 方法传递其他 [HTML 输入类型](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types)：

```php
use Filament\Forms\Components\TextInput;

TextInput::make('backgroundColor')
    ->type('color')
```

![颜色类型的文本输入](/assets/filament/v4.x/screenshots/images/light/forms/fields/text-input/color.jpg)

各个类型方法也允许你传递布尔值来控制字段是否应该使用该类型：

```php
use Filament\Forms\Components\TextInput;

TextInput::make('text')
    ->email(FeatureFlag::active()) // 或
    ->numeric(FeatureFlag::active()) // 或
    ->integer(FeatureFlag::active()) // 或
    ->password(FeatureFlag::active()) // 或
    ->tel(FeatureFlag::active()) // 或
    ->url(FeatureFlag::active())
```

:::tip
这些方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

## 设置 HTML 输入模式

你可以使用 `inputMode()` 方法设置输入的 [`inputmode` 属性](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#inputmode)：

```php
use Filament\Forms\Components\TextInput;

TextInput::make('text')
    ->numeric()
    ->inputMode('decimal')
```

:::tip
`inputMode()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

## 设置数字步长

你可以使用 `step()` 方法设置输入的 [`step` 属性](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#step)：

```php
use Filament\Forms\Components\TextInput;

TextInput::make('number')
    ->numeric()
    ->step(100)
```

:::tip
`step()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

## 自动完成文本

你可以使用 `autocomplete()` 方法允许文本被[浏览器自动完成](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#autocomplete)：

```php
use Filament\Forms\Components\TextInput;

TextInput::make('password')
    ->password()
    ->autocomplete('new-password')
```

作为 `autocomplete="off"` 的快捷方式，你可以使用 `autocomplete(false)`：

```php
use Filament\Forms\Components\TextInput;

TextInput::make('password')
    ->password()
    ->autocomplete(false)
```

:::tip
`autocomplete()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

对于更复杂的自动完成选项，文本输入还支持 [datalist](#使用-datalist-自动完成文本)。

### 使用 datalist 自动完成文本

你可以使用 `datalist()` 方法为文本输入指定 [datalist](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist) 选项：

```php
TextInput::make('manufacturer')
    ->datalist([
        'BMW',
        'Ford',
        'Mercedes-Benz',
        'Porsche',
        'Toyota',
        'Volkswagen',
    ])
```

Datalist 在用户使用文本输入时提供自动完成选项。然而，这些纯粹是建议，用户仍然可以在输入中键入任何值。如果你希望严格限制用户使用预定义选项集，请查看[选择器字段](select)。

:::tip
`datalist()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

## 自动大写文本

你可以使用 `autocapitalize()` 方法允许文本被[浏览器自动大写](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#autocapitalize)：

```php
use Filament\Forms\Components\TextInput;

TextInput::make('name')
    ->autocapitalize('words')
```

:::tip
`autocapitalize()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

## 在字段旁添加前后缀文本

你可以使用 `prefix()` 和 `suffix()` 方法在输入前后放置文本：

```php
use Filament\Forms\Components\TextInput;

TextInput::make('domain')
    ->prefix('https://')
    ->suffix('.com')
```

:::tip
`prefix()` 和 `suffix()` 方法除了接受静态值外，还接受函数来动态计算。你可以将各种工具注入到函数参数中。
:::

![带前后缀的文本输入](/assets/filament/v4.x/screenshots/images/light/forms/fields/text-input/affix.jpg)

### 使用图标作为前后缀

你可以使用 `prefixIcon()` 和 `suffixIcon()` 方法在输入前后放置[图标](../styling/icons)：

```php
use Filament\Forms\Components\TextInput;
use Filament\Support\Icons\Heroicon;

TextInput::make('domain')
    ->url()
    ->suffixIcon(Heroicon::GlobeAlt)
```

:::tip
`prefixIcon()` 和 `suffixIcon()` 方法除了接受静态值外，还接受函数来动态计算。你可以将各种工具注入到函数参数中。
:::

![带后缀图标的文本输入](/assets/filament/v4.x/screenshots/images/light/forms/fields/text-input/suffix-icon.jpg)

#### 设置前后缀图标颜色

前后缀图标默认为灰色，但你可以使用 `prefixIconColor()` 和 `suffixIconColor()` 方法设置不同的颜色：

```php
use Filament\Forms\Components\TextInput;
use Filament\Support\Icons\Heroicon;

TextInput::make('domain')
    ->url()
    ->suffixIcon(Heroicon::CheckCircle)
    ->suffixIconColor('success')
```

:::tip
`prefixIconColor()` 和 `suffixIconColor()` 方法除了接受静态值外，还接受函数来动态计算。你可以将各种工具注入到函数参数中。
:::

![带彩色后缀图标的文本输入](/assets/filament/v4.x/screenshots/images/light/forms/fields/text-input/suffix-icon-color.jpg)

### 使用操作作为前后缀

你可以使用 `prefixAction()` 和 `suffixAction()` 方法在输入前后放置[操作](../actions/overview)：

```php
use Filament\Actions\Action;
use Filament\Forms\Components\TextInput;
use Filament\Support\Icons\Heroicon;

TextInput::make('cost')
    ->prefix('€')
    ->suffixAction(
        Action::make('copyCostToPrice')
            ->icon(Heroicon::Clipboard),
    )
```

![带后缀操作的文本输入](/assets/filament/v4.x/screenshots/images/light/forms/fields/actions/suffix.jpg)

## 可显示的密码输入

使用 `password()` 时，你还可以使输入可显示（`revealable()`），这样用户可以通过点击按钮看到他们正在输入的密码的明文版本：

```php
use Filament\Forms\Components\TextInput;

TextInput::make('password')
    ->password()
    ->revealable()
```

![可显示密码的文本输入](/assets/filament/v4.x/screenshots/images/light/forms/fields/text-input/revealable-password.jpg)

你也可以传递一个布尔值来控制输入是否应该可显示：

```php
use Filament\Forms\Components\TextInput;

TextInput::make('password')
    ->password()
    ->revealable(FeatureFlag::active())
```

:::tip
`revealable()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

## 允许文本复制到剪贴板

你可以使文本可复制，这样点击输入旁边的按钮会将文本复制到剪贴板，并可选地指定自定义确认消息和持续时间（毫秒）：

```php
use Filament\Forms\Components\TextInput;

TextInput::make('apiKey')
    ->label('API key')
    ->copyable(copyMessage: 'Copied!', copyMessageDuration: 1500)
```

![带可复制按钮的文本输入](/assets/filament/v4.x/screenshots/images/light/forms/fields/text-input/copyable.jpg)

你也可以传递一个布尔值来控制文本是否应该可复制：

```php
use Filament\Forms\Components\TextInput;

TextInput::make('apiKey')
    ->label('API key')
    ->copyable(FeatureFlag::active())
```

:::tip
`copyable()` 方法的参数除了接受静态值外，还接受函数来动态计算。你可以将各种工具注入到函数参数中。
:::

:::warning
此功能仅在应用启用 SSL 时有效。
:::

## 输入掩码

输入掩码是定义输入值必须符合的格式的实践。

在 Filament 中，你可以使用 `mask()` 方法配置 [Alpine.js 掩码](https://alpinejs.dev/plugins/mask#x-mask)：

```php
use Filament\Forms\Components\TextInput;

TextInput::make('birthday')
    ->mask('99/99/9999')
    ->placeholder('MM/DD/YYYY')
```

![带掩码的文本输入](/assets/filament/v4.x/screenshots/images/light/forms/fields/text-input/mask.jpg)

要使用[动态掩码](https://alpinejs.dev/plugins/mask#mask-functions)，将 JavaScript 包装在 `RawJs` 对象中：

```php
use Filament\Forms\Components\TextInput;
use Filament\Support\RawJs;

TextInput::make('cardNumber')
    ->mask(RawJs::make(<<<'JS'
        $input.startsWith('34') || $input.startsWith('37') ? '9999 999999 99999' : '9999 9999 9999 9999'
    JS))
```

:::tip
`mask()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

Alpine.js 会将整个掩码值发送到服务器，因此在验证字段和保存之前，你可能需要从状态中去除某些字符。你可以使用 `stripCharacters()` 方法，传入要从掩码值中删除的字符或字符数组：

```php
use Filament\Forms\Components\TextInput;
use Filament\Support\RawJs;

TextInput::make('amount')
    ->mask(RawJs::make('$money($input)'))
    ->stripCharacters(',')
    ->numeric()
```

:::tip
`stripCharacters()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

## 修剪空白字符

你可以使用 `trim()` 方法自动修剪输入值开头和结尾的空白字符：

```php
use Filament\Forms\Components\TextInput;

TextInput::make('name')
    ->trim()
```

你可能希望为所有文本输入全局启用修剪，类似于 Laravel 的 `TrimStrings` 中间件。你可以在服务提供者中使用 `configureUsing()` 方法：

```php
use Filament\Forms\Components\TextInput;

TextInput::configureUsing(function (TextInput $component): void {
    $component->trim();
});
```

## 将字段设为只读

不要与[禁用字段](overview#disabling-a-field)混淆，你可以使用 `readOnly()` 方法将字段设为"只读"：

```php
use Filament\Forms\Components\TextInput;

TextInput::make('name')
    ->readOnly()
```

与 [`disabled()`](overview#disabling-a-field) 相比有几个区别：

- 使用 `readOnly()` 时，字段在表单提交时仍会发送到服务器。它可以通过浏览器控制台或 JavaScript 进行修改。你可以使用 [`saved(false)`](overview#preventing-a-field-from-being-saved) 来防止这种情况。
- 使用 `readOnly()` 时没有样式变化，如降低不透明度。
- 使用 `readOnly()` 时字段仍然可以获得焦点。

你也可以传递一个布尔值来控制字段是否应该只读：

```php
use Filament\Forms\Components\TextInput;

TextInput::make('name')
    ->readOnly(FeatureFlag::active())
```

:::tip
`readOnly()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

## 文本输入验证

除了[验证](validation)页面上列出的所有规则外，还有一些特定于文本输入的额外规则。

### 长度验证

你可以通过设置 `minLength()` 和 `maxLength()` 方法来限制输入的长度。这些方法同时添加前端和后端验证：

```php
use Filament\Forms\Components\TextInput;

TextInput::make('name')
    ->minLength(2)
    ->maxLength(255)
```

你也可以通过设置 `length()` 来指定输入的确切长度。此方法同时添加前端和后端验证：

```php
use Filament\Forms\Components\TextInput;

TextInput::make('code')
    ->length(8)
```

:::tip
`minLength()`、`maxLength()` 和 `length()` 方法除了接受静态值外，还接受函数来动态计算。你可以将各种工具注入到函数参数中。
:::

### 大小验证

你可以通过设置 `minValue()` 和 `maxValue()` 方法来验证数字输入的最小值和最大值：

```php
use Filament\Forms\Components\TextInput;

TextInput::make('number')
    ->numeric()
    ->minValue(1)
    ->maxValue(100)
```

:::tip
`minValue()` 和 `maxValue()` 方法除了接受静态值外，还接受函数来动态计算。你可以将各种工具注入到函数参数中。
:::

### 电话号码验证

使用 `tel()` 字段时，值将使用以下正则表达式验证：`/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\.\/0-9]*$/`。

如果你希望更改它，可以使用 `telRegex()` 方法：

```php
use Filament\Forms\Components\TextInput;

TextInput::make('phone')
    ->tel()
    ->telRegex('/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\.\/0-9]*$/')
```

或者，要在所有字段中自定义 `telRegex()`，使用服务提供者：

```php
use Filament\Forms\Components\TextInput;

TextInput::configureUsing(function (TextInput $component): void {
    $component->telRegex('/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\.\/0-9]*$/');
});
```

:::tip
`telRegex()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::
