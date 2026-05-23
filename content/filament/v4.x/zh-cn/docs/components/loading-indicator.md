---
title: Loading Indicator Blade 组件
---

## 简介

Loading Indicator 是一个动画 SVG，可用于指示某个操作正在进行中：

```blade
<x-filament::loading-indicator class="h-5 w-5" />
```

![一个加载指示器](/assets/filament/v4.x/screenshots/images/light/components/loading-indicator/simple.jpg)

## 替换默认的加载指示器

Filament 通过 `Filament\Support\Contracts\LoadingIndicator` 契约来渲染加载指示器，默认绑定到 `Filament\Support\View\DefaultLoadingIndicator`。你可以通过在服务提供者中绑定不同的类来替换为自定义实现：

```php
use App\Support\CustomLoadingIndicator;
use Filament\Support\Contracts\LoadingIndicator;

public function register(): void
{
    $this->app->bind(LoadingIndicator::class, CustomLoadingIndicator::class);
}
```

你的类必须实现 `LoadingIndicator` 契约，其 `toHtml()` 方法接收一个 `ComponentAttributeBag` 并返回指示器的 HTML：

```php
namespace App\Support;

use Filament\Support\Contracts\LoadingIndicator;
use Illuminate\View\ComponentAttributeBag;

class CustomLoadingIndicator implements LoadingIndicator
{
    public function toHtml(ComponentAttributeBag $attributes): string
    {
        return <<<HTML
            <svg {$attributes->toHtml()}>
                <!-- ... -->
            </svg>
        HTML;
    }
}
```

属性中已经包含了 `fi-icon fi-loading-indicator` 和尺寸钩子类，因此你可以直接将它们传递给根元素。

:::warning
解析后的 `LoadingIndicator` 实例会在 PHP 进程的生命周期内被缓存。在 Laravel Octane 下，这意味着绑定仅在 worker 启动时解析一次，不会在请求之间重新解析。请在服务提供者中注册绑定，而不是在运行时重新绑定。
:::
