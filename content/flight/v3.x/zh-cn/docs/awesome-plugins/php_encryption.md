---
title: PHP 加密
source: https://github.com/flightphp/docs/blob/master/content/v3/en/awesome-plugins/php_encryption.md
status: 已翻译
---

# PHP 加密

[defuse/php-encryption](https://github.com/defuse/php-encryption) 是一个可用于加密和解密数据的库。

## 安装

```bash
composer require defuse/php-encryption
```

## 设置

生成加密密钥：`vendor/bin/generate-defuse-key`，获得密钥后安全保存。

## 用法

```php
use Defuse\Crypto\Crypto;
use Defuse\Crypto\Key;

// 加密
Flight::map('encrypt', function($raw_data) {
	$encryption_key = /* 从配置或文件读取密钥 */;
	return Crypto::encrypt($raw_data, Key::loadFromAsciiSafeString($encryption_key));
});

// 解密
Flight::map('decrypt', function($encrypted_data) {
	$encryption_key = /* 密钥 */;
	try {
		return Crypto::decrypt($encrypted_data, Key::loadFromAsciiSafeString($encryption_key));
	} catch (Defuse\Crypto\Exception\WrongKeyOrModifiedCiphertextException $ex) {
		// 处理密钥错误或密文被篡改的情况
	}
});

Flight::route('/encrypt', function() {
	echo Flight::encrypt('This is a secret');
});
```
