---
title: 扩展 Alpine
source:
  repo: https://github.com/alpinejs/alpine
  ref: main
  path: packages/docs/src/en/advanced/extending.md
version: v3.x
translation_status: translated
---

# 扩展 Alpine

## 自定义指令

```js
Alpine.directive('[name]', (el, { value, modifiers, expression }, { Alpine, effect, cleanup }) => {})
```

## 自定义魔法属性

```js
Alpine.magic('[name]', (el, { Alpine }) => {})
```

## 编写和共享插件

```js
export default function (Alpine) {
    Alpine.directive('foo', ...)
    Alpine.magic('foo', ...)
}
```
