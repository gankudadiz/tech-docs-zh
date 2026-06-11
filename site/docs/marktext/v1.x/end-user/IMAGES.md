---
title: 图片处理
description: MarkText 图片管理和存储方式
sidebar_position: 16
source_href: https://github.com/marktext/marktext/blob/develop/packages/website/content/docs/end-user/IMAGES.md
translation_status: translated
---

# 图片处理

MarkText 可以自动将图片复制到指定目录，或处理来自剪贴板的图片。

### 使用选定的上传器上传到云端

请参阅[这里](IMAGE_UPLOADER_CONFIGRATION.md)了解更多信息。

### 移动到指定的本地文件夹

所有图片会自动复制到指定的本地目录（可以是相对路径）。

**优先使用相对资源文件夹：**

启用此选项后，所有图片会相对于打开的文件复制。打开项目时使用根目录，不使用变量。你可以通过*相对图片文件夹名称*文本框指定路径，并包含 `${filename}` 等变量将文件名添加到相对目录中。如果文件未保存，则使用本地资源目录。

注意：资源目录名称必须是有效的路径名称，且 MarkText 需要对该目录有写入权限。

相对路径示例：

- `assets`
- `../assets`
- `.`：当前文件目录
- `assets/123`
- `assets_${filename}`（添加文档文件名）

### 保持原始位置

MarkText 仅将剪贴板中的图片保存到指定的本地目录。
