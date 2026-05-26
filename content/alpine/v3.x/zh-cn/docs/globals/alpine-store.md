---
title: Alpine.store
source:
  repo: https://github.com/alpinejs/alpine
  ref: main
  path: packages/docs/src/en/globals/alpine-store.md
version: v3.x
translation_status: translated
---

# Alpine.store

Alpine 通过 `Alpine.store()` API 提供全局状态管理。

<a name="registering-a-store"></a>
## 注册存储

```html
<script>
    document.addEventListener('alpine:init', () => {
        Alpine.store('darkMode', { on: false, toggle() { this.on = ! this.on } })
    })
</script>
```

```js
import Alpine from 'alpinejs'
Alpine.store('darkMode', { on: false, toggle() { this.on = ! this.on } })
Alpine.start()
```

<a name="accessing stores"></a>
## 访问存储

```html
<div x-data :class="$store.darkMode.on && 'bg-black'">...</div>
<button x-data @click="$store.darkMode.toggle()">Toggle Dark Mode</button>
```

<a name="initializing-stores"></a>
## 初始化存储

```html
<script>
    document.addEventListener('alpine:init', () => {
        Alpine.store('darkMode', {
            init() { this.on = window.matchMedia('(prefers-color-scheme: dark)').matches },
            on: false,
            toggle() { this.on = ! this.on }
        })
    })
</script>
```

<a name="single-value-stores"></a>
## 单值存储

```html
<button x-data @click="$store.darkMode = ! $store.darkMode">Toggle Dark Mode</button>
<div x-data :class="$store.darkMode && 'bg-black'">...</div>
<script>
    document.addEventListener('alpine:init', () => { Alpine.store('darkMode', false) })
</script>
```
