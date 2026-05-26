---
title: 测试
source: https://github.com/livewire/livewire/blob/v3.8.0/docs/testing.md
source_version: v3.8.0
translation_status: completed
---

## 创建你的第一个测试

通过在 `make:livewire` 命令后追加 `--test` 标志，你可以在创建组件的同时生成一个测试文件：

```shell
php artisan make:livewire create-post --test
```

除了生成组件文件本身，上面的命令还将生成以下测试文件 `tests/Feature/Livewire/CreatePostTest.php`：

如果你想创建 [Pest PHP](https://pestphp.com/) 测试，可以为 `make:livewire` 命令提供 `--pest` 选项：

```php
<?php

namespace Tests\Feature\Livewire;

use App\Livewire\CreatePost;
use Livewire\Livewire;
use Tests\TestCase;

class CreatePostTest extends TestCase
{
    public function test_renders_successfully()
    {
        Livewire::test(CreatePost::class)
            ->assertStatus(200);
    }
}
```

当然，你也可以手动创建这些文件，甚至在 Laravel 应用程序的任何其他现有 PHPUnit 测试中使用 Livewire 的测试工具。

在继续阅读之前，你可能希望熟悉一下 [Laravel 自身的内置测试功能](https://laravel.com/docs/testing)。

## 测试页面包含组件

你可以编写的最简单的 Livewire 测试是断言应用程序中的给定端点包含并成功渲染了给定的 Livewire 组件。

Livewire 提供了一个 `assertSeeLivewire()` 方法，可以从任何 Laravel 测试中使用：

```php
<?php

namespace Tests\Feature\Livewire;

use App\Livewire\CreatePost;
use Tests\TestCase;

class CreatePostTest extends TestCase
{
    public function test_component_exists_on_the_page()
    {
        $this->get('/posts/create')
            ->assertSeeLivewire(CreatePost::class);
    }
}
```

:::tip[这些被称为冒烟测试]
冒烟测试是确保应用程序中没有重大问题的宽泛测试。虽然这看起来像是不值得编写的测试，但无论如何，这是你可以编写的最有价值的测试之一，因为它们几乎不需要维护，并且为你提供了应用程序能够成功渲染且没有重大错误的基本信心。
:::

## 测试视图

Livewire 提供了一个简单而强大的工具来断言组件渲染输出中存在文本：`assertSee()`。

下面是一个使用 `assertSee()` 确保数据库中所有文章都显示在页面上的示例：

```php
<?php

namespace Tests\Feature\Livewire;

use App\Livewire\ShowPosts;
use Livewire\Livewire;
use App\Models\Post;
use Tests\TestCase;

class ShowPostsTest extends TestCase
{
    public function test_displays_posts()
    {
        Post::factory()->make(['title' => '关于好好洗澡']);
        Post::factory()->make(['title' => '没有比洗澡时间更好的了']);

        Livewire::test(ShowPosts::class)
            ->assertSee('关于好好洗澡')
            ->assertSee('没有比洗澡时间更好的了');
    }
}
```

### 断言视图的数据

除了断言渲染视图的输出外，有时测试传递给视图的数据也很有帮助。

以下是同一个测试，但测试的是视图数据而不是渲染输出：

```php
<?php

namespace Tests\Feature\Livewire;

use App\Livewire\ShowPosts;
use Livewire\Livewire;
use App\Models\Post;
use Tests\TestCase;

class ShowPostsTest extends TestCase
{
    public function test_displays_all_posts()
    {
        Post::factory()->make(['title' => '关于好好洗澡']);
        Post::factory()->make(['title' => '浴缸是我的避难所']);

        Livewire::test(ShowPosts::class)
            ->assertViewHas('posts', function ($posts) {
                return count($posts) == 2;
            });
    }
}
```

如你所见，`assertViewHas()` 让你能够控制要对指定数据进行哪些断言。

如果你希望进行简单的断言，例如确保一条视图数据与给定值匹配，你可以将值直接作为第二个参数传递给 `assertViewHas()` 方法。

例如，假设你有一个名为 `$postCount` 的变量被传递到视图中，你可以像这样对其字面值进行断言：

```php
$this->assertViewHas('postCount', 3)
```

## 设置已认证用户

大多数 Web 应用程序要求用户登录后才能使用。Livewire 提供了 `actingAs()` 方法，无需在测试开始时手动验证假用户。

下面是一个测试示例，其中有多个用户有文章，但已认证用户应该只能看到自己的文章：

```php
<?php

namespace Tests\Feature\Livewire;

use App\Livewire\ShowPosts;
use Livewire\Livewire;
use App\Models\User;
use App\Models\Post;
use Tests\TestCase;

class ShowPostsTest extends TestCase
{
    public function test_user_only_sees_their_own_posts()
    {
        $user = User::factory()
            ->has(Post::factory()->count(3))
            ->create();

        $stranger = User::factory()
            ->has(Post::factory()->count(2))
            ->create();

        Livewire::actingAs($user)
            ->test(ShowPosts::class)
            ->assertViewHas('posts', function ($posts) {
                return count($posts) == 3;
            });
    }
}
```

## 测试属性

Livewire 还提供了有用的测试工具，用于设置和断言组件内的属性。

组件属性通常在用户与包含 `wire:model` 的表单输入交互时在应用程序中更新。但是，由于测试通常不会在真实浏览器中键入内容，Livewire 允许你使用 `set()` 方法直接设置属性。

下面是一个使用 `set()` 更新 `CreatePost` 组件的 `$title` 属性的示例：

```php
<?php

namespace Tests\Feature\Livewire;

use App\Livewire\CreatePost;
use Livewire\Livewire;
use Tests\TestCase;

class CreatePostTest extends TestCase
{
    public function test_can_set_title()
    {
        Livewire::test(CreatePost::class)
            ->set('title', '一个连续泡澡者的自白')
            ->assertSet('title', '一个连续泡澡者的自白');
    }
}
```

### 初始化属性

通常，Livewire 组件会接收从父组件传入的数据或路由参数。由于 Livewire 组件是隔离测试的，你可以使用 `Livewire::test()` 方法的第二个参数手动向它们传递数据：

```php
<?php

namespace Tests\Feature\Livewire;

use App\Livewire\UpdatePost;
use Livewire\Livewire;
use App\Models\Post;
use Tests\TestCase;

class UpdatePostTest extends TestCase
{
    public function test_title_field_is_populated()
    {
        $post = Post::factory()->make([
            'title' => '十大泡澡炸弹',
        ]);

        Livewire::test(UpdatePost::class, ['post' => $post])
            ->assertSet('title', '十大泡澡炸弹');
    }
}
```

被测试的底层组件（`UpdatePost`）将通过其 `mount()` 方法接收 `$post`。让我们看一下 `UpdatePost` 的源码，更清楚地了解此功能：

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Post;

class UpdatePost extends Component
{
	public Post $post;

    public $title = '';

	public function mount(Post $post)
	{
		$this->post = $post;

		$this->title = $post->title;
	}

	// ...
}
```

### 设置 URL 参数

如果你的 Livewire 组件依赖于加载页面的 URL 中的特定查询参数，你可以使用 `withQueryParams()` 方法为测试手动设置查询参数。

下面是一个基本的 `SearchPosts` 组件，它使用 [Livewire 的 URL 功能](/docs/livewire/v3.x/url) 在查询字符串中存储和跟踪当前的搜索查询：

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use Livewire\Attributes\Url;
use App\Models\Post;

class SearchPosts extends Component
{
    #[Url] // [tl! highlight]
    public $search = '';

    public function render()
    {
        return view('livewire.search-posts', [
            'posts' => Post::search($this->search)->get(),
        ]);
    }
}
```

如你所见，上面的 `$search` 属性使用 Livewire 的 `#[Url]` 属性来表示其值应存储在 URL 中。

下面是如何模拟在 URL 中带有特定查询参数的页面上加载此组件的场景：

```php
<?php

namespace Tests\Feature\Livewire;

use App\Livewire\SearchPosts;
use Livewire\Livewire;
use App\Models\Post;
use Tests\TestCase;

class SearchPostsTest extends TestCase
{
    public function test_can_search_posts_via_url_query_string()
    {
        Post::factory()->create(['title' => '测试第一款防水吹风机']);
        Post::factory()->create(['title' => '真正能浮在水面的橡皮鸭']);

        Livewire::withQueryParams(['search' => '防水'])
            ->test(SearchPosts::class)
            ->assertSee('测试第一款')
            ->assertDontSee('橡皮鸭');
    }
}
```

### 设置 Cookie

如果你的 Livewire 组件依赖于 cookie，你可以使用 `withCookie()` 或 `withCookies()` 方法为测试手动设置 cookie。

下面是一个基本的 `Cart` 组件，它在 mount 时从 cookie 加载折扣令牌：

```php
<?php

namespace App\Livewire;

use Livewire\Component;
use Livewire\Attributes\Url;
use App\Models\Post;

class Cart extends Component
{
    public $discountToken;

    public mount()
    {
        $this->discountToken = request()->cookie('discountToken');
    }
}
```

如你所见，上面的 `$discountToken` 属性从请求中的 cookie 获取其值。

下面是如何模拟在带有 cookie 的页面上加载此组件的场景：

```php
<?php

namespace Tests\Feature\Livewire;

use App\Livewire\Cart;
use Livewire\Livewire;
use Tests\TestCase;

class CartTest extends TestCase
{
    public function test_can_load_discount_token_from_a_cookie()
    {
        Livewire::withCookies(['discountToken' => 'CALEB2023'])
            ->test(Cart::class)
            ->assertSet('discountToken', 'CALEB2023');
    }
}
```

## 调用动作

Livewire 动作通常使用 `wire:click` 之类的方式从前端调用。

由于 Livewire 组件测试不使用真实浏览器，你可以在测试中使用 `call()` 方法触发动作。

下面是一个使用 `call()` 方法触发 `save()` 动作的 `CreatePost` 组件示例：

```php
<?php

namespace Tests\Feature\Livewire;

use App\Livewire\CreatePost;
use Livewire\Livewire;
use App\Models\Post;
use Tests\TestCase;

class CreatePostTest extends TestCase
{
    public function test_can_create_post()
    {
        $this->assertEquals(0, Post::count());

        Livewire::test(CreatePost::class)
            ->set('title', '手指起皱？试试这个奇怪的小窍门')
            ->set('content', '...')
            ->call('save');

        $this->assertEquals(1, Post::count());
    }
}
```

在以上测试中，我们断言调用 `save()` 会在数据库中创建一篇新文章。

你也可以向 `call()` 方法传递额外的参数来向动作传递参数：

```php
->call('deletePost', $postId);
```

### 验证

要测试是否抛出了验证错误，可以使用 Livewire 的 `assertHasErrors()` 方法：

```php
<?php

namespace Tests\Feature\Livewire;

use App\Livewire\CreatePost;
use Livewire\Livewire;
use Tests\TestCase;

class CreatePostTest extends TestCase
{
    public function test_title_field_is_required()
    {
        Livewire::test(CreatePost::class)
            ->set('title', '')
            ->call('save')
            ->assertHasErrors('title');
    }
}
```

如果你想测试某个特定的验证规则是否失败，可以传递一个规则数组：

```php
$this->assertHasErrors(['title' => ['required']]);
```

或者，如果你更想断言存在某条验证消息，也可以这样做：

```php
$this->assertHasErrors(['title' => ['标题字段是必填的。']]);
```

### 授权

在你的 Livewire 组件中[验证](/docs/livewire/v3.x/properties#authorizing-the-input)依赖不可信输入的动作至关重要。Livewire 提供了 `assertUnauthorized()` 和 `assertForbidden()` 方法，以确保身份验证或授权检查失败：

```php
<?php

namespace Tests\Feature\Livewire;

use App\Livewire\UpdatePost;
use Livewire\Livewire;
use App\Models\User;
use App\Models\Post;
use Tests\TestCase;

class UpdatePostTest extends TestCase
{
    public function test_cant_update_another_users_post()
    {
        $user = User::factory()->create();
        $stranger = User::factory()->create();

        $post = Post::factory()->for($stranger)->create();

        Livewire::actingAs($user)
            ->test(UpdatePost::class, ['post' => $post])
            ->set('title', '享受薰衣草生活')
            ->call('save')
            ->assertUnauthorized();

        Livewire::actingAs($user)
            ->test(UpdatePost::class, ['post' => $post])
            ->set('title', '享受薰衣草生活')
            ->call('save')
            ->assertForbidden();
    }
}
```

如果你愿意，也可以使用 `assertStatus()` 测试组件中某个动作可能触发的明确状态码：

```php
->assertStatus(401); // 未授权
->assertStatus(403); // 禁止访问
```

### 重定向

你可以使用 `assertRedirect()` 方法测试 Livewire 动作是否执行了重定向：

```php
<?php

namespace Tests\Feature\Livewire;

use App\Livewire\CreatePost;
use Livewire\Livewire;
use Tests\TestCase;

class CreatePostTest extends TestCase
{
    public function test_redirected_to_all_posts_after_creating_a_post()
    {
        Livewire::test(CreatePost::class)
            ->set('title', '使用沐浴球不会让你变得冷漠......呃')
            ->set('content', '...')
            ->call('save')
            ->assertRedirect('/posts');
    }
}
```

作为附加的便利功能，你可以断言用户被重定向到特定的页面组件，而不是硬编码的 URL。

```php
->assertRedirect(CreatePost::class);
```

### 事件

要断言组件中已分发了一个事件，可以使用 `->assertDispatched()` 方法：

```php
<?php

namespace Tests\Feature\Livewire;

use App\Livewire\CreatePost;
use Livewire\Livewire;
use Tests\TestCase;

class CreatePostTest extends TestCase
{
    public function test_creating_a_post_dispatches_event()
    {
        Livewire::test(CreatePost::class)
            ->set('title', '百大泡泡浴品牌排行榜')
            ->set('content', '...')
            ->call('save')
            ->assertDispatched('post-created');
    }
}
```

测试两个组件通过分发和监听事件进行通信通常很有帮助。使用 `dispatch()` 方法，让我们模拟 `CreatePost` 组件分发 `create-post` 事件。然后，我们将断言监听该事件的 `PostCountBadge` 组件相应地更新了其中文章计数：

```php
<?php

namespace Tests\Feature\Livewire;

use App\Livewire\PostCountBadge;
use App\Livewire\CreatePost;
use Livewire\Livewire;
use Tests\TestCase;

class PostCountBadgeTest extends TestCase
{
    public function test_post_count_is_updated_when_event_is_dispatched()
    {
        $badge = Livewire::test(PostCountBadge::class)
            ->assertSee("0");

        Livewire::test(CreatePost::class)
            ->set('title', '无泪配方：史上最大的谎言')
            ->set('content', '...')
            ->call('save')
            ->assertDispatched('post-created');

        $badge->dispatch('post-created')
            ->assertSee("1");
    }
}
```

有时断言事件携带一个或多个参数会很有用。让我们看一个名为 `ShowPosts` 的组件，它分发一个名为 `banner-message` 的事件，其中带有一个名为 `message` 的参数：

```php
<?php

namespace Tests\Feature\Livewire;

use App\Livewire\ShowPosts;
use Livewire\Livewire;
use Tests\TestCase;

class ShowPostsTest extends TestCase
{
    public function test_notification_is_dispatched_when_deleting_a_post()
    {
        Livewire::test(ShowPosts::class)
            ->call('delete', postId: 3)
            ->assertDispatched('notify',
                message: '文章已删除',
            );
    }
}
```

如果你的组件分发了某个事件，其参数值需要条件性断言，你可以传递一个闭包作为 `assertDispatched` 方法的第二个参数，如下所示。它接收事件名作为第一个参数，包含参数的数组作为第二个参数。确保闭包返回布尔值。

```php
<?php

namespace Tests\Feature\Livewire;

use App\Livewire\ShowPosts;
use Livewire\Livewire;
use Tests\TestCase;

class ShowPostsTest extends TestCase
{
    public function test_notification_is_dispatched_when_deleting_a_post()
    {
        Livewire::test(ShowPosts::class)
            ->call('delete', postId: 3)
            ->assertDispatched('notify', function($eventName, $params) {
                return ($params['message'] ?? '') === '文章已删除';
            })
    }
}
```

## 所有可用的测试工具

Livewire 提供了更多测试工具。以下是所有可用的测试方法的完整列表，并附有简要说明：

### 设置方法
| 方法 | 说明 |
|------|------|
| `Livewire::test(CreatePost::class)` | 测试 `CreatePost` 组件 |
| `Livewire::test(UpdatePost::class, ['post' => $post])` | 使用 `post` 参数测试 `UpdatePost` 组件（通过 `mount()` 方法接收） |
| `Livewire::actingAs($user)` | 将提供的用户设置为会话的已认证用户 |
| `Livewire::withQueryParams(['search' => '...'])` | 将测试的 `search` URL 查询参数设置为提供的值（例如 `?search=...`）。通常用于使用 Livewire 的 [`#[Url]` 属性](/docs/livewire/v3.x/url) 的场景 |
| `Livewire::withCookie('color', 'blue')` | 将测试的 `color` cookie 设置为提供的值（`blue`） |
| `Livewire::withCookies(['color' => 'blue', 'name' => 'Taylor'])` | 将测试的 `color` 和 `name` cookie 设置为提供的值（`blue`、`Taylor`） |
| `Livewire::withHeaders(['X-COLOR' => 'blue', 'X-NAME' => 'Taylor'])` | 将测试的 `X-COLOR` 和 `X-NAME` 标头设置为提供的值（`blue`、`Taylor`） |
| `Livewire::withoutLazyLoading()` | 在测试中及其所有子组件中禁用延迟加载 |

### 与组件交互
| 方法 | 说明 |
|------|------|
| `set('title', '...')` | 将 `title` 属性设置为提供的值 |
| `set(['title' => '...', ...])` | 使用关联数组设置多个组件属性 |
| `toggle('sortAsc')` | 在 `true` 和 `false` 之间切换 `sortAsc` 属性 |
| `call('save')` | 调用 `save` 动作/方法 |
| `call('remove', $post->id)` | 调用 `remove` 方法并传递 `$post->id` 作为第一个参数（也接受后续参数） |
| `refresh()` | 触发组件重新渲染 |
| `dispatch('post-created')` | 从组件分发 `post-created` 事件 |
| `dispatch('post-created', postId: $post->id)` | 使用 `$post->id` 作为附加参数分发 `post-created` 事件（Alpine 中的 `$event.detail`） |

### 断言
| 方法 | 说明 |
|------|------|
| `assertSet('title', '...')` | 断言 `title` 属性设置为提供的值 |
| `assertNotSet('title', '...')` | 断言 `title` 属性未设置为提供的值 |
| `assertSetStrict('title', '...')` | 使用严格比较断言 `title` 属性设置为提供的值 |
| `assertNotSetStrict('title', '...')` | 使用严格比较断言 `title` 属性未设置为提供的值 |
| `assertReturned('...')` | 断言之前的 `->call(...)` 返回了给定的值 |
| `assertCount('posts', 3)` | 断言 `posts` 属性是一个类数组值，其中有 `3` 项 |
| `assertSnapshotSet('date', '08/26/1990')` | 断言 `date` 属性的原始/脱水值（来自 JSON）设置为 `08/26/1990`。在 `date` 的情况下，替代断言水合的 `DateTime` 实例 |
| `assertSnapshotNotSet('date', '08/26/1990')` | 断言 `date` 的原始/脱水值不等于提供的值 |
| `assertSee($post->title)` | 断言组件的渲染 HTML 包含提供的值 |
| `assertDontSee($post->title)` | 断言渲染的 HTML 不包含提供的值 |
| `assertSeeHtml('<div>...</div>')` | 断言提供的字符串字面量包含在渲染的 HTML 中，不转义 HTML 字符（与 `assertSee` 不同，后者默认转义提供的字符） |
| `assertDontSeeHtml('<div>...</div>')` | 断言提供的字符串不包含在渲染的 HTML 中 |
| `assertSeeText($post->title)` | 断言提供的字符串包含在渲染的 HTML 文本中。渲染内容将在断言前传递给 PHP 的 `strip_tags` 函数 |
| `assertDontSeeText($post->title)` | 断言提供的字符串不包含在渲染的 HTML 文本中。渲染内容将在断言前传递给 PHP 的 `strip_tags` 函数 |
| `assertSeeInOrder(['...', '...'])` | 断言提供的字符串按顺序出现在组件的渲染 HTML 输出中 |
| `assertSeeHtmlInOrder([$firstString, $secondString])` | 断言提供的 HTML 字符串按顺序出现在组件的渲染输出中 |
| `assertDispatched('post-created')` | 断言组件已分发给定的事件 |
| `assertNotDispatched('post-created')` | 断言组件未分发给定的事件 |
| `assertHasErrors('title')` | 断言 `title` 属性验证失败 |
| `assertHasErrors(['title' => ['required', 'min:6']])` | 断言 `title` 属性的指定验证规则失败 |
| `assertHasNoErrors('title')` | 断言 `title` 属性没有验证错误 |
| `assertHasNoErrors(['title' => ['required', 'min:6']])` | 断言 `title` 属性的指定验证规则未失败 |
| `assertRedirect()` | 断言已从组件内部触发重定向 |
| `assertRedirect('/posts')` | 断言组件触发了到 `/posts` 端点的重定向 |
| `assertRedirect(ShowPosts::class)` | 断言组件触发了到 `ShowPosts` 组件的重定向 |
| `assertRedirectToRoute('name', ['parameters'])` | 断言组件触发了到指定路由的重定向 |
| `assertNoRedirect()` | 断言未触发重定向 |
| `assertViewHas('posts')` | 断言 `render()` 方法已将 `posts` 项传递给视图数据 |
| `assertViewHas('postCount', 3)` | 断言 `postCount` 变量已传递给视图，且值为 `3` |
| `assertViewHas('posts', function ($posts) { ... })` | 断言 `posts` 视图数据存在，并且通过了提供的回调中的断言 |
| `assertViewIs('livewire.show-posts')` | 断言组件的 render 方法返回了提供的视图名称 |
| `assertFileDownloaded()` | 断言已触发文件下载 |
| `assertFileDownloaded($filename)` | 断言已触发与提供的文件名匹配的文件下载 |
| `assertNoFileDownloaded()` | 断言未触发文件下载 |
| `assertUnauthorized()` | 断言组件内抛出了授权异常（状态码：401） |
| `assertForbidden()` | 断言触发了状态码为 403 的错误响应 |
| `assertStatus(500)` | 断言最新响应与提供的状态码匹配 |
