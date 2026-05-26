---
title: 计算属性
source: https://github.com/livewire/livewire/blob/v3.8.0/docs/computed-properties.md
source_version: v3.8.0
translation_status: draft
---

Computed property（计算属性）是一种在 Livewire 中创建"派生"属性的方式。类似于 Eloquent 模型上的访问器，计算属性允许你访问值，并在请求期间缓存这些值以供后续访问。

计算属性在与组件的公共属性结合使用时特别有用。

## 基本用法

要创建一个计算属性，你可以在 Livewire 组件的任何方法上添加 `#[Computed]` attribute（属性）。一旦为方法添加了该属性，你就可以像访问任何其他属性一样访问它。

> [!warning] 确保导入 attribute 类
> 确保导入所有 attribute 类。例如，下面的 `#[Computed]` attribute 需要导入 `use Livewire\Attributes\Computed;`。

例如，以下是一个 `ShowUser` 组件，它使用名为 `user()` 的计算属性，基于 `$userId` 属性来访问 `User` Eloquent 模型：

```php
<?php

use Illuminate\Support\Facades\Auth;
use Livewire\Attributes\Computed;
use Livewire\Component;
use App\Models\User;

class ShowUser extends Component
{
    public $userId;

    #[Computed]
    public function user()
    {
        return User::find($this->userId);
    }

    public function follow()
    {
        Auth::user()->follow($this->user);
    }

    public function render()
    {
        return view('livewire.show-user');
    }
}
```

```blade
<div>
    <h1>{{ $this->user->name }}</h1>

    <span>{{ $this->user->email }}</span>

    <button wire:click="follow">Follow</button>
</div>
```

由于 `user()` 方法上添加了 `#[Computed]` attribute，该值可以在组件的其他方法以及 Blade 模板中访问。

> [!info] 在模板中必须使用 `$this`
> 与普通属性不同，计算属性不能直接在组件模板中使用。你必须在 `$this` 对象上访问它们。例如，名为 `posts()` 的计算属性必须在模板中通过 `$this->posts` 访问。

> [!warning] `Livewire\Form` 对象不支持计算属性
> 尝试在 [Form](https://livewire.laravel.com/docs/forms) 中使用计算属性会在你尝试在 blade 中使用 `$form->property` 语法访问属性时导致错误。

## 性能优势

你可能会问自己：为什么要使用计算属性？为什么不直接调用方法？

以计算属性的方式访问方法相比直接调用方法具有性能优势。在内部，当计算属性首次执行时，Livewire 会缓存返回的值。这样，后续在请求中的任何访问都将返回缓存的值，而不是多次执行。

这使你能够自由地访问派生值，而无需担心性能影响。

> [!warning] 计算属性仅缓存单个请求
> 一个常见的误解是 Livewire 会在页面上你的 Livewire 组件的整个生命周期中缓存计算属性。但事实并非如此。实际上，Livewire 仅在单个组件请求期间缓存结果。这意味着如果你的计算属性方法包含昂贵的数据库查询，它将在每次 Livewire 组件执行更新时执行。

### 清除缓存

请考虑以下有问题的情况：
1. 你访问了一个依赖于某个属性或数据库状态的计算属性
2. 底层属性或数据库状态发生了变化
3. 该属性的缓存值已过时，需要重新计算

要清除（或"爆破"）已存储的缓存，你可以使用 PHP 的 `unset()` 函数。

以下是一个名为 `createPost()` 的操作示例，该操作通过创建新帖子，使 `posts()` 计算属性变得过时——这意味着需要重新计算 `posts()` 计算属性以包含新添加的帖子：

```php
<?php

use Illuminate\Support\Facades\Auth;
use Livewire\Attributes\Computed;
use Livewire\Component;

class ShowPosts extends Component
{
    public function createPost()
    {
        if ($this->posts->count() > 10) {
            throw new \Exception('Maximum post count exceeded');
        }

        Auth::user()->posts()->create(...);

        unset($this->posts); // [tl! highlight]
    }

    #[Computed]
    public function posts()
    {
        return Auth::user()->posts;
    }

    // ...
}
```

在上面的组件中，计算属性在新帖子创建之前已被缓存，因为 `createPost()` 方法在创建新帖子之前访问了 `$this->posts`。为了确保在视图中访问 `$this->posts` 时包含最新的内容，我们使用 `unset($this->posts)` 使缓存失效。

### 跨请求缓存

有时你可能希望将计算属性的值缓存在 Livewire 组件的整个生命周期内，而不是在每次请求后都清除。在这些情况下，你可以使用 [Laravel 的缓存工具](https://laravel.com/docs/cache#retrieve-store)。

以下是一个名为 `user()` 的计算属性示例，我们没有直接执行 Eloquent 查询，而是将查询包装在 `Cache::remember()` 中，以确保任何后续请求从 Laravel 的缓存中获取它，而不是重新执行查询：

```php
<?php

use Illuminate\Support\Facades\Cache;
use Livewire\Attributes\Computed;
use Livewire\Component;
use App\Models\User;

class ShowUser extends Component
{
    public $userId;

    #[Computed]
    public function user()
    {
        $key = 'user'.$this->getId();
        $seconds = 3600; // 1 小时...

        return Cache::remember($key, $seconds, function () {
            return User::find($this->userId);
        });
    }

    // ...
}
```

由于每个 Livewire 组件的唯一实例都有唯一的 ID，我们可以使用 `$this->getId()` 生成一个唯一的缓存键，该键仅适用于同一组件实例的后续请求。

但是，你可能已经注意到，这些代码大部分是可预测的，并且可以很容易地抽象出来。因此，Livewire 的 `#[Computed]` attribute 提供了一个有用的 `persist` 参数。通过为方法应用 `#[Computed(persist: true)]`，你可以在不编写额外代码的情况下实现相同的结果：

```php
use Livewire\Attributes\Computed;
use App\Models\User;

#[Computed(persist: true)]
public function user()
{
    return User::find($this->userId);
}
```

在上面的示例中，当从组件中访问 `$this->user` 时，它将在页面上 Livewire 组件的整个生命周期内保持缓存。这意味着实际的 Eloquent 查询只会执行一次。

Livewire 将持久化值的缓存时间设置为 3600 秒（一小时）。你可以通过向 `#[Computed]` attribute 传递额外的 `seconds` 参数来覆盖此默认值：

```php
#[Computed(persist: true, seconds: 7200)]
```

> [!tip] 调用 `unset()` 将清除此缓存
> 如前所述，你可以使用 PHP 的 `unset()` 方法清除计算属性的缓存。这也适用于使用了 `persist: true` 参数的计算属性。当对已缓存的计算属性调用 `unset()` 时，Livewire 不仅会清除计算属性的缓存，还会清除 Laravel 缓存中的底层缓存值。

## 跨所有组件缓存

你可以使用 `#[Computed]` attribute 提供的 `cache: true` 参数，将计算属性的值缓存在应用中所有组件之间，而不是在单个组件的生命周期内缓存：

```php
use Livewire\Attributes\Computed;
use App\Models\Post;

#[Computed(cache: true)]
public function posts()
{
    return Post::all();
}
```

在上面的示例中，在缓存过期或清除之前，应用中此组件的每个实例都将共享 `$this->posts` 的相同缓存值。

如果需要手动清除计算属性的缓存，你可以使用 `key` 参数设置自定义缓存键：

```php
use Livewire\Attributes\Computed;
use App\Models\Post;

#[Computed(cache: true, key: 'homepage-posts')]
public function posts()
{
    return Post::all();
}
```

## 何时使用计算属性？

除了提供性能优势外，还有一些其他场景中计算属性也很有帮助。

具体来说，在将数据传递到组件的 Blade 模板时，有几种情况下计算属性是更好的选择。下面是一个简单组件的 `render()` 方法将 `posts` 集合传递到 Blade 模板的示例：

```php
public function render()
{
    return view('livewire.show-posts', [
        'posts' => Post::all(),
    ]);
}
```

```blade
<div>
    @foreach ($posts as $post)
        <!-- ... -->
    @endforeach
</div>
```

虽然这对许多用例来说已经足够，但以下三种情况下，计算属性会是更好的选择：

### 条件式访问值

如果你在 Blade 模板中条件式地访问一个计算成本较高的值，可以使用计算属性来减少性能开销。

请考虑以下没有使用计算属性的模板：

```blade
<div>
    @if (Auth::user()->can_see_posts)
        @foreach ($posts as $post)
            <!-- ... -->
        @endforeach
    @endif
</div>
```

如果用户被限制查看帖子，那么用于检索帖子的数据库查询已经执行，但帖子从未在模板中使用过。

以下是使用计算属性改写上述场景的版本：

```php
use Livewire\Attributes\Computed;
use App\Models\Post;

#[Computed]
public function posts()
{
    return Post::all();
}

public function render()
{
    return view('livewire.show-posts');
}
```

```blade
<div>
    @if (Auth::user()->can_see_posts)
        @foreach ($this->posts as $post)
            <!-- ... -->
        @endforeach
    @endif
</div>
```

现在，由于我们使用计算属性将帖子提供给模板，我们只在需要数据时才执行数据库查询。

### 使用内联模板

计算属性有帮助的另一种场景是在组件中使用[内联模板](/docs/livewire/v3.x/components#inline-components)。

以下是一个内联组件的示例，由于我们在 `render()` 中直接返回模板字符串，我们无法将数据传递到视图：

```php
<?php

use Livewire\Attributes\Computed;
use Livewire\Component;
use App\Models\Post;

class ShowPosts extends Component
{
    #[Computed]
    public function posts()
    {
        return Post::all();
    }

    public function render()
    {
        return <<<HTML
        <div>
            @foreach ($this->posts as $post)
                <!-- ... -->
            @endforeach
        </div>
        HTML;
    }
}
```

在上面的示例中，如果没有使用计算属性，我们将无法显式地将数据传递到 Blade 模板中。

### 省略 render 方法

在 Livewire 中，另一种减少组件样板代码的方式是完全省略 `render()` 方法。当省略时，Livewire 会按照惯例使用自己的 `render()` 方法返回对应的 Blade 视图。

在这种情况下，你显然没有 `render()` 方法可以从中将数据传递到 Blade 视图。

与其在组件中重新引入 `render()` 方法，不如通过计算属性将数据提供给视图：

```php
<?php

use Livewire\Attributes\Computed;
use Livewire\Component;
use App\Models\Post;

class ShowPosts extends Component
{
    #[Computed]
    public function posts()
    {
        return Post::all();
    }
}
```

```blade
<div>
    @foreach ($this->posts as $post)
        <!-- ... -->
    @endforeach
</div>
```
