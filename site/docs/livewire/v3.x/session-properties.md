---
title: 会话属性
source: https://github.com/livewire/livewire/blob/v3.8.0/docs/session-properties.md
source_version: v3.8.0
translation_status: draft
---

Livewire 可以轻松地使用 `#[Session]` attribute 在页面刷新/切换时持久化属性的值。

通过在组件中的属性上添加 `#[Session]`，Livewire 会在该属性每次变化时将其值存储在 session（会话）中。这样，当页面刷新时，Livewire 会从 session 中获取最新的值并在组件中使用。

`#[Session]` attribute 与 [`#[Url]`](/docs/livewire/v3.x/url) attribute 类似。它们在相似的场景中都很有用。主要区别在于 `#[Session]` 持久化值时不修改 URL 的查询字符串，这在某些场景下是期望的，某些场景下则不是。

## 基本用法

以下是一个 `ShowPosts` 组件，允许用户通过存储在 `$search` 属性中的字符串来筛选可见的帖子：

```php
<?php

use Livewire\Attributes\Session;
use Livewire\Component;
use App\Models\Post;

class ShowPosts extends Component
{
    #[Session] // [tl! highlight]
    public $search;

    protected function posts()
    {
        return $this->search === ''
            ? Post::all()
            : Post::where('title', 'like', '%'.$this->search.'%');
    }

    public function render()
    {
        return view('livewire.show-posts', [
            'posts' => $this->posts(),
        ]);
    }
}
```

由于 `$search` 属性上添加了 `#[Session]` attribute，用户在输入搜索值后，可以刷新页面，搜索值将被持久化。每次 `$search` 更新时，其新值都会存储在用户的 session 中，并在页面加载之间使用。

> [!warning] 性能影响
> 由于 Laravel 的 session 在每次请求时都会加载到内存中，如果在用户的 session 中存储过多数据，可能会降低整个应用对特定用户的性能。

## 设置自定义键

使用 `#[Session]` 时，Livewire 会使用动态生成的键将属性值存储在 session 中，该键由组件名称和属性名称组合而成。

这确保了跨组件实例的属性将使用相同的 session 值。同时也确保了来自不同组件的同名属性不会冲突。

如果你希望对 Livewire 用于某个属性的 session 键拥有完全控制权，可以传递 `key:` 参数：

```php
<?php

use Livewire\Attributes\Session;
use Livewire\Component;

class ShowPosts extends Component
{
    #[Session(key: 'search')] // [tl! highlight]
    public $search;

    // ...
}
```

当 Livewire 存储和检索 `$search` 属性的值时，它将使用指定的键："search"。

此外，如果你希望根据组件中的其他属性动态生成键，可以使用以下花括号表示法：

```php
<?php

use Livewire\Attributes\Session;
use Livewire\Component;
use App\Models\Author;

class ShowPosts extends Component
{
    public Author $author;

    #[Session(key: 'search-{author.id}')] // [tl! highlight]
    public $search;

    // ...
}
```

在上面的示例中，如果 `$author` 模型的 id 是"4"，session 键将变为：`search-4`。
