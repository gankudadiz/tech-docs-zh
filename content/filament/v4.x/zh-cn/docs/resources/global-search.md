---
title: 全局搜索
---

## 简介

全局搜索允许你在应用中的任何位置搜索所有资源记录。

![全局搜索](/assets/filament/v4.x/screenshots/images/light/panels/resources/global-search.jpg)

## 设置全局搜索结果标题

要为模型启用全局搜索，你必须为资源[设置标题属性](overview#record-titles)：

```php
protected static ?string $recordTitleAttribute = 'title';
```

此属性用于获取搜索结果中该记录的标题。

:::warning
你的资源需要有编辑页面或查看页面，才能让全局搜索结果链接到 URL，否则该资源将不会返回任何结果。
:::

你可以通过覆盖 `getGlobalSearchResultTitle()` 方法来自定义标题。它可以返回纯文本字符串，或 `Illuminate\Support\HtmlString` 或 `Illuminate\Contracts\Support\Htmlable` 的实例。这允许你在搜索结果标题中渲染 HTML，甚至 Markdown：

```php
use Illuminate\Contracts\Support\Htmlable;

public static function getGlobalSearchResultTitle(Model $record): string | Htmlable
{
    return $record->name;
}
```

## 跨多列进行全局搜索

如果你想跨资源的多个列进行搜索，可以覆盖 `getGloballySearchableAttributes()` 方法。"点号表示法"允许你搜索关联关系内部的数据：

```php
public static function getGloballySearchableAttributes(): array
{
    return ['title', 'slug', 'author.name', 'category.name'];
}
```

## 向全局搜索结果添加额外详情

搜索结果可以在标题下方显示"详情"，为用户提供更多关于记录的信息。要启用此功能，你必须覆盖 `getGlobalSearchResultDetails()` 方法：

```php
public static function getGlobalSearchResultDetails(Model $record): array
{
    return [
        'Author' => $record->author->name,
        'Category' => $record->category->name,
    ];
}
```

在此示例中，记录的分类和作者将显示在搜索结果标题下方。

![带额外详情的全局搜索](/assets/filament/v4.x/screenshots/images/light/panels/resources/global-search-details.jpg)

然而，`category` 和 `author` 关联关系将被懒加载，这会导致性能问题。为了[预加载](https://laravel.com/docs/eloquent-relationships#eager-loading)这些关联关系，我们必须覆盖 `getGlobalSearchEloquentQuery()` 方法：

```php
public static function getGlobalSearchEloquentQuery(): Builder
{
    return parent::getGlobalSearchEloquentQuery()->with(['author', 'category']);
}
```

## 自定义全局搜索结果 URL

全局搜索结果将链接到资源的[编辑页面](editing-records)，或者如果用户没有[编辑权限](editing-records#authorization)，则链接到[查看页面](viewing-records)。要自定义这一点，你可以覆盖 `getGlobalSearchResultUrl()` 方法并返回你选择的路由：

```php
public static function getGlobalSearchResultUrl(Model $record): string
{
    return UserResource::getUrl('edit', ['record' => $record]);
}
```

## 向全局搜索结果添加操作

全局搜索支持操作，这些是渲染在每个搜索结果下方的按钮。它们可以打开 URL 或触发 Livewire 事件。

操作可以按如下方式定义：

```php
use Filament\Actions\Action;

public static function getGlobalSearchResultActions(Model $record): array
{
    return [
        Action::make('edit')
            ->url(static::getUrl('edit', ['record' => $record])),
    ];
}
```

你可以[在此](../actions/overview)了解更多关于如何设置操作按钮样式的信息。

![带操作的全局搜索](/assets/filament/v4.x/screenshots/images/light/panels/resources/global-search-actions.jpg)

### 从全局搜索操作打开 URL

点击操作时可以打开 URL，可选择在新标签页中打开：

```php
use Filament\Actions\Action;

Action::make('view')
    ->url(static::getUrl('view', ['record' => $record]), shouldOpenInNewTab: true)
```

### 从全局搜索操作触发 Livewire 事件

有时你希望在点击全局搜索结果操作时执行额外的代码。这可以通过设置一个 Livewire 事件来实现，该事件将在点击操作时被触发。你可以选择传递一个数据数组，该数组将在 Livewire 组件的事件监听器中作为参数可用：

```php
use Filament\Actions\Action;

Action::make('quickView')
    ->dispatch('quickView', [$record->id])
```

## 限制全局搜索结果数量

默认情况下，全局搜索每个资源最多返回 50 条结果。你可以通过覆盖 `$globalSearchResultsLimit` 属性来自定义此限制：

```php
protected static int $globalSearchResultsLimit = 20;
```

## 将全局搜索移至侧边栏

默认情况下，全局搜索字段位于顶部栏中。如果顶部栏被禁用，则将其添加到侧边栏中。

你可以通过在[配置](../panel-configuration)中向 `globalSearch()` 方法传递 `position` 参数来选择始终将其移至侧边栏：

```php
use Filament\Enums\GlobalSearchPosition;
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->globalSearch(position: GlobalSearchPosition::Sidebar);
}
```

## 对全局搜索结果排序

默认情况下，全局搜索结果按资源名称的字母顺序排序。你可以通过在资源上设置 `$globalSearchSort` 属性来自定义此顺序：

```php
protected static ?int $globalSearchSort = 3;
```

现在，排序值较低的导航项将出现在排序值较高的导航项之前 - 顺序为升序。

## 禁用全局搜索

如[上所述](#title)，一旦你为资源设置了标题属性，全局搜索就会自动启用。有时你可能希望指定标题属性而不启用全局搜索。

这可以通过在[配置](../panel-configuration)中禁用全局搜索来实现：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->globalSearch(false);
}
```

## 要求资源选择加入全局搜索

默认情况下，所有具有[标题属性](#setting-global-search-result-titles)的资源都包含在全局搜索结果中。如果你希望资源显式选择加入，可以在[配置](../panel-configuration)中使用 `globalSearchResourceOptIn()` 方法：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->globalSearchResourceOptIn();
}
```

现在，只有显式将 `$isGloballySearchable` 设置为 `true` 的资源才会包含在全局搜索结果中：

```php
protected static bool $isGloballySearchable = true;
```

未声明此属性的资源将被排除在全局搜索之外，即使它们设置了标题属性。

## 注册全局搜索键盘快捷键

全局搜索字段可以使用键盘快捷键打开。要配置这些，请在[配置](../panel-configuration)中传递 `globalSearchKeyBindings()` 方法：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->globalSearchKeyBindings(['command+k', 'ctrl+k']);
}
```

## 配置全局搜索防抖时间

全局搜索默认防抖时间为 500ms，以限制用户输入时发出的请求数量。你可以通过在[配置](../panel-configuration)中使用 `globalSearchDebounce()` 方法来更改此值：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->globalSearchDebounce('750ms');
}
```

## 配置全局搜索字段后缀

全局搜索字段默认不包含任何后缀。你可以在[配置](../panel-configuration)中使用 `globalSearchFieldSuffix()` 方法来自定义它。

如果你想在后缀中显示当前配置的[全局搜索键盘快捷键](#registering-global-search-key-bindings)，可以使用 `globalSearchFieldKeyBindingSuffix()` 方法，它将显示第一个注册的键盘快捷键作为全局搜索字段的后缀：

```php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->globalSearchFieldKeyBindingSuffix();
}
```

![带键盘快捷键后缀的全局搜索字段](/assets/filament/v4.x/screenshots/images/light/panels/resources/global-search-key-binding.jpg)

要自行自定义后缀，你可以向 `globalSearchFieldSuffix()` 方法传递字符串或函数。例如，为每个平台手动提供自定义键盘快捷键后缀：

```php
use Filament\Panel;
use Filament\Support\Enums\Platform;

public function panel(Panel $panel): Panel
{
    return $panel
        // ...
        ->globalSearchFieldSuffix(fn (): ?string => match (Platform::detect()) {
            Platform::Windows, Platform::Linux => 'CTRL+K',
            Platform::Mac => '⌘K',
            default => null,
        });
}
```

## 禁用搜索词拆分

默认情况下，全局搜索会将搜索词拆分为单独的单词，并分别搜索每个单词。这允许更灵活的搜索查询。但是，当涉及大型数据集时，它可能会对性能产生负面影响。你可以通过在资源上将 `$shouldSplitGlobalSearchTerms` 属性设置为 `false` 来禁用此行为：

```php
protected static ?bool $shouldSplitGlobalSearchTerms = false;
```
