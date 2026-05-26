---
title: $el
source:
  repo: https://github.com/alpinejs/alpine
  ref: main
  path: packages/docs/src/en/magics/el.md
version: v3.x
translation_status: translated
---

# $el

`$el` 是一个魔法属性，可用于检索当前 DOM 节点。

```html
<button @click="$el.innerHTML = 'Hello World!'">Replace me with "Hello World!"</button>
```
