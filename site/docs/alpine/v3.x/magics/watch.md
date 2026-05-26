---
title: $watch
source: https://github.com/alpinejs/alpine/blob/main/packages/docs/src/en/magics/watch.md
source_version: v3.x
translation_status: draft
---

# $watch

你可以使用 `$watch` 魔法方法"观察"组件的属性。例如：

```html
<div x-data="{ open: false }" x-init="$watch('open', value => console.log(value))">
    <button @click="open = ! open">Toggle Open</button>
</div>
```

在上面的示例中，当按钮被按下且 `open` 发生变化时，提供的回调将触发并 `console.log` 新值。

你可以使用"点"符号观察深层嵌套的属性：

```html
<div x-data="{ foo: { bar: 'baz' }}" x-init="$watch('foo.bar', value => console.log(value))">
    <button @click="foo.bar = 'bob'">Toggle Open</button>
</div>
```

当 `<button>` 被按下时，`foo.bar` 将被设置为 "bob"，并且 "bob" 将被记录到控制台。

### 获取"旧"值

`$watch` 会跟踪被观察属性的之前的值。你可以通过回调的可选第二个参数来访问它，如下所示：

```html
<div x-data="{ open: false }" x-init="$watch('open', (value, oldValue) => console.log(value, oldValue))">
    <button @click="open = ! open">Toggle Open</button>
</div>
```

### 深度观察

`$watch` 自动观察任何层级的变更，但你应该注意，当检测到变更时，观察器将返回被观察属性的值，而不是已更改的子属性的值。

```html
<div x-data="{ foo: { bar: 'baz' }}" x-init="$watch('foo', (value, oldValue) => console.log(value, oldValue))">
    <button @click="foo.bar = 'bob'">Update</button>
</div>
```

当 `<button>` 被按下时，`foo.bar` 将被设置为 "bob"，并且 `{bar: 'bob'} {bar: 'baz'}` 将被记录到控制台（新值和旧值）。

> ⚠️ 在 `$watch` 回调中作为副作用修改被"观察"对象的属性将导致无限循环并最终出错。

```html
<!-- 🚫 无限循环 -->
<div x-data="{ foo: { bar: 'baz', bob: 'lob' }}" x-init="$watch('foo', value => foo.bob = foo.bar)">
    <button @click="foo.bar = 'bob'">Update</button>
</div>
```
