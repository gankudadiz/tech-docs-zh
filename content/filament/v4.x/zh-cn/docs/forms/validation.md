---
title: 验证
---

## 简介

验证规则可以添加到任何[字段](overview#表单字段)。

在 Laravel 中，验证规则通常以数组形式定义，如 `['required', 'max:255']`，或以组合字符串形式定义，如 `required|max:255`。如果你只在后端使用简单的表单请求，这没问题。但 Filament 也能够为你的用户提供前端验证，让他们可以在任何后端请求之前修复错误。

Filament 包含许多[专用验证方法](#可用规则)，但你也可以使用任何[其他 Laravel 验证规则](#其他规则)，包括[自定义验证规则](#自定义规则)。

![带有验证错误的表单](/assets/filament/v4.x/screenshots/images/light/forms/validation.jpg)

:::warning
一些默认的 Laravel 验证规则依赖于正确的属性名称，当通过 `rule()`/`rules()` 传递时将不起作用。请尽可能使用专用验证方法。
:::

## 可用规则

### 活动 URL

字段必须根据 `dns_get_record()` PHP 函数具有有效的 A 或 AAAA 记录。[查看 Laravel 文档。](https://laravel.com/docs/validation#rule-active-url)

```php
Field::make('name')->activeUrl()
```

### 之后（日期）

字段值必须是给定日期之后的值。[查看 Laravel 文档。](https://laravel.com/docs/validation#rule-after)

```php
Field::make('start_date')->after('tomorrow')
```

或者，你可以传递另一个字段的名称进行比较：

```php
Field::make('start_date')
Field::make('end_date')->after('start_date')
```

### 之后或等于（日期）

字段值必须是给定日期之后或等于的日期。[查看 Laravel 文档。](https://laravel.com/docs/validation#rule-after-or-equal)

```php
Field::make('start_date')->afterOrEqual('tomorrow')
```

或者，你可以传递另一个字段的名称进行比较：

```php
Field::make('start_date')
Field::make('end_date')->afterOrEqual('start_date')
```

### 字母

字段必须完全是字母字符。[查看 Laravel 文档。](https://laravel.com/docs/validation#rule-alpha)

```php
Field::make('name')->alpha()
```

### 字母数字和破折号

字段可以包含字母数字字符，以及破折号和下划线。[查看 Laravel 文档。](https://laravel.com/docs/validation#rule-alpha-dash)

```php
Field::make('name')->alphaDash()
```

### 字母数字

字段必须完全是字母数字字符。[查看 Laravel 文档。](https://laravel.com/docs/validation#rule-alpha-num)

```php
Field::make('name')->alphaNum()
```

### ASCII

字段必须完全是 7 位 ASCII 字符。[查看 Laravel 文档。](https://laravel.com/docs/validation#rule-ascii)

```php
Field::make('name')->ascii()
```

### 之前（日期）

字段值必须是给定日期之前的日期。[查看 Laravel 文档。](https://laravel.com/docs/validation#rule-before)

```php
Field::make('start_date')->before('first day of next month')
```

或者，你可以传递另一个字段的名称进行比较：

```php
Field::make('start_date')->before('end_date')
Field::make('end_date')
```

### 之前或等于（日期）

字段值必须是给定日期之前或等于的日期。[查看 Laravel 文档。](https://laravel.com/docs/validation#rule-before-or-equal)

```php
Field::make('start_date')->beforeOrEqual('end of this month')
```

或者，你可以传递另一个字段的名称进行比较：

```php
Field::make('start_date')->beforeOrEqual('end_date')
Field::make('end_date')
```

### 确认

字段必须有一个匹配的 `{field}_confirmation` 字段。[查看 Laravel 文档。](https://laravel.com/docs/validation#rule-confirmed)

```php
Field::make('password')->confirmed()
Field::make('password_confirmation')
```

### 不同

字段值必须与另一个不同。[查看 Laravel 文档。](https://laravel.com/docs/validation#rule-different)

```php
Field::make('backup_email')->different('email')
```

### 不以...开头

字段不得以给定值之一开头。[查看 Laravel 文档。](https://laravel.com/docs/validation#rule-doesnt-start-with)

```php
Field::make('name')->doesntStartWith(['admin'])
```

### 不以...结尾

字段不得以给定值之一结尾。[查看 Laravel 文档。](https://laravel.com/docs/validation#rule-doesnt-end-with)

```php
Field::make('name')->doesntEndWith(['admin'])
```

### 以...结尾

字段必须以给定值之一结尾。[查看 Laravel 文档。](https://laravel.com/docs/validation#rule-ends-with)

```php
Field::make('name')->endsWith(['bot'])
```

### 枚举

字段必须包含有效的枚举值。[查看 Laravel 文档。](https://laravel.com/docs/validation#rule-enum)

```php
Field::make('status')->enum(MyStatus::class)
```

### 存在

字段值必须存在于数据库中。[查看 Laravel 文档。](https://laravel.com/docs/validation#rule-exists)

```php
Field::make('invitation')->exists()
```

默认情况下，将搜索表单的模型（如果已注册）。你可以指定自定义表名或模型进行搜索：

```php
use App\Models\Invitation;

Field::make('invitation')->exists(table: Invitation::class)
```

默认情况下，字段名称将用作搜索列。你可以指定自定义列进行搜索：

```php
Field::make('invitation')->exists(column: 'id')
```

你可以通过向 `modifyRuleUsing` 参数传递[闭包](overview#字段工具注入)来进一步自定义规则：

```php
use Illuminate\Validation\Rules\Exists;

Field::make('invitation')
    ->exists(modifyRuleUsing: function (Exists $rule) {
        return $rule->where('is_active', 1);
    })
```

Laravel 的 `exists` 验证规则默认不使用 Eloquent 模型查询数据库，因此它不会使用模型上定义的任何全局作用域，包括软删除。因此，即使存在具有相同值的软删除记录，验证也会通过。

由于不应用全局作用域，Filament 的多租户功能默认也不会将查询范围限定到当前租户。

为此，你应该改用 `scopedExists()` 方法，它用使用模型查询数据库的实现替换了 Laravel 的 `exists` 实现，应用模型上定义的任何全局作用域，包括软删除和多租户：

```php
use Filament\Forms\Components\TextInput;

TextInput::make('email')
    ->scopedExists()
```

如果你想修改用于检查存在的 Eloquent 查询（包括移除全局作用域），可以向 `modifyQueryUsing` 参数传递一个函数：

```php
use Filament\Forms\Components\TextInput;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

TextInput::make('email')
    ->scopedExists(modifyQueryUsing: function (Builder $query) {
        return $query->withoutGlobalScope(SoftDeletingScope::class);
    })
```

### 已填充

字段在存在时不得为空。[查看 Laravel 文档。](https://laravel.com/docs/validation#rule-filled)

```php
Field::make('name')->filled()
```

### 大于

字段值必须大于另一个。[查看 Laravel 文档。](https://laravel.com/docs/validation#rule-gt)

```php
Field::make('newNumber')->gt('oldNumber')
```

### 大于或等于

字段值必须大于或等于另一个。[查看 Laravel 文档。](https://laravel.com/docs/validation#rule-gte)

```php
Field::make('newNumber')->gte('oldNumber')
```

### 十六进制颜色

字段值必须是有效的十六进制格式颜色。[查看 Laravel 文档。](https://laravel.com/docs/validation#rule-hex-color)

```php
Field::make('color')->hexColor()
```

### 在...中

字段必须包含在给定的值列表中。[查看 Laravel 文档。](https://laravel.com/docs/validation#rule-in)

```php
Field::make('status')->in(['pending', 'completed'])
```

[开关按钮](toggle-buttons)、[复选框列表](checkbox-list)、[单选按钮](radio)和[选择器](select#有效选项验证in-规则)字段会根据其可用选项自动应用 `in()` 规则，因此你不需要手动添加。

### IP 地址

字段必须是 IP 地址。[查看 Laravel 文档。](https://laravel.com/docs/validation#rule-ip)

```php
Field::make('ip_address')->ip()
Field::make('ip_address')->ipv4()
Field::make('ip_address')->ipv6()
```

### JSON

字段必须是有效的 JSON 字符串。[查看 Laravel 文档。](https://laravel.com/docs/validation#rule-json)

```php
Field::make('ip_address')->json()
```

### 小于

字段值必须小于另一个。[查看 Laravel 文档。](https://laravel.com/docs/validation#rule-lt)

```php
Field::make('newNumber')->lt('oldNumber')
```

### 小于或等于

字段值必须小于或等于另一个。[查看 Laravel 文档。](https://laravel.com/docs/validation#rule-lte)

```php
Field::make('newNumber')->lte('oldNumber')
```

### MAC 地址

字段必须是 MAC 地址。[查看 Laravel 文档。](https://laravel.com/docs/validation#rule-mac)

```php
Field::make('mac_address')->macAddress()
```

### 倍数

字段必须是值的倍数。[查看 Laravel 文档。](https://laravel.com/docs/validation#multiple-of)

```php
Field::make('number')->multipleOf(2)
```

### 不在...中

字段不得包含在给定的值列表中。[查看 Laravel 文档。](https://laravel.com/docs/validation#rule-not-in)

```php
Field::make('status')->notIn(['cancelled', 'rejected'])
```

### 非正则表达式

字段不得匹配给定的正则表达式。[查看 Laravel 文档。](https://laravel.com/docs/validation#rule-not-regex)

```php
Field::make('email')->notRegex('/^.+$/i')
```

### 可空

字段值可以为空。如果不存在 `required` 规则，则默认应用此规则。[查看 Laravel 文档。](https://laravel.com/docs/validation#rule-nullable)

```php
Field::make('name')->nullable()
```

### 禁止

字段值必须为空。[查看 Laravel 文档。](https://laravel.com/docs/validation#rule-prohibited)

```php
Field::make('name')->prohibited()
```

### 条件禁止

字段必须为空，*仅当*另一个指定字段具有任何给定值时。[查看 Laravel 文档。](https://laravel.com/docs/validation#rule-prohibited-if)

```php
Field::make('name')->prohibitedIf('field', 'value')
```

### 除非禁止

字段必须为空，*除非*另一个指定字段具有任何给定值。[查看 Laravel 文档。](https://laravel.com/docs/validation#rule-prohibited-unless)

```php
Field::make('name')->prohibitedUnless('field', 'value')
```

### 禁止其他字段

如果字段不为空，所有其他指定字段必须为空。[查看 Laravel 文档。](https://laravel.com/docs/validation#rule-prohibits)

```php
Field::make('name')->prohibits('field')

Field::make('name')->prohibits(['field', 'another_field'])
```

### 必填

字段值不得为空。[查看 Laravel 文档。](https://laravel.com/docs/validation#rule-required)

```php
Field::make('name')->required()
```

#### 将字段标记为必填

默认情况下，必填字段会在其标签旁边显示星号 `*`。你可能希望在所有字段都是必填的表单上隐藏星号，或者改为在可选字段旁边添加[提示](overview#在字段标签后方添加额外内容)：

```php
use Filament\Forms\Components\TextInput;

TextInput::make('name')
    ->required() // 添加验证以确保字段必填
    ->markAsRequired(false) // 移除星号
```

如果你的字段不是 `required()`，但你仍希望显示星号 `*`，也可以使用 `markAsRequired()`：

```php
use Filament\Forms\Components\TextInput;

TextInput::make('name')
    ->markAsRequired()
```

### 条件必填

字段值不得为空，*仅当*另一个指定字段具有任何给定值时。[查看 Laravel 文档。](https://laravel.com/docs/validation#rule-required-if)

```php
Field::make('name')->requiredIf('field', 'value')
```

### 接受后必填

字段值不得为空，*仅当*另一个指定字段等于 "yes"、"on"、1、"1"、true 或 "true" 时。[查看 Laravel 文档。](https://laravel.com/docs/validation#rule-required-if-accepted)

```php
Field::make('name')->requiredIfAccepted('field')
```

### 除非必填

字段值不得为空，*除非*另一个指定字段具有任何给定值。[查看 Laravel 文档。](https://laravel.com/docs/validation#rule-required-unless)

```php
Field::make('name')->requiredUnless('field', 'value')
```

### 有...时必填

字段值不得为空，*仅当*任何其他指定字段不为空时。[查看 Laravel 文档。](https://laravel.com/docs/validation#rule-required-with)

```php
Field::make('name')->requiredWith('field,another_field')
```

### 全有时必填

字段值不得为空，*仅当*所有其他指定字段都不为空时。[查看 Laravel 文档。](https://laravel.com/docs/validation#rule-required-with-all)

```php
Field::make('name')->requiredWithAll('field,another_field')
```

### 无...时必填

字段值不得为空，*仅当*任何其他指定字段为空时。[查看 Laravel 文档。](https://laravel.com/docs/validation#rule-required-without)

```php
Field::make('name')->requiredWithout('field,another_field')
```

### 全无时必填

字段值不得为空，*仅当*所有其他指定字段都为空时。[查看 Laravel 文档。](https://laravel.com/docs/validation#rule-required-without-all)

```php
Field::make('name')->requiredWithoutAll('field,another_field')
```

### 正则表达式

字段必须匹配给定的正则表达式。[查看 Laravel 文档。](https://laravel.com/docs/validation#rule-regex)

```php
Field::make('email')->regex('/^.+@.+$/i')
```

### 相同

字段值必须与另一个相同。[查看 Laravel 文档。](https://laravel.com/docs/validation#rule-same)

```php
Field::make('password')->same('passwordConfirmation')
```

### 以...开头

字段必须以给定值之一开头。[查看 Laravel 文档。](https://laravel.com/docs/validation#rule-starts-with)

```php
Field::make('name')->startsWith(['a'])
```

### 字符串

字段必须是字符串。[查看 Laravel 文档。](https://laravel.com/docs/validation#rule-string)

```php
Field::make('name')->string()
```

### 唯一

字段值不得存在于数据库中。[查看 Laravel 文档。](https://laravel.com/docs/validation#rule-unique)

```php
Field::make('email')->unique()
```

如果你的 Filament 表单已经关联了 Eloquent 模型（如在[面板资源](../resources)中），Filament 将使用它。你也可以指定自定义表名或模型进行搜索：

```php
use App\Models\User;

Field::make('email')->unique(table: User::class)
```

默认情况下，字段名称将用作搜索列。你可以指定自定义列进行搜索：

```php
Field::make('email')->unique(column: 'email_address')
```

通常，你希望在唯一性验证期间忽略给定的模型。例如，考虑一个包含用户名、电子邮件地址和位置的"更新个人资料"表单。你可能希望验证电子邮件地址是唯一的。然而，如果用户只更改了名称字段而没有更改电子邮件字段，你不希望因为用户已经是该电子邮件地址的所有者而抛出验证错误。如果你的 Filament 表单已经关联了 Eloquent 模型（如在[面板资源](../resources)中），Filament 将忽略它。

要防止 Filament 忽略当前的 Eloquent 记录，你可以向 `ignoreRecord` 参数传递 `false`：

```php
Field::make('email')->unique(ignoreRecord: false)
```

或者，要忽略你选择的 Eloquent 记录，你可以将其传递给 `ignorable` 参数：

```php
Field::make('email')->unique(ignorable: $ignoredUser)
```

你可以通过向 `modifyRuleUsing` 参数传递[闭包](overview#字段工具注入)来进一步自定义规则：

```php
use Illuminate\Validation\Rules\Unique;

Field::make('email')
    ->unique(modifyRuleUsing: function (Unique $rule) {
        return $rule->where('is_active', 1);
    })
```

Laravel 的 `unique` 验证规则默认不使用 Eloquent 模型查询数据库，因此它不会使用模型上定义的任何全局作用域，包括软删除。因此，即使存在具有相同值的软删除记录，验证也会失败。

由于不应用全局作用域，Filament 的多租户功能默认也不会将查询范围限定到当前租户。

为此，你应该改用 `scopedUnique()` 方法，它用使用模型查询数据库的实现替换了 Laravel 的 `unique` 实现，应用模型上定义的任何全局作用域，包括软删除和多租户：

```php
use Filament\Forms\Components\TextInput;

TextInput::make('email')
    ->scopedUnique()
```

如果你想修改用于检查唯一性的 Eloquent 查询（包括移除全局作用域），可以向 `modifyQueryUsing` 参数传递一个函数：

```php
use Filament\Forms\Components\TextInput;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

TextInput::make('email')
    ->scopedUnique(modifyQueryUsing: function (Builder $query) {
        return $query->withoutGlobalScope(SoftDeletingScope::class);
    })
```

### ULID

验证中的字段必须是有效的[通用唯一字典排序标识符](https://github.com/ulid/spec)（ULID）。[查看 Laravel 文档。](https://laravel.com/docs/validation#rule-ulid)

```php
Field::make('identifier')->ulid()
```

### UUID

字段必须是有效的 RFC 4122（版本 1、3、4 或 5）通用唯一标识符（UUID）。[查看 Laravel 文档。](https://laravel.com/docs/validation#rule-uuid)

```php
Field::make('identifier')->uuid()
```

## 其他规则

你可以使用 `rules()` 方法向任何字段添加其他验证规则：

```php
TextInput::make('slug')->rules(['alpha_dash'])
```

完整的验证规则列表可以在 [Laravel 文档](https://laravel.com/docs/validation#available-validation-rules)中找到。

## 自定义规则

你可以像在 [Laravel](https://laravel.com/docs/validation#custom-validation-rules) 中一样使用任何自定义验证规则：

```php
TextInput::make('slug')->rules([new Uppercase()])
```

你也可以使用[闭包规则](https://laravel.com/docs/validation#using-closures)：

```php
use Closure;

TextInput::make('slug')->rules([
    fn (): Closure => function (string $attribute, $value, Closure $fail) {
        if ($value === 'foo') {
            $fail('The :attribute is invalid.');
        }
    },
])
```

你可以[注入工具](overview#字段工具注入)如 [`$get`](overview#注入另一个字段的状态) 到你的自定义规则中，例如如果你需要在表单中引用其他字段值。为此，请将闭包规则包装在另一个返回它的函数中：

```php
use Filament\Schemas\Components\Utilities\Get;

TextInput::make('slug')->rules([
    fn (Get $get): Closure => function (string $attribute, $value, Closure $fail) use ($get) {
        if ($get('other_field') === 'foo' && $value !== 'bar') {
            $fail("The {$attribute} is invalid.");
        }
    },
])
```

## 自定义验证属性

当字段验证失败时，其标签会用于错误消息中。要自定义字段错误消息中使用的标签，请使用 `validationAttribute()` 方法：

```php
use Filament\Forms\Components\TextInput;

TextInput::make('name')
    ->validationAttribute('full name')
```

:::tip
`validationAttribute()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

## 验证消息

默认情况下使用 Laravel 的验证错误消息。要自定义错误消息，请使用 `validationMessages()` 方法：

```php
use Filament\Forms\Components\TextInput;

TextInput::make('email')
    ->unique(// ...)
    ->validationMessages([
        'unique' => 'The :attribute has already been registered.',
    ])
```

:::tip
`validationMessages()` 方法除了接受静态值数组外，还接受每个消息的函数。你可以将各种工具注入到函数参数中。
:::

### 在验证消息中允许 HTML

默认情况下，验证消息以纯文本呈现以防止 XSS 攻击。但是，你可能需要在验证消息中渲染 HTML，例如在显示列表或链接时。要为验证消息启用 HTML 渲染，请使用 `allowHtmlValidationMessages()` 方法：

```php
use Filament\Forms\Components\TextInput;

TextInput::make('password')
    ->required()
    ->rules([
        new CustomRule(), // 返回包含 HTML 的验证消息的自定义规则
    ])
    ->allowHtmlValidationMessages()
```

请注意，你需要确保所有验证消息中的 HTML 都是安全可渲染的，否则你的应用程序将容易受到 XSS 攻击。

## 当字段未保存时禁用验证

当字段[未保存](overview#阻止字段被保存)时，它仍然会被验证。要为未保存的字段禁用验证，请使用 `validatedWhenNotDehydrated()` 方法：

```php
use Filament\Forms\Components\TextInput;

TextInput::make('name')
    ->required()
    ->saved(false)
    ->validatedWhenNotDehydrated(false)
```

:::tip
`validatedWhenNotDehydrated()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::
