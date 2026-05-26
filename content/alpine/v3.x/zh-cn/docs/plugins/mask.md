---
title: Mask 插件
source:
  repo: https://github.com/alpinejs/alpine
  ref: main
  path: packages/docs/src/en/plugins/mask.md
version: v3.x
translation_status: translated
---

# Mask 插件

Alpine 的 Mask 插件允许你在用户输入时自动格式化文本输入字段。

## 安装

### 通过 CDN

```html
<script defer src="https://cdn.jsdelivr.net/npm/@alpinejs/mask@3.x.x/dist/cdn.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
```

### 通过 NPM

```shell
npm install @alpinejs/mask
```

```js
import Alpine from 'alpinejs'
import mask from '@alpinejs/mask'
Alpine.plugin(mask)
```

## x-mask

```html
<input x-mask="99/99/9999" placeholder="MM/DD/YYYY">
```

| 通配符 | 描述 |
| -------- | -------------------------------- |
| `*`      | 任意字符 |
| `a`      | 仅字母字符（a-z, A-Z） |
| `9`      | 仅数字字符（0-9） |

## 动态 Mask

```html
<input x-mask:dynamic="
    $input.startsWith('34') || $input.startsWith('37')
        ? '9999 999999 99999' : '9999 9999 9999 9999'
">
```

```html
<input x-mask:dynamic="creditCardMask">
```

## 金额输入

```html
<input x-mask:dynamic="$money($input)">
```
