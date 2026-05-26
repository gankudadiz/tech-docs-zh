---
title: Intersect 插件
source:
  repo: https://github.com/alpinejs/alpine
  ref: main
  path: packages/docs/src/en/plugins/intersect.md
version: v3.x
translation_status: translated
---

# Intersect 插件

Alpine 的 Intersect 插件是 Intersection Observer 的便捷封装。

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

```html
<div x-data="{ shown: false }" x-intersect="shown = true">...</div>
```

### x-intersect:enter / x-intersect:leave

```html
<div x-intersect:leave="shown = true">...</div>
```

## 修饰符

### .once / .half / .full / .threshold / .margin
