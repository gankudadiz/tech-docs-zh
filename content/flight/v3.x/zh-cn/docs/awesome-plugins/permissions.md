---
title: FlightPHP/Permissions
source: https://github.com/flightphp/docs/blob/master/content/v3/en/awesome-plugins/permissions.md
status: 已翻译
---

# FlightPHP/Permissions

这是一个权限模块，用于应用中多角色且各角色功能有所不同的场景。允许为每个角色定义权限，然后检查当前用户是否有权访问或执行某些操作。

## 安装

```bash
composer require flightphp/permissions
```

## 基本用法

```php
$current_role = 'admin';
$permission = new \flight\Permission($current_role);
$permission->defineRule('loggedIn', function($current_role) {
	return $current_role !== 'guest';
});
Flight::set('permission', $permission);

// 在控制器中
$permission = Flight::get('permission');
if ($permission->has('loggedIn')) {
	// 执行操作
}
```

### 多权限示例

```php
$permission->defineRule('post', function($current_role) {
	if($current_role === 'admin') return ['create', 'read', 'update', 'delete'];
	if($current_role === 'editor') return ['create', 'read', 'update'];
	// ...
});
// 检查: $permission->can('post.create')
```

### 使用类定义权限 + 缓存

```php
class MyPermissions {
	public function order(string $current_role, int $order_id = 0): array {
		return $permissions_array;
	}
}
$Permissions->defineRulesFromClassMethods(MyApp\Permissions::class);
// 带缓存:
$Permissions->defineRulesFromClassMethods(MyApp\Permissions::class, 3600);
```

支持闭包/类方法、依赖注入、`has()`/`can()`/`is()` 三种检查方法。详见 [GitHub](https://github.com/flightphp/permissions)。
