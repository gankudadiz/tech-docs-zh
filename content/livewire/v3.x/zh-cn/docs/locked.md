---
title: 锁定
source: https://github.com/livewire/livewire/blob/v3.8.0/docs/locked.md
source_version: v3.8.0
translation_status: draft
---

Livewire 的属性可以在前端和后端自由修改，例如使用 `wire:model` 等工具。如果你希望阻止某个属性（如模型 ID）在前端被修改，可以使用 Livewire 的 `#[Locked]` 属性。

## 基本用法

下面是一个 `ShowPost` 组件，它将 `Post` 模型的 ID 存储在一个名为 `$id` 的公共属性中。为了防止这个属性被好奇或恶意的用户修改，你可以为该属性添加 `#[Locked]` 属性：

:::warning 确保导入属性类
确保导入所有属性类。例如，下面的 `#[Locked]` 属性需要导入 `use Livewire\Attributes\Locked;`。
:::

```php
use Livewire\Attributes\Locked;
use Livewire\Component;

class ShowPost extends Component
{
	#[Locked] // [tl! highlight]
    public $id;

    public function mount($postId)
    {
        $this->id = $postId;
    }

	// ...
}
```

通过添加 `#[Locked]` 属性，你可以确保 `$id` 属性永远不会被篡改。

:::tip 模型属性默认是安全的
如果你将 Eloquent 模型存储在公共属性中而非仅存储模型 ID，Livewire 会确保 ID 不会被篡改，无需显式添加 `#[Locked]` 属性。在大多数情况下，这比使用 `#[Locked]` 更好：
```php
class ShowPost extends Component
{
   public Post $post; // [tl! highlight]

   public function mount($postId)
   {
       $this->post = Post::find($postId);
   }

	// ...
}
```
:::

### 为什么不使用受保护的属性？

你可能会问：为什么不用受保护的属性来存储敏感数据呢？

请记住，Livewire 只会在网络请求之间持久化公共属性。对于静态的硬编码数据，受保护的属性是合适的。然而，对于在运行时存储的数据，你必须使用公共属性来确保数据被正确持久化。

### Livewire 不能自动完成这个吗？

在理想情况下，Livewire 会默认锁定属性，仅当在该属性上使用了 `wire:model` 时才允许修改。

不幸的是，这需要 Livewire 解析你所有的 Blade 模板，以了解某个属性是否被 `wire:model` 或类似的 API 修改。

这不仅会增加技术和性能开销，而且对于通过 Alpine 或其他自定义 JavaScript 修改的属性，根本无法检测。

因此，Livewire 将继续默认让公共属性可以自由修改，并为开发者提供在需要时锁定它们的工具。
