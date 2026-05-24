---
title: 布局
---

## 简介

Filament 的网格系统允许你使用任何布局组件创建响应式多列布局。Filament 提供了一组内置布局组件来帮助你构建这些布局：

- [网格](#网格组件)
- [弹性布局](#弹性布局组件)
- [字段集](#字段集组件)
- [区块](sections)
- [标签页](tabs)
- [向导](wizards)
- [提示框](callouts)
- [空状态](empty-states)

你也可以[创建自己的自定义布局组件](custom-components#自定义组件类)来按需显示组件。

## 网格系统

所有布局组件都有一个 `columns()` 方法，你可以通过几种不同的方式使用它：

- 你可以传递一个整数，如 `columns(2)`。这个整数是 `lg` 断点及更高断点上使用的列数。所有较小的设备将只有 1 列。
- 你可以传递一个数组，其中键是断点，值是列数。例如，`columns(['md' => 2, 'xl' => 4])` 将在中等设备上创建 2 列布局，在超大设备上创建 4 列布局。较小设备的默认断点使用 1 列，除非你使用 `default` 数组键。

断点（`sm`、`md`、`lg`、`xl`、`2xl`）由 Tailwind 定义，可以在 [Tailwind 文档](https://tailwindcss.com/docs/responsive-design#overview)中找到。

:::tip
除了允许静态值外，`columns()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。
:::

### 网格列跨度

除了指定布局组件应该有多少列之外，你还可以使用 `columnSpan()` 方法指定组件应该在父网格中填充多少列。此方法接受一个整数或断点和列跨度的数组：

- 你可以传递一个整数，如 `columnSpan(2)`。这个整数是 `lg` 断点及更高断点上消耗的列数。所有较小的设备只跨越 1 列。
- `columnSpan(['md' => 2, 'xl' => 4])` 将使组件在中等设备上填充最多 2 列，在超大设备上填充最多 4 列。较小设备的默认断点使用 1 列，除非你使用 `default` 数组键。
- `columnSpan('full')` 将使组件在 `lg` 断点及更高断点上填充父网格的整个宽度，无论有多少列。所有较小的设备只跨越 1 列。
- `columnSpanFull()` 将使组件在所有设备上填充父网格的整个宽度，无论有多少列。

:::tip
除了允许静态值外，`columnSpan()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。
:::

![带有列跨度的网格](/assets/filament/v4.x/screenshots/images/light/schemas/layout/grid/column-span.jpg)

### 网格列起始位置

如果你想在网格中从特定列开始组件，可以使用 `columnStart()` 方法。此方法接受一个整数，或断点和组件应起始的列的数组：

- 你可以传递一个整数，如 `columnStart(2)`。这个整数是 `lg` 断点及更高断点上组件将开始的列。所有较小的设备在第一列开始组件。
- `columnStart(['md' => 2, 'xl' => 4])` 将使组件在中等设备上从第 2 列开始，在超大设备上从第 4 列开始。较小设备的默认断点使用 1 列，除非你使用 `default` 数组键。

```php
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Grid;

Grid::make()
    ->columns([
        'sm' => 3,
        'xl' => 6,
        '2xl' => 8,
    ])
    ->schema([
        TextInput::make('name')
            ->columnStart([
                'sm' => 2,
                'xl' => 3,
                '2xl' => 4,
            ]),
        // ...
    ])
```

在此示例中，网格在小设备上有 3 列，在超大设备上有 6 列，在超超大设备上有 8 列。文本输入将在小设备上从第 2 列开始，在超大设备上从第 3 列开始，在超超大设备上从第 4 列开始。这本质上产生了一个布局，无论网格有多少列，文本输入总是从网格的一半开始。

:::tip
除了允许静态值外，`columnStart()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。
:::

![带有列起始位置的网格](/assets/filament/v4.x/screenshots/images/light/schemas/layout/grid/column-start.jpg)

### 网格列排序

如果你想控制网格中组件的视觉顺序而不改变它们在标记中的位置，可以使用 `columnOrder()` 方法。此方法接受一个整数、闭包或断点和顺序值的数组：

- 你可以传递一个整数，如 `columnOrder(2)`。这个整数是 `lg` 断点及更高断点上组件将出现的顺序。所有较小的设备使用默认顺序，除非你使用 `default` 数组键。
- `columnOrder(['md' => 2, 'xl' => 4])` 将在中等设备上将组件的顺序设置为 2，在超大设备上设置为 4。较小设备的默认断点使用默认顺序，除非你使用 `default` 数组键。
- `columnOrder(fn () => 1)` 将使用闭包动态计算顺序。

```php
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Grid;

Grid::make()
    ->columns(3)
    ->schema([
        TextInput::make('first')
            ->columnOrder(3), // 这将最后显示
        TextInput::make('second')
            ->columnOrder(1), // 这将首先显示
        TextInput::make('third')
            ->columnOrder(2), // 这将第二个显示
    ])
```

![带有重新排序列的网格](/assets/filament/v4.x/screenshots/images/light/schemas/layout/grid/column-order.jpg)

你还可以使用响应式排序来根据屏幕大小更改组件的视觉顺序：

```php
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Grid;

Grid::make()
    ->columns([
        'sm' => 2,
        'lg' => 3,
    ])
    ->schema([
        TextInput::make('title')
            ->columnOrder([
                'default' => 1,
                'lg' => 3,
            ]),
        TextInput::make('description')
            ->columnOrder([
                'default' => 2,
                'lg' => 1,
            ]),
        TextInput::make('category')
            ->columnOrder([
                'default' => 3,
                'lg' => 2,
            ]),
    ])
```

在此示例中，在小屏幕上顺序将是：标题、描述、分类。在大屏幕上，顺序将是：描述、分类、标题。

:::tip
除了允许静态值外，`columnOrder()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。
:::

### 响应式网格布局示例

在此示例中，我们有一个带有[区块](sections)布局组件的 schema。由于所有布局组件都支持 `columns()` 方法，我们可以使用它在区块本身内创建响应式网格布局。

我们向 `columns()` 传递一个数组，因为我们想为不同的断点指定不同的列数。在小于 `sm` [Tailwind 断点](https://tailwindcss.com/docs/responsive-design#overview)的设备上，我们想要 1 列，这是默认值。在大于 `sm` 断点的设备上，我们想要 3 列。在大于 `xl` 断点的设备上，我们想要 6 列。在大于 `2xl` 断点的设备上，我们想要 8 列。

在区块内，我们有一个[文本输入](../forms/text-input)。由于文本输入是表单字段，所有组件都有 `columnSpan()` 方法，我们可以使用它来指定文本输入应该填充多少列。在小于 `sm` 断点的设备上，我们希望文本输入填充 1 列，这是默认值。在大于 `sm` 断点的设备上，我们希望文本输入填充 2 列。在大于 `xl` 断点的设备上，我们希望文本输入填充 3 列。在大于 `2xl` 断点的设备上，我们希望文本输入填充 4 列。

此外，我们使用 `columnOrder()` 方法来控制网格中组件的视觉顺序。这允许我们在不改变标记结构的情况下更改显示顺序。

```php
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;

Section::make()
    ->columns([
        'sm' => 3,
        'xl' => 6,
        '2xl' => 8,
    ])
    ->schema([
        TextInput::make('name')
            ->columnSpan([
                'default' => 1,
                'sm' => 2,
                'xl' => 3,
                '2xl' => 4,
            ])
            ->columnOrder([
                'default' => 2,
                'xl' => 1,
            ]),
        TextInput::make('email')
            ->columnSpan([
                'default' => 1,
                'xl' => 2,
            ])
            ->columnOrder([
                'default' => 1,
                'xl' => 2,
            ]),
        // ...
    ])
```

在此示例中，在小于 `xl` 断点的屏幕上，电子邮件字段将首先显示，然后是名称字段。在大于 `xl` 断点的屏幕上，顺序相反，名称字段首先显示，然后是电子邮件字段。

## 基本布局组件

### 网格组件

所有布局组件都支持 `columns()` 方法，但你还可以访问一个额外的 `Grid` 组件。如果你觉得你的 schema 会受益于没有额外样式的显式网格语法，它可能对你有用。你可以将列配置直接传递给 `Grid::make()`，而不是使用 `columns()` 方法：

```php
use Filament\Schemas\Components\Grid;

Grid::make([
    'default' => 1,
    'sm' => 2,
    'md' => 3,
    'lg' => 4,
    'xl' => 6,
    '2xl' => 8,
])
    ->schema([
        // ...
    ])
```

![网格](/assets/filament/v4.x/screenshots/images/light/schemas/layout/grid/simple.jpg)

### 弹性布局组件

`Flex` 组件允许你使用 flexbox 定义具有灵活宽度的布局。此组件不使用 Filament 的[网格系统](#网格系统)。

```php
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Flex;

Flex::make([
    Section::make([
        TextInput::make('title'),
        Textarea::make('content'),
    ]),
    Section::make([
        Toggle::make('is_published'),
        Toggle::make('is_featured'),
    ])->grow(false),
])->from('md')
```

在此示例中，第一个区块将 `grow()` 以消耗可用的水平空间，而不影响渲染第二个区块所需的空间量。这创建了一个灵活宽度的侧边栏效果。

`from()` 方法用于控制应使用水平分割布局的 [Tailwind 断点](https://tailwindcss.com/docs/responsive-design#overview)（`sm`、`md`、`lg`、`xl`、`2xl`）。在此示例中，水平分割布局将在中等设备及更大设备上使用。在较小的设备上，区块将堆叠在一起。

:::tip
除了允许静态值外，`grow()` 和 `from()` 方法还接受函数来动态计算它们。你可以将各种实用工具作为参数注入到函数中。
:::

![弹性布局](/assets/filament/v4.x/screenshots/images/light/schemas/layout/flex/simple.jpg)

### 字段集组件

你可能想要将字段分组到字段集中。每个字段集默认有一个标签、一个边框和一个两列网格：

```php
use Filament\Schemas\Components\Fieldset;

Fieldset::make('标签')
    ->columns([
        'default' => 1,
        'md' => 2,
        'xl' => 3,
    ])
    ->schema([
        // ...
    ])
```

:::tip
除了允许静态标签外，`make()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。
:::

![字段集](/assets/filament/v4.x/screenshots/images/light/schemas/layout/fieldset/simple.jpg)

### 移除字段集边框

你可以使用 `contained(false)` 方法移除字段集的容器边框：

```php
use Filament\Schemas\Components\Fieldset;

Fieldset::make('标签')
    ->contained(false)
    ->schema([
        // ...
    ])
```

:::tip
除了允许静态值外，`contained()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。
:::

![没有容器边框的字段集](/assets/filament/v4.x/screenshots/images/light/schemas/layout/fieldset/not-contained.jpg)

## 使用容器查询

除了基于视口大小的传统断点外，你还可以使用[容器查询](https://tailwindcss.com/docs/responsive-design#container-queries)来基于父容器的大小创建响应式布局。当父容器的大小不直接与视口大小相关时，这特别有用。例如，当在内容旁边使用可折叠侧边栏时，内容区域会根据侧边栏的折叠状态动态调整其大小。

容器查询的基础是容器本身。容器是其宽度决定布局的元素。要将元素指定为容器，请在其上使用 `gridContainer()` 方法。例如，如果你想根据 [`Grid` 组件]的宽度定义网格列数：

```php
use Filament\Schemas\Components\Grid;

Grid::make()
    ->gridContainer()
    ->columns([
        // ...
    ])
    ->schema([
        // ...
    ])
```

一旦元素被指定为网格容器，该元素或其任何子元素就可以使用[容器断点](https://tailwindcss.com/docs/responsive-design#container-size-reference)而不是标准断点。例如，你可以使用 `@md` 来定义容器宽度至少为 `448px` 时的网格列数，使用 `@xl` 来定义宽度至少为 `576px` 时的列数。

```php
use Filament\Schemas\Components\Grid;

Grid::make()
    ->gridContainer()
    ->columns([
        '@md' => 3,
        '@xl' => 4,
    ])
    ->schema([
        // ...
    ])
```

你还可以在 `columnSpan()`、`columnStart()` 和 `columnOrder()` 方法中使用容器断点：

```php
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Grid;

Grid::make()
    ->gridContainer()
    ->columns([
        '@md' => 3,
        '@xl' => 4,
    ])
    ->schema([
        TextInput::make('name')
            ->columnSpan([
                '@md' => 2,
                '@xl' => 3,
            ])
            ->columnOrder([
                'default' => 2,
                '@xl' => 1,
            ]),
        TextInput::make('email')
            ->columnSpan([
                'default' => 1,
                '@xl' => 1,
            ])
            ->columnOrder([
                'default' => 1,
                '@xl' => 2,
            ]),
        // ...
    ])
```

在此示例中，当容器宽度小于 `@xl` 断点（576px）时，电子邮件字段将首先显示，然后是名称字段。当容器宽度至少为 576px 时，顺序相反，名称字段首先显示，然后是电子邮件字段。

### 在旧版浏览器上支持容器查询

与传统断点相比，容器查询在浏览器中的[支持](https://caniuse.com/css-container-queries)还不够广泛。为了支持旧版浏览器，你可以在容器断点旁边定义额外的断点层。通过在传统断点前加上 `!@`，你可以指定当浏览器不支持容器查询时应使用回退断点。

例如，如果你想对网格列使用 `@md` 容器断点但也支持旧版浏览器，你可以定义 `!@md` 回退断点，当容器查询不可用时将应用该断点：

```php
use Filament\Schemas\Components\Grid;

Grid::make()
    ->gridContainer()
    ->columns([
        '@md' => 3,
        '@xl' => 4,
        '!@md' => 2,
        '!@xl' => 3,
    ])
    ->schema([
        // ...
    ])
```

你还可以在 `columnSpan()`、`columnStart()` 和 `columnOrder()` 方法中使用 `!@` 回退断点：

```php
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Grid;

Grid::make()
    ->gridContainer()
    ->columns([
        '@md' => 3,
        '@xl' => 4,
        '!@md' => 2,
        '!@xl' => 3,
    ])
    ->schema([
        TextInput::make('name')
            ->columnSpan([
                '@md' => 2,
                '@xl' => 3,
                '!@md' => 2,
                '!@xl' => 2,
            ])
            ->columnOrder([
                'default' => 2,
                '@xl' => 1,
                '!@xl' => 1,
            ]),
        TextInput::make('email')
            ->columnOrder([
                'default' => 1,
                '@xl' => 2,
                '!@xl' => 2,
            ]),
        // ...
    ])
```

在此示例中，回退断点确保即使在不支持容器查询的浏览器中，布局仍将响应视口大小变化，名称字段在大屏幕上首先显示，电子邮件字段第二显示。

## 控制组件之间的间距

### 减少组件之间的间距

`dense()` 方法通过将组件之间的间距减少 50% 来创建更紧凑的布局：

```php
use Filament\Schemas\Components\Fieldset;

Fieldset::make('紧凑')
    ->dense()
    ->schema([
        // ...
    ])
```

![带有密集间距的布局](/assets/filament/v4.x/screenshots/images/light/schemas/layout/dense.jpg)

### 移除组件之间的间距

`gap(false)` 方法移除组件之间的间距：

```php
use Filament\Schemas\Components\Fieldset;

Fieldset::make('无间距')
    ->gap(false)
    ->schema([
        // ...
    ])
```

![没有间距的布局](/assets/filament/v4.x/screenshots/images/light/schemas/layout/no-gap.jpg)

## 向布局组件添加额外的 HTML 属性

你可以通过 `extraAttributes()` 方法向组件传递额外的 HTML 属性，这些属性将合并到其外部 HTML 元素上。属性应由数组表示，其中键是属性名，值是属性值：

```php
use Filament\Schemas\Components\Section;

Section::make()
    ->extraAttributes(['class' => 'custom-section-style'])
```

:::tip
除了允许静态值外，`extraAttributes()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。
:::

默认情况下，多次调用 `extraAttributes()` 将覆盖先前的属性。如果你想合并属性，可以将 `merge: true` 传递给该方法。
