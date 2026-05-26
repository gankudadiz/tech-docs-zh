---
title: 安装
source:
  repo: https://github.com/alpinejs/alpine
  ref: main
  path: packages/docs/src/en/essentials/installation.md
version: v3.x
translation_status: translated
---

# 安装

有两种方式将 Alpine 引入你的项目：

* 通过 `<script>` 标签引入
* 作为模块导入

两种方式都完全有效，取决于项目需求和开发者偏好。

<a name="from-a-script-tag"></a>
## 通过 script 标签引入

这是开始使用 Alpine 最简单的方式。在 HTML 页面的 head 中包含以下 `<script>` 标签。

```html
<html>
    <head>
        ...

        <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    </head>
    ...
</html>
```

> 不要忘记 `<script>` 标签中的 "defer" 属性。

注意提供的 CDN 链接中的 `@3.x.x`。这会拉取 Alpine 3 的最新版本。为了生产环境稳定性，建议在 CDN 链接中固定最新的具体版本。

```html
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.15.12/dist/cdn.min.js"></script>
```

就这样！Alpine 现在可以在你的页面中使用。

请注意你仍然需要用 `x-data` 定义一个组件，Alpine.js 的属性才能生效。更多信息请参见 <https://github.com/alpinejs/alpine/discussions/3805>。

<a name="as-a-module"></a>
## 作为模块引入

如果你更喜欢更健壮的方式，可以通过 NPM 安装 Alpine 并导入到打包工具中。

运行以下命令进行安装：

```shell
npm install alpinejs
```

现在将 Alpine 导入你的打包工具并初始化：

```js
import Alpine from 'alpinejs'

window.Alpine = Alpine

Alpine.start()
```

> `window.Alpine = Alpine` 是可选的，但为了自由度和灵活性（比如在开发者工具中调试 Alpine）保留它会很方便。

> 如果你将 Alpine 导入到打包工具中，必须确保在导入 `Alpine` 全局对象之后、调用 `Alpine.start()` 初始化之前，在这两者之间注册任何扩展代码。

> 确保 `Alpine.start()` 每页只调用一次。多次调用会导致多个 Alpine "实例"同时运行。

[→ 阅读更多关于扩展 Alpine 的内容](/advanced/extending)
