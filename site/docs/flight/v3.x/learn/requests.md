---
title: 请求
source: https://github.com/flightphp/docs/blob/master/content/v3/en/learn/requests.md
status: 已翻译
---

# 请求

## 概述

Flight 将 HTTP 请求封装到一个对象中，可以通过以下方式访问：

```php
$request = Flight::request();
```

## 理解

HTTP 请求是理解 HTTP 生命周期的核心方面之一。用户在 Web 浏览器或 HTTP 客户端上执行操作，并将一系列请求头、请求体、URL 等发送到你的项目。你可以捕获这些请求头（浏览器的语言、它们能处理的压缩类型、用户代理等）并捕获发送到 Flight 应用的请求体和 URL。这些请求对于你的应用确定下一步要做什么至关重要。

## 基本用法

PHP 有几个超全局变量，包括 `$_GET`、`$_POST`、`$_REQUEST`、`$_SERVER`、`$_FILES` 和 `$_COOKIE`。Flight 将这些抽象为方便的[集合](../collections)。你可以像数组或对象一样访问 `query`、`data`、`cookies` 和 `files` 属性。

> **注意**：**强烈**不建议在你的项目中使用这些超全局变量，而应该通过 `request()` 对象进行引用。

> **注意**：目前没有对 `$_ENV` 的抽象。

### `$_GET`

你可以通过 `query` 属性访问 `$_GET` 数组：

```php
// GET /search?keyword=something
Flight::route('/search', function(){
	$keyword = Flight::request()->query['keyword'];
	// 或
	$keyword = Flight::request()->query->keyword;
	echo "You are searching for: $keyword";
	// 使用 $keyword 查询数据库或做其他操作
});
```

### `$_POST`

你可以通过 `data` 属性访问 `$_POST` 数组：

```php
Flight::route('POST /submit', function(){
	$name = Flight::request()->data['name'];
	$email = Flight::request()->data['email'];
	// 或
	$name = Flight::request()->data->name;
	$email = Flight::request()->data->email;
	echo "You submitted: $name, $email";
	// 使用 $name 和 $email 保存到数据库或做其他操作
});
```

### `$_COOKIE`

你可以通过 `cookies` 属性访问 `$_COOKIE` 数组：

```php
Flight::route('GET /login', function(){
	$savedLogin = Flight::request()->cookies['myLoginCookie'];
	// 或
	$savedLogin = Flight::request()->cookies->myLoginCookie;
	// 检查它是否真的存在，如果存在则自动登录
	if($savedLogin) {
		Flight::redirect('/dashboard');
		return;
	}
});
```

关于设置新的 cookie 值的帮助，参见 [overclokk/cookie](../../awesome-plugins/php_cookie)

### `$_SERVER`

有一个快捷方式可以通过 `getVar()` 方法访问 `$_SERVER` 数组：

```php

$host = Flight::request()->getVar('HTTP_HOST');
```

### `$_FILES`

你可以通过 `files` 属性访问上传的文件：

```php
// 原始访问 $_FILES 属性。参见下面的推荐方法
$uploadedFile = Flight::request()->files['myFile']; 
// 或
$uploadedFile = Flight::request()->files->myFile;
```

更多信息见[上传文件处理器](../uploaded_file)。

#### 处理文件上传

_v3.12.0_

你可以使用框架的一些辅助方法来处理文件上传。基本流程是从请求中提取文件数据，然后将其移动到新位置。

```php
Flight::route('POST /upload', function(){
	// 如果你有一个类似 <input type="file" name="myFile"> 的输入字段
	$uploadedFileData = Flight::request()->getUploadedFiles();
	$uploadedFile = $uploadedFileData['myFile'];
	$uploadedFile->moveTo('/path/to/uploads/' . $uploadedFile->getClientFilename());
});
```

如果你有多个文件上传，可以循环处理它们：

```php
Flight::route('POST /upload', function(){
	// 如果你有一个类似 <input type="file" name="myFiles[]"> 的输入字段
	$uploadedFiles = Flight::request()->getUploadedFiles()['myFiles'];
	foreach ($uploadedFiles as $uploadedFile) {
		$uploadedFile->moveTo('/path/to/uploads/' . $uploadedFile->getClientFilename());
	}
});
```

> **安全提示**：始终验证和清理用户输入，特别是在处理文件上传时。始终验证你允许上传的扩展名类型，但你还应该验证文件的"魔数字节"以确保它确实是用户声称的文件类型。有[文章](https://dev.to/yasuie/php-file-upload-check-uploaded-files-with-magic-bytes-54oe)[和](https://amazingalgorithms.com/snippets/php/detecting-the-mime-type-of-an-uploaded-file-using-magic-bytes/)[库](https://github.com/RikudouSage/MimeTypeDetector)可以用来帮助处理这个问题。

### 请求体

要获取原始 HTTP 请求体，例如处理 POST/PUT 请求时，你可以这样做：

```php
Flight::route('POST /users/xml', function(){
	$xmlBody = Flight::request()->getBody();
	// 对发送的 XML 进行处理。
});
```

### JSON 请求体

如果你收到一个内容类型为 `application/json` 且示例数据为 `{"id": 123}` 的请求，它将可以通过 `data` 属性获取：

```php
$id = Flight::request()->data->id;
```

### 请求头

你可以使用 `getHeader()` 或 `getHeaders()` 方法访问请求头：

```php

// 也许你需要 Authorization 请求头
$host = Flight::request()->getHeader('Authorization');
// 或
$host = Flight::request()->header('Authorization');

// 如果你需要获取所有请求头
$headers = Flight::request()->getHeaders();
// 或
$headers = Flight::request()->headers();
```

### 请求方法

你可以使用 `method` 属性或 `getMethod()` 方法访问请求方法：

```php
$method = Flight::request()->method; // 实际上由 getMethod() 填充
$method = Flight::request()->getMethod();
```

**注意**：`getMethod()` 方法首先从 `$_SERVER['REQUEST_METHOD']` 获取方法，然后如果存在 `$_SERVER['HTTP_X_HTTP_METHOD_OVERRIDE']` 或 `$_REQUEST['_method']`，它可以被覆盖。

## 请求对象属性

请求对象提供以下属性：

- **body** - 原始 HTTP 请求体
- **url** - 请求的 URL
- **base** - URL 的父级子目录
- **method** - 请求方法（GET、POST、PUT、DELETE）
- **referrer** - 来源 URL
- **ip** - 客户端的 IP 地址
- **ajax** - 请求是否为 AJAX 请求
- **scheme** - 服务器协议（http、https）
- **user_agent** - 浏览器信息
- **type** - 内容类型
- **length** - 内容长度
- **query** - 查询字符串参数
- **data** - Post 数据或 JSON 数据
- **cookies** - Cookie 数据
- **files** - 上传的文件
- **secure** - 连接是否安全
- **accept** - HTTP accept 参数
- **proxy_ip** - 客户端的代理 IP 地址。按顺序扫描 `$_SERVER` 数组中的 `HTTP_CLIENT_IP`、`HTTP_X_FORWARDED_FOR`、`HTTP_X_FORWARDED`、`HTTP_X_CLUSTER_CLIENT_IP`、`HTTP_FORWARDED_FOR`、`HTTP_FORWARDED`。
- **host** - 请求主机名
- **servername** - `$_SERVER` 中的 SERVER_NAME

## 辅助方法

有一些辅助方法可以帮助你拼接 URL 的各个部分，或处理特定的请求头。

### 完整 URL

你可以使用 `getFullUrl()` 方法访问完整的请求 URL：

```php
$url = Flight::request()->getFullUrl();
// https://example.com/some/path?foo=bar
```

### 基础 URL

你可以使用 `getBaseUrl()` 方法访问基础 URL：

```php
// http://example.com/path/to/something/cool?query=yes+thanks
$url = Flight::request()->getBaseUrl();
// https://example.com
// 注意，没有尾随斜杠。
```

## 查询字符串解析

你可以将 URL 传递给 `parseQuery()` 方法来将查询字符串解析为关联数组：

```php
$query = Flight::request()->parseQuery('https://example.com/some/path?foo=bar');
// ['foo' => 'bar']
```

## 内容类型协商

_v3.17.2_

你可以使用 `negotiateContentType()` 方法根据客户端发送的 `Accept` 请求头确定最佳的响应内容类型。

```php

// 示例 Accept 请求头: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8
// 下面定义了你支持的内容类型。
$availableTypes = ['application/json', 'application/xml'];
$typeToServe = Flight::request()->negotiateContentType($availableTypes);
if ($typeToServe === 'application/json') {
	// 提供 JSON 响应
} elseif ($typeToServe === 'application/xml') {
	// 提供 XML 响应
} else {
	// 默认为其他内容或抛出错误
}
```

> **注意**：如果在 `Accept` 请求头中找不到任何可用类型，该方法将返回 `null`。如果没有定义 `Accept` 请求头，该方法将返回 `$availableTypes` 数组中的第一个类型。

## 参见

- [路由](../routing) - 了解如何将路由映射到控制器并渲染视图。
- [响应](../responses) - 如何自定义 HTTP 响应。
- [为什么使用框架？](../why_frameworks) - 请求在整个框架中的位置。
- [集合](../collections) - 处理数据集合。
- [上传文件处理器](../uploaded_file) - 处理文件上传。

## 故障排除

- 如果你的 Web 服务器位于代理、负载均衡器等之后，`request()->ip` 和 `request()->proxy_ip` 可能不同。

## 更新日志

- v3.17.2 - 新增 negotiateContentType()
- v3.12.0 - 新增通过请求对象处理文件上传的能力。
- v1.0 - 初始发布。
