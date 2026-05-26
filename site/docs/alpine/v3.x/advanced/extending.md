---
title: 扩展 Alpine
source: https://github.com/alpinejs/alpine/blob/main/packages/docs/src/en/advanced/extending.md
source_version: v3.x
translation_status: draft
---

# 扩展 Alpine

Alpine 提供了多种扩展方式。事实上，Alpine 中每个可用的指令和魔法都使用了这些 API。

## 生命周期注意事项

这些 API 必须在 Alpine 下载并可用之后、初始化页面本身之前注册。

### 通过 script 标签

```html
<script src="/js/alpine.js" defer></script>
<div x-data x-foo></div>
<script>
    document.addEventListener('alpine:init', () => {
        Alpine.directive('foo', ...)
    })
</script>
```

### 通过 NPM

```js
import Alpine from 'alpinejs'
Alpine.directive('foo', ...)
window.Alpine = Alpine
window.Alpine.start()
```

## 自定义指令

### 方法签名

```js
Alpine.directive('[name]', (el, { value, modifiers, expression }, { Alpine, effect, cleanup }) => {})
```

| &nbsp; | &nbsp; |
---|---|
| name | 指令名称，"foo"对应 `x-foo` |
| el | 指令所添加的 DOM 元素 |
| value | 冒号后的部分，如 `x-foo:bar` 中的 `'bar'` |
| modifiers | 点号分隔的附加项数组 |
| expression | 指令的属性值部分 |
| Alpine | Alpine 全局对象 |
| effect | 创建响应式效果，指令从 DOM 移除时自动清理 |
| cleanup | 注册指令移除时的回调 |

### 简单示例

```js
Alpine.directive('uppercase', el => {
    el.textContent = el.textContent.toUpperCase()
})
```

```html
<span x-uppercase>Hello World!</span>
```

### 求值表达式

```js
Alpine.directive('log', (el, { expression }, { evaluate }) => {
    console.log(evaluate(expression))
})
```

### 响应式效果

```js
Alpine.directive('log', (el, { expression }, { evaluateLater, effect }) => {
    let getThingToLog = evaluateLater(expression)
    effect(() => {
        getThingToLog(thingToLog => { console.log(thingToLog) })
    })
})
```

### 清理

```js
Alpine.directive('...', (el, {}, { cleanup }) => {
    let handler = () => {}
    window.addEventListener('click', handler)
    cleanup(() => { window.removeEventListener('click', handler) })
})
```

### 自定义顺序

```js
Alpine.directive('foo', (el, ...) => { ... }).before('bind')
```

## 自定义魔法属性

```js
Alpine.magic('[name]', (el, { Alpine }) => {})
```

### 魔法属性

```js
Alpine.magic('now', () => (new Date).toLocaleTimeString())
```

```html
<span x-text="$now"></span>
```

### 魔法函数

```js
Alpine.magic('clipboard', () => subject => navigator.clipboard.writeText(subject))
```

```html
<button @click="$clipboard('hello world')">Copy</button>
```

## 编写和共享插件

### Script 引入

```html
<script src="/js/foo.js" defer></script>
<script src="/js/alpine.js" defer></script>
```

```js
// /js/foo.js
document.addEventListener('alpine:init', () => {
    window.Alpine.directive('foo', ...)
    window.Alpine.magic('foo', ...)
})
```

### 打包模块

```js
import Alpine from 'alpinejs'
import foo from 'foo'
Alpine.plugin(foo)
window.Alpine = Alpine
window.Alpine.start()
```

```js
// foo 源码
export default function (Alpine) {
    Alpine.directive('foo', ...)
    Alpine.magic('foo', ...)
}
```
