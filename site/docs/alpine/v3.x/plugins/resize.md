---
title: Resize 插件
source: https://github.com/alpinejs/alpine/blob/main/packages/docs/src/en/plugins/resize.md
source_version: v3.x
translation_status: draft
---

# Resize 插件

Alpine 的 Resize 插件是 [Resize Observer](https://developer.mozilla.org/en-US/docs/Web/API/Resize_Observer_API) 的便捷封装，让你能轻松地对元素尺寸变化做出反应。

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

主要 API 是 `x-resize`。将其添加到 Alpine 组件内的任何元素中，当该元素尺寸变化时，提供的表达式将执行，并附带两个魔法属性：`$width` 和 `$height`。

```html
<div
    x-data="{ width: 0, height: 0 }"
    x-resize="width = $width; height = $height"
>
    <p x-text="'Width: ' + width + 'px'"></p>
    <p x-text="'Height: ' + height + 'px'"></p>
</div>
```

## 修饰符

### .document

观察整个文档的尺寸变化。

```html
<div x-resize.document="...">
```
