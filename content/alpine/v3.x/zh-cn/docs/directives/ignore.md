---
title: x-ignore
source:
  repo: https://github.com/alpinejs/alpine
  ref: main
  path: packages/docs/src/en/directives/ignore.md
version: v3.x
translation_status: translated
---

# x-ignore

默认情况下，Alpine 会爬取并初始化包含 `x-init` 或 `x-data` 的元素的整个 DOM 树。

如果出于某种原因，你不想 Alpine 触及 HTML 的特定部分，可以使用 `x-ignore` 来阻止它这样做。

```html
<div x-data="{ label: 'From Alpine' }">
    <div x-ignore>
        <span x-text="label"></span>
    </div>
</div>
```

在上面的示例中，`<span>` 标签不会包含"From Alpine"，因为我们告诉 Alpine 完全忽略 `div` 的内容。
