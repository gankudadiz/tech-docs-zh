---
title: 理解组件嵌套
source: https://github.com/livewire/livewire/blob/v3.8.0/docs/understanding-nesting.md
source_version: v3.8.0
translation_status: draft
---

与许多其他基于组件的框架一样，Livewire 组件是可嵌套的——意味着一个组件可以在自身内部渲染多个组件。

然而，由于 Livewire 的嵌套系统与其他框架的构建方式不同，因此有一些需要了解的重要含义和限制。

:::tip[确保先理解水合概念]
在进一步了解 Livewire 的嵌套系统之前，完全理解 Livewire 如何水合组件会很有帮助。你可以通过阅读[水合文档](/docs/livewire/v3.x/hydration)了解更多。
:::

## 每个组件都是一个独立的岛屿

在 Livewire 中，页面上的每个组件都会独立跟踪自己的状态并独立进行更新。

例如，考虑下面的 `Posts` 组件和嵌套的 `ShowPost` 组件：

```php
<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Livewire\Component;

class Posts extends Component
{
    public $postLimit = 2;

    public function render()
    {
        return view('livewire.posts', [
            'posts' => Auth::user()->posts()
                ->limit($this->postLimit)->get(),
        ]);
    }
}
```

```blade
<div>
    Post Limit: <input type="number" wire:model.live="postLimit">

    @foreach ($posts as $post)
        <livewire:show-post :$post :key="$post->id">
    @endforeach
</div>
```

```php
<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Livewire\Component;
use App\Models\Post;

class ShowPost extends Component
{
    public Post $post;

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

    <button wire:click="$refresh">Refresh post</button>
</div>
```

以下是初始页面加载时整个组件树的 HTML 可能的样子：

```html
<div wire:id="123" wire:snapshot="...">
    Post Limit: <input type="number" wire:model.live="postLimit">

    <div wire:id="456" wire:snapshot="...">
        <h1>The first post</h1>

        <p>Post content</p>

        <button wire:click="$refresh">Refresh post</button>
    </div>

    <div wire:id="789" wire:snapshot="...">
        <h1>The second post</h1>

        <p>Post content</p>

        <button wire:click="$refresh">Refresh post</button>
    </div>
</div>
```

注意，父组件同时包含其自身的渲染模板以及所有嵌套组件的渲染模板。

因为每个组件都是独立的，它们各自拥有自己的 ID 和快照（`wire:id` 和 `wire:snapshot`），嵌入在 HTML 中供 Livewire 的 JavaScript 核心提取和跟踪。

让我们考虑几个不同的更新场景，以了解 Livewire 如何处理不同层级的嵌套。

### 更新子组件

如果你点击其中一个子组件 `show-post` 中的"Refresh post"按钮，发送到服务器的数据如下：

```js
{
    memo: { name: 'show-post', id: '456' },

    state: { ... },
}
```

发送回来的 HTML 如下：

```html
<div wire:id="456">
    <h1>The first post</h1>

    <p>Post content</p>

    <button wire:click="$refresh">Refresh post</button>
</div>
```

这里需要注意的重点是：当子组件触发更新时，只有该组件的数据被发送到服务器，也只有该组件被重新渲染。

现在让我们看一个不太直观的场景：更新父组件。

### 更新父组件

提醒一下，以下是父组件 `Posts` 的 Blade 模板：

```blade
<div>
    Post Limit: <input type="number" wire:model.live="postLimit">

    @foreach ($posts as $post)
        <livewire:show-post :$post :key="$post->id">
    @endforeach
</div>
```

如果用户将"Post Limit"值从 `2` 改为 `1`，将只触发父组件的更新。

以下是请求负载可能的示例：

```js
{
    updates: { postLimit: 1 },

    snapshot: {
        memo: { name: 'posts', id: '123' },

        state: { postLimit: 2, ... },
    },
}
```

如你所见，只有父组件 `Posts` 的快照被发送到服务器。

你可能会问自己一个重要的问题：当父组件重新渲染并遇到子组件 `show-post` 时会发生什么？如果子组件的快照没有包含在请求负载中，如何重新渲染子组件？

答案是：子组件不会被重新渲染。

当 Livewire 渲染 `Posts` 组件时，会为遇到的任何子组件渲染占位符。

以下是上述更新后 `Posts` 组件渲染的 HTML 可能的示例：

```html
<div wire:id="123">
    Post Limit: <input type="number" wire:model.live="postLimit">

    <div wire:id="456"></div>
</div>
```

如你所见，由于 `postLimit` 更新为 `1`，只渲染了一个子组件。但你也注意到，并没有完整的子组件，只有一个带有匹配 `wire:id` 属性的空 `<div></div>`。

当这个 HTML 在前端接收时，Livewire 会将旧 HTML _形态变换_ 为这个新 HTML，但会智能地跳过任何子组件占位符。

结果是，_形态变换_ 之后，父组件 `Posts` 的最终 DOM 内容将是：

```html
<div wire:id="123">
    Post Limit: <input type="number" wire:model.live="postLimit">

    <div wire:id="456">
        <h1>The first post</h1>

        <p>Post content</p>

        <button wire:click="$refresh">Refresh post</button>
    </div>
</div>
```

## 性能影响

Livewire 的"岛屿"架构对你的应用可能既有积极的影响，也有消极的影响。

这种架构的一个优点是它允许你隔离应用中开销昂贵的部分。例如，你可以将缓慢的数据库查询隔离到自己的独立组件中，其性能开销不会影响页面的其余部分。

然而，这种方法最大的缺点是，由于组件之间完全分离，组件间的通信/依赖变得更加困难。

例如，如果你有一个属性从上面的父组件 `Posts` 传递到嵌套的 `ShowPost` 组件，它不会是"响应式"的。因为每个组件都是独立的岛屿，如果对父组件的请求改变了传递给 `ShowPost` 的属性值，`ShowPost` 内部不会更新。

Livewire 已经克服了许多这些障碍，并为这些场景提供了专门的 API，比如：[响应式属性](/docs/livewire/v3.x/nesting#reactive-props)、[可模型绑定的组件](/docs/livewire/v3.x/nesting#binding-to-child-data-using-wiremodel) 和 [`$parent` 对象](/docs/livewire/v3.x/nesting#directly-accessing-the-parent-from-the-child)。

有了这些关于嵌套 Livewire 组件如何运作的知识，你将能够对何时以及如何在应用中嵌套组件做出更明智的决策。
