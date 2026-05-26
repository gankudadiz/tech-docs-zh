---
title: 安全
source: https://github.com/livewire/livewire/blob/v3.8.0/docs/security.md
source_version: v3.8.0
translation_status: draft
---

确保你的 Livewire 应用安全且不暴露任何应用漏洞非常重要。Livewire 具有内部安全功能来处理许多情况，然而，有时需要依靠你的应用代码来确保组件安全。

## 授权操作参数

Livewire 的操作功能非常强大，然而，传递给 Livewire 操作的任何参数在客户端都是可变的，应被视为不可信的用户输入。

可以说，Livewire 中最常见的安全陷阱是在将更改持久化到数据库之前，未能验证和授权 Livewire 操作调用。

以下是一个因缺乏授权而导致不安全的示例：

```php
<?php

use App\Models\Post;
use Livewire\Component;

class ShowPost extends Component
{
    // ...

    public function delete($id)
    {
        // 不安全!

        $post = Post::find($id);

        $post->delete();
    }
}
```

```html
<button wire:click="delete({{ $post->id }})">Delete Post</button>
```

上述示例不安全的原因是 `wire:click="delete(...)"` 可以在浏览器中被修改，恶意用户可以传递任意文章 ID。

操作参数（如此例中的 `$id`）应被视为与来自浏览器的任何不可信输入相同。

因此，为了保持应用安全并防止用户删除其他用户的文章，我们必须为 `delete()` 操作添加授权。

首先，运行以下命令为 Post 模型创建一个 [Laravel 策略](https://laravel.com/docs/authorization#creating-policies)：

```bash
php artisan make:policy PostPolicy --model=Post
```

运行上述命令后，将创建一个新的策略文件 `app/Policies/PostPolicy.php`。我们可以用 `delete` 方法更新其内容，如下所示：

```php
<?php

namespace App\Policies;

use App\Models\Post;
use App\Models\User;

class PostPolicy
{
    /**
     * 判断给定的文章是否可以被用户删除。
     */
    public function delete(?User $user, Post $post): bool
    {
        return $user?->id === $post->user_id;
    }
}
```

现在，我们可以从 Livewire 组件中使用 `$this->authorize()` 方法，以确保用户在删除文章之前是该文章的所有者：

```php
public function delete($id)
{
    $post = Post::find($id);

    // 如果用户不拥有该文章，
    // 将抛出 AuthorizationException…
    $this->authorize('delete', $post); // [tl! highlight]

    $post->delete();
}
```

扩展阅读：
* [Laravel Gates](https://laravel.com/docs/authorization#gates)
* [Laravel 策略](https://laravel.com/docs/authorization#creating-policies)

## 授权公共属性

与操作参数类似，Livewire 中的公共属性应被视为用户端的不可信输入。

以下是上面关于删除文章的相同示例，但以另一种不安全的方式编写：

```php
<?php

use App\Models\Post;
use Livewire\Component;

class ShowPost extends Component
{
    public $postId;

    public function mount($postId)
    {
        $this->postId = $postId;
    }

    public function delete()
    {
        // 不安全!

        $post = Post::find($this->postId);

        $post->delete();
    }
}
```

```html
<button wire:click="delete">Delete Post</button>
```

如你所见，我们没有将 `$postId` 作为参数从 `wire:click` 传递给 `delete` 方法，而是将其存储为 Livewire 组件的公共属性。

这种方法的问题在于，任何恶意用户都可以向页面注入自定义元素，例如：

```html
<input type="text" wire:model="postId">
```

这将允许他们在按下"Delete Post"之前自由修改 `$postId`。由于 `delete` 操作没有授权 `$postId` 的值，用户现在可以删除数据库中的任何文章，无论是否属于自己。

为防止这种风险，有两种可能的解决方案：

### 使用模型属性

在设置公共属性时，Livewire 对模型的处理与字符串和整数等普通值的处理方式不同。因此，如果我们将整个文章模型存储为组件的属性，Livewire 将确保其 ID 永远不会被篡改。

以下是将 `$post` 属性存储而不是简单的 `$postId` 属性的示例：

```php
<?php

use App\Models\Post;
use Livewire\Component;

class ShowPost extends Component
{
    public Post $post;

    public function mount($postId)
    {
        $this->post = Post::find($postId);
    }

    public function delete()
    {
        $this->post->delete();
    }
}
```

```html
<button wire:click="delete">Delete Post</button>
```

这个组件现在是安全的，因为恶意用户无法将 `$post` 属性更改为不同的 Eloquent 模型。

### 锁定属性

另一种防止属性被设置为不需要的值的方法是使用[锁定属性](https://livewire.laravel.com/docs/locked)。锁定属性通过应用 `#[Locked]` 属性来完成。现在如果用户尝试篡改此值，将抛出错误。

请注意，具有 Locked 属性的属性仍然可以在后端更改，因此仍需要注意不要在你自己的 Livewire 方法中将不可信的用户输入传递给该属性。

```php
<?php

use App\Models\Post;
use Livewire\Component;
use Livewire\Attributes\Locked;

class ShowPost extends Component
{
    #[Locked] // [tl! highlight]
    public $postId;

    public function mount($postId)
    {
        $this->postId = $postId;
    }

    public function delete()
    {
        $post = Post::find($this->postId);

        $post->delete();
    }
}
```

### 授权属性

如果在你的场景中不希望使用模型属性，当然可以回退到在 `delete` 操作中手动授权删除文章：

```php
<?php

use App\Models\Post;
use Livewire\Component;

class ShowPost extends Component
{
    public $postId;

    public function mount($postId)
    {
        $this->postId = $postId;
    }

    public function delete()
    {
        $post = Post::find($this->postId);

        $this->authorize('delete', $post); // [tl! highlight]

        $post->delete();
    }
}
```

```html
<button wire:click="delete">Delete Post</button>
```

现在，即使恶意用户仍然可以自由修改 `$postId` 的值，当调用 `delete` 操作时，如果用户不拥有该文章，`$this->authorize()` 将抛出 `AuthorizationException`。

扩展阅读：
* [Laravel Gates](https://laravel.com/docs/authorization#gates)
* [Laravel 策略](https://laravel.com/docs/authorization#creating-policies)

## 中间件

当 Livewire 组件在包含路由级别[授权中间件](https://laravel.com/docs/authorization#via-middleware)的页面上加载时，例如：

```php
Route::get('/post/{post}', App\Livewire\UpdatePost::class)
    ->middleware('can:update,post'); // [tl! highlight]
```

Livewire 将确保这些中间件在后续的 Livewire 网络请求中重新应用。这在 Livewire 核心中被称为"持久中间件"。

持久中间件可以保护你免受初始页面加载后授权规则或用户权限发生变化的场景。

以下是这种场景的更深入示例：

```php
Route::get('/post/{post}', App\Livewire\UpdatePost::class)
    ->middleware('can:update,post'); // [tl! highlight]
```

```php
<?php

use App\Models\Post;
use Livewire\Component;
use Livewire\Attributes\Validate;

class UpdatePost extends Component
{
    public Post $post;

    #[Validate('required|min:5')]
    public $title = '';

    public $content = '';

    public function mount()
    {
        $this->title = $this->post->title;
        $this->content = $this->post->content;
    }

    public function update()
    {
        $this->post->update([
            'title' => $this->title,
            'content' => $this->content,
        ]);
    }
}
```

如你所见，`can:update,post` 中间件应用在路由级别。这意味着没有更新文章权限的用户无法查看该页面。

然而，考虑这样一个场景：用户：
* 加载了页面
* 在页面加载后失去了更新权限
* 在失去权限后尝试更新文章

由于 Livewire 已经成功加载了页面，你可能会问自己："当 Livewire 发起后续请求来更新文章时，`can:update,post` 中间件会被重新应用吗？还是未授权的用户能够成功更新文章？"

因为 Livewire 具有重新应用原始端点中间件的内部机制，你在这种场景下是受保护的。

### 配置持久中间件

默认情况下，Livewire 会在网络请求中持久化以下中间件：

```php
\Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
\Laravel\Jetstream\Http\Middleware\AuthenticateSession::class,
\Illuminate\Auth\Middleware\AuthenticateWithBasicAuth::class,
\Illuminate\Routing\Middleware\SubstituteBindings::class,
\App\Http\Middleware\RedirectIfAuthenticated::class,
\Illuminate\Auth\Middleware\Authenticate::class,
\Illuminate\Auth\Middleware\Authorize::class,
```

如果上述任何中间件应用于初始页面加载，它们将被持久化（重新应用）到未来的任何网络请求中。

然而，如果你在初始页面加载时应用了来自应用的自定义中间件，并希望它在 Livewire 请求之间持久化，你需要从[服务提供者](https://laravel.com/docs/providers#main-content)中将其添加到此列表，如下所示：

```php
<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Livewire;

class AppServiceProvider extends ServiceProvider
{
    /**
     * 引导任何应用服务。
     */
    public function boot(): void
    {
        Livewire::addPersistentMiddleware([ // [tl! highlight:2]
            App\Http\Middleware\EnsureUserHasRole::class,
        ]);
    }
}
```

如果 Livewire 组件在使用了应用 `EnsureUserHasRole` 中间件的页面上加载，现在它将被持久化并重新应用于对该 Livewire 组件的任何未来网络请求。

:::warning[不支持中间件参数]
Livewire 目前不支持持久中间件定义中的中间件参数。

```php
// 错误…
Livewire::addPersistentMiddleware(AuthorizeResource::class.':admin');

// 正确…
Livewire::addPersistentMiddleware(AuthorizeResource::class);
```
:::

### 应用全局 Livewire 中间件

或者，如果你希望对每个 Livewire 更新网络请求都应用特定的中间件，你可以通过注册自己的 Livewire 更新路由并添加你希望的任何中间件来实现：

```php
Livewire::setUpdateRoute(function ($handle) {
	return Route::post('/livewire/update', $handle)
        ->middleware(App\Http\Middleware\LocalizeViewPaths::class);
});
```

任何向服务器发起的 Livewire AJAX/fetch 请求都将使用上述端点，并在处理组件更新之前应用 `LocalizeViewPaths` 中间件。

了解更多关于[在安装页面上自定义更新路由](https://livewire.laravel.com/docs/installation#configuring-livewires-update-endpoint)。

## 快照校验和

在每次 Livewire 请求之间，会为 Livewire 组件拍摄快照并发送到浏览器。此快照用于在下一次服务器往返期间重建组件。

[在 Hydration 文档中了解更多关于 Livewire 快照的信息。](https://livewire.laravel.com/docs/hydration#the-snapshot)

由于 fetch 请求可以在浏览器中被拦截和篡改，Livewire 会为每个快照生成一个"校验和"（checksum）与之配套。

此校验和在下一个网络请求中使用，以验证快照未以任何方式被更改。

如果 Livewire 发现校验和不匹配，它将抛出 `CorruptComponentPayloadException`，请求将失败。

这保护了免受任何形式的恶意篡改，否则会导致用户获得执行或修改无关代码的能力。
