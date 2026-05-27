---
title: 使用 Flight PHP 构建简单博客
source: https://github.com/flightphp/docs/blob/master/content/v3/en/guides/blog.md
status: 已翻译
---

# 使用 Flight PHP 构建简单博客

本指南将带你使用 Flight PHP 框架创建一个基础博客。你将设置项目、定义路由、用 JSON 管理文章，并使用 Latte 模板引擎渲染——展示 Flight 的简洁性和灵活性。

## 前置条件

PHP 7.4+、Composer、文本编辑器、基本的 PHP 和 Web 开发知识。

## 步骤 1：设置项目

```bash
mkdir flight-blog && cd flight-blog
composer require flightphp/core
mkdir public
```

创建 `public/index.php`：
```php
<?php
require '../vendor/autoload.php';
Flight::route('/', function () { echo 'Hello, Flight!'; });
Flight::start();
```

运行：`php -S localhost:8000 -t public/`

## 步骤 2：组织项目结构

```
flight-blog/
├── app/config/    # 配置文件（路由等）
├── app/views/     # 模板文件
├── data/           # JSON 数据
├── public/         # Web 根目录
└── vendor/
```

## 步骤 3：安装和配置 Latte

```bash
composer require latte/latte
```

在 `index.php` 中注册 Latte，创建 `layout.latte`（布局）和 `home.latte`（主页模板）。创建 `data/posts.json` 作为数据存储。

## 步骤 4-7：定义路由、存取文章、创建表单

在 `app/config/routes.php` 中定义路由：
```php
Flight::route('/', function () { /* 渲染首页 */ });
Flight::route('/post/@slug', function ($slug) { /* 渲染文章页 */ });
Flight::route('GET /create', function () { /* 渲染创建表单 */ });
Flight::route('POST /create', function () { /* 保存新文章并重定向 */ });
```

使用 `Flight::map('posts', ...)` 加载 JSON 数据。

## 步骤 8：错误处理

```php
Flight::map('notFound', function () {
    Flight::view()->render('404.latte', ['title' => 'Page Not Found']);
});
```

## 后续步骤

添加 CSS、替换 JSON 为数据库（SQLite + PdoWrapper）、添加表单验证、实现中间件认证。

以上就是全部！你已用 Flight PHP、Latte 和 JSON 构建了一个功能齐全的博客应用。
