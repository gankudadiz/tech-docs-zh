---
title: 文本列
---

## 简介

文本列显示简单文本：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('title')
```

![文本列](/assets/filament/v4.x/screenshots/images/light/tables/columns/text/simple.jpg)

## 自定义颜色

你可以为文本设置[颜色](../../styling/colors)：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('status')
    ->color('primary')
```

除固定值外，`color()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

![主色调文本列](/assets/filament/v4.x/screenshots/images/light/tables/columns/text/color.jpg)

## 添加图标

文本列也可以有[图标](../../styling/icons)：

```php
use Filament\Tables\Columns\TextColumn;
use Filament\Support\Icons\Heroicon;

TextColumn::make('email')
    ->icon(Heroicon::Envelope)
```

`icon()` 方法也可以接收闭包来动态计算图标，并支持注入 Filament 的工具参数。

![带图标的文本列](/assets/filament/v4.x/screenshots/images/light/tables/columns/text/icon.jpg)

你可以使用 `iconPosition()` 设置图标位置：

```php
use Filament\Tables\Columns\TextColumn;
use Filament\Support\Enums\IconPosition;
use Filament\Support\Icons\Heroicon;

TextColumn::make('email')
    ->icon(Heroicon::Envelope)
    ->iconPosition(IconPosition::After) // `IconPosition::Before` 或 `IconPosition::After`
```

`iconPosition()` 方法也可以接收闭包来动态计算图标位置，并支持注入 Filament 的工具参数。

![图标在后的文本列](/assets/filament/v4.x/screenshots/images/light/tables/columns/text/icon-after.jpg)

图标颜色默认为文本颜色，但你可以使用 `iconColor()` 单独自定义图标[颜色](../../styling/colors)：

```php
use Filament\Tables\Columns\TextColumn;
use Filament\Support\Icons\Heroicon;

TextColumn::make('email')
    ->icon(Heroicon::Envelope)
    ->iconColor('primary')
```

`iconColor()` 方法也可以接收闭包来动态计算图标颜色，并支持注入 Filament 的工具参数。

![主色调图标的文本列](/assets/filament/v4.x/screenshots/images/light/tables/columns/text/icon-color.jpg)

## 显示为"徽章"

默认情况下，文本很普通，没有背景色。你可以使用 `badge()` 方法使其显示为"徽章"。一个很好的用例是状态，你可能希望显示一个与状态匹配的[颜色](#自定义颜色)的徽章：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('status')
    ->badge()
    ->color(fn (string $state): string => match ($state) {
        'draft' => 'gray',
        'reviewing' => 'warning',
        'published' => 'success',
        'rejected' => 'danger',
    })
```

![徽章文本列](/assets/filament/v4.x/screenshots/images/light/tables/columns/text/badge.jpg)

你可以向徽章添加其他内容，如[图标](#添加图标)。

你可以选择传递一个布尔值来控制文本是否应显示为徽章：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('status')
    ->badge(FeatureFlag::active())
```

除固定值外，`badge()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

## 格式化

使用文本列时，你可能希望 UI 中实际输出的文本与列的原始[状态](overview#列内容状态)不同，后者通常从 Eloquent 模型自动检索。格式化状态允许你保留原始数据的完整性，同时以更用户友好的方式呈现。

要在不更改状态本身的情况下格式化文本列的状态，可以使用 `formatStateUsing()` 方法。此方法接受一个以状态为参数并返回格式化状态的函数：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('status')
    ->formatStateUsing(fn (string $state): string => __("statuses.{$state}"))
```

在这种情况下，数据库中的 `status` 列可能包含 `draft`、`reviewing`、`published` 或 `rejected` 等值，但格式化状态将是这些值的翻译版本。

传给 `formatStateUsing()` 的闭包也支持注入 Filament 的工具参数。

### 日期格式化

除了向 `formatStateUsing()` 传递函数外，你还可以使用 `date()`、`dateTime()` 和 `time()` 方法，使用 [PHP 日期格式化令牌](https://www.php.net/manual/en/datetime.format.php)来格式化列的状态：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('created_at')
    ->date()

TextColumn::make('created_at')
    ->dateTime()

TextColumn::make('created_at')
    ->time()
```

![日期格式化的文本列](/assets/filament/v4.x/screenshots/images/light/tables/columns/text/date.jpg)

你可以通过向 `date()`、`dateTime()` 或 `time()` 方法传递自定义格式字符串来自定义日期格式。你可以使用任何 [PHP 日期格式化令牌](https://www.php.net/manual/en/datetime.format.php)：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('created_at')
    ->date('M j, Y')

TextColumn::make('created_at')
    ->dateTime('M j, Y H:i:s')

TextColumn::make('created_at')
    ->time('H:i:s')
```

除固定值外，`date()`、`dateTime()` 和 `time()` 方法也可以接收闭包来动态计算格式，并支持注入 Filament 的工具参数。

#### 使用 Carbon 宏格式进行日期格式化

你也可以使用 `isoDate()`、`isoDateTime()` 和 `isoTime()` 方法，使用 [Carbon 的宏格式](https://carbon.nesbot.com/docs/#available-macro-formats)来格式化列的状态：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('created_at')
    ->isoDate()

TextColumn::make('created_at')
    ->isoDateTime()

TextColumn::make('created_at')
    ->isoTime()
```

你可以通过向 `isoDate()`、`isoDateTime()` 或 `isoTime()` 方法传递自定义宏格式字符串来自定义日期格式。你可以使用任何 [Carbon 的宏格式](https://carbon.nesbot.com/docs/#available-macro-formats)：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('created_at')
    ->isoDate('L')

TextColumn::make('created_at')
    ->isoDateTime('LLL')

TextColumn::make('created_at')
    ->isoTime('LT')
```

除固定值外，`isoDate()`、`isoDateTime()` 和 `isoTime()` 方法也可以接收闭包来动态计算格式，并支持注入 Filament 的工具参数。

#### 相对日期格式化

你可以使用 `since()` 方法，使用 [Carbon 的 `diffForHumans()`](https://carbon.nesbot.com/docs/#api-humandiff) 来格式化列的状态：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('created_at')
    ->since()
```

![相对日期格式化的文本列](/assets/filament/v4.x/screenshots/images/light/tables/columns/text/since.jpg)

#### 在工具提示中显示格式化日期

此外，你可以使用 `dateTooltip()`、`dateTimeTooltip()`、`timeTooltip()`、`isoDateTooltip()`、`isoDateTimeTooltip()`、`isoTimeTooltip()` 或 `sinceTooltip()` 方法在[工具提示](overview#为列添加工具提示)中显示格式化日期，通常用于提供额外信息：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('created_at')
    ->since()
    ->dateTooltip() // 接受自定义 PHP 日期格式化字符串

TextColumn::make('created_at')
    ->since()
    ->dateTimeTooltip() // 接受自定义 PHP 日期格式化字符串

TextColumn::make('created_at')
    ->since()
    ->timeTooltip() // 接受自定义 PHP 日期格式化字符串

TextColumn::make('created_at')
    ->since()
    ->isoDateTooltip() // 接受自定义 Carbon 宏格式字符串

TextColumn::make('created_at')
    ->since()
    ->isoDateTimeTooltip() // 接受自定义 Carbon 宏格式字符串

TextColumn::make('created_at')
    ->since()
    ->isoTimeTooltip() // 接受自定义 Carbon 宏格式字符串

TextColumn::make('created_at')
    ->dateTime()
    ->sinceTooltip()
```

![相对日期带日期工具提示的文本列](/assets/filament/v4.x/screenshots/images/light/tables/columns/text/date-tooltip.jpg)

#### 设置日期格式化的时区

上面列出的每种日期格式化方法也接受 `timezone` 参数，它允许你将状态中设置的时间转换为不同的时区：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('created_at')
    ->dateTime(timezone: 'America/New_York')
```

你也可以向列的 `timezone()` 方法传递时区，以一次性将时区应用于所有日期时间格式化方法：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('created_at')
    ->timezone('America/New_York')
    ->dateTime()
```

除固定值外，`timezone()` 方法也可以接收闭包来动态计算时区，并支持注入 Filament 的工具参数。

如果你没有向列传递 `timezone()`，它将使用 Filament 的默认时区。你可以在服务提供者（如 `AppServiceProvider`）的 `boot()` 方法中使用 `FilamentTimezone::set()` 方法设置 Filament 的默认时区：

```php
use Filament\Support\Facades\FilamentTimezone;

public function boot(): void
{
    FilamentTimezone::set('America/New_York');
}
```

如果你想为应用中的所有文本列设置默认时区，这很有用。它也用于 Filament 中使用时区的其他地方。

:::warning
Filament 的默认时区仅在列存储时间时应用。如果列仅存储日期（`date()` 而不是 `dateTime()`），则不会应用时区。这是为了防止在存储没有时间的日期时时区偏移。
:::

### 数字格式化

除了向 `formatStateUsing()` 传递函数外，你可以使用 `numeric()` 方法将列格式化为数字：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('stock')
    ->numeric()
```

![数字格式化的文本列](/assets/filament/v4.x/screenshots/images/light/tables/columns/text/numeric.jpg)

如果你想自定义格式化数字时使用的小数位数，可以使用 `decimalPlaces` 参数：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('stock')
    ->numeric(decimalPlaces: 0)
```

除固定值外，`decimalPlaces` 参数也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

默认情况下，你的应用的区域设置将用于适当地格式化数字。如果你想自定义使用的区域设置，可以将其传递给 `locale` 参数：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('stock')
    ->numeric(locale: 'nl')
```

除固定值外，`locale` 参数也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

### 货币格式化

除了向 `formatStateUsing()` 传递函数外，你可以使用 `money()` 方法轻松格式化任何货币的金额：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('price')
    ->money('EUR')
```

![货币格式化的文本列](/assets/filament/v4.x/screenshots/images/light/tables/columns/text/money.jpg)

除固定值外，`money()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

`money()` 还有一个 `divideBy` 参数，允许你在格式化之前将原始值除以一个数字。如果你的数据库以分为单位存储价格，这可能很有用：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('price')
    ->money('EUR', divideBy: 100)
```

除固定值外，`divideBy` 参数也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

默认情况下，你的应用的区域设置将用于适当地格式化货币。如果你想自定义使用的区域设置，可以将其传递给 `locale` 参数：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('price')
    ->money('EUR', locale: 'nl')
```

除固定值外，`locale` 参数也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

如果你想自定义格式化数字时使用的小数位数，可以使用 `decimalPlaces` 参数：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('price')
    ->money('EUR', decimalPlaces: 3)
```

除固定值外，`decimalPlaces` 参数也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

### 渲染 Markdown

如果你的列值是 Markdown，可以使用 `markdown()` 来渲染它：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('description')
    ->markdown()
```

![Markdown 渲染的文本列](/assets/filament/v4.x/screenshots/images/light/tables/columns/text/markdown.jpg)

你可以选择传递一个布尔值来控制文本是否应渲染为 Markdown：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('description')
    ->markdown(FeatureFlag::active())
```

除固定值外，`markdown()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

### 渲染 HTML

如果你的列值是 HTML，可以使用 `html()` 来渲染它：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('description')
    ->html()
```

![HTML 渲染的文本列](/assets/filament/v4.x/screenshots/images/light/tables/columns/text/html.jpg)

你可以选择传递一个布尔值来控制文本是否应渲染为 HTML：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('description')
    ->html(FeatureFlag::active())
```

除固定值外，`html()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

:::danger
Filament 内置的 HTML 清理器允许内联 `style` 属性，以支持富文本格式化功能，如字体颜色、文本高亮和图片大小调整。这意味着像 `background: url(...)` 或 `position: fixed` 这样的 CSS 属性不会从清理后的 HTML 中剥离。如果你的内容来自不受信任的用户，应考虑限制默认配置。有关如何自定义清理器的详细信息，请参阅[安全文档](../../advanced/security#自定义清理器)。
:::

#### 渲染未清理的原始 HTML

如果你使用此方法，HTML 将在渲染之前被清理以移除任何潜在的不安全内容。如果你想退出此行为，可以通过将 HTML 包装在 `HtmlString` 对象中来格式化它：

```php
use Filament\Tables\Columns\TextColumn;
use Illuminate\Support\HtmlString;

TextColumn::make('description')
    ->formatStateUsing(fn (string $state): HtmlString => new HtmlString($state))
```

:::danger
渲染原始 HTML 时要小心，因为它可能包含恶意内容，这可能导致你的应用出现安全漏洞，如跨站脚本（XSS）攻击。在使用此方法之前，请始终确保你渲染的 HTML 是安全的。
:::

或者，你可以从 `formatStateUsing()` 方法返回一个 `view()` 对象，它也不会被清理：

```php
use Filament\Tables\Columns\TextColumn;
use Illuminate\Contracts\View\View;

TextColumn::make('description')
    ->formatStateUsing(fn (string $state): View => view(
        'filament.tables.columns.description-column-content',
        ['state' => $state],
    ))
```

## 显示描述

描述可以用于轻松地在列内容上方或下方渲染额外的文本。

你可以使用 `description()` 方法在文本列的内容下方显示描述：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('title')
    ->description(fn (Post $record): string => $record->description)
```

传给 `description()` 的闭包也支持注入 Filament 的工具参数。

![带描述的文本列](/assets/filament/v4.x/screenshots/images/light/tables/columns/text/description.jpg)

默认情况下，描述显示在主文本下方，但你可以使用 `'above'` 作为第二个参数将其移动到上方：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('title')
    ->description(fn (Post $record): string => $record->description, position: 'above')
```

![描述在内容上方的文本列](/assets/filament/v4.x/screenshots/images/light/tables/columns/text/description-above.jpg)

## 列出多个值

如果文本列的[状态](overview#列内容状态)是数组，可以在文本列中渲染多个值。如果你在 Eloquent 属性上使用了 `array` 转换、具有多个结果的 Eloquent 关联关系，或者已经将数组传递给 [`state()` 方法](overview#设置列的状态)，就会发生这种情况。如果文本列中有多个值，它们将以逗号分隔。你可以使用 `listWithLineBreaks()` 方法改为在新行上显示它们：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('authors.name')
    ->listWithLineBreaks()
```

你可以选择传递一个布尔值来控制文本是否应在每个项目之间有换行：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('authors.name')
    ->listWithLineBreaks(FeatureFlag::active())
```

除固定值外，`listWithLineBreaks()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

![值显示在单独行上的文本列](/assets/filament/v4.x/screenshots/images/light/tables/columns/text/list.jpg)

### 为列表添加项目符号

你可以使用 `bulleted()` 方法为每个列表项添加项目符号：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('authors.name')
    ->bulleted()
```

你可以选择传递一个布尔值来控制文本是否应有项目符号：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('authors.name')
    ->bulleted(FeatureFlag::active())
```

除固定值外，`bulleted()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

![带项目符号列表的文本列](/assets/filament/v4.x/screenshots/images/light/tables/columns/text/bulleted.jpg)

### 限制列表中的值数量

你可以使用 `limitList()` 方法限制列表中的值数量：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('authors.name')
    ->listWithLineBreaks()
    ->limitList(3)
```

除固定值外，`limitList()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

#### 展开受限列表

你可以使用 `expandableLimitedList()` 方法允许受限项目展开和折叠：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('authors.name')
    ->listWithLineBreaks()
    ->limitList(3)
    ->expandableLimitedList()
```

:::info
这只是 `listWithLineBreaks()` 或 `bulleted()` 的功能，其中每个项目都在自己的行上。
:::

你可以选择传递一个布尔值来控制文本是否应可展开：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('authors.name')
    ->listWithLineBreaks()
    ->limitList(3)
    ->expandableLimitedList(FeatureFlag::active())
```

除固定值外，`expandableLimitedList()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

![可展开受限列表的文本列](/assets/filament/v4.x/screenshots/images/light/tables/columns/text/expandable-limited-list.jpg)

### 将单个值拆分为多个列表项

如果你想将模型中的文本字符串"分割"为多个列表项，可以使用 `separator()` 方法。例如，这对于将逗号分隔的标签[显示为徽章](#显示为徽章)很有用：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('tags')
    ->badge()
    ->separator(',')
```

![逗号分隔值的徽章文本列](/assets/filament/v4.x/screenshots/images/light/tables/columns/text/separator-badge.jpg)

除固定值外，`separator()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

## 自定义文本大小

文本列默认使用小字体，但你可以将其更改为 `TextSize::ExtraSmall`、`TextSize::Medium` 或 `TextSize::Large`。

例如，你可以使用 `size(TextSize::Large)` 使文本更大：

```php
use Filament\Tables\Columns\TextColumn;
use Filament\Support\Enums\TextSize;

TextColumn::make('title')
    ->size(TextSize::Large)
```

![大字体文本列](/assets/filament/v4.x/screenshots/images/light/tables/columns/text/large.jpg)

## 自定义字体粗细

文本列默认使用常规字体粗细，但你可以将其更改为以下任何选项：`FontWeight::Thin`、`FontWeight::ExtraLight`、`FontWeight::Light`、`FontWeight::Medium`、`FontWeight::SemiBold`、`FontWeight::Bold`、`FontWeight::ExtraBold` 或 `FontWeight::Black`。

例如，你可以使用 `weight(FontWeight::Bold)` 使字体加粗：

```php
use Filament\Tables\Columns\TextColumn;
use Filament\Support\Enums\FontWeight;

TextColumn::make('title')
    ->weight(FontWeight::Bold)
```

除固定值外，`weight()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

![粗体文本列](/assets/filament/v4.x/screenshots/images/light/tables/columns/text/bold.jpg)

## 自定义字体系列

你可以将文本字体系列更改为以下任何选项：`FontFamily::Sans`、`FontFamily::Serif` 或 `FontFamily::Mono`。

例如，你可以使用 `fontFamily(FontFamily::Mono)` 使字体变为等宽字体：

```php
use Filament\Support\Enums\FontFamily;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('email')
    ->fontFamily(FontFamily::Mono)
```

除固定值外，`fontFamily()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

![等宽字体文本列](/assets/filament/v4.x/screenshots/images/light/tables/columns/text/mono.jpg)

## 处理长文本

### 限制文本长度

你可以 `limit()` 列值的长度：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('description')
    ->limit(50)
```

除固定值外，`limit()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

![限制文本长度的文本列](/assets/filament/v4.x/screenshots/images/light/tables/columns/text/limit.jpg)

默认情况下，当文本被截断时，省略号（`...`）会附加到文本末尾。你可以通过向 `end` 参数传递自定义字符串来自定义：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('description')
    ->limit(50, end: ' (more)')
```

除固定值外，`end` 参数也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

你还可以在函数中重用传递给 `limit()` 的值，通过使用 `getCharacterLimit()` 方法获取它：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('description')
    ->limit(50)
    ->tooltip(function (TextColumn $column): ?string {
        $state = $column->getState();

        if (strlen($state) <= $column->getCharacterLimit()) {
            return null;
        }

        // 仅在列内容超过长度限制时渲染工具提示。
        return $state;
    })
```

### 限制字数

你可以限制列中显示的 `words()` 数量：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('description')
    ->words(10)
```

除固定值外，`words()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

![限制字数的文本列](/assets/filament/v4.x/screenshots/images/light/tables/columns/text/words.jpg)

默认情况下，当文本被截断时，省略号（`...`）会附加到文本末尾。你可以通过向 `end` 参数传递自定义字符串来自定义：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('description')
    ->words(10, end: ' (more)')
```

除固定值外，`end` 参数也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

### 允许文本换行

默认情况下，如果文本超过容器宽度，它不会换行到下一行。你可以使用 `wrap()` 方法启用此行为：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('description')
    ->wrap()
```

你可以选择传递一个布尔值来控制文本是否应换行：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('description')
    ->wrap(FeatureFlag::active())
```

除固定值外，`wrap()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

![换行文本的文本列](/assets/filament/v4.x/screenshots/images/light/tables/columns/text/wrap.jpg)

#### 将文本限制为特定行数

你可能希望将文本限制为特定行数，而不是限制为固定长度。将文本限制为一定行数在响应式界面中很有用，你希望确保在所有屏幕尺寸上具有一致的体验。这可以使用 `lineClamp()` 方法实现：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('description')
    ->wrap()
    ->lineClamp(2)
```

除固定值外，`lineClamp()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

![行限制的文本列](/assets/filament/v4.x/screenshots/images/light/tables/columns/text/line-clamp.jpg)

## 允许文本复制到剪贴板

你可以使文本可复制，这样点击列就会将文本复制到剪贴板，并可选择指定自定义确认消息和持续时间（毫秒）：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('email')
    ->copyable()
    ->copyMessage('Email address copied')
    ->copyMessageDuration(1500)
```

![带复制按钮的文本列](/assets/filament/v4.x/screenshots/images/light/tables/columns/text/copyable.jpg)

你可以选择传递一个布尔值来控制文本是否应可复制：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('email')
    ->copyable(FeatureFlag::active())
```

除固定值外，`copyable()`、`copyMessage()` 和 `copyMessageDuration()` 方法也可以接收闭包来动态计算，并支持注入 Filament 的工具参数。

:::warning
此功能仅在应用启用 SSL 时有效。
:::
