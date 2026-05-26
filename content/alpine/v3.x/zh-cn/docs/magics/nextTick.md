---
title: $nextTick
source:
  repo: https://github.com/alpinejs/alpine
  ref: main
  path: packages/docs/src/en/magics/nextTick.md
version: v3.x
translation_status: translated
---

# $nextTick

`$nextTick` 允许你仅在 Alpine 完成其响应式 DOM 更新后执行给定的表达式。

```html
<div x-data="{ title: 'Hello' }">
    <button
        @click="
            title = 'Hello World!';
            $nextTick(() => { console.log($el.innerText) });
        "
        x-text="title"
    ></button>
</div>
```

## Promises

`$nextTick` 返回一个 promise，允许暂停 async 函数直到待处理的 DOM 更新完成。

```html
<div x-data="{ title: 'Hello' }">
    <button
        @click="
            title = 'Hello World!';
            await $nextTick();
            console.log($el.innerText);
        "
        x-text="title"
    ></button>
</div>
```
