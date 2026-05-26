---
title: Alpine.bind
source: https://github.com/alpinejs/alpine/blob/main/packages/docs/src/en/globals/alpine-bind.md
source_version: v3.x
translation_status: draft
---

# Alpine.bind

`Alpine.bind(...)` 提供了一种在应用中复用 [`x-bind`](../directives/bind#bind-directives) 对象的方式。

以下是一个简单的示例。与其手动使用 Alpine 绑定属性：

```html
<button type="button" @click="doSomething()" :disabled="shouldDisable"></button>
```

你可以将这些属性打包成可复用的对象，并使用 `x-bind` 绑定到它：

```html
<button x-bind="SomeButton"></button>

<script>
    document.addEventListener('alpine:init', () => {
        Alpine.bind('SomeButton', () => ({
            type: 'button',

            '@click'() {
                this.doSomething()
            },

            ':disabled'() {
                return this.shouldDisable
            },
        }))
    })
</script>
```
