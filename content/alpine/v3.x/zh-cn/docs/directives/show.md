---
title: x-show
source:
  repo: https://github.com/alpinejs/alpine
  ref: main
  path: packages/docs/src/en/directives/show.md
version: v3.x
translation_status: translated
---

# x-show

`x-show` 是 Alpine 中最有用和最强大的指令之一。它提供了一种表现力丰富的方式来显示和隐藏 DOM 元素。

以下是一个使用 `x-show` 的简单下拉菜单组件示例。

```html
<div x-data="{ open: false }">
    <button x-on:click="open = ! open">Toggle Dropdown</button>

    <div x-show="open">
        Dropdown Contents...
    </div>
</div>
```

当点击"Toggle Dropdown"按钮时，下拉菜单将相应地显示和隐藏。

> 如果页面加载时 `x-show` 的"默认"状态是"false"，你可能希望在页面上使用 `x-cloak` 来避免"页面闪烁"（浏览器在 Alpine 完成初始化并隐藏内容之前渲染内容的效果）。你可以在其文档中了解更多关于 `x-cloak` 的内容。

<a name="with-transitions"></a>
## 带过渡效果

如果你想为 `x-show` 行为应用平滑的过渡，可以将其与 `x-transition` 结合使用。你可以在这里了解更多关于该指令的信息，但以下是应用了过渡效果的相同组件的快速示例。

```html
<div x-data="{ open: false }">
    <button x-on:click="open = ! open">Toggle Dropdown</button>

    <div x-show="open" x-transition>
        Dropdown Contents...
    </div>
</div>
```

<a name="using-the-important-modifier"></a>
## 使用 important 修饰符

有时你需要更强的力度来实际隐藏一个元素。在 CSS 选择器使用 `!important` 标志应用 `display` 属性的情况下，它将优先于 Alpine 设置的内联样式。

在这些情况下，你可以使用 `.important` 修饰符将内联样式设置为 `display: none !important`。

```html
<div x-data="{ open: false }">
    <button x-on:click="open = ! open">Toggle Dropdown</button>

    <div x-show.important="open">
        Dropdown Contents...
    </div>
</div>
```
