---
title: CommentTemplate
source: https://github.com/flightphp/docs/blob/master/content/v3/en/awesome-plugins/comment_template.md
status: 已翻译
---

# CommentTemplate

[CommentTemplate](https://github.com/KnifeLemon/CommentTemplate) 是一个强大的 PHP 模板引擎，具有资源编译、模板继承和变量处理功能。提供简单而灵活的方式管理模板，内置 CSS/JS 压缩和缓存。

## 特性

- **模板继承**：使用布局并包含其他模板
- **资源编译**：自动 CSS/JS 压缩和缓存
- **变量处理**：模板变量支持过滤器和命令
- **Base64 编码**：将资源内联为 data URI
- **Flight 框架集成**：可选集成

## 安装

```bash
composer require knifelemon/comment-template
```

## 基本配置

```php
use KnifeLemon\CommentTemplate\Engine;

$app->register('view', Engine::class, [], function (Engine $engine) use ($app) {
    $engine->setPublicPath(__DIR__);        // 根目录
    $engine->setSkinPath('views');           // 模板目录
    $engine->setAssetPath('assets');         // 编译后资源目录
    $engine->setFileExtension('.php');
});

$app->map('render', function(string $template, array $data) use ($app): void {
    echo $app->view()->render($template, $data);
});
```

## 模板指令

```html
<!--@layout(layout/global_layout)-->        <!-- 布局继承 -->
<!--@import(components/header)-->           <!-- 引入组件 -->
<!--@css(/css/styles.css)-->                 <!-- CSS 压缩缓存 -->
<!--@js(/js/script.js)-->                    <!-- JS 压缩缓存 -->
<!--@base64(images/logo.png)-->              <!-- Base64 内联 -->
<!--@asset(images/photo.jpg)-->              <!-- 复制资源 -->
<!--@assetDir(assets/fonts)-->               <!-- 复制目录 -->
```

## 变量

```html
<h1>{$title}</h1>
{$content|upper}                             <!-- 大写 -->
{$html|striptag|trim|escape}                <!-- 链式过滤器 -->
{$title|default=Default Title}               <!-- 默认值 -->
```

内置 Tracy Debugger 集成。更多示例见 [GitHub](https://github.com/KnifeLemon/CommentTemplate)。
