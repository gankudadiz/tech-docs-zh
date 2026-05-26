---
title: Mask 插件
source: https://github.com/alpinejs/alpine/blob/main/packages/docs/src/en/plugins/mask.md
source_version: v3.x
translation_status: draft
---

# Mask 插件

Alpine 的 Mask 插件允许你在用户输入时自动格式化文本输入字段。

这对于许多不同类型的输入很有用：电话号码、信用卡、金额、账号、日期等。

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

使用此插件的主要 API 是 `x-mask` 指令。

让我们看一个简单的日期字段示例：

```html
<input x-mask="99/99/9999" placeholder="MM/DD/YYYY">
```

mask 中支持以下通配符：

| 通配符 | 描述 |
| -------- | -------------------------------- |
| `*`      | 任意字符 |
| `a`      | 仅字母字符（a-z, A-Z） |
| `9`      | 仅数字字符（0-9） |

## 动态 Mask

`x-mask:dynamic` 允许你根据用户输入动态生成 mask。

以下是信用卡输入示例，根据号码是否以"34"或"37"开头（表示是 American Express 卡，格式不同）来改变 mask：

```html
<input x-mask:dynamic="
    $input.startsWith('34') || $input.startsWith('37')
        ? '9999 999999 99999' : '9999 9999 9999 9999'
">
```

`x-mask:dynamic` 也接受函数作为表达式的结果，并自动将 `$input` 作为第一个参数传入：

```html
<input x-mask:dynamic="creditCardMask">

<script>
function creditCardMask(input) {
    return input.startsWith('34') || input.startsWith('37')
        ? '9999 999999 99999'
        : '9999 9999 9999 9999'
}
</script>
```

## 金额输入

Alpine 提供了预构建的 `$money()` 辅助函数：

```html
<input x-mask:dynamic="$money($input)">
```

你可以通过第二、第三和第四可选参数自定义千位分隔符、小数点和精度：

```html
<input x-mask:dynamic="$money($input, ',')">
<input x-mask:dynamic="$money($input, '.', ' ')">
<input x-mask:dynamic="$money($input, '.', ',', 4)">
```
