---
title: 可配置资源和页面
---

## 简介

有时你需要使用不同的配置多次注册相同的资源或页面。例如，一个"订单"资源可能同时以"活跃订单"和"归档订单"出现在侧边栏中，每个都有不同的查询范围、导航标签和 URL slug - 但共享相同的底层资源类。

可配置资源和页面允许你在面板中多次注册单个类，每个都有唯一的配置键和自己的选项集。每个配置都有自己的路由、导航项和 URL slug，而资源或页面类可以使用活动配置在运行时调整其行为。

:::info
虽然本指南在插件部分，但可配置资源和页面适用于任何 `PanelProvider` - 你不需要构建插件就可以使用它们。它们对插件特别有用，因为它们允许插件作者向用户暴露灵活的配置。
:::

## 创建资源配置类

要使资源可配置，你首先需要一个配置类。此类扩展 `ResourceConfiguration` 并定义可以在注册之间变化的选项：

```php
use Filament\Resources\ResourceConfiguration;

class OrderResourceConfiguration extends ResourceConfiguration
{
    protected bool $isArchived = false;

    protected ?string $navigationLabel = null;

    protected ?string $navigationGroup = null;

    public function archived(bool $condition = true): static
    {
        $this->isArchived = $condition;

        return $this;
    }

    public function isArchived(): bool
    {
        return $this->isArchived;
    }

    public function navigationLabel(string $label): static
    {
        $this->navigationLabel = $label;

        return $this;
    }

    public function getNavigationLabel(): ?string
    {
        return $this->navigationLabel;
    }

    public function navigationGroup(string $group): static
    {
        $this->navigationGroup = $group;

        return $this;
    }

    public function getNavigationGroup(): ?string
    {
        return $this->navigationGroup;
    }
}
```

配置类遵循与 Filament 其余部分相同的[流畅 API 模式](../plugins/panel-plugins#configuring-plugins-per-panel) - setter 方法返回 `$this` 以便链接，getter 方法检索存储的值。

:::tip
`ResourceConfiguration` 基类已经包含一个用于覆盖 URL slug 的 `slug()` 方法。你只需要添加特定于插件的属性。
:::

## 将配置类链接到资源

在资源上设置 `$configurationClass` 属性以将其与配置类链接：

```php
use Filament\Resources\Resource;

class OrderResource extends Resource
{
    protected static ?string $configurationClass = OrderResourceConfiguration::class;

    // ...
}
```

这会在资源上启用 `make()` 方法，该方法创建一个新的配置实例，可以在面板上注册。

## 在面板上注册配置

你可以使用 `make()` 方法注册一个或多个配置。每个配置需要一个唯一的键：

```php
use App\Filament\Resources\OrderResource;

public function panel(Panel $panel): Panel
{
    return $panel
        ->resources([
            // "活跃订单"配置
            OrderResource::make('active')
                ->navigationLabel('Active Orders')
                ->navigationGroup('Orders'),
            // "归档订单"配置
            OrderResource::make('archived')
                ->navigationLabel('Archived Orders')
                ->navigationGroup('Orders')
                ->archived(),
        ]);
}
```

每个配置的注册都有自己的路由和导航项。配置键（`'active'`、`'archived'`）在内部用于标识每个注册。

你也可以在配置旁边单独注册资源类，如果你想要默认（未配置）的注册。这是可选的 - 如果你只需要配置，可以只注册配置：

```php
$panel->resources([
    OrderResource::class, // 可选的默认注册
    OrderResource::make('active'),
    OrderResource::make('archived')
        ->archived(),
]);
```

:::tip
如果你正在构建[插件类](panel-plugins#configuring-the-panel-with-a-plugin-class)，你会在 `register(Panel $panel)` 方法中注册配置。有关完整示例，请参阅[在插件类中使用可配置资源](#using-configurable-resources-in-a-plugin-class)。
:::

### URL slug

当你单独注册资源类（没有配置）时，它使用资源的默认 URL slug - 例如 `/orders`。

当你使用键注册配置时，该键会附加到资源的基础 slug。例如，`OrderResource::make('active')` 将可通过 `/orders/active` 访问，`OrderResource::make('archived')` 可通过 `/orders/archived` 访问。

你可以使用 `slug()` 来覆盖配置的整个 slug，而不是使用默认的 `{base}/{key}` 模式：

```php
OrderResource::make('archived')
    ->slug('order-archive') // 可通过 `/order-archive` 访问，而不是 `/orders/archived`
    ->archived(),
```

## 在运行时使用配置

在资源类内部，调用 `static::getConfiguration()` 来检索当前请求的活动配置。当资源通过其默认（未配置）的注册访问时，返回 `null`：

```php
use Filament\Resources\Resource;
use Illuminate\Database\Eloquent\Builder;
use UnitEnum;

class OrderResource extends Resource
{
    protected static ?string $configurationClass = OrderResourceConfiguration::class;

    public static function getEloquentQuery(): Builder
    {
        $query = parent::getEloquentQuery();

        if ($configuration = static::getConfiguration()) {
            if ($configuration->isArchived()) {
                $query->where('archived_at', '!=', null);
            }
        }

        return $query;
    }

    public static function getNavigationLabel(): string
    {
        if ($configuration = static::getConfiguration()) {
            if ($label = $configuration->getNavigationLabel()) {
                return $label;
            }
        }

        return parent::getNavigationLabel();
    }

    public static function getNavigationGroup(): string | UnitEnum | null
    {
        if ($configuration = static::getConfiguration()) {
            if ($group = $configuration->getNavigationGroup()) {
                return $group;
            }
        }

        return parent::getNavigationGroup();
    }

    // ...
}
```

你可以使用 `static::hasConfiguration()` 作为简写来检查当前是否有活动配置：

```php
if (static::hasConfiguration()) {
    // 在已配置的注册中运行
}
```

## 为特定配置生成 URL

在为已配置的资源生成 URL 时，将 `configuration` 参数传递给 `getUrl()`：

```php
// 默认（未配置）注册的 URL
OrderResource::getUrl();

// "active" 配置的 URL
OrderResource::getUrl(configuration: 'active');

// "archived" 配置中特定页面的 URL
OrderResource::getUrl('edit', ['record' => $order], configuration: 'archived');
```

当你已经在已配置的请求中（例如在资源页面中）时，`getUrl()` 会自动使用当前配置上下文。只有在从当前配置链接到不同配置时，才需要传递 `configuration` 参数。

## 可配置页面

页面遵循与资源相同的模式。主要区别是：

- 你的配置类扩展 `PageConfiguration` 而不是 `ResourceConfiguration`
- 你使用 `$panel->pages()` 而不是 `$panel->resources()` 来注册配置
- 由于页面是 Livewire 组件，你可以在 `mount()` 中读取配置值：

```php
use Filament\Pages\Page;

class SettingsPage extends Page
{
    protected static ?string $configurationClass = SettingsPageConfiguration::class;

    public function mount(): void
    {
        if ($configuration = static::getConfiguration()) {
            $this->settingsCategory = $configuration->getSettingsCategory();
        }
    }

    // ...
}
```

```php
$panel->pages([
    SettingsPage::make('general')
        ->slug('general-settings')
        ->settingsCategory('general'),
    SettingsPage::make('advanced')
        ->slug('advanced-settings')
        ->settingsCategory('advanced'),
]);
```

## 临时切换配置上下文

你可以使用 `withConfiguration()` 在特定配置的上下文中执行代码。当你需要为非当前活动的注册生成 URL 或访问配置值时，这很有用：

```php
$archivedUrl = OrderResource::withConfiguration('archived', function () {
    return OrderResource::getUrl('index');
});
```

## 在插件类中使用可配置资源

以下是插件向用户暴露可配置资源的完整示例：

```php
use Filament\Contracts\Plugin;
use Filament\Panel;

class TasksPlugin implements Plugin
{
    /** @var array<TaskResourceConfiguration> */
    protected array $taskResourceConfigurations = [];

    public static function make(): static
    {
        return app(static::class);
    }

    public function getId(): string
    {
        return 'tasks';
    }

    /**
     * @param  array<TaskResourceConfiguration>  $configurations
     */
    public function taskResources(array $configurations): static
    {
        $this->taskResourceConfigurations = $configurations;

        return $this;
    }

    public function register(Panel $panel): void
    {
        $panel->resources([
            TaskResource::class,
            ...$this->taskResourceConfigurations,
        ]);
    }

    public function boot(Panel $panel): void
    {
        //
    }
}
```

插件用户然后可以注册多个任务视图：

```php
use Vendor\TasksPlugin\TasksPlugin;
use Vendor\TasksPlugin\TaskResource;

public function panel(Panel $panel): Panel
{
    return $panel
        ->plugin(
            TasksPlugin::make()
                ->taskResources([
                    TaskResource::make('my-tasks')
                        ->ownedByCurrentUser(),
                    TaskResource::make('team-tasks')
                        ->ownedByCurrentTeam(),
                ])
        );
}
```
