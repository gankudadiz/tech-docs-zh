---
title: $nextTick
source: https://github.com/alpinejs/alpine/blob/main/packages/docs/src/en/magics/nextTick.md
source_version: v3.x
translation_status: draft
---

# $nextTick

`$nextTick` 是一个魔法属性，允许你仅在 Alpine 完成其响应式 DOM 更新后执行给定的表达式。当你想要与 DOM 状态交互时，这很有用。

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

在上面的示例中，控制台将记录 "Hello World!" 而不是 "Hello"，因为使用了 `$nextTick` 来等待 Alpine 完成更新 DOM。

## Promises

`$nextTick` 返回一个 promise，允许使用 `$nextTick` 暂停 async 函数直到待处理的 DOM 更新完成。像这样使用时，`$nextTick` 也不需要传入参数。

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
