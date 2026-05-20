---
title: 文件上传
---

## 简介

文件上传字段基于 [Filepond](https://pqina.nl/filepond) 构建。

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachment')
```

![文件上传](/assets/filament/v4.x/screenshots/images/light/forms/fields/file-upload/simple.jpg)

:::tip
Filament 也支持 [`spatie/laravel-medialibrary`](https://github.com/spatie/laravel-medialibrary)。更多信息请参阅[插件文档](https://filamentphp.com/plugins/filament-spatie-media-library)。
:::

## 配置存储磁盘和目录

默认情况下，文件将上传到[配置文件](../introduction/installation#publishing-configuration)中定义的存储磁盘。你也可以通过设置 `FILESYSTEM_DISK` 环境变量来更改磁盘。

:::tip
要正确预览图片和其他文件，FilePond 要求文件从与应用相同的域名提供服务，或者需要设置正确的 CORS 头。请确保 `APP_URL` 环境变量正确，或修改[文件系统](https://laravel.com/docs/filesystem)驱动以设置正确的 URL。如果你将文件托管在 S3 等单独的域名上，请确保已设置 CORS 头。
:::

要更改特定字段的磁盘和目录，以及文件的可见性，请使用 `disk()`、`directory()` 和 `visibility()` 方法。默认情况下，文件以 `private` 可见性上传到你的存储磁盘，除非磁盘设置为 `public`：

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachment')
    ->disk('s3')
    ->directory('form-attachments')
    ->visibility('public')
```

:::tip
`disk()`、`directory()` 和 `visibility()` 方法除了接受静态值外，还接受函数来动态计算值。你可以在函数中注入各种工具作为参数。
:::

:::info
如果文件被移除，开发者有责任从磁盘上删除这些文件，因为 Filament 无法知道它们是否在其他地方被使用。自动执行此操作的一种方式是使用[模型事件](https://laravel.com/docs/eloquent#events)观察者。
:::

## 上传多个文件

你也可以上传多个文件。这会以 JSON 格式存储 URL：

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachments')
    ->multiple()
```

你可以选择传递一个布尔值来控制是否可以同时上传多个文件：

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachments')
    ->multiple(FeatureFlag::active())
```

:::tip
`multiple()` 方法除了接受静态值外，还接受函数来动态计算值。你可以在函数中注入各种工具作为参数。
:::

如果你使用 Eloquent 保存文件 URL，应确保在模型属性上添加 `array` [类型转换](https://laravel.com/docs/eloquent-mutators#array-and-json-casting)：

```php
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    /**
     * @return array<string, string>
     */
    protected function casts(): array
    { 
        return [
            'attachments' => 'array',
        ];
    }

    // ...
}
```

### 控制最大并行上传数

你可以使用 `maxParallelUploads()` 方法控制最大并行上传数量：

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachments')
    ->multiple()
    ->maxParallelUploads(1)
```

这将把并行上传数量限制为 `1`。如果未设置，我们将使用 [FilePond 默认值](https://pqina.nl/filepond/docs/api/instance/properties/#core-properties)，即 `2`。

:::tip
`maxParallelUploads()` 方法除了接受静态值外，还接受函数来动态计算值。你可以在函数中注入各种工具作为参数。
:::

## 控制文件名

默认情况下，新上传的文件会生成随机文件名，以确保永远不会与现有文件冲突。

### 控制文件名的安全隐患

在使用 `preserveFilenames()` 或 `getUploadedFileNameForStorageUsing()` 方法之前，请了解其安全隐患。如果你允许用户使用自己的文件名上传文件，他们可能会利用此漏洞上传恶意文件。**即使你使用了 [`acceptedFileTypes()`](#文件类型验证) 方法**限制可上传的文件类型也是如此，因为它使用 Laravel 的 `mimetypes` 规则，该规则不验证文件扩展名，只验证其 MIME 类型，而 MIME 类型是可以被伪造的。

这具体是 `TemporaryUploadedFile` 对象上的 `getClientOriginalName()` 方法的问题，`preserveFilenames()` 方法使用的就是它。默认情况下，Livewire 会为每个上传的文件生成随机文件名，并使用文件的 MIME 类型来确定文件扩展名。

在 `local` 或 `public` 文件系统磁盘上使用这些方法**会使你的应用面临远程代码执行的风险**，因为攻击者可以上传带有欺骗性 MIME 类型的 PHP 文件。**使用 S3 磁盘可以保护你免受此特定攻击**，因为 S3 不会像你的服务器在提供本地存储文件时那样执行 PHP 文件。

如果你使用的是 `local` 或 `public` 磁盘，应考虑使用 [`storeFileNamesIn()` 方法](#独立存储原始文件名)将原始文件名存储在数据库的单独列中，并在文件系统中保留随机生成的文件名。这样，你仍然可以向用户显示原始文件名，同时保持文件系统的安全性。

除了这个安全问题之外，你还应该了解，允许用户使用自己的文件名上传文件可能会导致与现有文件冲突，并使存储管理变得困难。如果你没有将它们限定在特定目录中，用户可能会上传同名文件并覆盖其他人的内容，因此这些功能在所有情况下都应该仅限于受信任的用户使用。

### 保留原始文件名

:::danger
在使用此功能之前，请确保你已阅读[安全隐患](#控制文件名的安全隐患)。
:::

要保留上传文件的原始文件名，请使用 `preserveFilenames()` 方法：

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachment')
    ->preserveFilenames()
```

你可以选择传递一个布尔值来控制是否保留原始文件名：

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachment')
    ->preserveFilenames(FeatureFlag::active())
```

:::tip
`preserveFilenames()` 方法除了接受静态值外，还接受函数来动态计算值。你可以在函数中注入各种工具作为参数。
:::

### 生成自定义文件名

:::danger
在使用此功能之前，请确保你已阅读[安全隐患](#控制文件名的安全隐患)。
:::

你可以使用 `getUploadedFileNameForStorageUsing()` 方法完全自定义文件名的生成方式，并基于上传的 `$file` 从闭包返回字符串：

```php
use Livewire\Features\SupportFileUploads\TemporaryUploadedFile;

FileUpload::make('attachment')
    ->getUploadedFileNameForStorageUsing(
        fn (TemporaryUploadedFile $file): string => (string) str($file->getClientOriginalName())
            ->prepend('custom-prefix-'),
    )
```

:::tip
你可以向传递给 `getUploadedFileNameForStorageUsing()` 的函数中注入各种工具作为参数。除了标准工具外，`$file` 参数包含正在上传的临时文件对象。
:::

### 独立存储原始文件名

你可以保留随机生成的文件名，同时使用 `storeFileNamesIn()` 方法存储原始文件名：

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachments')
    ->multiple()
    ->storeFileNamesIn('attachment_file_names')
```

`attachment_file_names` 现在将存储上传文件的原始文件名，这样你可以在表单提交时将它们保存到数据库。如果你上传的是 `multiple()` 文件，请确保也在该 Eloquent 模型属性上添加 `array` [类型转换](https://laravel.com/docs/eloquent-mutators#array-and-json-casting)。

:::tip
`storeFileNamesIn()` 方法除了接受静态值外，还接受函数来动态计算值。你可以在函数中注入各种工具作为参数。
:::

## 授权现有文件路径

`FileUpload` 字段的值是一个字符串（或字符串数组），包含文件在配置磁盘上的路径。与任何其他 Livewire 表单字段值一样，它由客户端控制：可以拦截请求将提交的路径更改为同一磁盘上的任何其他文件。如果字段指向的资源不允许其他用户访问——例如共享磁盘上的私有文档或按用户划分的目录——攻击者可以导致记录引用（并提供签名 URL）其他人的文件。

Filament 默认允许这样做，因为合法功能依赖于此——例如，将字段设置为预上传模板文件的操作，或"从其他记录复制"按钮。如果你的字段都不依赖此类流程，请在字段上调用 `preventFilePathTampering()` 以启用内置检查：

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('avatar')
    ->preventFilePathTampering()
```

Filament 会将每个提交的字符串路径与从记录原始加载的值（通过 `$record->getOriginal()` 获取与字段名匹配的属性）进行比较。不匹配的路径会导致字段验证失败，因此记录永远不会保存被篡改的值。新上传的文件始终通过，字段仍可被清除，对于 `multiple()` 字段，每个条目都会单独检查。

:::warning
`preventFilePathTampering()` 需要表单上有记录。如果没有记录——例如在创建页面上——除非 [`allowFilePathUsing`](#使用回调允许额外的文件路径) 回调批准，否则每个提交的字符串路径都会验证失败。新上传的文件不受影响。
:::

要在应用中对每个 `FileUpload` 应用此检查而无需在每个字段上重复调用，请在服务提供者的 `boot()` 方法中调用 `configureUsing()`：

```php
use Filament\Forms\Components\FileUpload;

FileUpload::configureUsing(function (FileUpload $component): void {
    $component->preventFilePathTampering();
});
```

个别字段仍可通过调用 `preventFilePathTampering(false)` 来选择退出。

### 使用回调允许额外的文件路径

如果你的应用需要合法引用不在记录上的路径——例如选择预上传模板文件的按钮——请传递 `allowFilePathUsing` 参数来批准它。已批准的路径会绕过验证错误：

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('avatar')
    ->preventFilePathTampering(
        allowFilePathUsing: fn (string $file): bool => str_starts_with($file, 'templates/'),
    )
```

:::tip
你可以向传递给 `allowFilePathUsing` 的函数中注入各种工具作为参数。除了标准工具外，`$file` 参数包含正在授权的已提交文件路径。
:::

可以通过 [`validationMessages()`](validation#customizing-validation-messages) 使用 `tampered` 键自定义验证错误消息：

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('avatar')
    ->preventFilePathTampering()
    ->validationMessages([
        'tampered' => 'The selected attachment is not permitted.',
    ])
```

## 头像模式

你可以使用 `avatar()` 方法为文件上传字段启用头像模式：

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('avatar')
    ->avatar()
```

这将只允许上传图片，上传后会以紧凑的圆形布局显示，非常适合头像。

![文件上传头像模式](/assets/filament/v4.x/screenshots/images/light/forms/fields/file-upload/avatar.jpg)

此功能与[圆形裁剪](#允许用户裁剪图片为圆形)配合使用效果很好。

## 图片编辑器

你可以使用 `imageEditor()` 方法为文件上传字段启用图片编辑器：

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('image')
    ->image()
    ->imageEditor()
```

上传图片后，你可以点击铅笔图标打开编辑器。你也可以点击已有图片上的铅笔图标打开编辑器，保存时会删除并重新上传该图片。

![文件上传图片编辑器及裁剪控件](/assets/filament/v4.x/screenshots/images/light/forms/fields/file-upload/image-editor.jpg)

你可以选择传递一个布尔值来控制是否启用图片编辑器：

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('image')
    ->image()
    ->imageEditor(FeatureFlag::active())
```

:::tip
`imageEditor()` 方法除了接受静态值外，还接受函数来动态计算值。你可以在函数中注入各种工具作为参数。
:::

### 允许用户按比例裁剪图片

你可以使用 `imageEditorAspectRatioOptions()` 方法允许用户将图片裁剪为特定的宽高比：

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('image')
    ->image()
    ->imageEditor()
    ->imageEditorAspectRatioOptions([
        '16:9',
        '4:3',
        '1:1',
    ])
```

你也可以通过传递 `null` 作为选项来允许用户选择不设宽高比，即"自由裁剪"：

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('image')
    ->image()
    ->imageEditor()
    ->imageEditorAspectRatioOptions([
        null,
        '16:9',
        '4:3',
        '1:1',
    ])
```

:::tip
`imageEditorAspectRatioOptions()` 方法除了接受静态值外，还接受函数来动态计算值。你可以在函数中注入各种工具作为参数。
:::

### 设置图片编辑器模式

你可以使用 `imageEditorMode()` 方法更改图片编辑器的模式，它接受 `1`、`2` 或 `3`。这些选项在 [Cropper.js 文档](https://github.com/fengyuanchen/cropperjs/blob/v1/README.md#viewmode)中有说明：

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('image')
    ->image()
    ->imageEditor()
    ->imageEditorMode(2)
```

:::tip
`imageEditorMode()` 方法除了接受静态值外，还接受函数来动态计算值。你可以在函数中注入各种工具作为参数。
:::

### 自定义图片编辑器的空白填充颜色

默认情况下，图片编辑器会将图片周围的空白区域设为透明。你可以使用 `imageEditorEmptyFillColor()` 方法自定义此颜色：

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('image')
    ->image()
    ->imageEditor()
    ->imageEditorEmptyFillColor('#000000')
```

:::tip
`imageEditorEmptyFillColor()` 方法除了接受静态值外，还接受函数来动态计算值。你可以在函数中注入各种工具作为参数。
:::

### 设置图片编辑器视口大小

你可以使用 `imageEditorViewportWidth()` 和 `imageEditorViewportHeight()` 方法更改图片编辑器视口的大小，这会生成一个适用于不同设备尺寸的宽高比：

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('image')
    ->image()
    ->imageEditor()
    ->imageEditorViewportWidth('1920')
    ->imageEditorViewportHeight('1080')
```

:::tip
`imageEditorViewportWidth()` 和 `imageEditorViewportHeight()` 方法除了接受静态值外，还接受函数来动态计算值。你可以在函数中注入各种工具作为参数。
:::

### 允许用户裁剪图片为圆形

你可以使用 `circleCropper()` 方法允许用户将图片裁剪为圆形：

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('image')
    ->image()
    ->avatar()
    ->imageEditor()
    ->circleCropper()
```

此功能与 [`avatar()` 方法](#头像模式)完美配合，后者会以紧凑的圆形布局渲染图片。

你可以选择传递一个布尔值来控制是否启用圆形裁剪：

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('image')
    ->image()
    ->avatar()
    ->imageEditor()
    ->circleCropper(FeatureFlag::active())
```

:::tip
`circleCropper()` 方法除了接受静态值外，还接受函数来动态计算值。你可以在函数中注入各种工具作为参数。
:::

### 强制使用特定宽高比

如果你需要确保所有上传的图片都符合特定的宽高比，可以将 [`imageAspectRatio()` 验证方法](#图片宽高比验证)与 `automaticallyOpenImageEditorForAspectRatio()` 结合使用。当用户上传的图片不符合要求的宽高比时，这会自动打开一个简化的图片编辑器，允许他们在保存前裁剪图片：

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('banner')
    ->image()
    ->imageAspectRatio('16:9')
    ->automaticallyOpenImageEditorForAspectRatio()
```

需要裁剪时出现的编辑器仅显示裁剪区域和保存/取消按钮——不包含使用 [`imageEditor()`](#图片编辑器) 时出现的完整编辑控件（旋转、位置输入等）。这提供了一个专注于获取正确宽高比的简化体验。

如果你希望用户能够使用完整的图片编辑器控件，可以同时启用两者：

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('banner')
    ->image()
    ->imageEditor()
    ->imageAspectRatio('16:9')
    ->automaticallyOpenImageEditorForAspectRatio()
```

同时启用时，当宽高比不匹配时图片编辑器仍会自动打开，但用户还将在每个已上传的图片上看到编辑按钮，并可访问所有编辑控件。

你可以选择传递一个布尔值来控制是否启用宽高比编辑器：

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('banner')
    ->image()
    ->imageAspectRatio('16:9')
    ->automaticallyOpenImageEditorForAspectRatio(FeatureFlag::active())
```

:::tip
`automaticallyOpenImageEditorForAspectRatio()` 方法除了接受静态值外，还接受函数来动态计算值。你可以在函数中注入各种工具作为参数。
:::

:::info
`automaticallyOpenImageEditorForAspectRatio()` 方法只能用于单个宽高比。如果需要允许多个宽高比，请仅将 `imageAspectRatio()` 用于验证，并考虑使用 [`imageEditor()`](#图片编辑器) 配合 [`imageEditorAspectRatioOptions()`](#允许用户按比例裁剪图片) 让用户选择首选比例。
:::

:::info
当启用 [`multiple()`](#上传多个文件) 时，`automaticallyOpenImageEditorForAspectRatio()` 方法不可用。
:::

### 不使用编辑器裁剪和调整图片大小

FilePond 允许你在上传前裁剪和调整图片大小，无需单独的编辑器。你可以使用 `automaticallyResizeImagesToHeight()` 和 `automaticallyResizeImagesToWidth()` 方法自定义此行为。需要设置 `automaticallyResizeImagesMode()` 才能使这些方法生效——可选值为 [`force`、`cover` 或 `contain`](https://pqina.nl/filepond/docs/api/plugins/image-resize)。

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('image')
    ->image()
    ->automaticallyCropImagesToAspectRatio('16:9')
    ->automaticallyResizeImagesMode('cover')
    ->automaticallyResizeImagesToWidth('1920')
    ->automaticallyResizeImagesToHeight('1080')
```

要启用特定宽高比的自动裁剪，请使用 `automaticallyCropImagesToAspectRatio()` 方法。如果你还设置了 `imageAspectRatio()` 进行验证，并希望自动裁剪使用相同的比例，可以不带参数调用 `automaticallyCropImagesToAspectRatio()`：

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('image')
    ->image()
    ->imageAspectRatio('16:9')
    ->automaticallyCropImagesToAspectRatio()
    ->automaticallyResizeImagesMode('cover')
    ->automaticallyResizeImagesToWidth('1920')
    ->automaticallyResizeImagesToHeight('1080')
```

:::tip
`automaticallyResizeImagesMode()`、`automaticallyCropImagesToAspectRatio()`、`automaticallyResizeImagesToHeight()` 和 `automaticallyResizeImagesToWidth()` 方法除了接受静态值外，还接受函数来动态计算值。你可以在函数中注入各种工具作为参数。
:::

:::warning
使用自动裁剪图片时，裁剪会在没有用户交互的情况下自动应用。用户无法选择保留图片的哪个部分。如果你想让用户控制图片的裁剪方式，请使用 [`automaticallyOpenImageEditorForAspectRatio()`](#强制使用特定宽高比)。
:::

## 更改文件上传区域的外观

你还可以更改 FilePond 组件的整体外观。这些方法的可用选项请参阅 [FilePond 网站](https://pqina.nl/filepond/docs/api/instance/properties/#styles)。

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachment')
    ->imagePreviewHeight('250')
    ->loadingIndicatorPosition('left')
    ->panelAspectRatio('2:1')
    ->panelLayout('integrated')
    ->removeUploadedFileButtonPosition('right')
    ->uploadButtonPosition('left')
    ->uploadProgressIndicatorPosition('left')
```

:::tip
这些方法除了接受静态值外，还接受函数来动态计算值。你可以在函数中注入各种工具作为参数。
:::

### 以网格布局显示文件

你可以通过设置 `panelLayout()` 使用 [FilePond `grid` 布局](https://pqina.nl/filepond/docs/api/style/#grid-layout)：

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachments')
    ->multiple()
    ->panelLayout('grid')
```

![网格布局的文件上传](/assets/filament/v4.x/screenshots/images/light/forms/fields/file-upload/multiple-grid.jpg)

:::tip
`panelLayout()` 方法除了接受静态值外，还接受函数来动态计算值。你可以在函数中注入各种工具作为参数。
:::

## 重新排序文件

你还可以使用 `reorderable()` 方法允许用户重新排序已上传的文件：

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachments')
    ->multiple()
    ->reorderable()
```

使用此方法时，FilePond 可能会将新上传的文件添加到列表的开头而非末尾。要解决此问题，请使用 `appendFiles()` 方法：

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachments')
    ->multiple()
    ->reorderable()
    ->appendFiles()
```

`reorderable()` 和 `appendFiles()` 方法可选择接受一个布尔值来控制是否可以重新排序文件以及是否应将新文件追加到列表末尾：

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachments')
    ->multiple()
    ->reorderable(FeatureFlag::active())
    ->appendFiles(FeatureFlag::active())
```

:::tip
`reorderable()` 和 `appendFiles()` 方法除了接受静态值外，还接受函数来动态计算值。你可以在函数中注入各种工具作为参数。
:::

## 在新标签页中打开文件

你可以使用 `openable()` 方法添加一个按钮来在新标签页中打开每个文件：

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachments')
    ->multiple()
    ->openable()
```

你可以选择传递一个布尔值来控制是否可以在新标签页中打开文件：

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachments')
    ->multiple()
    ->openable(FeatureFlag::active())
```

:::tip
`openable()` 方法除了接受静态值外，还接受函数来动态计算值。你可以在函数中注入各种工具作为参数。
:::

![可打开文件的文件上传](/assets/filament/v4.x/screenshots/images/light/forms/fields/file-upload/openable.jpg)

### 自定义打开文件时使用的 URL

默认情况下，"打开"按钮链接到 FilePond 中用于显示文件的相同 URL。如果你需要不同的 URL——例如签名 URL、不同域名上的 URL，或用于派生文件（如 [Spatie Media Library 的图片生成器](https://spatie.be/docs/laravel-medialibrary/v11/converting-other-file-types/using-image-generators#pdf)生成的 PDF 缩略图）的 URL——可以使用 `getOpenableFileUrlUsing()` 方法：

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachments')
    ->multiple()
    ->openable()
    ->getOpenableFileUrlUsing(fn (string $file): string => Storage::disk('s3')->temporaryUrl($file, now()->addMinutes(5)))
```

该函数接收存储的 `$file` 路径，必须返回点击"打开"按钮时应使用的 URL。返回 `null` 则回退到默认 URL。

:::tip
`getOpenableFileUrlUsing()` 方法也接受带有工具注入的函数。除了标准工具外，`$file` 参数包含存储的文件路径。
:::

## 下载文件

如果你想为每个文件添加下载按钮，可以使用 `downloadable()` 方法：

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachments')
    ->multiple()
    ->downloadable()
```

你可以选择传递一个布尔值来控制是否可以下载文件：

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachments')
    ->multiple()
    ->downloadable(FeatureFlag::active())
```

:::tip
`downloadable()` 方法除了接受静态值外，还接受函数来动态计算值。你可以在函数中注入各种工具作为参数。
:::

![可下载文件的文件上传](/assets/filament/v4.x/screenshots/images/light/forms/fields/file-upload/downloadable.jpg)

### 自定义下载文件时使用的 URL

默认情况下，下载按钮链接到 FilePond 中用于显示文件的相同 URL。如果你需要不同的 URL——例如带有 `Content-Disposition: attachment` 头的签名 URL，或预览渲染派生图片时的原始文件 URL——可以使用 `getDownloadableFileUrlUsing()` 方法：

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachments')
    ->multiple()
    ->downloadable()
    ->getDownloadableFileUrlUsing(fn (string $file): string => route('attachments.download', ['path' => $file]))
```

该函数接收存储的 `$file` 路径，必须返回点击下载按钮时应使用的 URL。返回 `null` 则回退到默认 URL。

:::tip
`getDownloadableFileUrlUsing()` 方法也接受带有工具注入的函数。除了标准工具外，`$file` 参数包含存储的文件路径。
:::

## 预览文件

默认情况下，某些文件类型可以在 FilePond 中预览。如果你想禁用所有文件的预览，可以使用 `previewable(false)` 方法：

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachments')
    ->multiple()
    ->previewable(false)
```

:::tip
`previewable()` 方法除了接受静态值外，还接受函数来动态计算值。你可以在函数中注入各种工具作为参数。
:::

## 提交表单时移动文件而非复制

默认情况下，文件首先上传到 Livewire 的临时存储目录，然后在表单提交时复制到目标目录。如果你希望移动文件（前提是临时上传与永久文件存储在同一磁盘上），可以使用 `moveFiles()` 方法：

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachment')
    ->moveFiles()
```

你可以选择传递一个布尔值来控制是否移动文件：

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachment')
    ->moveFiles(FeatureFlag::active())
```

:::tip
`moveFiles()` 方法除了接受静态值外，还接受函数来动态计算值。你可以在函数中注入各种工具作为参数。
:::

## 防止文件被永久存储

如果你想在表单提交时防止文件被永久存储，可以使用 `storeFiles(false)` 方法：

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachment')
    ->storeFiles(false)
```

表单提交时，将返回临时文件上传对象，而不是永久存储的文件路径。这非常适合用于临时文件，如导入的 CSV 文件。

:::tip
`storeFiles()` 方法除了接受静态值外，还接受函数来动态计算值。你可以在函数中注入各种工具作为参数。
:::

:::warning
图片、视频和音频文件不会在表单预览中显示存储的文件名，除非你使用 [`previewable(false)`](#预览文件)。这是由于 FilePond 预览插件的限制。
:::

## 根据 EXIF 数据自动调整图片方向

默认情况下，FilePond 会根据图片的 EXIF 数据自动调整方向。如果你想禁用此行为，可以使用 `orientImagesFromExif(false)` 方法：

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachment')
    ->orientImagesFromExif(false)
```

:::tip
`orientImagesFromExif()` 方法除了接受静态值外，还接受函数来动态计算值。你可以在函数中注入各种工具作为参数。
:::

## 隐藏删除文件按钮

还可以使用 `deletable(false)` 隐藏已上传文件的删除按钮：

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachment')
    ->deletable(false)
```

:::tip
`deletable()` 方法除了接受静态值外，还接受函数来动态计算值。你可以在函数中注入各种工具作为参数。
:::

## 禁用粘贴文件

你可以使用 `pasteable(false)` 方法禁用通过剪贴板粘贴文件的功能：

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachment')
    ->pasteable(false)
```

:::tip
`pasteable()` 方法除了接受静态值外，还接受函数来动态计算值。你可以在函数中注入各种工具作为参数。
:::

## 禁止获取文件信息

表单加载时会自动检测文件是否存在、文件大小以及文件类型。这一切都在后端完成。使用远程存储且有大量文件时，这可能很耗时。你可以使用 `fetchFileInformation(false)` 方法禁用此功能：

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachment')
    ->fetchFileInformation(false)
```

:::tip
`fetchFileInformation()` 方法除了接受静态值外，还接受函数来动态计算值。你可以在函数中注入各种工具作为参数。
:::

## 自定义上传消息

你可以使用 `uploadingMessage()` 方法自定义表单提交按钮中显示的上传消息：

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachment')
    ->uploadingMessage('Uploading attachment...')
```

:::tip
`uploadingMessage()` 方法除了接受静态值外，还接受函数来动态计算值。你可以在函数中注入各种工具作为参数。
:::

## 文件上传验证

除了[验证](validation)页面上列出的所有规则外，还有一些特定于文件上传的附加规则。

由于 Filament 基于 Livewire 并使用其文件上传系统，你还需要参考 `config/livewire.php` 文件中的默认 Livewire 文件上传验证规则。这也控制了 12MB 的文件大小上限。

:::info
这些验证规则中的许多只适用于新上传的文件。在添加验证规则之前已上传的现有文件不会被重新验证。
:::

### 文件类型验证

:::danger
默认情况下，`FileUpload` 接受**任何文件类型**，与 Laravel 的 `file` 验证规则相同。在由 PHP 执行的 Web 服务器提供服务的 `local` 或 `public` 磁盘上，这意味着用户可以上传 `.php` 文件并将其作为代码执行——即远程代码执行。除非有特殊原因，否则你应**始终**调用 `acceptedFileTypes()`（或 `image()`）并传入明确的 MIME 类型列表。这样做还会通过 `mimetypes` 验证规则激活 Laravel 对 PHP 系列扩展名（`.php`、`.phtml`、`.phar` 等）的内置拦截，拒绝那些客户端提供的文件名原本会作为可执行代码落盘的文件。
:::

你可以使用 `acceptedFileTypes()` 方法限制可上传的文件类型，并传递一个 MIME 类型数组。

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('document')
    ->acceptedFileTypes(['application/pdf'])
```

:::tip
`acceptedFileTypes()` 方法除了接受静态值外，还接受函数来动态计算值。你可以在函数中注入各种工具作为参数。
:::

你也可以使用 `image()` 方法作为允许所有图片 MIME 类型的简写。

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('image')
    ->image()
```

![带图片预览的文件上传](/assets/filament/v4.x/screenshots/images/light/forms/fields/file-upload/image-preview.jpg)

#### 自定义 MIME 类型映射

上传文件时，某些文件格式可能无法被浏览器正确识别。Filament 允许你使用 `mimeTypeMap()` 方法手动为特定文件扩展名定义 MIME 类型：

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('designs')
    ->acceptedFileTypes([
        'x-world/x-3dmf',
        'application/vnd.sketchup.skp',
    ])
    ->mimeTypeMap([
        '3dm' => 'x-world/x-3dmf',
        'skp' => 'application/vnd.sketchup.skp',
    ]);
```

:::tip
`mimeTypeMap()` 方法除了接受静态值外，还接受函数来动态计算值。你可以在函数中注入各种工具作为参数。
:::

### 文件大小验证

你还可以限制上传文件的大小（以千字节为单位）：

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachment')
    ->minSize(512)
    ->maxSize(1024)
```

:::tip
`minSize()` 和 `maxSize()` 方法除了接受静态值外，还接受函数来动态计算值。你可以在函数中注入各种工具作为参数。
:::

#### 上传大文件

如果你在上传大文件时遇到问题，例如浏览器控制台中 HTTP 请求返回 422 状态码，你可能需要调整配置。

在服务器的 `php.ini` 文件中，增加最大文件大小可能会解决问题：

```ini
post_max_size = 120M
upload_max_filesize = 120M
```

Livewire 在上传前也会验证文件大小。要发布 Livewire 配置文件，请运行：

```bash
php artisan livewire:publish --config
```

[最大上传大小可以在 `temporary_file_upload` 的 `rules` 键中调整](https://livewire.laravel.com/docs/uploads#global-validation)。在此规则中使用 KB 为单位，120MB 等于 122880KB：

```php
'temporary_file_upload' => [
    // ...
    'rules' => ['required', 'file', 'max:122880'],
    // ...
],
```

### 图片尺寸验证

你可以使用 `rule()` 方法配合 Laravel 的 `Rule::dimensions()` 限制上传图片的尺寸：

```php
use Filament\Forms\Components\FileUpload;
use Illuminate\Validation\Rule;

FileUpload::make('photo')
    ->image()
    ->rule(Rule::dimensions()->minWidth(800)->minHeight(600))
```

```php
use Filament\Forms\Components\FileUpload;
use Illuminate\Validation\Rule;

FileUpload::make('photo')
    ->image()
    ->rule(Rule::dimensions()->maxWidth(1920)->maxHeight(1080))
```

你可以组合最小和最大约束：

```php
use Filament\Forms\Components\FileUpload;
use Illuminate\Validation\Rule;

FileUpload::make('photo')
    ->image()
    ->rule(
        Rule::dimensions()
            ->minWidth(800)
            ->minHeight(600)
            ->maxWidth(1920)
            ->maxHeight(1080)
    )
```

:::info
这些尺寸验证规则只适用于新上传的文件。在添加验证规则之前已上传的现有文件不会被重新验证。
:::

### 图片宽高比验证

你可以使用 `imageAspectRatio()` 方法限制上传图片的宽高比：

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('banner')
    ->image()
    ->imageAspectRatio('16:9')
```

你可以通过传递数组来允许多个宽高比：

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('banner')
    ->image()
    ->imageAspectRatio(['16:9', '4:3', '1:1'])
```

:::tip
`imageAspectRatio()` 方法除了接受静态值外，还接受函数来动态计算值。你可以在函数中注入各种工具作为参数。
:::

你还可以使用 `Rule::dimensions()` 指定可接受宽高比的范围：

```php
use Filament\Forms\Components\FileUpload;
use Illuminate\Validation\Rule;

FileUpload::make('banner')
    ->image()
    ->rule(Rule::dimensions()->minRatio(4 / 3)->maxRatio(16 / 9))
```

:::info
这些宽高比验证规则只适用于新上传的文件。在添加验证规则之前已上传的现有文件不会被重新验证。
:::

:::tip
如果你想帮助用户满足宽高比要求，而不仅仅是拒绝无效上传，可以考虑在 `imageAspectRatio()` 旁边使用 [`automaticallyOpenImageEditorForAspectRatio()`](#强制使用特定宽高比)。当上传的图片不符合要求的比例时，这会自动打开裁剪编辑器。或者，你可以使用 [`automaticallyCropImagesToAspectRatio()`](#不使用编辑器裁剪和调整图片大小) 在没有用户交互的情况下自动将图片裁剪为要求的比例。
:::

### 文件数量验证

你可以使用 `minFiles()` 和 `maxFiles()` 方法自定义可上传的文件数量：

```php
use Filament\Forms\Components\FileUpload;

FileUpload::make('attachments')
    ->multiple()
    ->minFiles(2)
    ->maxFiles(5)
```

:::tip
`minFiles()` 和 `maxFiles()` 方法除了接受静态值外，还接受函数来动态计算值。你可以在函数中注入各种工具作为参数。
:::
