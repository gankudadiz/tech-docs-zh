---
title: 文本条目
---

## 简介

文本条目显示简单文本：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('title')
```

![文本条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/text/simple.jpg)

## 自定义颜色

你可以为文本设置[颜色](../styling/colors)：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('status')
    ->color('primary')
```

除了允许静态值外，`color()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。

![主色调的文本条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/text/color.jpg)

## 添加图标

文本条目也可以有[图标](../styling/icons)：

```php
use Filament\Infolists\Components\TextEntry;
use Filament\Support\Icons\Heroicon;

TextEntry::make('email')
    ->icon(Heroicon::Envelope)
```

`icon()` 方法也接受一个函数来动态计算图标。你可以将各种实用工具作为参数注入到函数中。

![带有图标的文本条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/text/icon.jpg)

你可以使用 `iconPosition()` 设置图标的位置：

```php
use Filament\Infolists\Components\TextEntry;
use Filament\Support\Enums\IconPosition;
use Filament\Support\Icons\Heroicon;

TextEntry::make('email')
    ->icon(Heroicon::Envelope)
    ->iconPosition(IconPosition::After) // `IconPosition::Before` 或 `IconPosition::After`
```

`iconPosition()` 方法也接受一个函数来动态计算图标位置。你可以将各种实用工具作为参数注入到函数中。

![图标在后的文本条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/text/icon-after.jpg)

图标颜色默认为文本颜色，但你可以使用 `iconColor()` 单独自定义图标[颜色](../styling/colors)：

```php
use Filament\Infolists\Components\TextEntry;
use Filament\Support\Icons\Heroicon;

TextEntry::make('email')
    ->icon(Heroicon::Envelope)
    ->iconColor('primary')
```

`iconColor()` 方法也接受一个函数来动态计算图标颜色。你可以将各种实用工具作为参数注入到函数中。

![主色调图标的文本条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/text/icon-color.jpg)

## 显示为"徽章"

默认情况下，文本相当朴素，没有背景颜色。你可以使用 `badge()` 方法使其显示为"徽章"。一个很好的用例是状态，你可能想要显示一个与状态匹配的[颜色](#自定义颜色)的徽章：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('status')
    ->badge()
    ->color(fn (string $state): string => match ($state) {
        'draft' => 'gray',
        'reviewing' => 'warning',
        'published' => 'success',
        'rejected' => 'danger',
    })
```

![作为徽章的文本条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/text/badge.jpg)

你可以向徽章添加其他内容，如[图标](#添加图标)。

你可以选择传递一个布尔值来控制文本是否应该在徽章中：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('status')
    ->badge(FeatureFlag::active())
```

除了允许静态值外，`badge()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。

## 格式化

使用文本条目时，你可能希望 UI 中实际输出的文本与条目的原始[状态](overview#条目内容状态)不同，后者通常是从 Eloquent 模型自动检索的。格式化状态允许你保持原始数据的完整性，同时允许以更用户友好的方式呈现它。

要格式化文本条目的状态而不更改状态本身，可以使用 `formatStateUsing()` 方法。此方法接受一个函数，该函数以状态作为参数并返回格式化后的状态：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('status')
    ->formatStateUsing(fn (string $state): string => __("statuses.{$state}"))
```

在这种情况下，数据库中的 `status` 列可能包含 `draft`、`reviewing`、`published` 或 `rejected` 等值，但格式化后的状态将是这些值的翻译版本。

传递给 `formatStateUsing()` 的函数可以注入各种实用工具作为参数。

### 日期格式化

除了将函数传递给 `formatStateUsing()`，你还可以使用 `date()`、`dateTime()` 和 `time()` 方法来使用 [PHP 日期格式化标记](https://www.php.net/manual/en/datetime.format.php)格式化条目的状态：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('created_at')
    ->date()

TextEntry::make('created_at')
    ->dateTime()

TextEntry::make('created_at')
    ->time()
```

![带有日期格式化的文本条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/text/date.jpg)

你可以通过向 `date()`、`dateTime()` 或 `time()` 方法传递自定义格式字符串来自定义日期格式。你可以使用任何 [PHP 日期格式化标记](https://www.php.net/manual/en/datetime.format.php)：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('created_at')
    ->date('M j, Y')

TextEntry::make('created_at')
    ->dateTime('M j, Y H:i:s')

TextEntry::make('created_at')
    ->time('H:i:s')
```

除了允许静态值外，`date()`、`dateTime()` 和 `time()` 方法还接受一个函数来动态计算格式。你可以将各种实用工具作为参数注入到函数中。

#### 使用 Carbon 宏格式进行日期格式化

你还可以使用 `isoDate()`、`isoDateTime()` 和 `isoTime()` 方法来使用 [Carbon 的宏格式](https://carbon.nesbot.com/docs/#available-macro-formats)格式化条目的状态：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('created_at')
    ->isoDate()

TextEntry::make('created_at')
    ->isoDateTime()

TextEntry::make('created_at')
    ->isoTime()
```

你可以通过向 `isoDate()`、`isoDateTime()` 或 `isoTime()` 方法传递自定义宏格式字符串来自定义日期格式。你可以使用任何 [Carbon 的宏格式](https://carbon.nesbot.com/docs/#available-macro-formats)：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('created_at')
    ->isoDate('L')

TextEntry::make('created_at')
    ->isoDateTime('LLL')

TextEntry::make('created_at')
    ->isoTime('LT')
```

除了允许静态值外，`isoDate()`、`isoDateTime()` 和 `isoTime()` 方法还接受一个函数来动态计算格式。你可以将各种实用工具作为参数注入到函数中。

#### 相对日期格式化

你可以使用 `since()` 方法来使用 [Carbon 的 `diffForHumans()`](https://carbon.nesbot.com/docs/#api-humandiff) 格式化条目的状态：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('created_at')
    ->since()
```

![带有相对日期格式化的文本条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/text/since.jpg)

#### 在工具提示中显示格式化日期

此外，你可以使用 `dateTooltip()`、`dateTimeTooltip()`、`timeTooltip()`、`isoDateTooltip()`、`isoDateTimeTooltip()`、`isoTime()`、`isoTimeTooltip()` 或 `sinceTooltip()` 方法在[工具提示](overview#向条目添加工具提示)中显示格式化日期，通常用于提供额外信息：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('created_at')
    ->since()
    ->dateTooltip() // 接受自定义 PHP 日期格式化字符串

TextEntry::make('created_at')
    ->since()
    ->dateTimeTooltip() // 接受自定义 PHP 日期格式化字符串

TextEntry::make('created_at')
    ->since()
    ->timeTooltip() // 接受自定义 PHP 日期格式化字符串

TextEntry::make('created_at')
    ->since()
    ->isoDateTooltip() // 接受自定义 Carbon 宏格式字符串

TextEntry::make('created_at')
    ->since()
    ->isoDateTimeTooltip() // 接受自定义 Carbon 宏格式字符串

TextEntry::make('created_at')
    ->since()
    ->isoTimeTooltip() // 接受自定义 Carbon 宏格式字符串

TextEntry::make('created_at')
    ->dateTime()
    ->sinceTooltip()
```

![相对日期上带有日期工具提示的文本条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/text/date-tooltip.jpg)

#### 设置日期格式化的时区

上面列出的每个日期格式化方法还接受一个 `timezone` 参数，允许你将状态中设置的时间转换为不同的时区：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('created_at')
    ->dateTime(timezone: 'America/New_York')
```

你也可以将时区传递给条目的 `timezone()` 方法，以便一次将时区应用于所有日期时间格式化方法：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('created_at')
    ->timezone('America/New_York')
    ->dateTime()
```

除了允许静态值外，`timezone()` 方法还接受一个函数来动态计算时区。你可以将各种实用工具作为参数注入到函数中。

如果你不向条目传递 `timezone()`，它将使用 Filament 的默认时区。你可以在服务提供者（如 `AppServiceProvider`）的 `boot()` 方法中使用 `FilamentTimezone::set()` 方法设置 Filament 的默认时区：

```php
use Filament\Support\Facades\FilamentTimezone;

public function boot(): void
{
    FilamentTimezone::set('America/New_York');
}
```

如果你想为应用程序中的所有文本条目设置默认时区，这很有用。它也用于 Filament 中使用时区的其他地方。

:::warning
    Filament 的默认时区仅在条目存储时间时适用。如果条目仅存储日期（`date()` 而不是 `dateTime()`），则不会应用时区。这是为了防止在存储没有时间的日期时时区偏移。
:::

### 数字格式化

除了将函数传递给 `formatStateUsing()`，你还可以使用 `numeric()` 方法将条目格式化为数字：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('stock')
    ->numeric()
```

![带有数字格式化的文本条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/text/numeric.jpg)

如果你想自定义用于格式化数字的小数位数，可以使用 `decimalPlaces` 参数：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('stock')
    ->numeric(decimalPlaces: 0)
```

除了允许静态值外，`decimalPlaces` 参数还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。

默认情况下，你的应用程序的语言环境将用于适当地格式化数字。如果你想自定义使用的语言环境，可以将其传递给 `locale` 参数：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('stock')
    ->numeric(locale: 'nl')
```

除了允许静态值外，`locale` 参数还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。

### 货币格式化

除了将函数传递给 `formatStateUsing()`，你可以使用 `money()` 方法轻松格式化任何货币的金额：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('price')
    ->money('EUR')
```

![带有货币格式化的文本条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/text/money.jpg)

除了允许静态值外，`money()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。

`money()` 还有一个 `divideBy` 参数，允许你在格式化之前将原始值除以一个数字。如果你的数据库以分为单位存储价格，这可能很有用：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('price')
    ->money('EUR', divideBy: 100)
```

除了允许静态值外，`divideBy` 参数还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。

默认情况下，你的应用程序的语言环境将用于适当地格式化货币。如果你想自定义使用的语言环境，可以将其传递给 `locale` 参数：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('price')
    ->money('EUR', locale: 'nl')
```

除了允许静态值外，`locale` 参数还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。

如果你想自定义用于格式化数字的小数位数，可以使用 `decimalPlaces` 参数：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('price')
    ->money('EUR', decimalPlaces: 3)
```

除了允许静态值外，`decimalPlaces` 参数还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。

### 渲染 Markdown

如果你的条目值是 Markdown，你可以使用 `markdown()` 渲染它：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('description')
    ->markdown()
```

![带有 Markdown 渲染的文本条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/text/markdown.jpg)

你可以选择传递一个布尔值来控制文本是否应该渲染为 Markdown：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('description')
    ->markdown(FeatureFlag::active())
```

除了允许静态值外，`markdown()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。

### 渲染 HTML

如果你的条目值是 HTML，你可以使用 `html()` 渲染它：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('description')
    ->html()
```

![带有 HTML 渲染的文本条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/text/html.jpg)

你可以选择传递一个布尔值来控制文本是否应该渲染为 HTML：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('description')
    ->html(FeatureFlag::active())
```

除了允许静态值外，`html()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。

:::danger
    Filament 内置的 HTML 清理器允许内联 `style` 属性，以支持富文本格式化功能，如字体颜色、文本高亮和图片大小调整。这意味着像 `background: url(...)` 或 `position: fixed` 这样的 CSS 属性不会从清理后的 HTML 中剥离。如果你的内容来自不受信任的用户，你应该考虑限制默认配置。有关如何自定义清理器的详细信息，请参阅[安全文档](../advanced/security#自定义清理器)。
:::

#### 渲染未经清理的原始 HTML

如果你使用此方法，HTML 将在渲染之前被清理以移除任何潜在的不安全内容。如果你想退出此行为，可以通过将 HTML 包装在 `HtmlString` 对象中来格式化它：

```php
use Filament\Infolists\Components\TextEntry;
use Illuminate\Support\HtmlString;

TextEntry::make('description')
    ->formatStateUsing(fn (string $state): HtmlString => new HtmlString($state))
```

:::danger
    渲染原始 HTML 时要小心，因为它可能包含恶意内容，这可能导致应用程序中的安全漏洞，如跨站脚本（XSS）攻击。在使用此方法之前，请务必确保你渲染的 HTML 是安全的。
:::

或者，你可以从 `formatStateUsing()` 方法返回一个 `view()` 对象，这也不会被清理：

```php
use Filament\Infolists\Components\TextEntry;
use Illuminate\Contracts\View\View;

TextEntry::make('description')
    ->formatStateUsing(fn (string $state): View => view(
        'filament.infolists.components.description-entry-content',
        ['state' => $state],
    ))
```

## 列出多个值

如果文本条目的[状态](overview#条目内容状态)是数组，可以在文本条目中渲染多个值。如果你在 Eloquent 属性上使用 `array` 转换、具有多个结果的 Eloquent 关联，或者你已将数组传递给 [`state()` 方法](overview#设置条目的状态)，就会发生这种情况。如果文本条目中有多个值，它们将以逗号分隔。你可以使用 `listWithLineBreaks()` 方法在新行上显示它们：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('authors.name')
    ->listWithLineBreaks()
```

![带有多个值的文本条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/text/list.jpg)

你可以选择传递一个布尔值来控制文本是否应该在每个项目之间有换行符：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('authors.name')
    ->listWithLineBreaks(FeatureFlag::active())
```

除了允许静态值外，`listWithLineBreaks()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。

### 向列表添加项目符号

你可以使用 `bulleted()` 方法向每个列表项添加项目符号：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('authors.name')
    ->bulleted()
```

![带有多个值和项目符号的文本条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/text/bullet-list.jpg)

你可以选择传递一个布尔值来控制文本是否应该有项目符号：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('authors.name')
    ->bulleted(FeatureFlag::active())
```

除了允许静态值外，`bulleted()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。

### 限制列表中的值数量

你可以使用 `limitList()` 方法限制列表中的值数量：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('authors.name')
    ->listWithLineBreaks()
    ->limitList(3)
```

除了允许静态值外，`limitList()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。

#### 展开受限列表

你可以使用 `expandableLimitedList()` 方法允许受限项目展开和折叠：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('authors.name')
    ->listWithLineBreaks()
    ->limitList(3)
    ->expandableLimitedList()
```

:::info
    这只是 `listWithLineBreaks()` 或 `bulleted()` 的功能，其中每个项目都在自己的行上。
:::

你可以选择传递一个布尔值来控制文本是否应该可展开：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('authors.name')
    ->listWithLineBreaks()
    ->limitList(3)
    ->expandableLimitedList(FeatureFlag::active())
```

除了允许静态值外，`expandableLimitedList()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。

![带有可展开受限列表的文本条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/text/expandable-limited-list.jpg)

### 将单个值拆分为多个列表项

如果你想将模型中的文本字符串"拆分"为多个列表项，可以使用 `separator()` 方法。这对于显示逗号分隔的标签[作为徽章](#显示为徽章)很有用：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('tags')
    ->badge()
    ->separator(',')
```

![带有逗号分隔值徽章的文本条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/text/separator-badge.jpg)

除了允许静态值外，`separator()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。

## 聚合关联

Filament 提供了几种聚合关联字段的方法，包括 `avg()`、`max()`、`min()` 和 `sum()`。例如，如果你想显示所有相关记录上某个字段的平均值，可以使用 `avg()` 方法：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('users_avg_age')->avg('users', 'age')
```

在此示例中，`users` 是关联的名称，而 `age` 是正在求平均值的字段。条目的名称必须是 `users_avg_age`，因为这是 [Laravel 用于存储结果的约定](https://laravel.com/docs/eloquent-relationships#other-aggregate-functions)。

如果你想在聚合之前限定关联范围，可以向方法传递一个数组，其中键是关联名称，值是用于限定 Eloquent 查询的函数：

```php
use Filament\Infolists\Components\TextEntry;
use Illuminate\Database\Eloquent\Builder;

TextEntry::make('users_avg_age')->avg([
    'users' => fn (Builder $query) => $query->where('is_active', true),
], 'age')
```

## 自定义文本大小

文本条目默认具有小字体大小，但你可以将其更改为 `TextSize::ExtraSmall`、`TextSize::Medium` 或 `TextSize::Large`。

例如，你可以使用 `size(TextSize::Large)` 使文本更大：

```php
use Filament\Infolists\Components\TextEntry;
use Filament\Support\Enums\TextSize;

TextEntry::make('title')
    ->size(TextSize::Large)
```

![大字体大小的文本条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/text/large.jpg)

## 自定义字体粗细

文本条目默认具有常规字体粗细，但你可以将其更改为以下任何选项：`FontWeight::Thin`、`FontWeight::ExtraLight`、`FontWeight::Light`、`FontWeight::Medium`、`FontWeight::SemiBold`、`FontWeight::Bold`、`FontWeight::ExtraBold` 或 `FontWeight::Black`。

例如，你可以使用 `weight(FontWeight::Bold)` 使字体加粗：

```php
use Filament\Infolists\Components\TextEntry;
use Filament\Support\Enums\FontWeight;

TextEntry::make('title')
    ->weight(FontWeight::Bold)
```

除了允许静态值外，`weight()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。

![粗体字体的文本条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/text/bold.jpg)

## 自定义字体系列

你可以将文本字体系列更改为以下任何选项：`FontFamily::Sans`、`FontFamily::Serif` 或 `FontFamily::Mono`。

例如，你可以使用 `fontFamily(FontFamily::Mono)` 使字体等宽：

```php
use Filament\Support\Enums\FontFamily;
use Filament\Infolists\Components\TextEntry;

TextEntry::make('apiKey')
    ->label('API key')
    ->fontFamily(FontFamily::Mono)
```

除了允许静态值外，`fontFamily()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。

![等宽字体的文本条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/text/mono.jpg)

## 处理长文本

### 限制文本长度

你可以使用 `limit()` 限制条目值的长度：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('description')
    ->limit(50)
```

除了允许静态值外，`limit()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。

![限制文本长度的文本条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/text/limit.jpg)

默认情况下，当文本被截断时，省略号（`...`）会附加到文本末尾。你可以通过向 `end` 参数传递自定义字符串来自定义此行为：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('description')
    ->limit(50, end: ' (more)')
```

除了允许静态值外，`end` 参数还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。

你还可以使用 `getCharacterLimit()` 方法获取传递给 `limit()` 的值，以便在函数中重用它：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('description')
    ->limit(50)
    ->tooltip(function (TextEntry $component): ?string {
        $state = $component->getState();

        if (strlen($state) <= $component->getCharacterLimit()) {
            return null;
        }

        // 仅当条目内容超过长度限制时才渲染工具提示。
        return $state;
    })
```

### 限制字数

你可以限制条目中显示的 `words()` 数量：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('description')
    ->words(10)
```

除了允许静态值外，`words()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。

![限制字数的文本条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/text/words.jpg)

默认情况下，当文本被截断时，省略号（`...`）会附加到文本末尾。你可以通过向 `end` 参数传递自定义字符串来自定义此行为：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('description')
    ->words(10, end: ' (more)')
```

除了允许静态值外，`end` 参数还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。

### 将文本限制为特定行数

你可能希望将文本限制为特定行数，而不是将其限制为固定长度。将文本限制为一定行数在响应式界面中很有用，你希望确保在所有屏幕尺寸上获得一致的体验。这可以使用 `lineClamp()` 方法实现：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('description')
    ->lineClamp(2)
```

除了允许静态值外，`lineClamp()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。

![带有行限制的文本条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/text/line-clamp.jpg)

### 防止文本换行

默认情况下，如果文本超过容器的宽度，它将换行到下一行。你可以使用 `wrap(false)` 方法防止此行为：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('description')
    ->wrap(false)
```

除了允许静态值外，`wrap()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。

![禁用换行的文本条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/text/wrap.jpg)

## 允许文本复制到剪贴板

你可以使文本可复制，这样点击条目就会将文本复制到剪贴板，并且可以选择指定自定义确认消息和持续时间（毫秒）：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('apiKey')
    ->label('API key')
    ->copyable()
    ->copyMessage('Copied!')
    ->copyMessageDuration(1500)
```

![带有复制按钮的文本条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/text/copyable.jpg)

你可以选择传递一个布尔值来控制文本是否应该可复制：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('apiKey')
    ->label('API key')
    ->copyable(FeatureFlag::active())
```

除了允许静态值外，`copyable()`、`copyMessage()` 和 `copyMessageDuration()` 方法还接受函数来动态计算它们。你可以将各种实用工具作为参数注入到函数中。

:::warning
    此功能仅在应用程序启用 SSL 时有效。
:::

## 添加后缀和前缀操作

你可以使用 `prefixAction()` 和 `suffixAction()` 方法在条目前后放置[操作](../actions/overview)：

```php
use Filament\Actions\Action;
use Filament\Infolists\Components\TextEntry;
use Filament\Support\Icons\Heroicon;

TextEntry::make('cost')
    ->prefix('€')
    ->suffixAction(
        Action::make('copyCostToPrice')
            ->icon(Heroicon::Clipboard),
    )
```

![带有后缀操作的文本条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/actions/suffix.jpg)
