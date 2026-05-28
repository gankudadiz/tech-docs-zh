---
title: 使用 PHPUnit 进行单元测试
source: https://github.com/flightphp/docs/blob/master/content/v3/en/guides/unit_testing.md
status: 已翻译
---

# 使用 PHPUnit 进行单元测试

本指南介绍在 Flight PHP 中使用 [PHPUnit](https://phpunit.de/) 进行单元测试，面向希望理解*为什么*测试重要以及如何实际应用的初学者。我们专注于测试*行为*——确保应用按预期工作。[查看更多](../learn/unit_testing)

## 为什么单元测试？

单元测试确保代码行为符合预期，在到达生产环境之前捕获 bug。对于独立开发者或团队，单元测试充当安全网，记录预期行为并防止在重新访问代码时出现回归。

## 通用指导原则

1. **测试行为而非实现**：关注结果（如"邮件已发送"）而非内部细节。
2. **停止使用 `Flight::`**：使用 `$app = Flight::app();` 实例代替静态方法。
3. **保持测试快速**：避免数据库调用等慢操作。慢的测试是集成测试，不是单元测试。
4. **使用描述性命名**：测试名称应清晰描述被测试的行为。
5. **避免全局状态**：最小化 `$app->set()` 和 `$app->get()` 的使用，使用 DI 或 DI 容器。
6. **使用依赖注入**：将依赖（如 PDO、mailers）注入到控制器中。如果类有太多依赖，考虑按 SOLID 原则重构。
7. **模拟第三方服务**：模拟数据库、HTTP 客户端或邮件服务。不要真的每次测试都发短信！
8. **追求高覆盖率但非完美**：100% 行覆盖率不代表一切，优先关注关键行为。

## 设置 PHPUnit

```bash
composer require --dev phpunit/phpunit
```

创建 `phpunit.xml` 和 `tests/` 目录。

## 测试 Flight 控制器

```php
class UserControllerTest extends TestCase {
    public function testValidEmail() {
        $app = new Engine();
        $app->request()->data->email = 'test@example.com';
        $controller = new UserController($app);
        $controller->register();
        $response = json_decode($app->response()->getBody(), true);
        $this->assertEquals('success', $response['status']);
    }
}
```

## 使用依赖注入和模拟

```php
public function testUserRegistration() {
    $mockDb = $this->createMock(PdoWrapper::class);
    $mockDb->method('runQuery')->willReturn(true);
    $mockMailer = new class { public $sentEmail; public function sendWelcome($email) { $this->sentEmail = $email; } };
    $app = new Engine();
    $app->request()->data->email = 'test@example.com';
    $controller = new UserController($app, $mockDb, $mockMailer);
    $controller->register();
    $this->assertEquals('test@example.com', $mockMailer->sentEmail);
}
```

## 测试容器

测试容器用于验证容器是否正确解析依赖。使用 `Flight::registerContainerHandler()` 和模拟容器。

完整指南见 [单元测试文档](../learn/unit_testing)。
