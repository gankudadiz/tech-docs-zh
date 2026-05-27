---
title: Cookie
source: https://github.com/flightphp/docs/blob/master/content/v3/en/awesome-plugins/php_cookie.md
status: 已翻译
---

# Cookie

[overclokk/cookie](https://github.com/overclokk/cookie) 是一个用于管理应用中 Cookie 的简单库。

## 安装

```bash
composer require overclokk/cookie
```

## 用法

```php
use Overclokk\Cookie\Cookie;

Flight::register('cookie', Cookie::class);

// 设置 Cookie
/** @var \Overclokk\Cookie\Cookie $cookie */
$cookie = Flight::cookie(false);
$cookie->set('stay_logged_in', '1', 86400, '/', 'example.com', true, true);
// 或使用永久 Cookie
$cookie->forever('stay_logged_in', '1');

// 检查 Cookie
if (Flight::cookie()->has('stay_logged_in')) {
	Flight::redirect('/dashboard');
}
```
