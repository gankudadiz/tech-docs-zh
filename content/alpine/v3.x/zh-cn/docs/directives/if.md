---
title: x-if
source:
  repo: https://github.com/alpinejs/alpine
  ref: main
  path: packages/docs/src/en/directives/if.md
version: v3.x
translation_status: translated
---

# x-if

`x-if` 用于切换页面上的元素，与 `x-show` 类似，但它完全添加和移除应用的元素。

```html
<template x-if="open">
    <div>Contents...</div>
</template>
```

## 注意事项

与 `x-show` 不同，`x-if` 不支持使用 `x-transition` 进行过渡切换。

`<template>` 标签只能包含一个根元素。
