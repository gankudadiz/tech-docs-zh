---
title: $el
source: https://github.com/alpinejs/alpine/blob/main/packages/docs/src/en/magics/el.md
source_version: v3.x
translation_status: draft
---

# $el

`$el` 是一个魔法属性，可用于检索当前 DOM 节点。

```html
<button @click="$el.innerHTML = 'Hello World!'">Replace me with "Hello World!"</button>
```
