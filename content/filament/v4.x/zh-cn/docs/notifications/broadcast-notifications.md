---
title: 广播通知
---

## 简介

默认情况下，Filament 通过 Laravel 会话发送闪存通知。但是，你可能希望通知实时"广播"给用户。这可用于在队列作业处理完成后从队列作业中发送临时成功通知。

我们与 [Laravel Echo](https://laravel.com/docs/broadcasting#client-side-installation) 有原生集成。确保已安装 Echo，以及[服务器端 Websocket 集成](https://laravel.com/docs/broadcasting#server-side-installation)如 Pusher。

## 发送广播通知

有几种方式可以发送广播通知，取决于哪种最适合你。

可以使用流畅的 API：

```php
use Filament\Notifications\Notification;

$recipient = auth()->user();

Notification::make()
    ->title('Saved successfully')
    ->broadcast($recipient);
```

或使用 `notify()` 方法：

```php
use Filament\Notifications\Notification;

$recipient = auth()->user();

$recipient->notify(
    Notification::make()
        ->title('Saved successfully')
        ->toBroadcast(),
)
```

或者，使用传统的 [Laravel 通知类](https://laravel.com/docs/notifications#generating-notifications)，从 `toBroadcast()` 方法返回通知：

```php
use App\Models\User;
use Filament\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage;

public function toBroadcast(User $notifiable): BroadcastMessage
{
    return Notification::make()
        ->title('Saved successfully')
        ->getBroadcastMessage();
}
```

## 在面板中设置 Websocket

面板构建器内置了对实时广播和数据库通知的支持。但是，你需要安装和配置多个部分才能将所有内容连接起来并使其正常工作。

1. 如果还没有，请阅读 Laravel 文档中的[广播](https://laravel.com/docs/broadcasting)部分。
2. 安装并配置广播以使用[服务器端 Websocket 集成](https://laravel.com/docs/broadcasting#server-side-installation)如 Pusher。
3. 如果还没有，你需要发布 Filament 包配置：

```bash
php artisan vendor:publish --tag=filament-config
```

4. 编辑 `config/filament.php` 中的配置，取消注释 `broadcasting.echo` 部分 - 确保设置根据你的广播安装正确配置。
5. 确保[相关的 `VITE_*` 条目](https://laravel.com/docs/broadcasting#client-pusher-channels)存在于你的 `.env` 文件中。
6. 使用 `php artisan route:clear` 和 `php artisan config:clear` 清除相关缓存，以确保新配置生效。

你的面板现在应该正在连接到你的广播服务。例如，如果你登录到 Pusher 调试控制台，每次加载页面时都应该看到一个传入连接。
