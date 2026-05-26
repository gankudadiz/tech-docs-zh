---
title: 事件
source: https://github.com/livewire/livewire/blob/v3.8.0/docs/events.md
source_version: v3.8.0
translation_status: completed
---

Livewire 提供了一个强大的事件系统，可用于在页面上的不同组件之间通信。由于它在底层使用浏览器事件，因此你也可以使用 Livewire 的事件系统与 Alpine 组件或甚至普通的原生 JavaScript 进行通信。

要触发事件，你可以在组件中的任何位置使用 `dispatch()` 方法，并从页面上的任何其他组件监听该事件。

## 分发事件

要从 Livewire 组件分发事件，可以调用 `dispatch()` 方法，传入事件名称以及你想随事件发送的任何附加数据。

下面是一个从 `CreatePost` 组件分发 `post-created` 事件的示例：

```php
use Livewire\Component;

class CreatePost extends Component
{
    public function save()
    {
		// ...

		$this->dispatch('post-created'); // [tl! highlight]
    }
}
```

在此示例中，当调用 `dispatch()` 方法时，`post-created` 事件将被分发，页面上每个正在监听此事件的其他组件都会收到通知。

你可以通过将数据作为第二个参数传递给 `dispatch()` 方法来随事件发送附加数据：

```php
$this->dispatch('post-created', title: $post->title);
```

## 监听事件

要在 Livewire 组件中监听事件，请在要响应事件分发的方法上方添加 `#[On]` 属性：

:::warning[警告]
确保导入属性类
请确保导入所有属性类。例如，下面的 `#[On()]` 属性需要导入 `use Livewire\Attributes\On;`。
:::

```php
use Livewire\Component;
use Livewire\Attributes\On; // [tl! highlight]

class Dashboard extends Component
{
	#[On('post-created')] // [tl! highlight]
    public function updatePostList($title)
    {
		// ...
    }
}
```

现在，当从 `CreatePost` 分发 `post-created` 事件时，将触发一个网络请求并调用 `updatePostList()` 动作。

如你所见，随事件发送的附加数据将作为第一个参数提供给该动作。

### 监听动态事件名

有时你可能希望使用组件中的数据在运行时动态生成事件监听器名称。

例如，如果你希望将事件监听器限定到特定的 Eloquent 模型，可以在分发时将模型 ID 附加到事件名称后面，如下所示：

```php
use Livewire\Component;

class UpdatePost extends Component
{
    public function update()
    {
        // ...

        $this->dispatch("post-updated.{$post->id}"); // [tl! highlight]
    }
}
```

然后监听该特定模型：

```php
use Livewire\Component;
use App\Models\Post;
use Livewire\Attributes\On; // [tl! highlight]

class ShowPost extends Component
{
    public Post $post;

	#[On('post-updated.{post.id}')] // [tl! highlight]
    public function refreshPost()
    {
		// ...
    }
}
```

如果上面的 `$post` 模型 ID 为 `3`，则 `refreshPost()` 方法只会被名为 `post-updated.3` 的事件触发。

### 监听来自特定子组件的事件

Livewire 允许你在 Blade 模板中直接监听单个子组件的事件，如下所示：

```blade
<div>
    <livewire:edit-post @saved="$refresh">

    <!-- ... -->
</div>
```

在上述场景中，如果 `edit-post` 子组件分发了一个 `saved` 事件，父组件的 `$refresh` 将被调用，并且父组件会被刷新。

除了传递 `$refresh`，你还可以传递任何通常用于 `wire:click` 的方法。以下是一个调用 `close()` 方法的示例，该方法可能用于关闭模态对话框：

```blade
<livewire:edit-post @saved="close">
```

如果子组件随请求分发了参数，例如 `$this->dispatch('saved', postId: 1)`，你可以使用以下语法将这些值转发给父方法：

```blade
<livewire:edit-post @saved="close($event.detail.postId)">
```

## 使用 JavaScript 与事件交互

当你在应用程序中从 JavaScript 与 Livewire 的事件系统交互时，它会变得更加强大。这使你应用程序中的任何其他 JavaScript 都可以与页面上的 Livewire 组件进行通信。

### 在组件脚本中监听事件

你可以通过 `@script` 指令轻松地在组件模板内监听 `post-created` 事件，如下所示：

```html
@script
<script>
    $wire.on('post-created', () => {
        //
    });
</script>
@endscript
```

上面的代码片段会监听注册它的组件中的 `post-created` 事件。如果该组件不再在页面上，事件监听器将不再被触发。

[了解更多关于在 Livewire 组件中使用 JavaScript 的信息 →](/docs/livewire/v3.x/javascript#using-javascript-in-livewire-components)

### 从组件脚本分发事件

此外，你可以从组件的 `@script` 中分发事件，如下所示：

```html
@script
<script>
    $wire.dispatch('post-created');
</script>
@endscript
```

当上面的 `@script` 运行时，`post-created` 事件将被分发到其定义所在的组件。

要仅将事件分发给脚本所在的组件，而不分发给页面上的其他组件（防止事件"冒泡"），你可以使用 `dispatchSelf()`：

```js
$wire.dispatchSelf('post-created');
```

你可以通过向 `dispatch()` 传递一个对象作为第二个参数来随事件传递任何附加参数：

```html
@script
<script>
    $wire.dispatch('post-created', { refreshPosts: true });
</script>
@endscript
```

现在，你可以在 Livewire 类以及其他 JavaScript 事件监听器中访问这些事件参数。

以下是在 Livewire 类中接收 `refreshPosts` 参数的示例：

```php
use Livewire\Attributes\On;

// ...

#[On('post-created')]
public function handleNewPost($refreshPosts = false)
{
    //
}
```

你也可以通过事件的 `detail` 属性从 JavaScript 事件监听器访问 `refreshPosts` 参数：

```html
@script
<script>
    $wire.on('post-created', (event) => {
        let refreshPosts = event.detail.refreshPosts

        // ...
    });
</script>
@endscript
```

[了解更多关于在 Livewire 组件中使用 JavaScript 的信息 →](/docs/livewire/v3.x/javascript#using-javascript-in-livewire-components)

### 从全局 JavaScript 监听 Livewire 事件

或者，你可以使用 `Livewire.on` 从应用程序中的任何脚本全局监听 Livewire 事件：

```html
<script>
    document.addEventListener('livewire:init', () => {
       Livewire.on('post-created', (event) => {
           //
       });
    });
</script>
```

上面的代码片段会监听从页面上任何组件分发的 `post-created` 事件。

如果你因任何原因希望移除此事件监听器，可以使用返回的 `cleanup` 函数：

```html
<script>
    document.addEventListener('livewire:init', () => {
        let cleanup = Livewire.on('post-created', (event) => {
            //
        });

        // 调用 "cleanup()" 将注销上述事件监听器...
        cleanup();
    });
</script>
```

## Alpine 中的事件

因为 Livewire 事件在底层就是普通的浏览器事件，你可以使用 Alpine 来监听甚至分发它们。

### 在 Alpine 中监听 Livewire 事件

例如，我们可以使用 Alpine 轻松监听 `post-created` 事件：

```blade
<div x-on:post-created="..."></div>
```

上面的代码片段会监听来自 `x-on` 指令所在 HTML 元素的任何 Livewire 子组件的 `post-created` 事件。

要监听页面上任何 Livewire 组件的事件，可以在监听器上添加 `.window`：

```blade
<div x-on:post-created.window="..."></div>
```

如果你想访问随事件发送的附加数据，可以使用 `$event.detail`：

```blade
<div x-on:post-created="notify('新文章：' + $event.detail.title)"></div>
```

Alpine 文档提供了关于[监听事件](https://alpinejs.dev/directives/on)的更多信息。

### 从 Alpine 分发 Livewire 事件

从 Alpine 分发的任何事件都可以被 Livewire 组件拦截。

例如，我们可以从 Alpine 轻松分发 `post-created` 事件：

```blade
<button @click="$dispatch('post-created')">...</button>
```

与 Livewire 的 `dispatch()` 方法类似，你可以通过将数据作为第二个参数传递给方法来随事件传递附加数据：

```blade
<button @click="$dispatch('post-created', { title: '文章标题' })">...</button>
```

要了解有关使用 Alpine 分发事件的更多信息，请查阅 [Alpine 文档](https://alpinejs.dev/magics/dispatch)。

:::tip[你可能不需要事件]
如果你使用事件是为了从子组件调用父组件的行为，你可以直接在 Blade 模板中使用 `$parent` 从子组件调用动作。例如：

```blade
<button wire:click="$parent.showCreatePostForm()">创建文章</button>
```

[了解更多关于 $parent 的信息](/docs/livewire/v3.x/nesting#directly-accessing-the-parent-from-the-child)。
:::

## 直接分发到另一个组件

如果你希望使用事件在页面上的两个组件之间直接通信，可以使用 `dispatch()->to()` 修饰符。

下面是 `CreatePost` 组件将 `post-created` 事件直接分发到 `Dashboard` 组件，跳过任何其他监听该特定事件的组件的示例：

```php
use Livewire\Component;

class CreatePost extends Component
{
    public function save()
    {
		// ...

		$this->dispatch('post-created')->to(Dashboard::class);
    }
}
```

## 将组件事件分发给自己

使用 `dispatch()->self()` 修饰符，你可以将事件限制为仅能被触发它的组件拦截：

```php
use Livewire\Component;

class CreatePost extends Component
{
    public function save()
    {
		// ...

		$this->dispatch('post-created')->self();
    }
}
```

## 从 Blade 模板分发事件

你可以使用 JavaScript 函数 `$dispatch` 直接从 Blade 模板分发事件。当你希望从用户交互（如按钮点击）触发事件时，这非常有用：

```blade
<button wire:click="$dispatch('show-post-modal', { id: {{ $post->id }} })">
    编辑文章
</button>
```

在此示例中，当按钮被点击时，`show-post-modal` 事件将随指定的数据一起被分发。

如果你想直接将事件分发到另一个组件，可以使用 JavaScript 函数 `$dispatchTo()`：

```blade
<button wire:click="$dispatchTo('posts', 'show-post-modal', { id: {{ $post->id }} })">
    编辑文章
</button>
```

在此示例中，当按钮被点击时，`show-post-modal` 事件将直接被分发到 `Posts` 组件。

## 测试分发的事件

要测试组件分发的事件，请在 Livewire 测试中使用 `assertDispatched()` 方法。该方法检查组件的生命周期中是否已分发特定事件：

```php
<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Livewire\CreatePost;
use Livewire\Livewire;

class CreatePostTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_dispatches_post_created_event()
    {
        Livewire::test(CreatePost::class)
            ->call('save')
            ->assertDispatched('post-created');
    }
}
```

在此示例中，测试确保当调用 `CreatePost` 组件的 `save()` 方法时，`post-created` 事件被分发。

### 测试事件监听器

要测试事件监听器，你可以从测试环境分发事件，并断言组件响应事件执行了预期的操作：

```php
<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Livewire\Dashboard;
use Livewire\Livewire;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_updates_post_count_when_a_post_is_created()
    {
        Livewire::test(Dashboard::class)
            ->assertSee('已创建文章：0')
            ->dispatch('post-created')
            ->assertSee('已创建文章：1');
    }
}
```

在此示例中，测试分发 `post-created` 事件，然后检查 `Dashboard` 组件是否正确处理该事件并显示更新后的计数。

## 使用 Laravel Echo 的实时事件

Livewire 与 [Laravel Echo](https://laravel.com/docs/broadcasting#client-side-installation) 配合得很好，可以使用 WebSockets 在网页上提供实时功能。

:::warning[警告]
安装 Laravel Echo 是前置条件
此功能假设你已经安装了 Laravel Echo 并且 `window.Echo` 对象在你的应用程序中全局可用。有关安装 Echo 的更多信息，请查看 [Laravel Echo 文档](https://laravel.com/docs/broadcasting#client-side-installation)。
:::

### 监听 Echo 事件

假设你的 Laravel 应用程序中有一个名为 `OrderShipped` 的事件：

```php
<?php

namespace App\Events;

use App\Models\Order;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderShipped implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Order $order;

    public function broadcastOn()
    {
        return new Channel('orders');
    }
}
```

你可以从应用程序的其他部分像这样分发此事件：

```php
use App\Events\OrderShipped;

OrderShipped::dispatch();
```

如果你仅使用 Laravel Echo 在 JavaScript 中监听此事件，代码大致如下：

```js
Echo.channel('orders')
    .listen('OrderShipped', e => {
        console.log(e.order)
    })
```

假设你已经安装并配置了 Laravel Echo，你可以从 Livewire 组件内部监听此事件。

下面是一个 `OrderTracker` 组件的示例，它监听 `OrderShipped` 事件以向用户显示新订单的视觉提示：

```php
<?php

namespace App\Livewire;

use Livewire\Attributes\On; // [tl! highlight]
use Livewire\Component;

class OrderTracker extends Component
{
    public $showNewOrderNotification = false;

    #[On('echo:orders,OrderShipped')]
    public function notifyNewOrder()
    {
        $this->showNewOrderNotification = true;
    }

    // ...
}
```

如果 Echo 频道中包含变量（例如订单 ID），你可以使用 `getListeners()` 方法而不是 `#[On]` 属性来定义监听器：

```php
<?php

namespace App\Livewire;

use Livewire\Attributes\On; // [tl! highlight]
use Livewire\Component;
use App\Models\Order;

class OrderTracker extends Component
{
    public Order $order;

    public $showOrderShippedNotification = false;

    public function getListeners()
    {
        return [
            "echo:orders.{$this->order->id},OrderShipped" => 'notifyShipped',
        ];
    }

    public function notifyShipped()
    {
        $this->showOrderShippedNotification = true;
    }

    // ...
}
```

或者，如果你愿意，可以使用动态事件名语法：

```php
#[On('echo:orders.{order.id},OrderShipped')]
public function notifyNewOrder()
{
    $this->showNewOrderNotification = true;
}
```

如果你需要访问事件负载，可以通过传入的 `$event` 参数来实现：

```php
#[On('echo:orders.{order.id},OrderShipped')]
public function notifyNewOrder($event)
{
    $order = Order::find($event['orderId']);

    //
}
```

### 使用 `broadcastAs()` 自定义广播事件名

默认情况下，Laravel 使用事件类名来广播事件。但是，你可以通过在事件类中实现 `broadcastAs()` 方法来自定义广播事件名。

例如，如果你有一个 `ScoreSubmitted` 事件，但希望将其广播为 `score.submitted`：

```php
<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ScoreSubmitted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function broadcastOn()
    {
        return new Channel('scores');
    }

    public function broadcastAs(): string
    {
        return 'score.submitted';
    }
}
```

在 Livewire 组件中监听此事件时，应使用 `broadcastAs()` 返回的自定义广播名，而不是类名。**重要：** 使用自定义广播名时，必须在其前面加上点号（`.`），以区别于带命名空间的事件类名。这是 [Laravel Echo 的约定](https://laravel.com/docs/broadcasting#broadcast-name)：

```php
<?php

namespace App\Livewire;

use Livewire\Attributes\On;
use Livewire\Component;

class ScoreBoard extends Component
{
    public $scores = [];

    #[On('echo:scores,.score.submitted')]
    public function handleScoreSubmitted($event)
    {
        $this->scores[] = $event['score'];
    }
}
```

在上面的例子中，Livewire 组件监听 `.score.submitted`（前面加点的自定义广播名），而不是 `ScoreSubmitted`（类名）。点号前缀告诉 Laravel Echo 不要将应用程序的命名空间（`App\Events`）添加到事件名前。

你也可以将自定义广播名与动态频道名一起使用：

```php
#[On('echo:scores.{game.id},.score.submitted')]
public function handleScoreSubmitted($event)
{
    $this->scores[] = $event['score'];
}
```

### 私有频道和在线频道

你也可以监听广播到私有频道和在线频道的事件：

:::info
在继续之前，请确保已为广播频道定义了[身份验证回调](https://laravel.com/docs/master/broadcasting#defining-authorization-callbacks)。
:::

```php
<?php

namespace App\Livewire;

use Livewire\Component;

class OrderTracker extends Component
{
    public $showNewOrderNotification = false;

    public function getListeners()
    {
        return [
            // 公共频道
            "echo:orders,OrderShipped" => 'notifyNewOrder',

            // 私有频道
            "echo-private:orders,OrderShipped" => 'notifyNewOrder',

            // 在线频道
            "echo-presence:orders,OrderShipped" => 'notifyNewOrder',
            "echo-presence:orders,here" => 'notifyNewOrder',
            "echo-presence:orders,joining" => 'notifyNewOrder',
            "echo-presence:orders,leaving" => 'notifyNewOrder',
        ];
    }

    public function notifyNewOrder()
    {
        $this->showNewOrderNotification = true;
    }
}
```
