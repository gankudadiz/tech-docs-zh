---
title: Anchor 插件
source: https://github.com/alpinejs/alpine/blob/main/packages/docs/src/en/plugins/anchor.md
source_version: v3.x
translation_status: draft
---

# Anchor 插件

Alpine 的 Anchor 插件允许你将元素定位到页面上的另一个元素。

"锚定"功能由 [Floating UI](https://floating-ui.com/) 项目提供。

## 安装

### 通过 CDN

```html
<script defer src="https://cdn.jsdelivr.net/npm/@alpinejs/anchor@3.x.x/dist/cdn.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
```

### 通过 NPM

```shell
npm install @alpinejs/anchor
```

```js
import Alpine from 'alpinejs'
import anchor from '@alpinejs/anchor'
Alpine.plugin(anchor)
```

## x-anchor

主要 API 是 `x-anchor` 指令。将其添加到任何元素，并传入一个对参考元素的引用。

默认情况下，`x-anchor` 会将元素的 CSS 设置为 `position: absolute` 及适当的 `top` 和 `left` 值。

```html
<div x-data="{ open: false }">
    <button x-ref="button" @click="open = ! open">Toggle</button>
    <div x-show="open" x-anchor="$refs.button">Dropdown content</div>
</div>
```

## 定位

`x-anchor` 允许自定义定位：

- `.bottom`、`.bottom-start`、`.bottom-end`
- `.top`、`.top-start`、`.top-end`
- `.left`、`.left-start`、`.left-end`
- `.right`、`.right-start`、`.right-end`

```html
<div x-show="open" x-anchor.bottom-start="$refs.button">Dropdown content</div>
```

### 固定定位

使用 `.fixed` 修饰符启用固定定位策略：

```html
<div x-show="open" x-anchor.fixed="$refs.button">Dropdown content</div>
```

## 偏移

使用 `.offset.[px值]` 修饰符添加偏移：

```html
<div x-show="open" x-anchor.offset.10="$refs.button">Dropdown content</div>
```

## 防止翻转

使用 `.noflip` 修饰符防止位置翻转：

```html
<div x-show="open" x-anchor.noflip="$refs.button">Dropdown content</div>
```

## 手动样式

使用 `.no-style` 修饰符配合 `$anchor` 魔法手动应用样式：

```html
<div
    x-show="open"
    x-anchor.no-style="$refs.button"
    x-bind:style="{ position: 'absolute', top: $anchor.y+'px', left: $anchor.x+'px' }"
>
    Dropdown content
</div>
```

## 按 ID 锚定

```html
<div x-show="open" x-anchor="document.getElementById('trigger')">Dropdown content</div>
```
