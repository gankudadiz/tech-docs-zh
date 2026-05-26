---
title: 响应式
source: https://github.com/alpinejs/alpine/blob/main/packages/docs/src/en/advanced/reactivity.md
source_version: v3.x
translation_status: draft
---

# 响应式

Alpine 是"响应式"的，意味着当你改变一段数据时，所有依赖该数据的部分都会自动"响应"。

Alpine 中发生的每一处响应式，都源于两个核心函数：`Alpine.reactive()` 和 `Alpine.effect()`。

> Alpine 在底层使用 VueJS 的响应式引擎来提供这些函数。

## Alpine.reactive()

此函数接受一个 JavaScript 对象作为参数，并返回该对象的"响应式"版本。

```js
let data = { count: 1 }
let reactiveData = Alpine.reactive(data)
```

在底层，`Alpine.reactive` 将 `data` 包裹在一个自定义的 JavaScript Proxy 中。

## Alpine.effect()

`Alpine.effect` 接受一个回调函数。它会立即运行该函数，同时主动查找任何与响应式数据的交互。

```js
let data = Alpine.reactive({ count: 1 })

Alpine.effect(() => {
    console.log(data.count)
})
```

首次运行时，"1" 会被记录到控制台。每当 `data.count` 发生变化时，其值会再次被记录。

以下是一个完全不使用 Alpine 语法、仅使用 `Alpine.reactive` 和 `Alpine.effect` 的"计数器"组件：

```html
<button>Increment</button>
Count: <span></span>
```
```js
let button = document.querySelector('button')
let span = document.querySelector('span')
let data = Alpine.reactive({ count: 1 })

Alpine.effect(() => { span.textContent = data.count })

button.addEventListener('click', () => { data.count = data.count + 1 })
```
