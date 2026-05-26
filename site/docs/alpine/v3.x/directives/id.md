---
title: x-id
source: https://github.com/alpinejs/alpine/blob/main/packages/docs/src/en/directives/id.md
source_version: v3.x
translation_status: draft
---

# x-id

`x-id` 允许你为使用 `$id()` 生成的任何新 ID 声明一个新的"作用域"。它接受一个字符串数组（ID 名称），并为在其中生成的每个 `$id('...')` 添加一个后缀，该后缀对于页面上的其他 ID 是唯一的。

`x-id` 旨在与 `$id(...)` 魔法一起使用。

[访问 $id 文档](../magics/id) 以更好地理解此功能。

以下是此指令使用的一个简要示例：

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

> 尽管未包含在上面的代码片段中，但如果没有任何父元素定义 `x-data`，则不能使用 `x-id`。[→ 阅读更多关于 `x-data` 的内容](./data)
