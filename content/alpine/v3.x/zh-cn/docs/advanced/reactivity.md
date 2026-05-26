---
title: 响应式
source:
  repo: https://github.com/alpinejs/alpine
  ref: main
  path: packages/docs/src/en/advanced/reactivity.md
version: v3.x
translation_status: translated
---

# 响应式

Alpine 在底层使用 VueJS 的响应式引擎。

```js
let data = { count: 1 }
let reactiveData = Alpine.reactive(data)

Alpine.effect(() => { console.log(data.count) })
```
