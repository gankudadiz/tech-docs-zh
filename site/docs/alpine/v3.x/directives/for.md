---
title: x-for
source: https://github.com/alpinejs/alpine/blob/main/packages/docs/src/en/directives/for.md
source_version: v3.x
translation_status: draft
---

# x-for

Alpine 的 `x-for` 指令允许你通过迭代列表来创建 DOM 元素。以下是使用它基于数组创建颜色列表的简单示例。

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

关于 `x-for` 有两条值得注意的规则：

> `x-for` 必须声明在 `<template>` 元素上。
> 该 `<template>` 元素必须只包含一个根元素

## Keys

如果你将重新排序项目，为每个 `x-for` 迭代指定唯一的 key 非常重要。没有动态 keys，Alpine 可能难以跟踪重新排序，并会导致奇怪的副作用。

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

现在如果颜色被添加、删除、重新排序，或其"id"发生变化，Alpine 将相应地保留或销毁迭代的 `<li>` 元素。

## 访问索引

如果你需要访问迭代中每个项目的索引，可以使用 `([item], [index]) in [items]` 语法，如下所示：

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

你也可以在动态 `:key` 表达式中访问索引。

```html
<template x-for="(color, index) in colors" :key="index">
```

## 迭代范围

如果你只需要循环 `n` 次，而不是遍历数组，Alpine 提供了一种简写语法。

```html
<ul>
    <template x-for="i in 10">
        <li x-text="i"></li>
    </template>
</ul>
```

这种情况下 `i` 可以命名为任何你喜欢的名称。

> 尽管未包含在上面的代码片段中，但如果没有任何父元素定义 `x-data`，则不能使用 `x-for`。[→ 阅读更多关于 `x-data` 的内容](./data)

## `<template>` 的内容

如上所述，一个 `<template>` 标签必须只包含一个根元素。

例如，以下代码将不起作用：

```html
<template x-for="color in colors">
    <span>The next color is </span><span x-text="color">
</template>
```

但以下代码可以正常工作：

```html
<template x-for="color in colors">
    <p>
        <span>The next color is </span><span x-text="color">
    </p>
</template>
```
