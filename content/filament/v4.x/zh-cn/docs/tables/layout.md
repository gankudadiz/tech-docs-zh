---
title: 布局
---

## 传统表格布局的问题

传统表格以响应性差而闻名。在移动设备上，渲染水平方向较长的内容时只有有限的灵活性：

- 允许用户水平滚动查看更多表格内容
- 在较小的设备上隐藏不重要的列

这两种方式在 Filament 中都是可行的。表格在溢出时会自动水平滚动，你可以选择基于浏览器的响应式[断点](https://tailwindcss.com/docs/responsive-design#overview)来显示和隐藏列。为此，你可以使用 `visibleFrom()` 或 `hiddenFrom()` 方法：

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('slug')
    ->visibleFrom('md')
```

这样是可以的，但仍然存在一个明显的问题——**在移动设备上，用户无法在不滚动的情况下一次看到表格行中的太多信息**。

Filament 为此问题提供了两种解决方案：

1. **简单堆叠** - 使用 `stackedOnMobile()` 在移动设备上自动垂直堆叠所有单元格，无需更改列定义
2. **自定义布局** - 使用 `Split`、`Stack` 和其他布局组件来精细控制内容在每个断点的显示方式

## 在移动设备上堆叠表格单元格

使表格具有响应性的最简单方法是在表格上使用 `stackedOnMobile()` 方法。这会自动将传统的水平表格布局在移动屏幕上转换为垂直的卡片式布局，同时在较大的屏幕上保留标准的表格外观：

```php
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->columns([
            TextColumn::make('name')
                ->searchable()
                ->sortable(),
            TextColumn::make('email'),
            TextColumn::make('phone'),
            TextColumn::make('job'),
        ])
        ->stackedOnMobile();
}
```

![桌面端堆叠移动布局](/assets/filament/v4.x/screenshots/images/light/tables/layout/stacked-on-mobile.jpg)

![移动端堆叠移动布局](/assets/filament/v4.x/screenshots/images/light/tables/layout/stacked-on-mobile/mobile.jpg)

在移动设备上，每行显示为一张卡片，列标签在其值上方。如果你有可排序的列，移动设备上表格顶部会出现一个排序下拉菜单，允许用户在没有传统标题行的情况下进行排序。还支持批量选择，复选框出现在头部区域。

当你想要快速的响应式解决方案而无需重构列时，这种方法效果很好。但是，对于更复杂的布局或精细控制内容在不同断点的显示方式，你可能更喜欢使用下面描述的布局组件。

## 自定义列布局

Filament 让你无需接触 HTML 或 CSS 即可构建响应式的类表格界面。这些布局让你精确定义内容在表格行中每个响应式断点的显示位置。

![响应式布局表格](/assets/filament/v4.x/screenshots/images/light/tables/layout/demo.jpg)

![移动端响应式布局表格](/assets/filament/v4.x/screenshots/images/light/tables/layout/demo/mobile.jpg)

### 允许列在移动设备上堆叠

让我们介绍一个组件——`Split`：

```php
use Filament\Support\Enums\FontWeight;
use Filament\Tables\Columns\Layout\Split;
use Filament\Tables\Columns\TextColumn;

Split::make([
    ImageColumn::make('avatar')
        ->circular(),
    TextColumn::make('name')
        ->weight(FontWeight::Bold)
        ->searchable()
        ->sortable(),
    TextColumn::make('email'),
])
```

![分割布局表格](/assets/filament/v4.x/screenshots/images/light/tables/layout/split.jpg)

![移动端分割布局表格](/assets/filament/v4.x/screenshots/images/light/tables/layout/split/mobile.jpg)

`Split` 组件用于包裹列，并允许它们在移动设备上堆叠。

默认情况下，分割内的列将始终并排显示。但是，你可以选择一个响应式[断点](https://tailwindcss.com/docs/responsive-design#overview)，从此处开始此行为。在此之前，列将堆叠在一起：

```php
use Filament\Support\Enums\FontWeight;
use Filament\Tables\Columns\Layout\Split;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;

Split::make([
    ImageColumn::make('avatar')
        ->circular(),
    TextColumn::make('name')
        ->weight(FontWeight::Bold)
        ->searchable()
        ->sortable(),
    TextColumn::make('email'),
])->from('md')
```

在此示例中，列只会在 `md` [断点](https://tailwindcss.com/docs/responsive-design#overview)设备及更高版本上并排显示：

![桌面端分割布局](/assets/filament/v4.x/screenshots/images/light/tables/layout/split-desktop.jpg)

![移动端堆叠布局](/assets/filament/v4.x/screenshots/images/light/tables/layout/split-desktop/mobile.jpg)

### 防止列创建空白

分割和表格列一样，会自动调整它们的空白以确保每列有相称的间距。你可以使用 `grow(false)` 来防止这种情况发生。在此示例中，我们将确保头像图片紧贴名称列：

```php
use Filament\Support\Enums\FontWeight;
use Filament\Tables\Columns\Layout\Split;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;

Split::make([
    ImageColumn::make('avatar')
        ->circular()
        ->grow(false),
    TextColumn::make('name')
        ->weight(FontWeight::Bold)
        ->searchable()
        ->sortable(),
    TextColumn::make('email'),
])
```

其他允许 `grow()` 的列将调整以占用新释放的空间：

![禁用增长的列](/assets/filament/v4.x/screenshots/images/light/tables/layout/grow-disabled.jpg)

![移动端禁用增长的列](/assets/filament/v4.x/screenshots/images/light/tables/layout/grow-disabled/mobile.jpg)

### 分割内的堆叠

在分割内，你可以将多个列垂直堆叠在一起。这允许你在桌面端用更少的列显示更多数据：

```php
use Filament\Support\Enums\FontWeight;
use Filament\Tables\Columns\Layout\Split;
use Filament\Tables\Columns\Layout\Stack;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;

Split::make([
    ImageColumn::make('avatar')
        ->circular(),
    TextColumn::make('name')
        ->weight(FontWeight::Bold)
        ->searchable()
        ->sortable(),
    Stack::make([
        TextColumn::make('phone')
            ->icon('heroicon-m-phone'),
        TextColumn::make('email')
            ->icon('heroicon-m-envelope'),
    ]),
])
```

![带堆叠的表格](/assets/filament/v4.x/screenshots/images/light/tables/layout/stack.jpg)

![移动端带堆叠的表格](/assets/filament/v4.x/screenshots/images/light/tables/layout/stack/mobile.jpg)

#### 在移动设备上隐藏堆叠

与单个列类似，你可以选择基于浏览器的响应式[断点](https://tailwindcss.com/docs/responsive-design#overview)来隐藏堆叠。为此，你可以使用 `visibleFrom()` 方法：

```php
use Filament\Support\Enums\FontWeight;
use Filament\Tables\Columns\Layout\Split;
use Filament\Tables\Columns\Layout\Stack;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;

Split::make([
    ImageColumn::make('avatar')
        ->circular(),
    TextColumn::make('name')
        ->weight(FontWeight::Bold)
        ->searchable()
        ->sortable(),
    Stack::make([
        TextColumn::make('phone')
            ->icon('heroicon-m-phone'),
        TextColumn::make('email')
            ->icon('heroicon-m-envelope'),
    ])->visibleFrom('md'),
])
```

![带堆叠的表格](/assets/filament/v4.x/screenshots/images/light/tables/layout/stack-hidden-on-mobile.jpg)

![移动端无堆叠的表格](/assets/filament/v4.x/screenshots/images/light/tables/layout/stack-hidden-on-mobile/mobile.jpg)

#### 对齐堆叠内容

默认情况下，堆叠内的列对齐到起始位置。你可以选择将堆叠内的列对齐到 `Alignment::Center` 或 `Alignment::End`：

```php
use Filament\Support\Enums\Alignment;
use Filament\Support\Enums\FontWeight;
use Filament\Tables\Columns\Layout\Split;
use Filament\Tables\Columns\Layout\Stack;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;

Split::make([
    ImageColumn::make('avatar')
        ->circular(),
    TextColumn::make('name')
        ->weight(FontWeight::Bold)
        ->searchable()
        ->sortable(),
    Stack::make([
        TextColumn::make('phone')
            ->icon('heroicon-m-phone')
            ->grow(false),
        TextColumn::make('email')
            ->icon('heroicon-m-envelope')
            ->grow(false),
    ])
        ->alignment(Alignment::End)
        ->visibleFrom('md'),
])
```

确保堆叠内的列设置了 `grow(false)`，否则它们将拉伸以填充堆叠的整个宽度，并遵循它们自己的对齐配置而不是堆叠的。

![右对齐堆叠的表格](/assets/filament/v4.x/screenshots/images/light/tables/layout/stack-aligned-right.jpg)

#### 堆叠内容的间距

默认情况下，堆叠内容在列之间没有垂直内边距。要添加一些，你可以使用 `space()` 方法，它接受 `1`、`2` 或 `3`，对应于 [Tailwind 的间距比例](https://tailwindcss.com/docs/space)：

```php
use Filament\Tables\Columns\Layout\Stack;
use Filament\Tables\Columns\TextColumn;

Stack::make([
    TextColumn::make('phone')
        ->icon('heroicon-m-phone'),
    TextColumn::make('email')
        ->icon('heroicon-m-envelope'),
])->space(1)
```

![带间距的堆叠内容](/assets/filament/v4.x/screenshots/images/light/tables/layout/stack-spaced.jpg)

### 使用网格控制列宽

有时，当列包含大量内容时，使用 `Split` 会产生不一致的宽度。这是因为它内部由 Flexbox 驱动，每行独立控制分配给内容的空间。

相反，你可以使用 `Grid` 布局，它使用 CSS 网格布局来允许你控制列宽：

```php
use Filament\Tables\Columns\Layout\Grid;
use Filament\Tables\Columns\TextColumn;

Grid::make([
    'lg' => 2,
])
    ->schema([
        TextColumn::make('phone')
            ->icon('heroicon-m-phone'),
        TextColumn::make('email')
            ->icon('heroicon-m-envelope'),
    ])
```

这些列从 `lg` [断点](https://tailwindcss.com/docs/responsive-design#overview)开始将在网格中始终占用相等的宽度。

![网格列布局表格](/assets/filament/v4.x/screenshots/images/light/tables/layout/column-grid.jpg)

你可以选择在其他断点自定义网格中的列数：

```php
use Filament\Tables\Columns\Layout\Grid;
use Filament\Tables\Columns\Layout\Stack;
use Filament\Tables\Columns\TextColumn;

Grid::make([
    'lg' => 2,
    '2xl' => 4,
])
    ->schema([
        Stack::make([
            TextColumn::make('name'),
            TextColumn::make('job'),
        ]),
        TextColumn::make('phone')
            ->icon('heroicon-m-phone'),
        TextColumn::make('email')
            ->icon('heroicon-m-envelope'),
    ])
```

你甚至可以控制每个组件在每个[断点](https://tailwindcss.com/docs/responsive-design#overview)占用多少网格列：

```php
use Filament\Tables\Columns\Layout\Grid;
use Filament\Tables\Columns\Layout\Stack;
use Filament\Tables\Columns\TextColumn;

Grid::make([
    'lg' => 2,
    '2xl' => 5,
])
    ->schema([
        Stack::make([
            TextColumn::make('name'),
            TextColumn::make('job'),
        ])->columnSpan([
            'lg' => 'full',
            '2xl' => 2,
        ]),
        TextColumn::make('phone')
            ->icon('heroicon-m-phone')
            ->columnSpan([
                '2xl' => 2,
            ]),
        TextColumn::make('email')
            ->icon('heroicon-m-envelope'),
    ])
```

### 可折叠内容

当你使用分割或堆叠等列布局时，你还可以添加可折叠内容。当你不想一次显示表格中的所有数据，但仍然希望用户在需要时可以访问它而无需导航离开时，这非常有用。

分割和堆叠组件可以设为 `collapsible()`，但还有一个专用的 `Panel` 组件，提供预设的背景颜色和圆角，将可折叠内容与其他内容分开：

```php
use Filament\Support\Enums\FontWeight;
use Filament\Tables\Columns\Layout\Panel;
use Filament\Tables\Columns\Layout\Split;
use Filament\Tables\Columns\Layout\Stack;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;

[
    Split::make([
        ImageColumn::make('avatar')
            ->circular(),
        TextColumn::make('name')
            ->weight(FontWeight::Bold)
            ->searchable()
            ->sortable(),
    ]),
    Panel::make([
        Stack::make([
            TextColumn::make('phone')
                ->icon('heroicon-m-phone'),
            TextColumn::make('email')
                ->icon('heroicon-m-envelope'),
        ]),
    ])->collapsible(),
]
```

你可以使用 `collapsed(false)` 方法默认展开面板：

```php
use Filament\Tables\Columns\Layout\Panel;
use Filament\Tables\Columns\Layout\Split;
use Filament\Tables\Columns\TextColumn;

Panel::make([
    Split::make([
        TextColumn::make('phone')
            ->icon('heroicon-m-phone'),
        TextColumn::make('email')
            ->icon('heroicon-m-envelope'),
    ])->from('md'),
])->collapsed(false)
```

![带可折叠内容的表格](/assets/filament/v4.x/screenshots/images/light/tables/layout/collapsible.jpg)

![移动端带可折叠内容的表格](/assets/filament/v4.x/screenshots/images/light/tables/layout/collapsible/mobile.jpg)

### 将记录排列成网格

有时，你可能发现你的数据更适合网格格式而不是列表。Filament 也可以处理！

只需使用 `$table->contentGrid()` 方法：

```php
use Filament\Tables\Columns\Layout\Stack;
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->columns([
            Stack::make([
                // 列
            ]),
        ])
        ->contentGrid([
            'md' => 2,
            'xl' => 3,
        ]);
}
```

在此示例中，行将以网格显示：

- 在移动设备上，它们将仅以 1 列显示。
- 从 `md` [断点](https://tailwindcss.com/docs/responsive-design#overview)开始，它们将以 2 列显示。
- 从 `xl` [断点](https://tailwindcss.com/docs/responsive-design#overview)开始，它们将以 3 列显示。

这些设置完全可自定义，从 `sm` 到 `2xl` 的任何[断点](https://tailwindcss.com/docs/responsive-design#overview)可以包含 `1` 到 `12` 列。

![网格布局表格](/assets/filament/v4.x/screenshots/images/light/tables/layout/grid.jpg)

![移动端网格布局表格](/assets/filament/v4.x/screenshots/images/light/tables/layout/grid/mobile.jpg)

### 自定义 HTML

你可以使用 `View` 组件向表格添加自定义 HTML。它甚至可以是 `collapsible()`：

```php
use Filament\Support\Enums\FontWeight;
use Filament\Tables\Columns\Layout\Split;
use Filament\Tables\Columns\Layout\View;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;

[
    Split::make([
        ImageColumn::make('avatar')
            ->circular(),
        TextColumn::make('name')
            ->weight(FontWeight::Bold)
            ->searchable()
            ->sortable(),
    ]),
    View::make('users.table.collapsible-row-content')
        ->collapsible(),
]
```

现在，创建一个 `/resources/views/users/table/collapsible-row-content.blade.php` 文件，并添加你的 HTML。你可以使用 `$getRecord()` 访问表格记录：

```blade
<p class="px-4 py-3 bg-gray-100 rounded-lg">
    <span class="font-medium">
        Email address:
    </span>

    <span>
        {{ $getRecord()->email }}
    </span>
</p>
```

#### 嵌入其他组件

你甚至可以将列或其他布局组件传递给 `components()` 方法：

```php
use Filament\Support\Enums\FontWeight;
use Filament\Tables\Columns\Layout\Split;
use Filament\Tables\Columns\Layout\View;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;

[
    Split::make([
        ImageColumn::make('avatar')
            ->circular(),
        TextColumn::make('name')
            ->weight(FontWeight::Bold)
            ->searchable()
            ->sortable(),
    ]),
    View::make('users.table.collapsible-row-content')
        ->components([
            TextColumn::make('email')
                ->icon('heroicon-m-envelope'),
        ])
        ->collapsible(),
]
```

现在，在 Blade 文件中渲染组件：

```blade
<div class="px-4 py-3 bg-gray-100 rounded-lg">
    @foreach ($getComponents() as $layoutComponent)
        {{ $layoutComponent
            ->record($getRecord())
            ->recordKey($getRecordKey())
            ->rowLoop($getRowLoop())
            ->renderInLayout() }}
    @endforeach
</div>
```
