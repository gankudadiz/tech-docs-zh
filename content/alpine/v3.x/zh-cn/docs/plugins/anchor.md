---
title: Anchor 插件
source:
  repo: https://github.com/alpinejs/alpine
  ref: main
  path: packages/docs/src/en/plugins/anchor.md
version: v3.x
translation_status: translated
---

# Anchor 插件

Alpine 的 Anchor 插件允许你将元素定位到页面上的另一个元素。

## x-anchor

```html
<div x-data="{ open: false }">
    <button x-ref="button" @click="open = ! open">Toggle</button>
    <div x-show="open" x-anchor="$refs.button">Dropdown content</div>
</div>
```

### 定位修饰符

### 固定定位 / 偏移 / 防止翻转 / 手动样式 / 按 ID 锚定
