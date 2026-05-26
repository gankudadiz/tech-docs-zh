---
title: $refs
source:
  repo: https://github.com/alpinejs/alpine
  ref: main
  path: packages/docs/src/en/magics/refs.md
version: v3.x
translation_status: translated
---

# $refs

`$refs` 是一个魔法属性，可用于检索组件内使用 `x-ref` 标记的 DOM 元素。

```html
<button @click="$refs.text.remove()">Remove Text</button>

<span x-ref="text">Hello 👋</span>
```

<a name="limitations"></a>
### 限制

在 V3 中，只有静态创建的元素的 `$refs` 才能被访问。
