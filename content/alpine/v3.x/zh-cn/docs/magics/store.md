---
title: $store
source:
  repo: https://github.com/alpinejs/alpine
  ref: main
  path: packages/docs/src/en/magics/store.md
version: v3.x
translation_status: translated
---

# $store

你可以使用 `$store` 方便地访问使用 `Alpine.store(...)` 注册的全局 Alpine 存储。

```html
<button x-data @click="$store.darkMode.toggle()">Toggle Dark Mode</button>

<div x-data :class="$store.darkMode.on && 'bg-black'">...</div>

<script>
    document.addEventListener('alpine:init', () => {
        Alpine.store('darkMode', { on: false, toggle() { this.on = ! this.on } })
    })
</script>
```

<a name="single-value-stores"></a>
## 单值存储

```html
<button x-data @click="$store.darkMode = ! $store.darkMode">Toggle Dark Mode</button>

<div x-data :class="$store.darkMode && 'bg-black'">...</div>

<script>
    document.addEventListener('alpine:init', () => {
        Alpine.store('darkMode', false)
    })
</script>
```
