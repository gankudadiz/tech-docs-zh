---
title: flightphp/cache
source: https://github.com/flightphp/docs/blob/master/content/v3/en/awesome-plugins/php_file_cache.md
status: 已翻译
---

# flightphp/cache

轻量、简单、独立的 PHP 文件缓存类，fork 自 [Wruczek/PHP-File-Cache](https://github.com/Wruczek/PHP-File-Cache)。

**优点**：轻量独立、单文件、安全（die header 防止直接访问）、flock 并发处理、PHP 7.4+、MIT 许可。

本文档站也在使用此库缓存每个页面！

## 安装

```bash
composer require flightphp/cache
```

## 用法

```php
use flight\Cache;

$app->register('cache', Cache::class, [ __DIR__ . '/../cache/' ], function(Cache $cache) {
	$cache->setDevMode(ENVIRONMENT === 'development');
});

// 获取（带自动刷新）
$data = Flight::cache()->refreshIfExpired('key', function () {
    return date("H:i:s");
}, 10);

// 存储：Flight::cache()->set('key', $data, 10);
// 删除：Flight::cache()->delete('key');
// 检查：Flight::cache()->exists('key');
// 清空：Flight::cache()->flush();
// 元数据：Flight::cache()->get('key', true); // 返回 {time, expire, data, permanent}
```
