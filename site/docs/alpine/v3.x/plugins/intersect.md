---
title: Intersect 插件
source: https://github.com/alpinejs/alpine/blob/main/packages/docs/src/en/plugins/intersect.md
source_version: v3.x
translation_status: draft
---

# Intersect 插件

Alpine 的 Intersect 插件是 [Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) 的便捷封装，让你能轻松地对元素进入视口做出反应。

## 安装

### 通过 CDN

```html
<script defer src="https://cdn.jsdelivr.net/npm/@alpinejs/intersect@3.x.x/dist/cdn.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
```

### 通过 NPM

```shell
npm install @alpinejs/intersect
```

```js
import Alpine from 'alpinejs'
import intersect from '@alpinejs/intersect'
Alpine.plugin(intersect)
```

## x-intersect

主要 API 是 `x-intersect`。将其添加到 Alpine 组件内的任何元素中，当该元素进入视口时，提供的表达式将执行。

```html
<div x-data="{ shown: false }" x-intersect="shown = true">
    <div x-show="shown" x-transition>
        I'm in the viewport!
    </div>
</div>
```

### x-intersect:enter

`:enter` 后缀是 `x-intersect` 的别名，工作方式相同：

```html
<div x-intersect:enter="shown = true">...</div>
```

### x-intersect:leave

追加 `:leave` 在元素离开视口时执行表达式：

```html
<div x-intersect:leave="shown = true">...</div>
```

## 修饰符

### .once

仅在元素第一次进入视口时求值表达式。

```html
<div x-intersect.once="shown = true">...</div>
```

### .half

当交叉阈值超过 0.5 时求值表达式。

```html
<div x-intersect.half="shown = true">...</div>
```

### .full

当交叉阈值超过 0.99 时求值表达式。

```html
<div x-intersect.full="shown = true">...</div>
```

### .threshold

控制底层 `IntersectionObserver` 的 `threshold` 属性，值范围 "0-100"。

```html
<div x-intersect.threshold.50="shown = true">...</div>
```

### .margin

控制底层 `IntersectionObserver` 的 `rootMargin` 属性。

```html
<div x-intersect.margin.200px="loaded = true">...</div>
<div x-intersect:leave.margin.10%.25px.25.25px="loaded = false">...</div>
<div x-intersect.margin.-100px="visible = true">...</div>
```
