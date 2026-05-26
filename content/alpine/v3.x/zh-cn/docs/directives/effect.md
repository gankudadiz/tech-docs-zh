---
title: x-effect
source:
  repo: https://github.com/alpinejs/alpine
  ref: main
  path: packages/docs/src/en/directives/effect.md
version: v3.x
translation_status: translated
---

# x-effect

`x-effect` 是一个有用的指令，用于在其依赖项之一发生变化时重新求值表达式。

```html
<div x-data="{ label: 'Hello' }" x-effect="console.log(label)">
    <button @click="label += ' World!'">Change Message</button>
</div>
```

当组件加载时，`x-effect` 表达式将被执行，并在控制台中记录"Hello"。

当按钮被点击且 `label` 发生变化时，效果将被重新触发，并在控制台中记录"Hello World!"。
