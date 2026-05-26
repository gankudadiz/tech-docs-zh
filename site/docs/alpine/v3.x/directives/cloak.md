---
title: x-cloak
source: https://github.com/alpinejs/alpine/blob/main/packages/docs/src/en/directives/cloak.md
source_version: v3.x
translation_status: draft
---

# x-cloak

有时，当你在模板的一部分中使用 AlpineJS 时，会有一个"闪烁"，即你在页面加载后、Alpine 加载前看到未初始化的模板。

`x-cloak` 通过隐藏其附加的元素直到 Alpine 在页面上完全加载来解决此问题。

要使 `x-cloak` 起作用，你必须在页面中添加以下 CSS。

```css
[x-cloak] { display: none !important; }
```

以下示例将隐藏 `<span>` 标签，直到其 `x-show` 特别设置为 true，从而防止 Alpine 加载时隐藏元素出现任何"闪烁"。

```html
<span x-cloak x-show="false">This will not 'blip' onto screen at any point</span>
```

`x-cloak` 不仅适用于被 `x-show` 或 `x-if` 隐藏的元素：它还确保包含数据的元素在数据正确设置之前被隐藏。以下示例将隐藏 `<span>` 标签，直到 Alpine 将其文本内容设置为 `message` 属性。

```html
<span x-cloak x-text="message"></span>
```

当 Alpine 在页面上加载时，它会从元素中移除所有 `x-cloak` 属性，从而也移除了通过 CSS 应用的 `display: none;`，因此显示元素。

## 全局语法的替代方案

如果你希望实现同样的行为，但避免包含全局样式，可以使用以下巧妙但无疑有些奇特的技巧：

```html
<template x-if="true">
    <span x-text="message"></span>
</template>
```

这将通过利用 `x-if` 的工作方式达到与 `x-cloak` 相同的目标。

因为 `<template>` 元素在浏览器中默认是"隐藏"的，在 Alpine 有机会渲染 `x-if="true"` 并显示它之前，你不会看到 `<span>`。

同样，这个解决方案并不适合所有人，但值得在特殊情况下提及。
