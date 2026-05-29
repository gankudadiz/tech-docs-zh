---
title: Schema
---

## 简介

Schema 构成了 Filament 服务端驱动 UI 方法的基础。它们允许你使用 PHP 配置对象以声明方式构建用户界面。这些配置对象代表定义 UI 结构和行为的组件，例如表单、表格或列表。你无需手动编写 HTML 或 JavaScript，而是创建这些 schema 来控制服务器上渲染的内容，从而简化开发并确保应用的一致性。

Schema 在 Filament 中被广泛用于动态渲染 UI 元素。无论你是在定义表单字段、页面布局还是操作按钮，schema 对象都定义了组件的配置及其与数据的交互方式。本质上，schema 是 Filament UI 的构建块。

Filament 包为你提供了各种组件。你可以在[可用组件部分](#可用组件)找到完整列表：

- [表单字段](../forms/overview)接受用户的输入，例如文本输入、选择框或复选框。它们带有集成验证。
- [信息列表条目](../infolists/overview)是用于渲染"描述列表"的组件。条目是键值 UI 元素，可以呈现只读信息，如文本、图标和图像。信息列表的数据可以来自任何地方，但通常来自单个 Eloquent 记录。
- [布局组件](layouts)用于组织组件。例如，网格、标签页或多步表单向导。
- [基础组件](primes)是用于渲染基本独立静态内容的简单组件，如文本、图像和按钮（操作）。

Schema 作为许多组件的容器，你可以在其中添加任意组合的组件。组件还可以在其中嵌套子 schema，允许无限层级的嵌套。

Schema 由 `Filament\Schemas\Schema` 对象表示，你可以在 `components()` 方法中传递一个组件数组给它。

## 可用组件

为了构建[表单](../forms/overview)，Filament 包含了一组用于不同数据类型的字段：

- [文本输入](../forms/text-input)
- [选择框](../forms/select)
- [复选框](../forms/checkbox)
- [开关](../forms/toggle)
- [复选框列表](../forms/checkbox-list)
- [单选按钮](../forms/radio)
- [日期时间选择器](../forms/date-time-picker)
- [文件上传](../forms/file-upload)
- [富文本编辑器](../forms/rich-editor)
- [Markdown 编辑器](../forms/markdown-editor)
- [重复器](../forms/repeater)
- [构建器](../forms/builder)
- [标签输入](../forms/tags-input)
- [文本域](../forms/textarea)
- [键值对](../forms/key-value)
- [颜色选择器](../forms/color-picker)
- [切换按钮](../forms/toggle-buttons)
- [滑块](../forms/slider)
- [代码编辑器](../forms/code-editor)
- [隐藏字段](../forms/hidden)
- 或者，构建你自己的[自定义表单字段](../forms/custom-fields)

为了以标签-值的"描述列表"格式显示数据，Filament 包含了[信息列表](../infolists/overview)条目组件：

- [文本条目](../infolists/text-entry)
- [图标条目](../infolists/icon-entry)
- [图像条目](../infolists/image-entry)
- [颜色条目](../infolists/color-entry)
- [代码条目](../infolists/code-entry)
- [键值对条目](../infolists/key-value-entry)
- [可重复条目](../infolists/repeatable-entry)
- 或者，构建你自己的[自定义信息列表条目](../infolists/custom-entries)

为了将组件组织成[布局](layouts)，Filament 包含了布局组件：

- [网格](layouts#网格组件)
- [弹性布局](layouts#弹性布局组件)
- [字段集](layouts#字段集组件)
- [区块](sections)
- [标签页](tabs)
- [向导](wizards)
- [提示框](callouts)
- [空状态](empty-states)
- 或者，构建你自己的[自定义布局组件](custom-components#自定义组件类)

为了显示任意内容，Filament 包含了[基础](primes)组件：

- [文本](primes#文本组件)
- [图标](primes#图标组件)
- [图像](primes#图像组件)
- [无序列表](primes#无序列表组件)

你还可以在 schema 中插入"操作"按钮。这些按钮可以运行 PHP 函数，甚至可以打开模态框。更多信息，请参阅[操作文档](../actions/overview)。

你可以在[自定义组件文档](custom-components)中了解更多关于构建自定义组件来渲染自己的 Blade 视图的信息。

## Schema 示例

例如，你可能想要构建一个带有 schema 的表单。Schema 的名称通常由定义它的方法名称决定（在此示例中为 `form`）。Filament 创建 `Schema` 对象并将其传递给该方法，然后该方法返回添加了组件的 schema：

```php
use Filament\Forms\Components\Checkbox;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;

$schema
    ->components([
        Grid::make(2)
            ->schema([
                Section::make('详情')
                    ->schema([
                        TextInput::make('name'),
                        Select::make('position')
                            ->options([
                                'developer' => '开发者',
                                'designer' => '设计师',
                            ]),
                        Checkbox::make('is_admin'),
                    ]),
                Section::make('审计')
                    ->schema([
                        TextEntry::make('created_at')
                            ->dateTime(),
                        TextEntry::make('updated_at')
                            ->dateTime(),
                    ]),
            ]),
    ])
```

![Schema 示例](/assets/filament/v4.x/screenshots/images/light/schemas/overview/example.jpg)

[网格](layouts#网格组件)是一个布局组件，它将多个组件一起渲染在响应式网格中。网格中的列数在 `make()` 方法中指定。`schema()` 方法用于在网格内嵌套组件。

[区块](sections)是另一个布局组件，它将多个组件一起渲染在卡片中，顶部有标题。

[TextInput](../forms/text-input)、[Select](../forms/select) 和 [Checkbox](../forms/checkbox) 是接受用户输入的表单组件。

[TextEntry](../infolists/text-entry) 是一个信息列表组件，用于显示只读信息。在此示例中，它用于显示记录的创建和更新时间戳。`dateTime()` 方法用于将时间戳格式化为日期和时间。

Schema 对象是组件的容器，现在可以被渲染了。渲染 schema 将以正确的布局渲染其中的所有组件。

## 组件实用工具注入

用于配置条目的绝大多数方法都接受函数作为参数，而不是硬编码的值：

```php
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;

Grid::make(fn (): array => [
    'lg' => auth()->user()->isAdmin() ? 4 : 6,
])->schema([
    // ...
])

Section::make()
    ->heading(fn (): string => auth()->user()->isAdmin() ? '管理后台' : '用户面板')
    ->schema([
        // ...
    ])
```

这本身就解锁了许多自定义可能性。

该包还能够将许多实用工具注入到这些函数中作为参数使用。所有接受函数作为参数的自定义方法都可以注入实用工具。

这些注入的实用工具需要使用特定的参数名称。否则，Filament 不知道要注入什么。

### 注入另一个组件的状态

你也可以使用 `$get` 参数从回调中检索表单字段或信息列表条目的状态（值）：

```php
use Filament\Schemas\Components\Utilities\Get;

function (Get $get) {
    $email = $get('email'); // 将 `email` 条目的值存储在 `$email` 变量中。
    //...
}
```

:::tip
除非表单字段是[响应式的](../forms/overview#响应式基础)，否则当字段值更改时，schema 不会刷新，只有在下一次用户交互导致向服务器发送请求时才会刷新。如果你需要对字段值的更改做出反应，它应该是 `live()` 的。
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

如果你正在为面板资源或关系管理器编写 schema，并且希望检查 schema 是 `create`、`edit` 还是 `view`，请使用 `$operation` 参数：

```php
function (string $operation) {
    // ...
}
```

:::info
你可以使用 `$schema->operation()` 方法手动设置 schema 的操作。
:::

### 注入当前 Livewire 组件实例

如果你希望访问当前 Livewire 组件实例，请定义 `$livewire` 参数：

```php
use Livewire\Component;

function (Component $livewire) {
    // ...
}
```

### 注入当前组件实例

如果你希望访问当前组件实例，请定义 `$component` 参数：

```php
use Filament\Schemas\Components\Component;

function (Component $component) {
    // ...
}
```

### 注入多个实用工具

参数是使用反射动态注入的，因此你可以按任意顺序组合多个参数：

```php
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Components\Utilities\Set;
use Livewire\Component as Livewire;

function (Livewire $livewire, Get $get, Set $set) {
    // ...
}
```

### 从 Laravel 容器注入依赖

你可以像往常一样从 Laravel 容器注入任何内容，与实用工具一起：

```php
use Filament\Schemas\Components\Utilities\Set;
use Illuminate\Http\Request;

function (Request $request, Set $set) {
    // ...
}
```

## 全局设置

如果你希望全局更改组件的默认行为，可以在服务提供者的 `boot()` 方法中调用静态 `configureUsing()` 方法，传递一个闭包来修改组件。例如，如果你希望所有区块组件默认具有 [2 列](sections#在区块中使用网格列)，可以这样做：

```php
use Filament\Schemas\Components\Section;

Section::configureUsing(function (Section $section): void {
    $section
        ->columns(2);
});
```

当然，你仍然可以在每个组件上单独覆盖此设置：

```php
use Filament\Schemas\Components\Section;

Section::make()
    ->columns(1)
```
