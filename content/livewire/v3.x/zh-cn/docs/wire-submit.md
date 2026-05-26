---
title: wire:submit
source: https://github.com/livewire/livewire/blob/v3.8.0/docs/wire-submit.md
source_version: v3.8.0
translation_status: draft
---

Livewire 通过 `wire:submit` 指令让处理表单提交变得简单。在 `<form>` 元素上添加 `wire:submit`，Livewire 会拦截表单提交，阻止默认的浏览器处理，并调用指定的 Livewire 组件方法。

以下是一个使用 `wire:submit` 处理"创建文章"表单提交的基本示例：

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

        $this->redirect('/posts');
    }

    public function render()
    {
        return view('livewire.create-post');
    }
}
```

```blade
<form wire:submit="save"> <!-- [tl! highlight] -->
    <input type="text" wire:model="title">

    <textarea wire:model="content"></textarea>

    <button type="submit">Save</button>
</form>
```

在上面的示例中，当用户点击"Save"提交表单时，`wire:submit` 会拦截 `submit` 事件并调用服务器端的 `save()` 方法。

:::info[Livewire 自动调用 `preventDefault()`]
`wire:submit` 与其他 Livewire 事件处理器的不同之处在于，它内部会自动调用 `event.preventDefault()`，无需使用 `.prevent` 修饰符。因为几乎不存在监听 `submit` 事件但不想阻止浏览器默认行为（完整表单提交到端点）的情况。
:::

:::info[Livewire 在提交时自动禁用表单]
默认情况下，当 Livewire 向服务器发送表单提交请求时，它会禁用表单提交按钮，并将所有表单输入标记为 `readonly`。这样用户无法在首次提交完成之前再次提交同一表单。
:::

## 深入了解

`wire:submit` 只是 Livewire 提供的众多事件监听器之一。以下两个页面提供了在应用中使用 `wire:submit` 的更完整文档：

* [使用 Livewire 响应浏览器事件](/docs/livewire/v3.x/actions)
* [在 Livewire 中创建表单](/docs/livewire/v3.x/forms)
