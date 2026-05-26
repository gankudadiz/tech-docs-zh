---
title: Sort 插件
source:
  repo: https://github.com/alpinejs/alpine
  ref: main
  path: packages/docs/src/en/plugins/sort.md
version: v3.x
translation_status: translated
---

# Sort 插件

Alpine 的 Sort 插件允许你通过鼠标拖拽重新排序元素。

```html
<ul x-sort>
    <li x-sort:item>foo</li>
    <li x-sort:item>bar</li>
    <li x-sort:item>baz</li>
</ul>
```

### 排序处理函数 / 排序分组 / 拖拽手柄 / 忽略元素
