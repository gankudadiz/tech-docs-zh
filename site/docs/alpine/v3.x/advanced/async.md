---
title: 异步
source: https://github.com/alpinejs/alpine/blob/main/packages/docs/src/en/advanced/async.md
source_version: v3.x
translation_status: draft
---

# 异步

Alpine 在大多数支持标准函数的地方都支持异步函数。

```js
async function getLabel() {
    let response = await fetch('/api/label')
    return await response.text()
}
```

```html
<span x-text="await getLabel()"></span>
```

如果你更喜欢在 Alpine 中调用方法时省略尾部括号，可以省略它们，Alpine 会检测提供的函数是否是异步的并相应处理：

```html
<span x-text="getLabel"></span>
```
