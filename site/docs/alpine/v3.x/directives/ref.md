---
title: x-ref
source: https://github.com/alpinejs/alpine/blob/main/packages/docs/src/en/directives/ref.md
source_version: v3.x
translation_status: draft
---

# x-ref

`x-ref` 与 `$refs` 结合是一个有用的工具，可直接访问 DOM 元素。它最常用作 `getElementById` 和 `querySelector` 等 API 的替代品。

```html
<button @click="$refs.text.remove()">Remove Text</button>

<span x-ref="text">Hello 👋</span>
```

> 尽管未包含在上面的代码片段中，但如果没有任何父元素定义 `x-data`，则不能使用 `x-ref`。[→ 阅读更多关于 `x-data` 的内容](./data)
