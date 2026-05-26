---
title: x-ref
source:
  repo: https://github.com/alpinejs/alpine
  ref: main
  path: packages/docs/src/en/directives/ref.md
version: v3.x
translation_status: translated
---

# x-ref

`x-ref` 与 `$refs` 结合是一个有用的工具，可直接访问 DOM 元素。

```html
<button @click="$refs.text.remove()">Remove Text</button>

<span x-ref="text">Hello 👋</span>
```
