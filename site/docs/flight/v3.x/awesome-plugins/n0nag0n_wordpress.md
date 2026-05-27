---
title: WordPress 集成
source: https://github.com/flightphp/docs/blob/master/content/v3/en/awesome-plugins/n0nag0n_wordpress.md
status: 已翻译
---

# WordPress 集成: n0nag0n/wordpress-integration-for-flight-framework

想在 WordPress 站点中使用 Flight PHP？这个插件让你可以轻松实现！通过 `n0nag0n/wordpress-integration-for-flight-framework`，你可以在 WordPress 旁边运行完整的 Flight 应用——非常适合构建自定义 API、微服务甚至全功能应用。

## 功能

- 将 Flight PHP 与 WordPress 无缝集成
- 根据 URL 模式将请求路由到 Flight 或 WordPress
- 使用控制器、模型和视图（MVC）组织代码
- 使用 WordPress 的数据库连接或自己的

## 安装

1. 上传 `flight-integration` 文件夹到 `/wp-content/plugins/`
2. 在 WordPress 管理中激活插件
3. 进入 **设置 > Flight Framework** 配置插件
4. 设置 vendor 路径并配置应用文件夹

## 用法

```php
// app/config/routes.php
Flight::route('GET /api/hello', function() {
    Flight::json(['message' => 'Hello World!']);
});

// 在控制器中使用 WordPress 函数
class ApiController {
    public function getUsers() {
        $users = get_users();
        $result = [];
        foreach($users as $user) {
            $result[] = ['id' => $user->ID, 'name' => $user->display_name];
        }
        Flight::json($result);
    }
}
```
