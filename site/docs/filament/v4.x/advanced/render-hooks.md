---
title: 渲染钩子
---

## 简介

Filament 允许你在框架视图的各个位置渲染 Blade 内容。这对插件来说非常有用，可以将 HTML 注入到框架中。此外，由于 Filament 不建议发布视图（因为会增加破坏性变更的风险），这对用户也很有用。

## 注册渲染钩子

要注册渲染钩子，你可以在服务提供者或中间件中调用 `FilamentView::registerRenderHook()`。第一个参数是渲染钩子的名称，第二个参数是返回要渲染内容的回调：

```php
use Filament\Support\Facades\FilamentView;
use Filament\View\PanelsRenderHook;
use Illuminate\Support\Facades\Blade;

FilamentView::registerRenderHook(
    PanelsRenderHook::BODY_START,
    fn (): string => Blade::render('@livewire(\'livewire-ui-modal\')'),
);
```

你也可以从文件渲染视图内容：

```php
use Filament\Support\Facades\FilamentView;
use Filament\View\PanelsRenderHook;
use Illuminate\Contracts\View\View;

FilamentView::registerRenderHook(
    PanelsRenderHook::BODY_START,
    fn (): View => view('impersonation-banner'),
);
```

## 可用的渲染钩子

### Panel Builder 渲染钩子

```php
use Filament\View\PanelsRenderHook;
```

- `PanelsRenderHook::AUTH_LOGIN_FORM_AFTER` - 登录表单之后
- `PanelsRenderHook::AUTH_LOGIN_FORM_BEFORE` - 登录表单之前
- `PanelsRenderHook::AUTH_PASSWORD_RESET_REQUEST_FORM_AFTER` - 密码重置请求表单之后
- `PanelsRenderHook::AUTH_PASSWORD_RESET_REQUEST_FORM_BEFORE` - 密码重置请求表单之前
- `PanelsRenderHook::AUTH_PASSWORD_RESET_RESET_FORM_AFTER` - 密码重置表单之后
- `PanelsRenderHook::AUTH_PASSWORD_RESET_RESET_FORM_BEFORE` - 密码重置表单之前
- `PanelsRenderHook::AUTH_REGISTER_FORM_AFTER` - 注册表单之后
- `PanelsRenderHook::AUTH_REGISTER_FORM_BEFORE` - 注册表单之前
- `PanelsRenderHook::BODY_END` - `</body>` 之前
- `PanelsRenderHook::BODY_START` - `<body>` 之后
- `PanelsRenderHook::CONTENT_AFTER` - 页面内容之后
- `PanelsRenderHook::CONTENT_BEFORE` - 页面内容之前
- `PanelsRenderHook::CONTENT_END` - 页面内容之后，`<main>` 内部
- `PanelsRenderHook::CONTENT_START` - 页面内容之前，`<main>` 内部
- `PanelsRenderHook::FOOTER` - 页脚
- `PanelsRenderHook::GLOBAL_SEARCH_AFTER` - [全局搜索](../resources/global-search)容器之后，顶栏内部
- `PanelsRenderHook::GLOBAL_SEARCH_BEFORE` - [全局搜索](../resources/global-search)容器之前，顶栏内部
- `PanelsRenderHook::GLOBAL_SEARCH_END` - [全局搜索](../resources/global-search)容器末尾
- `PanelsRenderHook::GLOBAL_SEARCH_START` - [全局搜索](../resources/global-search)容器开头
- `PanelsRenderHook::HEAD_END` - `</head>` 之前
- `PanelsRenderHook::HEAD_START` - `<head>` 之后
- `PanelsRenderHook::LAYOUT_END` - 布局容器末尾，也可以[限定范围](#限定渲染钩子范围)到页面类
- `PanelsRenderHook::LAYOUT_START` - 布局容器开头，也可以[限定范围](#限定渲染钩子范围)到页面类
- `PanelsRenderHook::PAGE_END` - 页面内容容器末尾，也可以[限定范围](#限定渲染钩子范围)到页面或资源类
- `PanelsRenderHook::PAGE_FOOTER_WIDGETS_AFTER` - 页面底部小部件之后，也可以[限定范围](#限定渲染钩子范围)到页面或资源类
- `PanelsRenderHook::PAGE_FOOTER_WIDGETS_BEFORE` - 页面底部小部件之前，也可以[限定范围](#限定渲染钩子范围)到页面或资源类
- `PanelsRenderHook::PAGE_FOOTER_WIDGETS_END` - 页面底部小部件末尾，也可以[限定范围](#限定渲染钩子范围)到页面或资源类
- `PanelsRenderHook::PAGE_FOOTER_WIDGETS_START` - 页面底部小部件开头，也可以[限定范围](#限定渲染钩子范围)到页面或资源类
- `PanelsRenderHook::PAGE_HEADER_ACTIONS_AFTER` - 页面头部操作之后，也可以[限定范围](#限定渲染钩子范围)到页面或资源类
- `PanelsRenderHook::PAGE_HEADER_ACTIONS_BEFORE` - 页面头部操作之前，也可以[限定范围](#限定渲染钩子范围)到页面或资源类
- `PanelsRenderHook::PAGE_HEADER_HEADING_AFTER` - 页面标题之后，也可以[限定范围](#限定渲染钩子范围)到页面或资源类
- `PanelsRenderHook::PAGE_HEADER_HEADING_BEFORE` - 页面标题之前，也可以[限定范围](#限定渲染钩子范围)到页面或资源类
- `PanelsRenderHook::PAGE_HEADER_WIDGETS_AFTER` - 页面头部小部件之后，也可以[限定范围](#限定渲染钩子范围)到页面或资源类
- `PanelsRenderHook::PAGE_HEADER_WIDGETS_BEFORE` - 页面头部小部件之前，也可以[限定范围](#限定渲染钩子范围)到页面或资源类
- `PanelsRenderHook::PAGE_HEADER_WIDGETS_END` - 页面头部小部件末尾，也可以[限定范围](#限定渲染钩子范围)到页面或资源类
- `PanelsRenderHook::PAGE_HEADER_WIDGETS_START` - 页面头部小部件开头，也可以[限定范围](#限定渲染钩子范围)到页面或资源类
- `PanelsRenderHook::PAGE_START` - 页面内容容器开头，也可以[限定范围](#限定渲染钩子范围)到页面或资源类
- `PanelsRenderHook::PAGE_SUB_NAVIGATION_END_AFTER` - 页面子导航"结束"侧边栏位置之后，也可以[限定范围](#限定渲染钩子范围)到页面或资源类
- `PanelsRenderHook::PAGE_SUB_NAVIGATION_END_BEFORE` - 页面子导航"结束"侧边栏位置之前，也可以[限定范围](#限定渲染钩子范围)到页面或资源类
- `PanelsRenderHook::PAGE_SUB_NAVIGATION_SELECT_AFTER` - 页面子导航选择器（移动端）之后，也可以[限定范围](#限定渲染钩子范围)到页面或资源类
- `PanelsRenderHook::PAGE_SUB_NAVIGATION_SELECT_BEFORE` - 页面子导航选择器（移动端）之前，也可以[限定范围](#限定渲染钩子范围)到页面或资源类
- `PanelsRenderHook::PAGE_SUB_NAVIGATION_SIDEBAR_AFTER` - 页面子导航侧边栏之后，也可以[限定范围](#限定渲染钩子范围)到页面或资源类
- `PanelsRenderHook::PAGE_SUB_NAVIGATION_SIDEBAR_BEFORE` - 页面子导航侧边栏之前，也可以[限定范围](#限定渲染钩子范围)到页面或资源类
- `PanelsRenderHook::PAGE_SUB_NAVIGATION_START_AFTER` - 页面子导航"开始"侧边栏位置之后，也可以[限定范围](#限定渲染钩子范围)到页面或资源类
- `PanelsRenderHook::PAGE_SUB_NAVIGATION_START_BEFORE` - 页面子导航"开始"侧边栏位置之前，也可以[限定范围](#限定渲染钩子范围)到页面或资源类
- `PanelsRenderHook::PAGE_SUB_NAVIGATION_TOP_AFTER` - 页面子导航"顶部"标签页位置之后，也可以[限定范围](#限定渲染钩子范围)到页面或资源类
- `PanelsRenderHook::PAGE_SUB_NAVIGATION_TOP_BEFORE` - 页面子导航"顶部"标签页位置之前，也可以[限定范围](#限定渲染钩子范围)到页面或资源类
- `PanelsRenderHook::RESOURCE_PAGES_LIST_RECORDS_TABLE_AFTER` - 资源表格之后，也可以[限定范围](#限定渲染钩子范围)到页面或资源类
- `PanelsRenderHook::RESOURCE_PAGES_LIST_RECORDS_TABLE_BEFORE` - 资源表格之前，也可以[限定范围](#限定渲染钩子范围)到页面或资源类
- `PanelsRenderHook::RESOURCE_PAGES_LIST_RECORDS_TABS_END` - 过滤标签页末尾（最后一个标签之后），也可以[限定范围](#限定渲染钩子范围)到页面或资源类
- `PanelsRenderHook::RESOURCE_PAGES_LIST_RECORDS_TABS_START` - 过滤标签页开头（第一个标签之前），也可以[限定范围](#限定渲染钩子范围)到页面或资源类
- `PanelsRenderHook::RESOURCE_PAGES_MANAGE_RELATED_RECORDS_TABLE_AFTER` - 关联管理器表格之后，也可以[限定范围](#限定渲染钩子范围)到页面或资源类
- `PanelsRenderHook::RESOURCE_PAGES_MANAGE_RELATED_RECORDS_TABLE_BEFORE` - 关联管理器表格之前，也可以[限定范围](#限定渲染钩子范围)到页面或资源类
- `PanelsRenderHook::RESOURCE_RELATION_MANAGER_AFTER` - 关联管理器表格之后，也可以[限定范围](#限定渲染钩子范围)到页面或关联管理器类
- `PanelsRenderHook::RESOURCE_RELATION_MANAGER_BEFORE` - 关联管理器表格之前，也可以[限定范围](#限定渲染钩子范围)到页面或关联管理器类
- `PanelsRenderHook::RESOURCE_TABS_END` - 资源标签页末尾（最后一个标签之后），也可以[限定范围](#限定渲染钩子范围)到页面或资源类
- `PanelsRenderHook::RESOURCE_TABS_START` - 资源标签页开头（第一个标签之前），也可以[限定范围](#限定渲染钩子范围)到页面或资源类
- `PanelsRenderHook::SCRIPTS_AFTER` - 脚本定义之后
- `PanelsRenderHook::SCRIPTS_BEFORE` - 脚本定义之前
- `PanelsRenderHook::SIDEBAR_LOGO_AFTER` - 侧边栏 Logo 之后
- `PanelsRenderHook::SIDEBAR_LOGO_BEFORE` - 侧边栏 Logo 之前
- `PanelsRenderHook::SIDEBAR_NAV_END` - [侧边栏](../navigation)中，`</nav>` 之前
- `PanelsRenderHook::SIDEBAR_NAV_START` - [侧边栏](../navigation)中，`<nav>` 之后
- `PanelsRenderHook::SIMPLE_LAYOUT_END` - 简单布局容器末尾，也可以[限定范围](#限定渲染钩子范围)到页面类
- `PanelsRenderHook::SIMPLE_LAYOUT_START` - 简单布局容器开头，也可以[限定范围](#限定渲染钩子范围)到页面类
- `PanelsRenderHook::SIMPLE_PAGE_END` - 简单页面内容容器末尾，也可以[限定范围](#限定渲染钩子范围)到页面类
- `PanelsRenderHook::SIMPLE_PAGE_START` - 简单页面内容容器开头，也可以[限定范围](#限定渲染钩子范围)到页面类
- `PanelsRenderHook::SIDEBAR_FOOTER` - 固定在侧边栏底部，内容下方
- `PanelsRenderHook::SIDEBAR_START` - 侧边栏容器开头
- `PanelsRenderHook::STYLES_AFTER` - 样式定义之后
- `PanelsRenderHook::STYLES_BEFORE` - 样式定义之前
- `PanelsRenderHook::TENANT_MENU_AFTER` - [租户菜单](../users/tenancy#自定义租户菜单)之后
- `PanelsRenderHook::TENANT_MENU_BEFORE` - [租户菜单](../users/tenancy#自定义租户菜单)之前
- `PanelsRenderHook::TOPBAR_AFTER` - 顶栏下方
- `PanelsRenderHook::TOPBAR_BEFORE` - 顶栏上方
- `PanelsRenderHook::TOPBAR_END` - 顶栏容器末尾
- `PanelsRenderHook::TOPBAR_LOGO_AFTER` - 顶栏 Logo 之后
- `PanelsRenderHook::TOPBAR_LOGO_BEFORE` - 顶栏 Logo 之前
- `PanelsRenderHook::TOPBAR_START` - 顶栏容器开头
- `PanelsRenderHook::USER_MENU_AFTER` - [用户菜单](../navigation/user-menu)之后
- `PanelsRenderHook::USER_MENU_BEFORE` - [用户菜单](../navigation/user-menu)之前
- `PanelsRenderHook::USER_MENU_PROFILE_AFTER` - [用户菜单](../navigation/user-menu)中个人资料项之后
- `PanelsRenderHook::USER_MENU_PROFILE_BEFORE` - [用户菜单](../navigation/user-menu)中个人资料项之前


### Table Builder 渲染钩子

所有这些渲染钩子都可以[限定范围](#限定渲染钩子范围)到任何表格 Livewire 组件类。使用 Panel Builder 时，这些类可能是资源的 List 或 Manage 页面，或关联管理器。表格小部件也是 Livewire 组件类。

```php
use Filament\Tables\View\TablesRenderHook;
```

- `TablesRenderHook::FILTER_INDICATORS` - 替换现有的过滤指示器，接收 `filterIndicators` 数据作为 `array<Filament\Tables\Filters\Indicator>`
- `TablesRenderHook::HEADER_CELL` - 替换现有的表头单元格，接收 `Filament\Tables\Columns\Column` 对象作为 `column` 和数据中的 `isReordering`
- `TablesRenderHook::SELECTION_INDICATOR_ACTIONS_AFTER` - 选择指示栏中"全选"和"取消全选"操作按钮之后
- `TablesRenderHook::SELECTION_INDICATOR_ACTIONS_BEFORE` - 选择指示栏中"全选"和"取消全选"操作按钮之前
- `TablesRenderHook::HEADER_AFTER` - 表头容器之后
- `TablesRenderHook::HEADER_BEFORE` - 表头容器之前
- `TablesRenderHook::TOOLBAR_AFTER` - 工具栏容器之后
- `TablesRenderHook::TOOLBAR_BEFORE` - 工具栏容器之前
- `TablesRenderHook::TOOLBAR_END` - 工具栏末尾
- `TablesRenderHook::TOOLBAR_GROUPING_SELECTOR_AFTER` - [分组](../tables/grouping)选择器之后
- `TablesRenderHook::TOOLBAR_GROUPING_SELECTOR_BEFORE` - [分组](../tables/grouping)选择器之前
- `TablesRenderHook::TOOLBAR_REORDER_TRIGGER_AFTER` - [重排序](../tables/overview#重新排序记录)触发器之后
- `TablesRenderHook::TOOLBAR_REORDER_TRIGGER_BEFORE` - [重排序](../tables/overview#重新排序记录)触发器之前
- `TablesRenderHook::TOOLBAR_SEARCH_AFTER` - [搜索](../tables/overview#使列可排序和可搜索)容器之后
- `TablesRenderHook::TOOLBAR_SEARCH_BEFORE` - [搜索](../tables/overview#使列可排序和可搜索)容器之前
- `TablesRenderHook::TOOLBAR_START` - 工具栏开头
- `TablesRenderHook::TOOLBAR_COLUMN_MANAGER_TRIGGER_AFTER` - [列管理器](../tables/columns/overview#切换列可见性)触发器之后
- `TablesRenderHook::TOOLBAR_COLUMN_MANAGER_TRIGGER_BEFORE` - [列管理器](../tables/columns/overview#切换列可见性)触发器之前


### Actions 渲染钩子

所有这些渲染钩子都可以[限定范围](#限定渲染钩子范围)到任何 Livewire 组件类。使用 Panel Builder 时，这些类可能是资源的 List 或 Manage 页面，或关联管理器。

在这种情况下，仅限定范围通常不够，因为 Livewire 组件可以有多个操作，所以你可以通过 `action` 数据访问 `Filament\Actions\Action` 来在所有这些渲染钩子中标识特定的操作。

```php
use Filament\Actions\View\ActionsRenderHook;
```

- `ActionsRenderHook::MODAL_CUSTOM_CONTENT_AFTER` - [模态框内容](../actions/modals#自定义模态框内容)之后
- `ActionsRenderHook::MODAL_CUSTOM_CONTENT_BEFORE` - [模态框内容](../actions/modals#自定义模态框内容)之前
- `ActionsRenderHook::MODAL_CUSTOM_CONTENT_FOOTER_AFTER` - [模态框内容页脚](../actions/modals#在表单下方添加自定义模态框内容)之后
- `ActionsRenderHook::MODAL_CUSTOM_CONTENT_FOOTER_BEFORE` - [模态框内容页脚](../actions/modals#在表单下方添加自定义模态框内容)之前
- `ActionsRenderHook::MODAL_SCHEMA_AFTER` - [模态框 Schema](../actions/modals#在模态框中渲染-schema)之后
- `ActionsRenderHook::MODAL_SCHEMA_BEFORE` - [模态框 Schema](../actions/modals#在模态框中渲染-schema)之前


### Widgets 渲染钩子

```php
use Filament\Widgets\View\WidgetsRenderHook;
```

- `WidgetsRenderHook::TABLE_WIDGET_END` - [表格小部件](../widgets/overview#表格小部件)末尾，表格本身之后，也可以[限定范围](#限定渲染钩子范围)到表格小部件类
- `WidgetsRenderHook::TABLE_WIDGET_START` - [表格小部件](../widgets/overview#表格小部件)开头，表格本身之前，也可以[限定范围](#限定渲染钩子范围)到表格小部件类


## 限定渲染钩子范围

某些渲染钩子可以设置"范围"，使其仅在特定页面或 Livewire 组件上输出。例如，你可能想仅为 1 个页面注册渲染钩子。为此，你可以将页面或组件的类作为第二个参数传给 `registerRenderHook()`：

```php
use Filament\Support\Facades\FilamentView;
use Filament\View\PanelsRenderHook;
use Illuminate\Support\Facades\Blade;

FilamentView::registerRenderHook(
    PanelsRenderHook::PAGE_START,
    fn (): View => view('warning-banner'),
    scopes: \App\Filament\Resources\Users\Pages\EditUser::class,
);
```

你也可以传入一个范围数组来注册渲染钩子：

```php
use Filament\Support\Facades\FilamentView;
use Filament\View\PanelsRenderHook;

FilamentView::registerRenderHook(
    PanelsRenderHook::PAGE_START,
    fn (): View => view('warning-banner'),
    scopes: [
        \App\Filament\Resources\Users\Pages\CreateUser::class,
        \App\Filament\Resources\Users\Pages\EditUser::class,
    ],
);
```

[Panel Builder](#panel-builder-渲染钩子) 的一些渲染钩子允许你将钩子限定到资源中的所有页面：

```php
use Filament\Support\Facades\FilamentView;
use Filament\View\PanelsRenderHook;

FilamentView::registerRenderHook(
    PanelsRenderHook::PAGE_START,
    fn (): View => view('warning-banner'),
    scopes: \App\Filament\Resources\Users\UserResource::class,
);
```

### 在渲染钩子内部获取当前活动的范围

`$scopes` 会被传递给渲染钩子函数，你可以使用它们来确定渲染钩子正在哪个页面或组件上渲染：

```php
use Filament\Support\Facades\FilamentView;
use Filament\View\PanelsRenderHook;

FilamentView::registerRenderHook(
    PanelsRenderHook::PAGE_START,
    fn (array $scopes): View => view('warning-banner', ['scopes' => $scopes]),
    scopes: \App\Filament\Resources\Users\UserResource::class,
);
```

## 向渲染钩子传递数据

渲染钩子可以在钩子渲染时接收"数据"。要从渲染钩子访问数据，你可以在钩子的渲染函数中使用 `array $data` 参数来注入：

```php
use Filament\Support\Facades\FilamentView;
use Filament\Tables\View\TablesRenderHook;

FilamentView::registerRenderHook(
    TablesRenderHook::FILTER_INDICATORS,
    fn (array $data): View => view('filter-indicators', ['indicators' => $data['filterIndicators']]),
);
```

## 渲染钩子

插件开发者可能会发现向用户公开渲染钩子很有用。你不需要在任何地方注册它们，只需在 Blade 中输出即可：

```blade
{{ \Filament\Support\Facades\FilamentView::renderHook(\Filament\View\PanelsRenderHook::PAGE_START) }}
```

要为你的渲染钩子提供[范围](#限定渲染钩子范围)，你可以将其作为第二个参数传给 `renderHook()`。例如，如果你的钩子在 Livewire 组件内部，可以使用 `static::class` 传递组件的类：

```blade
{{ \Filament\Support\Facades\FilamentView::renderHook(\Filament\View\PanelsRenderHook::PAGE_START, scopes: $this->getRenderHookScopes()) }}
```

你甚至可以传入多个范围作为数组，所有匹配任一范围的渲染钩子都会被渲染：

```blade
{{ \Filament\Support\Facades\FilamentView::renderHook(\Filament\View\PanelsRenderHook::PAGE_START, scopes: [static::class, \App\Filament\Resources\Users\UserResource::class]) }}
```

你可以使用 `renderHook()` 函数的 `data` 参数向渲染钩子传递[数据](#向渲染钩子传递数据)：

```blade
{{ \Filament\Support\Facades\FilamentView::renderHook(\Filament\Tables\View\TablesRenderHook::FILTER_INDICATORS, data: ['filterIndicators' => $filterIndicators]) }}
```
