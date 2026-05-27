---
title: 上传文件处理器
source: https://github.com/flightphp/docs/blob/master/content/v3/en/learn/uploaded_file.md
status: 已翻译
---

# 上传文件处理器

## 概述

Flight 中的 `UploadedFile` 类使得在应用中处理文件上传既简单又安全。它封装了 PHP 文件上传过程的细节，提供了一种简单、面向对象的方式来访问文件信息并移动上传的文件。

## 理解

当用户通过表单上传文件时，PHP 将文件信息存储在 `$_FILES` 超全局变量中。在 Flight 中，你很少直接与 `$_FILES` 交互。相反，Flight 的 `Request` 对象（通过 `Flight::request()` 访问）提供了一个 `getUploadedFiles()` 方法，返回一个 `UploadedFile` 对象数组，使文件处理更加方便和健壮。

`UploadedFile` 类提供了以下方法：
- 获取原始文件名、MIME 类型、大小和临时位置
- 检查上传错误
- 将上传的文件移动到永久位置

此类帮助你避免文件上传中的常见陷阱，如错误处理或安全移动文件。

## 基本用法

### 从请求中访问上传的文件

推荐通过请求对象访问上传的文件：

```php
Flight::route('POST /upload', function() {
    // 对于名为 <input type="file" name="myFile"> 的表单字段
    $uploadedFiles = Flight::request()->getUploadedFiles();
    $file = $uploadedFiles['myFile'];

    // 现在你可以使用 UploadedFile 方法
    if ($file->getError() === UPLOAD_ERR_OK) {
        $file->moveTo('/path/to/uploads/' . $file->getClientFilename());
        echo "File uploaded successfully!";
    } else {
        echo "Upload failed: " . $file->getError();
    }
});
```

### 处理多文件上传

如果你的表单使用 `name="myFiles[]"` 进行多文件上传，你将获得一个 `UploadedFile` 对象数组：

```php
Flight::route('POST /upload', function() {
    // 对于名为 <input type="file" name="myFiles[]"> 的表单字段
    $uploadedFiles = Flight::request()->getUploadedFiles();
    foreach ($uploadedFiles['myFiles'] as $file) {
        if ($file->getError() === UPLOAD_ERR_OK) {
            $file->moveTo('/path/to/uploads/' . $file->getClientFilename());
            echo "Uploaded: " . $file->getClientFilename() . "<br>";
        } else {
            echo "Failed to upload: " . $file->getClientFilename() . "<br>";
        }
    }
});
```

### 手动创建 UploadedFile 实例

通常，你不会手动创建 `UploadedFile`，但如果需要也是可以的：

```php
use flight\net\UploadedFile;

$file = new UploadedFile(
  $_FILES['myfile']['name'],
  $_FILES['myfile']['type'],
  $_FILES['myfile']['size'],
  $_FILES['myfile']['tmp_name'],
  $_FILES['myfile']['error']
);
```

### 访问文件信息

你可以轻松获取上传文件的详细信息：

```php
echo $file->getClientFilename();   // 用户计算机上的原始文件名
echo $file->getClientMediaType();  // MIME 类型（例如 image/png）
echo $file->getSize();             // 文件大小（字节）
echo $file->getTempName();         // 服务器上的临时文件路径
echo $file->getError();            // 上传错误代码（0 表示没有错误）
```

### 移动上传的文件

验证文件后，将其移动到永久位置：

```php
try {
  $file->moveTo('/path/to/uploads/' . $file->getClientFilename());
  echo "File uploaded successfully!";
} catch (Exception $e) {
  echo "Upload failed: " . $e->getMessage();
}
```

如果出现问题（如上传错误或权限问题），`moveTo()` 方法会抛出异常。

### 处理上传错误

如果上传过程中出现问题，你可以获取可读的错误消息：

```php
if ($file->getError() !== UPLOAD_ERR_OK) {
  // 你可以使用错误代码或从 moveTo() 捕获异常
  echo "There was an error uploading the file.";
}
```

## 参见

- [请求](../requests) - 了解如何从 HTTP 请求访问上传的文件，查看更多文件上传示例。
- [配置](../configuration) - 如何在 PHP 中配置上传限制和目录。
- [扩展](../extending) - 如何自定义或扩展 Flight 的核心类。

## 故障排除

- 在移动文件之前始终检查 `$file->getError()`。
- 确保上传目录对 Web 服务器可写。
- 如果 `moveTo()` 失败，请检查异常消息获取详细信息。
- PHP 的 `upload_max_filesize` 和 `post_max_size` 设置可以限制文件上传。
- 对于多文件上传，始终循环遍历 `UploadedFile` 对象数组。

## 更新日志

- v3.12.0 - 向请求对象添加了 `UploadedFile` 类，使文件处理更加简单。
