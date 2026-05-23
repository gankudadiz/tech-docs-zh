---
title: 在面板外渲染通知
---

:::warning
在继续之前，请确保 `filament/notifications` 已安装在你的项目中。可以通过运行以下命令检查：

```bash
composer show filament/notifications
```
如果尚未安装，请参考[安装指南](../introduction/installation#installing-the-individual-components)并按照说明配置**独立组件**。
:::

## 简介

要在你的应用中渲染通知，请确保在布局中渲染了 `notifications` Livewire 组件：

```blade
<div>
    @livewire('notifications')
</div>
```

现在，当从 Livewire 请求中[发送通知](../notifications)时，它将对用户可见。
