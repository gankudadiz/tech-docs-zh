---
title: Resize 插件
source:
  repo: https://github.com/alpinejs/alpine
  ref: main
  path: packages/docs/src/en/plugins/resize.md
version: v3.x
translation_status: translated
---

# Resize 插件

Alpine 的 Resize 插件是 Resize Observer 的便捷封装。

## 安装

### 通过 CDN

```html
<script defer src="https://cdn.jsdelivr.net/npm/@alpinejs/resize@3.x.x/dist/cdn.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
```

### 通过 NPM

```shell
npm install @alpinejs/resize
```

```js
import Alpine from 'alpinejs'
import resize from '@alpinejs/resize'
Alpine.plugin(resize)
```

## x-resize

```html
<div x-data="{ width: 0, height: 0 }" x-resize="width = $width; height = $height">
    <p x-text="'Width: ' + width + 'px'"></p>
    <p x-text="'Height: ' + height + 'px'"></p>
</div>
```

## 修饰符

### .document

```html
<div x-resize.document="...">
```
