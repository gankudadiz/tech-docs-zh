---
title: 提示框
---

## 简介

提示框用于引起对重要信息或消息的注意。它们通常用于警报、通知或提示。你可以使用 `Callout` 组件创建提示框：

```php
use Filament\Schemas\Components\Callout;

Callout::make('新版本可用')
    ->description('Filament v4 已发布，包含令人兴奋的新功能和改进。')
    ->info()
```

:::tip
除了允许静态值外，`make()` 和 `description()` 方法还接受函数来动态计算它们。你可以将各种实用工具作为参数注入到函数中。
:::

![提示框](/assets/filament/v4.x/screenshots/images/light/schemas/layout/callout/simple.jpg)

## 使用状态变体

提示框具有内置的状态变体，会自动设置适当的图标、图标颜色和背景颜色。你可以使用 `danger()`、`info()`、`success()` 或 `warning()` 方法：

```php
use Filament\Schemas\Components\Callout;

Callout::make('支付成功')
    ->description('你的订单已确认，正在处理中。')
    ->success()

Callout::make('会话即将过期')
    ->description('你的会话将在 5 分钟后过期。保存你的工作以避免丢失更改。')
    ->warning()

Callout::make('连接失败')
    ->description('无法连接到服务器。请检查你的互联网连接。')
    ->danger()
```

![提示框状态](/assets/filament/v4.x/screenshots/images/light/schemas/layout/callout/statuses.jpg)

## 移除背景颜色

默认情况下，状态提示框有彩色背景。你可以使用 `color(null)` 移除背景颜色，同时保留状态图标和图标颜色：

```php
use Filament\Schemas\Components\Callout;

Callout::make('计划维护')
    ->description('系统将于周日凌晨 2:00 至 4:00 不可用。')
    ->warning()
    ->color(null)
```

:::tip
除了允许静态值外，`color()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。
:::

![没有背景的提示框](/assets/filament/v4.x/screenshots/images/light/schemas/layout/callout/without-background.jpg)

## 添加自定义图标

你可以使用 `icon()` 方法向提示框添加自定义[图标](../styling/icons)：

```php
use Filament\Schemas\Components\Callout;
use Filament\Support\Icons\Heroicon;

Callout::make('专业提示')
    ->description('你可以使用键盘快捷键更快地导航。按 ? 查看所有可用快捷键。')
    ->icon(Heroicon::OutlinedLightBulb)
```

:::tip
除了允许静态值外，`icon()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。
:::

### 更改图标颜色

你可以使用 `iconColor()` 方法更改图标颜色：

```php
use Filament\Schemas\Components\Callout;
use Filament\Support\Icons\Heroicon;

Callout::make('专业提示')
    ->description('你可以使用键盘快捷键更快地导航。按 ? 查看所有可用快捷键。')
    ->icon(Heroicon::OutlinedLightBulb)
    ->iconColor('primary')
```

:::tip
除了允许静态值外，`iconColor()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。
:::

![带有自定义图标的提示框](/assets/filament/v4.x/screenshots/images/light/schemas/layout/callout/custom-icon.jpg)

### 更改图标大小

默认情况下，图标大小为"大"。你可以使用 `iconSize()` 方法将其更改为"小"或"中"：

```php
use Filament\Schemas\Components\Callout;
use Filament\Support\Enums\IconSize;

Callout::make('快速说明')
    ->description('此提示框的图标较小。')
    ->info()
    ->iconSize(IconSize::Small)
```

:::tip
除了允许静态值外，`iconSize()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。
:::

![带有小图标的提示框](/assets/filament/v4.x/screenshots/images/light/schemas/layout/callout/icon-size.jpg)

## 使用自定义背景颜色

你可以使用 `color()` 方法设置自定义背景颜色：

```php
use Filament\Schemas\Components\Callout;
use Filament\Support\Icons\Heroicon;

Callout::make('专业提示')
    ->description('你可以使用键盘快捷键更快地导航。按 ? 查看所有可用快捷键。')
    ->color('primary')
    ->icon(Heroicon::OutlinedLightBulb)
    ->iconColor('primary')
```

![带有自定义颜色的提示框](/assets/filament/v4.x/screenshots/images/light/schemas/layout/callout/custom-color.jpg)

## 向提示框页脚添加操作

你可以使用 `actions()` 方法向提示框页脚添加[操作](../actions/overview)：

```php
use Filament\Actions\Action;
use Filament\Schemas\Components\Callout;

Callout::make('你的试用将在 3 天后结束')
    ->description('立即升级以保持对所有高级功能的访问。')
    ->warning()
    ->actions([
        Action::make('upgrade')
            ->label('升级到专业版')
            ->button(),
        Action::make('compare')
            ->label('比较方案'),
    ])
```

:::tip
除了允许静态值外，`actions()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。
:::

![带有操作的提示框](/assets/filament/v4.x/screenshots/images/light/schemas/layout/callout/actions.jpg)

### 更改页脚操作对齐方式

默认情况下，操作对齐到起始位置。你可以使用 `footerActionsAlignment()` 方法更改对齐方式：

```php
use Filament\Actions\Action;
use Filament\Schemas\Components\Callout;
use Filament\Support\Enums\Alignment;

Callout::make('更新可用')
    ->description('新功能和改进已准备好安装。')
    ->info()
    ->actions([
        Action::make('install')->label('立即安装'),
        Action::make('later')->label('稍后提醒我'),
    ])
    ->footerActionsAlignment(Alignment::End)
```

可用的对齐选项有 `Alignment::Start`、`Alignment::Center`、`Alignment::End` 和 `Alignment::Between`。

:::tip
除了允许静态值外，`footerActionsAlignment()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。
:::

![操作对齐到末尾的提示框](/assets/filament/v4.x/screenshots/images/light/schemas/layout/callout/actions-aligned-end.jpg)

## 添加自定义页脚内容

你可以使用 `footer()` 方法向页脚添加自定义内容。此方法接受一个 schema 组件数组：

```php
use Filament\Actions\Action;
use Filament\Schemas\Components\Callout;
use Filament\Schemas\Components\Text;

Callout::make('备份完成')
    ->description('你的数据已成功备份到云端。')
    ->success()
    ->footer([
        Text::make('上次备份：5 分钟前')
            ->color('gray'),
        Action::make('viewBackups')
            ->label('查看所有备份')
            ->button(),
    ])
```

:::tip
除了允许静态值外，`footer()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。
:::

![带有自定义页脚内容的提示框](/assets/filament/v4.x/screenshots/images/light/schemas/layout/callout/footer.jpg)

## 添加自定义控制内容

你可以使用 `controls()` 方法向控件（右上角）添加自定义内容。此方法接受一个 schema 组件数组：

```php
use Filament\Actions\Action;
use Filament\Schemas\Components\Callout;

Callout::make('备份完成')
    ->description('你的数据已成功备份到云端。')
    ->success()
    ->controls([
        Action::make('dismiss')
            ->icon('heroicon-m-x-mark')
            ->iconButton()
            ->color('gray'),
    ])
```

:::tip
除了允许静态值外，`controls()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。
:::

## 向提示框添加控制操作

你可以使用 `controlActions()` 方法向提示框的右上角添加控制[操作](../actions/overview)。例如，你可以添加一个关闭按钮，在用户会话期间隐藏提示框：

```php
use Filament\Actions\Action;
use Filament\Schemas\Components\Callout;
use Filament\Support\Icons\Heroicon;

Callout::make('新版本可用')
    ->description('Filament v4 已发布，包含令人兴奋的新功能和改进。')
    ->info()
    ->controlActions([
        Action::make('dismiss')
            ->icon(Heroicon::XMark)
            ->iconButton()
            ->color('gray')
            ->action(fn () => session()->put('new-version-callout-dismissed', true)),
    ])
    ->visible(fn (): bool => ! session()->get('new-version-callout-dismissed'))
```

![带有控制操作的提示框](/assets/filament/v4.x/screenshots/images/light/schemas/layout/callout/control-actions.jpg)
