---
title: wire:text
source: https://github.com/livewire/livewire/blob/v3.8.0/docs/wire-text.md
source_version: v3.8.0
translation_status: draft
---

`wire:text` 是一个根据组件属性或表达式动态更新元素文本内容的指令。与使用 Blade 的 `{{ }}` 语法不同，`wire:text` 不需要网络往返重新渲染组件即可更新内容。

如果你熟悉 Alpine 的 `x-text` 指令，两者本质上是一样的。

## 基本用法

以下是一个使用 `wire:text` 乐观地显示 Livewire 属性更新的示例，无需等待网络往返。

```php
use Livewire\Component;
use App\Models\Post;

class ShowPost extends Component
{
    public Post $post;

    public $likes;

    public function mount()
    {
        $this->likes = $this->post->like_count;
    }

    public function like()
    {
        $this->post->like();

        $this->likes = $this->post->fresh()->like_count;
    }
}
```

```blade
<div>
    <button x-on:click="$wire.likes++" wire:click="like">❤️ Like</button>

    Likes: <span wire:text="likes"></span>
</div>
```

当按钮被点击时，`$wire.likes++` 通过 `wire:text` 立即更新显示的数量，同时 `wire:click="like"` 在后台将更改持久化到数据库。

这种模式使 `wire:text` 成为在 Livewire 中构建乐观 UI 的理想选择。
