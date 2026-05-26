---
title: 懒加载
source: https://github.com/livewire/livewire/blob/v3.8.0/docs/lazy.md
source_version: v3.8.0
translation_status: draft
---

Livewire 允许你对那些会拖慢初始页面加载的组件进行懒加载。

例如，假设你有一个 `Revenue` 组件，其 `mount()` 方法中包含一个慢速数据库查询：

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Transaction;

class Revenue extends Component
{
    public $amount;

    public function mount()
    {
        // 慢速数据库查询...
        $this->amount = Transaction::monthToDate()->sum('amount');
    }

    public function render()
    {
        return view('livewire.revenue');
    }
}
```

```blade
<div>
    本月收入：{{ $amount }}
</div>
```

如果没有懒加载，这个组件会延迟整个页面的加载，让你的整个应用感觉响应缓慢。

要启用懒加载，你可以向组件传递 `lazy` 参数：

```blade
<livewire:revenue lazy />
```

现在，Livewire 不会立即加载此组件，而是先跳过它，在页面无此组件的情况下完成加载。然后，当组件进入浏览器视口时，Livewire 会发起一个网络请求来将组件完整加载到页面上。

:::info 懒加载请求默认是隔离的
与 Livewire 中的其他网络请求不同，懒加载更新在发送到服务器时是彼此隔离的。这通过在每个页面加载时并行加载每个组件来保持懒加载的速度。[在此处阅读有关禁用此行为的更多信息 →](#禁用请求隔离)
:::

## 渲染占位符 HTML

默认情况下，Livewire 会在组件完全加载之前插入一个空的 `<div></div>`。由于组件初始时对用户不可见，当组件突然出现在页面上时可能会让人感到突兀。

为了向用户表明组件正在加载中，你可以定义一个 `placeholder()` 方法来渲染任何你想要的占位符 HTML，包括加载旋转器和骨架占位符：

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Transaction;

class Revenue extends Component
{
    public $amount;

    public function mount()
    {
        // 慢速数据库查询...
        $this->amount = Transaction::monthToDate()->sum('amount');
    }

    public function placeholder()
    {
        return <<<'HTML'
        <div>
            <!-- 加载旋转器... -->
            <svg>...</svg>
        </div>
        HTML;
    }

    public function render()
    {
        return view('livewire.revenue');
    }
}
```

由于上述组件通过 `placeholder()` 方法返回 HTML 来指定"占位符"，用户在组件完全加载之前会看到页面上有一个 SVG 加载旋转器。

:::warning 占位符和组件必须共享相同的元素类型
例如，如果你的占位符根元素类型是 'div'，你的组件也必须使用 'div' 元素。
:::

### 通过视图渲染占位符

对于更复杂的加载器（如骨架屏），你可以从 `placeholder()` 返回一个 `view`，类似于 `render()`。

```php
public function placeholder(array $params = [])
{
    return view('livewire.placeholders.skeleton', $params);
}
```

被懒加载的组件中的任何参数都将作为 `$params` 参数传递给 `placeholder()` 方法。

## 在视口之外懒加载

默认情况下，懒加载的组件在进入浏览器视口之前不会完全加载，例如当用户滚动到该组件时。

如果你希望在页面加载后立即加载页面上所有组件，而不等待它们进入视口，可以通过向 `lazy` 参数传递 "on-load" 来实现：

```blade
<livewire:revenue lazy="on-load" />
```

现在，此组件将在页面准备就绪后立即加载，而无需等待它进入视口。

## 传递属性

一般来说，你可以像对待普通组件一样对待 `lazy` 组件，因为你仍然可以从外部向它们传递数据。

例如，下面是一个场景，你可能从父组件向 `Revenue` 组件传递时间间隔：

```blade
<input type="date" wire:model="start">
<input type="date" wire:model="end">

<livewire:revenue lazy :$start :$end />
```

你可以像其他组件一样在 `mount()` 中接收这些数据：

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Transaction;

class Revenue extends Component
{
    public $amount;

    public function mount($start, $end)
    {
        // 昂贵的数据库查询...
        $this->amount = Transactions::between($start, $end)->sum('amount');
    }

    public function placeholder()
    {
        return <<<'HTML'
        <div>
            <!-- 加载旋转器... -->
            <svg>...</svg>
        </div>
        HTML;
    }

    public function render()
    {
        return view('livewire.revenue');
    }
}
```

然而，与普通组件加载不同，`lazy` 组件必须序列化或"脱水"任何传入的属性，并将其临时存储在客户端，直到组件完全加载。

例如，你可能想要向 `Revenue` 组件传递一个 Eloquent 模型：

```blade
<livewire:revenue lazy :$user />
```

在普通组件中，实际的 PHP 内存中的 `$user` 模型会被传递给 `Revenue` 的 `mount()` 方法。但是，因为我们要等到下一次网络请求才运行 `mount()`，Livewire 会在内部将 `$user` 序列化为 JSON，然后在处理下一次请求之前从数据库中重新查询它。

通常，这种序列化不应在你的应用中引起任何行为差异。

## 默认懒加载

如果你想强制所有对某个组件的使用都进行懒加载，可以在组件类上方添加 `#[Lazy]` 属性：

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use Livewire\Attributes\Lazy;

#[Lazy]
class Revenue extends Component
{
    // ...
}
```

如果你想覆盖懒加载行为，可以将 `lazy` 参数设为 `false`：

```blade
<livewire:revenue :lazy="false" />
```

### 禁用请求隔离

如果页面上有多个懒加载组件，每个组件将发起独立的网络请求，而不是将所有懒加载更新打包到单个请求中。

如果你想禁用这种隔离行为，而是将所有更新打包到单个网络请求中，可以使用 `isolate: false` 参数：

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use Livewire\Attributes\Lazy;

#[Lazy(isolate: false)] // [tl! highlight]
class Revenue extends Component
{
    // ...
}
```

现在，如果同一个页面上有十个 `Revenue` 组件，当页面加载时，所有十个更新将被打包并作为单个网络请求发送到服务器。

## 全页面懒加载

你可能希望对全页面 Livewire 组件进行懒加载。你可以通过在路由上调用 `->lazy()` 来实现：

```php
Route::get('/dashboard', \App\Livewire\Dashboard::class)->lazy();
```

或者，如果有一个默认懒加载的组件，而你想选择退出懒加载，可以使用以下 `enabled: false` 参数：

```php
Route::get('/dashboard', \App\Livewire\Dashboard::class)->lazy(enabled: false);
```

## 默认占位符视图

如果你想为所有组件设置一个默认的占位符视图，可以在 `/config/livewire.php` 配置文件中引用该视图：

```php
'lazy_placeholder' => 'livewire.placeholder',
```

现在，当一个组件被懒加载且未定义 `placeholder()` 时，Livewire 将使用配置的 Blade 视图（本例中为 `livewire.placeholder`）。

## 在测试中禁用懒加载

当对懒加载组件或包含嵌套懒加载组件的页面进行单元测试时，你可能希望禁用"懒加载"行为，以便可以断言最终的渲染行为。否则，这些组件在测试期间将渲染为占位符。

你可以使用 `Livewire::withoutLazyLoading()` 测试辅助方法轻松禁用懒加载，如下所示：

```php
<?php

namespace Tests\Feature\Livewire;

use App\Livewire\Dashboard;
use Livewire\Livewire;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    public function test_renders_successfully()
    {
        Livewire::withoutLazyLoading() // [tl! highlight]
            ->test(Dashboard::class)
            ->assertSee(...);
    }
}
```

现在，当为此测试渲染仪表板组件时，它将跳过渲染 `placeholder()`，而是直接渲染完整组件，就像根本没有应用懒加载一样。
