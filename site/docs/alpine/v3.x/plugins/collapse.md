---
title: Collapse 插件
source: https://github.com/alpinejs/alpine/blob/main/packages/docs/src/en/plugins/collapse.md
source_version: v3.x
translation_status: draft
---

# Collapse 插件

Alpine 的 Collapse 插件允许你使用平滑动画展开和折叠元素。

## 安装

### 通过 CDN

```html
<script defer src="https://cdn.jsdelivr.net/npm/@alpinejs/collapse@3.x.x/dist/cdn.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
```

### 通过 NPM

```shell
npm install @alpinejs/collapse
```

```js
import Alpine from 'alpinejs'
import collapse from '@alpinejs/collapse'
Alpine.plugin(collapse)
```

## x-collapse

`x-collapse` 只能存在于已有 `x-show` 指令的元素上。添加后，它会通过动画高度属性来平滑地"折叠"和"展开"元素。

```html
<div x-data="{ expanded: false }">
    <button @click="expanded = ! expanded">Toggle Content</button>
    <p x-show="expanded" x-collapse>...</p>
</div>
```

## 修饰符

### .duration

自定义折叠/展开过渡的持续时间：

```html
<p x-show="expanded" x-collapse.duration.1000ms>...</p>
```

### .min

设置折叠状态的最小高度：

```html
<p x-show="expanded" x-collapse.min.50px>...</p>
```
