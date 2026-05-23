---
title: 在 Blade 视图中渲染小部件
---

:::warning
在继续之前，请确保 `filament/widgets` 已安装在你的项目中。可以通过运行以下命令检查：

```bash
composer show filament/widgets
```
如果尚未安装，请参考[安装指南](../introduction/installation#installing-the-individual-components)并按照说明配置**独立组件**。
:::

## 创建小部件

使用 `make:filament-widget` 命令生成新的小部件。有关自定义和使用的详细信息，请参阅[小部件部分](../widgets)。

## 添加小部件

由于小部件是 Livewire 组件，你可以使用 `@livewire` 指令在任何 Blade 视图中轻松渲染小部件：

```blade
<div>
    @livewire(\App\Livewire\Dashboard\PostsChart::class)
</div>
```

:::info
如果你正在使用[表格小部件](../widgets/overview#table-widgets)，请确保也安装了 `filament/tables`。
请参考[安装指南](../introduction/installation#installing-the-individual-components)并按照步骤正确配置**独立组件**。
:::
