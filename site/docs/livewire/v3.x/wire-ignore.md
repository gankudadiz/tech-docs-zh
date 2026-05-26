---
title: wire:ignore
source: https://github.com/livewire/livewire/blob/v3.8.0/docs/wire-ignore.md
source_version: v3.8.0
translation_status: draft
---

Livewire 更新页面的能力正是它之所以"实时"的原因，但有时你可能希望阻止 Livewire 更新页面的一部分。

在这些情况下，你可以使用 `wire:ignore` 指令来指示 Livewire 忽略特定元素的内容，即使它们在请求之间发生了变化。

这在处理第三方 JavaScript 库的自定义表单输入等场景中最为有用。

以下是将第三方库使用的元素包裹在 `wire:ignore` 中的示例，这样 Livewire 就不会篡改该库生成的 HTML：

```blade
<form>
    <!-- ... -->

    <div wire:ignore>
        <!-- 此元素将被第三方库引用以进行初始化... -->
        <input id="id-for-date-picker-library">
    </div>

    <!-- ... -->
</form>
```

你还可以指示 Livewire 仅忽略根元素的属性变化，而不是观察其子元素内容的变化，使用 `wire:ignore.self`：

```blade
<div wire:ignore.self>
    <!-- ... -->
</div>
```
