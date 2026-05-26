---
title: wire:cloak
source: https://github.com/livewire/livewire/blob/v3.8.0/docs/wire-cloak.md
source_version: v3.8.0
translation_status: draft
---

`wire:cloak` 是一个指令，用于在页面加载时隐藏元素，直到 Livewire 完全初始化。这有助于防止在 Livewire 初始化之前页面加载时可能出现的"未样式化内容闪烁"。

## 基本用法

要使用 `wire:cloak`，将该指令添加到任何你想在页面加载期间隐藏的元素上：

```blade
<div wire:cloak>
    此内容在 Livewire 完全加载之前将被隐藏
</div>
```

### 动态内容

`wire:cloak` 在需要防止用户看到未初始化的动态内容时特别有用，例如使用 `wire:show` 显示或隐藏的元素：

```blade
<div>
    <div wire:show="starred" wire:cloak>
        <!-- 黄色星标图标... -->
    </div>

    <div wire:show="!starred" wire:cloak>
        <!-- 灰色星标图标... -->
    </div>
</div>
```

在上面的示例中，如果没有 `wire:cloak`，两个图标在 Livewire 初始化之前都会显示。但有了 `wire:cloak`，两个元素在初始化完成之前都将保持隐藏。
