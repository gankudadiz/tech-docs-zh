---
title: x-data
source:
  repo: https://github.com/alpinejs/alpine
  ref: main
  path: packages/docs/src/en/directives/data.md
version: v3.x
translation_status: translated
---

# x-data

Alpine 的一切始于 `x-data` 指令。

`x-data` 将一块 HTML 定义为一个 Alpine 组件，并提供该组件可以引用的响应式数据。

以下是一个简单的下拉菜单组件示例：

```html
<div x-data="{ open: false }">
    <button @click="open = ! open">Toggle Content</button>

    <div x-show="open">
        Content...
    </div>
</div>
```

不要担心这个示例中的其他指令（`@click` 和 `x-show`），我们稍后会介绍它们。现在，让我们专注于 `x-data`。

<a name="scope"></a>
## 作用域

在 `x-data` 指令中定义的属性对所有子元素可用，甚至包括其他嵌套的 `x-data` 组件中的子元素。

例如：

```html
<div x-data="{ foo: 'bar' }">
    <span x-text="foo"><!-- 将输出: "bar" --></span>

    <div x-data="{ bar: 'baz' }">
        <span x-text="foo"><!-- 将输出: "bar" --></span>

        <div x-data="{ foo: 'bob' }">
            <span x-text="foo"><!-- 将输出: "bob" --></span>
        </div>
    </div>
</div>
```

<a name="methods"></a>
## 方法

因为 `x-data` 被当作普通 JavaScript 对象求值，所以除了状态，你还可以存储方法甚至 getter。

例如，让我们将"Toggle Content"行为提取到 `x-data` 中的一个方法。

```html
<div x-data="{ open: false, toggle() { this.open = ! this.open } }">
    <button @click="toggle()">Toggle Content</button>

    <div x-show="open">
        Content...
    </div>
</div>
```

注意 `x-data` 中新增的 `toggle() { this.open = ! this.open }` 方法。现在可以在组件内的任何地方调用此方法。

你还会注意到使用了 `this.` 来访问对象本身的状态。这是因为 Alpine 像任何具有 `this` 上下文的标准 JavaScript 对象一样求值这个数据对象。

如果你愿意，可以完全省略 `toggle` 方法后面的调用括号。例如：

```html
<!-- 之前 -->
<button @click="toggle()">...</button>

<!-- 之后 -->
<button @click="toggle">...</button>
```

<a name="getters"></a>
## Getter

JavaScript [getter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get) 在方法的唯一目的是基于其他状态返回数据时非常有用。

你可以把它们想象成"计算属性"（尽管它们不像 Vue 的计算属性那样被缓存）。

让我们重构组件，使用名为 `isOpen` 的 getter 来代替直接访问 `open`。

```html
<div x-data="{
    open: false,
    get isOpen() { return this.open },
    toggle() { this.open = ! this.open },
}">
    <button @click="toggle()">Toggle Content</button>

    <div x-show="isOpen">
        Content...
    </div>
</div>
```

注意"Content"现在依赖于 `isOpen` getter 而不是直接依赖 `open` 属性。

在这个例子中没有实际的好处。但在某些情况下，getter 有助于在组件中提供更具表现力的语法。

<a name="data-less-components"></a>
## 无数据组件

有时你想创建一个 Alpine 组件，但不需要任何数据。

在这些情况下，你可以传入一个空对象。

```html
<div x-data="{}">
```

然而，如果你愿意，也可以完全省略属性值，如果这样看起来更好。

```html
<div x-data>
```

<a name="single-element-components"></a>
## 单元素组件

有时你的 Alpine 组件可能只有一个元素，比如下面这样：

```html
<div x-data="{ open: true }">
    <button @click="open = false" x-show="open">Hide Me</button>
</div>
```

在这些情况下，你可以直接在单个元素上声明 `x-data`：

```html
<button x-data="{ open: true }" @click="open = false" x-show="open">
    Hide Me
</button>
```

<a name="re-usable-data"></a>
## 可复用的数据

如果你发现自己重复使用 `x-data` 的内容，或者觉得内联语法过于冗长，可以将 `x-data` 对象提取到使用 `Alpine.data` 的专用组件中。

以下是一个快速示例：

```html
<div x-data="dropdown">
    <button @click="toggle">Toggle Content</button>

    <div x-show="open">
        Content...
    </div>
</div>

<script>
    document.addEventListener('alpine:init', () => {
        Alpine.data('dropdown', () => ({
            open: false,

            toggle() {
                this.open = ! this.open
            },
        }))
    })
</script>
```

[→ 阅读更多关于 `Alpine.data(...)` 的内容](../globals/alpine-data)
