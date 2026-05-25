---
title: 升级指南
source: https://github.com/livewire/livewire/blob/v3.8.0/docs/upgrading.md
source_version: v3.8.0
translation_status: draft
---

## 自动升级工具

为了节省你的升级时间，我们提供了一个 Artisan 命令来自动完成尽可能多的升级步骤。

安装 Livewire 3 后，运行以下命令，你将看到自动升级每个破坏性变更的交互提示：

```shell
php artisan livewire:upgrade
```

尽管上面的命令可以升级大部分应用，但要确保完整升级，仍需按照本页的分步指南操作。

:::tip[雇佣我们为你升级应用]
如果你有一个大型 Livewire 应用，或者只是不想处理从版本 2 到版本 3 的升级，你可以雇佣我们为你处理。[在此了解我们的升级服务](https://livewire.laravel.com/jumpstart)。
:::

## 升级 PHP 版本

Livewire 现在要求你的应用运行在 PHP 8.1 或更高版本上。

## 将 Livewire 更新到版本 3

运行以下 Composer 命令，将应用的 Livewire 依赖从版本 2 升级到 3：

```shell
composer require livewire/livewire "^3.0"
```

:::warning[Livewire 3 包兼容性]
大多数主要的第三方 Livewire 包要么已经支持 Livewire 3，要么正在努力支持。不过，不可避免地会有一些包需要更长时间才能发布对 Livewire 3 的支持。
:::

## 清除视图缓存

在应用根目录运行以下 Artisan 命令，清除所有已缓存/编译的 Blade 视图，强制 Livewire 重新编译为兼容 Livewire 3 的版本：

```shell
php artisan view:clear
```

## 合并新配置

Livewire 3 更改了多个配置选项。如果你的应用有已发布的配置文件（`config/livewire.php`），你需要根据以下变更进行更新。

### 新增配置

以下配置键是在版本 3 中新增的：

```php
'legacy_model_binding' => false,

'inject_assets' => true,

'inject_morph_markers' => true,

'navigate' => false,

'pagination_theme' => 'tailwind',
```

你可以参考 [Livewire 在 GitHub 上的新配置文件](https://github.com/livewire/livewire/blob/master/config/livewire.php) 获取更多选项说明和可复制粘贴的代码。

### 变更的配置

以下配置项已更新为新的默认值：

#### 新的类命名空间

Livewire 的默认 `class_namespace` 已从 `App\Http\Livewire` 改为 `App\Livewire`。你可以保留旧的命名空间配置值；但是，如果你选择将配置更新为新命名空间，则必须将 Livewire 组件移动到 `app/Livewire`：

```php
'class_namespace' => 'App\\Http\\Livewire', // [tl! remove]
'class_namespace' => 'App\\Livewire', // [tl! add]
```

#### 新的布局视图路径

在版本 2 中渲染全页组件时，Livewire 使用 `resources/views/layouts/app.blade.php` 作为默认布局 Blade 组件。

由于社区越来越偏好匿名 Blade 组件，Livewire 3 已将默认路径更改为：`resources/views/components/layouts/app.blade.php`。

```php
'layout' => 'layouts.app', // [tl! remove]
'layout' => 'components.layouts.app', // [tl! add]
```

### 移除的配置

Livewire 不再识别以下配置项。

#### `app_url`

如果你的应用在非根 URI 下提供服务，在 Livewire 2 中你可以使用 `app_url` 配置选项来设置 Livewire 发送 AJAX 请求所用的 URL。

我们发现字符串配置方式过于僵化。因此，Livewire 3 改为使用运行时配置。你可以参考关于[配置 Livewire 更新端点](/docs/livewire/v3.x/installation)的文档了解更多信息。

#### `asset_url`

在 Livewire 2 中，如果你的应用在非根 URI 下提供服务，你需要使用 `asset_url` 配置选项来设置 Livewire 提供 JavaScript 资源所用的基础 URL。

Livewire 3 改为采用运行时配置策略。你可以参考关于[自定义 Livewire 脚本资源端点](/docs/livewire/v3.x/installation)的文档了解更多信息。

#### `middleware_group`

由于 Livewire 现在提供了更灵活的自定义更新端点方式，`middleware_group` 配置选项已被移除。

你可以参考关于[自定义 Livewire 更新端点](/docs/livewire/v3.x/installation)的文档，了解如何为 Livewire 请求应用自定义中间件。

#### `manifest_path`

Livewire 3 不再使用清单文件进行组件自动加载。因此，`manifest_path` 配置不再需要。

#### `back_button_cache`

由于 Livewire 3 现在通过 `wire:navigate` 提供了 [SPA 体验](/docs/livewire/v3.x/navigate)，`back_button_cache` 配置不再需要。

## Livewire 应用命名空间

在版本 2 中，Livewire 组件在 `App\Http\Livewire` 命名空间下自动生成和识别。

Livewire 3 已将默认值改为：`App\Livewire`。

你可以将所有组件移动到新位置，或者在应用的 `config/livewire.php` 配置文件中添加以下配置：

```php
'class_namespace' => 'App\\Http\\Livewire',
```

### 发现机制

在 Livewire 3 中，不再有清单文件，因此也就不再需要"发现"Livewire 组件。你可以安全地从构建脚本中移除所有 `livewire:discover` 引用。

## 页面组件布局视图

当使用类似以下语法将 Livewire 组件作为全页渲染时：

```php
Route::get('/posts', ShowPosts::class);
```

Livewire 用来渲染组件的 Blade 布局文件已从 `resources/views/layouts/app.blade.php` 改为 `resources/views/components/layouts/app.blade.php`：

```shell
resources/views/layouts/app.blade.php #[tl! remove]
resources/views/components/layouts/app.blade.php #[tl! add]
```

你可以将布局文件移动到新位置，或者在应用的 `config/livewire.php` 配置文件中应用以下配置：

```php
'layout' => 'layouts.app',
```

更多信息请查阅关于[创建和使用页面组件布局](/docs/livewire/v3.x/components)的文档。

## Eloquent 模型绑定

Livewire 2 支持直接将 `wire:model` 绑定到 Eloquent 模型属性。例如，以下是一个常见模式：

```php
public Post $post;

protected $rules = [
    'post.title' => 'required',
    'post.description' => 'required',
];
```

```html
<input wire:model="post.title">
<input wire:model="post.description">
```

在 Livewire 3 中，直接绑定到 Eloquent 模型已被禁用，建议改用单独的属性或提取[表单对象](https://livewire.laravel.com/docs/3.x/forms#extracting-a-form-object)。

不过，由于此行为在 Livewire 应用中广泛使用，版本 3 通过 `config/livewire.php` 中的配置项保留了对此行为的支持：

```php
'legacy_model_binding' => true,
```

将 `legacy_model_binding` 设置为 `true` 后，Livewire 将以与版本 2 完全相同的方式处理 Eloquent 模型属性。

## AlpineJS

Livewire 3 默认集成了 [AlpineJS](https://alpinejs.dev)。

如果你在 Livewire 应用中手动引入了 Alpine，你需要将其移除，以免与 Livewire 内置版本冲突。

### 通过 script 标签引入 Alpine

如果你通过类似下面的 script 标签将 Alpine 引入到应用中，你可以完全移除它，Livewire 将加载其内部版本：

```html
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script> <!-- [tl! remove] -->
```

### 通过 script 标签引入插件

Livewire 3 现在默认内置了以下 Alpine 插件：

* [Anchor](https://alpinejs.dev/plugins/anchor)
* [Collapse](https://alpinejs.dev/plugins/collapse)
* [Focus](https://alpinejs.dev/plugins/focus)
* [Intersect](https://alpinejs.dev/plugins/intersect)
* [Mask](https://alpinejs.dev/plugins/mask)
* [Morph](https://alpinejs.dev/plugins/morph)
* [Persist](https://alpinejs.dev/plugins/persist)

建议关注 [package.json](https://github.com/livewire/livewire/blob/main/package.json) 文件的变更，因为可能会新增 Alpine 插件！

如果你之前通过 `<script>` 标签引入了上述任何插件，应将其与 Alpine 核心一起移除：

```html
<script defer src="https://cdn.jsdelivr.net/npm/@alpinejs/intersect@3.x.x/dist/cdn.min.js"></script> <!-- [tl! remove:1] -->
<!-- ... -->
```

### 通过 script 标签访问 Alpine 全局对象

如果你目前通过 script 标签访问 `Alpine` 全局对象，如下所示：

```html
<script>
    document.addEventListener('alpine:init', () => {
        Alpine.data(...)
    })
</script>
```

你可以继续这样做，因为 Livewire 内部仍然像以前一样包含并注册了 Alpine 的全局对象。

### 通过 JS 打包引入

如果你通过 NPM 在应用的 JavaScript 包中引入了 Alpine 或上述常用的核心 Alpine 插件，如下所示：

```js
// Warning: this is a snippet of the Livewire 2 approach to including Alpine

import Alpine from 'alpinejs'
import intersect from '@alpinejs/intersect'

Alpine.plugin(intersect)

Alpine.start()
```

你可以完全移除它们，因为 Livewire 默认包含了 Alpine 和许多常用的 Alpine 插件。

#### 通过 JS 包访问 Alpine

如果你在应用的 JavaScript 包中注册自定义 Alpine 插件或组件，如下所示：

```js
// Warning: this is a snippet of the Livewire 2 approach to including Alpine

import Alpine from 'alpinejs'
import customPlugin from './plugins/custom-plugin'

Alpine.plugin(customPlugin)

Alpine.start()
```

你仍然可以通过导入 Livewire 核心 ESM 模块并从其中获取 `Alpine` 来实现这一点。

要将 Livewire 导入到你的包中，首先必须禁用 Livewire 正常的 JavaScript 注入，并在应用的主布局中将 `@livewireScripts` 替换为 `@livewireScriptConfig` 来提供必要的配置：

```blade
    <!-- ... -->

    @livewireScripts <!-- [tl! remove] -->
    @livewireScriptConfig <!-- [tl! add] -->
</body>
```

现在，你可以像这样将 `Alpine` 和 `Livewire` 导入到应用的包中：

```js
import { Livewire, Alpine } from '../../vendor/livewire/livewire/dist/livewire.esm';
import customPlugin from './plugins/custom-plugin'

Alpine.plugin(customPlugin)

Livewire.start()
```

注意你不再需要调用 `Alpine.start()`。Livewire 会自动启动 Alpine。

更多信息请查阅关于[手动编译 Livewire 的 JavaScript](/docs/livewire/v3.x/installation)的文档。

## `wire:model`

在 Livewire 3 中，`wire:model` 默认是"延迟"的（相当于原来 `wire:model.defer` 的行为）。要保持 Livewire 2 中 `wire:model` 的效果，你必须使用 `wire:model.live`。

以下是你需要在模板中进行替换以保持应用行为一致的清单：

```html
<input wire:model="..."> <!-- [tl! remove] -->
<input wire:model.live="..."> <!-- [tl! add] -->

<input wire:model.defer="..."> <!-- [tl! remove] -->
<input wire:model="..."> <!-- [tl! add] -->

<input wire:model.lazy="..."> <!-- [tl! remove] -->
<input wire:model.blur="..."> <!-- [tl! add] -->
```

## `@entangle`

与 `wire:model` 的变更类似，Livewire 3 默认延迟所有数据绑定。为了匹配这一行为，`@entangle` 也进行了相应更新。

要保持应用按预期运行，请进行以下 `@entangle` 替换：

```blade
@entangle(...) <!-- [tl! remove] -->
@entangle(...).live <!-- [tl! add] -->

@entangle(...).defer <!-- [tl! remove] -->
@entangle(...) <!-- [tl! add] -->
```

## 事件

在 Livewire 2 中，Livewire 有两种不同的触发事件的 PHP 方法：

* `emit()`
* `dispatchBrowserEvent()`

Livewire 3 将这两种方法统一为一种方法：

* `dispatch()`

以下是在 Livewire 3 中分发和监听事件的基本示例：

```php
// Dispatching...
class CreatePost extends Component
{
    public Post $post;

    public function save()
    {
        $this->dispatch('post-created', postId: $this->post->id);
    }
}

// Listening...
class Dashboard extends Component
{
    #[On('post-created')]
    public function postAdded($postId)
    {
        //
    }
}
```

与 Livewire 2 相比，主要有三个变化：

1. `emit()` 已重命名为 `dispatch()`（同样，`emitTo()` 和 `emitSelf()` 现在是 `dispatch()->to()` 和 `dispatch()->self()`）
2. `dispatchBrowserEvent()` 已重命名为 `dispatch()`
3. 所有事件参数必须是命名参数

更多信息请查阅新的[事件文档页面](https://livewire.laravel.com/docs/3.x/events)。

以下是应在应用中执行的"查找和替换"差异：

```php
$this->emit('post-created'); // [tl! remove]
$this->dispatch('post-created'); // [tl! add]

$this->emitTo('foo', 'post-created'); // [tl! remove]
$this->dispatch('post-created')->to('foo'); // [tl! add]

$this->emitSelf('post-created'); // [tl! remove]
$this->dispatch('post-created')->self(); // [tl! add]

$this->emit('post-created', $post->id); // [tl! remove]
$this->dispatch('post-created', postId: $post->id); // [tl! add]

$this->dispatchBrowserEvent('post-created'); // [tl! remove]
$this->dispatch('post-created'); // [tl! add]

$this->dispatchBrowserEvent('post-created', ['postId' => $post->id]); // [tl! remove]
$this->dispatch('post-created', postId: $post->id); // [tl! add]
```

```html
<button wire:click="$emit('post-created')">...</button> <!-- [tl! remove] -->
<button wire:click="$dispatch('post-created')">...</button> <!-- [tl! add] -->

<button wire:click="$emit('post-created', 1)">...</button> <!-- [tl! remove] -->
<button wire:click="$dispatch('post-created', { postId: 1 })">...</button> <!-- [tl! add] -->

<button wire:click="$emitTo('foo', post-created', 1)">...</button> <!-- [tl! remove] -->
<button wire:click="$dispatch('post-created', { postId: 1 })->to('foo')">...</button> <!-- [tl! add] -->

<button x-on:click="$wire.emit('post-created', 1)">...</button> <!-- [tl! remove] -->
<button x-on:click="$dispatch('post-created', { postId: 1 })">...</button> <!-- [tl! add] -->
```

### `emitUp()`

`emitUp` 的概念已被完全移除。事件现在使用浏览器事件进行分发，因此默认会"冒泡"。

你可以从组件中移除所有 `$this->emitUp(...)` 或 `$emitUp(...)` 的实例。

### 测试事件

Livewire 还更新了事件断言，以匹配关于分发事件的新统一术语：

```php
Livewire::test(Component::class)->assertEmitted('post-created'); // [tl! remove]
Livewire::test(Component::class)->assertDispatched('post-created'); // [tl! add]

Livewire::test(Component::class)->assertEmittedTo(Foo::class, 'post-created'); // [tl! remove]
Livewire::test(Component::class)->assertDispatchedTo(Foo:class, 'post-created'); // [tl! add]

Livewire::test(Component::class)->assertNotEmitted('post-created'); // [tl! remove]
Livewire::test(Component::class)->assertNotDispatched('post-created'); // [tl! add]

Livewire::test(Component::class)->assertEmittedUp() // [tl! remove]
```

### URL 查询字符串

在之前的 Livewire 版本中，如果你将属性绑定到 URL 的查询字符串，除非使用 `except` 选项，否则属性值总是会出现在查询字符串中。

在 Livewire 3 中，所有绑定到查询字符串的属性只有在页面加载后其值发生变化时才会显示。这个默认行为减少了对 `except` 选项的需求：

```php
public $search = '';

protected $queryString = [
    'search' => ['except' => ''], // [tl! remove]
    'search', // [tl! add]
];
```

如果你希望恢复到 Livewire 2 的行为——无论属性值如何始终显示在查询字符串中——可以使用 `keep` 选项：

```php
public $search = '';

protected $queryString = [
    'search' => ['keep' => true], // [tl! highlight]
];
```

## 分页

Livewire 3 中的分页系统已更新，以更好地支持同一组件内的多个分页器。

### 更新已发布的分页视图

如果你已发布 Livewire 的分页视图，可以参考 [GitHub 上的新分页目录](https://github.com/livewire/livewire/tree/master/src/Features/SupportPagination/views)并相应地更新你的应用。

### 直接访问 `$this->page`

由于 Livewire 现在支持每个组件多个分页器，已从组件类中移除了 `$page` 属性，改为使用 `$paginators` 属性来存储分页器数组：

```php
$this->page = 2; // [tl! remove]
$this->paginators['page'] = 2; // [tl! add]
```

不过，建议使用提供的 `getPage` 和 `setPage` 方法来修改和访问当前页：

```php
// Getter...
$this->getPage();

// Setter...
$this->setPage(2);
```

### `wire:click.prefetch`

Livewire 的预取功能（`wire:click.prefetch`）已被完全移除。如果你依赖此功能，你的应用仍然可以工作，只是之前受益于 `.prefetch` 的场景下性能会略有下降。

```html
<button wire:click.prefetch=""> <!-- [tl! remove] -->
<button wire:click="..."> <!-- [tl! add] -->
```

## 组件类变更

以下是对 Livewire 基础 `Livewire\Component` 类的变更，你的应用组件可能曾依赖这些行为。

### 组件 `$id` 属性

如果你通过 `$this->id` 直接访问组件 ID，应改用 `$this->getId()`：

```php
$this->id; // [tl! remove]

$this->getId(); // [tl! add]
```

### 重复的方法和属性名称

PHP 允许你为类属性和方法使用相同的名称。在 Livewire 3 中，这会导致从前端通过 `wire:click` 调用方法时出现问题。

强烈建议你在组件中对所有公共方法和属性使用不同的名称：

```php
public $search = ''; // [tl! remove]

public function search() {
    // ...
}
```

```php
public $query = ''; // [tl! add]

public function search() {
    // ...
}
```

## JavaScript API 变更

### `livewire:load`

在之前的 Livewire 版本中，你可以监听 `livewire:load` 事件，在 Livewire 初始化页面之前立即执行 JavaScript 代码。

在 Livewire 3 中，该事件名称已改为 `livewire:init`，以匹配 Alpine 的 `alpine:init`：

```js
document.addEventListener('livewire:load', () => {...}) // [tl! remove]
document.addEventListener('livewire:init', () => {...}) // [tl! add]
```

### 页面过期钩子

在版本 2 中，Livewire 提供了一个专用的 JavaScript 方法来自定义页面过期行为：`Livewire.onPageExpired()`。该方法已被移除，建议改用更强大的 `request` 钩子：

```js
Livewire.onPageExpired(() => {...}) // [tl! remove]

Livewire.hook('request', ({ fail }) => { // [tl! add:8]
    fail(({ status, preventDefault }) => {
        if (status === 419) {
            preventDefault()

            confirm('Your custom page expiration behavior...')
        }
    })
})
```

### 新的生命周期钩子

Livewire 的许多内部 JavaScript 生命周期钩子在 Livewire 3 中已发生变更。

以下是在你的应用中需要查找和替换的旧钩子与新语法对比：

```js
Livewire.hook('component.initialized', (component) => {}) // [tl! remove]
Livewire.hook('component.init', ({ component, cleanup }) => {}) // [tl! add]

Livewire.hook('element.initialized', (el, component) => {}) // [tl! remove]
Livewire.hook('element.init', ({ el, component }) => {}) // [tl! add]

Livewire.hook('element.updating', (fromEl, toEl, component) => {}) // [tl! remove]
Livewire.hook('morph.updating', ({ el, toEl, component }) => {}) // [tl! add]

Livewire.hook('element.updated', (el, component) => {}) // [tl! remove]
Livewire.hook('morph.updated', ({ el, component }) => {}) // [tl! add]

Livewire.hook('element.removed', (el, component) => {}) // [tl! remove]
Livewire.hook('morph.removed', ({ el, component }) => {}) // [tl! add]

Livewire.hook('message.sent', (message, component) => {}) // [tl! remove]
Livewire.hook('message.failed', (message, component) => {}) // [tl! remove]
Livewire.hook('message.received', (message, component) => {}) // [tl! remove]
Livewire.hook('message.processed', (message, component) => {}) // [tl! remove]

Livewire.hook('commit', ({ component, commit, respond, succeed, fail }) => { // [tl! add:14]
    // Equivalent of 'message.sent'

    succeed(({ snapshot, effects }) => {
        // Equivalent of 'message.received'

        queueMicrotask(() => {
            // Equivalent of 'message.processed'
        })
    })

    fail(() => {
        // Equivalent of 'message.failed'
    })
})
```

你可以查阅新的 [JavaScript 钩子文档](https://livewire.laravel.com/docs/3.x/javascript)以更全面地了解新的钩子系统。

## 本地化

如果你的应用在 URI 中使用语言前缀，例如 `https://example.com/en/...`，Livewire 2 会在通过 `https://example.com/en/livewire/update` 进行组件更新时自动保留此 URL 前缀。

Livewire 3 已不再自动支持此行为。你可以使用 `setUpdateRoute()` 覆盖 Livewire 的更新端点，添加你需要的任何 URI 前缀：

```php
Route::group(['prefix' => LaravelLocalization::setLocale()], function ()
{
    // Your other localized routes...

    Livewire::setUpdateRoute(function ($handle) {
        return Route::post('/livewire/update', $handle);
    });
});
```

更多信息请查阅关于[配置 Livewire 更新端点](/docs/livewire/v3.x/installation)的文档。
