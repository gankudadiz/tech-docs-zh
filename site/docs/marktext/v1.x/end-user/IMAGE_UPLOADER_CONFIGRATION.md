---
title: 图片上传配置
description: MarkText 图片上传到云端的配置
sidebar_position: 18
source_href: https://github.com/marktext/marktext/blob/develop/packages/website/content/docs/end-user/IMAGE_UPLOADER_CONFIGRATION.md
translation_status: translated
---

# 图片上传配置

#### PicGo

PicGo 是一个将图片上传到各种云服务的 CLI 工具。请参阅 [PicGo 文档](https://picgo.github.io/PicGo-Doc/en/guide/) 了解安装、配置和支持的后端。

安装并配置 PicGo 后，在 *Preferences → Image* 中将 MarkText 指向 PicGo 可执行文件，并将 *image insert action* 选择为 `upload`（或在需要时从图片覆盖层使用）。PicGo 是唯一的内置上传器；旧版 GitHub 上传器已在 0.19 版本中移除。
