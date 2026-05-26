---
title: $refs
source: https://github.com/alpinejs/alpine/blob/main/packages/docs/src/en/magics/refs.md
source_version: v3.x
translation_status: draft
---

# $refs

`$refs` 是一个魔法属性，可用于检索组件内使用 `x-ref` 标记的 DOM 元素。当你需要手动操作 DOM 元素时，这很有用。它常用作比 `document.querySelector` 更简洁、作用域化的替代方案。

```html
<button @click="$refs.text.remove()">Remove Text</button>

<span x-ref="text">Hello 👋</span>
```

现在，当 `<button>` 被按下时，`<span>` 将被移除。

### 限制

在 V2 中，可以动态绑定 `$refs` 到元素，如下所示：

```html
<template x-for="item in items" :key="item.id" >
    <div :x-ref="item.name">
    some content ...
    </div>
</template>
```

然而，在 V3 中，只有静态创建的元素的 `$refs` 才能被访问。因此，对于上面的示例：如果你期望 `$refs` 中的 `item.name` 的值类似于 *Batteries*，你应当注意 `$refs` 实际上包含的是字面字符串 `'item.name'`，而不是 *Batteries*。
