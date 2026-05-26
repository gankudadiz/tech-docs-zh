---
title: Alpine.store
source: https://github.com/alpinejs/alpine/blob/main/packages/docs/src/en/globals/alpine-store.md
source_version: v3.x
translation_status: draft
---

# Alpine.store

Alpine 通过 `Alpine.store()` API 提供全局状态管理。

## 注册存储

你可以在 `alpine:init` 监听器内定义 Alpine 存储（通过 `<script>` 标签引入 Alpine 的情况），或者在手动调用 `Alpine.start()` 之前定义（将 Alpine 导入打包工具的情况）：

**通过 script 标签：**

```html
<script>
    document.addEventListener('alpine:init', () => {
        Alpine.store('darkMode', {
            on: false,

            toggle() {
                this.on = ! this.on
            }
        })
    })
</script>
```

**从打包工具：**

```js
import Alpine from 'alpinejs'

Alpine.store('darkMode', {
    on: false,

    toggle() {
        this.on = ! this.on
    }
})

Alpine.start()
```

## 访问存储

你可以使用 `$store` 魔法属性在 Alpine 表达式中访问任何存储中的数据：

```html
<div x-data :class="$store.darkMode.on && 'bg-black'">...</div>
```

你也可以修改存储中的属性，所有依赖这些属性的内容都会自动响应。例如：

```html
<button x-data @click="$store.darkMode.toggle()">Toggle Dark Mode</button>
```

此外，你可以省略第二个参数，使用 `Alpine.store()` 从外部访问存储，如下所示：

```html
<script>
    Alpine.store('darkMode').toggle()
</script>
```

## 初始化存储

如果你在 Alpine 存储中提供 `init()` 方法，它将在存储注册后立即执行。这对于使用合理的起始值初始化存储中的任何状态很有用。

```html
<script>
    document.addEventListener('alpine:init', () => {
        Alpine.store('darkMode', {
            init() {
                this.on = window.matchMedia('(prefers-color-scheme: dark)').matches
            },

            on: false,

            toggle() {
                this.on = ! this.on
            }
        })
    })
</script>
```

注意上面示例中新增的 `init()` 方法。有了这个添加，`on` 存储变量将在 Alpine 在页面上渲染任何内容之前设置为浏览器的颜色方案偏好。

## 单值存储

如果你不需要为存储提供整个对象，可以将任何类型的数据设置并用作存储。

以下是上面的示例，但更简单地将其用作布尔值：

```html
<button x-data @click="$store.darkMode = ! $store.darkMode">Toggle Dark Mode</button>

...

<div x-data :class="$store.darkMode && 'bg-black'">
    ...
</div>

<script>
    document.addEventListener('alpine:init', () => {
        Alpine.store('darkMode', false)
    })
</script>
```
