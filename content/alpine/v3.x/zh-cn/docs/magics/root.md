---
title: $root
source:
  repo: https://github.com/alpinejs/alpine
  ref: main
  path: packages/docs/src/en/magics/root.md
version: v3.x
translation_status: translated
---

# $root

`$root` 可用于检索任何 Alpine 组件的根元素。

```html
<div x-data data-message="Hello World!">
    <button @click="alert($root.dataset.message)">Say Hi</button>
</div>
```
