---
title: 离线
source: https://github.com/livewire/livewire/blob/v3.8.0/docs/offline.md
source_version: v3.8.0
translation_status: draft
---

在实时应用中，提供用户设备已断开网络连接的视觉指示会非常有用。

Livewire 为此提供了 `wire:offline` 指令。

通过在 Livewire 组件内的元素上添加 `wire:offline`，该元素默认会被隐藏，当用户断开连接时变为可见：

```blade
<div wire:offline>
    该设备当前处于离线状态。
</div>
```

## 切换 class

添加 `class` 修饰符可以在用户断连时给元素添加一个 class。当用户恢复在线后，该 class 会被移除：

```blade
<div wire:offline.class="bg-red-300">
```

或者，使用 `.remove` 修饰符，可以在用户断连时移除某个 class。在以下示例中，当用户断连时，`bg-green-300` class 会从 `<div>` 上被移除：

```blade
<div class="bg-green-300" wire:offline.class.remove="bg-green-300">
```

## 切换属性

`.attr` 修饰符允许你在用户断连时为元素添加一个属性。在以下示例中，当用户断连时，"保存"按钮会被禁用：

```blade
<button wire:offline.attr="disabled">保存</button>
```
