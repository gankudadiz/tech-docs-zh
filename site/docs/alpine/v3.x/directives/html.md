---
title: x-html
source: https://github.com/alpinejs/alpine/blob/main/packages/docs/src/en/directives/html.md
source_version: v3.x
translation_status: draft
---

# x-html

`x-html` 将元素的"innerHTML"属性设置为给定表达式的结果。

> ⚠️ 仅用于受信任的内容，绝不用于用户提供的内容。⚠️
> 动态渲染来自第三方的 HTML 很容易导致 XSS 漏洞。

以下是使用 `x-html` 显示用户用户名的基本示例。

```html
<div x-data="{ username: '<strong>calebporzio</strong>' }">
    Username: <span x-html="username"></span>
</div>
```

现在 `<span>` 标签的 inner HTML 将被设置为"<strong>calebporzio</strong>"。
