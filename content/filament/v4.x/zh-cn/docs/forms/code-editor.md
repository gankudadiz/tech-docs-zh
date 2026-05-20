---
title: 代码编辑器
---

## 简介

代码编辑器组件允许你在带有行号的文本域中编写代码。默认情况下，不应用语法高亮。

```php
use Filament\Forms\Components\CodeEditor;

CodeEditor::make('code')
```

![代码编辑器](/assets/filament/v4.x/screenshots/images/light/forms/fields/code-editor/simple.jpg)

## 使用语言语法高亮

你可以使用 `language()` 方法更改代码编辑器的语言语法高亮。编辑器支持以下语言：

- C++
- CSS
- Go
- HTML
- Java
- JavaScript
- JSON
- Markdown
- PHP
- Python
- SQL
- XML
- YAML

你可以打开 `Filament\Forms\Components\CodeEditor\Enums\Language` 枚举类查看此列表。要切换到使用 JavaScript 语法高亮，可以使用 `Language::JavaScript` 枚举值：

```php
use Filament\Forms\Components\CodeEditor;
use Filament\Forms\Components\CodeEditor\Enums\Language;

CodeEditor::make('code')
    ->language(Language::JavaScript)
```

:::tip
`language()` 方法除了接受静态值外，还接受一个函数来动态计算。你可以将各种工具注入到函数参数中。
:::

![带语法高亮的代码编辑器](/assets/filament/v4.x/screenshots/images/light/forms/fields/code-editor/language.jpg)

## 允许行换行

默认情况下，代码编辑器中的长行会创建水平滚动条。如果你想允许长行换行，可以使用 `wrap()` 方法：

```php
use Filament\Forms\Components\CodeEditor;

CodeEditor::make('code')
    ->wrap()
```

![带行换行的代码编辑器](/assets/filament/v4.x/screenshots/images/light/forms/fields/code-editor/wrap.jpg)
