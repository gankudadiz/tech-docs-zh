---
title: wire:init
source: https://github.com/livewire/livewire/blob/v3.8.0/docs/wire-init.md
source_version: v3.8.0
translation_status: draft
---

Livewire 提供了 `wire:init` 指令，用于在组件渲染后立即运行一个动作。这在你不希望拖慢整个页面加载，但又希望在页面加载后立即加载某些数据时很有用。

```blade
<div wire:init="loadPosts">
    <!-- ... -->
</div>
```

`loadPosts` 动作将在 Livewire 组件在页面上渲染后立即执行。

不过，在大多数情况下，[Livewire 的懒加载功能](/docs/livewire/v3.x/lazy) 比使用 `wire:init` 更可取。
