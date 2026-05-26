---
title: Alpine.bind
source:
  repo: https://github.com/alpinejs/alpine
  ref: main
  path: packages/docs/src/en/globals/alpine-bind.md
version: v3.x
translation_status: translated
---

# Alpine.bind

`Alpine.bind(...)` 提供了一种在应用中复用 `x-bind` 对象的方式。

```html
<button x-bind="SomeButton"></button>

<script>
    document.addEventListener('alpine:init', () => {
        Alpine.bind('SomeButton', () => ({
            type: 'button',
            '@click'() { this.doSomething() },
            ':disabled'() { return this.shouldDisable },
        }))
    })
</script>
```
