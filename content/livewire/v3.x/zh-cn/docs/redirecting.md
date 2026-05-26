---
title: 重定向
source: https://github.com/livewire/livewire/blob/v3.8.0/docs/redirecting.md
source_version: v3.8.0
translation_status: draft
---

在用户执行某些操作（如提交表单）后，你可能希望将他们重定向到应用中的另一个页面。

由于 Livewire 请求不是标准的全页面浏览器请求，标准的 HTTP 重定向将无法工作。相反，你需要通过 JavaScript 触发重定向。幸运的是，Livewire 在组件中暴露了一个简单的 `$this->redirect()` 辅助方法。在内部，Livewire 会处理在前端进行重定向的过程。

如果你愿意，你也可以在组件中使用 [Laravel 的内置重定向工具](https://laravel.com/docs/responses#redirects)。

## 基本用法

以下是一个 `CreatePost` Livewire 组件的示例，该组件在用户提交创建帖子的表单后将用户重定向到另一个页面：

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Post;

class CreatePost extends Component
{
	public $title = '';

    public $content = '';

    public function save()
    {
		Post::create([
			'title' => $this->title,
			'content' => $this->content,
		]);

		$this->redirect('/posts'); // [tl! highlight]
    }

    public function render()
    {
        return view('livewire.create-post');
    }
}
```

如你所见，当 `save` 操作被触发时，也会触发一个到 `/posts` 的重定向。当 Livewire 接收到此 response（响应）时，它会在前端将用户重定向到新的 URL。

## 重定向到路由

如果你希望使用路由名称重定向到页面，可以使用 `redirectRoute`。

例如，如果你有一个名为 `'profile'` 的路由页面，如下所示：

```php
    Route::get('/user/profile', function () {
        // ...
    })->name('profile');
```

你可以使用 `redirectRoute` 通过路由名称重定向到该页面：

```php
    $this->redirectRoute('profile');
```

如果你需要向路由传递参数，可以使用 `redirectRoute` 方法的第二个参数，如下所示：

```php
    $this->redirectRoute('profile', ['id' => 1]);
```

## 重定向到 intended

如果你希望将用户重定向回他们之前所在的页面，可以使用 `redirectIntended`。它接受一个可选的默认 URL 作为第一个参数，当无法确定之前的页面时用作回退：

```php
    $this->redirectIntended('/default/url');
```

## 重定向到全页面组件

由于 Livewire 使用 Laravel 的内置重定向功能，你可以使用典型 Laravel 应用中所有可用的重定向方法。

例如，如果你正在使用 Livewire 组件作为路由的全页面组件，如下所示：

```php
use App\Livewire\ShowPosts;

Route::get('/posts', ShowPosts::class);
```

你可以通过向 `redirect()` 方法提供组件名称来重定向到该组件：

```php
public function save()
{
    // ...

    $this->redirect(ShowPosts::class);
}
```

## Flash 消息

除了允许你使用 Laravel 的内置重定向方法外，Livewire 还支持 Laravel 的 [session flash 数据工具](https://laravel.com/docs/session#flash-data)。

要随重定向一起传递 flash 数据，你可以使用 Laravel 的 `session()->flash()` 方法，如下所示：

```php
use Livewire\Component;

class UpdatePost extends Component
{
    // ...

    public function update()
    {
        // ...

        session()->flash('status', 'Post successfully updated.');

        $this->redirect('/posts');
    }
}
```

假设被重定向到的页面包含以下 Blade 片段，用户在更新帖子后将看到"Post successfully updated."的消息：

```blade
@if (session('status'))
    <div class="alert alert-success">
        {{ session('status') }}
    </div>
@endif
```
