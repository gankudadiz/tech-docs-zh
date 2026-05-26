---
title: 从这里开始
source: https://github.com/alpinejs/alpine/blob/main/packages/docs/src/en/start-here.md
source_version: v3.x
translation_status: draft
---

# 从这里开始

在电脑上创建一个空白 HTML 文件，命名为 `i-love-alpine.html`。

用文本编辑器填入以下内容：

```html
<html>
<head>
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
</head>
<body>
    <h1 x-data="{ message: 'I ❤️ Alpine' }" x-text="message"></h1>
</body>
</html>
```

在浏览器中打开这个文件，如果你看到 `I ❤️ Alpine`，就可以开始玩了！

现在你已经准备好动手实践了，让我们看三个实际示例，作为学习 Alpine 基础知识的基础。完成这个练习后，你应该完全有能力开始自己构建内容了。让我们开始吧！

- [构建计数器](#构建计数器)
- [构建下拉菜单](#构建下拉菜单)
- [构建搜索输入框](#构建搜索输入框)

## 构建计数器

让我们从一个简单的"计数器"组件开始，演示 Alpine 的两个核心功能：状态管理和事件监听。

将以下内容插入到 `<body>` 标签中：

```html
<div x-data="{ count: 0 }">
    <button x-on:click="count++">Increment</button>

    <span x-text="count"></span>
</div>
```

现在你可以看到，将 3 个 Alpine 属性嵌入到这段 HTML 中，我们就创建了一个交互式的"计数器"组件。

让我们快速过一遍这里发生了什么：

### 声明数据

```html
<div x-data="{ count: 0 }">
```

Alpine 中的一切始于 `x-data` 指令。在 `x-data` 内部，用纯 JavaScript 声明一个 Alpine 会跟踪的数据对象。

这个对象中的每个属性都可以在该 HTML 元素内的其他指令中使用。此外，当这些属性之一发生变化时，所有依赖它的内容也会随之变化。

> 大多数 Alpine 指令需要在父元素上声明 `x-data` 才能工作。

[→ 阅读更多关于 `x-data` 的内容](./directives/data)

让我们看看 `x-on` 以及它如何访问和修改上面的 `count` 属性：

### 监听事件

```html
<button x-on:click="count++">Increment</button>
```

`x-on` 是一个指令，用于监听元素上的任何事件。在这个例子中，我们监听的是 `click` 事件，所以写成 `x-on:click`。

你还可以监听其他事件。例如，监听 `mouseenter` 事件会写成：`x-on:mouseenter`。

当 `click` 事件发生时，Alpine 会调用关联的 JavaScript 表达式，在我们的例子中是 `count++`。如你所见，我们可以直接访问 `x-data` 表达式中声明的数据。

> 你经常会看到 `@` 代替 `x-on:`。这是许多人更喜欢的更短、更友好的语法。从现在开始，本文档可能会使用 `@` 代替 `x-on:`。

[→ 阅读更多关于 `x-on` 的内容](./directives/on)

### 响应变化

```html
<span x-text="count"></span>
```

`x-text` 是一个 Alpine 指令，用于将元素的文本内容设置为 JavaScript 表达式的结果。

在这个例子中，我们告诉 Alpine 始终确保这个 `span` 标签的内容反映 `count` 属性的值。

需要明确的是，`x-text` 和大多数指令一样，接受纯 JavaScript 表达式作为参数。因此，你可以将其内容设置为：`x-text="count * 2"`，那么 `span` 的文本内容将始终是 `count` 值的 2 倍。

[→ 阅读更多关于 `x-text` 的内容](./directives/text)

## 构建下拉菜单

现在我们已经看到了一些基本功能，让我们继续学习 Alpine 中的一个重要指令：`x-show`，通过构建一个简单的"下拉菜单"组件。

将以下代码插入到 `<body>` 标签中：

```html
<div x-data="{ open: false }">
    <button @click="open = ! open">Toggle</button>

    <div x-show="open" @click.outside="open = false">Contents...</div>
</div>
```

如果你加载这个组件，你会看到 "Contents..." 默认是隐藏的。你可以通过点击 "Toggle" 按钮来切换显示。

`x-data` 和 `x-on` 指令你应该已经从前面的例子中熟悉了，所以我们跳过这些解释。

### 切换元素

```html
<div x-show="open" ...>Contents...</div>
```

`x-show` 是 Alpine 中一个非常强大的指令，可以根据 JavaScript 表达式的结果（在我们的例子中是 `open`）来显示或隐藏页面上的 HTML 块。

[→ 阅读更多关于 `x-show` 的内容](./directives/show)

### 监听外部点击

```html
<div ... @click.outside="open = false">Contents...</div>
```

你会注意到这个例子中有个新东西：`.outside`。Alpine 中的许多指令接受"修饰符"，它们链接在指令末尾，用句点分隔。

在这个例子中，`.outside` 告诉 Alpine 不是监听 `<div>` 内部的点击，而是监听发生在 `<div>` 外部的点击。

这是 Alpine 内置的一个便捷辅助功能，因为这是一个常见需求，手动实现既烦人又复杂。

[→ 阅读更多关于 `x-on` 修饰符的内容](./directives/on#modifiers)

## 构建搜索输入框

现在让我们构建一个更复杂的组件，并介绍一些其他的指令和模式。

将以下代码插入到 `<body>` 标签中：

```html
<div
    x-data="{
        search: '',

        items: ['foo', 'bar', 'baz'],

        get filteredItems() {
            return this.items.filter(
                i => i.startsWith(this.search)
            )
        }
    }"
>
    <input x-model="search" placeholder="Search...">

    <ul>
        <template x-for="item in filteredItems" :key="item">
            <li x-text="item"></li>
        </template>
    </ul>
</div>
```

默认情况下，所有的"items"（foo、bar 和 baz）都会显示在页面上，但你可以通过在文本输入框中输入文本来过滤它们。当你输入时，项目列表会随之变化，反映你的搜索内容。

这里发生了不少事情，让我们逐段分析这段代码。

### 多行格式化

首先我想指出的是，`x-data` 中的内容比之前多得多。为了更容易编写和阅读，我们将 HTML 中的代码分成了多行。这是完全可选的，我们稍后会详细讨论如何完全避免这个问题，但现在，我们会把所有 JavaScript 代码直接保留在 HTML 中。

### 绑定输入

```html
<input x-model="search" placeholder="Search...">
```

你会注意到一个我们还没见过的新指令：`x-model`。

`x-model` 用于将输入元素的值与数据属性"绑定"：在我们的例子中是 `x-data="{ search: '', ... }"` 中的 "search"。

这意味着每当输入框的值发生变化时，"search" 的值也会随之变化。

`x-model` 的功能远不止这个简单示例。

[→ 阅读更多关于 `x-model` 的内容](./directives/model)

### 使用 getter 的计算属性

接下来我想让你注意 `x-data` 指令中的 `items` 和 `filteredItems` 属性。

```js
{
    ...
    items: ['foo', 'bar', 'baz'],

    get filteredItems() {
        return this.items.filter(
            i => i.startsWith(this.search)
        )
    }
}
```

`items` 属性应该是不言自明的。这里我们将 `items` 的值设置为一个包含 3 个不同项目（foo、bar 和 baz）的 JavaScript 数组。

这段代码中有趣的部分是 `filteredItems` 属性。

通过 `get` 前缀表示，`filteredItems` 是这个对象中的一个"getter"属性。这意味着我们可以像访问数据对象中的普通属性一样访问 `filteredItems`，但当我们这样做时，JavaScript 会在底层执行提供的函数并返回结果。

完全可以不使用 `get`，而只将其作为一个可以在模板中调用的方法，但有些人更喜欢 getter 的更简洁语法。

[→ 阅读更多关于 JavaScript getter 的内容](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get)

现在让我们看看 `filteredItems` getter 内部，确保我们理解其中发生的事情：

```js
return this.items.filter(
    i => i.startsWith(this.search)
)
```

这全都是纯 JavaScript。我们首先获取 items 数组（foo、bar 和 baz），然后使用提供的回调函数进行过滤：`i => i.startsWith(this.search)`。

通过将这个回调传入 `filter`，我们告诉 JavaScript 只返回以字符串 `this.search` 开头的项目，而 `this.search` 正如我们在 `x-model` 中看到的，始终反映输入框的值。

你可能注意到到目前为止，我们还不必使用 `this.` 来引用属性。然而，因为我们直接在 `x-data` 对象内部工作，必须使用 `this.[property]` 而不是简单的 `[property]` 来引用任何属性。

因为 Alpine 是一个"响应式"框架。每当 `this.search` 的值发生变化时，模板中使用 `filteredItems` 的部分都会自动更新。

### 循环元素

现在我们理解了组件的数据部分，让我们理解模板中发生了什么，使我们能够在页面上循环遍历 `filteredItems`。

```html
<ul>
    <template x-for="item in filteredItems">
        <li x-text="item"></li>
    </template>
</ul>
```

这里首先要注意的是 `x-for` 指令。`x-for` 表达式采用以下形式：`[item] in [items]`，其中 [items] 是任何数据数组，[item] 是将被赋值为循环中迭代项的变量名称。

还要注意 `x-for` 是声明在 `<template>` 元素上，而不是直接声明在 `<li>` 上。这是使用 `x-for` 的要求。它允许 Alpine 利用浏览器中 `<template>` 标签的现有行为来发挥优势。

现在，`<template>` 标签内的任何元素都会为 `filteredItems` 中的每个项目重复渲染，并且循环中求值的所有表达式都可以直接访问迭代变量（在这个例子中是 `item`）。

[→ 阅读更多关于 `x-for` 的内容](./directives/for)

## 回顾

如果你已经读到这里，你已经接触了 Alpine 中的以下指令：

- x-data
- x-on
- x-text
- x-show
- x-model
- x-for

这是一个很好的开始，不过还有更多的指令等着你去探索。吸收 Alpine 的最佳方式是通读这份文档。不需要逐字逐句地看，但如果你至少浏览一下每个页面，你在使用 Alpine 时将会高效得多。

祝你编码愉快！
