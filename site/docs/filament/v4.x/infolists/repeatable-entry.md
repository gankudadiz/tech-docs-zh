---
title: 可重复条目
---

## 简介

可重复条目允许你为数组或关联中的项目重复一组条目和布局组件。

```php
use Filament\Infolists\Components\RepeatableEntry;
use Filament\Infolists\Components\TextEntry;

RepeatableEntry::make('comments')
    ->schema([
        TextEntry::make('author.name'),
        TextEntry::make('title'),
        TextEntry::make('content')
            ->columnSpan(2),
    ])
    ->columns(2)
```

如你所见，可重复条目有一个嵌入的 `schema()`，它会为每个项目重复。

例如，此条目的状态可能表示为：

```php
[
    [
        'author' => ['name' => 'Jane Doe'],
        'title' => 'Wow!',
        'content' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl.',
    ],
    [
        'author' => ['name' => 'John Doe'],
        'title' => 'This isn\'t working. Help!',
        'content' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl.',
    ],
]
```

![可重复条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/repeatable/simple.jpg)

或者，`comments` 和 `author` 可以是 Eloquent 关联，`title` 和 `content` 可以是评论模型上的属性，`name` 可以是作者模型上的属性。Filament 将自动处理关联加载并以相同方式显示数据。

## 网格布局

你可以使用 `grid()` 方法将可重复项目组织成列：

```php
use Filament\Infolists\Components\RepeatableEntry;

RepeatableEntry::make('comments')
    ->schema([
        // ...
    ])
    ->grid(2)
```

此方法接受与[网格](../schemas/layouts#网格系统)的 `columns()` 方法相同的选项。这允许你在各种断点处响应式地自定义网格列数。

除了允许静态值外，`grid()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。

![网格布局中的可重复条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/repeatable/grid.jpg)

## 移除样式容器

默认情况下，可重复条目中的每个项目都包装在样式为卡片的容器中。你可以使用 `contained()` 移除样式容器：

```php
use Filament\Infolists\Components\RepeatableEntry;

RepeatableEntry::make('comments')
    ->schema([
        // ...
    ])
    ->contained(false)
```

除了允许静态值外，`contained()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。

![没有样式容器的可重复条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/repeatable/contained-false.jpg)

## 表格可重复布局

你可以使用 `table()` 方法以表格格式呈现可重复项目，该方法接受 `TableColumn` 对象数组。这些对象代表表格的列，对应于条目 schema 中的任何组件：

```php
use Filament\Infolists\Components\IconEntry;
use Filament\Infolists\Components\RepeatableEntry;
use Filament\Infolists\Components\RepeatableEntry\TableColumn;
use Filament\Infolists\Components\TextEntry;

RepeatableEntry::make('comments')
    ->table([
        TableColumn::make('Author'),
        TableColumn::make('Title'),
        TableColumn::make('Published'),
    ])
    ->schema([
        TextEntry::make('author.name'),
        TextEntry::make('title'),
        IconEntry::make('is_published')
            ->boolean(),
    ])
```

![带有表格布局的可重复条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/repeatable/table.jpg)

表头中显示的标签传递给 `TableColumn::make()` 方法。如果你想为列提供可访问的标签但不想显示它，可以使用 `hiddenHeaderLabel()` 方法：

```php
use Filament\Infolists\Components\RepeatableEntry\TableColumn;

TableColumn::make('Name')
    ->hiddenHeaderLabel()
```

你可以使用 `wrapHeader()` 方法启用列标题换行：

```php
use Filament\Infolists\Components\RepeatableEntry\TableColumn;

TableColumn::make('Name')
    ->wrapHeader()
```

你还可以使用 `alignment()` 方法调整列标题的对齐方式，传递 `Alignment::Start`、`Alignment::Center` 或 `Alignment::End` 的 `Alignment` 选项：

```php
use Filament\Infolists\Components\RepeatableEntry\TableColumn;
use Filament\Support\Enums\Alignment;

TableColumn::make('Name')
    ->alignment(Alignment::Center)
```

你可以使用 `width()` 方法设置固定的列宽度，传递表示列宽度的字符串值。此值直接传递给列标题的 `style` 属性：

```php
use Filament\Infolists\Components\RepeatableEntry\TableColumn;

TableColumn::make('Name')
    ->width('200px')
```
