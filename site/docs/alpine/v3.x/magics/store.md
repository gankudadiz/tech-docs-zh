---
title: $store
source: https://github.com/alpinejs/alpine/blob/main/packages/docs/src/en/magics/store.md
source_version: v3.x
translation_status: draft
---

# $store

你可以使用 `$store` 方便地访问使用 [`Alpine.store(...)`](../globals/alpine-store) 注册的全局 Alpine 存储。例如：

```html
<button x-data @click="$store.darkMode.toggle()">Toggle Dark Mode</button>

...

<div x-data :class="$store.darkMode.on && 'bg-black'">
    ...
</div>

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

鉴于我们注册了 `darkMode` 存储并将 `on` 设置为 "false"，当 `<button>` 被按下时，`on` 将变为 "true"，页面的背景颜色将变为黑色。

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

[→ 阅读更多关于 Alpine stores 的内容](../globals/alpine-store)
