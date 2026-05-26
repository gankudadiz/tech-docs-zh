---
title: 动作
source: https://github.com/livewire/livewire/blob/v3.8.0/docs/actions.md
source_version: v3.8.0
translation_status: completed
---

Livewire 动作（actions）是组件上的方法，可以通过前端的交互（如点击按钮或提交表单）来触发。它们提供了在浏览器中直接调用 PHP 方法的开发体验，让你专注于应用程序的逻辑，而无需编写连接前后端的样板代码。

让我们看一个在 `CreatePost` 组件上调用 `save` 动作的基本示例：

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Post;

class CreatePost extends Component
{
    // 声明两个公共属性，它们会通过 wire:model 与前端输入双向绑定
    public $title = '';

    public $content = '';

    // save() 是一个 Livewire 动作，可在 Blade 中通过 wire:submit 触发
    public function save()
    {
        // 直接使用 $this->title 和 $this->content 获取前端输入的值
        Post::create([
            'title' => $this->title,
            'content' => $this->content,
        ]);

        // 动作支持重定向，相当于控制器中的 redirect()->to()
        return redirect()->to('/posts');
    }

    public function render()
    {
        return view('livewire.create-post');
    }
}
```

```blade
<!-- wire:submit 拦截表单提交事件，调用服务端组件的 save() 方法 -->
<form wire:submit="save"> <!-- [tl! highlight] -->
    <!-- wire:model="title" 实现 $title 属性与该输入框的双向绑定 -->
    <input type="text" wire:model="title">

    <textarea wire:model="content"></textarea>

    <button type="submit">保存</button>
</form>
```

在上面的例子中，当用户点击"保存"提交表单时，`wire:submit` 拦截 `submit` 事件并调用服务端的 `save()` 动作。

本质上，动作是一种将用户交互映射到服务端功能的方式，无需手动处理 AJAX 请求的提交和管理。

## 刷新组件

有时你可能想触发组件的简单"刷新"。例如，如果你的组件检查数据库中某个任务的状态，你可能想向用户显示一个按钮，让他们可以刷新显示的结果。

你可以使用 Livewire 内置的 `$refresh` 动作，在任何通常会引用自定义组件方法的位置使用：

```blade
<!-- $refresh 触发服务端往返，重新渲染组件但不调用任何特定方法 -->
<button type="button" wire:click="$refresh">...</button>
```

当 `$refresh` 动作被触发时，Livewire 会进行一次服务端往返并重新渲染组件，而不调用任何方法。

需要注意的是，组件中任何待处理的数据更新（例如 `wire:model` 绑定的数据）在组件刷新时都会应用到服务端。

在内部，Livewire 使用"commit"这个术语来指代 Livewire 组件在服务端被更新的任何情况。如果你更喜欢这个术语，可以使用 `$commit` 代替 `$refresh`。两者完全相同。

```blade
<!-- $commit 与 $refresh 行为完全一致，只是命名不同 -->
<button type="button" wire:click="$commit">...</button>
```

你也可以在 Livewire 组件中使用 AlpineJS 触发组件刷新：

```blade
<!-- 通过 Alpine 的 x-on:click 调用 $wire 上的 $refresh() 方法 -->
<button type="button" x-on:click="$wire.$refresh()">...</button>
```

更多信息请阅读[在 Livewire 中使用 Alpine 的文档](/docs/livewire/v3.x/alpine)。

## 确认动作

当你允许用户执行危险操作（例如从数据库中删除文章）时，你可能想向他们显示一个确认对话框，以确认他们确实要执行该操作。

Livewire 通过一个名为 `wire:confirm` 的简单指令使这变得容易：

```blade
<button
    type="button"
    wire:click="delete"
    wire:confirm="你确定要删除这篇文章吗？"
>
    删除文章 <!-- [tl! highlight:-2,1] -->
</button>
```

当 `wire:confirm` 添加到包含 Livewire 动作的元素上时，当用户尝试触发该动作时，他们将看到一个包含提供的消息的确认对话框。他们可以按"确定"确认操作，或按"取消"或 Esc 键取消。

更多信息请访问 [`wire:confirm` 文档页面](/docs/livewire/v3.x/wire-confirm)。

## 事件监听器

Livewire 支持各种事件监听器，让你能响应多种类型的用户交互：

| 监听器 | 说明 |
|--------|------|
| `wire:click` | 元素被点击时触发 |
| `wire:submit` | 表单被提交时触发 |
| `wire:keydown` | 按键按下时触发 |
| `wire:keyup` | 按键释放时触发 |
| `wire:mouseenter` | 鼠标进入元素时触发 |
| `wire:*` | `wire:` 后的任意文本将作为监听器的事件名 |

因为 `wire:` 后的事件名可以是任何内容，Livewire 支持你可能需要监听的任何浏览器事件。例如，要监听 `transitionend`，可以使用 `wire:transitionend`。

### 监听特定按键

你可以使用 Livewire 的便捷别名，将按键事件监听器缩小到特定的键或组合键。

例如，要在用户在搜索框中输入后按 `Enter` 时执行搜索，可以使用 `wire:keydown.enter`：

```blade
<!-- wire:keydown.enter 仅在输入框中按下 Enter 键时触发 searchPosts 动作 -->
<input wire:model="query" wire:keydown.enter="searchPosts">
```

你可以链式添加更多按键别名来监听组合键。例如，如果你只想在按下 `Shift` 键的同时监听 `Enter` 键，可以这样写：

```blade
<!-- 多个修饰符链式使用：Shift + Enter 组合键触发 -->
<input wire:keydown.shift.enter="...">
```

以下是所有可用的按键修饰符列表：

| 修饰符 | 键 |
|--------|-----|
| `.shift` | Shift |
| `.enter` | Enter |
| `.space` | Space |
| `.ctrl` | Ctrl |
| `.cmd` | Cmd |
| `.meta` | Mac 上为 Cmd，Windows 上为 Windows 键 |
| `.alt` | Alt |
| `.up` | 上箭头 |
| `.down` | 下箭头 |
| `.left` | 左箭头 |
| `.right` | 右箭头 |
| `.escape` | Escape |
| `.tab` | Tab |
| `.caps-lock` | Caps Lock |
| `.equal` | 等号 `=` |
| `.period` | 句点 `.` |
| `.slash` | 正斜杠 `/` |

### 事件处理器修饰符

Livewire 还包含有用的修饰符，使常见的事件处理任务变得简单。

例如，如果你需要从事件监听器内部调用 `event.preventDefault()`，可以在事件名后添加 `.prevent`：

```blade
<!-- .prevent 相当于在 JavaScript 中调用 event.preventDefault() -->
<input wire:keydown.prevent="...">
```

以下是所有可用的事件监听器修饰符及其功能：

| 修饰符 | 说明 |
|--------|------|
| `.prevent` | 相当于调用 `.preventDefault()` |
| `.stop` | 相当于调用 `.stopPropagation()` |
| `.window` | 在 `window` 对象上监听事件 |
| `.outside` | 仅监听元素"外部"的点击 |
| `.document` | 在 `document` 对象上监听事件 |
| `.once` | 确保监听器只被调用一次 |
| `.debounce` | 默认延迟 250ms 处理处理器 |
| `.debounce.100ms` | 以自定义时长延迟处理处理器 |
| `.throttle` | 默认每 250ms 至少调用一次处理器 |
| `.throttle.100ms` | 以自定义频率节流处理器 |
| `.self` | 仅当事件源自此元素而非子元素时调用 |
| `.camel` | 将事件名转换为驼峰式（`wire:custom-event` → "customEvent"） |
| `.dot` | 将事件名转换为点号表示法（`wire:custom-event` → "custom.event"） |
| `.passive` | `wire:touchstart.passive` 不会阻塞滚动性能 |
| `.capture` | 在"捕获"阶段监听事件 |

由于 `wire:` 底层使用了 [Alpine](https://alpinejs.dev) 的 `x-on` 指令，这些修饰符由 Alpine 提供。关于何时使用这些修饰符的更多上下文，请查阅 [Alpine 事件文档](https://alpinejs.dev/essentials/events)。

### 处理第三方事件

Livewire 还支持监听第三方库触发的自定义事件。

例如，假设你在项目中使用了 [Trix](https://trix-editor.org/) 富文本编辑器，并且想监听 `trix-change` 事件以获取编辑器内容。你可以使用 `wire:trix-change` 指令来实现：

```blade
<form wire:submit="save">
    <!-- ... -->

    <!-- wire:trix-change 监听 Trix 编辑器的 trix-change 自定义事件 -->
    <!-- $event.target.value 获取编辑器当前的 HTML 内容 -->
    <trix-editor
        wire:trix-change="setPostContent($event.target.value)"
    ></trix-editor>

    <!-- ... -->
</form>
```

在此示例中，每当 `trix-change` 事件被触发时，都会调用 `setPostContent` 动作，将 Trix 编辑器的当前值更新到 Livewire 组件的 `content` 属性中。

:::info
你可以使用 `$event` 访问事件对象
在 Livewire 事件处理器中，你可以通过 `$event` 访问事件对象。这对于引用事件上的信息非常有用。例如，你可以通过 `$event.target` 访问触发事件的元素。
:::

:::warning
上面的 Trix 演示代码不完整，仅用于演示事件监听器。如果直接使用，每次按键都会触发网络请求。更高效的实现方式是：

```blade
<!-- 改用 Alpine 的 x-on 在客户端直接更新 $wire.content，避免每次按键都发请求 -->
<trix-editor
   x-on:trix-change="$wire.content = $event.target.value"
></trix-editor>
```
:::

### 监听触发的自定义事件

如果你的应用程序从 Alpine 触发自定义事件，你也可以使用 Livewire 来监听这些事件：

```blade
<!-- wire:custom-event 监听从 Alpine $dispatch 触发的自定义事件 -->
<div wire:custom-event="...">

    <!-- 在此组件的深层嵌套中： -->
    <button x-on:click="$dispatch('custom-event')">...</button>

</div>
```

在上面的例子中，当点击按钮时，`custom-event` 事件被触发并冒泡到 Livewire 组件的根元素，在那里 `wire:custom-event` 捕获它并调用给定的动作。

如果你想在应用程序其他位置触发的事件，需要等待该事件冒泡到 `window` 对象并在那里监听。幸运的是，Livewire 通过允许你在任何事件监听器上添加 `.window` 修饰符来简化这一点：

```blade
<!-- .window 修饰符让监听器挂载到 window 对象上，捕获页面上任意位置分发的同名事件 -->
<div wire:custom-event.window="...">
    <!-- ... -->
</div>

<!-- 在组件外部的页面上某处触发： -->
<button x-on:click="$dispatch('custom-event')">...</button>
```

### 在表单提交时禁用输入

回想一下我们之前讨论的 `CreatePost` 示例：

```blade
<form wire:submit="save">
    <input wire:model="title">

    <textarea wire:model="content"></textarea>

    <button type="submit">保存</button>
</form>
```

当用户点击"保存"时，会发送一个网络请求到服务端调用 Livewire 组件的 `save()` 动作。

但是，假设用户在网络连接较慢的情况下填写此表单。用户点击"保存"后，由于网络请求耗时较长，最初没有任何反应。他们可能会怀疑提交是否失败了，并试图在第一个请求仍在处理时再次点击"保存"按钮。

在这种情况下，同一个动作的两个请求会同时被处理。

为了防止这种情况，Livewire 会在处理 `wire:submit` 动作时自动禁用提交按钮和 `<form>` 元素内的所有表单输入。这确保了表单不会被意外提交两次。

为了进一步减少慢速连接下用户的困惑，通常显示一些加载指示器（如微妙的背景色变化或 SVG 动画）会很有帮助。

Livewire 提供了 `wire:loading` 指令，可以轻松地在页面上的任何位置显示和隐藏加载指示器。以下是一个使用 `wire:loading` 在"保存"按钮下方显示加载消息的简短示例：

```blade
<form wire:submit="save">
    <textarea wire:model="content"></textarea>

    <button type="submit">保存</button>

    <!-- wire:loading 在 Livewire 发送网络请求时显示，请求完成后自动隐藏 -->
    <span wire:loading>正在保存...</span> <!-- [tl! highlight] -->
</form>
```

`wire:loading` 是一个功能强大的指令，拥有更多高级特性。[查看完整的加载文档了解更多信息](/docs/livewire/v3.x/wire-loading)。

## 传递参数

Livewire 允许你从 Blade 模板向组件中的动作传递参数，让你能够在调用动作为动作提供前端额外的数据或状态。

例如，假设你有一个 `ShowPosts` 组件，允许用户删除文章。你可以将文章的 ID 作为参数传递给 Livewire 组件中的 `delete()` 动作。然后，动作可以获取相关文章并将其从数据库中删除：

```php
<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Livewire\Component;
use App\Models\Post;

class ShowPosts extends Component
{
    // 动作方法可以接收从 Blade 模板传递的参数
    public function delete($id)
    {
        $post = Post::findOrFail($id);

        // 在操作数据库前验证当前用户是否有权删除
        $this->authorize('delete', $post);

        $post->delete();
    }

    public function render()
    {
        // 在 render() 中通过视图数据传递文章列表，不是通过属性
        return view('livewire.show-posts', [
            'posts' => Auth::user()->posts,
        ]);
    }
}
```

```blade
<div>
    @foreach ($posts as $post)
        <!-- wire:key 帮助 Livewire 在渲染列表中追踪每个元素的身份 -->
        <div wire:key="{{ $post->id }}">
            <h1>{{ $post->title }}</h1>
            <span>{{ $post->content }}</span>

            <!-- wire:click 中传入 $post->id 作为 delete() 的参数 -->
            <button wire:click="delete({{ $post->id }})">删除</button> <!-- [tl! highlight] -->
        </div>
    @endforeach
</div>
```

对于 ID 为 2 的文章，上面 Blade 模板中的"删除"按钮在浏览器中将渲染为：

```blade
<!-- Blade 编译后，{{ $post->id }} 被替换为实际的数字 2 -->
<button wire:click="delete(2)">删除</button>
```

当此按钮被点击时，`delete()` 方法将被调用，并且 `$id` 将传入值 "2"。

:::warning[警告]
不要信任动作参数
动作参数应像 HTTP 请求输入一样对待，即动作参数值不应被信任。在更新数据库之前，你应该始终验证实体的所有权。

更多信息请查阅我们关于[安全问题和最佳实践](/docs/livewire/v3.x/actions#security-concerns)的文档。
:::

作为附加的便利功能，你可以通过提供给动作参数的相关模型 ID 自动解析 Eloquent 模型。这非常类似于[路由模型绑定](/docs/livewire/v3.x/components#using-route-model-binding)。要开始使用，将动作参数类型提示为模型类，相应的模型将自动从数据库中获取并传递给动作，而不是传递 ID：

```php
<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Livewire\Component;
use App\Models\Post;

class ShowPosts extends Component
{
    // 参数类型提示为 Post 模型后，Livewire 会自动根据传入的 ID 查询并注入模型实例
    // 无需手动调用 Post::findOrFail()
    public function delete(Post $post) // [tl! highlight]
    {
        $this->authorize('delete', $post);

        $post->delete();
    }

    public function render()
    {
        return view('livewire.show-posts', [
            'posts' => Auth::user()->posts,
        ]);
    }
}
```

## 依赖注入

你可以利用 [Laravel 的依赖注入系统](https://laravel.com/docs/controllers#dependency-injection-and-controllers)，在动作方法签名中对参数进行类型提示。Livewire 和 Laravel 会自动从容器中解析动作的依赖项：

```php
<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Livewire\Component;
use App\Repositories\PostRepository;

class ShowPosts extends Component
{
    // 动作参数支持 Laravel 依赖注入：容器自动解析 PostRepository
    // 从第二个参数开始才是前端传递的动作参数
    public function delete(PostRepository $posts, $postId) // [tl! highlight]
    {
        $posts->deletePost($postId);
    }

    public function render()
    {
        return view('livewire.show-posts', [
            'posts' => Auth::user()->posts,
        ]);
    }
}
```

```blade
<div>
    @foreach ($posts as $post)
        <div wire:key="{{ $post->id }}">
            <h1>{{ $post->title }}</h1>
            <span>{{ $post->content }}</span>

            <button wire:click="delete({{ $post->id }})">删除</button> <!-- [tl! highlight] -->
        </div>
    @endforeach
</div>
```

在这个例子中，`delete()` 方法在接收提供的 `$postId` 参数之前，先接收一个通过 [Laravel 服务容器](https://laravel.com/docs/container#main-content) 解析的 `PostRepository` 实例。

## 从 Alpine 调用动作

Livewire 与 [Alpine](https://alpinejs.dev/) 无缝集成。实际上，在底层每个 Livewire 组件也是一个 Alpine 组件。这意味着你可以充分利用 Alpine 为组件添加 JavaScript 驱动的客户端交互。

为了让这种配合更强大，Livewire 向 Alpine 暴露了一个神奇的 `$wire` 对象，可以将其视为 PHP 组件的 JavaScript 表示。除了[通过 `$wire` 访问和修改公共属性](/docs/livewire/v3.x/properties#accessing-properties-from-javascript)外，你还可以调用动作。当在 `$wire` 对象上调用动作时，后端 Livewire 组件上对应的 PHP 方法将被调用：

```blade
<!-- x-on:click 是 Alpine 的点击事件，$wire.save() 调用服务端的 save() 动作 -->
<button x-on:click="$wire.save()">保存文章</button>
```

或者，为了展示一个更复杂的示例，你可以使用 Alpine 的 [`x-intersect`](https://alpinejs.dev/plugins/intersect) 工具，在给定元素在页面上可见时触发 `incrementViewCount()` Livewire 动作：

```blade
<!-- x-intersect 在元素进入视口时触发，适合埋点统计等场景 -->
<div x-intersect="$wire.incrementViewCount()">...</div>
```

### 传递参数

你传递给 `$wire` 方法的任何参数也将传递给 PHP 类方法。例如，考虑以下 Livewire 动作：

```php
public function addTodo($todo)
{
    // $todo 参数的值由前端的 Alpine 表达式传入
    $this->todos[] = $todo;
}
```

在你的组件的 Blade 模板中，你可以通过 Alpine 调用此动作，并提供应传递给动作的参数：

```blade
<!-- x-data 定义 Alpine 组件的本地状态，x-model 绑定输入框 -->
<div x-data="{ todo: '' }">
    <input type="text" x-model="todo">

    <!-- x-on:click 中传入 Alpine 变量 todo，其值会被传递给服务端的 addTodo() -->
    <button x-on:click="$wire.addTodo(todo)">添加待办</button>
</div>
```

如果用户在文本输入框中输入了"倒垃圾"并点击了"添加待办"按钮，`addTodo()` 方法将被触发，`$todo` 参数的值为"倒垃圾"。

### 接收返回值

更强大的是，调用的 `$wire` 动作在网络请求处理期间返回一个 promise。当收到服务端响应时，promise 将解析为后端动作返回的值。

例如，考虑一个 Livewire 组件，它有以下动作：

```php
use App\Models\Post;

public function getPostCount()
{
    // 该方法返回文章总数，可在前端通过 $wire 获取返回值
    return Post::count();
}
```

使用 `$wire`，可以调用动作并解析其返回值：

```blade
<!-- x-init 在元素初始化时执行，await $wire.getPostCount() 等待服务端返回结果 -->
<!-- 返回的数字会直接替换到 span 元素的 innerHTML 中 -->
<span x-init="$el.innerHTML = await $wire.getPostCount()"></span>
```

在此示例中，如果 `getPostCount()` 方法返回 "10"，那么 `<span>` 标签也将包含 "10"。

使用 Livewire 时并不需要 Alpine 的知识；然而，它是一个极其强大的工具，了解 Alpine 将增强你的 Livewire 体验和生产力。

## JavaScript 动作

Livewire 允许你定义完全在客户端运行而不发起服务端请求的 JavaScript 动作。这在两种场景下很有用：

1. 当你想要执行不需要服务端通信的简单 UI 更新时
2. 当你想要在发起服务端请求之前，使用 JavaScript 乐观地更新 UI 时

要定义 JavaScript 动作，你可以在组件的 `<script>` 标签中使用 `$js()` 函数。

下面是一个收藏文章的示例，它使用 JavaScript 动作在发起服务端请求之前乐观地更新 UI。JavaScript 动作立即显示填充的书签图标，然后发起请求将书签持久化到数据库：

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Post;

class ShowPost extends Component
{
    // 类型提示为 Eloquent Model 时，Livewire 会自动锁定 ID 防止篡改
    public Post $post;

    public $bookmarked = false;

    public function mount()
    {
        // 在 mount() 中从数据库查询初始状态
        $this->bookmarked = $this->post->bookmarkedBy(auth()->user());
    }

    // 服务端动作：将书签状态持久化到数据库
    public function bookmarkPost()
    {
        $this->post->bookmark(auth()->user());

        $this->bookmarked = $this->post->bookmarkedBy(auth()->user());
    }

    public function render()
    {
        return view('livewire.show-post');
    }
}
```

```blade
<div>
    <!-- $js.bookmark 会触发同名的 JavaScript 动作，而非直接发送网络请求 -->
    <button wire:click="$js.bookmark" class="flex items-center gap-1">
        {{-- 空心书签图标：当 bookmarked 为 false 时显示 --}}
        <svg wire:show="!bookmarked" wire:cloak xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
        </svg>

        {{-- 实心书签图标：当 bookmarked 为 true 时显示 --}}
        <svg wire:show="bookmarked" wire:cloak xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
            <path fill-rule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clip-rule="evenodd" />
        </svg>
    </button>
</div>

@script
<script>
    // $js('bookmark', ...) 注册 bookmark 这个 JavaScript 动作
    $js('bookmark', () => {
        // 第一步：立即在前端切换 bookmarked 状态，图标马上变化
        $wire.bookmarked = !$wire.bookmarked

        // 第二步：发起服务端请求将更改持久化到数据库
        $wire.bookmarkPost()
    })
</script>
@endscript
```

当用户点击书签按钮时，将发生以下顺序：

1. "bookmark" JavaScript 动作被触发
2. 书签图标通过在客户端切换 `$wire.bookmarked` 立即更新
3. 调用 `bookmarkPost()` 方法将更改保存到数据库

这提供了即时的视觉反馈，同时确保书签状态被正确持久化。

### 从 Alpine 调用

你可以使用 `$wire` 对象直接从 Alpine 调用 JavaScript 动作。例如，你可以使用 `$wire` 对象来调用 `bookmark` JavaScript 动作：

```blade
<!-- 通过 Alpine 的 $wire.$js.bookmark() 调用已注册的 JavaScript 动作 -->
<button x-on:click="$wire.$js.bookmark()">收藏</button>
```

### 从 PHP 调用

JavaScript 动作也可以使用 `js()` 方法从 PHP 调用：

```php
<?php

namespace App\Livewire;

use Livewire\Component;

class CreatePost extends Component
{
    public $title = '';

    public function save()
    {
        // ...

        // js() 在服务端动作完成后触发客户端上已注册的 JavaScript 动作
        $this->js('onPostSaved'); // [tl! highlight]
    }
}
```

```blade
<div>
    <!-- ... -->

    <button wire:click="save">保存</button>
</div>

@script
<script>
    // onPostSaved JavaScript 动作由服务端的 $this->js('onPostSaved') 触发
    $js('onPostSaved', () => {
        alert('文章已成功保存！')
    })
</script>
@endscript
```

在此示例中，当 `save()` 动作完成时，`onPostSaved` JavaScript 动作将被执行，触发警告对话框。

## 魔术动作

Livewire 提供了一组"魔术"动作，让你无需定义自定义方法即可在组件中执行常见任务。这些魔术动作可以在 Blade 模板中定义的事件监听器中使用。

### `$parent`

`$parent` 魔术变量允许你从子组件访问父组件的属性和调用父组件的动作：

```blade
<!-- $parent.removePost() 从子组件直接调用父组件的 removePost 动作 -->
<button wire:click="$parent.removePost({{ $post->id }})">移除</button>
```

在上面的例子中，如果父组件有一个 `removePost()` 动作，子组件可以直接从 Blade 模板中使用 `$parent.removePost()` 调用它。

### `$set`

`$set` 魔术动作允许你直接从 Blade 模板更新 Livewire 组件中的属性。要使用 `$set`，提供要更新的属性名称和新值作为参数：

```blade
<!-- $set('query', '') 直接设置 $query 属性为空字符串，无需定义方法 -->
<button wire:click="$set('query', '')">重置搜索</button>
```

在此示例中，当按钮被点击时，会发起一个网络请求，将组件中的 `$query` 属性设置为 `''`。

### `$refresh`

`$refresh` 动作触发 Livewire 组件的重新渲染。这在更新组件视图而不更改任何属性值时很有用：

```blade
<!-- $refresh 重新渲染组件，通常用于刷新依赖外部数据的视图 -->
<button wire:click="$refresh">刷新</button>
```

当按钮被点击时，组件将重新渲染，让你看到视图中的最新更改。

### `$toggle`

`$toggle` 动作用于切换 Livewire 组件中布尔属性的值：

```blade
<!-- $toggle('sortAsc') 在 true 和 false 之间切换 $sortAsc 属性 -->
<button wire:click="$toggle('sortAsc')">
    排序 {{ $sortAsc ? '降序' : '升序' }}
</button>
```

在此示例中，当按钮被点击时，组件中的 `$sortAsc` 属性将在 `true` 和 `false` 之间切换。

### `$dispatch`

`$dispatch` 动作允许你在浏览器中直接触发 Livewire 事件。下面是一个按钮示例，点击后将触发 `post-deleted` 事件：

```blade
<!-- $dispatch('post-deleted') 触发一个 Livewire 事件，其他组件可监听 -->
<button type="submit" wire:click="$dispatch('post-deleted')">删除文章</button>
```

### `$event`

`$event` 动作可以在 `wire:click` 等事件监听器中使用。此动作让你访问实际触发的 JavaScript 事件，使你能够引用触发元素和其他相关信息：

```blade
<!-- $event.target.value 获取触发事件的输入框的当前值 -->
<input type="text" wire:keydown.enter="search($event.target.value)">
```

当用户在上面的输入框中输入时按下回车键，输入框的内容将作为参数传递给 `search()` 动作。

### 从 Alpine 使用魔术动作

你也可以使用 `$wire` 对象从 Alpine 调用魔术动作。例如，你可以使用 `$wire` 对象来调用 `$refresh` 魔术动作：

```blade
<!-- Alpine 中通过 $wire.$refresh() 调用魔术动作 -->
<button x-on:click="$wire.$refresh()">刷新</button>
```

## 跳过重新渲染

有时，组件中可能存在一个动作，当动作被调用时没有会改变渲染的 Blade 模板的副作用。如果是这样，你可以通过在动作方法上方添加 `#[Renderless]` 属性来跳过 Livewire 生命周期中的 `render` 部分。

为了演示，在下面的 `ShowPost` 组件中，当用户滚动到文章底部时记录"浏览次数"：

```php
<?php

namespace App\Livewire;

use Livewire\Attributes\Renderless;
use Livewire\Component;
use App\Models\Post;

class ShowPost extends Component
{
    public Post $post;

    public function mount(Post $post)
    {
        $this->post = $post;
    }

    // #[Renderless] 标记后，此动作不会触发组件的 render() 流程
    // 适合记录日志、统计访问量等不影响视图的操作
    #[Renderless] // [tl! highlight]
    public function incrementViewCount()
    {
        $this->post->incrementViewCount();
    }

    public function render()
    {
        return view('livewire.show-post');
    }
}
```

```blade
<div>
    <h1>{{ $post->title }}</h1>
    <p>{{ $post->content }}</p>

    <!-- x-intersect 在该元素进入浏览器视口时触发 incrementViewCount() -->
    <!-- 由于动作标记了 #[Renderless]，视图不会因统计调用而重新渲染 -->
    <div x-intersect="$wire.incrementViewCount()"></div>
</div>
```

上面的示例使用了 [`x-intersect`](https://alpinejs.dev/plugins/intersect)，这是一个 Alpine 工具，当元素进入视口时调用表达式（通常用于检测用户何时滚动到页面下方的元素）。

如你所见，当用户滚动到文章底部时，`incrementViewCount()` 被调用。由于动作上添加了 `#[Renderless]`，浏览被记录，但模板不会重新渲染，页面的任何部分都不会受到影响。

如果你更倾向于不使用方法属性，或需要条件性地跳过渲染，你可以在组件动作中调用 `skipRender()` 方法：

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Post;

class ShowPost extends Component
{
    public Post $post;

    public function mount(Post $post)
    {
        $this->post = $post;
    }

    public function incrementViewCount()
    {
        $this->post->incrementViewCount();

        // skipRender() 在方法内部条件性地跳过本次渲染
        // 与 #[Renderless] 属性等效，但允许根据运行时逻辑决定是否跳过
        $this->skipRender(); // [tl! highlight]
    }

    public function render()
    {
        return view('livewire.show-post');
    }
}
```

## 安全问题

请记住，Livewire 组件中的任何公共方法都可以从客户端调用，即使没有关联的 `wire:click` 处理器。在这种情况下，用户仍然可以从浏览器的开发者工具触发该动作。

以下是 Livewire 组件中三个容易被忽视的漏洞示例。每个示例将首先显示有漏洞的组件，然后显示安全的组件。作为练习，在查看解决方案之前，尝试在第一个示例中找出漏洞。

如果你发现识别漏洞有困难，并且担心自己保护应用程序安全的能力，请记住这些漏洞同样适用于使用请求和控制器的标准 Web 应用程序。如果你将组件方法视为控制器方法的代理，并将其参数视为请求输入的代理，那么你应该能够将现有的应用程序安全知识应用到 Livewire 代码中。

### 始终验证动作参数

就像控制器的请求输入一样，验证动作参数至关重要，因为它们来自任意的用户输入。

下面是一个 `ShowPosts` 组件，用户可以在一个页面上查看他们所有的文章。他们可以使用文章的"删除"按钮删除任何喜欢的文章。

这是该组件的有漏洞版本：

```php
<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Livewire\Component;
use App\Models\Post;

class ShowPosts extends Component
{
    // 漏洞：没有对 $id 参数进行任何授权检查
    public function delete($id)
    {
        // 任何用户传入任意文章的 ID 都能删除
        $post = Post::find($id);

        $post->delete();
    }

    public function render()
    {
        return view('livewire.show-posts', [
            'posts' => Auth::user()->posts,
        ]);
    }
}
```

```blade
<div>
    @foreach ($posts as $post)
        <div wire:key="{{ $post->id }}">
            <h1>{{ $post->title }}</h1>
            <span>{{ $post->content }}</span>

            <button wire:click="delete({{ $post->id }})">删除</button>
        </div>
    @endforeach
</div>
```

请记住，恶意用户可以从 JavaScript 控制台直接调用 `delete()`，传入他们想要的任何参数。这意味着查看自己文章的用户可以通过传入不属于自己的文章 ID 来删除其他用户的文章。

为防止这种情况，我们需要验证用户是否拥有将要删除的文章：

```php
<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Livewire\Component;
use App\Models\Post;

class ShowPosts extends Component
{
    public function delete($id)
    {
        $post = Post::find($id);

        // authorize() 在删除前验证当前用户是否有权操作该文章
        $this->authorize('delete', $post); // [tl! highlight]

        $post->delete();
    }

    public function render()
    {
        return view('livewire.show-posts', [
            'posts' => Auth::user()->posts,
        ]);
    }
}
```

### 始终在服务端验证

与标准的 Laravel 控制器一样，Livewire 动作可以被任何用户调用，即使 UI 中没有调用该动作的入口。

考虑以下 `BrowsePosts` 组件，任何用户都可以查看应用程序中的所有文章，但只有管理员可以删除文章：

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Post;

class BrowsePosts extends Component
{
    // 漏洞：方法为 public 却没有服务端权限检查
    public function deletePost($id)
    {
        $post = Post::find($id);

        $post->delete();
    }

    public function render()
    {
        return view('livewire.browse-posts', [
            'posts' => Post::all(),
        ]);
    }
}
```

```blade
<div>
    @foreach ($posts as $post)
        <div wire:key="{{ $post->id }}">
            <h1>{{ $post->title }}</h1>
            <span>{{ $post->content }}</span>

            <!-- Blade 中只对管理员显示删除按钮，但方法本身未加保护 -->
            @if (Auth::user()->isAdmin())
                <button wire:click="deletePost({{ $post->id }})">删除</button>
            @endif
        </div>
    @endforeach
</div>
```

如你所见，只有管理员能看到"删除"按钮；但是，任何用户都可以从浏览器的开发者工具调用组件上的 `deletePost()`。

要修复此漏洞，我们需要在服务端验证动作，如下所示：

```php
<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Livewire\Component;
use App\Models\Post;

class BrowsePosts extends Component
{
    public function deletePost($id)
    {
        // 服务端权限检查：非管理员直接返回 403
        if (! Auth::user()->isAdmin) { // [tl! highlight:2]
            abort(403);
        }

        $post = Post::find($id);

        $post->delete();
    }

    public function render()
    {
        return view('livewire.browse-posts', [
            'posts' => Post::all(),
        ]);
    }
}
```

通过此更改，只有管理员才能从此组件中删除文章。

### 将危险方法保持为 protected 或 private

Livewire 组件中的每个公共方法都可以从客户端调用。即使是你没有在 `wire:click` 处理器中引用的方法也是如此。为了防止用户调用不应在客户端调用的方法，你应该将它们标记为 `protected` 或 `private`。这样做可以将该敏感方法的可见性限制在组件类及其子类中，确保它们无法从客户端调用。

考虑我们之前讨论的 `BrowsePosts` 示例，用户可以查看应用程序中的所有文章，但只有管理员可以删除文章。在[始终在服务端验证](/docs/livewire/v3.x/actions#always-authorize-server-side)部分，我们通过添加服务端验证使动作变得安全。现在想象一下，我们将实际的删除操作重构到一个专用方法中，就像你为了简化代码可能做的那样：

```php
// 警告：此片段演示了不该做什么...
<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Livewire\Component;
use App\Models\Post;

class BrowsePosts extends Component
{
    public function deletePost($id)
    {
        if (! Auth::user()->isAdmin) {
            abort(403);
        }

        // 委托给另一个 public 方法执行删除
        $this->delete($id); // [tl! highlight]
    }

    // 漏洞：delete() 被声明为 public，任何用户可以直接从客户端调用
    // 绕过了 deletePost() 中的管理员检查
    public function delete($postId)  // [tl! highlight:5]
    {
        $post = Post::find($postId);

        $post->delete();
    }

    public function render()
    {
        return view('livewire.browse-posts', [
            'posts' => Post::all(),
        ]);
    }
}
```

```blade
<div>
    @foreach ($posts as $post)
        <div wire:key="{{ $post->id }}">
            <h1>{{ $post->title }}</h1>
            <span>{{ $post->content }}</span>

            <!-- 模板中只引用了 deletePost，没有引用 delete -->
            <button wire:click="deletePost({{ $post->id }})">删除</button>
        </div>
    @endforeach
</div>
```

如你所见，我们将文章删除逻辑重构到了一个名为 `delete()` 的专用方法中。即使此方法在模板中没有任何地方被引用，如果用户知道了它的存在，他们仍然可以从浏览器的开发者工具调用它，因为它是 `public` 的。

要解决这个问题，我们可以将方法标记为 `protected` 或 `private`。一旦方法被标记为 `protected` 或 `private`，如果用户尝试调用它，就会抛出错误：

```php
<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Livewire\Component;
use App\Models\Post;

class BrowsePosts extends Component
{
    public function deletePost($id)
    {
        if (! Auth::user()->isAdmin) {
            abort(403);
        }

        $this->delete($id);
    }

    // 将 delete() 改为 protected，客户端无法再直接调用
    protected function delete($postId) // [tl! highlight]
    {
        $post = Post::find($postId);

        $post->delete();
    }

    public function render()
    {
        return view('livewire.browse-posts', [
            'posts' => Post::all(),
        ]);
    }
}
```
