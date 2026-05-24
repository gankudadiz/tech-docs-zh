---
title: 集群
---

## 简介

集群是面板中的分层结构，允许你将[资源](../resources)和[自定义页面](custom-pages)组合在一起。它们对于将面板组织成逻辑部分很有用，并且可以帮助减小面板侧边栏的大小。

![带有子导航的集群页面](/assets/filament/v4.x/screenshots/images/light/panels/cluster.jpg)

使用集群时，会发生以下情况：

- 一个新的导航项会添加到导航中，它是集群中第一个资源或页面的链接。
- 资源或页面的各个导航项在主导航中不再可见。
- 每个集群中的资源或页面会添加一个新的子导航 UI，其中包含集群中资源或页面的导航项。
- 集群中的资源和页面会获得一个新的 URL，以集群名称为前缀。如果你正确生成了[资源](../resources#generating-urls-to-resource-pages)和[页面](custom-pages#生成页面-url)的 URL，那么此更改应该会自动为你处理。
- 集群的名称位于集群中所有资源和页面的面包屑中。点击它时，你会被带到集群中的第一个资源或页面。

## 创建集群

在创建第一个集群之前，你必须告诉面板集群类应该放在哪里。除了[配置](../panel-configuration)中的 `discoverResources()` 和 `discoverPages()` 方法外，你还可以使用 `discoverClusters()`：

```php
public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->discoverResources(in: app_path('Filament/Resources'), for: 'App\\Filament\\Resources')
        ->discoverPages(in: app_path('Filament/Pages'), for: 'App\\Filament\\Pages')
        ->discoverClusters(in: app_path('Filament/Clusters'), for: 'App\\Filament\\Clusters');
}
```

现在，你可以使用 `php artisan make:filament-cluster` 命令创建集群：

```bash
php artisan make:filament-cluster Settings
```

这将在 `app/Filament/Clusters` 目录中创建一个新的集群类：

```php
<?php

namespace App\Filament\Clusters\Settings;

use BackedEnum;
use Filament\Clusters\Cluster;
use Filament\Support\Icons\Heroicon;

class SettingsCluster extends Cluster
{
    protected static string | BackedEnum | null $navigationIcon = Heroicon::OutlinedSquares2x2;
}
```

[`$navigationIcon`](../navigation#customizing-a-navigation-items-icon) 属性默认定义，因为你很可能想要立即自定义它。所有其他[导航属性和方法](../navigation)也可用，包括 [`$navigationLabel`](../navigation#customizing-a-navigation-items-label)、[`$navigationSort`](../navigation#sorting-navigation-items) 和 [`$navigationGroup`](../navigation#grouping-navigation-items)。这些用于自定义集群的主导航项，方式与自定义资源或页面的项目相同。

## 向集群添加资源和页面

要向集群添加资源和页面，你只需在资源或页面类上定义 `$cluster` 属性，并将其设置为你[创建的](#创建集群)集群类：

```php
use App\Filament\Clusters\SettingsCluster;

protected static ?string $cluster = SettingsCluster::class;
```

## 使用集群的面板代码结构建议

使用集群时，建议你将所有资源和页面移动到与集群同名的目录中。例如，以下是使用名为 `Settings` 的集群的面板目录结构，其中包含一个 `ColorResource` 和两个自定义页面：

```
.
+-- Clusters
|   +-- Settings
|   |   +-- SettingsCluster.php
|   |   +-- Pages
|   |   |   +-- ManageBranding.php
|   |   |   +-- ManageNotifications.php
|   |   +-- Resources
|   |   |   +-- Colors
|   |   |   |   +-- ColorResource.php
|   |   |   |   +-- Pages
|   |   |   |   |   +-- CreateColor.php
|   |   |   |   |   +-- EditColor.php
|   |   |   |   |   +-- ListColors.php
```

这是一个建议，不是要求。你可以随意组织你的面板，只要集群中的资源和页面使用 [`$cluster`](#向集群添加资源和页面) 属性。这只是帮助你保持面板有序的建议。

当你的面板中存在集群时，如果你使用 `make:filament-resource` 或 `make:filament-page` 命令生成新的资源或页面，系统会询问你是否要在集群目录中创建它们，遵循这些准则。如果你选择这样做，Filament 还会为你将正确的 `$cluster` 属性分配给资源或页面类。如果你不这样做，你需要自己[定义 `$cluster` 属性](#向集群添加资源和页面)。

## 为集群中的所有页面设置子导航位置

默认情况下，子导航渲染在每个页面的开头。它可以按页面自定义，但你也可以通过设置 `$subNavigationPosition` 属性一次性为整个集群自定义。值可以是 `SubNavigationPosition::Start`、`SubNavigationPosition::End` 或 `SubNavigationPosition::Top`（将子导航渲染为标签页）：

```php
use Filament\Pages\Enums\SubNavigationPosition;

protected static ?SubNavigationPosition $subNavigationPosition = SubNavigationPosition::End;
```

![末尾子导航位置的集群](/assets/filament/v4.x/screenshots/images/light/panels/cluster-end.jpg)

`SubNavigationPosition::Top` 选项将子导航渲染为页面内容上方的标签页：

![顶部子导航位置的集群](/assets/filament/v4.x/screenshots/images/light/panels/cluster-top.jpg)

## 自定义集群面包屑

集群的名称位于集群中所有资源和页面的面包屑中。

你可以使用集群类中的 `$clusterBreadcrumb` 属性自定义面包屑名称：

```php
protected static ?string $clusterBreadcrumb = 'cluster';
```

或者，你可以使用 `getClusterBreadcrumb()` 定义动态面包屑名称：

```php
public static function getClusterBreadcrumb(): string
{
    return __('filament/clusters/cluster.name');
}
```

## 从集群中移除子导航

默认情况下，集群中的所有资源和页面都会显示子导航。如果你想从集群中的所有资源和页面中移除子导航，可以在集群类中将 `$shouldRegisterSubNavigation` 属性设置为 `false`：

```php
protected static bool $shouldRegisterSubNavigation = false;
```

或者，你可以重写 `shouldRegisterSubNavigation()` 方法来定义动态行为：

```php
public static function shouldRegisterSubNavigation(): bool
{
    return FeatureFlag::active();
}
```
