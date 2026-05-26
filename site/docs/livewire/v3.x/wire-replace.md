---
title: wire:replace
source: https://github.com/livewire/livewire/blob/v3.8.0/docs/wire-replace.md
source_version: v3.8.0
translation_status: draft
---

Livewire 的 DOM diff 对比对于更新页面上的现有元素很有用，但有时你可能需要强制某些元素从头渲染以重置内部状态。

在这些情况下，你可以使用 `wire:replace` 指令来指示 Livewire 跳过对元素子元素的 DOM diff 对比，而是用服务器返回的新元素完全替换内容。

这在处理第三方 JavaScript 库和自定义 Web 组件时最为有用，或者当元素复用可能导致状态保持问题时。

以下是将影子 DOM Web 组件包裹在 `wire:replace` 中的示例，这样 Livewire 会完全替换该元素，让自定义元素处理自己的生命周期：

```blade
<form>
    <!-- ... -->

    <div wire:replace>
        <!-- 此自定义元素将拥有自己的内部状态 -->
        <json-viewer>@json($someProperty)</json-viewer>
    </div>

    <!-- ... -->
</form>
```

你还可以指示 Livewire 同时替换目标元素及其所有子元素，使用 `wire:replace.self`：

```blade
<div x-data="{open: false}" wire:replace.self>
  <!-- 确保每次渲染时 "open" 状态都重置为 false -->
</div>
```
