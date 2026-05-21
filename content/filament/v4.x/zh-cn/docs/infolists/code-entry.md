---
title: 代码条目
---

## 简介

代码条目允许你在信息列表中呈现带有语法高亮的代码片段。它使用 [Phiki](https://github.com/phikiphp/phiki) 在服务器端进行代码高亮：

```php
use Filament\Infolists\Components\CodeEntry;
use Phiki\Grammar\Grammar;

CodeEntry::make('code')
    ->grammar(Grammar::Php)
```

![代码条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/code/simple.jpg)

要使用代码条目，你需要先安装 [`phiki/phiki`](https://github.com/phikiphp/phiki) Composer 包。Filament 默认不包含它，以便让你明确选择使用哪个主要版本的 Phiki，因为不同主要版本可能有不同的语法和主题可用。你可以使用以下命令安装最新版本的 Phiki：

```bash
composer require phiki/phiki
```

## 更改代码的语法（语言）

你可以使用 `grammar()` 方法更改代码的语法（语言）。有超过 200 种语法可用，你可以打开 `Phiki\Grammar\Grammar` 枚举类查看完整列表。要切换到使用 JavaScript 作为语法，可以使用 `Grammar::Javascript` 枚举值：

```php
use Filament\Infolists\Components\CodeEntry;
use Phiki\Grammar\Grammar;

CodeEntry::make('code')
    ->grammar(Grammar::Javascript)
```

除了允许静态值外，`grammar()` 方法还接受一个函数来动态计算它。你可以将各种实用工具作为参数注入到函数中。

![带有 JavaScript 语法高亮的代码条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/code/javascript.jpg)

:::tip
    如果你的代码条目内容是 PHP 数组，它将自动转换为 JSON 字符串，并且语法将设置为 `Grammar::Json`。你可以使用 `jsonFlags()` 方法自定义转换期间使用的 `JSON_` 标志。
:::

## 更改代码的主题（高亮）

你可以使用 `lightTheme()` 和 `darkTheme()` 方法更改代码的主题。有超过 50 种主题可用，你可以打开 `Phiki\Theme\Theme` 枚举类查看完整列表。要使用流行的 `Dracula` 主题，可以使用 `Theme::Dracula` 枚举值：

```php
use Filament\Infolists\Components\CodeEntry;
use Phiki\Theme\Theme;

CodeEntry::make('code')
    ->lightTheme(Theme::Dracula)
    ->darkTheme(Theme::Dracula)
```

除了允许静态值外，`lightTheme()` 和 `darkTheme()` 方法还接受函数来动态计算它们。你可以将各种实用工具作为参数注入到函数中。

![带有 Dracula 主题的代码条目](/assets/filament/v4.x/screenshots/images/light/infolists/entries/code/dracula.jpg)

## 允许代码复制到剪贴板

你可以使代码可复制，这样点击它就会将代码复制到剪贴板，并且可以选择指定自定义确认消息和持续时间（毫秒）。此功能仅在应用程序启用 SSL 时有效。

```php
use Filament\Infolists\Components\CodeEntry;

CodeEntry::make('code')
    ->copyable()
    ->copyMessage('Copied!')
    ->copyMessageDuration(1500)
```

你可以选择传递一个布尔值来控制代码是否应该可复制：

```php
use Filament\Infolists\Components\CodeEntry;

CodeEntry::make('code')
    ->copyable(FeatureFlag::active())
```

除了允许静态值外，`copyable()`、`copyMessage()` 和 `copyMessageDuration()` 方法还接受函数来动态计算它们。你可以将各种实用工具作为参数注入到函数中。
