---
title: wire:dirty
source: https://github.com/livewire/livewire/blob/v3.8.0/docs/wire-dirty.md
source_version: v3.8.0
translation_status: draft
---

在传统的包含表单的 HTML 页面中，表单只会在用户按下"Submit"按钮时提交。

然而，Livewire 的能力远不止传统的表单提交。你可以实时验证表单输入，甚至在用户输入时保存表单。

在这些"实时"更新场景中，向用户提示表单或表单子集已发生更改但尚未保存到数据库，会非常有帮助。

当表单包含未保存的输入时，该表单被视为"脏"（dirty）。只有当网络请求被触发，将服务器状态与客户端状态同步后，它才变为"干净"（clean）。

## 基本用法

Livewire 允许你使用 `wire:dirty` 指令轻松切换页面上的视觉元素。

通过在元素上添加 `wire:dirty`，你指示 Livewire 仅在客户端状态与服务器端状态不一致时显示该元素。

以下是一个 `UpdatePost` 表单示例，其中包含一个视觉上的"未保存的更改..."提示，向用户发出表单包含尚未保存的输入信号：

```blade
<form wire:submit="update">
    <input type="text" wire:model="title">

    <!-- ... -->

    <button type="submit">Update</button>

    <div wire:dirty>Unsaved changes...</div> <!-- [tl! highlight] -->
</form>
```

因为"Unsaved changes..."消息上添加了 `wire:dirty`，该消息默认是隐藏的。当用户开始修改表单输入时，Livewire 会自动显示该消息。

当用户提交表单后，由于服务器/客户端数据重新同步，消息将再次消失。

### 移除元素

通过为 `wire:dirty` 添加 `.remove` 修饰符，你可以默认显示元素，只在组件处于"脏"状态时隐藏它：

```blade
<div wire:dirty.remove>The data is in-sync...</div>
```

## 定位属性更新

假设你正在使用 `wire:model.blur` 在用户离开输入字段后立即更新服务器上的属性。在这种情况下，你可以通过为包含 `wire:dirty` 指令的元素添加 `wire:target`，仅针对该属性提供"脏"状态提示。

以下是一个示例，只在标题属性被更改时显示脏状态提示：

```blade
<form wire:submit="update">
    <input wire:model.blur="title">

    <div wire:dirty wire:target="title">Unsaved title...</div> <!-- [tl! highlight] -->

    <button type="submit">Update</button>
</form>
```

## 切换类

通常，你可能希望在其状态为"脏"时切换输入上的个别 CSS 类，而不是切换整个元素。

以下是一个示例：用户在输入框中键入时，边框变为黄色，表示"未保存"状态。然后，当用户 Tab 离开该字段时，边框被移除，表示状态已在服务器上保存：

```blade
<input wire:model.blur="title" wire:dirty.class="border-yellow-500">
```
