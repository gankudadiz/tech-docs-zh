---
title: Collapse 插件
source:
  repo: https://github.com/alpinejs/alpine
  ref: main
  path: packages/docs/src/en/plugins/collapse.md
version: v3.x
translation_status: translated
---

# Collapse 插件

Alpine 的 Collapse 插件允许你使用平滑动画展开和折叠元素。

## x-collapse

```html
<div x-data="{ expanded: false }">
    <button @click="expanded = ! expanded">Toggle Content</button>
    <p x-show="expanded" x-collapse>...</p>
</div>
```

### .duration / .min
