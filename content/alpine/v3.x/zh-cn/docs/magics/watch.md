---
title: $watch
source:
  repo: https://github.com/alpinejs/alpine
  ref: main
  path: packages/docs/src/en/magics/watch.md
version: v3.x
translation_status: translated
---

# $watch

你可以使用 `$watch` 魔法方法"观察"组件的属性。

```html
<div x-data="{ open: false }" x-init="$watch('open', value => console.log(value))">
    <button @click="open = ! open">Toggle Open</button>
</div>
```

你可以使用"点"符号观察深层嵌套的属性：

```html
<div x-data="{ foo: { bar: 'baz' }}" x-init="$watch('foo.bar', value => console.log(value))">
    <button @click="foo.bar = 'bob'">Toggle Open</button>
</div>
```

<a name="getting-the-old-value"></a>
### 获取"旧"值

```html
<div x-data="{ open: false }" x-init="$watch('open', (value, oldValue) => console.log(value, oldValue))">
    <button @click="open = ! open">Toggle Open</button>
</div>
```

<a name="deep-watching"></a>
### 深度观察

```html
<div x-data="{ foo: { bar: 'baz' }}" x-init="$watch('foo', (value, oldValue) => console.log(value, oldValue))">
    <button @click="foo.bar = 'bob'">Update</button>
</div>
```
