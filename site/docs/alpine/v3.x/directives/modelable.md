---
title: x-modelable
source: https://github.com/alpinejs/alpine/blob/main/packages/docs/src/en/directives/modelable.md
source_version: v3.x
translation_status: draft
---

# x-modelable

`x-modelable` 允许你将任何 Alpine 属性暴露为 `x-model` 指令的目标。

以下是使用 `x-modelable` 暴露一个变量以与 `x-model` 绑定的简单示例。

```html
<div x-data="{ number: 5 }">
    <div x-data="{ count: 0 }" x-modelable="count" x-model="number">
        <button @click="count++">Increment</button>
    </div>

    Number: <span x-text="number"></span>
</div>
```

如你所见，外部作用域的属性"number"现在绑定到内部作用域的属性"count"。

通常这个特性会与后端模板框架（如 Laravel Blade）结合使用。它有助于将 Alpine 组件抽象为后端模板，并通过 `x-model` 将状态暴露给外部，就像它是一个原生输入一样。
