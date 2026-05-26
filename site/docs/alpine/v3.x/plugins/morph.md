---
title: Morph 插件
source: https://github.com/alpinejs/alpine/blob/main/packages/docs/src/en/plugins/morph.md
source_version: v3.x
translation_status: draft
---

# Morph 插件

Alpine 的 Morph 插件允许你将页面上的元素"变形"为提供的 HTML 模板，同时保留"变形"元素内的所有浏览器或 Alpine 状态。

## 安装

### 通过 CDN

```html
<script defer src="https://cdn.jsdelivr.net/npm/@alpinejs/morph@3.x.x/dist/cdn.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
```

### 通过 NPM

```shell
npm install @alpinejs/morph
```

```js
import Alpine from 'alpinejs'
import morph from '@alpinejs/morph'
Alpine.plugin(morph)
```

## Alpine.morph()

`Alpine.morph(el, newHtml)` 允许你基于传入的 HTML 命令式地变形 DOM 节点。

| 参数 | 描述 |
| ---       | --- |
| `el`      | 页面上的 DOM 元素 |
| `newHtml` | 用作模板来变形 DOM 元素的 HTML 字符串 |
| `options` | 主要用于注入生命周期钩子的选项对象 |

```html
<div x-data="{ message: 'Change me, then press the button!' }">
    <input type="text" x-model="message">
    <span x-text="message"></span>
</div>

<button>Run Morph</button>

<script>
    document.querySelector('button').addEventListener('click', () => {
        let el = document.querySelector('div')
        Alpine.morph(el, `
            <div x-data="{ message: 'Change me, then press the button!' }">
                <h2>See how new elements have been added</h2>
                <input type="text" x-model="message">
                <span x-text="message"></span>
                <h2>but the state of this component hasn't changed?</h2>
            </div>
        `)
    })
</script>
```

### 生命周期钩子

| 选项 | 描述 |
| ---       | --- |
| `updating(el, toEl, childrenOnly, skip)` | 在修补 `el` 前调用 |
| `updated(el, toEl)` | 在 Morph 修补 `el` 后调用 |
| `removing(el, skip)` | 在移除元素前调用 |
| `removed(el)` | 在移除元素后调用 |
| `adding(el, skip)` | 在添加新元素前调用 |
| `added(el)` | 在添加新元素后调用 |
| `key(el)` | 确定 Morph 如何"标记"元素 |
| `lookahead` | 启用"向前看"算法特性 |

```js
Alpine.morph(el, newHtml, {
    updating(el, toEl, childrenOnly, skip) {},
    updated(el, toEl) {},
    removing(el, skip) {},
    removed(el) {},
    adding(el, skip) {},
    added(el) {},
    key(el) { return el.id },
    lookahead: true,
})
```

### Keys

Morph 有一个"key"系统，允许开发者"强制"保留某些元素。最常见的用例是循环中的同级元素列表：

```html
<!-- 使用 key 让 Morph 正确移动元素而非替换 -->
<ul>
    <li key="1">Mark</li>
    <li key="2">Tom</li>
    <li key="3">Travis</li>
</ul>
```

## Alpine.morphBetween()

`Alpine.morphBetween(startMarker, endMarker, newHtml, options)` 允许你变形两个标记元素之间的 DOM 节点范围。
