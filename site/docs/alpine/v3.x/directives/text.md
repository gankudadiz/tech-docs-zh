---
title: x-text
source: https://github.com/alpinejs/alpine/blob/main/packages/docs/src/en/directives/text.md
source_version: v3.x
translation_status: draft
---

# x-text

`x-text` 将元素的文本内容设置为给定表达式的结果。

以下是使用 `x-text` 显示用户用户名的基本示例。

```html
<div x-data="{ username: 'calebporzio' }">
    Username: <strong x-text="username"></strong>
</div>
```

现在 `<strong>` 标签的 inner text 内容将被设置为"calebporzio"。
