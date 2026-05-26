---
title: Persist 插件
source: https://github.com/alpinejs/alpine/blob/main/packages/docs/src/en/plugins/persist.md
source_version: v3.x
translation_status: draft
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

主要 API 是 `$persist` 魔法方法。你可以将 `x-data` 中的任何值用 `$persist` 包裹，以在页面加载间持久化：

```html
<div x-data="{ count: $persist(0) }">
    <button x-on:click="count++">Increment</button>
    <span x-text="count"></span>
</div>
```

### 工作原理

`$persist` 在初始化时注册一个观察器，每次值变化时将其存储在 localStorage 中。页面重新加载时，Alpine 会检查 localStorage 并恢复该值。

## 设置自定义 key

```html
<div x-data="{ count: $persist(0).as('other-count') }">
```

## 使用自定义存储

默认保存到 localStorage，你也可以使用 sessionStorage：

```html
<div x-data="{ count: $persist(0).using(sessionStorage) }">
```

或者自定义存储对象：

```html
<script>
    window.cookieStorage = {
        getItem(key) {
            let cookies = document.cookie.split(";");
            for (let i = 0; i < cookies.length; i++) {
                let cookie = cookies[i].split("=");
                if (key == cookie[0].trim()) return decodeURIComponent(cookie[1]);
            }
            return null;
        },
        setItem(key, value) {
            document.cookie = key+' = '+encodeURIComponent(value)
        }
    }
</script>
<div x-data="{ count: $persist(0).using(cookieStorage) }">...</div>
```

## 与 Alpine.data 一起使用

需要使用普通函数而非箭头函数：

```js
Alpine.data('dropdown', function () {
    return { open: this.$persist(false) }
})
```

## Alpine.$persist 全局

```js
Alpine.store('darkMode', {
    on: Alpine.$persist(true).as('darkMode_on')
})
```
