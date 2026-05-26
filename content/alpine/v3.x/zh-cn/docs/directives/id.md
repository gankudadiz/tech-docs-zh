---
title: x-id
source:
  repo: https://github.com/alpinejs/alpine
  ref: main
  path: packages/docs/src/en/directives/id.md
version: v3.x
translation_status: translated
---

# x-id

`x-id` 允许你为使用 `$id()` 生成的任何新 ID 声明一个新的"作用域"。

```html
<div x-id="['text-input']">
    <label :for="$id('text-input')">Username</label>
    <!-- for="text-input-1" -->

    <input type="text" :id="$id('text-input')">
    <!-- id="text-input-1" -->
</div>

<div x-id="['text-input']">
    <label :for="$id('text-input')">Username</label>
    <!-- for="text-input-2" -->

    <input type="text" :id="$id('text-input')">
    <!-- id="text-input-2" -->
</div>
```
