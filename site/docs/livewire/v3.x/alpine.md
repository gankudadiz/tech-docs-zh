---
title: Alpine.js
source: https://github.com/livewire/livewire/blob/v3.8.0/docs/alpine.md
source_version: v3.8.0
translation_status: draft
---

[AlpineJS](https://alpinejs.dev/) 是一个轻量级的 JavaScript 库，可以轻松为网页添加客户端交互功能。它最初是为了补充像 Livewire 这样的工具而构建的，当你需要在应用中分散地添加交互功能时，一个更偏向 JavaScript 的工具会非常有用。

Livewire 内置了 Alpine，因此无需在项目中单独安装。

学习使用 AlpineJS 的最佳途径是 [Alpine 文档](https://alpinejs.dev)。

## 一个基本的 Alpine 组件

为给本文档的其他内容打下基础，下面展示一个最简单且最具代表性的 Alpine 组件示例。一个小型"计数器"，它在页面上显示一个数字，并允许用户通过点击按钮来增加该数字：

```html
<!-- 声明一个 JavaScript 数据对象... -->
<div x-data="{ count: 0 }">
    <!-- 在元素内渲染当前的 "count" 值... -->
    <h2 x-text="count"></h2>

    <!-- 当点击事件触发时，将 "count" 值增加 "1"... -->
    <button x-on:click="count++">+</button>
</div>
```

上面的 Alpine 组件可以无缝地在应用中任何 Livewire 组件内使用。Livewire 负责在 Livewire 组件更新时维护 Alpine 的状态。本质上，你可以像在非 Livewire 环境中使用 Alpine 一样，在 Livewire 中自由地使用 Alpine 组件。

## 在 Livewire 中使用 Alpine

让我们探索一个更贴近实际的示例：在 Livewire 组件内使用 Alpine 组件。

下面是一个简单的 Livewire 组件，展示数据库中 post 模型的详细信息。默认情况下，只显示文章的标题：

```html
<div>
    <h1>{{ $post->title }}</h1>

    <div x-data="{ expanded: false }">
        <button type="button" x-on:click="expanded = ! expanded">
            <span x-show="! expanded">显示文章内容...</span>
            <span x-show="expanded">隐藏文章内容...</span>
        </button>

        <div x-show="expanded">
            {{ $post->content }}
        </div>
    </div>
</div>
```

通过使用 Alpine，我们可以隐藏文章内容，直到用户点击"显示文章内容..."按钮。此时，Alpine 的 `expanded` 属性将被设为 `true`，内容将显示在页面上，因为 `x-show="expanded"` 让 Alpine 控制了文章内容的可见性。

这是 Alpine 的闪光之处：在不触发 Livewire 服务端往返的情况下为应用添加交互功能。

## 使用 `$wire` 从 Alpine 控制 Livewire

作为 Livewire 开发者，最强大的功能之一就是 `$wire`。`$wire` 对象是一个魔法对象，可用于所有在 Livewire 内部使用的 Alpine 组件。

你可以将 `$wire` 视为从 JavaScript 通往 PHP 的大门。它允许你访问和修改 Livewire 组件的属性、调用 Livewire 组件的 method 等，所有这些都可以在 AlpineJS 内部完成。

### 访问 Livewire 属性

下面是一个在创建文章的表单中使用的简单"字符计数"工具示例。它会在用户输入时立即显示文章内容的字符数：

```html
<form wire:submit="save">
    <!-- ... -->

    <input wire:model="content" type="text">

    <small>
        字符数：<span x-text="$wire.content.length"></span> <!-- [tl! highlight] -->
    </small>

    <button type="submit">保存</button>
</form>
```

如上所示，上述示例中使用了 `x-text` 让 Alpine 控制 `<span>` 元素的文本内容。`x-text` 接受任何 JavaScript 表达式，并会在依赖项更新时自动响应。因为我们使用 `$wire.content` 来访问 `$content` 的值，Alpine 会在 `$wire.content` 被 Livewire 更新时自动更新文本内容；在本例中，是通过 `wire:model="content"` 实现的。

### 修改 Livewire 属性

下面是一个在 Alpine 中使用 `$wire` 清除创建文章表单中"title"字段的示例：

```html
<form wire:submit="save">
    <input wire:model="title" type="text">

    <button type="button" x-on:click="$wire.title = ''">清除</button> <!-- [tl! highlight] -->

    <!-- ... -->

    <button type="submit">保存</button>
</form>
```

当用户填写上述 Livewire 表单时，可以按"清除"按钮，标题字段将被清除，而无需发送 Livewire 网络请求。这个交互是"即时"的。

以下是实现这一功能的简要说明：

* `x-on:click` 告诉 Alpine 监听按钮上的点击事件
* 点击时，Alpine 执行提供的 JS 表达式：`$wire.title = ''`
* 因为 `$wire` 是一个代表 Livewire 组件的魔法对象，组件中的所有属性都可以直接从 JavaScript 访问或修改
* `$wire.title = ''` 将 Livewire 组件中的 `$title` 值设为空字符串
* 所有 Livewire 工具（如 `wire:model`）都会立即响应此更改，而无需发送服务端往返
* 在下一次 Livewire 网络请求时，`$title` 属性将在后端更新为空字符串

### 调用 Livewire 方法

Alpine 也可以轻松地直接调用 `$wire` 上的任何 Livewire 方法/操作。

下面是一个使用 Alpine 监听输入框的"blur"事件并触发表单保存的示例。当用户按下"tab"键使当前元素失去焦点并聚焦到页面上的下一个元素时，浏览器会触发"blur"事件：

```html
<form wire:submit="save">
    <input wire:model="title" type="text" x-on:blur="$wire.save()">  <!-- [tl! highlight] -->

    <!-- ... -->

    <button type="submit">保存</button>
</form>
```

通常，在这种情况下你只需使用 `wire:model.blur="title"`，但这个示例有助于演示如何使用 Alpine 实现同样的功能。

#### 传递参数

你也可以通过简单地在 `$wire` 方法调用中传递参数来向 Livewire 方法传递参数。

假设有一个包含 `deletePost()` 方法的组件：

```php
public function deletePost($postId)
{
    $post = Post::find($postId);

    // 验证用户可以删除...
    auth()->user()->can('update', $post);

    $post->delete();
}
```

现在，你可以从 Alpine 向 `deletePost()` 方法传递 `$postId` 参数：

```html
<button type="button" x-on:click="$wire.deletePost(1)">
```

通常，像 `$postId` 这样的值会在 Blade 中生成。下面是使用 Blade 决定 Alpine 传递给 `deletePost()` 的 `$postId` 的示例：

```html
@foreach ($posts as $post)
    <button type="button" x-on:click="$wire.deletePost({{ $post->id }})">
        删除 "{{ $post->title }}"
    </button>
@endforeach
```

如果页面上有三篇文章，上面的 Blade 模板将在浏览器中渲染为类似下面的内容：

```html
<button type="button" x-on:click="$wire.deletePost(1)">
    删除 "The power of walking"
</button>

<button type="button" x-on:click="$wire.deletePost(2)">
    删除 "How to record a song"
</button>

<button type="button" x-on:click="$wire.deletePost(3)">
    删除 "Teach what you learn"
</button>
```

如你所见，我们使用 Blade 将不同的文章 ID 渲染到 Alpine 的 `x-on:click` 表达式中。

#### Blade 参数注意事项

这是一种非常强大的技术，但在阅读 Blade 模板时可能会令人困惑。乍一看很难分辨哪些部分是 Blade，哪些部分是 Alpine。因此，检查页面上渲染的 HTML 以确保渲染结果与预期一致是很有帮助的。

下面是一个常见的令人困惑的示例：

假设你的 Post 模型使用 UUID 作为索引（ID 是整数，而 UUID 是长字符串），而不是 ID。

如果像使用 ID 一样渲染以下内容，就会出现问题：

```html
<!-- 警告：这是一个有问题的代码示例... -->
<button
    type="button"
    x-on:click="$wire.deletePost({{ $post->uuid }})"
>
```

上面的 Blade 模板将在 HTML 中渲染为：

```html
<!-- 警告：这是一个有问题的代码示例... -->
<button
    type="button"
    x-on:click="$wire.deletePost(93c7b04c-c9a4-4524-aa7d-39196011b81a)"
>
```

注意到 UUID 字符串周围缺少引号了吗？当 Alpine 评估此表达式时，JavaScript 将抛出错误："Uncaught SyntaxError: Invalid or unexpected token"。

要解决此问题，需要在 Blade 表达式周围添加引号，如下所示：

```html
<button
    type="button"
    x-on:click="$wire.deletePost('{{ $post->uuid }}')"
>
```

现在，上面的模板将正确渲染，一切按预期工作：

```html
<button
    type="button"
    x-on:click="$wire.deletePost('93c7b04c-c9a4-4524-aa7d-39196011b81a')"
>
```

### 刷新组件

你可以使用 `$wire.$refresh()` 轻松刷新 Livewire 组件（触发网络往返以重新渲染组件的 Blade 视图）：

```html
<button type="button" x-on:click="$wire.$refresh()">
```

## 使用 `$wire.entangle` 共享状态

在大多数情况下，`$wire` 已经足够满足从 Alpine 与 Livewire 状态交互的需求。不过，Livewire 还提供了一个 `$wire.entangle()` 工具，用于保持 Livewire 中的值与 Alpine 中的值同步。

为了演示，考虑这个下拉菜单示例，其 `showDropdown` 属性通过 `$wire.entangle()` 在 Livewire 和 Alpine 之间进行了绑定。通过使用绑定，我们现在可以从 Alpine 和 Livewire 两端控制下拉菜单的状态：

```php
use Livewire\Component;

class PostDropdown extends Component
{
    public $showDropdown = false;

    public function archive()
    {
        // ...

        $this->showDropdown = false;
    }

    public function delete()
    {
        // ...

        $this->showDropdown = false;
    }
}
```

```blade
<div x-data="{ open: $wire.entangle('showDropdown') }">
    <button x-on:click="open = true">显示更多...</button>

    <ul x-show="open" x-on:click.outside="open = false">
        <li><button wire:click="archive">归档</button></li>

        <li><button wire:click="delete">删除</button></li>
    </ul>
</div>
```

用户现在可以立即通过 Alpine 切换下拉菜单，但当他们点击像"归档"这样的 Livewire 操作时，下拉菜单将被 Livewire 告知关闭。Alpine 和 Livewire 都可以操作各自的属性，另一端会自动更新。

默认情况下，状态更新会被延迟（在客户端更改，但不会立即发送到服务器），直到下一次 Livewire 请求。如果你需要在用户点击时立即更新服务器端状态，可以链式调用 `.live` 修饰符，如下所示：

```blade
<div x-data="{ open: $wire.entangle('showDropdown').live }">
    ...
</div>
```

:::tip 你可能不需要 `$wire.entangle`
在大多数情况下，你可以直接使用 `$wire` 从 Alpine 访问 Livewire 属性，而不需要对它们进行绑定。对两个属性进行绑定而不是只依赖一个属性，在处理频繁变化的深层嵌套对象时可能会导致可预测性和性能问题。因此，从版本 3 开始，Livewire 的文档中已淡化了对 `$wire.entangle` 的推荐。
:::

:::warning 避免使用 `@@entangle` 指令
在 Livewire 版本 2 中，推荐使用 Blade 的 `@@entangle` 指令。在 v3 中情况已不同。`$wire.entangle()` 是更好的选择，因为它更健壮，并且可以避免某些[移除 DOM 元素时的问题](https://github.com/livewire/livewire/pull/6833#issuecomment-1902260844)。
:::

## 在 JavaScript 构建中手动打包 Alpine

默认情况下，Livewire 和 Alpine 的 JavaScript 会自动注入到每个 Livewire 页面中。

这对于简单的设置来说很理想，但你可能希望将自己的 Alpine 组件、stores 和插件包含到项目中。

通过自己的 JavaScript 打包在页面上包含 Livewire 和 Alpine 是很简单的。

首先，你需要在布局文件中包含 `@livewireScriptConfig` 指令，如下所示：

```blade
<html>
<head>
    <!-- ... -->
    @livewireStyles
    @vite(['resources/js/app.js'])
</head>
<body>
    {{ $slot }}

    @livewireScriptConfig <!-- [tl! highlight] -->
</body>
</html>
```

这允许 Livewire 为你的 bundle 提供应用正常运行所需的配置。

现在，你可以在 `resources/js/app.js` 文件中导入 Livewire 和 Alpine，如下所示：

```js
import { Livewire, Alpine } from '../../vendor/livewire/livewire/dist/livewire.esm';

// 在此注册任何 Alpine 指令、组件或插件...

Livewire.start()
```

以下是在应用中注册名为 "x-clipboard" 的自定义 Alpine 指令的示例：

```js
import { Livewire, Alpine } from '../../vendor/livewire/livewire/dist/livewire.esm';

Alpine.directive('clipboard', (el) => {
    let text = el.textContent

    el.addEventListener('click', () => {
        navigator.clipboard.writeText(text)
    })
})

Livewire.start()
```

现在，`x-clipboard` 指令将可用于 Livewire 应用中的所有 Alpine 组件。
