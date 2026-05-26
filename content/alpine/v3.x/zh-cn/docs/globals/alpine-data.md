---
title: Alpine.data
source:
  repo: https://github.com/alpinejs/alpine
  ref: main
  path: packages/docs/src/en/globals/alpine-data.md
version: v3.x
translation_status: translated
---

# Alpine.data

`Alpine.data(...)` 提供了一种在应用中复用 `x-data` 上下文的方式。

```html
<div x-data="dropdown">
    <button @click="toggle">...</button>
    <div x-show="open">...</div>
</div>

<script>
    document.addEventListener('alpine:init', () => {
        Alpine.data('dropdown', () => ({ open: false, toggle() { this.open = ! this.open } }))
    })
</script>
```

<a name="registering-from-a-bundle"></a>
## 从打包工具注册

```js
import Alpine from 'alpinejs'
import dropdown from './dropdown.js'
Alpine.data('dropdown', dropdown)
Alpine.start()
```

<a name="initial-parameters"></a>
## 初始参数

```html
<div x-data="dropdown(true)">
```

```js
Alpine.data('dropdown', (initialOpenState = false) => ({ open: initialOpenState }))
```

<a name="init-functions"></a>
## Init 函数

```js
Alpine.data('dropdown', () => ({ init() { ... } }))
```

<a name="destroy-functions"></a>
## Destroy 函数

```js
Alpine.data('timer', () => ({
    timer: null, counter: 0,
    init() { this.timer = setInterval(() => { console.log(++this.counter) }, 1000) },
    destroy() { clearInterval(this.timer) },
}))
```

<a name="using-magic-properties"></a>
## 使用魔法属性

```js
Alpine.data('dropdown', () => ({ open: false, init() { this.$watch('open', () => {...}) } }))
```

<a name="encapsulating-directives-with-x-bind"></a>
## 使用 x-bind 封装指令

```html
<div x-data="dropdown">
    <button x-bind="trigger"></button>
    <div x-bind="dialogue"></div>
</div>
```

```js
Alpine.data('dropdown', () => ({
    open: false,
    trigger: { ['@click']() { this.open = ! this.open } },
    dialogue: { ['x-show']() { return this.open } },
}))
```
