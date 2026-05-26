---
title: Persist 插件
source:
  repo: https://github.com/alpinejs/alpine
  ref: main
  path: packages/docs/src/en/plugins/persist.md
version: v3.x
translation_status: translated
---

# Persist 插件

Alpine 的 Persist 插件允许你在页面加载之间持久化 Alpine 状态。

## 安装

### 通过 CDN

```html
<script defer src="https://cdn.jsdelivr.net/npm/@alpinejs/persist@3.x.x/dist/cdn.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
```

### 通过 NPM

```shell
npm install @alpinejs/persist
```

```js
import Alpine from 'alpinejs'
import persist from '@alpinejs/persist'
Alpine.plugin(persist)
```

## $persist

```html
<div x-data="{ count: $persist(0) }">
    <button x-on:click="count++">Increment</button>
    <span x-text="count"></span>
</div>
```

### 自定义 key

```html
<div x-data="{ count: $persist(0).as('other-count') }">
```

### 自定义存储

```html
<div x-data="{ count: $persist(0).using(sessionStorage) }">
```

### 与 Alpine.data 一起使用

```js
Alpine.data('dropdown', function () { return { open: this.$persist(false) } })
```

### Alpine.$persist 全局

```js
Alpine.store('darkMode', { on: Alpine.$persist(true).as('darkMode_on') })
```
