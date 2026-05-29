---
title: 自定义页面
---

## 简介

Filament 允许你为应用创建完全自定义的页面。

![带有头部操作的自定义页面](/assets/filament/v4.x/screenshots/images/light/panels/custom-page.jpg)

## 创建页面

要创建新页面，你可以使用：

```bash
php artisan make:filament-page Settings
```

此命令将创建两个文件——一个位于 Filament 目录的 `/Pages` 目录中的页面类，以及一个位于 Filament 视图目录的 `/pages` 目录中的视图。

页面类都是全页 [Livewire](https://livewire.laravel.com) 组件，具有一些可与面板一起使用的额外工具。

## 授权

你可以通过重写 Page 类中的 `canAccess()` 方法来阻止页面出现在菜单中。如果你想控制哪些用户可以在导航中看到该页面，以及哪些用户可以直接访问该页面，这很有用：

```php
public static function canAccess(): bool
{
    return auth()->user()->canManageSettings();
}
```

## 为页面添加操作

操作是可以在页面上执行任务或访问 URL 的按钮。你可以[在这里](../actions/overview)阅读更多关于它们的功能。

由于所有页面都是 Livewire 组件，你可以在任何地方[添加操作](../components/action#添加操作)。页面已经为你设置好了 `InteractsWithActions` trait、`HasActions` 接口和 `<x-filament-actions::modals />` Blade 组件。

### 头部操作

你还可以轻松地将操作添加到任何页面的头部，包括[资源页面](../resources/overview)。你不需要担心在 Blade 模板中添加任何内容，我们会为你处理。只需从页面类的 `getHeaderActions()` 方法返回你的操作：

```php
use Filament\Actions\Action;

protected function getHeaderActions(): array
{
    return [
        Action::make('edit')
            ->url(route('posts.edit', ['post' => $this->post])),
        Action::make('delete')
            ->requiresConfirmation()
            ->action(fn () => $this->post->delete()),
    ];
}
```

#### 对齐头部操作

默认情况下，头部操作在移动端左对齐。要更改头部操作在移动端的对齐方式，设置 `$headerActionsAlignment`：

```php
use Filament\Support\Enums\Alignment;

protected ?Alignment $headerActionsAlignment = Alignment::End;
```

### 页面加载时打开操作模态框

你还可以通过将 `$defaultAction` 属性设置为要打开的操作名称，在页面加载时打开操作：

```php
use Filament\Actions\Action;

public $defaultAction = 'onboarding';

public function onboardingAction(): Action
{
    return Action::make('onboarding')
        ->modalHeading('Welcome')
        ->visible(fn (): bool => ! auth()->user()->isOnBoarded());
}
```

你还可以使用 `$defaultActionArguments` 属性向默认操作传递参数数组：

```php
public $defaultActionArguments = ['step' => 2];
```

或者，你可以通过将 `action` 指定为页面的查询字符串参数来在页面加载时打开操作模态框：

```
/admin/products/edit/932510?action=onboarding
```

### 刷新表单数据

如果你在[编辑](../resources/editing-records)或[查看](../resources/viewing-records)资源页面上使用操作，你可以使用 `refreshFormData()` 方法刷新主表单中的数据：

```php
use App\Models\Post;
use Filament\Actions\Action;

Action::make('approve')
    ->action(function (Post $record) {
        $record->approve();

        $this->refreshFormData([
            'status',
        ]);
    })
```

此方法接受一个你希望在表单中刷新的模型属性数组。

## 为页面添加小部件

Filament 允许你在页面中显示[小部件](../widgets/overview)，位于头部下方和页脚上方。

要将小部件添加到页面，使用 `getHeaderWidgets()` 或 `getFooterWidgets()` 方法：

```php
use App\Filament\Widgets\StatsOverviewWidget;

protected function getHeaderWidgets(): array
{
    return [
        StatsOverviewWidget::class
    ];
}
```

`getHeaderWidgets()` 返回要在页面内容上方显示的小部件数组，而 `getFooterWidgets()` 则在下方显示。

如果你想了解如何构建和自定义小部件，请查看[小部件](../widgets/overview)文档部分。

### 自定义小部件的网格

你可以更改用于显示小部件的网格列数。

你可以重写 `getHeaderWidgetsColumns()` 或 `getFooterWidgetsColumns()` 方法来返回要使用的网格列数：

```php
public function getHeaderWidgetsColumns(): int | array
{
    return 3;
}
```

#### 响应式小部件网格

你可能希望根据浏览器的响应式[断点](https://tailwindcss.com/docs/responsive-design#overview)更改小部件网格列数。你可以使用一个数组来实现，该数组包含每个断点应使用的列数：

```php
public function getHeaderWidgetsColumns(): int | array
{
    return [
        'md' => 4,
        'xl' => 5,
    ];
}
```

这与[响应式小部件宽度](../widgets/overview#responsive-widget-widths)配合得很好。

#### 从页面向小部件传递数据

你可以使用 `getWidgetData()` 方法从页面向小部件传递数据：

```php
public function getWidgetData(): array
{
    return [
        'stats' => [
            'total' => 100,
        ],
    ];
}
```

现在，你可以在小部件类上定义一个对应的公共 `$stats` 数组属性，它将被自动填充：

```php
public $stats = [];
```

### 在页面上向小部件传递属性

在页面上注册小部件时，你可以使用 `make()` 方法向其传递一个 [Livewire 属性](https://livewire.laravel.com/docs/properties)数组：

```php
use App\Filament\Widgets\StatsOverviewWidget;

protected function getHeaderWidgets(): array
{
    return [
        StatsOverviewWidget::make([
            'status' => 'active',
        ]),
    ];
}
```

这组属性会映射到小部件类上的[公共 Livewire 属性](https://livewire.laravel.com/docs/properties)：

```php
use Filament\Widgets\Widget;

class StatsOverviewWidget extends Widget
{
    public string $status;

    // ...
}
```

现在，你可以在小部件类中使用 `$this->status` 访问 `status`。

## 自定义页面标题

默认情况下，Filament 会根据页面名称自动生成标题。你可以通过在页面类上定义 `$title` 属性来覆盖：

```php
protected static ?string $title = 'Custom Page Title';
```

或者，你可以从 `getTitle()` 方法返回一个字符串：

```php
use Illuminate\Contracts\Support\Htmlable;

public function getTitle(): string | Htmlable
{
    return __('Custom Page Title');
}
```

## 自定义页面导航标签

默认情况下，Filament 会使用页面的[标题](#自定义页面标题)作为其[导航](overview)项标签。你可以通过在页面类上定义 `$navigationLabel` 属性来覆盖：

```php
protected static ?string $navigationLabel = 'Custom Navigation Label';
```

或者，你可以从 `getNavigationLabel()` 方法返回一个字符串：

```php
public static function getNavigationLabel(): string
{
    return __('Custom Navigation Label');
}
```

## 自定义页面 URL

默认情况下，Filament 会根据页面名称自动生成 URL（slug）。你可以通过在页面类上定义 `$slug` 属性来覆盖：

```php
protected static ?string $slug = 'custom-url-slug';
```

## 自定义页面标题

默认情况下，Filament 会使用页面的[标题](#自定义页面标题)作为其标题。你可以通过在页面类上定义 `$heading` 属性来覆盖：

```php
protected ?string $heading = 'Custom Page Heading';
```

或者，你可以从 `getHeading()` 方法返回一个字符串：

```php
public function getHeading(): string
{
    return __('Custom Page Heading');
}
```

### 添加页面副标题

你还可以通过在页面类上定义 `$subheading` 属性来为页面添加副标题：

```php
protected ?string $subheading = 'Custom Page Subheading';
```

或者，你可以从 `getSubheading()` 方法返回一个字符串：

```php
public function getSubheading(): ?string
{
    return __('Custom Page Subheading');
}
```

![带有副标题的自定义页面](/assets/filament/v4.x/screenshots/images/light/panels/custom-page-subheading.jpg)

## 用自定义视图替换页面头部

你可以用自定义头部视图替换任何页面的默认[标题](#自定义页面标题)、[副标题](#添加页面副标题)和[操作](#头部操作)。你可以从 `getHeader()` 方法返回它：

```php
use Illuminate\Contracts\View\View;

public function getHeader(): ?View
{
    return view('filament.settings.custom-header');
}
```

此示例假设你在 `resources/views/filament/settings/custom-header.blade.php` 有一个 Blade 视图。

## 在页面页脚中渲染自定义视图

你还可以为任何页面添加页脚，位于其内容下方。你可以从 `getFooter()` 方法返回它：

```php
use Illuminate\Contracts\View\View;

public function getFooter(): ?View
{
    return view('filament.settings.custom-footer');
}
```

此示例假设你在 `resources/views/filament/settings/custom-footer.blade.php` 有一个 Blade 视图。

## 自定义最大内容宽度

默认情况下，Filament 会限制页面上的内容宽度，使其在大屏幕上不会过宽。要更改此设置，你可以重写 `getMaxContentWidth()` 方法。选项对应于 [Tailwind 的 max-width 比例](https://tailwindcss.com/docs/max-width)。选项有 `ExtraSmall`、`Small`、`Medium`、`Large`、`ExtraLarge`、`TwoExtraLarge`、`ThreeExtraLarge`、`FourExtraLarge`、`FiveExtraLarge`、`SixExtraLarge`、`SevenExtraLarge`、`Full`、`MinContent`、`MaxContent`、`FitContent`、`Prose`、`ScreenSmall`、`ScreenMedium`、`ScreenLarge`、`ScreenExtraLarge` 和 `ScreenTwoExtraLarge`。默认为 `SevenExtraLarge`：

```php
use Filament\Support\Enums\Width;

public function getMaxContentWidth(): Width
{
    return Width::Full;
}
```

## 生成页面 URL

Filament 在页面类上提供了 `getUrl()` 静态方法来生成指向它们的 URL。传统上，你需要手动构建 URL 或使用 Laravel 的 `route()` 辅助函数，但这些方法依赖于对页面 slug 或路由命名约定的了解。

`getUrl()` 方法在没有参数时会生成一个 URL：

```php
use App\Filament\Pages\Settings;

Settings::getUrl(); // /admin/settings
```

如果你的页面使用 URL / 查询参数，你应该使用参数：

```php
use App\Filament\Pages\Settings;

Settings::getUrl(['section' => 'notifications']); // /admin/settings?section=notifications
```

### 生成其他面板中页面的 URL

如果你的应用中有多个面板，`getUrl()` 将在当前面板中生成 URL。你也可以通过将面板 ID 传递给 `panel` 参数来指示页面关联的面板：

```php
use App\Filament\Pages\Settings;

Settings::getUrl(panel: 'marketing');
```

## 在页面之间添加子导航

你可能希望为多个页面添加通用的子导航，以便用户在它们之间快速导航。你可以通过定义[集群](clusters)来实现。集群还可以包含[资源](../resources/overview)，你可以在集群内的多个页面或资源之间切换。

## 设置子导航位置

默认情况下，子导航渲染在页面的开头。你可以通过在页面上设置 `$subNavigationPosition` 属性来更改位置。值可以是 `SubNavigationPosition::Start`、`SubNavigationPosition::End` 或 `SubNavigationPosition::Top`（将子导航渲染为标签页）：

```php
use Filament\Pages\Enums\SubNavigationPosition;

protected static ?SubNavigationPosition $subNavigationPosition = SubNavigationPosition::End;
```

![末尾子导航位置的页面](/assets/filament/v4.x/screenshots/images/light/panels/cluster-end.jpg)

`SubNavigationPosition::Top` 选项将子导航渲染为页面内容上方的标签页：

![顶部子导航位置的页面](/assets/filament/v4.x/screenshots/images/light/panels/cluster-top.jpg)

## 为页面 body 标签添加额外属性

你可能希望为页面的 `<body>` 标签添加额外属性。为此，你可以在 `$extraBodyAttributes` 中设置属性数组：

```php
protected array $extraBodyAttributes = [];
```

或者，你可以从 `getExtraBodyAttributes()` 方法返回属性及其值的数组：

```php
public function getExtraBodyAttributes(): array
{
    return [
        'class' => 'settings-page',
    ];
}
```
