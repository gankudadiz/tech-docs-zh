---
title: 基础组件
---

## 简介

在 Filament schema 中，基础组件是最基本的构建块，可用于向 schema 插入任意内容，如文本和图像。顾名思义，基础组件不可分割，无法更简化。Filament 提供了一组内置基础组件：

- [文本](#文本组件)
- [图标](#图标组件)
- [图像](#图像组件)
- [无序列表](#无序列表组件)

你也可以[创建自己的自定义组件](custom-components)来向 schema 添加自己的任意内容。

![使用基础组件设置双因素认证的示例。](/assets/filament/v4.x/screenshots/images/light/primes/overview/example.jpg)

在此示例中，基础组件用于向用户显示说明、用户可以扫描的二维码以及用户可以保存的恢复代码列表：

```php
use Filament\Actions\Action;
use Filament\Schemas\Components\Image;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Text;
use Filament\Schemas\Components\UnorderedList;
use Filament\Support\Enums\FontWeight;
use Filament\Support\Enums\TextSize;

$schema
    ->components([
        Text::make('使用你的认证器应用扫描此二维码：')
            ->color('neutral'),
        Image::make(
            url: asset('images/qr.jpg'),
            alt: '用于认证器应用扫描的二维码',
        )
            ->imageHeight('12rem')
            ->alignCenter(),
        Section::make()
            ->schema([
                Text::make('请将以下恢复代码保存在安全的地方。它们只会显示一次，但如果你无法访问认证器应用，你将需要它们：')
                    ->weight(FontWeight::Bold)
                    ->color('neutral'),
                UnorderedList::make(fn (): array => array_map(
                    fn (string $recoveryCode): Text => Text::make($recoveryCode)
                        ->copyable()
                        ->fontFamily(FontFamily::Mono)
                        ->size(TextSize::ExtraSmall)
                        ->color('neutral'),
                    ['tYRnCqNLUx-3QOLNKyDiV', 'cKok2eImKc-oWHHH4VhNe', 'C0ZstEcSSB-nrbyk2pv8z', '49EXLRQ8MI-FpWywpSDHE', 'TXjHnvkUrr-KuiVJENPmJ', 'BB574ookll-uI20yxP6oa', 'BbgScF2egu-VOfHrMtsCl', 'cO0dJYqmee-S9ubJHpRFR'],
                ))
                    ->size(TextSize::ExtraSmall),
            ])
            ->compact()
            ->secondary(),
    ])
```

虽然文本可以使用[信息列表文本条目](../infolists/text-entry)在 schema 中渲染，但条目旨在渲染实体（如 Eloquent 模型）的标签-值详情，而不是渲染任意文本。基础组件更适合此目的。信息列表可以被认为更类似于 HTML 中的[描述列表](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dl)。

基础组件类可以在 `Filament\Schemas\Components` 命名空间中找到。它们位于 schema 组件数组中。

## 文本组件

可以使用 `Text` 组件将文本插入 schema。文本内容传递给 `make()` 方法：

```php
use Filament\Schemas\Components\Text;

Text::make('修改这些权限可能会让用户访问敏感信息。')
```

![文本](/assets/filament/v4.x/screenshots/images/light/primes/text/simple.jpg)

要渲染原始 HTML 内容，你可以将 `HtmlString` 对象传递给 `make()` 方法：

```php
use Filament\Schemas\Components\Text;
use Illuminate\Support\HtmlString;

Text::make(new HtmlString('<strong>警告：</strong>修改这些权限可能会让用户访问敏感信息。'))
```

:::danger
请注意，你需要确保 HTML 是安全的，否则你的应用程序将容易受到 XSS 攻击。
:::

![带有 HTML 的文本](/assets/filament/v4.x/screenshots/images/light/primes/text/html.jpg)

要渲染 Markdown，你可以使用 Laravel 的 `str()` 辅助函数将 Markdown 转换为 HTML，然后将其转换为 `HtmlString` 对象：

```php
use Filament\Schemas\Components\Text;

Text::make(
    str('**警告：** 修改这些权限可能会让用户访问敏感信息。')
        ->inlineMarkdown()
        ->toHtmlString(),
)
```

:::tip
除了允许静态值外，`make()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。
:::

### 自定义文本颜色

你可以为文本设置[颜色](../styling/colors)：

```php
use Filament\Schemas\Components\Text;

Text::make('信息')
    ->color('info')
```

:::tip
除了允许静态值外，`color()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。
:::

![信息颜色的文本](/assets/filament/v4.x/screenshots/images/light/primes/text/color.jpg)

### 使用中性颜色

默认情况下，文本颜色设置为 `gray`，通常在其背景下相当暗淡。你可以使用 `color('neutral')` 方法加深它：

```php
use Filament\Schemas\Components\Text;

Text::make('修改这些权限可能会让用户访问敏感信息。')

Text::make('修改这些权限可能会让用户访问敏感信息。')
    ->color('neutral')
```

![中性颜色的文本](/assets/filament/v4.x/screenshots/images/light/primes/text/neutral.jpg)

### 显示为"徽章"

默认情况下，文本相当普通，没有背景颜色。你可以使用 `badge()` 方法使其显示为"徽章"。一个很好的用例是状态，你可能想要显示一个与状态匹配的[颜色](#自定义文本颜色)的徽章：

```php
use Filament\Schemas\Components\Text;

Text::make('警告')
    ->color('warning')
    ->badge()
```

![文本作为徽章](/assets/filament/v4.x/screenshots/images/light/primes/text/badge.jpg)

可选地，你可以传递一个布尔值来控制文本是否应该在徽章中：

```php
use Filament\Schemas\Components\Text;

Text::make('警告')
    ->color('warning')
    ->badge(FeatureFlag::active())
```

:::tip
除了允许静态值外，`badge()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。
:::

#### 向徽章添加图标

你可以向徽章添加其他内容，如[图标](../styling/icons)：

```php
use Filament\Schemas\Components\Text;
use Filament\Support\Icons\Heroicon;

Text::make('警告')
    ->color('warning')
    ->badge()
    ->icon(Heroicon::ExclamationTriangle)
```

![带有图标的徽章文本](/assets/filament/v4.x/screenshots/images/light/primes/text/badge-icon.jpg)

### 自定义文本大小

文本默认具有小字体大小，但你可以将其更改为 `TextSize::ExtraSmall`、`TextSize::Medium` 或 `TextSize::Large`。

例如，你可以使用 `size(TextSize::Large)` 使文本更大：

```php
use Filament\Schemas\Components\Text;
use Filament\Support\Enums\TextSize;

Text::make('修改这些权限可能会让用户访问敏感信息。')
    ->size(TextSize::Large)
```

![大字体大小的文本条目](/assets/filament/v4.x/screenshots/images/light/primes/text/large.jpg)

### 自定义字体粗细

文本条目默认具有常规字体粗细，但你可以将其更改为以下任何选项：`FontWeight::Thin`、`FontWeight::ExtraLight`、`FontWeight::Light`、`FontWeight::Medium`、`FontWeight::SemiBold`、`FontWeight::Bold`、`FontWeight::ExtraBold` 或 `FontWeight::Black`。

例如，你可以使用 `weight(FontWeight::Bold)` 使字体加粗：

```php
use Filament\Schemas\Components\Text;
use Filament\Support\Enums\FontWeight;

Text::make('修改这些权限可能会让用户访问敏感信息。')
    ->weight(FontWeight::Bold)
```

:::tip
除了允许静态值外，`weight()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。
:::

![粗体文本条目](/assets/filament/v4.x/screenshots/images/light/primes/text/bold.jpg)

### 自定义字体系列

你可以将文本字体系列更改为以下任何选项：`FontFamily::Sans`、`FontFamily::Serif` 或 `FontFamily::Mono`。

例如，你可以使用 `fontFamily(FontFamily::Mono)` 使字体等宽：

```php
use Filament\Support\Enums\FontFamily;
use Filament\Schemas\Components\Text;

Text::make('28o.-AK%D~xh*.:[4"3)zPiC')
    ->fontFamily(FontFamily::Mono)
```

:::tip
除了允许静态值外，`fontFamily()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。
:::

![等宽字体的文本条目](/assets/filament/v4.x/screenshots/images/light/primes/text/mono.jpg)

### 向文本添加工具提示

你可以使用 `tooltip()` 方法向文本添加工具提示：

```php
use Filament\Schemas\Components\Text;

Text::make('28o.-AK%D~xh*.:[4"3)zPiC')
    ->tooltip('你的秘密恢复代码')
```

:::tip
除了允许静态值外，`tooltip()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。
:::

![带有工具提示的文本](/assets/filament/v4.x/screenshots/images/light/primes/text/tooltip.jpg)

### 使用 JavaScript 确定文本内容

你可以使用 JavaScript 确定文本内容。如果你想根据[表单字段](../forms/overview)的状态显示不同的消息，而无需向服务器发出请求重新渲染 schema，这很有用。为此，你可以使用 `js()` 方法：

```php
use Filament\Schemas\Components\Text;

Text::make(<<<'JS'
    $get('name') ? `你好，${$get('name')}` : '请输入你的名字。'
    JS)
    ->js()
```

[`$state`](../forms/overview#注入字段的当前状态)和 [`$get()`](../forms/overview#注入另一个字段的状态)实用工具在 JavaScript 上下文中可用，因此你可以使用它们来获取 schema 中字段的状态。

## 图标组件

可以使用 `Icon` 组件将图标插入 schema。[图标](../styling/icons)传递给 `make()` 方法：

```php
use Filament\Schemas\Components\Icon;
use Filament\Support\Icons\Heroicon;

Icon::make(Heroicon::Star)
```

:::tip
除了允许静态值外，`make()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。
:::

![图标](/assets/filament/v4.x/screenshots/images/light/primes/icon/simple.jpg)

### 自定义图标颜色

你可以为图标设置[颜色](../styling/colors)：

```php
use Filament\Schemas\Components\Icon;
use Filament\Support\Icons\Heroicon;

Icon::make(Heroicon::ExclamationCircle)
    ->color('danger')
```

:::tip
除了允许静态值外，`color()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。
:::

![危险颜色的图标](/assets/filament/v4.x/screenshots/images/light/primes/icon/color.jpg)

### 自定义图标大小

默认图标大小为 `IconSize::Medium`，但你可以自定义大小为 `IconSize::ExtraSmall`、`IconSize::Small`、`IconSize::Large`、`IconSize::ExtraLarge` 或 `IconSize::TwoExtraLarge`：

```php
use Filament\Schemas\Components\Icon;
use Filament\Support\Enums\IconSize;
use Filament\Support\Icons\Heroicon;

Icon::make(Heroicon::Star)
    ->size(IconSize::Large)
```

:::tip
除了允许静态值外，`size()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。
:::

![以每种可用大小渲染的图标供比较](/assets/filament/v4.x/screenshots/images/light/primes/icon/sizes.jpg)

### 向图标添加工具提示

你可以使用 `tooltip()` 方法向图标添加工具提示：

```php
use Filament\Schemas\Components\Icon;
use Filament\Support\Icons\Heroicon;

Icon::make(Heroicon::ExclamationTriangle)
    ->tooltip('警告')
```

:::tip
除了允许静态值外，`tooltip()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。
:::

![带有工具提示的图标](/assets/filament/v4.x/screenshots/images/light/primes/icon/tooltip.jpg)

## 图像组件

可以使用 `Image` 组件将图像插入 schema。图像 URL 和替代文本传递给 `make()` 方法：

```php
use Filament\Schemas\Components\Image;

Image::make(
    url: asset('images/qr.jpg'),
    alt: '用于认证器应用扫描的二维码',
)
```

:::tip
除了允许静态值外，`make()` 方法的参数还接受函数来动态计算它们。你可以将各种实用工具作为参数注入到函数中。
:::

![图像](/assets/filament/v4.x/screenshots/images/light/primes/image/simple.jpg)

### 自定义图像大小

你可以通过传递 `imageWidth()` 和 `imageHeight()`，或两者都用 `imageSize()` 来自定义图像大小：

```php
use Filament\Schemas\Components\Image;

Image::make(
    url: asset('images/qr.jpg'),
    alt: '用于认证器应用扫描的二维码',
)
    ->imageWidth('12rem')

Image::make(
    url: asset('images/qr.jpg'),
    alt: '用于认证器应用扫描的二维码',
)
    ->imageHeight('12rem')

Image::make(
    url: asset('images/qr.jpg'),
    alt: '用于认证器应用扫描的二维码',
)
    ->imageSize('12rem')
```

:::tip
除了允许静态值外，`imageWidth()`、`imageHeight()` 和 `imageSize()` 方法还接受函数来动态计算它们。你可以将各种实用工具作为参数注入到函数中。
:::

![自定义大小的图像](/assets/filament/v4.x/screenshots/images/light/primes/image/size.jpg)

### 对齐图像

你可以使用 `alignStart()`、`alignCenter()` 或 `alignEnd()` 方法将图像对齐到起始位置（从左到右界面中为左侧，从右到左界面中为右侧）、居中或末尾位置（从左到右界面中为右侧，从右到左界面中为左侧）：

```php
use Filament\Schemas\Components\Image;

Image::make(
    url: asset('images/qr.jpg'),
    alt: '用于认证器应用扫描的二维码',
)
    ->alignStart() // 这是默认对齐方式。

Image::make(
    url: asset('images/qr.jpg'),
    alt: '用于认证器应用扫描的二维码',
)
    ->alignCenter()

Image::make(
    url: asset('images/qr.jpg'),
    alt: '用于认证器应用扫描的二维码',
)
    ->alignEnd()
```

或者，你可以向 `alignment()` 方法传递一个 `Alignment` 枚举：

```php
use Filament\Schemas\Components\Image;
use Filament\Support\Enums\Alignment;

Image::make(
    url: asset('images/qr.jpg'),
    alt: '用于认证器应用扫描的二维码',
)
    ->alignment(Alignment::Center)
```

:::tip
除了允许静态值外，`alignment()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。
:::

![自定义对齐方式的图像](/assets/filament/v4.x/screenshots/images/light/primes/image/alignment.jpg)

### 向图像添加工具提示

你可以使用 `tooltip()` 方法向图像添加工具提示：

```php
use Filament\Schemas\Components\Image;

Image::make(
    url: asset('images/qr.jpg'),
    alt: '用于认证器应用扫描的二维码',
)
    ->tooltip('使用你的认证器应用扫描此二维码')
    ->alignCenter()
```

:::tip
除了允许静态值外，`tooltip()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。
:::

![带有工具提示的图像](/assets/filament/v4.x/screenshots/images/light/primes/image/tooltip.jpg)

## 无序列表组件

可以使用 `UnorderedList` 组件将无序列表插入 schema。列表项（由纯文本或[文本组件](#文本组件)组成）传递给 `make()` 方法：

```php
use Filament\Schemas\Components\UnorderedList;

UnorderedList::make([
    '表格',
    'Schema',
    '操作',
    '通知',
])
```

:::tip
除了允许静态值外，`make()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。
:::

![无序列表](/assets/filament/v4.x/screenshots/images/light/primes/unordered-list/simple.jpg)

文本组件可以用作列表项，这允许你自定义每个项的格式：

```php
use Filament\Schemas\Components\Text;
use Filament\Schemas\Components\UnorderedList;
use Filament\Support\Enums\FontFamily;

UnorderedList::make([
    Text::make('表格')->fontFamily(FontFamily::Mono),
    Text::make('Schema')->fontFamily(FontFamily::Mono),
    Text::make('操作')->fontFamily(FontFamily::Mono),
    Text::make('通知')->fontFamily(FontFamily::Mono),
])
```

### 自定义项目符号大小

如果你正在修改列表内容的文本大小，你可能需要调整项目符号的大小以匹配。为此，你可以使用 `size()` 方法。项目符号默认具有小字体大小，但你可以将其更改为 `TextSize::ExtraSmall`、`TextSize::Medium` 或 `TextSize::Large`。

例如，你可以使用 `size(TextSize::Large)` 使项目符号更大：

```php
use Filament\Schemas\Components\Text;
use Filament\Schemas\Components\UnorderedList;

UnorderedList::make([
    Text::make('表格')->size(TextSize::Large),
    Text::make('Schema')->size(TextSize::Large),
    Text::make('操作')->size(TextSize::Large),
    Text::make('通知')->size(TextSize::Large),
])
    ->size(TextSize::Large)
```

:::tip
除了允许静态值外，`size()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。
:::

![带有大项目符号的无序列表](/assets/filament/v4.x/screenshots/images/light/primes/unordered-list/large.jpg)

## 向基础组件添加额外的 HTML 属性

你可以通过 `extraAttributes()` 方法向组件传递额外的 HTML 属性，这些属性将合并到其外部 HTML 元素上。属性应由数组表示，其中键是属性名，值是属性值：

```php
use Filament\Schemas\Components\Text;

Text::make('修改这些权限可能会让用户访问敏感信息。')
    ->extraAttributes(['class' => 'custom-text-style'])
```

:::tip
除了允许静态值外，`extraAttributes()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。
:::

默认情况下，多次调用 `extraAttributes()` 将覆盖先前的属性。如果你想合并属性，可以将 `merge: true` 传递给该方法。
