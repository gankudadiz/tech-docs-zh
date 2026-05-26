---
title: wire:confirm
source: https://github.com/livewire/livewire/blob/v3.8.0/docs/wire-confirm.md
source_version: v3.8.0
translation_status: draft
---

在执行 Livewire 中的危险操作之前，你可能希望为用户提供某种视觉确认。

Livewire 通过在任何动作（`wire:click`、`wire:submit` 等）之外添加 `wire:confirm`，让这变得很容易。

以下是在"删除文章"按钮上添加确认对话框的示例：

```blade
<button
    type="button"
    wire:click="delete"
    wire:confirm="Are you sure you want to delete this post?"
>
    Delete post <!-- [tl! highlight:-2,1] -->
</button>
```

当用户点击"Delete post"时，Livewire 会触发一个确认对话框（默认的浏览器确认弹窗）。如果用户按下 Escape 或取消，操作将不会执行。如果按下"OK"，操作将完成。

## 提示用户输入

对于更危险的操作，例如完全删除用户帐户，你可能希望向用户展示一个确认提示，要求他们输入特定的字符串来确认操作。

Livewire 提供了一个有用的 `.prompt` 修饰符，当应用于 `wire:confirm` 时，它会提示用户输入，并且仅当输入与提供的字符串（通过 `wire:confirm` 值末尾的"|"（管道符）指定）完全匹配（区分大小写）时，才确认操作：

```blade
<button
    type="button"
    wire:click="delete"
    wire:confirm.prompt="Are you sure?\n\nType DELETE to confirm|DELETE"
>
    Delete account <!-- [tl! highlight:-2,1] -->
</button>
```

当用户按下"Delete account"时，只有在提示框中输入"DELETE"时才会执行该操作，否则操作将被取消。
