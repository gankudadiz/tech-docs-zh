---
title: Teleport
source: https://github.com/livewire/livewire/blob/v3.8.0/docs/teleport.md
source_version: v3.8.0
translation_status: draft
---

Livewire 允许你将模板的一部分 _teleport_ 到页面 DOM 的其他位置。

这对于嵌套对话框等场景非常有用。当一个对话框嵌套在另一个对话框内部时，父级模态框的 z-index 会应用到嵌套的模态框上。这可能会导致背景层和覆盖层的样式出现问题。为了避免这个问题，你可以使用 Livewire 的 `@teleport` 指令将每个嵌套模态框渲染为 DOM 中的兄弟元素。

此功能基于 [Alpine 的 `x-teleport` 指令](https://alpinejs.dev/directives/teleport) 实现。

## 基本用法

要将模板的一部分 _teleport_ 到 DOM 的其他位置，你可以在 Livewire 的 `@teleport` 指令中包裹这部分内容。

下面是一个使用 `@teleport` 将模态对话框的内容渲染到页面 `<body>` 元素末尾的示例：

```blade
<div>
    <!-- Modal -->
    <div x-data="{ open: false }">
        <button @click="open = ! open">Toggle Modal</button>

        @teleport('body')
            <div x-show="open">
                Modal contents...
            </div>
        @endteleport
    </div>
</div>
```

:::info
`@teleport` 选择器可以是任何你通常会传给 `document.querySelector()` 的字符串。

你可以查阅 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector) 了解更多关于 `document.querySelector()` 的信息。
:::

现在，当上面的 Livewire 模板在页面上渲染时，模态框的 _内容_ 部分将会被渲染到 `<body>` 的末尾：

```html
<body>
    <!-- ... -->

    <div x-show="open">
        Modal contents...
    </div>
</body>
```

:::warning 必须 teleport 到组件外部
Livewire 只支持将 HTML teleport 到你的组件外部。例如，将模态框 teleport 到 `<body>` 标签是可以的，但 teleport 到组件内的另一个元素则无法工作。
:::

:::warning Teleport 只支持单个根元素
确保在你的 `@teleport` 语句中只包含一个根元素。
:::
