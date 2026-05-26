---
title: CSP（内容安全策略）构建
source: https://github.com/alpinejs/alpine/blob/main/packages/docs/src/en/advanced/csp.md
source_version: v3.x
translation_status: draft
---

# CSP（内容安全策略）构建

为了让 Alpine 从 HTML 属性中执行 JavaScript 表达式（如 `x-on:click="console.log()"`），它需要使用可能违反"unsafe-eval"内容安全策略的工具。Alpine 提供了一种不违反"unsafe-eval"的替代构建版本。

## 安装

### 通过 CDN

```html
<script defer src="https://cdn.jsdelivr.net/npm/@alpinejs/csp@3.x.x/dist/cdn.min.js"></script>
```

### 通过 NPM

```shell
npm install @alpinejs/csp
```

```js
import Alpine from '@alpinejs/csp'
window.Alpine = Alpine
Alpine.start()
```

## 基本示例

```html
<html>
    <head>
        <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'nonce-a23gbfz9e'">
        <script defer nonce="a23gbfz9e" src="https://cdn.jsdelivr.net/npm/@alpinejs/csp@3.x.x/dist/cdn.min.js"></script>
    </head>
    <body>
        <div x-data="{ count: 0, message: 'Hello' }">
            <button x-on:click="count++">Increment</button>
            <span x-text="count"></span>
            <span x-show="count > 5">Count is greater than 5!</span>
        </div>
    </body>
</html>
```

## 支持的特性

### 对象和数组字面量、基本运算、赋值更新、方法调用

```html
<div x-data="{ user: { name: 'John' }, items: [1, 2, 3] }">
    <span x-text="user.name"></span>
    <span x-text="items[0]"></span>
</div>
<div x-data="{ count: 5 }">
    <span x-text="count + 10"></span>
    <span x-text="count > 3"></span>
</div>
```

## 不支持的特性

### 复杂表达式（属性赋值、箭头函数、解构、模板字符串、展开运算符）、全局变量和函数、HTML 注入

```html
<!-- 不支持：user.name = 'John'、() => console.log('hi')、`Hello ${name}`、console.log()、document.title -->
```

## 何时提取逻辑

将复杂逻辑提取到 `Alpine.data()` 组件中：

```html
<div x-data="userManager" x-show="hasActiveAdmins">
<script>
    Alpine.data('userManager', () => ({
        users: [],
        get hasActiveAdmins() {
            return this.users.filter(u => u.active && u.role === 'admin').length > 0
        }
    }))
</script>
```

## CSP 标头示例

```
Content-Security-Policy: default-src 'self'; script-src 'nonce-[random]' 'strict-dynamic';
```
