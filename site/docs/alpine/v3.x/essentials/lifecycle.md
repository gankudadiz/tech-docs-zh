---
title: 生命周期
source: https://github.com/alpinejs/alpine/blob/main/packages/docs/src/en/essentials/lifecycle.md
source_version: v3.x
translation_status: draft
---

# 生命周期

Alpine 有几种不同的技术用于钩入其生命周期的不同阶段。让我们了解其中最有用的一些：

## 元素初始化

另一个极其有用的生命周期钩子是 `x-init` 指令。

`x-init` 可以添加到页面上的任何元素，当 Alpine 开始初始化该元素时，会执行你在其中调用的任何 JavaScript 代码。

```html
<button x-init="console.log('Im initing')">
```

除了指令之外，Alpine 还会自动调用数据对象上存储的任何 `init()` 方法。例如：

```js
Alpine.data('dropdown', () => ({
    init() {
        // 在使用此数据的元素初始化之前被调用。
    }
}))
```

## 状态变化后

Alpine 允许你在某段数据（状态）发生变化时执行代码。它为此提供了两种不同的 API：`$watch` 和 `x-effect`。

### `$watch`

```html
<div x-data="{ open: false }" x-init="$watch('open', value => console.log(value))">
```

如上所示，`$watch` 允许你使用点号标记的键来钩入数据变化。当那段数据发生变化时，Alpine 会调用传递的回调函数，并传入新值以及变化前的旧值。

[→ 阅读更多关于 $watch 的内容](../magics/watch)

### `x-effect`

`x-effect` 在底层使用了与 `$watch` 相同的机制，但使用方式截然不同。

你不需要指定要监听哪个数据键，`x-effect` 会调用提供的代码并智能地查找其中使用的任何 Alpine 数据。现在当这些数据中的某一部分发生变化时，`x-effect` 表达式会重新执行。

以下是使用 `x-effect` 重写的与 `$watch` 示例相同的代码：

```html
<div x-data="{ open: false }" x-effect="console.log(open)">
```

现在，这个表达式会立即执行，并在每次 `open` 更新时重新执行。

这两种方法的主要行为差异是：

1. 提供的代码会立即执行并在数据变化时执行（`$watch` 是"惰性的"——直到第一次数据变化才执行）
2. 无法获取之前的值（传给 `$watch` 的回调同时接收新值和旧值）

[→ 阅读更多关于 x-effect 的内容](../directives/effect)

## Alpine 初始化

### `alpine:init`

确保在 Alpine 加载完成后、但在它在页面上初始化自身之前执行一段代码，是一项必要的任务。

这个钩子允许你在 Alpine 在页面上开始工作之前注册自定义数据、指令、魔法属性等。

你可以通过监听 Alpine 派发的一个名为 `alpine:init` 的事件来钩入生命周期的这个点：

```js
document.addEventListener('alpine:init', () => {
    Alpine.data(...)
})
```

### `alpine:initialized`

Alpine 还提供了一个钩子，用于在初始化完成后执行代码，名为 `alpine:initialized`：

```js
document.addEventListener('alpine:initialized', () => {
    //
})
```
