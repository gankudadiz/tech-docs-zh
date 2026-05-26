---
title: wire:poll
source: https://github.com/livewire/livewire/blob/v3.8.0/docs/wire-poll.md
source_version: v3.8.0
translation_status: draft
---

轮询是 Web 应用中用于定期向服务器"询问"更新的技术。这是一种保持页面更新的简单方式，无需使用像 [WebSockets](/docs/livewire/v3.x/events#real-time-events-using-laravel-echo) 这样更复杂的技术。

## 基本用法

在 Livewire 中使用轮询就像在元素上添加 `wire:poll` 一样简单。

以下是一个显示用户订阅者数量的 `SubscriberCount` 组件示例：

```php
<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;
use Livewire\Component;

class SubscriberCount extends Component
{
    public function render()
    {
        return view('livewire.subscriber-count', [
            'count' => Auth::user()->subscribers->count(),
        ]);
    }
}
```

```blade
<div wire:poll> <!-- [tl! highlight] -->
    Subscribers: {{ $count }}
</div>
```

通常情况下，该组件会显示用户的订阅者数量，并且直到页面刷新才会更新。但由于组件模板上的 `wire:poll`，该组件现在会每 `2.5` 秒刷新一次，保持订阅者数量为最新。

你也可以通过向 `wire:poll` 传递值来指定轮询间隔触发的方法：

```blade
<div wire:poll="refreshSubscribers">
    Subscribers: {{ $count }}
</div>
```

现在，组件上的 `refreshSubscribers()` 方法将每 `2.5` 秒调用一次。

## 时间控制

轮询的主要缺点是资源消耗较大。如果你有一千个访问者在同一个使用轮询的页面上，每 `2.5` 秒就会触发一千个网络请求。

在这种情况下减少请求的最佳方法就是延长轮询间隔。

你可以通过将所需持续时间附加到 `wire:poll` 来手动控制组件的轮询频率，如下所示：

```blade
<div wire:poll.15s> <!-- 以秒为单位... -->

<div wire:poll.15000ms> <!-- 以毫秒为单位... -->
```

## 后台节流

为了进一步减少服务器请求，Livewire 会在页面处于后台时自动节流轮询。例如，如果用户在另一个浏览器标签页中打开了页面，Livewire 会将轮询请求减少 95%，直到用户重新访问该标签页。

如果你想退出此行为并保持持续轮询（即使标签页在后台），可以为 `wire:poll` 添加 `.keep-alive` 修饰符：

```blade
<div wire:poll.keep-alive>
```

## 视口节流

另一种仅在必要时进行轮询的措施是，为 `wire:poll` 添加 `.visible` 修饰符。`.visible` 修饰符指示 Livewire 仅在组件在页面上可见时才进行轮询：

```blade
<div wire:poll.visible>
```

如果使用 `wire:visible` 的组件位于长页面的底部，它直到用户滚动到视口中才会开始轮询。当用户滚动离开时，它将再次停止轮询。
