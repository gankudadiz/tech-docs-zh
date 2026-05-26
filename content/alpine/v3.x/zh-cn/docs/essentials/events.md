---
title: 事件
source:
  repo: https://github.com/alpinejs/alpine
  ref: main
  path: packages/docs/src/en/essentials/events.md
version: v3.x
translation_status: translated
---

# 事件

Alpine 使得监听浏览器事件并对其做出响应变得简单。

<a name="listening-for-simple-events"></a>
## 监听简单事件

通过使用 `x-on`，你可以监听元素上或其内部触发的浏览器事件。

以下是一个监听按钮点击事件的基本示例：

```html
<button x-on:click="console.log('clicked')">...</button>
```

你也可以选择使用事件简写语法：`@`。以下是使用简写语法的同一个示例（从现在起我们将使用这种语法）：

```html
<button @click="...">...</button>
```

除了 `click`，你可以按名称监听任何浏览器事件。例如：`@mouseenter`、`@keyup` 等都是有效的语法。

<a name="listening-for-specific-keys"></a>
## 监听特定按键

假设你想要监听 `<input>` 元素中的 `enter` 键按下事件。Alpine 通过添加 `.enter` 使这变得简单：

```html
<input @keyup.enter="...">
```

你甚至可以组合按键修饰符来监听按键组合，比如按住 `shift` 的同时按下 `enter`：

```html
<input @keyup.shift.enter="...">
```

<a name="preventing-default"></a>
## 阻止默认行为

在响应浏览器事件时，通常需要"阻止默认行为"（阻止浏览器事件的默认行为）。

例如，如果你想监听表单的提交事件，但阻止浏览器提交表单请求，可以使用 `.prevent`：

```html
<form @submit.prevent="...">...</form>
```

你也可以使用 `.stop` 来实现 `event.stopPropagation()` 的等效功能。

<a name="accessing-the-event-object"></a>
## 访问事件对象

有时你可能想在自己的代码中访问原生浏览器事件对象。为了方便，Alpine 自动注入了 `$event` 魔法变量：

```html
<button @click="$event.target.remove()">Remove Me</button>
```

<a name="dispatching-custom-events"></a>
## 派发自定义事件

除了监听浏览器事件，你还可以派发它们。这对于与其他 Alpine 组件通信或触发 Alpine 之外的工具中的事件非常有用。

Alpine 为此暴露了一个名为 `$dispatch` 的魔法辅助方法：

```html
<div @foo="console.log('foo was dispatched')">
    <button @click="$dispatch('foo')"></button>
</div>
```

如你所见，当按钮被点击时，Alpine 会派发一个名为 "foo" 的浏览器事件，而 `<div>` 上的 `@foo` 监听器会捕获到它并做出响应。

<a name="listening-for-events-on-window"></a>
## 在 window 上监听事件

由于浏览器中事件的特性，有时在顶层的 window 对象上监听事件会很有用。

这允许你像下面的例子一样在组件之间完全通信：

```html
<div x-data>
    <button @click="$dispatch('foo')"></button>
</div>

<div x-data @foo.window="console.log('foo was dispatched')">...</div>
```

在上面的示例中，如果我们点击第一个组件中的按钮，Alpine 会派发 "foo" 事件。由于事件在浏览器中的工作方式，它们会冒泡经过父元素，一直到达顶层的 "window"。

现在，因为我们在第二个组件中是在 window 上监听 "foo"（通过 `.window`），当按钮被点击时，这个监听器会捕获到它并记录 "foo was dispatched" 消息。

[→ 阅读更多关于 x-on 的内容](/directives/on)
