---
title: x-for
source:
  repo: https://github.com/alpinejs/alpine
  ref: main
  path: packages/docs/src/en/directives/for.md
version: v3.x
translation_status: translated
---

# x-for

Alpine 的 `x-for` 指令允许你通过迭代列表来创建 DOM 元素。

```html
<ul x-data="{ colors: ['Red', 'Orange', 'Yellow'] }">
    <template x-for="color in colors">
        <li x-text="color"></li>
    </template>
</ul>
```

你也可以将对象传递给 `x-for`。

```html
<ul x-data="{ car: { make: 'Jeep', model: 'Grand Cherokee', color: 'Black' } }">
    <template x-for="(value, index) in car">
        <li>
            <span x-text="index"></span>: <span x-text="value"></span>
        </li>
    </template>
</ul>
```

<a name="keys"></a>
## Keys

```html
<ul x-data="{ colors: [
    { id: 1, label: 'Red' },
    { id: 2, label: 'Orange' },
    { id: 3, label: 'Yellow' },
]}">
    <template x-for="color in colors" :key="color.id">
        <li x-text="color.label"></li>
    </template>
</ul>
```

<a name="accessing-indexes"></a>
## 访问索引

```html
<ul x-data="{ colors: ['Red', 'Orange', 'Yellow'] }">
    <template x-for="(color, index) in colors">
        <li>
            <span x-text="index + ': '"></span>
            <span x-text="color"></span>
        </li>
    </template>
</ul>
```

<a name="iterating-over-a-range"></a>
## 迭代范围

```html
<ul>
    <template x-for="i in 10">
        <li x-text="i"></li>
    </template>
</ul>
```

<a name="contents-of-a-template"></a>
## `<template>` 的内容
