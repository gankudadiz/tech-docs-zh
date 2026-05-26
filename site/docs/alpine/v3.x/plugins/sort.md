---
title: Sort 插件
source: https://github.com/alpinejs/alpine/blob/main/packages/docs/src/en/plugins/sort.md
source_version: v3.x
translation_status: draft
---

# Sort 插件

Alpine 的 Sort 插件允许你通过鼠标拖拽轻松重新排序元素。

拖拽功能由 [SortableJS](https://github.com/SortableJS/Sortable) 项目提供。

## 安装

### 通过 CDN

```html
<script defer src="https://cdn.jsdelivr.net/npm/@alpinejs/sort@3.x.x/dist/cdn.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
```

### 通过 NPM

```shell
npm install @alpinejs/sort
```

```js
import Alpine from 'alpinejs'
import sort from '@alpinejs/sort'
Alpine.plugin(sort)
```

## 基本用法

主要 API 是 `x-sort` 指令。添加到元素后，其包含 `x-sort:item` 的子元素变得可排序：

```html
<ul x-sort>
    <li x-sort:item>foo</li>
    <li x-sort:item>bar</li>
    <li x-sort:item>baz</li>
</ul>
```

## 排序处理函数

通过向 `x-sort` 传递处理函数来响应排序变化，并使用 `x-sort:item` 为每个项目添加 key：

```html
<ul x-sort="alert($item + ' - ' + $position)">
    <li x-sort:item="1">foo</li>
    <li x-sort:item="2">bar</li>
    <li x-sort:item="3">baz</li>
</ul>
```

## 排序分组

通过添加匹配的 `x-sort:group` 值，可在不同列表之间拖拽项目：

```html
<ul x-sort x-sort:group="todos">
    <li x-sort:item="1">foo</li>
</ul>
<ol x-sort x-sort:group="todos">
    <li x-sort:item="4">bar</li>
</ol>
```

## 拖拽手柄

使用 `x-sort:handle` 指定拖拽手柄元素：

```html
<ul x-sort>
    <li x-sort:item>
        <span x-sort:handle> - </span>foo
    </li>
</ul>
```

## 忽略元素

使用 `x-sort:ignore` 阻止某些元素触发拖拽：

```html
<li x-sort:item>
    <button x-sort:ignore>Edit</button>
</li>
```

## 幽灵元素

使用 `.ghost` 修饰符在拖拽时显示原始元素的"幽灵"副本：

```html
<ul x-sort.ghost>
    <li x-sort:item>foo</li>
</ul>
```

## 排序时的 body class

拖拽时自动为 `<body>` 添加 `.sorting` class：

```css
body.sorting #sort-warning { display: block; }
```

## CSS hover bug

Chrome 和 Safari 中存在 hover 状态问题，可使用以下方式修复：

```html
<div x-sort>
    <div x-sort:item class="[body:not(.sorting)_&]:hover:border">foo</div>
</div>
```

## 自定义配置

使用 `x-sort:config` 覆盖 SortableJS 选项：

```html
<ul x-sort x-sort:config="{ animation: 0 }">
    <li x-sort:item>foo</li>
</ul>
```
