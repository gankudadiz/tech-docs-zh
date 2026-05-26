---
title: 状态管理
source: https://github.com/alpinejs/alpine/blob/main/packages/docs/src/en/essentials/state.md
source_version: v3.x
translation_status: draft
---

# 状态管理

状态（Alpine 监听变化的 JavaScript 数据）是你使用 Alpine 所做一切的核心。你可以通过 `x-data` 为 HTML 片段提供局部数据，或者通过 `Alpine.store()` 使其在页面上的任何地方全局可用。

## 局部状态

Alpine 允许你在单个 `x-data` 属性中声明 HTML 块的状态，而无需离开你的标记。

以下是基本示例：

```html
<div x-data="{ open: false }">
    ...
</div>
```

现在，该元素上或其内部的任何其他 Alpine 语法都可以访问 `open`。正如你所想的，当 `open` 因任何原因发生变化时，所有依赖它的内容都会自动响应。

[→ 阅读更多关于 `x-data` 的内容](../directives/data)

### 嵌套数据

Alpine 中的数据是可嵌套的。例如，如果你有两个元素都附加了 Alpine 数据（一个在另一个内部），你可以从子元素内部访问父元素的数据。

```html
<div x-data="{ open: false }">
    <div x-data="{ label: 'Content:' }">
        <span x-text="label"></span>
        <span x-show="open"></span>
    </div>
</div>
```

这类似于 JavaScript 本身的作用域（函数内的代码可以访问在函数外声明的变量）。

你可能已经猜到，如果子元素的数据属性与父元素的属性同名，子元素的属性优先。

### 单元素数据

尽管这对某些人来说可能显而易见，但值得说明的是，Alpine 数据可以在同一元素上使用。例如：

```html
<button x-data="{ label: 'Click Here' }" x-text="label"></button>
```

### 无数据 Alpine

有时你可能想使用 Alpine 功能，但不需要任何响应式数据。在这些情况下，你可以完全省略传给 `x-data` 的表达式。例如：

```html
<button x-data @click="alert('I\'ve been clicked!')">Click Me</button>
```

### 可复用的数据

使用 Alpine 时，你可能会发现需要复用一段数据及/或其对应的模板。

如果你使用的是 Rails 或 Laravel 等后端框架，Alpine 首先建议你将整个 HTML 块提取到模板局部或包含片段中。

如果由于某些原因这对你不理想，或者你不在后端模板环境中，Alpine 允许你通过 `Alpine.data(...)` 全局注册和复用组件的数据部分。

```js
Alpine.data('dropdown', () => ({
    open: false,

    toggle() {
        this.open = ! this.open
    }
}))
```

现在你已经注册了 "dropdown" 数据，可以在标记中任意多地使用它：

```html
<div x-data="dropdown">
    <button @click="toggle">Expand</button>

    <span x-show="open">Content...</span>
</div>

<div x-data="dropdown">
    <button @click="toggle">Expand</button>

    <span x-show="open">Some Other Content...</span>
</div>
```

[→ 阅读更多关于 `Alpine.data()` 的内容](../globals/alpine-data)

## 全局状态

如果你希望让某些数据对页面上的每个组件都可用，可以使用 Alpine 的"全局存储"功能。

你可以通过 `Alpine.store(...)` 注册一个存储，并使用 `$store()` 魔法方法引用它。

让我们看一个简单的例子。首先我们全局注册存储：

```js
Alpine.store('tabs', {
    current: 'first',

    items: ['first', 'second', 'third'],
})
```

现在我们可以从页面的任何地方访问或修改它的数据：

```html
<div x-data>
    <template x-for="tab in $store.tabs.items">
        ...
    </template>
</div>

<div x-data>
    <button @click="$store.tabs.current = 'first'">First Tab</button>
    <button @click="$store.tabs.current = 'second'">Second Tab</button>
    <button @click="$store.tabs.current = 'third'">Third Tab</button>
</div>
```

[→ 阅读更多关于 `Alpine.store()` 的内容](../globals/alpine-store)
