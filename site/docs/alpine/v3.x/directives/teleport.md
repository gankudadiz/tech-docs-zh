---
title: x-teleport
source: https://github.com/alpinejs/alpine/blob/main/packages/docs/src/en/directives/teleport.md
source_version: v3.x
translation_status: draft
---

# x-teleport

`x-teleport` 指令允许你将 Alpine 模板的一部分完全传输到页面上 DOM 的另一部分。

这对于模态框（特别是嵌套模态框）之类的东西很有用，有助于突破当前 Alpine 组件的 z-index 层级。

## x-teleport

通过将 `x-teleport` 附加到 `<template>` 元素，你告诉 Alpine 将该元素"追加"到提供的选择器。

> `x-teleport` 选择器可以是任何通常传入 `document.querySelector` 的内容。它会找到第一个匹配的元素，无论是标签名（`body`）、类名（`.my-class`）、ID（`#my-id`）还是任何其他有效的 CSS 选择器。

[→ 阅读更多关于 `document.querySelector` 的内容](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector)

以下是一个简单的模态框示例：

```html
<body>
    <div x-data="{ open: false }">
        <button @click="open = ! open">Toggle Modal</button>

        <template x-teleport="body">
            <div x-show="open">
                Modal contents...
            </div>
        </template>
    </div>

    <div>Some other content placed AFTER the modal markup.</div>

    ...

</body>
```

注意到当切换模态框时，实际的模态框内容出现在"Some other content..."元素之后？这是因为 Alpine 初始化时看到了 `x-teleport="body"`，并将该元素追加和初始化到提供的元素选择器。

## 转发事件

Alpine 尽力使 teleport 的体验无缝。任何你通常在模板中能做的事情，都应该能够在 `x-teleport` 模板中完成。Teleport 的内容可以访问组件的正常 Alpine 作用域以及其他特性，如 `$refs`、`$root` 等。

然而，原生 DOM 事件没有 teleport 的概念，因此，例如，如果你从 teleport 的元素内部触发"click"事件，该事件将像往常一样在 DOM 树中冒泡。

为了提供更无缝的体验，你可以通过在 `<template x-teleport...>` 元素本身上注册事件监听器来"转发"事件，如下所示：

```html
<div x-data="{ open: false }">
    <button @click="open = ! open">Toggle Modal</button>

    <template x-teleport="body" @click="open = false">
        <div x-show="open">
            Modal contents...
            (click to close)
        </div>
    </template>
</div>
```

注意到我们现在能够从 `<template>` 元素外部监听从 teleport 元素内部派发的事件了吗？

Alpine 通过查找在 `<template x-teleport...>` 上注册的事件监听器，并阻止这些事件传播到实际的 teleport DOM 元素之外来实现这一点。然后，它会创建该事件的副本并从 `<template x-teleport...>` 重新派发它。

## 嵌套

如果你试图在一个模态框中嵌套另一个模态框，Teleport 尤其有用。Alpine 使这变得简单：

```html
<div x-data="{ open: false }">
    <button @click="open = ! open">Toggle Modal</button>

    <template x-teleport="body">
        <div x-show="open">
            Modal contents...

            <div x-data="{ open: false }">
                <button @click="open = ! open">Toggle Nested Modal</button>

                <template x-teleport="body">
                    <div x-show="open">
                        Nested modal contents...
                    </div>
                </template>
            </div>
        </div>
    </template>
</div>
```

在同时切换"打开"两个模态框后，它们被编写为子元素，但在页面上将渲染为兄弟元素，而不是彼此嵌套。
