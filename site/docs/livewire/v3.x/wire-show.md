---
title: wire:show
source: https://github.com/livewire/livewire/blob/v3.8.0/docs/wire-show.md
source_version: v3.8.0
translation_status: draft
---

Livewire 的 `wire:show` 指令可以根据表达式的结果轻松显示和隐藏元素。

`wire:show` 指令与在 Blade 中使用 `@if` 的不同之处在于，它使用 CSS（`display: none`）来切换元素的可见性，而不是将元素从 DOM 中完全移除。这意味着元素仍然存在于页面中但被隐藏，从而实现更平滑的过渡，无需服务器往返。

## 基本用法

以下是一个使用 `wire:show` 切换"创建文章"模态框的实际示例：

```php
use Livewire\Component;
use App\Models\Post;

class CreatePost extends Component
{
    public $showModal = false;

    public $content = '';

    public function save()
    {
        Post::create(['content' => $this->content]);

        $this->reset('content');

        $this->showModal = false;
    }
}
```

```blade
<div>
    <button x-on:click="$wire.showModal = true">New Post</button>

    <div wire:show="showModal">
        <form wire:submit="save">
            <textarea wire:model="content"></textarea>

            <button type="submit">Save Post</button>
        </form>
    </div>
</div>
```

当点击"New Post"按钮时，模态框会显示出来，无需服务器往返。成功保存文章后，模态框隐藏，表单重置。

## 使用过渡效果

你可以将 `wire:show` 与 Alpine.js 过渡结合使用，创建平滑的显示/隐藏动画。由于 `wire:show` 仅切换 CSS `display` 属性，Alpine 的 `x-transition` 指令可以与其完美配合：

```blade
<div>
    <button x-on:click="$wire.showModal = true">New Post</button>

    <div wire:show="showModal" x-transition.duration.500ms>
        <form wire:submit="save">
            <textarea wire:model="content"></textarea>
            <button type="submit">Save Post</button>
        </form>
    </div>
</div>
```

上面的 Alpine.js 过渡类在模态框显示和隐藏时会创建淡入淡出和缩放效果。

[查看完整的 x-transition 文档 →](https://alpinejs.dev/directives/transition)
