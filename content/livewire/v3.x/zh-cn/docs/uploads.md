---
title: 文件上传
source: https://github.com/livewire/livewire/blob/v3.8.0/docs/uploads.md
source_version: v3.8.0
translation_status: draft
---

Livewire 为在组件中上传文件提供了强大的支持。

首先，将 `WithFileUploads` trait 添加到你的组件中。一旦将此 trait 添加到组件，你就可以像使用其他输入类型一样在文件输入上使用 `wire:model`，Livewire 会处理剩下的事情。

以下是一个处理照片上传的简单组件示例：

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use Livewire\WithFileUploads;
use Livewire\Attributes\Validate;

class UploadPhoto extends Component
{
    use WithFileUploads;

    #[Validate('image|max:1024')] // 最大 1MB
    public $photo;

    public function save()
    {
        $this->photo->store(path: 'photos');
    }
}
```

```blade
<form wire:submit="save">
    <input type="file" wire:model="photo">

    @error('photo') <span class="error">{{ $message }}</span> @enderror

    <button type="submit">保存照片</button>
</form>
```

:::warning "upload" 方法是保留的
请注意，上面的示例使用了 "save" 方法而不是 "upload" 方法。这是一个常见的"陷阱"。"upload" 这个名称被 Livewire 保留。你不能在组件中将其用作 method 或属性名称。
:::

从开发者的角度来看，处理文件输入与处理任何其他输入类型没有区别：在 `<input>` 标签上添加 `wire:model`，其他一切都会自动处理。

然而，在幕后有更多的事情发生，以使文件上传在 Livewire 中正常工作。以下是用户选择文件上传时发生的过程：

1. 当选择新文件时，Livewire 的 JavaScript 向服务器上的组件发起初始请求，以获取一个临时的"签名"上传 URL。
2. 收到 URL 后，JavaScript 向签名 URL 执行实际的"上传"，将上传的文件存储在 Livewire 指定的临时目录中，并返回新临时文件的唯一哈希 ID。
3. 文件上传完成并生成唯一哈希 ID 后，Livewire 的 JavaScript 向服务器上的组件发起最终请求，告知其将所需的公共属性"设置"为新的临时文件。
4. 现在，公共属性（本例中为 `$photo`）被设置为临时文件上传，随时可以存储或验证。

## 存储上传的文件

前面的示例演示了最基本的存储场景：将临时上传的文件移动到应用默认文件系统磁盘的 "photos" 目录。

但是，你可能希望自定义存储文件的名称，甚至指定特定的存储"磁盘"来保存文件（例如 S3）。

:::tip 原始文件名
你可以通过调用临时上传文件的 `->getClientOriginalName()` 方法来获取其原始文件名。
:::

Livewire 遵循 Laravel 用于存储上传文件的相同 API，因此请随意查阅 [Laravel 的文件上传文档](https://laravel.com/docs/filesystem#file-uploads)。不过，下面列出了一些常见的存储场景和示例：

```php
public function save()
{
    // 将文件存储在默认文件系统磁盘的 "photos" 目录中
    $this->photo->store(path: 'photos');

    // 将文件存储在已配置的 "s3" 磁盘的 "photos" 目录中
    $this->photo->store(path: 'photos', options: 's3');

    // 将文件存储在 "photos" 目录中，文件名为 "avatar.png"
    $this->photo->storeAs(path: 'photos', name: 'avatar');

    // 将文件存储在已配置的 "s3" 磁盘的 "photos" 目录中，文件名为 "avatar.png"
    $this->photo->storeAs(path: 'photos', name: 'avatar', options: 's3');

    // 将文件存储在已配置的 "s3" 磁盘的 "photos" 目录中，可见性为 "public"
    $this->photo->storePublicly(path: 'photos', options: 's3');

    // 将文件存储在已配置的 "s3" 磁盘的 "photos" 目录中，文件名为 "avatar.png"，可见性为 "public"
    $this->photo->storePubliclyAs(path: 'photos', name: 'avatar', options: 's3');
}
```

## 处理多个文件

Livewire 通过检测 `<input>` 标签上的 `multiple` 属性来自动处理多文件上传。

例如，下面是一个具有名为 `$photos` 的数组属性的组件。通过在表单的文件输入上添加 `multiple`，Livewire 会自动将新文件追加到此数组：

```php
use Livewire\Component;
use Livewire\WithFileUploads;
use Livewire\Attributes\Validate;

class UploadPhotos extends Component
{
    use WithFileUploads;

    #[Validate(['photos.*' => 'image|max:1024'])]
    public $photos = [];

    public function save()
    {
        foreach ($this->photos as $photo) {
            $photo->store(path: 'photos');
        }
    }
}
```

```blade
<form wire:submit="save">
    <input type="file" wire:model="photos" multiple>

    @error('photos.*') <span class="error">{{ $message }}</span> @enderror

    <button type="submit">保存照片</button>
</form>
```

## 文件验证

正如我们讨论过的，使用 Livewire 验证文件上传与处理标准 Laravel 控制器的文件上传相同。

:::warning 确保 S3 正确配置
许多与文件相关的验证规则需要访问文件。当[直接上传到 S3](#直接上传到-amazon-s3)时，如果 S3 文件对象不可公开访问，这些验证规则将失败。
:::

有关文件验证的更多信息，请查阅 [Laravel 的文件验证文档](https://laravel.com/docs/validation#available-validation-rules)。

## 临时预览 URL

用户选择文件后，通常应该在他们提交表单并存储文件之前显示文件的预览。

Livewire 通过在上传的文件上使用 `->temporaryUrl()` 方法使这变得非常简单。

:::info 临时 URL 仅限于图片
出于安全原因，临时预览 URL 仅支持具有图片 MIME 类型的文件。
:::

让我们探索一个带有图片预览的文件上传示例：

```php
use Livewire\Component;
use Livewire\WithFileUploads;
use Livewire\Attributes\Validate;

class UploadPhoto extends Component
{
    use WithFileUploads;

    #[Validate('image|max:1024')]
    public $photo;

    // ...
}
```

```blade
<form wire:submit="save">
    @if ($photo) <!-- [tl! highlight:2] -->
        <img src="{{ $photo->temporaryUrl() }}">
    @endif

    <input type="file" wire:model="photo">

    @error('photo') <span class="error">{{ $message }}</span> @enderror

    <button type="submit">保存照片</button>
</form>
```

如前所述，Livewire 将临时文件存储在非公共目录中；因此，通常没有简单的方法向用户公开临时公共 URL 用于图片预览。

然而，Livewire 通过提供一个临时的签名 URL 来解决这个问题，该 URL 模拟上传的图片，以便你的页面可以向用户显示图片预览。

此 URL 受到保护，无法显示临时目录上层目录中的文件。而且，由于它是签名的，用户无法滥用此 URL 来预览系统上的其他文件。

:::tip S3 临时签名 URL
如果你已将 Livewire 配置为使用 S3 进行临时文件存储，调用 `->temporaryUrl()` 将生成一个直接指向 S3 的临时签名 URL，这样图片预览就不会从你的 Laravel 应用服务器加载。
:::

## 测试文件上传

你可以使用 Laravel 现有的文件上传测试辅助方法来测试文件上传。

以下是使用 Livewire 测试 `UploadPhoto` 组件的完整示例：

```php
<?php

namespace Tests\Feature\Livewire;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use App\Livewire\UploadPhoto;
use Livewire\Livewire;
use Tests\TestCase;

class UploadPhotoTest extends TestCase
{
    public function test_can_upload_photo()
    {
        Storage::fake('avatars');

        $file = UploadedFile::fake()->image('avatar.png');

        Livewire::test(UploadPhoto::class)
            ->set('photo', $file)
            ->call('upload', 'uploaded-avatar.png');

        Storage::disk('avatars')->assertExists('uploaded-avatar.png');
    }
}
```

以下是使上述测试通过所需的 `UploadPhoto` 组件示例：

```php
use Livewire\Component;
use Livewire\WithFileUploads;

class UploadPhoto extends Component
{
    use WithFileUploads;

    public $photo;

    public function upload($name)
    {
        $this->photo->storeAs('/', $name, disk: 'avatars');
    }

    // ...
}
```

有关测试文件上传的更多信息，请查阅 [Laravel 的文件上传测试文档](https://laravel.com/docs/http-tests#testing-file-uploads)。

## 直接上传到 Amazon S3

如前所述，Livewire 将所有文件上传存储在临时目录中，直到开发者永久存储该文件。

默认情况下，Livewire 使用默认的文件系统磁盘配置（通常是 `local`），并将文件存储在 `livewire-tmp/` 目录中。

因此，文件上传始终使用你的应用服务器，即使你选择稍后将上传的文件存储在 S3 存储桶中。

如果你希望绕过应用服务器，直接将 Livewire 的临时上传文件存储在 S3 存储桶中，可以在应用的 `config/livewire.php` 配置文件中配置该行为。首先，将 `livewire.temporary_file_upload.disk` 设置为 `s3`（或另一个使用 `s3` 驱动的自定义磁盘）：

```php
return [
    // ...
    'temporary_file_upload' => [
        'disk' => 's3',
        // ...
    ],
];
```

现在，当用户上传文件时，文件实际上永远不会存储在你的服务器上。相反，它将被直接上传到你的 S3 存储桶中的 `livewire-tmp/` 子目录。

:::info 发布 Livewire 的配置文件
在自定义文件上传磁盘之前，你必须先通过运行以下命令将 Livewire 的配置文件发布到应用的 `/config` 目录：
```shell
php artisan livewire:publish --config
```
:::

### 配置自动文件清理

Livewire 的临时上传目录会很快被文件填满；因此，配置 S3 清理超过 24 小时的文件是至关重要的。

要配置此行为，请在使用 S3 存储桶进行文件上传的环境中运行以下 Artisan 命令：

```shell
php artisan livewire:configure-s3-upload-cleanup
```

现在，任何超过 24 小时的临时文件都将由 S3 自动清理。

:::info
如果你不使用 S3 进行文件存储，Livewire 会自动处理文件清理，无需运行上述命令。
:::

## 加载指示器

虽然文件上传的 `wire:model` 在底层的工作方式与其他 `wire:model` 输入类型不同，但显示加载指示器的界面是相同的。

你可以像这样显示作用于文件上传的加载指示器：

```blade
<input type="file" wire:model="photo">

<div wire:loading wire:target="photo">上传中...</div>
```

现在，在文件上传期间，"上传中..." 消息将显示，上传完成后隐藏。

有关加载状态的更多信息，请查看我们的完整[加载状态文档](/docs/livewire/v3.x/wire-loading)。

## 进度指示器

每次 Livewire 文件上传操作都会在相应的 `<input>` 元素上派发 JavaScript 事件，允许自定义 JavaScript 拦截这些事件：

| 事件 | 描述 |
| --- | --- |
| `livewire-upload-start` | 上传开始时派发 |
| `livewire-upload-finish` | 上传成功完成时派发 |
| `livewire-upload-cancel` | 上传被提前取消时派发 |
| `livewire-upload-error` | 上传失败时派发 |
| `livewire-upload-progress` | 在上传过程中包含上传进度百分比的事件 |

以下是将 Livewire 文件上传包裹在 Alpine 组件中以显示上传进度条的示例：

```blade
<form wire:submit="save">
    <div
        x-data="{ uploading: false, progress: 0 }"
        x-on:livewire-upload-start="uploading = true"
        x-on:livewire-upload-finish="uploading = false"
        x-on:livewire-upload-cancel="uploading = false"
        x-on:livewire-upload-error="uploading = false"
        x-on:livewire-upload-progress="progress = $event.detail.progress"
    >
        <!-- 文件输入 -->
        <input type="file" wire:model="photo">

        <!-- 进度条 -->
        <div x-show="uploading">
            <progress max="100" x-bind:value="progress"></progress>
        </div>
    </div>

    <!-- ... -->
</form>
```

## 取消上传

如果上传时间过长，用户可能希望取消它。你可以使用 Livewire 的 `$cancelUpload()` JavaScript 函数提供此功能。

以下是使用 `wire:click` 处理点击事件在 Livewire 组件中创建"取消上传"按钮的示例：

```blade
<form wire:submit="save">
    <!-- 文件输入 -->
    <input type="file" wire:model="photo">

    <!-- 取消上传按钮 -->
    <button type="button" wire:click="$cancelUpload('photo')">取消上传</button>

    <!-- ... -->
</form>
```

当按下"取消上传"时，文件上传请求将被中止，文件输入将被清除。用户现在可以尝试使用其他文件重新上传。

或者，你可以像这样从 Alpine 调用 `cancelUpload(...)`：

```blade
<button type="button" x-on:click="$wire.cancelUpload('photo')">取消上传</button>
```

## JavaScript 上传 API

与第三方文件上传库集成时，通常需要比简单的 `<input type="file" wire:model="...">` 元素更多的控制。

对于这些场景，Livewire 提供了专用的 JavaScript 函数。

这些函数存在于 JavaScript 组件对象上，你可以在 Livewire 组件的模板中使用 Livewire 便捷的 `$wire` 对象访问该对象：

```blade
@script
<script>
    let file = $wire.el.querySelector('input[type="file"]').files[0]

    // 上传单个文件...
    $wire.upload('photo', file, (uploadedFilename) => {
        // 成功回调...
    }, () => {
        // 错误回调...
    }, (event) => {
        // 进度回调...
        // event.detail.progress 包含一个介于 1 和 100 之间的数字，表示上传进度
    }, () => {
        // 取消回调...
    })

    // 上传多个文件...
    $wire.uploadMultiple('photos', [file], successCallback, errorCallback, progressCallback, cancelledCallback)

    // 从多个上传的文件中移除单个文件...
    $wire.removeUpload('photos', uploadedFilename, successCallback)

    // 取消上传...
    $wire.cancelUpload('photos')
</script>
@endscript
```

## 配置

由于 Livewire 在开发者验证或存储之前将所有文件上传临时存储，因此它假设了所有文件上传的一些默认处理行为。

### 全局验证

默认情况下，Livewire 将使用以下规则验证所有临时文件上传：`file|max:12288`（必须是小于 12MB 的文件）。

如果你希望自定义这些规则，可以在应用的 `config/livewire.php` 文件中进行配置：

```php
'temporary_file_upload' => [
    // ...
    'rules' => 'file|mimes:png,jpg,pdf|max:102400', // （最大 100MB，仅接受 PNG、JPEG 和 PDF）
],
```

### 全局中间件

临时文件上传端点默认分配了限流中间件。你可以通过以下配置选项自定义此端点使用的中间件：

```php
'temporary_file_upload' => [
    // ...
    'middleware' => 'throttle:5,1', // 每个用户每分钟仅允许 5 次上传
],
```

### 临时上传目录

临时文件上传到指定磁盘的 `livewire-tmp/` 目录。你可以通过以下配置选项自定义此目录：

```php
'temporary_file_upload' => [
    // ...
    'directory' => 'tmp',
],
```
