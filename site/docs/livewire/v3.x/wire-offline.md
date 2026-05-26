---
title: wire:offline
source: https://github.com/livewire/livewire/blob/v3.8.0/docs/wire-offline.md
source_version: v3.8.0
translation_status: draft
---

在某些情况下，让用户知道他们当前是否连接到互联网会很有帮助。

例如，如果你在 Livewire 上构建了一个博客平台，你可能希望以某种方式通知用户他们处于离线状态，这样他们就不会在 Livewire 无法保存到数据库的情况下撰写整篇博客文章。

Livewire 通过提供 `wire:offline` 指令使这变得微不足道。通过在 Livewire 组件中的元素上添加 `wire:offline`，该元素默认隐藏，仅在 Livewire 检测到网络连接已中断且不可用时才显示。当网络重新连接后，它将再次消失。

例如：

```blade
<p class="alert alert-warning" wire:offline>
    Whoops, your device has lost connection. The web page you are viewing is offline.
</p>
```
