---
title: Ghostff/Session
source: https://github.com/flightphp/docs/blob/master/content/v3/en/awesome-plugins/ghost_session.md
status: 已翻译
---

# Ghostff/Session

PHP Session Manager（非阻塞、flash、分段、会话加密）。使用 PHP open_ssl 进行可选的会话数据加密/解密。支持 File、MySQL、Redis 和 Memcached。

点击[这里](https://github.com/Ghostff/Session)查看代码。

## 安装

```bash
composer require ghostff/session
```

## 基本配置

使用默认设置无需传递任何参数。更多设置参见 [Github Readme](https://github.com/Ghostff/Session)。

```php
use Ghostff\Session\Session;

require 'vendor/autoload.php';

$app = Flight::app();
$app->register('session', Session::class);

// 需要记住的是，你必须在每次页面加载时提交会话
// 或者在配置中启用 auto_commit。
```

## 简单示例

```php
Flight::route('POST /login', function() {
	$session = Flight::session();
	// 登录逻辑...
	$session->set('is_logged_in', true);
	$session->set('user', $user);
	$session->commit(); // 必须显式提交
});

// 中间件方式保护路由
Flight::route('/some-restricted-page', function() {
	// 页面逻辑
})->addMiddleware(function() {
	$session = Flight::session();
	if(!$session->get('is_logged_in')) {
		Flight::redirect('/login');
	}
});
```

## 高级配置（数据库存储）

```php
$app->register('session', Session::class, [ [
	Session::CONFIG_DRIVER        => Ghostff\Session\Drivers\MySql::class,
	Session::CONFIG_ENCRYPT_DATA  => true,
	Session::CONFIG_SALT_KEY      => hash('sha256', 'my-super-S3CR3T-salt'),
	Session::CONFIG_AUTO_COMMIT   => true,
	Session::CONFIG_MYSQL_DS      => [
		'driver' => 'mysql', 'host' => '127.0.0.1',
		'db_name' => 'my_app_database', 'db_table' => 'sessions',
		'db_user' => 'root', 'db_pass' => '',
		'persistent_conn'=> false,
	]
] ]);
```

## 会话数据不持久化？

设置会话数据后必须调用 `$session->commit()`。或配置 `auto_commit => true`，或使用 `Flight::after('start', function() { Flight::session()->commit(); });`。

完整文档见 [Github Readme](https://github.com/Ghostff/Session)。
