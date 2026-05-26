---
title: x-cloak
source:
  repo: https://github.com/alpinejs/alpine
  ref: main
  path: packages/docs/src/en/directives/cloak.md
version: v3.x
translation_status: translated
---

# x-cloak

有时，当你在模板的一部分中使用 AlpineJS 时，会有一个"闪烁"，即你在页面加载后、Alpine 加载前看到未初始化的模板。

`x-cloak` 通过隐藏其附加的元素直到 Alpine 在页面上完全加载来解决此问题。

要使 `x-cloak` 起作用，你必须在页面中添加以下 CSS。

```css
[x-cloak] { display: none !important; }
```

```html
<span x-cloak x-show="false">This will not 'blip' onto screen at any point</span>
```

```html
<span x-cloak x-text="message"></span>
```

当 Alpine 在页面上加载时，它会从元素中移除所有 `x-cloak` 属性。

## 全局语法的替代方案

```html
<template x-if="true">
    <span x-text="message"></span>
</template>
```
