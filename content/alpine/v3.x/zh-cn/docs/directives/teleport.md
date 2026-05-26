---
title: x-teleport
source:
  repo: https://github.com/alpinejs/alpine
  ref: main
  path: packages/docs/src/en/directives/teleport.md
version: v3.x
translation_status: translated
---

# x-teleport

`x-teleport` 指令允许你将 Alpine 模板的一部分完全传输到页面上 DOM 的另一部分。

<a name="x-teleport"></a>
## x-teleport

```html
<body>
    <div x-data="{ open: false }">
        <button @click="open = ! open">Toggle Modal</button>

        <template x-teleport="body">
            <div x-show="open">
                Modal contents...
            </div>
        </template>
    </div>

    <div>Some other content placed AFTER the modal markup.</div>
</body>
```

<a name="forwarding-events"></a>
## 转发事件

```html
<div x-data="{ open: false }">
    <button @click="open = ! open">Toggle Modal</button>

    <template x-teleport="body" @click="open = false">
        <div x-show="open">
            Modal contents...
            (click to close)
        </div>
    </template>
</div>
```

<a name="nesting"></a>
## 嵌套

```html
<div x-data="{ open: false }">
    <button @click="open = ! open">Toggle Modal</button>

    <template x-teleport="body">
        <div x-show="open">
            Modal contents...

            <div x-data="{ open: false }">
                <button @click="open = ! open">Toggle Nested Modal</button>

                <template x-teleport="body">
                    <div x-show="open">
                        Nested modal contents...
                    </div>
                </template>
            </div>
        </div>
    </template>
</div>
```
