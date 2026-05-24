---
title: 信息列表
---

## 简介

![产品信息列表示例](/assets/filament/v4.x/screenshots/images/light/infolists/overview.jpg)

Filament 的信息列表（infolists）包允许你为特定实体显示只读数据列表。它已集成到其他 Filament 包中，例如[面板资源](../resources/overview)、[关联管理器](../resources/managing-relationships)和[操作模态框](../actions/modals)。理解如何使用信息列表构建器将为你在构建自定义 Livewire 应用程序或使用其他 Filament 功能时节省时间。

本指南介绍使用 Filament 构建信息列表的基础知识。如果你想在自己的 Livewire 组件中添加信息列表，请先[从这里开始](../components/infolist)，然后继续阅读。如果你要向[面板资源](../resources/overview)添加信息列表，或使用其他 Filament 包，那么你可以直接开始！

## 定义条目

条目类可以在 `Filament\Infolists\Components` 命名空间中找到。它们位于 schema 组件数组中。Filament 内置了许多条目：

- [文本条目](text-entry)
- [图标条目](icon-entry)
- [图片条目](image-entry)
- [颜色条目](color-entry)
- [代码条目](code-entry)
- [键值对条目](key-value-entry)
- [可重复条目](repeatable-entry)

你也可以[创建自定义条目](custom-entries)来按你想要的方式显示数据。

条目可以使用静态 `make()` 方法创建，传入其唯一名称。通常，条目的名称对应于 Eloquent 模型上的属性名称。你可以使用"点表示法"来访问关联中的属性：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('title')

TextEntry::make('author.name')
```

![信息列表中的条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/simple.jpg)

## 条目内容（状态）

条目一开始可能感觉有些神奇，但它们被设计为简单易用，并针对从 Eloquent 记录显示数据进行了优化。尽管如此，它们是灵活的，你可以从任何来源显示数据，而不仅仅是 Eloquent 记录属性。

条目显示的数据称为其"状态"。当使用[面板资源](../resources/overview)时，信息列表知道它正在显示的记录。这意味着条目的状态是根据记录上属性的值设置的。例如，如果条目用于 `PostResource` 的信息列表中，则将显示当前文章的 `title` 属性值。

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('title')
```

如果你想访问存储在关联中的值，可以使用"点表示法"。首先是你要访问数据的关联名称，然后是一个点，接着是属性名称：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('author.name')
```

你还可以使用"点表示法"访问 Eloquent 模型上 JSON / 数组列中的值。首先是属性名称，然后是一个点，接着是你想要读取的 JSON 对象的键：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('meta.title')
```

### 设置条目的状态

你可以使用 `state()` 方法将自定义状态传递给条目：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('title')
    ->state('Hello, world!')
```

`state()` 方法也接受一个函数来动态计算状态。你可以将各种实用工具作为参数注入到函数中。

### 设置条目的默认状态

当条目为空（其状态为 `null`）时，你可以使用 `default()` 方法定义要使用的替代状态。此方法会将默认状态视为真实状态，因此[图片](image-entry)或[颜色](color-entry)等条目将显示默认图片或颜色。

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('title')
    ->default('Untitled')
```

#### 为空条目添加占位文本

有时你可能想为空状态的条目显示占位文本，其样式为较浅的灰色文本。这与[默认值](#设置条目的默认状态)不同，因为占位符始终是文本，不会被视为真实状态。

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('title')
    ->placeholder('Untitled')
```

![带有空状态占位符的条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/placeholder.jpg)

## 设置条目标签

默认情况下，条目的标签（显示在信息列表的标题中）是从条目的名称生成的。你可以使用 `label()` 方法自定义此标签：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('name')
    ->label('Full name')
```

除了允许静态值外，`label()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。

以这种方式自定义标签在你希望使用[本地化翻译字符串](https://laravel.com/docs/localization#retrieving-translation-strings)时很有用：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('name')
    ->label(__('entries.name'))
```

### 隐藏条目标签

:::tip
    如果你正在寻找隐藏条目标签的方法，可能是因为你试图将条目用于任意文本或 UI。条目专门设计用于以结构化方式显示数据，但 [Prime 组件](../schemas/overview#可用组件)是用于渲染基本独立静态内容（如文本、图片和按钮（操作））的简单组件。你可能需要考虑改用 Prime 组件。
:::

将标签设置为空字符串来隐藏它可能很诱人，但不推荐这样做。将标签设置为空字符串不会向屏幕阅读器传达条目的目的，即使目的在视觉上很清晰。相反，你应该使用 `hiddenLabel()` 方法，这样它在视觉上是隐藏的，但仍然可以被屏幕阅读器访问：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('name')
    ->hiddenLabel()
```

![带有隐藏标签的条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/hidden-label.jpg)

你可以选择传递一个布尔值来控制是否隐藏标签：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('name')
    ->hiddenLabel(FeatureFlag::active())
```

除了允许静态值外，`hiddenLabel()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。

## 点击条目时打开 URL

点击条目时，你可以打开一个 URL。为此，请将 URL 传递给 `url()` 方法：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('title')
    ->url('/about/titles')
```

你可以将一个函数传递给 `url()` 方法来动态计算 URL。例如，你可能想通过注入 `$record` 作为参数来访问信息列表的当前 Eloquent 记录：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('title')
    ->url(fn (Post $record): string => route('posts.edit', ['post' => $record]))
```

如果你使用的是[面板资源](../resources/overview)，你可以使用 `getUrl()` 方法生成指向记录页面的链接：

```php
use App\Filament\Posts\PostResource;
use Filament\Infolists\Components\TextEntry;

TextEntry::make('title')
    ->url(fn (Post $record): string => PostResource::getUrl('edit', ['record' => $record]))
```

传递给 `url()` 的函数可以注入各种实用工具作为参数。

你还可以选择在新标签页中打开 URL：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('title')
    ->url(fn (Post $record): string => PostResource::getUrl('edit', ['record' => $record]))
    ->openUrlInNewTab()
```

你可以选择传递一个布尔值来控制是否在新标签页中打开 URL：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('title')
    ->url(fn (Post $record): string => PostResource::getUrl('edit', ['record' => $record]))
    ->openUrlInNewTab(FeatureFlag::active())
```

除了允许静态值外，`openUrlInNewTab()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。

:::danger
    如果你要将用户控制的数据传递给 `url()` 方法，你应该验证该 URL 不使用危险的 scheme，例如 `javascript:` 或 `data:`。如果未能这样做，可能会使你的应用程序面临 XSS 攻击。
:::

## 隐藏条目

你可以隐藏条目：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('role')
    ->hidden()
```

你可以选择传递一个布尔值来控制是否隐藏条目：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('role')
    ->hidden(! FeatureFlag::active())
```

除了允许静态值外，`hidden()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。

或者，你可以使用 `visible()` 方法来控制是否隐藏条目。在某些情况下，这可能有助于使你的代码更具可读性：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('role')
    ->visible(FeatureFlag::active())
```

除了允许静态值外，`visible()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。

:::info
    如果同时使用 `hidden()` 和 `visible()`，它们都需要指示条目应该可见才能显示。
:::

### 使用 JavaScript 隐藏条目

如果你需要根据用户交互隐藏条目，可以使用 `hidden()` 或 `visible()` 方法，传递一个使用注入的实用工具来确定是否应该隐藏条目的函数：

```php
use Filament\Forms\Components\Select;
use Filament\Infolists\Components\IconEntry;

Select::make('role')
    ->options([
        'user' => 'User',
        'staff' => 'Staff',
    ])
    ->live()

IconEntry::make('is_admin')
    ->boolean()
    ->hidden(fn (Get $get): bool => $get('role') !== 'staff')
```

在此示例中，`role` 字段设置为 `live()`，这意味着 schema 将在每次 `role` 字段更改时重新加载。这将导致传递给 `hidden()` 方法的函数被重新评估，如果 `role` 字段未设置为 `staff`，则会隐藏 `is_admin` 条目。

但是，每次条目更改时重新加载 schema 都会导致发出网络请求，因为无法从客户端重新运行 PHP 函数。这对性能并不理想。

或者，你可以编写 JavaScript 来根据字段的值隐藏条目。这是通过将 JavaScript 表达式传递给 `hiddenJs()` 方法来完成的：

```php
use Filament\Forms\Components\Select;
use Filament\Infolists\Components\IconEntry;

Select::make('role')
    ->options([
        'user' => 'User',
        'staff' => 'Staff',
    ])

IconEntry::make('is_admin')
    ->boolean()
    ->hiddenJs(<<<'JS'
        $get('role') !== 'staff'
        JS)
```

虽然传递给 `hiddenJs()` 的代码看起来与 PHP 非常相似，但它实际上是 JavaScript。Filament 向 JavaScript 提供了 `$get()` 工具函数，其行为与 PHP 等效函数非常相似，但不需要依赖的条目为 `live()`。

`visibleJs()` 方法也可用，其工作方式与 `hiddenJs()` 相同，但控制条目是否应该可见：

```php
use Filament\Forms\Components\Select;
use Filament\Infolists\Components\IconEntry;

Select::make('role')
    ->options([
        'user' => 'User',
        'staff' => 'Staff',
    ])

IconEntry::make('is_admin')
    ->boolean()
    ->visibleJs(<<<'JS'
        $get('role') === 'staff'
        JS)
```

:::info
    如果同时使用 `hiddenJs()` 和 `visibleJs()`，它们都需要指示条目应该可见才能显示。
:::

### 基于当前操作隐藏条目

Schema 的"操作"是正在对其执行的当前操作。通常，如果你使用的是[面板资源](../resources/overview)，这是 `create`、`edit` 或 `view`。

你可以通过将操作传递给 `hiddenOn()` 方法来基于当前操作隐藏条目：

```php
use Filament\Infolists\Components\IconEntry;

IconEntry::make('is_admin')
    ->boolean()
    ->hiddenOn('edit')

// 等同于

IconEntry::make('is_admin')
    ->boolean()
    ->hidden(fn (string $operation): bool => $operation === 'edit')
```

你也可以将操作数组传递给 `hiddenOn()` 方法，如果当前操作是数组中的任何操作，条目将被隐藏：

```php
use Filament\Infolists\Components\IconEntry;

IconEntry::make('is_admin')
    ->boolean()
    ->hiddenOn(['edit', 'view'])

// 等同于

IconEntry::make('is_admin')
    ->boolean()
    ->hidden(fn (string $operation): bool => in_array($operation, ['edit', 'view']))
```

:::warning
    `hiddenOn()` 方法将覆盖之前对 `hidden()` 方法的任何调用，反之亦然。
:::

或者，你可以使用 `visibleOn()` 方法来控制是否隐藏条目。在某些情况下，这可能有助于使你的代码更具可读性：

```php
use Filament\Infolists\Components\IconEntry;

IconEntry::make('is_admin')
    ->boolean()
    ->visibleOn('create')

IconEntry::make('is_admin')
    ->boolean()
    ->visibleOn(['create', 'edit'])
```

:::info
    `visibleOn()` 方法将覆盖之前对 `visible()` 方法的任何调用，反之亦然。
:::

## 内联标签

条目的标签可以与条目内联显示，而不是在其上方显示。这对于有很多条目的信息列表很有用，因为垂直空间很宝贵。要显示条目的内联标签，请使用 `inlineLabel()` 方法：

```php
use Filament\Infolists\Components\TextEntry;

TextInput::make('name')
    ->inlineLabel()
```

![带有内联标签的信息列表条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/inline-label.jpg)

你可以选择传递一个布尔值来控制标签是否应该内联显示：

```php
use Filament\Infolists\Components\TextInput;

TextInput::make('name')
    ->inlineLabel(FeatureFlag::active())
```

除了允许静态值外，`inlineLabel()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。

### 同时在多个地方使用内联标签

如果你想在[布局组件](../schemas/layouts)（如[分区](../schemas/sections)或[标签页](../schemas/tabs)）中将所有标签内联显示，可以在组件本身上使用 `inlineLabel()`，其中的所有条目都将内联显示其标签：

```php
use Filament\Infolists\Components\TextInput;
use Filament\Schemas\Components\Section;

Section::make('Details')
    ->inlineLabel()
    ->schema([
        TextInput::make('name'),
        TextInput::make('email')
            ->label('Email address'),
        TextInput::make('phone')
            ->label('Phone number'),
    ])
```

![分区中带有内联标签的信息列表条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/inline-label/section.jpg)

你也可以在整个 schema 上使用 `inlineLabel()` 来将所有标签内联显示：

```php
use Filament\Schemas\Schema;

public function infolist(Schema $schema): Schema
{
    return $schema
        ->inlineLabel()
        ->components([
            // ...
        ]);
}
```

在布局组件或 schema 上使用 `inlineLabel()` 时，你仍然可以通过在条目上使用 `inlineLabel(false)` 方法来选择退出单个条目的内联标签：

```php
use Filament\Infolists\Components\TextInput;
use Filament\Schemas\Components\Section;

Section::make('Details')
    ->inlineLabel()
    ->schema([
        TextInput::make('name'),
        TextInput::make('email')
            ->label('Email address'),
        TextInput::make('phone')
            ->label('Phone number')
            ->inlineLabel(false),
    ])
```

## 向条目添加工具提示

你可以指定悬停在条目上时显示的工具提示：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('title')
    ->tooltip('Shown at the top of the page')
```

除了允许静态值外，`tooltip()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。

![带有工具提示的条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/tooltips.jpg)

## 对齐条目内容

你可以使用 `alignStart()`、`alignCenter()` 或 `alignEnd()` 方法将条目的内容对齐到开头（从左到右界面中为左侧，从右到左界面中为右侧）、居中或结尾（从左到右界面中为右侧，从右到左界面中为左侧）：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('title')
    ->alignStart() // 这是默认对齐方式。

TextEntry::make('title')
    ->alignCenter()

TextEntry::make('title')
    ->alignEnd()
```

或者，你可以将 `Alignment` 枚举传递给 `alignment()` 方法：

```php
use Filament\Infolists\Components\TextEntry;
use Filament\Support\Enums\Alignment;

TextEntry::make('title')
    ->alignment(Alignment::Center)
```

除了允许静态值外，`alignment()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。

![不同对齐方式的条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/alignment.jpg)

## 向条目添加额外内容

条目包含许多"插槽"，可以在子 schema 中插入内容。插槽可以接受文本、[任何 schema 组件](../schemas/overview)、[操作](../actions/overview)和[操作组](../actions/grouping-actions)。通常，[Prime 组件](../schemas/primes)用于内容。

所有条目都可以使用以下插槽：

- `aboveLabel()`
- `beforeLabel()`
- `afterLabel()`
- `belowLabel()`
- `aboveContent()`
- `beforeContent()`
- `afterContent()`
- `belowContent()`

除了允许静态值外，插槽方法还接受函数来动态计算它们。你可以将各种实用工具作为参数注入到函数中。

要插入纯文本，你可以将字符串传递给这些方法：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('name')
    ->belowContent('This is the user\'s full name.')
```

![内容下方带有文本的信息列表条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/below-content/text.jpg)

要插入 schema 组件（通常是 [Prime 组件](../schemas/overview)），你可以将组件传递给方法：

```php
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Text;
use Filament\Support\Enums\FontWeight;

TextEntry::make('name')
    ->belowContent(Text::make('This is the user\'s full name.')->weight(FontWeight::Bold))
```

![内容下方带有组件的信息列表条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/below-content/component.jpg)

要插入[操作](../actions/overview)或[操作组](../actions/grouping-actions)，你可以将操作或操作组传递给方法：

```php
use Filament\Actions\Action;
use Filament\Infolists\Components\TextEntry;

TextEntry::make('name')
    ->belowContent(Action::make('generate'))
```

![内容下方带有操作的信息列表条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/below-content/action.jpg)

你可以通过将内容数组传递给方法来将任何内容组合插入插槽：

```php
use Filament\Actions\Action;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Icon;
use Filament\Support\Icons\Heroicon;

TextEntry::make('name')
    ->belowContent([
        Icon::make(Heroicon::InformationCircle),
        'This is the user\'s full name.',
        Action::make('generate'),
    ])
```

![内容下方带有多个组件的信息列表条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/below-content.jpg)

你还可以通过将内容数组传递给 `Schema::start()`（默认）、`Schema::end()` 或 `Schema::between()` 来对齐插槽中的内容：

```php
use Filament\Actions\Action;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Flex;
use Filament\Schemas\Components\Icon;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;

TextEntry::make('name')
    ->belowContent(Schema::end([
        Icon::make(Heroicon::InformationCircle),
        'This is the user\'s full name.',
        Action::make('generate'),
    ]))

TextEntry::make('name')
    ->belowContent(Schema::between([
        Icon::make(Heroicon::InformationCircle),
        'This is the user\'s full name.',
        Action::make('generate'),
    ]))

TextEntry::make('name')
    ->belowContent(Schema::between([
        Flex::make([
            Icon::make(Heroicon::InformationCircle)
                ->grow(false),
            'This is the user\'s full name.',
        ]),
        Action::make('generate'),
    ]))
```

:::tip
    如上面 `Schema::between()` 的示例所示，[`Flex` 组件](../schemas/layouts#弹性布局组件)用于将图标和文本分组在一起，使它们之间没有空格。图标使用 `grow(false)` 来防止它占用一半的水平空间，让文本消耗剩余的空间。
:::

![内容下方带有对齐组件的信息列表条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/below-content/alignment.jpg)

### 在条目标签上方添加额外内容

你可以使用 `aboveLabel()` 方法在条目标签上方插入额外内容。你可以[传递任何内容](#向条目添加额外内容)给此方法，如文本、schema 组件、操作或操作组：

```php
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Icon;
use Filament\Support\Icons\Heroicon;

TextEntry::make('name')
    ->aboveLabel([
        Icon::make(Heroicon::Star),
        'This is the content above the entry\'s label'
    ])
```

除了允许静态值外，`aboveLabel()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。

![标签上方带有额外内容的信息列表条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/above-label.jpg)

### 在条目前添加额外内容

你可以使用 `beforeLabel()` 方法在条目前插入额外内容。你可以[传递任何内容](#向条目添加额外内容)给此方法，如文本、schema 组件、操作或操作组：

```php
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Icon;
use Filament\Support\Icons\Heroicon;

TextEntry::make('name')
    ->beforeLabel(Icon::make(Heroicon::Star))
```

除了允许静态值外，`beforeLabel()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。

![标签前带有额外内容的信息列表条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/before-label.jpg)

### 在条目后添加额外内容

你可以使用 `afterLabel()` 方法在条目后插入额外内容。你可以[传递任何内容](#向条目添加额外内容)给此方法，如文本、schema 组件、操作或操作组：

```php
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Icon;
use Filament\Support\Icons\Heroicon;

TextEntry::make('name')
    ->afterLabel([
        Icon::make(Heroicon::Star),
        'This is the content after the entry\'s label'
    ])
```

除了允许静态值外，`afterLabel()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。

![标签后带有额外内容的信息列表条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/after-label.jpg)

默认情况下，`afterLabel()` schema 中的内容对齐到容器的末尾。如果你想将其对齐到容器的开头，应该传递一个包含内容的 `Schema::start()` 对象：

```php
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Icon;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;

TextEntry::make('name')
    ->afterLabel(Schema::start([
        Icon::make(Heroicon::Star),
        'This is the content after the entry\'s label'
    ]))
```

除了允许静态值外，`afterLabel()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。

![标签后带有对齐到开头的额外内容的信息列表条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/after-label/aligned-start.jpg)

### 在条目标签下方添加额外内容

你可以使用 `belowLabel()` 方法在条目标签下方插入额外内容。你可以[传递任何内容](#向条目添加额外内容)给此方法，如文本、schema 组件、操作或操作组：

```php
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Icon;
use Filament\Support\Icons\Heroicon;

TextEntry::make('name')
    ->belowLabel([
        Icon::make(Heroicon::Star),
        'This is the content below the entry\'s label'
    ])
```

除了允许静态值外，`belowLabel()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。

![标签下方带有额外内容的信息列表条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/below-label.jpg)

:::info
    这看起来可能与 [`aboveContent()` 方法](#在条目内容上方添加额外内容)相同。但是，当使用[内联标签](#内联标签)时，`aboveContent()` 方法将把内容放在条目上方，而不是标签下方，因为标签显示在条目内容的单独列中。
:::

### 在条目内容上方添加额外内容

你可以使用 `aboveContent()` 方法在条目内容上方插入额外内容。你可以[传递任何内容](#向条目添加额外内容)给此方法，如文本、schema 组件、操作或操作组：

```php
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Icon;
use Filament\Support\Icons\Heroicon;

TextEntry::make('name')
    ->aboveContent([
        Icon::make(Heroicon::Star),
        'This is the content above the entry\'s content'
    ])
```

除了允许静态值外，`aboveContent()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。

![内容上方带有额外内容的信息列表条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/above-content.jpg)

:::info
    这看起来可能与 [`belowLabel()` 方法](#在条目标签下方添加额外内容)相同。但是，当使用[内联标签](#内联标签)时，`belowLabel()` 方法将把内容放在标签下方，而不是条目内容上方，因为标签显示在条目内容的单独列中。
:::

### 在条目内容之前添加额外内容

你可以使用 `beforeContent()` 方法在条目内容之前插入额外内容。你可以[传递任何内容](#向条目添加额外内容)给此方法，如文本、schema 组件、操作或操作组：

```php
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Icon;
use Filament\Support\Icons\Heroicon;

TextEntry::make('name')
    ->beforeContent(Icon::make(Heroicon::Star))
```

除了允许静态值外，`beforeContent()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。

![内容前带有额外内容的信息列表条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/before-content.jpg)

### 在条目内容之后添加额外内容

你可以使用 `afterContent()` 方法在条目内容之后插入额外内容。你可以[传递任何内容](#向条目添加额外内容)给此方法，如文本、schema 组件、操作或操作组：

```php
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Icon;
use Filament\Support\Icons\Heroicon;

TextEntry::make('name')
    ->afterContent(Icon::make(Heroicon::Star))
```

除了允许静态值外，`afterContent()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。

![内容后带有额外内容的信息列表条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/after-content.jpg)

## 向条目添加额外 HTML 属性

你可以通过 `extraAttributes()` 方法将额外的 HTML 属性传递给条目，这些属性将合并到其外部 HTML 元素上。属性应由数组表示，其中键是属性名称，值是属性值：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('slug')
    ->extraAttributes(['class' => 'bg-gray-200'])
```

除了允许静态值外，`extraAttributes()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。

默认情况下，多次调用 `extraAttributes()` 将覆盖之前的属性。如果你想合并属性，可以将 `merge: true` 传递给方法。

### 向条目包装器添加额外 HTML 属性

你还可以将额外的 HTML 属性传递给围绕条目标签和内容的"条目包装器"的最外层元素。如果你想通过 CSS 设置条目标签或间距的样式，这很有用，因为你可以将元素定位为包装器的子元素：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('slug')
    ->extraEntryWrapperAttributes(['class' => 'components-locked'])
```

除了允许静态值外，`extraEntryWrapperAttributes()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。

默认情况下，多次调用 `extraEntryWrapperAttributes()` 将覆盖之前的属性。如果你想合并属性，可以将 `merge: true` 传递给方法。

## 条目工具注入

用于配置条目的绝大多数方法都接受函数作为参数，而不是硬编码的值：

```php
use App\Models\User;
use Filament\Infolists\Components\TextEntry;

TextEntry::make('name')
    ->label(fn (string $state): string => str_contains($state, ' ') ? 'Full name' : 'Name')

TextEntry::make('currentUserEmail')
    ->state(fn (): string => auth()->user()->email)

TextEntry::make('role')
    ->hidden(fn (User $record): bool => $record->role === 'admin')
```

这本身就解锁了许多自定义可能性。

该包还能够将许多实用工具注入到这些函数中作为参数。所有接受函数作为参数的自定义方法都可以注入实用工具。

这些注入的实用工具需要使用特定的参数名称。否则，Filament 不知道要注入什么。

### 注入条目的当前状态

如果你想访问条目的当前[值（状态）](#条目内容状态)，请定义一个 `$state` 参数：

```php
function ($state) {
    // ...
}
```

### 注入另一个条目或表单字段的状态

你还可以使用 `$get` 参数从回调中检索另一个条目或表单字段的状态（值）：

```php
use Filament\Schemas\Components\Utilities\Get;

function (Get $get) {
    $email = $get('email'); // 将 `email` 条目的值存储在 `$email` 变量中。
    //...
}
```

:::tip
    除非表单字段是[响应式的](../forms/overview#响应式基础)，否则当字段值更改时，schema 不会刷新，只有在下一次用户交互发生并向服务器发出请求时才会刷新。如果你需要对字段值的更改做出反应，它应该是 `live()`。
:::

### 注入当前 Eloquent 记录

你可以使用 `$record` 参数检索当前 schema 的 Eloquent 记录：

```php
use Illuminate\Database\Eloquent\Model;

function (?Model $record) {
    // ...
}
```

### 注入当前操作

如果你正在为面板资源或关联管理器编写 schema，并且希望检查 schema 是 `create`、`edit` 还是 `view`，请使用 `$operation` 参数：

```php
function (string $operation) {
    // ...
}
```

:::info
    你可以使用 `$schema->operation()` 方法手动设置 schema 的操作。
:::

### 注入当前 Livewire 组件实例

如果你想访问当前 Livewire 组件实例，请定义一个 `$livewire` 参数：

```php
use Livewire\Component;

function (Component $livewire) {
    // ...
}
```

### 注入当前条目实例

如果你想访问当前组件实例，请定义一个 `$component` 参数：

```php
use Filament\Infolists\Components\Entry;

function (Entry $component) {
    // ...
}
```

### 注入多个实用工具

参数使用反射动态注入，因此你可以按任意顺序组合多个参数：

```php
use App\Models\User;
use Filament\Schemas\Components\Utilities\Get;
use Livewire\Component as Livewire;

function (Livewire $livewire, Get $get, User $record) {
    // ...
}
```

### 从 Laravel 容器注入依赖

你可以像平常一样从 Laravel 容器注入任何内容，与实用工具一起：

```php
use App\Models\User;
use Illuminate\Http\Request;

function (Request $request, User $record) {
    // ...
}
```

## 全局设置

如果你想全局更改所有条目的默认行为，可以在服务提供者的 `boot()` 方法中调用静态 `configureUsing()` 方法，传递一个闭包来修改条目。例如，如果你想使所有 `TextEntry` 组件 [`words(10)`](text-entry#限制字数)，可以这样做：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::configureUsing(function (TextEntry $entry): void {
    $entry->words(10);
});
```

当然，你仍然可以在每个条目上单独覆盖此设置：

```php
use Filament\Infolists\Components\TextEntry;

TextEntry::make('name')
    ->words(null)
```
