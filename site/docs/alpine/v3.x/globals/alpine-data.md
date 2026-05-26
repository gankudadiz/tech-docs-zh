---
title: Alpine.data
source: https://github.com/alpinejs/alpine/blob/main/packages/docs/src/en/globals/alpine-data.md
source_version: v3.x
translation_status: draft
---

# Alpine.data

`Alpine.data(...)` 提供了一种在应用中复用 `x-data` 上下文的方式。

以下是一个简单的 `dropdown` 组件示例：

```html
<div x-data="dropdown">
    <button @click="toggle">...</button>

    <div x-show="open">...</div>
</div>

<script>
    document.addEventListener('alpine:init', () => {
        Alpine.data('dropdown', () => ({
            open: false,

            toggle() {
                this.open = ! this.open
            }
        }))
    })
</script>
```

如你所见，我们将通常直接在 `x-data` 内定义的属性和方法提取到了单独的 Alpine 组件对象中。

## 从打包工具注册

如果你选择为 Alpine 代码使用构建步骤，应按以下方式注册组件：

```js
import Alpine from 'alpinejs'
import dropdown from './dropdown.js'

Alpine.data('dropdown', dropdown)

Alpine.start()
```

这假设你有一个名为 `dropdown.js` 的文件，内容如下：

```js
export default () => ({
    open: false,

    toggle() {
        this.open = ! this.open
    }
})
```

## 初始参数

除了按名称直接引用 `Alpine.data` 提供者（如 `x-data="dropdown"`），你还可以将其作为函数引用（`x-data="dropdown()"`）。通过直接作为函数调用，你可以传入额外的参数，用于创建初始数据对象，如下所示：

```html
<div x-data="dropdown(true)">
```

```js
Alpine.data('dropdown', (initialOpenState = false) => ({
    open: initialOpenState
}))
```

现在，你可以根据需要传入不同的参数来复用 `dropdown` 对象。

## Init 函数

如果你的组件包含 `init()` 方法，Alpine 会在渲染组件之前自动执行它。例如：

```js
Alpine.data('dropdown', () => ({
    init() {
        // 此代码将在 Alpine 初始化组件其余部分之前执行。
    }
}))
```

## Destroy 函数

如果你的组件包含 `destroy()` 方法，Alpine 会在清理组件之前自动执行它。

一个主要的示例是当注册来自其他库或 Alpine 不可用的浏览器 API 的事件处理程序时。请参阅以下示例代码，了解如何使用 `destroy()` 方法清理此类处理程序。

```js
Alpine.data('timer', () => ({
    timer: null,
    counter: 0,
    init() {
      this.timer = setInterval(() => {
        console.log('Increased counter to', ++this.counter);
      }, 1000);
    },
    destroy() {
        clearInterval(this.timer);
    },
}))
```

组件被销毁的一个示例是在 `x-if` 内部使用时：

```html
<span x-data="{ enabled: false }">
    <button @click.prevent="enabled = !enabled">Toggle</button>

    <template x-if="enabled">
        <span x-data="timer" x-text="counter"></span>
    </template>
</span>
```

## 使用魔法属性

如果你想从组件对象中访问魔法方法或属性，可以使用 `this` 上下文：

```js
Alpine.data('dropdown', () => ({
    open: false,

    init() {
        this.$watch('open', () => {...})
    }
}))
```

## 使用 `x-bind` 封装指令

如果你希望复用的不仅仅是组件的数据对象，可以使用 `x-bind` 封装整个 Alpine 模板指令。

以下是一个使用 `x-bind` 提取之前下拉组件模板细节的示例：

```html
<div x-data="dropdown">
    <button x-bind="trigger"></button>

    <div x-bind="dialogue"></div>
</div>
```

```js
Alpine.data('dropdown', () => ({
    open: false,

    trigger: {
        ['@click']() {
            this.open = ! this.open
        },
    },

    dialogue: {
        ['x-show']() {
            return this.open
        },
    },
}))
```
