---
title: 富文本编辑器
---

## 简介

富文本编辑器允许你编辑和预览 HTML 内容，以及上传图片。它使用 [TipTap](https://tiptap.dev) 作为底层编辑器。

```php
use Filament\Forms\Components\RichEditor;

RichEditor::make('content')
```

![富文本编辑器](/assets/filament/v4.x/screenshots/images/light/forms/fields/rich-editor/simple.jpg)

## 以 JSON 格式存储内容

默认情况下，富文本编辑器以 HTML 格式存储内容。如果你想以 JSON 格式存储内容，可以使用 `json()` 方法：

```php
use Filament\Forms\Components\RichEditor;

RichEditor::make('content')
    ->json()
```

JSON 使用 [TipTap](https://tiptap.dev) 的格式，这是内容的结构化表示。

如果你使用 Eloquent 保存 JSON 内容，应确保为模型属性添加 `array` [类型转换](https://laravel.com/docs/eloquent-mutators#array-and-json-casting)：

```php
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'content' => 'array',
        ];
    }

    // ...
}
```

## 自定义工具栏按钮

你可以使用 `toolbarButtons()` 方法设置编辑器的工具栏按钮。此处展示的是默认选项：

```php
use Filament\Forms\Components\RichEditor;

RichEditor::make('content')
    ->toolbarButtons([
        ['bold', 'italic', 'underline', 'strike', 'subscript', 'superscript', 'link'],
        ['h2', 'h3'],
        ['alignStart', 'alignCenter', 'alignEnd'],
        ['blockquote', 'codeBlock', 'bulletList', 'orderedList'],
        ['table', 'attachFiles'], // 如果使用了 `customBlocks` 和 `mergeTags` 功能，它们也会被添加到这里。
        ['undo', 'redo'],
    ])
```

主数组中的每个嵌套数组代表工具栏中的一组按钮。

![自定义工具栏按钮的富文本编辑器](/assets/filament/v4.x/screenshots/images/light/forms/fields/rich-editor/custom-toolbar.jpg)

工具栏中可用的其他工具包括：

- `h1` - 对文本应用 "h1" 标签。
- `h4` - 对文本应用 "h4" 标签。
- `h5` - 对文本应用 "h5" 标签。
- `h6` - 对文本应用 "h6" 标签。
- `alignJustify` - 对文本进行两端对齐。
- `clearFormatting` - 清除所选文本的所有格式。
- `details` - 插入一个 `<details>` 标签，允许用户在内容中创建可折叠部分。
- `grid` - 在编辑器中插入网格布局，允许用户创建响应式列内容。
- `gridDelete` - 删除当前网格布局。
- `highlight` - 使用 `<mark>` 标签高亮所选文本。
- `horizontalRule` - 插入水平分隔线。
- `lead` - 对文本应用 `lead` 类，通常用于文章的第一段。
- `paragraph` - 将当前块设为段落，移除任何标题格式。
- `small` - 对文本应用 `<small>` 标签，通常用于小字或免责声明。
- `code` - 将所选文本格式化为行内代码。
- `textColor` - 更改所选文本的[文字颜色](#自定义文字颜色)。
- `table` - 在编辑器中创建表格，默认布局为 3 列 2 行，第一行配置为表头行。
- `tableAddColumnBefore` - 在当前列之前添加新列。
- `tableAddColumnAfter` - 在当前列之后添加新列。
- `tableDeleteColumn` - 删除当前列。
- `tableAddRowBefore` - 在当前行上方添加新行。
- `tableAddRowAfter` - 在当前行下方添加新行。
- `tableDeleteRow` - 删除当前行。
- `tableMergeCells` - 将所选单元格合并为一个单元格。
- `tableSplitCell` - 将所选单元格拆分为多个单元格。
- `tableToggleHeaderRow` - 切换表格的表头行。
- `tableToggleHeaderCell` - 切换表格的表头单元格。
- `tableDelete` - 删除表格。

:::tip
除了允许静态值之外，`toolbarButtons()` 方法也接受一个函数来动态计算值。你可以将各种工具注入到函数中作为参数。
:::

### 自定义浮动工具栏

如果工具栏太拥挤，你可以使用浮动工具栏，仅在用户位于特定节点类型内部时，在光标下方显示某些工具。这使你可以在保持主工具栏简洁的同时，在需要时提供对额外工具的访问。

你可以使用 `floatingToolbars()` 方法自定义光标位于特定节点内时出现的浮动工具栏。

在下面的示例中，当光标位于段落节点内时会出现浮动工具栏，显示加粗、斜体等按钮。当光标位于标题节点内时，显示标题相关的按钮；当位于表格内时，显示表格专用控件。

```php
use Filament\Forms\Components\RichEditor;

RichEditor::make('content')
    ->floatingToolbars([
        'paragraph' => [
            'bold', 'italic', 'underline', 'strike', 'subscript', 'superscript',
        ],
        'heading' => [
            'h1', 'h2', 'h3',
        ],
        'table' => [
            'tableAddColumnBefore', 'tableAddColumnAfter', 'tableDeleteColumn',
            'tableAddRowBefore', 'tableAddRowAfter', 'tableDeleteRow',
            'tableMergeCells', 'tableSplitCell',
            'tableToggleHeaderRow', 'tableToggleHeaderCell',
            'tableDelete',
        ],
    ])
```

![带浮动工具栏的富文本编辑器，浮动工具栏在选中文本下方](/assets/filament/v4.x/screenshots/images/light/forms/fields/rich-editor/floating-toolbar.jpg)

### 将工具栏按钮分组为下拉菜单

你可以使用 `ToolbarButtonGroup` 将相关的工具栏按钮分组到下拉菜单中。第一个参数是用于下拉菜单工具提示和无障碍访问的标签，第二个参数是要包含在下拉菜单中的按钮名称数组：

```php
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\RichEditor\ToolbarButtonGroup;

RichEditor::make('content')
    ->toolbarButtons([
        ['bold', 'italic', 'underline', 'strike'],
        [ToolbarButtonGroup::make('Paragraph', ['paragraph', 'h1', 'h2', 'h3'])],
        [ToolbarButtonGroup::make('Alignment', ['alignStart', 'alignCenter', 'alignEnd', 'alignJustify'])],
        ['blockquote', 'codeBlock', 'bulletList', 'orderedList'],
        ['undo', 'redo'],
    ])
```

默认情况下，第一个按钮的图标用作下拉菜单的触发器，并且会响应式地更新以反映当前活动的按钮。点击触发器会显示分组的按钮。

你可以使用 `icon()` 方法为下拉菜单触发器设置固定图标。设置了自定义图标后，触发器图标将保持静态，不会根据活动按钮而变化：

```php
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\RichEditor\ToolbarButtonGroup;

RichEditor::make('content')
    ->toolbarButtons([
        ['bold', 'italic', 'underline', 'strike'],
        [ToolbarButtonGroup::make('Heading', ['h1', 'h2', 'h3'])->icon('fi-o-heading')],
        [ToolbarButtonGroup::make('Alignment', ['alignStart', 'alignCenter', 'alignEnd', 'alignJustify'])],
        ['blockquote', 'codeBlock', 'bulletList', 'orderedList'],
        ['undo', 'redo'],
    ])
```

![打开工具栏按钮分组下拉菜单的富文本编辑器](/assets/filament/v4.x/screenshots/images/light/forms/fields/rich-editor/toolbar-button-group-open.jpg)

### 使用文字下拉工具栏按钮

默认情况下，下拉工具栏按钮仅显示图标。如果你想在下拉菜单项中同时显示文字标签和图标，可以在 `ToolbarButtonGroup` 上使用 `textualButtons()` 方法：

```php
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\RichEditor\ToolbarButtonGroup;

RichEditor::make('content')
    ->toolbarButtons([
        ['bold', 'italic', 'underline', 'strike', 'link'],
        [ToolbarButtonGroup::make('Paragraph', ['paragraph', 'h1', 'h2', 'h3'])->textualButtons()],
        [ToolbarButtonGroup::make('Alignment', ['alignStart', 'alignCenter', 'alignEnd', 'alignJustify'])],
        ['blockquote', 'codeBlock', 'bulletList', 'orderedList'],
        ['undo', 'redo'],
    ])
```

![打开文字工具栏按钮分组下拉菜单的富文本编辑器](/assets/filament/v4.x/screenshots/images/light/forms/fields/rich-editor/textual-toolbar-button-group-open.jpg)

在此示例中，`Paragraph` 下拉菜单项会显示图标和文字标签（例如 "Paragraph"、"Heading 1"）。`Alignment` 下拉菜单仍然只显示图标。

## 自定义文字颜色

富文本编辑器包含一个用于设置行内文本样式文字颜色工具。默认情况下，它使用 [Tailwind CSS 调色板](https://tailwindcss.com/docs/colors)。在浅色模式下使用 600 色阶，在深色模式下使用 400 色阶。

你可以使用 `textColors()` 方法自定义选择器中可用的颜色：

```php
use Filament\Forms\Components\RichEditor;

RichEditor::make('content')
    ->textColors([
        '#ef4444' => 'Red',
        '#10b981' => 'Green',
        '#0ea5e9' => 'Sky',
    ])
```

![富文本编辑器文字颜色选择器弹窗](/assets/filament/v4.x/screenshots/images/light/forms/fields/rich-editor/text-colors.jpg)

如果你想为浅色和深色模式定义不同的颜色，可以使用 `TextColor` 对象来定义颜色：

```php
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\RichEditor\TextColor;

RichEditor::make('content')
    ->textColors([
        'brand' => TextColor::make('Brand', '#0ea5e9'),
        'warning' => TextColor::make('Warning', '#f59e0b', darkColor: '#fbbf24'),
    ])
```

如果你想在现有 Tailwind 调色板的基础上添加新颜色，可以将你的颜色合并到 `TextColor::getDefaults()` 数组中：

```php
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\RichEditor\TextColor;

RichEditor::make('content')
    ->textColors([
        'brand' => TextColor::make('Brand', '#0ea5e9'),
        'warning' => TextColor::make('Warning', '#f59e0b', darkColor: '#fbbf24'),
        ...TextColor::getDefaults(),
    ])
```

当你使用 `TextColor` 对象时，数组的键会作为存储在 `<span>` 标签上的 `data-color` 属性，允许你在 CSS 中引用该颜色。当你直接使用颜色值作为数组值时，实际的颜色值（例如十六进制字符串）会被存储为 `data-color` 属性。

你还可以将 `textColors()` 传递给[内容渲染器](#渲染富文本内容)和[富文本内容属性](#注册富文本内容属性)，以便服务端渲染与编辑器配置保持一致。

你还可以使用 `customTextColors()` 方法允许用户选择预定义列表之外的自定义颜色：

```php
use Filament\Forms\Components\RichEditor;

RichEditor::make('content')
    ->textColors([
        // ...
    ])
    ->customTextColors()
```

你不需要在[内容渲染器](#渲染富文本内容)上使用 `customTextColors()`，因为它会自动渲染内容中使用的任何自定义颜色。

## 渲染富文本内容

如果你[以 JSON 格式存储内容](#以-json-格式存储内容)而不是 HTML，或者你的内容需要处理以注入[私有图片 URL](#在编辑器中使用私有图片)等，你需要使用 Filament 的 `RichContentRenderer` 工具来输出 HTML：

```php
use Filament\Forms\Components\RichEditor\RichContentRenderer;

RichContentRenderer::make($record->content)->toHtml()
```

`toHtml()` 方法返回一个字符串。如果你想在 Blade 视图中输出 HTML 而不进行转义，可以直接回显 `RichContentRenderer` 对象而无需调用 `toHtml()`：

```blade
{{ \Filament\Forms\Components\RichEditor\RichContentRenderer::make($record->content) }}
```

如果你已配置编辑器的[文件附件功能](#向编辑器上传图片)以更改上传文件的磁盘或可见性，你还必须将这些设置传递给渲染器以确保生成正确的 URL：

```php
use Filament\Forms\Components\RichEditor\RichContentRenderer;

RichContentRenderer::make($record->content)
    ->fileAttachmentsDisk('s3')
    ->fileAttachmentsVisibility('private')
    ->toHtml()
```

如果你在富文本编辑器中使用了[自定义块](#使用自定义块)，可以将自定义块数组传递给渲染器以确保它们被正确渲染：

```php
use Filament\Forms\Components\RichEditor\RichContentRenderer;

RichContentRenderer::make($record->content)
    ->customBlocks([
        HeroBlock::class => [
            'categoryUrl' => $record->category->getUrl(),
        ],
        CallToActionBlock::class,
    ])
    ->toHtml()
```

如果你使用了[合并标签](#使用合并标签)，可以传递一个值数组来替换合并标签：

```php
use Filament\Forms\Components\RichEditor\RichContentRenderer;

RichContentRenderer::make($record->content)
    ->mergeTags([
        'name' => $record->user->name,
        'today' => now()->toFormattedDateString(),
    ])
    ->toHtml()
```

如果你使用了[自定义文字颜色](#自定义文字颜色)，可以将颜色数组传递给渲染器以确保颜色被正确渲染：

```php
use Filament\Forms\Components\RichEditor\RichContentRenderer;
use Filament\Forms\Components\RichEditor\TextColor;

RichContentRenderer::make($record->content)
    ->textColors([
        'brand' => TextColor::make('Brand', '#0ea5e9', darkColor: '#38bdf8'),
    ])
    ->toHtml();
```

### 为渲染内容添加样式

富文本编辑器的 HTML 使用 HTML 元素、CSS 类和行内样式的组合来设置内容样式，具体取决于编辑器中使用的功能。如果你在 Filament 表格列或信息列表条目中使用 `prose()` 渲染内容，Filament 会自动为你应用必要的样式。如果你在自己的 Blade 视图中输出内容，可能需要添加一些额外的样式以确保内容样式正确。

一种为内容添加样式的方式是使用 [Tailwind CSS Typography](https://tailwindcss.com/docs/typography-plugin)。该插件为常见的 HTML 元素（如标题、段落、列表和表格）提供了一组预定义样式。你可以使用 `prose` 类将这些样式应用到容器元素上：

```blade
<div class="prose dark:prose-invert">
    {!! \Filament\Forms\Components\RichEditor\RichContentRenderer::make($record->content) !!}
</div>
```

然而，某些功能（如网格布局和文字颜色）需要 Tailwind CSS Typography 插件未包含的额外样式。Filament 还包含自己的 `fi-prose` CSS 类，该类添加了这些额外样式。任何加载了 Filament 的 `vendor/filament/support/resources/css/index.css` 的应用都可以使用这个类。其样式与 `prose` 类不同，但更适合 Filament 的设计系统：

```blade
<div class="fi-prose">
    {!! \Filament\Forms\Components\RichEditor\RichContentRenderer::make($record->content) !!}
</div>
```

## 安全性

默认情况下，编辑器输出原始 HTML 并将其发送到后端。攻击者可以截获组件的值并向后端发送不同的原始 HTML 字符串。因此，在输出富文本编辑器的 HTML 时进行清理非常重要；否则你的网站可能会暴露于跨站脚本（XSS）漏洞。

当 Filament 在 `TextColumn` 和 `TextEntry` 等组件中从数据库输出原始 HTML 时，会对其进行清理以移除任何危险的 JavaScript。但是，如果你在自己的 Blade 视图中输出富文本编辑器的 HTML，则这是你的责任。一种选择是使用 Filament 的 `sanitizeHtml()` 辅助函数来完成此操作，这与我们在上述组件中清理 HTML 的工具相同：

```blade
{!! str($record->content)->sanitizeHtml() !!}
```

如果你[以 JSON 格式存储内容](#以-json-格式存储内容)而不是 HTML，或者你的内容需要处理以注入[私有图片 URL](#在编辑器中使用私有图片)等，你可以使用[内容渲染器](#渲染富文本内容)来输出 HTML。它会自动为你清理 HTML，因此你无需担心。

:::danger
Filament 内置的 HTML 清理器允许行内 `style` 属性，以支持富文本格式功能，如字体颜色、文本高亮和图片尺寸调整。这意味着像 `background: url(...)` 或 `position: fixed` 这样的 CSS 属性不会从清理后的 HTML 中移除。如果你的内容来自不受信任的用户，应考虑限制默认配置。有关如何自定义清理器的详细信息，请参阅[安全文档](../advanced/security#自定义清理器)。
:::

## 向编辑器上传图片

默认情况下，上传的图片以公开方式存储在你的存储磁盘上，以便数据库中存储的富文本内容可以在任何地方轻松输出。你可以使用配置方法自定义图片的上传方式：

```php
use Filament\Forms\Components\RichEditor;

RichEditor::make('content')
    ->fileAttachmentsDisk('s3')
    ->fileAttachmentsDirectory('attachments')
    ->fileAttachmentsVisibility('private')
```

:::tip
除了允许静态值之外，`fileAttachmentsDisk()`、`fileAttachmentsDirectory()` 和 `fileAttachmentsVisibility()` 方法也接受函数来动态计算值。你可以将各种工具注入到函数中作为参数。
:::

:::tip
Filament 还支持使用 [`spatie/laravel-medialibrary`](https://github.com/spatie/laravel-medialibrary) 存储富文本编辑器的文件附件。有关更多信息，请参阅我们的[插件文档](https://filamentphp.com/plugins/filament-spatie-media-library#using-media-library-for-rich-editor-file-attachments)。
:::

### 在编辑器中使用私有图片

在编辑器中使用私有图片增加了过程的复杂性，因为私有图片无法通过永久 URL 直接访问。每次加载编辑器或渲染其内容时，都需要为每张图片生成临时 URL，这些 URL 永远不会存储在数据库中。Filament 会向图片标签添加一个 `data-id` 属性，其中包含图片在存储磁盘中的标识符，以便按需生成临时 URL。

使用私有图片渲染内容时，请确保你使用 Filament 的 [`RichContentRenderer` 工具](#渲染富文本内容)来输出 HTML：

```php
use Filament\Forms\Components\RichEditor\RichContentRenderer;

RichContentRenderer::make($record->content)
    ->fileAttachmentsDisk('s3')
    ->fileAttachmentsVisibility('private')
    ->toHtml()
```

### 保护文件附件 ID

图片节点上的 `data-id` 属性是配置磁盘上文件的标识符。当内容被渲染时，Filament 会为其生成一个 URL——如果可见性为 `private`，则生成签名的临时 URL。与任何其他 Livewire 表单字段值一样，内容及其 `data-id` 属性由客户端控制：请求可以被截获以将 `data-id` 更改为同一磁盘上的任何其他标识符。如果磁盘还存储了属于其他用户或记录的文件，攻击者可以让渲染的内容引用（并提供签名 URL）他人的文件。

Filament 默认允许这种行为，因为合法功能依赖于此——例如，从现有库中插入图片的操作，或"从其他记录复制"按钮。如果你的编辑器都不依赖此类流程，请在字段上调用 `preventFileAttachmentPathTampering()` 以启用内置检查：

```php
use Filament\Forms\Components\RichEditor;

RichEditor::make('content')
    ->preventFileAttachmentPathTampering()
```

Filament 会解析记录的原始内容（通过 `$record->getOriginal()` 获取与字段名匹配的属性），并仅允许已存在的 `data-id` 值。任何其他现有的 `data-id` 都会导致字段验证失败，因此记录永远不会保存被篡改的值。新上传的图片始终可以通过。

如果你使用 [`spatie/laravel-medialibrary` 插件](https://filamentphp.com/plugins/filament-spatie-media-library#using-media-library-for-rich-editor-file-attachments)作为文件附件提供者，此保护已经隐含——它会根据记录自身的媒体集合查找每个 `data-id`。

:::warning
`preventFileAttachmentPathTampering()` 需要表单上有记录。如果没有记录——例如在创建页面上——每个现有的 `data-id` 都会验证失败，除非 [`allowFilePathUsing`](#通过回调允许额外的-data-id-值) 回调批准它。新上传的图片不受影响。
:::

要将此检查应用到应用中的每个 `RichEditor` 而无需在每个字段上重复设置，可以在服务提供者的 `boot()` 方法中调用 `configureUsing()`：

```php
use Filament\Forms\Components\RichEditor;

RichEditor::configureUsing(function (RichEditor $component): void {
    $component->preventFileAttachmentPathTampering();
});
```

个别字段仍可通过调用 `preventFileAttachmentPathTampering(false)` 来选择退出。

#### 通过回调允许额外的 `data-id` 值

如果你的应用程序需要合法引用不在记录上的标识符——例如"从其他记录复制"操作——请传递 `allowFilePathUsing` 参数来批准它。已批准的标识符将绕过验证错误：

```php
use Filament\Forms\Components\RichEditor;

RichEditor::make('content')
    ->preventFileAttachmentPathTampering(
        allowFilePathUsing: fn (string $file): bool => str_starts_with($file, 'templates/'),
    )
```

:::tip
你可以将各种工具注入到传递给 `allowFilePathUsing` 的函数中作为参数。该函数接收一个 `string` 类型的 `$file` 参数，即正在授权的已提交 `data-id` 值。
:::

验证错误消息可以通过 [`validationMessages()`](validation#验证消息) 使用 `tampered` 键来自定义：

```php
use Filament\Forms\Components\RichEditor;

RichEditor::make('content')
    ->preventFileAttachmentPathTampering()
    ->validationMessages([
        'tampered' => 'The content references an image that is not permitted.',
    ])
```

### 验证上传的图片

你可以使用 `fileAttachmentsAcceptedFileTypes()` 方法来控制上传图片的可接受 MIME 类型列表。默认接受 `image/png`、`image/jpeg`、`image/gif` 和 `image/webp`：

```php
use Filament\Forms\Components\RichEditor;

RichEditor::make('content')
    ->fileAttachmentsAcceptedFileTypes(['image/png', 'image/jpeg'])
```

你可以使用 `fileAttachmentsMaxSize()` 方法来控制上传图片的最大文件大小。大小以千字节为单位指定。默认最大大小为 12288 KB（12 MB）：

```php
use Filament\Forms\Components\RichEditor;

RichEditor::make('content')
    ->fileAttachmentsMaxSize(5120) // 5 MB
```

### 允许用户调整图片大小

默认情况下，编辑器中的图片无法由用户调整大小。你可以使用 `resizableImages()` 方法启用图片大小调整：

```php
use Filament\Forms\Components\RichEditor;

RichEditor::make('content')
    ->resizableImages()
```

启用后，用户可以通过点击图片并拖动调整大小手柄来调整图片大小。调整大小时始终会保持宽高比。

:::tip
除了允许静态值之外，`resizableImages()` 方法也接受一个函数来动态计算值。你可以将各种工具注入到函数中作为参数。
:::

## 使用自定义块

自定义块是用户可以拖放到富文本编辑器中的元素。你可以使用 `customBlocks()` 方法定义用户可以插入到富文本编辑器中的自定义块：

```php
use Filament\Forms\Components\RichEditor;

RichEditor::make('content')
    ->customBlocks([
        HeroBlock::class,
        CallToActionBlock::class,
    ])
```

![自定义块面板打开的富文本编辑器](/assets/filament/v4.x/screenshots/images/light/forms/fields/rich-editor/custom-blocks.jpg)

要创建自定义块，可以使用以下命令：

```bash
php artisan make:filament-rich-content-custom-block HeroBlock
```

每个块都需要一个对应的类，该类继承 `Filament\Forms\Components\RichEditor\RichContentCustomBlock` 类。`getId()` 方法应返回块的唯一标识符，`getLabel()` 方法应返回在编辑器侧边面板中显示的标签：

```php
use Filament\Forms\Components\RichEditor\RichContentCustomBlock;

class HeroBlock extends RichContentCustomBlock
{
    public static function getId(): string
    {
        return 'hero';
    }

    public static function getLabel(): string
    {
        return 'Hero section';
    }
}
```

当用户将自定义块拖入编辑器时，你可以选择打开一个模态框，在插入块之前收集用户的额外信息。为此，你可以使用 `configureEditorAction()` 方法配置插入块时将打开的[模态框](../actions/modals)：

```php
use Filament\Actions\Action;
use Filament\Forms\Components\RichEditor\RichContentCustomBlock;

class HeroBlock extends RichContentCustomBlock
{
    // ...

    public static function configureEditorAction(Action $action): Action
    {
        return $action
            ->modalDescription('Configure the hero section')
            ->schema([
                TextInput::make('heading')
                    ->required(),
                TextInput::make('subheading'),
            ]);
    }
}
```

操作上的 `schema()` 方法可以定义将在模态框中显示的表单字段。当用户提交表单时，表单数据将作为该块的"配置"保存。

### 为自定义块渲染预览

一旦块被插入到编辑器中，你可以使用 `toPreviewHtml()` 方法为其定义"预览"。此方法应返回一段 HTML 字符串，当块被插入时会在编辑器中显示，允许用户在保存之前查看块的效果。你可以在此方法中访问块的 `$config`，其中包含块插入时在模态框中提交的数据：

```php
use Filament\Forms\Components\RichEditor\RichContentCustomBlock;

class HeroBlock extends RichContentCustomBlock
{
    // ...

    /**
     * @param  array<string, mixed>  $config
     */
    public static function toPreviewHtml(array $config): string
    {
        return view('filament.forms.components.rich-editor.rich-content-custom-blocks.hero.preview', [
            'heading' => $config['heading'],
            'subheading' => $config['subheading'] ?? 'Default subheading',
        ])->render();
    }
}
```

如果你想自定义编辑器中预览上方显示的标签，可以定义 `getPreviewLabel()`。默认情况下，它会使用 `getLabel()` 方法中定义的标签，但 `getPreviewLabel()` 可以访问块的 `$config`，允许你在标签中显示动态信息：

```php
use Filament\Forms\Components\RichEditor\RichContentCustomBlock;

class HeroBlock extends RichContentCustomBlock
{
    // ...

    /**
     * @param  array<string, mixed>  $config
     */
    public static function getPreviewLabel(array $config): string
    {
        return "Hero section: {$config['heading']}";
    }
}
```

### 使用自定义块渲染内容

渲染富文本内容时，你可以将自定义块数组传递给 `RichContentRenderer` 以确保块被正确渲染：

```php
use Filament\Forms\Components\RichEditor\RichContentRenderer;

RichContentRenderer::make($record->content)
    ->customBlocks([
        HeroBlock::class,
        CallToActionBlock::class,
    ])
    ->toHtml()
```

每个块类可以有一个 `toHtml()` 方法，返回该块应渲染的 HTML：

```php
use Filament\Forms\Components\RichEditor\RichContentCustomBlock;

class HeroBlock extends RichContentCustomBlock
{
    // ...

    /**
     * @param  array<string, mixed>  $config
     * @param  array<string, mixed>  $data
     */
    public static function toHtml(array $config, array $data): string
    {
        return view('filament.forms.components.rich-editor.rich-content-custom-blocks.hero.index', [
            'heading' => $config['heading'],
            'subheading' => $config['subheading'],
            'buttonLabel' => 'View category',
            'buttonUrl' => $data['categoryUrl'],
        ])->render();
    }
}
```

如上所示，`toHtml()` 方法接收两个参数：`$config` 包含块插入时在模态框中提交的配置数据，`$data` 包含渲染块可能需要的任何额外数据。这允许你访问配置数据并相应地渲染块。数据可以在 `customBlocks()` 方法中传递：

```php
use Filament\Forms\Components\RichEditor\RichContentRenderer;

RichContentRenderer::make($record->content)
    ->customBlocks([
        HeroBlock::class => [
            'categoryUrl' => $record->category->getUrl(),
        ],
        CallToActionBlock::class,
    ])
    ->toHtml()
```

### 对自定义块进行分组

你可以使用 `customBlocks()` 数组中的字符串键将自定义块组织成组。直接传递的块（没有字符串键）是未分组的，会首先出现在面板中：

```php
use Filament\Forms\Components\RichEditor;

RichEditor::make('content')
    ->customBlocks([
        AlertBlock::class,
        DividerBlock::class,
        'Marketing' => [
            HeroBlock::class,
            CallToActionBlock::class,
            BannerBlock::class,
        ],
        'Media' => [
            ImageGalleryBlock::class,
            VideoEmbedBlock::class,
        ],
    ])
```

![分组自定义块面板打开的富文本编辑器](/assets/filament/v4.x/screenshots/images/light/forms/fields/rich-editor/grouped-custom-blocks.jpg)

组按照在数组中定义的顺序显示，侧边面板中带有固定标题。

渲染包含分组块的内容时，你可以将相同的分组数组结构传递给 `RichContentRenderer`。渲染时会忽略组——仅使用块类：

```php
use Filament\Forms\Components\RichEditor\RichContentRenderer;

RichContentRenderer::make($record->content)
    ->customBlocks([
        'Marketing' => [
            HeroBlock::class => [
                'categoryUrl' => $record->category->getUrl(),
            ],
            CallToActionBlock::class,
        ],
    ])
    ->toHtml()
```

### 默认打开自定义块面板

如果你希望在加载富文本编辑器时默认打开自定义块面板，可以使用 `activePanel('customBlocks')` 方法：

```php
use Filament\Forms\Components\RichEditor;

RichEditor::make('content')
    ->customBlocks([
        HeroBlock::class,
        CallToActionBlock::class,
    ])
    ->activePanel('customBlocks')
```

### 使用 prose 样式化自定义块预览

默认情况下，自定义块预览不使用 prose 样式显示，以便于样式化。你可以使用 `shouldApplyProseStylingToPreview()` 方法为块的预览启用 prose 样式。当你希望预览以排版样式（如标题、段落和其他 prose 元素）显示时，这很有用：

```php
use Filament\Forms\Components\RichEditor\RichContentCustomBlock;

class HeadingBlock extends RichContentCustomBlock
{
    // ...

    /**
     * @param  array<string, mixed>  $config
     */
    public static function shouldApplyProseStylingToPreview(array $config): bool
    {
        return true;
    }
}
```

当 `shouldApplyProseStylingToPreview()` 返回 `true` 时，块的预览将使用富文本编辑器中定义的 prose 排版样式进行样式化，包括适当的边距、字体大小和其他文本格式。默认情况下，此方法返回 `false`，因此预览以最少的样式显示。

你可以根据块的配置做出此决定，允许不同的块具有不同的预览样式：

```php
public static function shouldApplyProseStylingToPreview(array $config): bool
{
    return ($config['useProseStyle'] ?? false) === true;
}
```

## 使用合并标签

合并标签允许用户在其富文本内容中插入"占位符"，这些占位符在内容渲染时可以被替换为动态值。这对于插入当前用户的姓名或当前日期等内容很有用。

要在编辑器上注册合并标签，请使用 `mergeTags()` 方法：

```php
use Filament\Forms\Components\RichEditor;

RichEditor::make('content')
    ->mergeTags([
        'name',
        'today',
    ])
```

![带合并标签面板的富文本编辑器](/assets/filament/v4.x/screenshots/images/light/forms/fields/rich-editor/merge-tags.jpg)

合并标签用双大括号包围，如 `{{ name }}`。当内容被渲染时，这些标签将被替换为相应的值。

要向内容中插入合并标签，用户可以输入 `{{` 来搜索要插入的标签。或者，他们可以点击编辑器工具栏中的"合并标签"工具，打开包含所有合并标签的面板。然后他们可以从编辑器的侧边面板将合并标签拖入内容中，或点击插入。

### 渲染包含合并标签的内容

渲染富文本内容时，你可以传递一个值数组来替换合并标签：

```php
use Filament\Forms\Components\RichEditor\RichContentRenderer;

RichContentRenderer::make($record->content)
    ->mergeTags([
        'name' => $record->user->name,
        'today' => now()->toFormattedDateString(),
    ])
    ->toHtml()
```

如果你有很多合并标签或需要运行一些逻辑来确定值，可以使用函数作为每个合并标签的值。当在内容中首次遇到合并标签时将调用此函数，并且其结果会被缓存用于后续相同名称的标签：

```php
use Filament\Forms\Components\RichEditor\RichContentRenderer;

RichContentRenderer::make($record->content)
    ->mergeTags([
        'name' => fn (): string => $record->user->name,
        'today' => now()->toFormattedDateString(),
    ])
    ->toHtml()
```

#### 在合并标签中使用 HTML 内容

默认情况下，合并标签将其值渲染为纯文本。但是，你可以通过提供实现了 Laravel 的 `Htmlable` 接口的值来在合并标签中渲染 HTML 内容。这对于插入格式化内容、链接或其他 HTML 元素很有用：

```php
use Filament\Forms\Components\RichEditor\RichContentRenderer;
use Illuminate\Support\HtmlString;

RichContentRenderer::make($record->content)
    ->mergeTags([
        'user_name' => $record->user->name, // 纯文本
        'user_profile_link' => new HtmlString('<a href="' . route('profile', $record->user) . '">View Profile</a>'),
    ])
    ->toHtml()
```

当合并标签的值实现了 `Htmlable` 接口（如 `HtmlString`）时，系统会自动检测并渲染 HTML 内容而不进行转义。非 `Htmlable` 的值将继续以纯文本形式渲染以确保安全。

### 使用自定义合并标签标签

你可以为合并标签提供自定义标签，这些标签将显示在编辑器的侧边面板和内容预览中，使用关联数组，其中键是合并标签名称，值是标签：

```php
use Filament\Forms\Components\RichEditor;

RichEditor::make('content')
    ->mergeTags([
        'name' => 'Full name',
        'today' => 'Today\'s date',
    ])
```

标签不会保存在编辑器的内容中，仅用于显示目的。

### 默认打开合并标签面板

如果你希望在加载富文本编辑器时默认打开合并标签面板，可以使用 `activePanel('mergeTags')` 方法：

```php
use Filament\Forms\Components\RichEditor;

RichEditor::make('content')
    ->mergeTags([
        'name',
        'today',
    ])
    ->activePanel('mergeTags')
```

## 使用提及

提及允许用户通过输入触发字符来插入对其他记录（如用户、问题或标签）的引用。当用户输入触发字符（如 `@`）时，会出现一个下拉菜单，允许他们搜索和选择可用选项。选中的提及作为不可编辑的行内标记插入。

要在编辑器上注册提及，请使用 `mentions()` 方法配合一个或多个 `MentionProvider` 实例：

```php
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\RichEditor\MentionProvider;

RichEditor::make('content')
    ->mentions([
        MentionProvider::make('@')
            ->items([
                1 => 'Jane Doe',
                2 => 'John Smith',
            ]),
    ])
```

![带提及建议的富文本编辑器](/assets/filament/v4.x/screenshots/images/light/forms/fields/rich-editor/mentions.jpg)

每个提供者都配置了一个触发字符（传递给 `make()`），用于激活提及搜索。你可以有多个具有不同触发字符的提供者：

```php
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\RichEditor\MentionProvider;

RichEditor::make('content')
    ->mentions([
        MentionProvider::make('@')
            ->items([
                1 => 'Jane Doe',
                2 => 'John Smith',
            ]),
        MentionProvider::make('#')
            ->items([
                'bug' => 'Bug',
                'feature' => 'Feature',
            ]),
    ])
```

### 从数据库搜索提及

对于大型数据集，应使用 `getSearchResultsUsing()` 动态获取结果。回调接收搜索词，并应返回格式为 `[id => label]` 的选项数组。

使用动态搜索结果时，只有提及的 `id` 存储在内容中。为了在加载内容时显示正确的标签，你还必须提供 `getLabelsUsing()`。此回调接收一个 ID 数组，并应返回格式为 `[id => label]` 的数组：

```php
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\RichEditor\MentionProvider;

RichEditor::make('content')
    ->mentions([
        MentionProvider::make('@')
            ->getSearchResultsUsing(fn (string $search): array => User::query()
                ->where('name', 'like', "%{$search}%")
                ->orderBy('name')
                ->limit(10)
                ->pluck('name', 'id')
                ->all())
            ->getLabelsUsing(fn (array $ids): array => User::query()
                ->whereIn('id', $ids)
                ->pluck('name', 'id')
                ->all()),
    ])
```

### 渲染包含提及的内容

渲染富文本内容时，你可以将提及提供者数组传递给 `RichContentRenderer` 以确保提及被正确渲染。

你可以使用 `url()` 方法让提及在渲染时链接到 URL。回调接收提及的 `id` 和 `label`，并应返回 URL 字符串：

```php
use Filament\Forms\Components\RichEditor\MentionProvider;
use Filament\Forms\Components\RichEditor\RichContentRenderer;

RichContentRenderer::make($record->content)
    ->mentions([
        MentionProvider::make('@')
            ->getLabelsUsing(fn (array $ids): array => User::query()
                ->whereIn('id', $ids)
                ->pluck('name', 'id')
                ->all())
            ->url(fn (string $id, string $label): string => route('users.show', $id)),
    ])
    ->toHtml()
```

## 注册富文本内容属性

富文本编辑器配置中有一些元素同时适用于编辑器和渲染器。例如，如果你使用了[私有图片](#在编辑器中使用私有图片)、[自定义块](#使用自定义块)、[合并标签](#使用合并标签)、[提及](#使用提及)或[插件](#扩展富文本编辑器)，你需要确保在两个地方使用相同的配置。为此，Filament 为你提供了一种注册富文本内容属性的方式，可以在编辑器和渲染器中同时使用。如果插件实现了 `HasFileAttachmentProvider`，文件附件提供者会自动从插件中解析，因此你不需要在属性或渲染器上调用 `fileAttachmentProvider()`。

要在 Eloquent 模型上注册富文本内容属性，应使用 `InteractsWithRichContent` trait 并实现 `HasRichContent` 接口。这允许你在 `setUpRichContent()` 方法中注册属性：

```php
use Filament\Forms\Components\RichEditor\MentionProvider;
use Filament\Forms\Components\RichEditor\Models\Concerns\InteractsWithRichContent;
use Filament\Forms\Components\RichEditor\Models\Contracts\HasRichContent;
use Illuminate\Database\Eloquent\Model;

class Post extends Model implements HasRichContent
{
    use InteractsWithRichContent;

    public function setUpRichContent(): void
    {
        $this->registerRichContent('content')
            ->fileAttachmentsDisk('s3')
            ->fileAttachmentsVisibility('private')
            ->customBlocks([
                HeroBlock::class => [
                    'categoryUrl' => fn (): string => $this->category->getUrl(),
                ],
                CallToActionBlock::class,
            ])
            ->mergeTags([
                'name' => fn (): string => $this->user->name,
                'today' => now()->toFormattedDateString(),
            ])
            ->mergeTagLabels([
                'name' => 'Full name',
                'today' => 'Today\'s date',
            ])
            ->mentions([
                MentionProvider::make('@')
                    ->items([
                        1 => 'Jane Doe',
                        2 => 'John Smith',
                    ]),
            ])
            ->textColors([
                'brand' => TextColor::make('Brand', '#0ea5e9', darkColor: '#38bdf8'),
            ])
            ->customTextColors()
            ->plugins([
                HighlightRichContentPlugin::make(),
            ]);
    }
}
```

当你使用 `RichEditor` 组件时，将使用为相应属性注册的配置：

```php
use Filament\Forms\Components\RichEditor;

RichEditor::make('content')
```

要轻松地使用给定配置从模型渲染富文本内容 HTML，可以在模型上调用 `renderRichContent()` 方法，传递属性名称：

```blade
{!! $record->renderRichContent('content') !!}
```

或者，你可以获取一个 `Htmlable` 对象来渲染而不转义 HTML：

```blade
{{ $record->getRichContentAttribute('content') }}
```

当在表格中使用[文本列](../tables/columns/text)或在信息列表中使用[文本条目](../infolists/text-entry)时，你不需要手动渲染富文本内容。Filament 会自动为你完成：

```php
use Filament\Infolists\Components\TextEntry;
use Filament\Tables\Columns\TextColumn;

TextColumn::make('content')

TextEntry::make('content')
```

## 扩展富文本编辑器

你可以为富文本编辑器创建插件，这允许你向编辑器和渲染器添加自定义 TipTap 扩展以及自定义工具栏按钮。创建一个实现 `RichContentPlugin` 接口的新类：

```php
use Filament\Actions\Action;
use Filament\Forms\Components\ColorPicker;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\RichEditor\EditorCommand;
use Filament\Forms\Components\RichEditor\Plugins\Contracts\RichContentPlugin;
use Filament\Forms\Components\RichEditor\RichEditorTool;
use Filament\Support\Enums\Width;
use Filament\Support\Facades\FilamentAsset;
use Filament\Support\Icons\Heroicon;
use Tiptap\Core\Extension;
use Tiptap\Marks\Highlight;

class HighlightRichContentPlugin implements RichContentPlugin
{
    public static function make(): static
    {
        return app(static::class);
    }

    /**
     * @return array<Extension>
     */
    public function getTipTapPhpExtensions(): array
    {
        // 此方法应返回 PHP TipTap 扩展对象数组。
        // 参见：https://github.com/ueberdosis/tiptap-php
    
        return [
            app(Highlight::class, [
                'options' => ['multicolor' => true],
            ]),
        ];
    }

    /**
     * @return array<string>
     */
    public function getTipTapJsExtensions(): array
    {
        // 此方法应返回 JavaScript 文件 URL 数组，其中包含
        // 当插件使用时应异步加载到编辑器中的 TipTap 扩展。
    
        return [
            FilamentAsset::getScriptSrc('rich-content-plugins/highlight'),
        ];
    }

    /**
     * @return array<RichEditorTool>
     */
    public function getEditorTools(): array
    {
        // 此方法应返回 `RichEditorTool` 对象数组，然后可以在
        // 编辑器的 `toolbarButtons()` 中使用。
        
        // `jsHandler()` 方法允许你通过 `$getEditor()` 访问 TipTap 编辑器实例，
        // 并使用 `chain()` 将任何 TipTap 命令链接到它。
        // 参见：https://tiptap.dev/docs/editor/api/commands
        
        // `action()` 方法允许你在点击工具栏按钮时运行一个操作
        // （在 `getEditorActions()` 方法中注册）。这允许你在运行命令之前
        // 打开模态框从用户那里收集额外信息。
    
        return [
            RichEditorTool::make('highlight')
                ->jsHandler('$getEditor()?.chain().focus().toggleHighlight().run()')
                ->icon(Heroicon::CursorArrowRays),
            RichEditorTool::make('highlightWithCustomColor')
                ->action(arguments: '{ color: $getEditor().getAttributes(\'highlight\')?.[\'data-color\'] }')
                ->icon(Heroicon::CursorArrowRipple),
        ];
    }

    /**
     * @return array<Action>
     */
    public function getEditorActions(): array
    {
        // 此方法应返回 `Action` 对象数组，可以被 `getEditorActions()` 方法中
        // 注册的工具使用。操作的名称应与使用它的工具名称匹配。
        
        // `runCommands()` 方法允许你在编辑器实例上运行 TipTap 命令。
        // 它接受一个 `EditorCommand` 对象数组，定义要运行的命令以及
        // 传递给命令的任何参数。你还应该传入 `editorSelection` 参数，
        // 这是编辑器中要应用命令的当前选区。
    
        return [
            Action::make('highlightWithCustomColor')
                ->modalWidth(Width::Large)
                ->fillForm(fn (array $arguments): array => [
                    'color' => $arguments['color'] ?? null,
                ])
                ->schema([
                    ColorPicker::make('color'),
                ])
                ->action(function (array $arguments, array $data, RichEditor $component): void {
                    $component->runCommands(
                        [
                            EditorCommand::make(
                                'toggleHighlight',
                                arguments: [[
                                    'color' => $data['color'],
                                ]],
                            ),
                        ],
                        editorSelection: $arguments['editorSelection'],
                    );
                }),
        ];
    }
}
```

你可以使用 `plugins()` 方法将你的插件注册到富文本编辑器和[富文本内容渲染器](#渲染富文本内容)中：

```php
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\RichEditor\RichContentRenderer;

RichEditor::make('content')
    ->toolbarButtons([
        ['bold', 'highlight', 'highlightWithCustomColor'],
        ['h2', 'h3'],
        ['bulletList', 'orderedList'],
    ])
    ->plugins([
        HighlightRichContentPlugin::make(),
    ])

RichContentRenderer::make($record->content)
    ->plugins([
        HighlightRichContentPlugin::make(),
    ])
```

### 从插件中启用或禁用工具栏按钮

默认情况下，当插件通过 `getEditorTools()` 提供工具时，这些工具会被注册但不会自动显示在工具栏中。用户需要手动使用 `toolbarButtons()` 或 `enableToolbarButtons()` 添加它们。

如果你希望你的插件自动启用或禁用工具栏按钮，可以在 `RichContentPlugin` 旁边实现 `HasToolbarButtons` 接口。这是一个可选的、独立的接口：

```php
use Filament\Forms\Components\RichEditor\Plugins\Contracts\HasToolbarButtons;
use Filament\Forms\Components\RichEditor\Plugins\Contracts\RichContentPlugin;

class HighlightRichContentPlugin implements RichContentPlugin, HasToolbarButtons
{
    // ... 其他方法 ...

    /**
     * @return array<string | array<string | array<string>>>
     */
    public function getEnabledToolbarButtons(): array
    {
        return ['highlight', 'highlightWithCustomColor'];
    }

    /**
     * @return array<string>
     */
    public function getDisabledToolbarButtons(): array
    {
        return [];
    }
}
```

`getEnabledToolbarButtons()` 方法返回要添加到工具栏的按钮名称。`getDisabledToolbarButtons()` 方法返回要从工具栏移除的按钮名称。

插件工具栏修改会在用户级修改之前应用。这意味着用户始终可以使用 `enableToolbarButtons()` 或 `disableToolbarButtons()` 覆盖插件的行为：

```php
RichEditor::make('content')
    ->plugins([
        HighlightRichContentPlugin::make(),
    ])
    ->disableToolbarButtons(['highlightWithCustomColor'])
```

### 设置 TipTap JavaScript 扩展

Filament 能够异步加载 TipTap 的 JavaScript 扩展。为此，你需要创建一个包含扩展的 JavaScript 文件，并在[插件](#扩展富文本编辑器)的 `getTipTapJsExtensions()` 方法中注册它。

例如，如果你想使用 [TipTap 高亮扩展](https://tiptap.dev/docs/editor/extensions/marks/highlight)，请确保先安装它：

```bash
npm install @tiptap/extension-highlight --save-dev
```

然后，创建一个导入扩展的 JavaScript 文件。在此示例中，在 `resources/js/filament/rich-content-plugins` 目录中创建一个名为 `highlight.js` 的文件，并添加以下代码：

```javascript
import Highlight from '@tiptap/extension-highlight'

export default Highlight.configure({
    multicolor: true,
})
```

编译此文件的一种方式是使用 [esbuild](https://esbuild.github.io)。你可以使用 `npm` 安装它：

```bash
npm install esbuild --save-dev
```

你必须创建一个 [esbuild](https://esbuild.github.io) 脚本来编译文件。你可以将其放在任何位置，例如 `bin/build.js`：

```js
import * as esbuild from 'esbuild'

async function compile(options) {
    const context = await esbuild.context(options)

    await context.rebuild()
    await context.dispose()
}

compile({
    define: {
        'process.env.NODE_ENV': `'production'`,
    },
    bundle: true,
    mainFields: ['module', 'main'],
    platform: 'neutral',
    sourcemap: false,
    sourcesContent: false,
    treeShaking: true,
    target: ['es2020'],
    minify: true,
    entryPoints: ['./resources/js/filament/rich-content-plugins/highlight.js'],
    outfile: './resources/js/dist/filament/rich-content-plugins/highlight.js',
})
```

如你所见，在脚本的末尾，我们将 `resources/js/filament/rich-content-plugins/highlight.js` 编译到 `resources/js/dist/filament/rich-content-plugins/highlight.js`。你可以根据需要更改这些路径。你可以编译任意多的文件。

要运行脚本并将此文件编译到 `resources/js/dist/filament/rich-content-plugins/highlight.js`，请运行以下命令：

```bash
node bin/build.js
```

你应在服务提供者（如 `AppServiceProvider`）的 `boot()` 方法中注册它，并使用 `loadedOnRequest()` 以便在页面加载富文本编辑器之前不会下载它：

```php
use Filament\Support\Assets\Js;
use Filament\Support\Facades\FilamentAsset;

FilamentAsset::register([
    Js::make('rich-content-plugins/highlight', __DIR__ . '/../../resources/js/dist/filament/rich-content-plugins/highlight.js')->loadedOnRequest(),
]);
```

要将此新的 JavaScript 文件发布到应用的 `/public` 目录以便提供服务，可以使用 `filament:assets` 命令：

```bash
php artisan filament:assets
```

在[插件对象](#扩展富文本编辑器)中，`getTipTapJsExtensions()` 方法应返回你刚创建的 JavaScript 文件的路径。既然它已通过 `FilamentAsset` 注册，你可以使用 `getScriptSrc()` 方法获取文件的 URL：

```php
use Filament\Support\Facades\FilamentAsset;

/**
 * @return array<string>
 */
public function getTipTapJsExtensions(): array
{
    return [
        FilamentAsset::getScriptSrc('rich-content-plugins/highlight'),
    ];
}
```

#### 共享打包的 TipTap/ProseMirror 实例

当自定义 JavaScript 扩展从 `@tiptap/core` 或 `@tiptap/pm/*` 导入时，每个编译的扩展都包含这些包的自己的副本。这会为每个扩展浪费约 150-200 KB，并且更重要的是，在页面上创建多个 ProseMirror 实例。因为 ProseMirror 严重依赖 `instanceof` 检查（用于 `Node`、`Mark`、`Plugin`、`DecorationSet` 等），打包了自己这些模块副本的扩展可能无法与编辑器的核心互操作。

为了避免这种情况，Filament 在 `window.FilamentRichEditor.tiptap` 上暴露了打包的 TipTap 和 ProseMirror 模块：

```js
window.FilamentRichEditor.tiptap = {
    core,     // @tiptap/core
    pmState,  // @tiptap/pm/state
    pmView,   // @tiptap/pm/view
    pmModel,  // @tiptap/pm/model
}
```

你可以在扩展中直接引用这些模块：

```javascript
const { Node, mergeAttributes } = window.FilamentRichEditor.tiptap.core
const { Plugin, PluginKey } = window.FilamentRichEditor.tiptap.pmState

export default Node.create({
    name: 'myExtension',
    // ...
})
```

或者，你可以配置构建以拦截 `@tiptap/core` 和 `@tiptap/pm/{state,view,model}` 的导入，并在运行时从全局对象解析它们。这使你可以在扩展源代码中继续编写正常的 `import` 语句——其他 `@tiptap/*` 包（如 `@tiptap/extension-highlight`）照常打包。以下 esbuild 插件在构建时检查每个被拦截包的真实命名导出，并将导入重写为从 `window.FilamentRichEditor.tiptap` 读取：

```bash
npm install --save-dev @tiptap/core @tiptap/pm
```

```js
// bin/build.js
import * as esbuild from 'esbuild'

const tiptapSharedPlugin = {
    name: 'tiptap-shared',
    setup(build) {
        const keys = {
            '@tiptap/core': 'core',
            '@tiptap/pm/state': 'pmState',
            '@tiptap/pm/view': 'pmView',
            '@tiptap/pm/model': 'pmModel',
        }

        build.onResolve({ filter: /^@tiptap\/(core|pm\/(state|view|model))$/ }, (args) => ({
            path: args.path,
            namespace: 'tiptap-shared',
        }))

        build.onLoad({ filter: /.*/, namespace: 'tiptap-shared' }, async (args) => {
            const realModule = await import(args.path)
            const namedExports = Object.keys(realModule).filter(
                (key) => key !== '__esModule' && key !== 'default',
            )

            const key = keys[args.path]
            let code = `const __module = window.FilamentRichEditor.tiptap.${key};\n`

            if (namedExports.length) {
                code += `export const { ${namedExports.join(', ')} } = __module;\n`
            }

            code += `export default __module?.default ?? __module;\n`

            return { contents: code, loader: 'js' }
        })
    },
}

esbuild.build({
    // ...
    plugins: [tiptapSharedPlugin],
    entryPoints: ['./resources/js/filament/rich-content-plugins/my-extension.js'],
    outfile: './resources/js/dist/filament/rich-content-plugins/my-extension.js',
})
```

:::info
`window.FilamentRichEditor.tiptap` 在富文本编辑器包加载时赋值，这发生在 `getTipTapJsExtensions()` URL 被获取之前。如果你需要在富文本编辑器尚未加载的上下文中使用这些模块，请改为打包你自己的副本。

上面的 esbuild 插件在构建时从本地安装的 `@tiptap/core` 和 `@tiptap/pm` 读取命名导出，因此请保持这些版本与 Filament 打包的版本大致同步——否则你扩展中引用的较新命名导出在运行时可能是 `undefined`。
:::
