---
title: $root
source: https://github.com/alpinejs/alpine/blob/main/packages/docs/src/en/magics/root.md
source_version: v3.x
translation_status: draft
---

# $root

`$root` 是一个魔法属性，可用于检索任何 Alpine 组件的根元素。换句话说，就是 DOM 树中包含 `x-data` 的最近上层元素。

```html
<div x-data data-message="Hello World!">
    <button @click="alert($root.dataset.message)">Say Hi</button>
</div>
```
