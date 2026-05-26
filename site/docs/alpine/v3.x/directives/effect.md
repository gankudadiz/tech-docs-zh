---
title: x-effect
source: https://github.com/alpinejs/alpine/blob/main/packages/docs/src/en/directives/effect.md
source_version: v3.x
translation_status: draft
---

# x-effect

`x-effect` 是一个有用的指令，用于在其依赖项之一发生变化时重新求值表达式。你可以将其视为一个观察器，无需指定要观察什么属性，它会观察其中使用的所有属性。

如果这个定义让你感到困惑，没关系。通过一个示例可以更好地解释：

```html
<div x-data="{ label: 'Hello' }" x-effect="console.log(label)">
    <button @click="label += ' World!'">Change Message</button>
</div>
```

当组件加载时，`x-effect` 表达式将被执行，并在控制台中记录"Hello"。

因为 Alpine 知道 `x-effect` 中包含的任何属性引用，当按钮被点击且 `label` 发生变化时，效果将被重新触发，并在控制台中记录"Hello World!"。
