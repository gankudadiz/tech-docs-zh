---
title: Focus 插件
source:
  repo: https://github.com/alpinejs/alpine
  ref: main
  path: packages/docs/src/en/plugins/focus.md
version: v3.x
translation_status: translated
---

# Focus 插件

Alpine 的 Focus 插件允许你管理页面上的焦点。

## 安装

## x-trap

```html
<div x-data="{ open: false }">
    <button @click="open = true">Open Dialog</button>
    <span x-show="open" x-trap="open">
        <input type="text" placeholder="Some input...">
        <button @click="open = false">Close Dialog</button>
    </span>
</div>
```

### 修饰符：.inert / .noscroll / .noreturn / .noautofocus

## $focus
