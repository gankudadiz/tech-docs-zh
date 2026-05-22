---
title: 图标
---

## 简介

图标在整个 Filament UI 中用于直观地传达用户体验的核心部分。为了渲染图标，我们使用来自 Blade UI Kit 的 [Blade Icons](https://github.com/blade-ui-kit/blade-icons) 包。

他们有一个网站，你可以在上面[搜索所有可用的图标](https://blade-ui-kit.com/blade-icons?set=1#search)，来自各种 Blade Icons 包。每个包含不同的图标集供你选择。Filament 默认安装了 "Heroicons" 图标集，因此如果你使用此图标集中的图标，无需安装额外的包。

## 在 Filament 中使用 Heroicons

Filament 默认包含 [Heroicons](https://heroicons.com) 图标集。你可以在 Filament 应用中使用此图标集中的任何图标，无需安装额外的包。`Heroicon` 枚举类允许你利用 IDE 的自动补全功能来查找想要使用的图标：

```php
use Filament\Actions\Action;
use Filament\Forms\Components\Toggle;
use Filament\Support\Icons\Heroicon;

Action::make('star')
    ->icon(Heroicon::OutlinedStar)
    
Toggle::make('is_starred')
    ->onIcon(Heroicon::Star)
```

每个图标都有"轮廓"和"实心"两种变体，轮廓变体的名称以 `Outlined` 为前缀。例如，`Heroicon::Star` 图标是实心变体，而 `Heroicon::OutlinedStar` 图标是轮廓变体。

Heroicons 集包含多种尺寸（16px、20px 和 24px）的实心图标，使用 `Heroicon` 枚举类时，Filament 会自动根据使用上下文选择正确的尺寸。

如果你想在 [Blade 组件](../components)中使用图标，可以将其作为属性传递：

```blade
@php
    use Filament\Support\Icons\Heroicon;
@endphp

<x-filament::badge :icon="Heroicon::Star">
    Star
</x-filament::badge>
```

## 在 Filament 中使用其他图标集

一旦你[找到了图标](https://blade-ui-kit/blade-icons?set=1#search)，安装了你想在 Filament 中使用的图标集（如果不是 Heroicon），你需要使用其名称。例如，如果你想使用 [`iconic-star`](https://blade-ui-kit/blade-icons/iconic-star) 图标，可以这样传给 PHP 组件的图标方法：

```php
use Filament\Actions\Action;
use Filament\Forms\Components\Toggle;

Action::make('star')
    ->icon('iconic-star')
    
Toggle::make('is_starred')
    ->onIcon('iconic-check-circle')
```

如果你想在 [Blade 组件](../components)中使用图标，可以将其作为属性传递：

```blade
<x-filament::badge icon="iconic-star">
    Star
</x-filament::badge>
```

## 使用自定义 SVG 作为图标

[Blade Icons](https://github.com/blade-ui-kit/blade-icons) 包允许你将自定义 SVG 注册为图标。如果你想在 Filament 中使用自己的自定义图标，这非常有用。

首先，发布 Blade Icons 配置文件：

```bash
php artisan vendor:publish --tag=blade-icons
```

然后，打开 `config/blade-icons.php` 文件，取消 `sets` 数组中 `default` 集的注释。

现在默认集存在于配置文件中，你只需将任何想要的图标放入应用的 `resources/svg` 目录中即可。例如，如果你将一个名为 `star.svg` 的 SVG 文件放入 `resources/svg` 目录，你可以在 Filament 的任何地方以 `icon-star` 引用它（见下文）。`icon-` 前缀也可以在 `config/blade-icons.php` 文件中配置。你也可以在 Blade 视图中使用 [`@svg('icon-star')` 指令](https://github.com/blade-ui-kit/blade-icons#directive)来渲染自定义图标。

```php
use Filament\Actions\Action;

Action::make('star')
    ->icon('icon-star')
```

## 替换默认图标

Filament 包含一个图标管理系统，允许你替换 UI 中默认使用的任何图标。这在任何服务提供者的 `boot()` 方法中完成，如 `AppServiceProvider`，甚至可以是一个专门的图标服务提供者。如果你想构建一个插件来用不同的图标集替换 Heroicons，完全可以创建一个带有类似服务提供者的 Laravel 包来实现。

要替换图标，你可以使用 `FilamentIcon` 门面。它有一个 `register()` 方法，接受一个要替换的图标数组。数组的键是标识 Filament UI 中图标的唯一[图标别名](#可用的图标别名)，值是要替换它的 Blade 图标名称。或者，你也可以使用 HTML 而不是图标名称，例如从 Blade 视图渲染图标：

```php
use Filament\Support\Facades\FilamentIcon;
use Filament\View\PanelsIconAlias;

FilamentIcon::register([
    PanelsIconAlias::GLOBAL_SEARCH_FIELD => 'fas-magnifying-glass',
    PanelsIconAlias::SIDEBAR_GROUP_COLLAPSE_BUTTON => view('icons.chevron-up'),
]);
```

## 可用的图标别名

### Actions 图标别名

使用类 `Filament\Actions\View\ActionsIconAlias`

- `ActionsIconAlias::ACTION_GROUP` - 操作组的触发按钮
- `ActionsIconAlias::CREATE_ACTION_GROUPED` - 分组创建操作的触发按钮
- `ActionsIconAlias::DELETE_ACTION` - 删除操作的触发按钮
- `ActionsIconAlias::DELETE_ACTION_GROUPED` - 分组删除操作的触发按钮
- `ActionsIconAlias::DELETE_ACTION_MODAL` - 删除操作的模态框
- `ActionsIconAlias::DETACH_ACTION` - 分离操作的触发按钮
- `ActionsIconAlias::DETACH_ACTION_MODAL` - 分离操作的模态框
- `ActionsIconAlias::DISSOCIATE_ACTION` - 解除关联操作的触发按钮
- `ActionsIconAlias::DISSOCIATE_ACTION_MODAL` - 解除关联操作的模态框
- `ActionsIconAlias::EDIT_ACTION` - 编辑操作的触发按钮
- `ActionsIconAlias::EDIT_ACTION_GROUPED` - 分组编辑操作的触发按钮
- `ActionsIconAlias::EXPORT_ACTION_GROUPED` - 分组导出操作的触发按钮
- `ActionsIconAlias::FORCE_DELETE_ACTION` - 强制删除操作的触发按钮
- `ActionsIconAlias::FORCE_DELETE_ACTION_GROUPED` - 分组强制删除操作的触发按钮
- `ActionsIconAlias::FORCE_DELETE_ACTION_MODAL` - 强制删除操作的模态框
- `ActionsIconAlias::IMPORT_ACTION_GROUPED` - 分组导入操作的触发按钮
- `ActionsIconAlias::MODAL_CONFIRMATION` - 需要确认的操作的模态框
- `ActionsIconAlias::REPLICATE_ACTION` - 复制操作的触发按钮
- `ActionsIconAlias::REPLICATE_ACTION_GROUPED` - 分组复制操作的触发按钮
- `ActionsIconAlias::RESTORE_ACTION` - 恢复操作的触发按钮
- `ActionsIconAlias::RESTORE_ACTION_GROUPED` - 分组恢复操作的触发按钮
- `ActionsIconAlias::RESTORE_ACTION_MODAL` - 恢复操作的模态框
- `ActionsIconAlias::VIEW_ACTION` - 查看操作的触发按钮
- `ActionsIconAlias::VIEW_ACTION_GROUPED` - 分组查看操作的触发按钮

### Forms 图标别名

使用类 `Filament\Forms\View\FormsIconAlias`

- `FormsIconAlias::COMPONENTS_BUILDER_ACTIONS_CLONE` - 构建器项中克隆操作的触发按钮
- `FormsIconAlias::COMPONENTS_BUILDER_ACTIONS_COLLAPSE` - 构建器项中折叠操作的触发按钮
- `FormsIconAlias::COMPONENTS_BUILDER_ACTIONS_DELETE` - 构建器项中删除操作的触发按钮
- `FormsIconAlias::COMPONENTS_BUILDER_ACTIONS_EXPAND` - 构建器项中展开操作的触发按钮
- `FormsIconAlias::COMPONENTS_BUILDER_ACTIONS_MOVE_DOWN` - 构建器项中下移操作的触发按钮
- `FormsIconAlias::COMPONENTS_BUILDER_ACTIONS_MOVE_UP` - 构建器项中上移操作的触发按钮
- `FormsIconAlias::COMPONENTS_BUILDER_ACTIONS_REORDER` - 构建器项中重排序操作的触发按钮
- `FormsIconAlias::COMPONENTS_CHECKBOX_LIST_SEARCH_FIELD` - 复选框列表中的搜索输入
- `FormsIconAlias::COMPONENTS_FILE_UPLOAD_EDITOR_ACTIONS_DRAG_CROP` - 文件上传编辑器中拖拽裁剪操作的触发按钮
- `FormsIconAlias::COMPONENTS_FILE_UPLOAD_EDITOR_ACTIONS_DRAG_MOVE` - 文件上传编辑器中拖拽移动操作的触发按钮
- `FormsIconAlias::COMPONENTS_FILE_UPLOAD_EDITOR_ACTIONS_FLIP_HORIZONTAL` - 文件上传编辑器中水平翻转操作的触发按钮
- `FormsIconAlias::COMPONENTS_FILE_UPLOAD_EDITOR_ACTIONS_FLIP_VERTICAL` - 文件上传编辑器中垂直翻转操作的触发按钮
- `FormsIconAlias::COMPONENTS_FILE_UPLOAD_EDITOR_ACTIONS_MOVE_DOWN` - 文件上传编辑器中下移操作的触发按钮
- `FormsIconAlias::COMPONENTS_FILE_UPLOAD_EDITOR_ACTIONS_MOVE_LEFT` - 文件上传编辑器中左移操作的触发按钮
- `FormsIconAlias::COMPONENTS_FILE_UPLOAD_EDITOR_ACTIONS_MOVE_RIGHT` - 文件上传编辑器中右移操作的触发按钮
- `FormsIconAlias::COMPONENTS_FILE_UPLOAD_EDITOR_ACTIONS_MOVE_UP` - 文件上传编辑器中上移操作的触发按钮
- `FormsIconAlias::COMPONENTS_FILE_UPLOAD_EDITOR_ACTIONS_ROTATE_LEFT` - 文件上传编辑器中左旋操作的触发按钮
- `FormsIconAlias::COMPONENTS_FILE_UPLOAD_EDITOR_ACTIONS_ROTATE_RIGHT` - 文件上传编辑器中右旋操作的触发按钮
- `FormsIconAlias::COMPONENTS_FILE_UPLOAD_EDITOR_ACTIONS_ZOOM_100` - 文件上传编辑器中缩放至 100% 操作的触发按钮
- `FormsIconAlias::COMPONENTS_FILE_UPLOAD_EDITOR_ACTIONS_ZOOM_IN` - 文件上传编辑器中放大操作的触发按钮
- `FormsIconAlias::COMPONENTS_FILE_UPLOAD_EDITOR_ACTIONS_ZOOM_OUT` - 文件上传编辑器中缩小操作的触发按钮
- `FormsIconAlias::COMPONENTS_KEY_VALUE_ACTIONS_DELETE` - 键值字段项中删除操作的触发按钮
- `FormsIconAlias::COMPONENTS_KEY_VALUE_ACTIONS_REORDER` - 键值字段项中重排序操作的触发按钮
- `FormsIconAlias::COMPONENTS_REPEATER_ACTIONS_CLONE` - 重复器项中克隆操作的触发按钮
- `FormsIconAlias::COMPONENTS_REPEATER_ACTIONS_COLLAPSE` - 重复器项中折叠操作的触发按钮
- `FormsIconAlias::COMPONENTS_REPEATER_ACTIONS_DELETE` - 重复器项中删除操作的触发按钮
- `FormsIconAlias::COMPONENTS_REPEATER_ACTIONS_EXPAND` - 重复器项中展开操作的触发按钮
- `FormsIconAlias::COMPONENTS_REPEATER_ACTIONS_MOVE_DOWN` - 重复器项中下移操作的触发按钮
- `FormsIconAlias::COMPONENTS_REPEATER_ACTIONS_MOVE_UP` - 重复器项中上移操作的触发按钮
- `FormsIconAlias::COMPONENTS_REPEATER_ACTIONS_REORDER` - 重复器项中重排序操作的触发按钮
- `FormsIconAlias::COMPONENTS_RICH_EDITOR_PANELS_CUSTOM_BLOCKS_CLOSE_BUTTON` - 富文本编辑器中自定义块面板的关闭按钮
- `FormsIconAlias::COMPONENTS_RICH_EDITOR_PANELS_CUSTOM_BLOCK_DELETE_BUTTON` - 富文本编辑器中自定义块的删除按钮
- `FormsIconAlias::COMPONENTS_RICH_EDITOR_PANELS_CUSTOM_BLOCK_EDIT_BUTTON` - 富文本编辑器中自定义块的编辑按钮
- `FormsIconAlias::COMPONENTS_RICH_EDITOR_PANELS_MERGE_TAGS_CLOSE_BUTTON` - 富文本编辑器中合并标签面板的关闭按钮
- `FormsIconAlias::COMPONENTS_SELECT_ACTIONS_CREATE_OPTION` - 选择字段中创建选项操作的触发按钮
- `FormsIconAlias::COMPONENTS_SELECT_ACTIONS_EDIT_OPTION` - 选择字段中编辑选项操作的触发按钮
- `FormsIconAlias::COMPONENTS_TEXT_INPUT_ACTIONS_HIDE_PASSWORD` - 文本输入字段中隐藏密码操作的触发按钮
- `FormsIconAlias::COMPONENTS_TEXT_INPUT_ACTIONS_SHOW_PASSWORD` - 文本输入字段中显示密码操作的触发按钮
- `FormsIconAlias::COMPONENTS_TOGGLE_BUTTONS_BOOLEAN_FALSE` - `boolean()` 切换按钮字段的 "False" 选项
- `FormsIconAlias::COMPONENTS_TOGGLE_BUTTONS_BOOLEAN_TRUE` - `boolean()` 切换按钮字段的 "True" 选项

### Infolists 图标别名

使用类 `Filament\Infolists\View\InfolistsIconAlias`

- `InfolistsIconAlias::COMPONENTS_ICON_ENTRY_FALSE` - 图标条目的假值状态
- `InfolistsIconAlias::COMPONENTS_ICON_ENTRY_TRUE` - 图标条目的真值状态

### Notifications 图标别名

使用类 `Filament\Notifications\View\NotificationsIconAlias`

- `NotificationsIconAlias::DATABASE_MODAL_EMPTY_STATE` - 数据库通知模态框的空状态
- `NotificationsIconAlias::NOTIFICATION_CLOSE_BUTTON` - 关闭通知的按钮
- `NotificationsIconAlias::NOTIFICATION_DANGER` - 危险通知
- `NotificationsIconAlias::NOTIFICATION_INFO` - 信息通知
- `NotificationsIconAlias::NOTIFICATION_SUCCESS` - 成功通知
- `NotificationsIconAlias::NOTIFICATION_WARNING` - 警告通知

### Panels 图标别名

使用类 `Filament\View\PanelsIconAlias`

- `PanelsIconAlias::GLOBAL_SEARCH_FIELD` - 全局搜索字段
- `PanelsIconAlias::PAGES_DASHBOARD_ACTIONS_FILTER` - 仪表盘过滤操作的触发按钮
- `PanelsIconAlias::PAGES_DASHBOARD_NAVIGATION_ITEM` - 仪表盘页面导航项
- `PanelsIconAlias::PAGES_PASSWORD_RESET_REQUEST_PASSWORD_RESET_ACTIONS_LOGIN` - 请求密码重置页面上登录操作的触发按钮
- `PanelsIconAlias::PAGES_PASSWORD_RESET_REQUEST_PASSWORD_RESET_ACTIONS_LOGIN_RTL` - 请求密码重置页面上登录操作的触发按钮（从右到左方向）
- `PanelsIconAlias::RESOURCES_PAGES_EDIT_RECORD_NAVIGATION_ITEM` - 资源编辑记录页面导航项
- `PanelsIconAlias::RESOURCES_PAGES_MANAGE_RELATED_RECORDS_NAVIGATION_ITEM` - 资源管理关联记录页面导航项
- `PanelsIconAlias::RESOURCES_PAGES_VIEW_RECORD_NAVIGATION_ITEM` - 资源查看记录页面导航项
- `PanelsIconAlias::SIDEBAR_COLLAPSE_BUTTON` - 折叠侧边栏的按钮
- `PanelsIconAlias::SIDEBAR_COLLAPSE_BUTTON_RTL` - 折叠侧边栏的按钮（从右到左方向）
- `PanelsIconAlias::SIDEBAR_EXPAND_BUTTON` - 展开侧边栏的按钮
- `PanelsIconAlias::SIDEBAR_EXPAND_BUTTON_RTL` - 展开侧边栏的按钮（从右到左方向）
- `PanelsIconAlias::SIDEBAR_GROUP_COLLAPSE_BUTTON` - 侧边栏组的折叠按钮
- `PanelsIconAlias::SIDEBAR_OPEN_DATABASE_NOTIFICATIONS_BUTTON` - 打开数据库通知模态框的按钮
- `PanelsIconAlias::TENANT_MENU_BILLING_BUTTON` - 租户菜单中的计费按钮
- `PanelsIconAlias::TENANT_MENU_PROFILE_BUTTON` - 租户菜单中的个人资料按钮
- `PanelsIconAlias::TENANT_MENU_REGISTRATION_BUTTON` - 租户菜单中的注册按钮
- `PanelsIconAlias::TENANT_MENU_TOGGLE_BUTTON` - 切换租户菜单的按钮
- `PanelsIconAlias::THEME_SWITCHER_LIGHT_BUTTON` - 从主题切换器切换到亮色主题的按钮
- `PanelsIconAlias::THEME_SWITCHER_DARK_BUTTON` - 从主题切换器切换到暗色主题的按钮
- `PanelsIconAlias::THEME_SWITCHER_SYSTEM_BUTTON` - 从主题切换器切换到系统主题的按钮
- `PanelsIconAlias::TOPBAR_CLOSE_SIDEBAR_BUTTON` - 关闭侧边栏的按钮
- `PanelsIconAlias::TOPBAR_OPEN_SIDEBAR_BUTTON` - 打开侧边栏的按钮
- `PanelsIconAlias::TOPBAR_GROUP_TOGGLE_BUTTON` - 顶栏组的切换按钮
- `PanelsIconAlias::TOPBAR_OPEN_DATABASE_NOTIFICATIONS_BUTTON` - 打开数据库通知模态框的按钮
- `PanelsIconAlias::USER_MENU_PROFILE_ITEM` - 用户菜单中的个人资料项
- `PanelsIconAlias::USER_MENU_LOGOUT_BUTTON` - 用户菜单中登出的按钮
- `PanelsIconAlias::USER_MENU_TOGGLE_BUTTON` - 切换用户菜单的按钮
- `PanelsIconAlias::WIDGETS_ACCOUNT_LOGOUT_BUTTON` - 账户小部件中登出的按钮
- `PanelsIconAlias::WIDGETS_FILAMENT_INFO_OPEN_DOCUMENTATION_BUTTON` - Filament 信息小部件中打开文档的按钮
- `PanelsIconAlias::WIDGETS_FILAMENT_INFO_OPEN_GITHUB_BUTTON` - Filament 信息小部件中打开 GitHub 的按钮

### Schema 图标别名

使用类 `Filament\Schemas\View\SchemaIconAlias`

- `SchemaIconAlias::COMPONENTS_WIZARD_COMPLETED_STEP` - 向导中已完成的步骤

### Tables 图标别名

使用类 `Filament\Tables\View\TablesIconAlias`

- `TablesIconAlias::ACTIONS_DISABLE_REORDERING` - 禁用重排序操作的触发按钮
- `TablesIconAlias::ACTIONS_ENABLE_REORDERING` - 启用重排序操作的触发按钮
- `TablesIconAlias::ACTIONS_FILTER` - 过滤操作的触发按钮
- `TablesIconAlias::ACTIONS_GROUP` - 分组记录操作的触发按钮
- `TablesIconAlias::ACTIONS_OPEN_BULK_ACTIONS` - 打开批量操作的触发按钮
- `TablesIconAlias::ACTIONS_COLUMN_MANAGER` - 列管理器操作的触发按钮
- `TablesIconAlias::COLUMNS_COLLAPSE_BUTTON` - 折叠列的按钮
- `TablesIconAlias::COLUMNS_ICON_COLUMN_FALSE` - 图标列的假值状态
- `TablesIconAlias::COLUMNS_ICON_COLUMN_TRUE` - 图标列的真值状态
- `TablesIconAlias::EMPTY_STATE` - 空状态图标
- `TablesIconAlias::FILTERS_QUERY_BUILDER_CONSTRAINTS_BOOLEAN` - 查询构建器中布尔约束的默认图标
- `TablesIconAlias::FILTERS_QUERY_BUILDER_CONSTRAINTS_DATE` - 查询构建器中日期约束的默认图标
- `TablesIconAlias::FILTERS_QUERY_BUILDER_CONSTRAINTS_NUMBER` - 查询构建器中数字约束的默认图标
- `TablesIconAlias::FILTERS_QUERY_BUILDER_CONSTRAINTS_RELATIONSHIP` - 查询构建器中关联约束的默认图标
- `TablesIconAlias::FILTERS_QUERY_BUILDER_CONSTRAINTS_SELECT` - 查询构建器中选择约束的默认图标
- `TablesIconAlias::FILTERS_QUERY_BUILDER_CONSTRAINTS_TEXT` - 查询构建器中文本约束的默认图标
- `TablesIconAlias::FILTERS_REMOVE_ALL_BUTTON` - 移除所有过滤器的按钮
- `TablesIconAlias::GROUPING_COLLAPSE_BUTTON` - 折叠记录组的按钮
- `TablesIconAlias::HEADER_CELL_SORT_ASC_BUTTON` - 按升序排序的列的排序按钮
- `TablesIconAlias::HEADER_CELL_SORT_BUTTON` - 当前未排序的列的排序按钮
- `TablesIconAlias::HEADER_CELL_SORT_DESC_BUTTON` - 按降序排序的列的排序按钮
- `TablesIconAlias::REORDER_HANDLE` - 用于拖拽重排序记录的拖动手柄
- `TablesIconAlias::SEARCH_FIELD` - 搜索输入框

### UI 组件图标别名

使用类 `Filament\Support\View\SupportIconAlias`

- `SupportIconAlias::BADGE_DELETE_BUTTON` - 删除徽章的按钮
- `SupportIconAlias::BREADCRUMBS_SEPARATOR` - 面包屑之间的分隔符
- `SupportIconAlias::BREADCRUMBS_SEPARATOR_RTL` - 面包屑之间的分隔符（从右到左方向）
- `SupportIconAlias::MODAL_CLOSE_BUTTON` - 关闭模态框的按钮
- `SupportIconAlias::PAGINATION_FIRST_BUTTON` - 跳转到第一页的按钮
- `SupportIconAlias::PAGINATION_FIRST_BUTTON_RTL` - 跳转到第一页的按钮（从右到左方向）
- `SupportIconAlias::PAGINATION_LAST_BUTTON` - 跳转到最后一页的按钮
- `SupportIconAlias::PAGINATION_LAST_BUTTON_RTL` - 跳转到最后一页的按钮（从右到左方向）
- `SupportIconAlias::PAGINATION_NEXT_BUTTON` - 跳转到下一页的按钮
- `SupportIconAlias::PAGINATION_NEXT_BUTTON_RTL` - 跳转到下一页的按钮（从右到左方向）
- `SupportIconAlias::PAGINATION_PREVIOUS_BUTTON` - 跳转到上一页的按钮
- `SupportIconAlias::PAGINATION_PREVIOUS_BUTTON_RTL` - 跳转到上一页的按钮（从右到左方向）
- `SupportIconAlias::SECTION_COLLAPSE_BUTTON` - 折叠区域的按钮

### Widgets 图标别名

使用类 `Filament\Widgets\View\WidgetsIconAlias`

- `WidgetsIconAlias::CHART_WIDGET_FILTER` - 过滤操作的按钮
