---
title: $data
source: https://github.com/alpinejs/alpine/blob/main/packages/docs/src/en/magics/data.md
source_version: v3.x
translation_status: draft
---

# $data

`$data` 是一个魔法属性，使你可以访问当前的 Alpine 数据作用域（通常由 `x-data` 提供）。

大多数情况下，你可以直接在表达式中访问 Alpine 数据。例如 `x-data="{ message: 'Hello Caleb!' }"` 允许你做类似 `x-text="message"` 的事情。

然而，有时拥有一个封装了所有作用域的实际对象并将其传递给其他函数会很有帮助：

```html
<div x-data="{ greeting: 'Hello' }">
    <div x-data="{ name: 'Caleb' }">
        <button @click="sayHello($data)">Say Hello</button>
    </div>
</div>

<script>
    function sayHello({ greeting, name }) {
        alert(greeting + ' ' + name + '!')
    }
</script>
```

现在当按钮被按下时，浏览器将弹出 `Hello Caleb!`，因为它传递了一个包含调用它的表达式所有 Alpine 作用域的数据对象（`@click="..."`）。

大多数应用不需要这个魔法属性，但对于更深层、更复杂的 Alpine 工具来说，它可能非常有用。
