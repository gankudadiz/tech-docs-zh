---
title: Firebase JWT - JSON Web Token 身份验证
source: https://github.com/flightphp/docs/blob/master/content/v3/en/awesome-plugins/jwt.md
status: 已翻译
---

# Firebase JWT - JSON Web Token 身份验证

JWT (JSON Web Tokens) 是一种紧凑、URL 安全的方式来表示应用和客户端之间的声明。非常适合无状态 API 身份验证——无需服务端会话存储！本指南展示如何将 [Firebase JWT](https://github.com/firebase/php-jwt) 与 Flight 集成。

## 什么是 JWT？

JWT 是一个包含三部分的字符串：**Header**（元数据）、**Payload**（数据：用户 ID、角色、过期时间等）、**Signature**（密码学签名）。

为什么使用 JWT？无状态、可扩展、跨域友好、移动友好、标准化（RFC 7519）。

## 安装

```bash
composer require firebase/php-jwt
```

## 基本用法

```php
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$secretKey = 'your-256-bit-secret-key';
$payload = ['user_id' => 123, 'username' => 'johndoe', 'role' => 'admin', 'iat' => time(), 'exp' => time() + 3600];
$jwt = JWT::encode($payload, $secretKey, 'HS256');

// 验证和解码
try { $decoded = JWT::decode($jwt, new Key($secretKey, 'HS256')); } catch (Exception $e) { /* 处理 */ }
```

## JWT 中间件（推荐方式）

```php
class JwtMiddleware {
    protected Engine $app; protected string $secretKey;
    public function __construct(Engine $app) {
        $this->app = $app;
        $this->secretKey = $app->get('config')['jwt_secret'];
    }
    public function before(array $params) {
        $authHeader = $this->app->request()->getHeader('Authorization');
        if (empty($authHeader)) { $this->app->jsonHalt(['error' => 'No token'], 401); }
        preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches);
        try {
            $decoded = JWT::decode($matches[1], new Key($this->secretKey, 'HS256'));
            $this->app->request()->data->user = $decoded;
        } catch (ExpiredException $e) { $this->app->jsonHalt(['error' => 'Token expired'], 401); }
        catch (SignatureInvalidException $e) { $this->app->jsonHalt(['error' => 'Invalid signature'], 401); }
        catch (Exception $e) { $this->app->jsonHalt(['error' => 'Invalid token'], 401); }
    }
}

// 保护路由组
Flight::group('/api', function() {
    Flight::route('GET /users', function() { /* ... */ });
}, [ JwtMiddleware::class ]);
```

## 常见用例

**登录端点**：验证凭据后生成 JWT。**Token 刷新**：短期 access token (15 分钟) + 长期 refresh token (7 天)。**角色访问控制**：扩展中间件检查用户角色。**速率限制**：按 user_id 限速。

## 安全最佳实践

1. 使用强密钥：`$secretKey = base64_encode(random_bytes(32));`
2. 密钥存环境变量，不提交到版本控制
3. 设置适当过期：access token 15 分钟，refresh token 7 天
4. 生产环境使用 HTTPS
5. 验证 token claims
6. 考虑 token 黑名单实现登出

## 算法

- **HS256**（推荐）：单一密钥
- **RS256**：公/私钥对（微服务、第三方集成场景用）

## 故障排除

- Token 过期 → 续签
- 签名验证失败 → 检查密钥一致性，考虑时间偏移 `JWT::$leeway = 60;`
- Token 未发送 → 确保客户端发送 `Authorization: Bearer <token>` 头

详见 [GitHub 仓库](https://github.com/firebase/php-jwt) 和 [JWT.io](https://jwt.io/)。
