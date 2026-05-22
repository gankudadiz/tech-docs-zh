---
title: 导航
---

## 简介

默认情况下，Filament 会为你的每个[资源](../resources/overview)、[自定义页面](custom-pages)和[集群](clusters)注册导航项。这些类包含静态属性和方法，你可以重写它们来配置对应的导航项。

如果你想为应用添加第二层导航，可以使用[集群](clusters)。集群非常适合将资源和页面分组在一起。

## 自定义导航项的标签

默认情况下，导航标签是根据资源或页面的名称自动生成的。你可以使用 `$navigationLabel` 属性来自定义：

```php
protected static ?string $navigationLabel = 'Custom Navigation Label';
```

或者，你可以重写 `getNavigationLabel()` 方法：

```php
public static function getNavigationLabel(): string
{
    return 'Custom Navigation Label';
}
```

## 自定义导航项的图标

要自定义导航项的[图标](../styling/icons)，你可以在[资源](../resources/overview)或[页面](custom-pages)类中重写 `$navigationIcon` 属性：

```php
use BackedEnum;
use Filament\Support\Icons\Heroicon;

protected static string | BackedEnum | null $navigationIcon = Heroicon::OutlinedDocumentText;
```

![已更改的导航项图标](/assets/filament/v4.x/screenshots/images/light/panels/navigation/change-icon.jpg)

如果你在同一导航组内的所有项目上设置 `$navigationIcon = null`，这些项目将在组标签下方用竖线连接。

### 导航项激活时切换图标

你可以使用 `$activeNavigationIcon` 属性为激活状态的导航项指定一个不同的[图标](../styling/icons)：

```php
use BackedEnum;
use Filament\Support\Icons\Heroicon;

protected static string | BackedEnum | null $activeNavigationIcon = Heroicon::OutlinedDocumentText;
```

![激活时显示不同的导航项图标](/assets/filament/v4.x/screenshots/images/light/panels/navigation/active-icon.jpg)

## 排序导航项

默认情况下，导航项按字母顺序排列。你可以使用 `$navigationSort` 属性来自定义排序：

```php
protected static ?int $navigationSort = 3;
```

现在，排序值较小的导航项将排在排序值较大的导航项之前——排序方式为升序。

![排序导航项](/assets/filament/v4.x/screenshots/images/light/panels/navigation/sort-items.jpg)

## 为导航项添加徽章

要在导航项旁边添加徽章，你可以使用 `getNavigationBadge()` 方法并返回徽章的内容：

```php
public static function getNavigationBadge(): ?string
{
    return static::getModel()::count();
}
```

![带徽章的导航项](/assets/filament/v4.x/screenshots/images/light/panels/navigation/badge.jpg)

如果 `getNavigationBadge()` 返回了徽章值，默认会使用主色调显示。要上下文化地设置徽章样式，可以从 `getNavigationBadgeColor()` 方法返回 `danger`、`gray`、`info`、`primary`、`success` 或 `warning`：

```php
public static function getNavigationBadgeColor(): ?string
{
    return static::getModel()::count() > 10 ? 'warning' : 'primary';
}
```

![带徽章颜色的导航项](/assets/filament/v4.x/screenshots/images/light/panels/navigation/badge-color.jpg)

可以在 `$navigationBadgeTooltip` 中为导航徽章设置自定义提示：

```php
protected static ?string $navigationBadgeTooltip = 'The number of users';
```

也可以从 `getNavigationBadgeTooltip()` 返回：

```php
public static function getNavigationBadgeTooltip(): ?string
{
    return 'The number of users';
}
```

![带徽章提示的导航项](/assets/filament/v4.x/screenshots/images/light/panels/navigation/badge-tooltip.jpg)

## 分组导航项

你可以通过在[资源](../resources/overview)和[自定义页面](custom-pages)上指定 `$navigationGroup` 属性来对导航项进行分组：

```php
use UnitEnum;

protected static string | UnitEnum | null $navigationGroup = 'Settings';
```

![分组的导航项](/assets/filament/v4.x/screenshots/images/light/panels/navigation/group.jpg)

同一导航组中的所有项目将在相同的组标签下一起显示，此处为 "Settings"。未分组的项目将保留在导航的开头。

### 将导航项归入其他项目下

你可以通过将父项的标签作为 `$navigationParentItem` 传递，将导航项归入其他项目的子级：

```php
use UnitEnum;

protected static ?string $navigationParentItem = 'Notifications';

protected static string | UnitEnum | null $navigationGroup = 'Settings';
```

你也可以使用 `getNavigationParentItem()` 方法设置动态父项标签：

```php
public static function getNavigationParentItem(): ?string
{
    return __('filament/navigation.groups.settings.items.notifications');
}
```

如上所示，如果父项有导航组，则该导航组也必须定义，这样才能正确识别父项。

:::tip
如果你需要这样的第三层导航，应该考虑改用[集群](clusters)，集群是资源和自定义页面的逻辑分组，可以共享自己的独立导航。
:::

### 自定义导航组

你可以在[配置](../panel-configuration)中调用 `navigationGroups()` 方法，并按顺序传入 `NavigationGroup` 对象来自定义导航组：

```php
use Filament\Navigation\NavigationGroup;
use Filament\Panel;
use Filament\Support\Icons\Heroicon;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->navigationGroups([
            NavigationGroup::make()
                 ->label('Shop')
                 ->icon(Heroicon::OutlinedShoppingCart),
            NavigationGroup::make()
                ->label('Blog')
                ->icon(Heroicon::OutlinedPencil),
            NavigationGroup::make()
                ->label(fn (): string => __('navigation.settings'))
                ->icon(Heroicon::OutlinedCog6Tooth)
                ->collapsed(),
        ]);
}
```

在此示例中，我们为组传入了自定义的 `icon()`，并使一个组默认 `collapsed()`。

#### 排序导航组

通过使用 `navigationGroups()`，你定义了导航组的新顺序。如果你只想重新排列组的顺序而不定义完整的 `NavigationGroup` 对象，可以只按新顺序传入组的标签：

```php
$panel
    ->navigationGroups([
        'Shop',
        'Blog',
        'Settings',
    ])
```

#### 使导航组不可折叠

默认情况下，导航组是可折叠的。

![可折叠的导航组](/assets/filament/v4.x/screenshots/images/light/panels/navigation/group-collapsible.jpg)

你可以通过在 `NavigationGroup` 对象上调用 `collapsible(false)` 来禁用此行为：

```php
use Filament\Navigation\NavigationGroup;
use Filament\Support\Icons\Heroicon;

NavigationGroup::make()
    ->label('Settings')
    ->icon(Heroicon::OutlinedCog6Tooth)
    ->collapsible(false);
```

![不可折叠的导航组](/assets/filament/v4.x/screenshots/images/light/panels/navigation/group-not-collapsible.jpg)

或者，你可以在[配置](../panel-configuration)中对所有组全局设置：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->collapsibleNavigationGroups(false);
}
```

#### 为导航组添加额外的 HTML 属性

你可以为导航组传递额外的 HTML 属性，这些属性将合并到外部 DOM 元素上。将属性数组传递给 `extraSidebarAttributes()` 或 `extraTopbarAttributes()` 方法，其中键是属性名，值是属性值：

```php
NavigationGroup::make()
    ->extraSidebarAttributes(['class' => 'featured-sidebar-group']),
    ->extraTopbarAttributes(['class' => 'featured-topbar-group']),
```

`extraSidebarAttributes()` 将应用于侧边栏中包含的导航组元素，而 `extraTopbarAttributes()` 仅在使用[顶部导航](#使用顶部导航)时应用于顶部导航栏的导航组下拉菜单。

### 使用枚举注册导航组

你可以使用枚举类来注册导航组，这样可以在一个地方控制它们的标签、图标和顺序，而无需在[配置](../panel-configuration)中注册。

为此，你可以创建一个枚举类，为每个组定义一个 case：

```php
enum NavigationGroup
{
    case Shop;
    
    case Blog;
    
    case Settings;
}
```

case 定义的顺序将控制导航组的顺序。

要为资源或自定义页面使用枚举导航组，可以将 `$navigationGroup` 属性设置为枚举 case：

```php
protected static string | UnitEnum | null $navigationGroup = NavigationGroup::Shop;
```

你还可以在枚举类上实现 `HasLabel` 接口，为每个组定义自定义标签：

```php
use Filament\Support\Contracts\HasLabel;

enum NavigationGroup implements HasLabel
{
    case Shop;
    
    case Blog;
    
    case Settings;

    public function getLabel(): string
    {
        return match ($this) {
            self::Shop => __('navigation-groups.shop'),
            self::Blog => __('navigation-groups.blog'),
            self::Settings => __('navigation-groups.settings'),
        };
    }
}
```

你还可以在枚举类上实现 `HasIcon` 接口，为每个组定义自定义图标：

```php
use BackedEnum;
use Filament\Support\Contracts\HasIcon;
use Filament\Support\Icons\Heroicon;
use Illuminate\Contracts\Support\Htmlable;

enum NavigationGroup implements HasIcon
{
    case Shop;
    
    case Blog;
    
    case Settings;

    public function getIcon(): string | BackedEnum | Htmlable | null
    {
        return match ($this) {
            self::Shop => Heroicon::OutlinedShoppingCart,
            self::Blog => Heroicon::OutlinedPencil,
            self::Settings => Heroicon::OutlinedCog6Tooth,
        };
    }
}
```

## 在桌面端可折叠的侧边栏

要使侧边栏在桌面端和移动端都可折叠，你可以在[配置](../panel-configuration)中使用：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->sidebarCollapsibleOnDesktop();
}
```

![桌面端可折叠的侧边栏](/assets/filament/v4.x/screenshots/images/light/panels/navigation/sidebar-collapsible-on-desktop.jpg)

默认情况下，在桌面端折叠侧边栏时，导航图标仍然显示。你可以使用 `sidebarFullyCollapsibleOnDesktop()` 方法完全折叠侧边栏：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->sidebarFullyCollapsibleOnDesktop();
}
```

![桌面端完全可折叠的侧边栏](/assets/filament/v4.x/screenshots/images/light/panels/navigation/sidebar-fully-collapsible-on-desktop.jpg)

### 桌面端可折叠侧边栏中的导航组

:::info
本节仅适用于 `sidebarCollapsibleOnDesktop()`，不适用于 `sidebarFullyCollapsibleOnDesktop()`，因为完全可折叠的 UI 只是隐藏整个侧边栏，而不是改变其设计。
:::

在桌面端使用可折叠侧边栏时，你通常也会使用[导航组](#分组导航项)。默认情况下，当侧边栏折叠时，每个导航组的标签将被隐藏，因为没有足够的空间显示它们。即使导航组本身是[可折叠的](#使导航组不可折叠)，所有项目在折叠的侧边栏中仍然可见，因为没有组标签可以点击来展开组。

这些问题可以通过[为导航组对象传入 `icon()`](#自定义导航组) 来解决，从而实现非常简约的侧边栏设计。当定义了图标时，图标将始终显示在折叠的侧边栏中，而不是显示项目。当点击图标时，将在图标旁边打开一个下拉菜单，显示组中的项目。

当为导航组传入图标时，即使项目也有图标，展开的侧边栏 UI 也不会显示项目图标。这是为了保持导航层次结构清晰和设计简约。但是，项目图标会在折叠侧边栏的下拉菜单中显示，因为从下拉菜单已打开的事实来看，层次结构已经很清晰了。

![带导航组图标的可折叠侧边栏](/assets/filament/v4.x/screenshots/images/light/panels/navigation/sidebar-collapsible-with-group-icons.jpg)

## 注册自定义导航项

要注册新的导航项，你可以在[配置](../panel-configuration)中使用：

```php
use Filament\Navigation\NavigationItem;
use Filament\Pages\Dashboard;
use Filament\Panel;
use Filament\Support\Icons\Heroicon;
use function Filament\Support\original_request;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->navigationItems([
            NavigationItem::make('Analytics')
                ->url('https://filament.pirsch.io', shouldOpenInNewTab: true)
                ->icon(Heroicon::OutlinedPresentationChartLine)
                ->group('Reports')
                ->sort(3),
            NavigationItem::make('dashboard')
                ->label(fn (): string => __('filament-panels::pages/dashboard.title'))
                ->url(fn (): string => Dashboard::getUrl())
                ->isActiveWhen(fn () => original_request()->routeIs('filament.admin.pages.dashboard')),
            // ...
        ]);
}
```

## 条件隐藏导航项

你还可以通过使用 `visible()` 或 `hidden()` 方法并传入要检查的条件来条件隐藏导航项：

```php
use Filament\Navigation\NavigationItem;

NavigationItem::make('Analytics')
    ->visible(fn(): bool => auth()->user()->can('view-analytics'))
    // or
    ->hidden(fn(): bool => ! auth()->user()->can('view-analytics')),
```

## 禁用资源或页面导航项

要防止资源或页面出现在导航中，你可以使用：

```php
protected static bool $shouldRegisterNavigation = false;
```

或者，你可以重写 `shouldRegisterNavigation()` 方法：

```php
public static function shouldRegisterNavigation(): bool
{
    return false;
}
```

请注意，这些方法不控制对资源或页面的直接访问。它们仅控制资源或页面是否会在导航中显示。如果你想同时控制访问权限，则应使用[资源授权](../resources#authorization)或[页面授权](custom-pages#authorization)。

## 使用顶部导航

默认情况下，Filament 使用侧边栏导航。你可以在[配置](../panel-configuration)中改用顶部导航：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->topNavigation();
}
```

![顶部导航](/assets/filament/v4.x/screenshots/images/light/panels/navigation/top-navigation.jpg)

## 自定义侧边栏宽度

你可以通过在[配置](../panel-configuration)中传入 `sidebarWidth()` 方法来自定义侧边栏宽度：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->sidebarWidth('40rem');
}
```

![自定义侧边栏宽度的面板](/assets/filament/v4.x/screenshots/images/light/panels/styling/sidebar-width.jpg)

此外，如果你使用 `sidebarCollapsibleOnDesktop()` 方法，可以在[配置](../panel-configuration)中使用 `collapsedSidebarWidth()` 方法自定义折叠图标的宽度：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->sidebarCollapsibleOnDesktop()
        ->collapsedSidebarWidth('9rem');
}
```

## 高级导航自定义

`navigation()` 方法可以从[配置](../panel-configuration)中调用。它允许你构建自定义导航来覆盖 Filament 自动生成的项目。此 API 旨在让你完全控制导航。

### 注册自定义导航项

要注册导航项，请调用 `items()` 方法：

```php
use App\Filament\Pages\Settings;
use App\Filament\Resources\Users\UserResource;
use Filament\Navigation\NavigationBuilder;
use Filament\Navigation\NavigationItem;
use Filament\Pages\Dashboard;
use Filament\Panel;
use Filament\Support\Icons\Heroicon;
use function Filament\Support\original_request;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->navigation(function (NavigationBuilder $builder): NavigationBuilder {
            return $builder->items([
                NavigationItem::make('Dashboard')
                    ->icon(Heroicon::OutlinedHome)
                    ->isActiveWhen(fn (): bool => original_request()->routeIs('filament.admin.pages.dashboard'))
                    ->url(fn (): string => Dashboard::getUrl()),
                ...UserResource::getNavigationItems(),
                ...Settings::getNavigationItems(),
            ]);
        });
}
```

![自定义导航项](/assets/filament/v4.x/screenshots/images/light/panels/navigation/custom-items.jpg)

### 注册自定义导航组

如果你想注册组，可以调用 `groups()` 方法：

```php
use App\Filament\Pages\HomePageSettings;
use App\Filament\Resources\Categories\CategoryResource;
use App\Filament\Resources\Pages\PageResource;
use Filament\Navigation\NavigationBuilder;
use Filament\Navigation\NavigationGroup;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->navigation(function (NavigationBuilder $builder): NavigationBuilder {
            return $builder->groups([
                NavigationGroup::make('Website')
                    ->items([
                        ...PageResource::getNavigationItems(),
                        ...CategoryResource::getNavigationItems(),
                        ...HomePageSettings::getNavigationItems(),
                    ]),
            ]);
        });
}
```

### 禁用导航

你可以通过向 `navigation()` 方法传入 `false` 来完全禁用导航：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->navigation(false);
}
```

![已禁用的导航侧边栏](/assets/filament/v4.x/screenshots/images/light/panels/navigation/disabled-navigation.jpg)

或者，你可以传入一个返回布尔值的闭包来动态决定。返回 `false` 会隐藏导航，而返回 `true` 会渲染默认的自动发现导航项。这对于入职或设置向导等流程很有用，只有当用户达到特定状态后导航才会出现：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->navigation(fn (): bool => auth()->user()->hasCompletedOnboarding());
}
```

### 禁用顶部导航栏

你可以通过向 `topbar()` 方法传入 `false` 来完全禁用顶部导航栏：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->topbar(false);
}
```

### 替换侧边栏和顶部导航栏的 Livewire 组件

你可以完全替换用于渲染侧边栏和顶部导航栏的 Livewire 组件，将你自己的 Livewire 组件类名传入 `sidebarLivewireComponent()` 或 `topbarLivewireComponent()` 方法：

```php
use App\Livewire\Sidebar;
use App\Livewire\Topbar;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->sidebarLivewireComponent(Sidebar::class)
        ->topbarLivewireComponent(Topbar::class);
}
```

## 禁用面包屑导航

默认布局会显示面包屑导航，以指示当前页面在应用层次结构中的位置。

你可以在[配置](../panel-configuration)中禁用面包屑导航：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->breadcrumbs(false);
}
```

## 重新加载侧边栏和顶部导航栏

一旦面板中的页面加载完成，侧边栏和顶部导航栏就不会重新加载，直到你导航离开该页面，或者点击菜单项触发操作。你可以通过派发 `refresh-sidebar` 或 `refresh-topbar` 浏览器事件来手动重新加载这些组件以更新它们。

要从 PHP 派发事件，你可以从任何 Livewire 组件（如页面类、关系管理器类或小部件类）调用 `$this->dispatch()` 方法：

```php
$this->dispatch('refresh-sidebar');
```

当你的代码不在 Livewire 组件内时，例如在自定义操作类中，你可以将 `$livewire` 参数注入到闭包函数中，并在其上调用 `dispatch()`：

```php
use Filament\Actions\Action;
use Livewire\Component;

Action::make('create')
    ->action(function (Component $livewire) {
        // ...
    
        $livewire->dispatch('refresh-sidebar');
    })
```

或者，你可以使用 Alpine.js 的 `$dispatch()` 辅助方法或原生浏览器的 `window.dispatchEvent()` 方法从 JavaScript 派发事件：

```html
<button x-on:click="$dispatch('refresh-sidebar')" type="button">
    Refresh Sidebar
</button>
```

```javascript
window.dispatchEvent(new CustomEvent('refresh-sidebar'));
```
