---
title: Markdown 编辑器
---

## 简介

Markdown 编辑器允许你编辑和预览 Markdown 内容，还可以通过拖放方式上传图片。

```php
use Filament\Forms\Components\MarkdownEditor;

MarkdownEditor::make('content')
```

![Markdown 编辑器](/assets/filament/v4.x/screenshots/images/light/forms/fields/markdown-editor/simple.jpg)

## 安全性

默认情况下，编辑器输出原始的 Markdown 和 HTML，并将其发送到后端。攻击者可以拦截组件的值并向后端发送不同的原始 HTML 字符串。因此，在输出 Markdown 编辑器生成的 HTML 时，务必进行清理消毒；否则你的网站可能会面临跨站脚本攻击（XSS）漏洞。

当 Filament 在 `TextColumn` 和 `TextEntry` 等组件中输出数据库中的原始 HTML 时，会自动进行清理以移除任何危险的 JavaScript。但是，如果你在自己的 Blade 视图中输出 Markdown 编辑器的 HTML，则需要自行负责清理工作。一个选择是使用 Filament 的 `sanitizeHtml()` 辅助函数来完成此操作，这也是我们在上述组件中用于清理 HTML 的相同工具：

```blade
{!! str($record->content)->markdown()->sanitizeHtml() !!}
```

:::danger
Filament 内置的 HTML 清理器允许内联 `style` 属性，以支持富文本格式化功能，如字体颜色、文本高亮和图片尺寸调整。这意味着 `background: url(...)` 或 `position: fixed` 等 CSS 属性不会从清理后的 HTML 中被移除。如果你的内容来自不受信任的用户，应考虑限制默认配置。有关如何自定义清理器的详细信息，请参阅[安全文档](../advanced/security#customizing-the-sanitizer)。
:::

## 自定义工具栏按钮

你可以使用 `toolbarButtons()` 方法设置编辑器的工具栏按钮。以下展示的是默认选项：

```php
use Filament\Forms\Components\MarkdownEditor;

MarkdownEditor::make('content')
    ->toolbarButtons([
        ['bold', 'italic', 'strike', 'link'],
        ['heading'],
        ['blockquote', 'codeBlock', 'bulletList', 'orderedList'],
        ['table', 'attachFiles'],
        ['undo', 'redo'],
    ])
```

主数组中的每个嵌套数组代表工具栏中的一组按钮。

:::tip
除了静态值之外，`toolbarButtons()` 方法也接受一个函数来动态计算值。你可以将各种工具函数作为参数注入到该函数中。
:::

![带有自定义工具栏按钮的 Markdown 编辑器](/assets/filament/v4.x/screenshots/images/light/forms/fields/markdown-editor/custom-toolbar.jpg)

## 上传图片到编辑器

图片可以上传到编辑器中。它们将始终上传到具有公开存储权限的公开可访问 URL，因为静态内容中不支持生成临时文件上传 URL。你可以使用配置方法自定义图片的上传位置：

```php
use Filament\Forms\Components\MarkdownEditor;

MarkdownEditor::make('content')
    ->fileAttachmentsDisk('s3')
    ->fileAttachmentsDirectory('attachments')
```

:::tip
除了静态值之外，`fileAttachmentsDisk()` 和 `fileAttachmentsDirectory()` 方法也接受函数来动态计算值。你可以将各种工具函数作为参数注入到该函数中。
:::

### 验证上传的图片

你可以使用 `fileAttachmentsAcceptedFileTypes()` 方法来控制上传图片所接受的 MIME 类型列表。默认接受 `image/png`、`image/jpeg`、`image/gif` 和 `image/webp`：

```php
use Filament\Forms\Components\MarkdownEditor;

MarkdownEditor::make('content')
    ->fileAttachmentsAcceptedFileTypes(['image/png', 'image/jpeg'])
```

你可以使用 `fileAttachmentsMaxSize()` 方法来控制上传图片的最大文件大小。大小以千字节为单位指定。默认最大大小为 12288 KB（12 MB）：

```php
use Filament\Forms\Components\MarkdownEditor;

MarkdownEditor::make('content')
    ->fileAttachmentsMaxSize(5120) // 5 MB
```
