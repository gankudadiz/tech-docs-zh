---
title: x-if
source: https://github.com/alpinejs/alpine/blob/main/packages/docs/src/en/directives/if.md
source_version: v3.x
translation_status: draft
---

# x-if

`x-if` 用于切换页面上的元素，与 `x-show` 类似，但它完全添加和移除应用的元素，而不仅仅是将其 CSS 显示属性更改为"none"。

由于这种行为的差异，`x-if` 不应直接应用于元素，而应应用于包裹该元素的 `<template>` 标签。这样，Alpine 可以在元素从页面上移除后保留其记录。

```html
<template x-if="open">
    <div>Contents...</div>
</template>
```

> 尽管未包含在上面的代码片段中，但如果没有任何父元素定义 `x-data`，则不能使用 `x-if`。[→ 阅读更多关于 `x-data` 的内容](./data)

## 注意事项

与 `x-show` 不同，`x-if` 不支持使用 `x-transition` 进行过渡切换。

`<template>` 标签只能包含一个根元素。
