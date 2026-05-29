---
title: 构建器
---

## 简介

与[重复器](repeater)类似，构建器组件允许你输出一个由重复表单组件组成的 JSON 数组。与重复器不同的是，重复器只定义一种表单 schema 来重复，而构建器允许你定义不同的 schema "块"，并可以按任意顺序重复。这使得它适用于构建更高级的数组结构。

构建器组件的主要用途是使用预定义的块来构建网页内容。这可以是营销网站的内容，也可以是在线表单中的字段。下面的示例为页面内容中的不同元素定义了多个块。在你网站的前端，你可以循环遍历 JSON 中的每个块并按你想要的方式格式化它。

```php
use Filament\Forms\Components\Builder;
use Filament\Forms\Components\Builder\Block;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;

Builder::make('content')
    ->blocks([
        Block::make('heading')
            ->schema([
                TextInput::make('content')
                    ->label('Heading')
                    ->required(),
                Select::make('level')
                    ->options([
                        'h1' => 'Heading 1',
                        'h2' => 'Heading 2',
                        'h3' => 'Heading 3',
                        'h4' => 'Heading 4',
                        'h5' => 'Heading 5',
                        'h6' => 'Heading 6',
                    ])
                    ->required(),
            ])
            ->columns(2),
        Block::make('paragraph')
            ->schema([
                Textarea::make('content')
                    ->label('Paragraph')
                    ->required(),
            ]),
        Block::make('image')
            ->schema([
                FileUpload::make('url')
                    ->label('Image')
                    ->image()
                    ->required(),
                TextInput::make('alt')
                    ->label('Alt text')
                    ->required(),
            ]),
    ])
```

![构建器](/assets/filament/v4.x/screenshots/images/light/forms/fields/builder/simple.jpg)

我们建议你在数据库中使用 `JSON` 列来存储构建器数据。此外，如果你使用 Eloquent，请确保该列具有 `array` 类型转换。

如上例所示，块可以在组件的 `blocks()` 方法中定义。块是 `Builder\Block` 对象，需要一个唯一的名称和一个组件 schema：

```php
use Filament\Forms\Components\Builder;
use Filament\Forms\Components\Builder\Block;
use Filament\Forms\Components\TextInput;

Builder::make('content')
    ->blocks([
        Block::make('heading')
            ->schema([
                TextInput::make('content')->required(),
                // ...
            ]),
        // ...
    ])
```

## 设置块的标签

默认情况下，块的标签会根据其名称自动确定。要覆盖块的标签，你可以使用 `label()` 方法。如果你想使用[本地化翻译字符串](https://laravel.com/docs/localization#retrieving-translation-strings)，这种方式自定义标签很有用：

```php
use Filament\Forms\Components\Builder\Block;

Block::make('heading')
    ->label(__('blocks.heading'))
```

### 根据内容为构建器项添加标签

你可以使用相同的 `label()` 方法为构建器项添加标签。该方法接受一个闭包，闭包通过 `$state` 变量接收项的数据。如果 `$state` 为 null，你应该返回在块选择器中显示的块标签。否则，你应该返回一个字符串作为项标签：

```php
use Filament\Forms\Components\Builder\Block;
use Filament\Forms\Components\TextInput;

Block::make('heading')
    ->schema([
        TextInput::make('content')
            ->live(onBlur: true)
            ->required(),
        // ...
    ])
    ->label(function (?array $state): string {
        if ($state === null) {
            return 'Heading';
        }

        return $state['content'] ?? 'Untitled heading';
    })
```

如果你希望在使用表单时实时看到项标签更新，你从 `$state` 中使用的任何字段都应该是 `live()` 的。

:::tip
你可以将各种工具注入到传递给 `label()` 的函数参数中。
:::

![根据内容标记的构建器](/assets/filament/v4.x/screenshots/images/light/forms/fields/builder/labelled.jpg)

### 为构建器项编号

默认情况下，构建器中的项在其标签旁边有一个编号。你可以使用 `blockNumbers(false)` 方法禁用此功能：

```php
use Filament\Forms\Components\Builder;

Builder::make('content')
    ->blocks([
        // ...
    ])
    ->blockNumbers(false)
```

:::tip
`blockNumbers()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

## 设置块的图标

块也可以有一个[图标](../styling/icons)，显示在标签旁边。你可以通过将图标名称传递给 `icon()` 方法来添加图标：

```php
use Filament\Forms\Components\Builder\Block;
use Filament\Support\Icons\Heroicon;

Block::make('paragraph')
    ->icon(Heroicon::Bars3BottomLeft)
```

:::tip
`icon()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

![下拉菜单中带有块图标的构建器](/assets/filament/v4.x/screenshots/images/light/forms/fields/builder/icons.jpg)

### 向块头部添加图标

默认情况下，构建器中的块在头部标签旁边没有图标，只有在添加新块的下拉菜单中才有。你可以使用 `blockIcons()` 方法启用此功能：

```php
use Filament\Forms\Components\Builder;

Builder::make('content')
    ->blocks([
        // ...
    ])
    ->blockIcons()
```

你也可以传递一个布尔值给 `blockIcons()` 方法来控制是否在块头部显示图标：

```php
use Filament\Forms\Components\Builder;

Builder::make('content')
    ->blocks([
        // ...
    ])
    ->blockIcons(FeatureFlag::active())
```

:::tip
`blockIcons()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

![块头部带有图标的构建器](/assets/filament/v4.x/screenshots/images/light/forms/fields/builder/block-icons.jpg)

## 预览块

如果你希望在构建器中渲染只读预览而不是块的表单，可以使用 `blockPreviews()` 方法。这将渲染每个块的 `preview()` 而不是表单。块数据将以同名变量传递给预览 Blade 视图：

```php
use Filament\Forms\Components\Builder;
use Filament\Forms\Components\Builder\Block;
use Filament\Forms\Components\TextInput;

Builder::make('content')
    ->blockPreviews()
    ->blocks([
        Block::make('heading')
            ->schema([
                TextInput::make('text')
                    ->placeholder('Default heading'),
            ])
            ->preview('filament.content.block-previews.heading'),
    ])
```

在 `/resources/views/filament/content/block-previews/heading.blade.php` 中，你可以这样访问块数据：

```blade
<h1>
    {{ $text ?? 'Default heading' }}
</h1>
```

`blockPreviews()` 方法也接受布尔值来控制构建器是否应该渲染块预览：

```php
use Filament\Forms\Components\Builder;

Builder::make('content')
    ->blocks([
        // ...
    ])
    ->blockPreviews(FeatureFlag::active())
```

:::tip
`blockPreviews()` 和 `preview()` 方法除了接受静态值外，还接受函数来动态计算。你可以将各种工具注入到函数参数中。
:::

![带有块预览的构建器](/assets/filament/v4.x/screenshots/images/light/forms/fields/builder/block-previews.jpg)

### 交互式块预览

默认情况下，预览内容不是交互式的，点击它将打开该块的编辑模态框来管理其设置。如果你希望在块预览中保持链接和按钮的交互性，可以使用 `blockPreviews()` 方法的 `areInteractive: true` 参数：

```php
use Filament\Forms\Components\Builder;

Builder::make('content')
    ->blockPreviews(areInteractive: true)
    ->blocks([
        //
    ])
```

:::tip
`areInteractive` 参数除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

## 添加项

构建器下方会显示一个操作按钮，允许用户添加新项。

## 设置添加操作按钮的标签

你可以使用 `addActionLabel()` 方法来自定义添加构建器项按钮中显示的文本：

```php
use Filament\Forms\Components\Builder;

Builder::make('content')
    ->blocks([
        // ...
    ])
    ->addActionLabel('Add a new block')
```

:::tip
`addActionLabel()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

### 对齐添加操作按钮

默认情况下，添加操作按钮居中对齐。你可以使用 `addActionAlignment()` 方法进行调整，传入 `Alignment::Start` 或 `Alignment::End` 作为 `Alignment` 选项：

```php
use Filament\Forms\Components\Builder;
use Filament\Support\Enums\Alignment;

Builder::make('content')
    ->schema([
        // ...
    ])
    ->addActionAlignment(Alignment::Start)
```

:::tip
`addActionAlignment()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

![添加操作按钮左对齐的构建器](/assets/filament/v4.x/screenshots/images/light/forms/fields/builder/add-action-alignment.jpg)

### 阻止用户添加项

你可以使用 `addable(false)` 方法阻止用户向构建器添加项：

```php
use Filament\Forms\Components\Builder;

Builder::make('content')
    ->blocks([
        // ...
    ])
    ->addable(false)
```

:::tip
`addable()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

## 删除项

每个项上会显示一个操作按钮，允许用户删除该项。

### 阻止用户删除项

你可以使用 `deletable(false)` 方法阻止用户从构建器中删除项：

```php
use Filament\Forms\Components\Builder;

Builder::make('content')
    ->blocks([
        // ...
    ])
    ->deletable(false)
```

:::tip
`deletable()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

## 重新排序项

每个项上会显示一个按钮，允许用户通过拖放在列表中重新排序。

### 阻止用户重新排序项

你可以使用 `reorderable(false)` 方法阻止用户重新排序构建器中的项：

```php
use Filament\Forms\Components\Builder;

Builder::make('content')
    ->blocks([
        // ...
    ])
    ->reorderable(false)
```

:::tip
`reorderable()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

### 使用按钮重新排序项

你可以使用 `reorderableWithButtons()` 方法启用通过按钮上下移动来重新排序项的功能：

```php
use Filament\Forms\Components\Builder;

Builder::make('content')
    ->blocks([
        // ...
    ])
    ->reorderableWithButtons()
```

![可通过按钮重新排序的构建器](/assets/filament/v4.x/screenshots/images/light/forms/fields/builder/reorderable-with-buttons.jpg)

你也可以传递一个布尔值来控制是否应该使用按钮排序：

```php
use Filament\Forms\Components\Builder;

Builder::make('content')
    ->blocks([
        // ...
    ])
    ->reorderableWithButtons(FeatureFlag::active())
```

:::tip
`reorderableWithButtons()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

### 阻止通过拖放重新排序

你可以使用 `reorderableWithDragAndDrop(false)` 方法阻止通过拖放来排序项：

```php
use Filament\Forms\Components\Builder;

Builder::make('content')
    ->blocks([
        // ...
    ])
    ->reorderableWithDragAndDrop(false)
```

:::tip
`reorderableWithDragAndDrop()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

## 折叠项

构建器可以设置为 `collapsible()` 以在长表单中可选地隐藏内容：

```php
use Filament\Forms\Components\Builder;

Builder::make('content')
    ->blocks([
        // ...
    ])
    ->collapsible()
```

![可折叠的构建器](/assets/filament/v4.x/screenshots/images/light/forms/fields/builder/collapsible.jpg)

你也可以默认折叠所有项：

```php
use Filament\Forms\Components\Builder;

Builder::make('content')
    ->blocks([
        // ...
    ])
    ->collapsed()
```

![已折叠的构建器](/assets/filament/v4.x/screenshots/images/light/forms/fields/builder/collapsed.jpg)

`collapsible()` 和 `collapsed()` 方法也接受布尔值来控制是否可折叠和是否折叠：

```php
use Filament\Forms\Components\Builder;

Builder::make('content')
    ->blocks([
        // ...
    ])
    ->collapsible(FeatureFlag::active())
    ->collapsed(FeatureFlag::active())
```

:::tip
`collapsible()` 和 `collapsed()` 方法除了接受静态值外，还接受函数来动态计算。你可以将各种工具注入到函数参数中。
:::

## 克隆项

你可以使用 `cloneable()` 方法允许构建器项被复制：

```php
use Filament\Forms\Components\Builder;

Builder::make('content')
    ->blocks([
        // ...
    ])
    ->cloneable()
```

![可克隆的构建器](/assets/filament/v4.x/screenshots/images/light/forms/fields/builder/cloneable.jpg)

## 自定义块选择器

### 更改块选择器中的列数

块选择器默认只有 1 列。你可以通过向 `blockPickerColumns()` 传递列数来自定义它：

```php
use Filament\Forms\Components\Builder;

Builder::make()
    ->blockPickerColumns(2)
    ->blocks([
        // ...
    ])
```

此方法可以通过几种不同的方式使用：

- 你可以传递一个整数，如 `blockPickerColumns(2)`。此整数是 `lg` 断点及更高断点上使用的列数。所有较小的设备将只有 1 列。
- 你可以传递一个数组，其中键是断点，值是列数。例如，`blockPickerColumns(['md' => 2, 'xl' => 4])` 将在中等设备上创建 2 列布局，在超大设备上创建 4 列布局。较小设备的默认断点使用 1 列，除非你使用 `default` 数组键。

断点（`sm`、`md`、`lg`、`xl`、`2xl`）由 Tailwind 定义，可以在 [Tailwind 文档](https://tailwindcss.com/docs/responsive-design#overview)中找到。

:::tip
`blockPickerColumns()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

![具有 2 列块选择器的构建器](/assets/filament/v4.x/screenshots/images/light/forms/fields/builder/block-picker-columns.jpg)

### 增加块选择器的宽度

当你[增加列数](#更改块选择器中的列数)时，下拉菜单的宽度应该逐步增加以适应额外的列。如果你想要更多控制，可以使用 `blockPickerWidth()` 方法手动设置下拉菜单的最大宽度。选项对应于 [Tailwind 的最大宽度比例](https://tailwindcss.com/docs/max-width)。选项有 `xs`、`sm`、`md`、`lg`、`xl`、`2xl`、`3xl`、`4xl`、`5xl`、`6xl`、`7xl`：

```php
use Filament\Forms\Components\Builder;

Builder::make()
    ->blockPickerColumns(3)
    ->blockPickerWidth('2xl')
    ->blocks([
        // ...
    ])
```

:::tip
`blockPickerWidth()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

## 限制块的使用次数

默认情况下，每个块在构建器中可以无限次使用。你可以使用块上的 `maxItems()` 方法来限制：

```php
use Filament\Forms\Components\Builder\Block;

Block::make('heading')
    ->schema([
        // ...
    ])
    ->maxItems(1)
```

:::tip
`maxItems()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

## 使用 `$get()` 访问父字段值

所有表单组件都可以[使用 `$get()` 和 `$set()`](overview#注入另一个字段的状态)来访问另一个字段的值。但是，在构建器的 schema 内部使用时，你可能会遇到意外行为。

这是因为 `$get()` 和 `$set()` 默认限定在当前构建器项的范围内。这意味着你可以轻松地与该构建器项中的另一个字段交互，而无需知道当前表单组件属于哪个构建器项。

这样做的结果是，当你无法与构建器外部的字段交互时可能会感到困惑。我们使用 `../` 语法来解决这个问题 - `$get('../parent_field_name')`。

假设你的表单有以下数据结构：

```php
[
    'client_id' => 1,

    'builder' => [
        'item1' => [
            'service_id' => 2,
        ],
    ],
]
```

你试图从构建器项内部获取 `client_id` 的值。

`$get()` 是相对于当前构建器项的，所以 `$get('client_id')` 查找的是 `$get('builder.item1.client_id')`。

你可以使用 `../` 在数据结构中上升一级，所以 `$get('../client_id')` 等于 `$get('builder.client_id')`，而 `$get('../../client_id')` 等于 `$get('client_id')`。

特殊情况：`$get()` 不传参数，或 `$get('')` 或 `$get('./')`，将始终返回当前构建器项的完整数据数组。

## 构建器验证

除了[验证](validation)页面上列出的所有规则外，还有一些特定于构建器的额外规则。

### 项数验证

你可以通过设置 `minItems()` 和 `maxItems()` 方法来验证构建器中可以拥有的最小和最大项数：

```php
use Filament\Forms\Components\Builder;

Builder::make('content')
    ->blocks([
        // ...
    ])
    ->minItems(1)
    ->maxItems(5)
```

:::tip
`minItems()` 和 `maxItems()` 方法除了接受静态值外，还接受函数来动态计算。你可以将各种工具注入到函数参数中。
:::

## 自定义构建器项操作

此字段使用操作对象来自定义其中的按钮。你可以通过向操作注册方法传递函数来自定义这些按钮。该函数可以访问 `$action` 对象，你可以使用它来[自定义操作](../actions/overview)。以下方法可用于自定义操作：

- `addAction()`
- `addBetweenAction()`
- `cloneAction()`
- `collapseAction()`
- `collapseAllAction()`
- `deleteAction()`
- `expandAction()`
- `expandAllAction()`
- `moveDownAction()`
- `moveUpAction()`
- `reorderAction()`

以下是自定义操作的示例：

```php
use Filament\Actions\Action;
use Filament\Forms\Components\Builder;

Builder::make('content')
    ->blocks([
        // ...
    ])
    ->collapseAllAction(
        fn (Action $action) => $action->label('Collapse all content'),
    )
```

:::tip
操作注册方法可以将各种工具注入到函数参数中。
:::

### 使用模态框确认构建器操作

你可以使用操作对象上的 `requiresConfirmation()` 方法通过模态框确认操作。你可以使用任何[模态框自定义方法](../actions/modals)来更改其内容和行为：

```php
use Filament\Actions\Action;
use Filament\Forms\Components\Builder;

Builder::make('content')
    ->blocks([
        // ...
    ])
    ->deleteAction(
        fn (Action $action) => $action->requiresConfirmation(),
    )
```

:::info
`addAction()`、`addBetweenAction()`、`collapseAction()`、`collapseAllAction()`、`expandAction()`、`expandAllAction()` 和 `reorderAction()` 方法不支持确认模态框，因为点击它们的按钮不会发起显示模态框所需的网络请求。
:::

### 向构建器添加额外的项操作

你可以通过将 `Action` 对象传递给 `extraItemActions()` 来向每个构建器项的头部添加新的[操作按钮](../actions/overview)：

```php
use Filament\Actions\Action;
use Filament\Forms\Components\Builder;
use Filament\Forms\Components\Builder\Block;
use Filament\Forms\Components\TextInput;
use Filament\Support\Icons\Heroicon;
use Illuminate\Support\Facades\Mail;

Builder::make('content')
    ->blocks([
        Block::make('contactDetails')
            ->schema([
                TextInput::make('email')
                    ->label('Email address')
                    ->email()
                    ->required(),
                // ...
            ]),
        // ...
    ])
    ->extraItemActions([
        Action::make('sendEmail')
            ->icon(Heroicon::Square2Stack)
            ->action(function (array $arguments, Builder $component): void {
                $itemData = $component->getItemState($arguments['item']);

                Mail::to($itemData['email'])
                    ->send(
                        // ...
                    );
            }),
    ])
```

在此示例中，`$arguments['item']` 给出当前构建器项的 ID。你可以使用构建器组件上的 `getItemState()` 方法验证该构建器项中的数据。此方法返回该项的已验证数据。如果该项无效，它将取消操作并在表单中显示该项目的错误消息。

如果你想在不验证的情况下获取当前项的原始数据，可以改用 `$component->getRawItemState($arguments['item'])`。

如果你想操作整个构建器的原始数据，例如添加、删除或修改项，可以使用 `$component->getState()` 获取数据，使用 `$component->state($state)` 再次设置：

```php
use Illuminate\Support\Str;

// 获取整个构建器的原始数据
$state = $component->getState();

// 添加一个项，使用随机 UUID 作为键
$state[Str::uuid()] = [
    'type' => 'contactDetails',
    'data' => [
        'email' => auth()->user()->email,
    ],
];

// 设置构建器的新数据
$component->state($state);
```
