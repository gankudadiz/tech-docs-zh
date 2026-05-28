---
title: JSON 包装器
source: https://github.com/flightphp/docs/blob/master/content/v3/en/learn/json.md
status: 已翻译
---

# JSON 包装器

## 概述

Flight 中的 `Json` 类提供了一种简单、一致的方式来在应用中编码和解码 JSON 数据。它对 PHP 原生的 JSON 函数进行了包装，提供更好的错误处理和一些有用的默认设置，使处理 JSON 更简单、更安全。

## 理解

在现代 PHP 应用中，处理 JSON 非常常见，特别是在构建 API 或处理 AJAX 请求时。`Json` 类集中了所有的 JSON 编码和解码操作，这样你就不必担心 PHP 内置函数的奇怪边界情况或晦涩的错误信息。

主要特性：
- 一致的错误处理（失败时抛出异常）
- 编码/解码的默认选项（如反斜杠不转义）
- 美化输出和验证的工具方法

## 基本用法

### 将数据编码为 JSON

要将 PHP 数据转换为 JSON 字符串，使用 `Json::encode()`：

```php
use flight\util\Json;

$data = [
  'framework' => 'Flight',
  'version' => 3,
  'features' => ['routing', 'views', 'extending']
];

$json = Json::encode($data);
echo $json;
// 输出: {"framework":"Flight","version":3,"features":["routing","views","extending"]}
```

如果编码失败，你将获得一个带有有用错误消息的异常。

### 美化输出

想要 JSON 易于阅读？使用 `prettyPrint()`：

```php
echo Json::prettyPrint($data);
/*
{
  "framework": "Flight",
  "version": 3,
  "features": [
    "routing",
    "views",
    "extending"
  ]
}
*/
```

### 解码 JSON 字符串

要将 JSON 字符串转换回 PHP 数据，使用 `Json::decode()`：

```php
$json = '{"framework":"Flight","version":3}';
$data = Json::decode($json);
echo $data->framework; // 输出: Flight
```

如果你想要关联数组而不是对象，将 `true` 作为第二个参数传入：

```php
$data = Json::decode($json, true);
echo $data['framework']; // 输出: Flight
```

如果解码失败，你将获得一个带有清晰错误消息的异常。

### 验证 JSON

检查一个字符串是否为有效的 JSON：

```php
if (Json::isValid($json)) {
  // 有效！
} else {
  // 不是有效的 JSON
}
```

### 获取最后的错误

如果你想查看最后的 JSON 错误消息（来自原生 PHP 函数）：

```php
$error = Json::getLastError();
if ($error !== '') {
  echo "Last JSON error: $error";
}
```

## 高级用法

如果需要更多控制，你可以自定义编码和解码选项（参见 [PHP 的 json_encode 选项](https://www.php.net/manual/en/json.constants.php)）：

```php
// 使用 HEX_TAG 选项编码
$json = Json::encode($data, JSON_HEX_TAG);

// 使用自定义深度解码
$data = Json::decode($json, false, 1024);
```

## 参见

- [集合](collections) - 处理可轻松转换为 JSON 的结构化数据。
- [配置](configuration) - 如何配置你的 Flight 应用。
- [扩展](extending) - 如何添加自己的工具或覆盖核心类。

## 故障排除

- 如果编码或解码失败，将抛出异常——如果想优雅地处理错误，请用 try/catch 包裹调用。
- 如果得到意外结果，请检查数据中是否有循环引用或非 UTF-8 字符。
- 在解码之前使用 `Json::isValid()` 检查字符串是否为有效的 JSON。

## 更新日志

- v3.16.0 - 添加了 JSON 包装器工具类。
