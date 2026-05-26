---
title: $data
source:
  repo: https://github.com/alpinejs/alpine
  ref: main
  path: packages/docs/src/en/magics/data.md
version: v3.x
translation_status: translated
---

# $data

`$data` 使你可以访问当前的 Alpine 数据作用域（通常由 `x-data` 提供）。

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
