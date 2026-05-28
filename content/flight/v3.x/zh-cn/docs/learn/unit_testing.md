---
title: 单元测试
source: https://github.com/flightphp/docs/blob/master/content/v3/en/learn/unit_testing.md
status: 已翻译
---

# 单元测试

## 概述

Flight 中的单元测试帮助你确保应用行为符合预期，尽早发现 bug，并使代码库更易于维护。Flight 设计为与最流行的 PHP 测试框架 [PHPUnit](https://phpunit.de/) 平滑协作。

## 理解

单元测试以隔离的方式检查应用的小块代码（如控制器或服务）的行为。在 Flight 中，这意味着测试路由、控制器和逻辑如何响应不同的输入——而不依赖于全局状态或真实的外部服务。

核心原则：
- **测试行为，而非实现：** 关注代码做了什么，而不是如何做的。
- **避免全局状态：** 使用依赖注入而不是 `Flight::set()` 或 `Flight::get()`。
- **模拟外部服务：** 用测试替身替换数据库或邮件服务等。
- **保持测试快速且专注：** 单元测试不应该访问真实数据库或 API。

## 基本用法

### 设置 PHPUnit

1. 通过 Composer 安装 PHPUnit：
   ```bash
   composer require --dev phpunit/phpunit
   ```
2. 在项目根目录创建 `tests` 目录。
3. 在 `composer.json` 中添加测试脚本：
   ```json
   "scripts": {
       "test": "phpunit --configuration phpunit.xml"
   }
   ```
4. 创建 `phpunit.xml` 文件：
   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <phpunit bootstrap="vendor/autoload.php">
       <testsuites>
           <testsuite name="Flight Tests">
               <directory>tests</directory>
           </testsuite>
       </testsuites>
   </phpunit>
   ```

现在你可以使用 `composer test` 运行测试。

### 测试简单的路由处理器

假设你有一个验证电子邮件的路由：

```php
// index.php
$app->route('POST /register', [ UserController::class, 'register' ]);

// UserController.php
class UserController {
    protected $app;
    public function __construct(flight\Engine $app) {
        $this->app = $app;
    }
    public function register() {
        $email = $this->app->request()->data->email;
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return $this->app->json(['status' => 'error', 'message' => 'Invalid email']);
        }
        return $this->app->json(['status' => 'success', 'message' => 'Valid email']);
    }
}
```

针对此控制器的简单测试：

```php
use PHPUnit\Framework\TestCase;
use flight\Engine;

class UserControllerTest extends TestCase {
    public function testValidEmailReturnsSuccess() {
        $app = new Engine();
        $app->request()->data->email = 'test@example.com';
        $controller = new UserController($app);
        $controller->register();
        $response = $app->response()->getBody();
        $output = json_decode($response, true);
        $this->assertEquals('success', $output['status']);
        $this->assertEquals('Valid email', $output['message']);
    }

    public function testInvalidEmailReturnsError() {
        $app = new Engine();
        $app->request()->data->email = 'invalid-email';
        $controller = new UserController($app);
        $controller->register();
        $response = $app->response()->getBody();
        $output = json_decode($response, true);
        $this->assertEquals('error', $output['status']);
        $this->assertEquals('Invalid email', $output['message']);
    }
}
```

**提示：**
- 使用 `$app->request()->data` 模拟 POST 数据。
- 避免在测试中使用 `Flight::` 静态调用——使用 `$app` 实例。

### 使用依赖注入创建可测试的控制器

将依赖（如数据库或邮件服务）注入到控制器中，使其易于在测试中模拟：

```php
use flight\database\PdoWrapper;

class UserController {
    protected $app;
    protected $db;
    protected $mailer;
    public function __construct($app, $db, $mailer) {
        $this->app = $app;
        $this->db = $db;
        $this->mailer = $mailer;
    }
    public function register() {
        $email = $this->app->request()->data->email;
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return $this->app->json(['status' => 'error', 'message' => 'Invalid email']);
        }
        $this->db->runQuery('INSERT INTO users (email) VALUES (?)', [$email]);
        $this->mailer->sendWelcome($email);
        return $this->app->json(['status' => 'success', 'message' => 'User registered']);
    }
}
```

以及带模拟的测试：

```php
use PHPUnit\Framework\TestCase;

class UserControllerDICTest extends TestCase {
    public function testValidEmailSavesAndSendsEmail() {
        $mockDb = $this->createMock(flight\database\PdoWrapper::class);
        $mockDb->method('runQuery')->willReturn(true);
        $mockMailer = new class {
            public $sentEmail = null;
            public function sendWelcome($email) { $this->sentEmail = $email; return true; }
        };
        $app = new flight\Engine();
        $app->request()->data->email = 'test@example.com';
        $controller = new UserController($app, $mockDb, $mockMailer);
        $controller->register();
        $response = $app->response()->getBody();
        $result = json_decode($response, true);
        $this->assertEquals('success', $result['status']);
        $this->assertEquals('User registered', $result['message']);
        $this->assertEquals('test@example.com', $mockMailer->sentEmail);
    }
}
```

## 高级用法

- **模拟：** 使用 PHPUnit 内置的 mock 或匿名类替换依赖。
- **直接测试控制器：** 使用新的 `Engine` 实例化控制器并模拟依赖。
- **避免过度模拟：** 尽可能让真实逻辑运行；只模拟外部服务。

## 参见

- [单元测试指南](../guides/unit_testing) - 关于单元测试最佳实践的综合指南。
- [依赖注入容器](dependency_injection_container) - 如何使用 DIC 管理依赖并提高可测试性。
- [扩展](extending) - 如何添加自己的辅助方法或覆盖核心类。
- [PDO 包装器](pdo_wrapper) - 简化数据库交互，在测试中更容易模拟。
- [请求](requests) - 在 Flight 中处理 HTTP 请求。
- [响应](responses) - 向用户发送响应。
- [单元测试与 SOLID 原则](unit_testing_and_solid_principles) - 了解 SOLID 原则如何改进你的单元测试。

## 故障排除

- 避免在代码和测试中使用全局状态（`Flight::set()`、`$_SESSION` 等）。
- 如果测试很慢，你可能在写集成测试——模拟外部服务以保持单元测试快速。
- 如果测试设置复杂，考虑重构代码以使用依赖注入。

## 更新日志

- v3.15.0 - 添加了依赖注入和模拟的示例。
