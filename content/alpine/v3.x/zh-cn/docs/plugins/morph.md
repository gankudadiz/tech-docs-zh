---
title: Morph 插件
source:
  repo: https://github.com/alpinejs/alpine
  ref: main
  path: packages/docs/src/en/plugins/morph.md
version: v3.x
translation_status: translated
---

# Morph 插件

Alpine 的 Morph 插件允许你将页面上的元素"变形"为提供的 HTML 模板。

## Alpine.morph()

```html
<div x-data="{ message: 'Change me!' }">
    <input type="text" x-model="message">
    <span x-text="message"></span>
</div>
<button>Run Morph</button>
<script>
    document.querySelector('button').addEventListener('click', () => {
        Alpine.morph(document.querySelector('div'), `<div x-data="...">...</div>`)
    })
</script>
```

### 生命周期钩子

### Keys

```html
<ul>
    <li key="1">Mark</li>
    <li key="2">Tom</li>
    <li key="3">Travis</li>
</ul>
```
