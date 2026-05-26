---
title: 模板
source: https://github.com/alpinejs/alpine/blob/main/packages/docs/src/en/essentials/templating.md
source_version: v3.x
translation_status: draft
---

# 模板

Alpine 提供了一些有用的指令来操作网页上的 DOM。

让我们在这里介绍几个基本的模板指令，但请务必查看侧边栏中所有可用的指令以获取完整列表。

## 文本内容

Alpine 通过 `x-text` 指令可以轻松控制元素的文本内容。

```html
<div x-data="{ title: 'Start Here' }">
    <h1 x-text="title"></h1>
</div>
```

现在，Alpine 会将 `<h1>` 的文本内容设置为 `title` 的值（"Start Here"）。当 `title` 发生变化时，`<h1>` 的内容也会随之变化。

与 Alpine 中的所有指令一样，你可以使用任何你喜欢的 JavaScript 表达式。例如：

```html
<span x-text="1 + 2"></span>
```

`<span>` 现在将包含 "1" 和 "2" 的和。

[→ 阅读更多关于 `x-text` 的内容](../directives/text)

## 切换元素

切换元素是网页和应用中的常见需求。下拉菜单、模态框、对话框、"展开更多"等都是很好的例子。

Alpine 提供了 `x-show` 和 `x-if` 指令来切换页面上的元素。

### `x-show`

以下是使用 `x-show` 的简单切换组件。

```html
<div x-data="{ open: false }">
    <button @click="open = ! open">Expand</button>

    <div x-show="open">
        Content...
    </div>
</div>
```

现在，包含内容的整个 `<div>` 将根据 `open` 的值显示或隐藏。

在底层，Alpine 在需要隐藏元素时为其添加 CSS 属性 `display: none;`。

[→ 阅读更多关于 `x-show` 的内容](../directives/show)

这对于大多数情况都适用，但有时你可能需要完全从 DOM 中添加和移除元素。这就是 `x-if` 的用途。

### `x-if`

以下是之前相同的切换示例，但这次使用 `x-if` 而不是 `x-show`。

```html
<div x-data="{ open: false }">
    <button @click="open = ! open">Expand</button>

    <template x-if="open">
        <div>
            Content...
        </div>
    </template>
</div>
```

注意 `x-if` 必须声明在 `<template>` 标签上。这样 Alpine 才能利用 `<template>` 元素的现有浏览器行为，将其作为目标 `<div>` 的源，以便从页面上添加和移除。

当 `open` 为 true 时，Alpine 会将 `<div>` 追加到 `<template>` 标签；当 `open` 为 false 时，将其移除。

[→ 阅读更多关于 `x-if` 的内容](../directives/if)

## 带动画的切换

Alpine 使用 `x-transition` 指令可以轻松实现"显示"和"隐藏"状态之间的平滑过渡。

> `x-transition` 仅适用于 `x-show`，不适用于 `x-if`。

以下是再次使用之前简单的切换示例，但这次应用了过渡效果：

```html
<div x-data="{ open: false }">
    <button @click="open = ! open">Expands</button>

    <div x-show="open" x-transition>
        Content...
    </div>
</div>
```

让我们放大看模板中处理过渡的部分：

```html
<div x-show="open" x-transition>
```

`x-transition` 本身会为切换应用合理的默认过渡效果（淡入淡出和缩放）。

有两种方式可以自定义这些过渡效果：

* 过渡辅助器
* 过渡 CSS 类

让我们分别看看每种方法：

### 过渡辅助器

假设你想让过渡持续时间更长，你可以使用 `.duration` 修饰符手动指定，如下所示：

```html
<div x-show="open" x-transition.duration.500ms>
```

现在过渡将持续 500 毫秒。

如果你想为进入和离开过渡指定不同的值，可以使用 `x-transition:enter` 和 `x-transition:leave`：

```html
<div
    x-show="open"
    x-transition:enter.duration.500ms
    x-transition:leave.duration.1000ms
>
```

此外，你可以添加 `.opacity` 或 `.scale` 来仅过渡该属性。例如：

```html
<div x-show="open" x-transition.opacity>
```

[→ 阅读更多关于过渡辅助器](../directives/transition#the-transition-helper)

### 过渡 CSS 类

如果你需要对应用中的过渡进行更精细的控制，可以使用以下语法在过渡的特定阶段应用特定的 CSS 类（此示例使用 [Tailwind CSS](https://tailwindcss.com/)）：

```html
<div
    x-show="open"
    x-transition:enter="transition ease-out duration-300"
    x-transition:enter-start="opacity-0 transform scale-90"
    x-transition:enter-end="opacity-100 transform scale-100"
    x-transition:leave="transition ease-in duration-300"
    x-transition:leave-start="opacity-100 transform scale-100"
    x-transition:leave-end="opacity-0 transform scale-90"
>...</div>
```

[→ 阅读更多关于过渡 CSS 类](../directives/transition#applying-css-classes)

## 绑定属性

在 Alpine 中，你可以使用 `x-bind` 指令向元素添加 HTML 属性，如 `class`、`style`、`disabled` 等。

以下是一个动态绑定 `class` 属性的示例：

```html
<button
    x-data="{ red: false }"
    x-bind:class="red ? 'bg-red' : ''"
    @click="red = ! red"
>
    Toggle Red
</button>
```

作为快捷方式，你可以省略 `x-bind` 而直接使用简写 `:` 语法：

```html
<button ... :class="red ? 'bg-red' : ''">
```

在 Alpine 中基于数据切换 class 是常见的需求。以下是使用 Alpine 的 `class` 绑定对象语法切换 class 的示例：（注意：此语法仅适用于 `class` 属性）

```html
<div x-data="{ open: true }">
    <span :class="{ 'hidden': ! open }">...</span>
</div>
```

现在，如果 `open` 为 false，`hidden` 类将被添加到元素中；如果 `open` 为 true，则被移除。

## 循环元素

Alpine 允许使用 `x-for` 指令基于 JavaScript 数据迭代模板的部分内容。以下是一个简单示例：

```html
<div x-data="{ statuses: ['open', 'closed', 'archived'] }">
    <template x-for="status in statuses">
        <div x-text="status"></div>
    </template>
</div>
```

与 `x-if` 类似，`x-for` 必须应用于 `<template>` 标签。在内部，Alpine 会在每次迭代中将 `<template>` 标签的内容追加到循环中。

如你所见，新的 `status` 变量在迭代模板的作用域内可用。

[→ 阅读更多关于 `x-for` 的内容](../directives/for)

## Inner HTML

Alpine 通过 `x-html` 指令可以轻松控制元素的 HTML 内容。

```html
<div x-data="{ title: '<h1>Start Here</h1>' }">
    <div x-html="title"></div>
</div>
```

现在，Alpine 会将 `<div>` 的文本内容设置为元素 `<h1>Start Here</h1>`。当 `title` 发生变化时，`<h1>` 的内容也会随之变化。

> ⚠️ 仅用于受信任的内容，绝不用于用户提供的内容。⚠️
> 动态渲染来自第三方的 HTML 很容易导致 XSS 漏洞。

[→ 阅读更多关于 `x-html` 的内容](../directives/html)
